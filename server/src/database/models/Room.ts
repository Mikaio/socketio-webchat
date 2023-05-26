import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Sequelize, ForeignKey } from 'sequelize';
import connection from '../connection';
import User from './User';

class Room extends Model<InferAttributes<Room>, InferCreationAttributes<Room>> {
    declare id: CreationOptional<number>;
    declare name: string;

    declare userId: ForeignKey<User["id"]>;
 
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}


Room.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
    },
    userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: "user",
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "NO ACTION",
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize: connection,
    tableName: "room",
});

export default Room;
