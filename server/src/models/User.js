const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))

function hashPassword (user) {
    const SALT_FACTOR = 8
    
    if (!user.changed('password')) {
        return ;
    }
    return bcrypt
        .genSaltAsync(SALT_FACTOR)
        .then(salt => bcrypt.hashAsync(user.password, salt, null))
        .then(hash => {
            user.setDataValue('password', hash)
        })
}

module.exports = (sequelize, DataType) => {
    const User = sequelize.define('User', {
        name: DataType.STRING,
        password: DataType.STRING,
        // TODO: isAdmin 대신 Admin table을 만들어서 관리하면 스토리지 및 검색 속도도 빠를 듯.
        // isAdmin으로 하니 구조적으로 하나의 시장에 대해서 다수가 관리자가 될 수 있는 상황이 발생함.
        isAdmin: DataType.BOOLEAN
    }, 
    {
        hooks: {
            beforeCreate: hashPassword,
            beforeUpdate: hashPassword,
            // beforeSave: hashPassword,
        },
        indexes: [
          {
            unique: true,
            fields: ['name', 'MarketId']
          }
        ],
        timestamps: false
    })
    User.prototype.comparePassword = function (password) {
        return bcrypt.compareAsync(password, this.password)
    }
    return User
}
