module.exports = (sequelize, DataType) => {
  const Market = sequelize.define('Market', {
      title: DataType.STRING
  })
  return Market
}
