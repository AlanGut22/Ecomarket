let todosLosProductos = [];

const currentUser = JSON.parse(localStorage.getItem('user'));

if (currentUser) {
	document.getElementById('login-section').style.display = 'none';
	document.getElementById('register-section').style.display = 'none';
	document.getElementById('upload-section').style.display = 'block';
	document.getElementById('user-session').style.display = 'flex';
	document.getElementById('user-info').textContent =
		`Sesión iniciada como: ${currentUser.nombre_usuario}`;
	document.getElementById('logout-btn').style.display = 'inline';

	document.getElementById('logout-btn').addEventListener('click', () => {
		localStorage.removeItem('user');
		location.reload();
	});

	cargarHistorial();
} else {
	document.getElementById('upload-section').style.display = 'none';
	document.getElementById('user-session').style.display = 'none';

	document.getElementById('login-form').addEventListener('submit', function (e) {
		e.preventDefault();
		const nombre_usuario = document.getElementById('login-username').value;
		const contrasena = document.getElementById('login-password').value;

		fetch('http://localhost:3001/api/users/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ nombre_usuario, contrasena })
		})
			.then(res => {
				if (!res.ok) throw new Error('Login fallido');
				return res.json();
			})
			.then(data => {
				alert('Bienvenido, ' + data.nombre_usuario);
				localStorage.setItem('user', JSON.stringify(data));
				location.reload();
			})
			.catch(err => {
				alert('Usuario o contraseña incorrectos');
				console.error(err);
			});
	});

	document.getElementById('register-form').addEventListener('submit', function (e) {
		e.preventDefault();
		const nombre_usuario = document.getElementById('register-username').value;
		const contrasena = document.getElementById('register-password').value;

		fetch('http://localhost:3001/api/users/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ nombre_usuario, contrasena })
		})
			.then(res => {
				if (res.status === 409) throw new Error('El usuario ya existe');
				if (!res.ok) throw new Error('Error al registrar');
				return res.json();
			})
			.then(data => {
				alert('Usuario registrado con éxito');
				localStorage.setItem('user', JSON.stringify(data));
				location.reload();
			})
			.catch(err => {
				alert(err.message);
				console.error(err);
			});
	});
}

fetch('http://localhost:3001/api/products')
	.then(response => response.json())
	.then(products => {
		todosLosProductos = products;
		mostrarProductos(products);
	})
	.catch(error => {
		console.error('Error cargando productos:', error);
	});

function mostrarProductos(lista) {
	const container = document.getElementById('product-container');
	container.innerHTML = '';

	lista.forEach(product => {
		const div = document.createElement('div');
		div.className = 'product';
		div.innerHTML = `
			<img src="${product.imagen}" alt="${product.titulo}">
			<h3>${product.titulo}</h3>
			<p>$${product.precio}</p>
			<button onclick='verDetalles(${JSON.stringify(product)})'>Ver más</button>
			<button onclick="agregarAlCarrito(${product.id})">Agregar al carrito</button>
			${currentUser ? `
				<button onclick="editarProducto(${product.id})">Editar</button>
				<button onclick="eliminarProducto(${product.id})">Eliminar</button>` : ''}
		`;
		container.appendChild(div);
	});
}

function verDetalles(product) {
	const modal = document.getElementById('product-modal');
	document.getElementById('modal-title').textContent = product.titulo;
	document.getElementById('modal-description').textContent = product.descripcion || 'Sin descripción';
	document.getElementById('modal-price').textContent = `$${product.precio}`;
	document.getElementById('modal-image').src = product.imagen;
	modal.style.display = 'block';
}

document.getElementById('close-modal').addEventListener('click', () => {
	document.getElementById('product-modal').style.display = 'none';
});

if (currentUser) {
	document.getElementById('product-form').addEventListener('submit', function (e) {
		e.preventDefault();
		const titulo = document.getElementById('title').value;
		const precio = parseFloat(document.getElementById('price').value);
		const imagen = document.getElementById('image').value;
		const descripcion = document.getElementById('description').value;

		fetch('http://localhost:3001/api/products', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ titulo, precio, imagen, descripcion })
		})
			.then(res => res.json())
			.then(data => {
				alert('Producto agregado con éxito');
				location.reload();
			})
			.catch(err => {
				console.error('Error al subir producto:', err);
			});
	});
}

function eliminarProducto(id) {
	if (!confirm('¿Seguro que quieres eliminar este producto?')) return;

	fetch(`http://localhost:3001/api/products/${id}`, {
		method: 'DELETE'
	})
		.then(res => {
			if (!res.ok) throw new Error('Error al eliminar');
			alert('Producto eliminado');
			location.reload();
		})
		.catch(err => {
			console.error(err);
			alert('No se pudo eliminar el producto');
		});
}

