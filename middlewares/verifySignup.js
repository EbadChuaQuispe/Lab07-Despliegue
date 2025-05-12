// Importamos el objeto "db" que contiene los modelos y constantes definidos en la aplicación
import db from "../models/index.js";

// Extraemos la constante ROLES y el modelo User del objeto db
const { ROLES, user: User } = db;

// Middleware para verificar si el nombre de usuario o el correo electrónico ya están en uso
export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // 🔍 Verifica qué datos están llegando desde Postman
    console.log("📦 Body recibido en middleware:", req.body);

    // Buscar usuario por nombre de usuario
    const userByUsername = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (userByUsername) {
      return res.status(400).json({
        message: "¡El nombre de usuario ya está en uso!"
      });
    }

    // Buscar usuario por correo electrónico
    const userByEmail = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (userByEmail) {
      return res.status(400).json({
        message: "¡El correo electrónico ya está en uso!"
      });
    }

    // Si no hay duplicados, continuar
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware para verificar si los roles proporcionados existen en la lista de roles permitidos
export const checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        return res.status(400).json({
          message: `El rol ${req.body.roles[i]} no existe!`
        });
      }
    }
  }
  next();
};
