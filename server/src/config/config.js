const path = require('path')

module.exports = {
    port: process.env.PORT || 8081,
    db: {
        database: process.env.DB_NAME || 'qr-pay',
        user: process.env.DB_USER || 'qr-pay',
        password: process.env.DB_PASS || 'qr-pay',
        options: {
            dialect: process.env.DIALECT || 'sqlite',
            host: process.env.HOST || 'localhost',
            storage: path.resolve(__dirname, '../../qr-pay.sqlite')
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'nXIVymkShc3QZZ9SF5MLbFO4r2a6Gnua1F03i5XAHXmBdoqEbA2VtT6r1np1aV3'
    }
}