function editarProducto(id) {
	const nuevoTitulo = prompt('Nuevo título:');
	const nuevoPrecio = prompt('Nuevo precio:');
	const nuevaImagen = prompt('Nueva URL de imagen:');
	const nuevaDescripcion = prompt('Nueva descripción:');

	if (!nuevoTitulo || !nuevoPrecio || !nuevaImagen || !nuevaDescripcion) {
		alert('Todos los campos son obligatorios');
		return;
	}

	fetch(`http://localhost:3001/api/products/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			titulo: nuevoTitulo,
			precio: parseFloat(nuevoPrecio),
			imagen: nuevaImagen,
			descripcion: nuevaDescripcion
		})
	})
		.then(res => {
			if (!res.ok) throw new Error('Error al editar');
			return res.json();
		})
		.then(data => {
			alert('Producto editado con éxito');
			location.reload();
		})
		.catch(err => {
			console.error(err);
			alert('No se pudo editar el producto');
		});
}

function agregarAlCarrito(id) {
	fetch('http://localhost:3001/api/products')
		.then(res => res.json())
		.then(productos => {
			const producto = productos.find(p => p.id === id);
			if (!producto) return alert('Producto no encontrado');

			let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
			carrito.push(producto);
			localStorage.setItem('carrito', JSON.stringify(carrito));

			alert(`"${producto.titulo}" agregado al carrito`);
		})
		.catch(err => {
			console.error('Error al agregar al carrito:', err);
		});
}

function mostrarCarrito() {
	const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
	const contenedor = document.getElementById('carrito-lista');
	const totalSpan = document.getElementById('carrito-total');

	contenedor.innerHTML = '';
	let total = 0;

	if (carrito.length === 0) {
		contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
	} else {
		carrito.forEach((item, index) => {
			total += parseFloat(item.precio);
			const div = document.createElement('div');
			div.innerHTML = `
				<p><strong>${item.titulo}</strong> - $${item.precio}
				<button onclick="quitarDelCarrito(${index})">Quitar</button></p>`;
			contenedor.appendChild(div);
		});
	}

	totalSpan.textContent = total;
	document.getElementById('carrito-modal').style.display = 'block';
}

function cerrarCarrito() {
	document.getElementById('carrito-modal').style.display = 'none';
}

function vaciarCarrito() {
	localStorage.removeItem('carrito');
	mostrarCarrito();
}

function quitarDelCarrito(index) {
	let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
	carrito.splice(index, 1);
	localStorage.setItem('carrito', JSON.stringify(carrito));
	mostrarCarrito();
}

function realizarCompra() {
	const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

	if (carrito.length === 0) {
		alert('Tu carrito está vacío.');
		return;
	}

	const total = carrito.reduce((sum, item) => sum + item.precio, 0);

	fetch('http://localhost:3001/api/orders', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			usuario_id: currentUser.userId,
			productos: carrito.map(p => ({
				producto_id: p.id,
				cantidad: 1,
				precio_unitario: p.precio
			}))
		})
	})
		.then(res => {
			if (!res.ok) throw new Error('Error al registrar la compra');
			return res.json();
		})
		.then(data => {
			alert('✅ Compra registrada con éxito');
			localStorage.removeItem('carrito');
			mostrarCarrito();
			cargarHistorial();
		})
		.catch(err => {
			console.error('Error al registrar compra:', err);
			alert('No se pudo registrar la compra');
		});
}

function aplicarFiltros() {
	const texto = document.getElementById('buscador').value.toLowerCase();
	const precioMin = parseFloat(document.getElementById('precio-min').value) || 0;
	const precioMax = parseFloat(document.getElementById('precio-max').value) || Infinity;

	const resultado = todosLosProductos.filter(p =>
		p.titulo.toLowerCase().includes(texto) &&
		p.precio >= precioMin &&
		p.precio <= precioMax
	);

	mostrarProductos(resultado);
}

document.getElementById('buscador').addEventListener('input', aplicarFiltros);
document.getElementById('filtrar-precio').addEventListener('click', aplicarFiltros);

function cargarHistorial() {
	if (!currentUser) return;

	fetch(`http://localhost:3001/api/orders/usuario/${currentUser.userId}`)
		.then(res => res.json())
		.then(compras => {
			const contenedor = document.getElementById('historial-lista');
			if (!contenedor) return;

			if (!compras.length) {
				contenedor.innerHTML = '<p>No hay compras registradas.</p>';
				return;
			}

			contenedor.innerHTML = compras.map(compra => {
				const fecha = new Date(compra.fecha).toLocaleString();
				const productosHTML = compra.productos.map(p => `
					<li>${p.titulo} (x${p.cantidad}) - $${p.precio_unitario}</li>
				`).join('');

				return `
					<div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
						<p><strong>🧾 Fecha:</strong> ${fecha}</p>
						<ul>${productosHTML}</ul>
						<p><strong>Total:</strong> $${compra.total}</p>
					</div>
				`;
			}).join('');
		})
		.catch(err => {
			console.error('Error cargando historial:', err);
			const contenedor = document.getElementById('historial-lista');
			if (contenedor) contenedor.innerHTML = '<p>Error al cargar el historial.</p>';
		});
}

// ======================
// 👁️ Mostrar/ocultar historial
// ======================
const historialBtn = document.getElementById('toggle-historial-btn');
const historialContenedor = document.getElementById('historial-contenedor');

if (historialBtn && historialContenedor) {
	historialBtn.addEventListener('click', () => {
		if (historialContenedor.style.display === 'none') {
			historialContenedor.style.display = 'block';
			historialBtn.textContent = '❌ Ocultar historial';
			cargarHistorial();
		} else {
			historialContenedor.style.display = 'none';
			historialBtn.textContent = '🧾 Ver historial de compras';
		}
	});
}