module.exports = (sequelize, DataType) => {
  const Transaction = sequelize.define('Transaction', {
      goods: DataType.STRING,
      amount: DataType.INTEGER
  })
  return Transaction
}
