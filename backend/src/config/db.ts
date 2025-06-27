import mysql from 'mysql2/promise';

export const db = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '', // ← deja vacío si no tienes contraseña
	database: 'marketplace',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});