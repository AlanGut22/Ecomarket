import { Router } from 'express';
import { db } from '../config/db';

const router = Router();

// ---------- LOGIN ----------
router.post('/login', async (req, res) => {
	const { nombre_usuario, contrasena } = req.body;

	try {
		const [rows]: any = await db.query(
			'SELECT * FROM usuarios WHERE nombre_usuario = ?',
			[nombre_usuario]
		);

		if (rows.length === 0) {
			res.status(401).json({ error: 'Usuario no encontrado' });
			return;
		}

		const user = rows[0];

		if (user.contrasena !== contrasena) {
			res.status(401).json({ error: 'Contraseña incorrecta' });
			return;
		}

		res.json({
			message: 'Login exitoso',
			userId: user.id,
			nombre_usuario: user.nombre_usuario
		});
	} catch (error) {
		console.error('Error en login:', error);
		res.status(500).json({ error: 'Error interno' });
	}
});

// ---------- REGISTRO ----------
router.post('/register', async (req, res) => {
	const { nombre_usuario, contrasena } = req.body;

	if (!nombre_usuario || !contrasena) {
		res.status(400).json({ message: 'Faltan campos' });
		return;
	}

	try {
		const [existing]: any = await db.query(
			'SELECT id FROM usuarios WHERE nombre_usuario = ?',
			[nombre_usuario]
		);

		if (existing.length > 0) {
			res.status(409).json({ message: 'Usuario ya existe' });
			return;
		}

		const [result]: any = await db.query(
			'INSERT INTO usuarios (nombre_usuario, contrasena) VALUES (?, ?)',
			[nombre_usuario, contrasena]
		);

		res.status(201).json({ id: result.insertId, nombre_usuario });
	} catch (error) {
		console.error('Error en registro:', error);
		res.status(500).json({ error: 'Error interno' });
	}
});

export default router;