import { Router } from 'express';
import { db } from '../config/db';

const router = Router();

// ============================
// 📥 Registrar una compra (POST)
// ============================
router.post('/', async (req, res) => {
	const { usuario_id, productos } = req.body;

	if (!usuario_id || !Array.isArray(productos) || productos.length === 0) {
		res.status(400).json({ message: 'Datos de compra inválidos' });
		return;
	}

	try {
		const total = productos.reduce(
			(sum, p) => sum + p.precio_unitario * p.cantidad,
			0
		);

		// Crear compra
		const [result]: any = await db.query(
			'INSERT INTO compras (usuario_id, total) VALUES (?, ?)',
			[usuario_id, total]
		);

		const compraId = result.insertId;

		// Insertar productos de la compra
		for (const item of productos) {
			await db.query(
				'INSERT INTO compra_productos (compra_id, producto_id, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
				[compraId, item.producto_id, item.cantidad, item.precio_unitario]
			);
		}

		res.status(201).json({ message: 'Compra registrada correctamente', compraId });
	} catch (error) {
		console.error('Error al registrar compra:', error);
		res.status(500).json({ message: 'Error interno al registrar compra' });
	}
});

export default router;
