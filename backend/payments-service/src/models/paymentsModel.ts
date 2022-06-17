import sequelize, { Model, Optional } from 'sequelize'
import database from 'commons/data/db'
import { IPayments } from './payments'

interface IPaymentsCreationAttributes extends Optional<IPayments, 'id'>{}

export interface IPaymentsModel extends Model<IPayments, IPaymentsCreationAttributes>, IPayments {}

const Payments = database.define<IPaymentsModel>('payment', {
    id: {
        type: sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    accountId: {
        type: sequelize.INTEGER.UNSIGNED,
        allowNull: false,
    },
    status: {
        type: sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 3
    }
})

Payments.sync();

export default Payments;