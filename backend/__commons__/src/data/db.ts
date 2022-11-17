import { Sequelize } from 'sequelize'

const connectionString = process.env.DATABASE_URL!
const logging = process.env.SQL_LOG ? true : false

const sequelize = new Sequelize(connectionString, {
  dialect: 'mysql',
  logging: logging
})

export default sequelize