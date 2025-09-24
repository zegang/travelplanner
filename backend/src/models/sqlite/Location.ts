import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/orm/sqlite/database';

// Define Location attributes for creation and retrieval
interface LocationAttributes {
  id: number; // Required for existing records
  name: string;
  date: string;
  description: string;
  image: string;
}

// Location creation only needs name, date, description, and image
interface LocationCreationAttributes extends Optional<LocationAttributes, 'id'> {}

class Location extends Model<LocationAttributes, LocationCreationAttributes> implements LocationAttributes {
  public id!: number;
  public name!: string;
  public date!: string;
  public description!: string;
  public image!: string;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,  // Auto-increment id field
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Location',
  }
);

export default Location;
