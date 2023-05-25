import { Dialect } from 'sequelize'

const database = {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'somesockets',
    dialect: 'mysql' as Dialect,
    logging: false,
    charset: 'utf8',
    // timezone: ,,
    dialectOptions: {
        bigNumberStrings: true,
    },
    define: {
        timestamps: true,
        underscored: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
};

export default database;