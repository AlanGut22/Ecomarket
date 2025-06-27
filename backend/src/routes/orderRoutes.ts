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

// ============================
// 📜 Obtener historial de compras de un usuario (GET)
// ============================
router.get('/usuario/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const [compras] = await db.query(
			`SELECT c.id, c.fecha, c.total,
				cp.producto_id, cp.cantidad, cp.precio_unitario,
				p.titulo, p.imagen
			FROM compras c
			JOIN compra_productos cp ON c.id = cp.compra_id
			JOIN productos p ON cp.producto_id = p.id
			WHERE c.usuario_id = ?
			ORDER BY c.fecha DESC`,
			[id]
		);

		// Agrupar productos por compra
		const historial: any = {};
		for (const row of compras as any[]) {
			if (!historial[row.id]) {
				historial[row.id] = {
					id: row.id,
					fecha: row.fecha,
					total: row.total,
					productos: []
				};
			}
			historial[row.id].productos.push({
				id: row.producto_id,
				titulo: row.titulo,
				imagen: row.imagen,
				cantidad: row.cantidad,
				precio_unitario: row.precio_unitario
			});
		}

		res.json(Object.values(historial));
	} catch (error) {
		console.error('Error al obtener historial:', error);
		res.status(500).json({ message: 'Error al obtener historial' });
	}
});

export default router;
