// lib/db.js
import mysql from "mysql2/promise"

export const dbRekonsiliasi = mysql.createPool({
  host: process.env.DB_HOST_REKONSILIASI,
  port: parseInt(process.env.DB_PORT_REKONSILIASI || "3306"),
  user: process.env.DB_USER_REKONSILIASI,
  password: process.env.DB_PASSWORD_REKONSILIASI,
  database: process.env.DB_NAME_REKONSILIASI,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const dbKediri = mysql.createPool({
  host: process.env.DB_HOST_KEDIRI,
  port: parseInt(process.env.DB_PORT_KEDIRI || "3306"),
  user: process.env.DB_USER_KEDIRI,
  password: process.env.DB_PASSWORD_KEDIRI,
  database: process.env.DB_NAME_KEDIRI,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const dbProbolinggo = mysql.createPool({
  host: process.env.DB_HOST_PROBOLINGGO,
  port: parseInt(process.env.DB_PORT_PROBOLINGGO || "3306"),
  user: process.env.DB_USER_PROBOLINGGO,
  password: process.env.DB_PASSWORD_PROBOLINGGO,
  database: process.env.DB_NAME_PROBOLINGGO,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
