import { Router } from 'express';
import { db } from '../config/db';

const router = Router();

// =======================
// 📦 Obtener todos los productos
// =======================
router.get('/', async (req, res) => {
	try {
		// Nombre de tabla corregido a "productos"
		const [rows] = await db.query('SELECT * FROM productos');
		res.json(rows);
	} catch (error) {
		console.error('Error al obtener productos:', error);
		res.status(500).json({ message: 'Error al obtener los productos' });
	}
});

// =======================
// ➕ Crear nuevo producto
// =======================
router.post('/', async (req, res) => {
	const { title, price, image, description } = req.body;

	// Validamos campos
	if (!title || !price || !image || !description) {
		res.status(400).json({ message: 'Faltan campos requeridos' });
		return;
	}

	try {
		const [result]: any = await db.query(
			`INSERT INTO productos (titulo, precio, imagen, descripcion) VALUES (?, ?, ?, ?)`,
			[title, price, image, description]
		);

		res.status(201).json({
			id: result.insertId,
			titulo: title,
			precio: price,
			imagen: image,
			descripcion: description
		});
	} catch (error) {
		console.error('Error al insertar producto:', error);
		res.status(500).json({ message: 'Error al insertar el producto' });
	}
});

// =======================
// ✏️ Editar producto
// =======================
router.put('/:id', async (req, res) => {
	const { id } = req.params;
	const { title, price, image, description } = req.body;

	if (!title || !price || !image || !description) {
		res.status(400).json({ message: 'Faltan campos requeridos' });
		return;
	}

	try {
		const [result]: any = await db.query(
			`UPDATE productos SET titulo = ?, precio = ?, imagen = ?, descripcion = ? WHERE id = ?`,
			[title, price, image, description, id]
		);

		if (result.affectedRows === 0) {
			res.status(404).json({ message: 'Producto no encontrado' });
			return;
		}

		res.json({ message: 'Producto actualizado correctamente' });
	} catch (error) {
		console.error('Error al actualizar producto:', error);
		res.status(500).json({ message: 'Error al actualizar el producto' });
	}
});

// =======================
// 🗑️ Eliminar producto
// =======================
router.delete('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const [result]: any = await db.query(
			'DELETE FROM productos WHERE id = ?',
			[id]
		);

		if (result.affectedRows === 0) {
			res.status(404).json({ message: 'Producto no encontrado' });
			return;
		}

		res.json({ message: 'Producto eliminado correctamente' });
	} catch (error) {
		console.error('Error al eliminar producto:', error);
		res.status(500).json({ message: 'Error al eliminar el producto' });
	}
});

export default router;