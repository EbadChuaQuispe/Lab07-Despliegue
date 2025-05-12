export default  {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "",           // Asegúrate de poner tu contraseña real si aplica
    DB: "db",               // Cambia "db" por el nombre de tu base de datos
    PORT: 3306,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  