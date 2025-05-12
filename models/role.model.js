// app/models/role.model.js
export default (sequelize, Sequelize) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false, // Asegura que el nombre del rol sea obligatorio
    },
  });

  return Role;
};
