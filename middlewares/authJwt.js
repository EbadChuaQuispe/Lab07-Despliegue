// Importamos el módulo "jsonwebtoken" para trabajar con JWT
import jwt from "jsonwebtoken";

// Importamos los modelos y constantes definidos en la aplicación
import db from "../models/index.js";

// Importamos la configuración de autenticación (clave secreta)
import authConfig from "../config/auth.config.js";

// Extraemos los modelos "User" y "Role" del objeto "db"
const { user: User, role: Role } = db;

// Middleware para verificar la validez del token JWT en las solicitudes
export const verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "¡No se proporcionó un token!" });
  }

  try {
    if (token.startsWith("Bearer ")) {
      token = token.replace("Bearer ", "");
    }

    const decoded = jwt.verify(token, authConfig.secret);
    req.userId = decoded.id;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(401).json({ message: "¡No autorizado!" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "¡No autorizado!" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    const adminRole = roles.find((role) => role.name === "admin");

    if (adminRole) {
      return next();
    }

    return res.status(403).json({ message: "¡Se requiere el rol de administrador!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    const modRole = roles.find((role) => role.name === "moderator");

    if (modRole) {
      return next();
    }

    return res.status(403).json({ message: "¡Se requiere el rol de moderador!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ✅ Aquí renombramos la función para coincidir con el import que usas en las rutas
export const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();
    const hasRole = roles.some((role) => ["admin", "moderator"].includes(role.name));

    if (hasRole) {
      return next();
    }

    return res.status(403).json({ message: "¡Se requiere el rol de moderador o administrador!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
