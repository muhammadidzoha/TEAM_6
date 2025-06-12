const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost', //perlu dirubah klo mau ganti dari mysql ke local
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', //kalo pake local password diilangin
  database: process.env.DB_NAME || 'eai_project',
});

const PaymentHistory = require('./paymentHistory')(sequelize);

module.exports = {
  sequelize,
  PaymentHistory
}; 