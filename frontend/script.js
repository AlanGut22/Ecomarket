/*
  Archivo principal de la lógica de Reloop
  - Maneja sesión del usuario (login, logout, registro)
  - Controla la carga y renderizado de productos
  - Permite CRUD de productos (crear, editar, eliminar)
  - Administra carrito, historial, favoritos
*/

let todosLosProductos = [];
const currentUser = JSON.parse(localStorage.getItem('user'));

window.addEventListener('DOMContentLoaded', () => {
  const loginOpciones = document.getElementById('login-opciones');
  const logoutOpcion = document.getElementById('logout-opcion');
  const venderLink = document.getElementById('vender-link');
  const editarLink = document.getElementById('editar-link');
  const logoutBtn = document.getElementById('logout-icon');

  if (currentUser) {
    if (loginOpciones) loginOpciones.style.display = 'none';
    if (logoutOpcion) logoutOpcion.style.display = 'inline-block';
    if (venderLink) venderLink.style.display = 'inline-block';
    if (editarLink) editarLink.style.display = 'inline-block';
  } else {
    if (loginOpciones) loginOpciones.style.display = 'inline-block';
    if (logoutOpcion) logoutOpcion.style.display = 'none';
    if (venderLink) venderLink.style.display = 'none';
    if (editarLink) editarLink.style.display = 'none';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      document.getElementById("logout-modal").style.display = "block";
    });
  }
});

function cerrarLogoutModal() {
  document.getElementById("logout-modal").style.display = "none";
}

function cerrarSesion() {
  localStorage.removeItem('user');
  const path = window.location.pathname.includes('/pages/')
    ? '../index.html'
    : 'index.html';
  window.location.href = path;
}

function irAlPerfil() {
  window.location.href = 'pages/perfil.html';
}

// =============================
// 🔑 Login y Registro (solo en login.html)
// =============================
if (document.getElementById('login-form')) {
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
        window.location.href = '../index.html';
      })
      .catch(err => {
        alert('Usuario o contraseña incorrectos');
        console.error(err);
      });
  });
}

if (document.getElementById('register-form')) {
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
        window.location.href = '../index.html';
      })
      .catch(err => {
        alert(err.message);
        console.error(err);
      });
  });
}

// =============================
// ✍️ Publicar nuevo producto (solo en vender.html)
// =============================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('product-form');

  if (form && currentUser && window.location.pathname.includes('vender.html')) {
    form.addEventListener('submit', function (e) {
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
});


// =============================
// 📦 Cargar y mostrar productos (solo en productos.html y editar.html)
// =============================
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  if (path.includes('productos.html') || path.includes('editar.html')) {
    fetch('http://localhost:3001/api/products')
      .then(response => response.json())
      .then(products => {
        todosLosProductos = products;
        mostrarProductos(products);
      })
      .catch(error => {
        console.error('Error cargando productos:', error);
      });
  }
});

function mostrarProductos(lista) {
  const container = document.getElementById('product-container');
  if (!container) return;
  container.innerHTML = '';

  lista.forEach(product => {
    const div = document.createElement('div');
    div.className = 'categoria-card';
    div.innerHTML = `
      <img src="${product.imagen}" alt="${product.titulo}" />
      <h3>${product.titulo}</h3>
      <p><strong>$${product.precio}</strong></p>
      <div class="botones">
        <button onclick='verDetalles(${JSON.stringify(product)})'>Ver más</button>
        <button onclick="agregarAlCarrito(${product.id})">Agregar al carrito</button>
        ${currentUser && window.location.pathname.includes('editar.html') ? `
          <button onclick="editarProducto(${product.id})">Editar</button>
          <button onclick="eliminarProducto(${product.id})">Eliminar</button>
        ` : ''}
      </div>
    `;
    container.appendChild(div);
  });
}

// =============================
// 🪪 Detalles del producto
// =============================
function verDetalles(product) {
  const modal = document.getElementById('product-modal');
  document.getElementById('modal-title').textContent = product.titulo;
  document.getElementById('modal-description').textContent = product.descripcion || 'Sin descripción';
  document.getElementById('modal-price').textContent = `$${product.precio}`;
  document.getElementById('modal-image').src = product.imagen;
  modal.style.display = 'block';
}

document.getElementById('close-modal')?.addEventListener('click', () => {
  document.getElementById('product-modal').style.display = 'none';
});

// =============================
// ✂️ Editar y eliminar productos
// =============================
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

// =============================
// 🛒 Carrito
// =============================
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
    })
    .catch(err => {
      console.error('Error al registrar compra:', err);
      alert('No se pudo registrar la compra');
    });
}

// =============================
// UI: Login / Registro / Perfil / Favoritos
// =============================
function mostrarRegistro() {
  const contenedor = document.getElementById("contenedor");
  contenedor.classList.add("activar");
}

function mostrarLogin() {
  const contenedor = document.getElementById("contenedor");
  contenedor.classList.remove("activar");
}

function mostrarPerfil() {
  document.getElementById("perfil-modal").style.display = "block";
}

function cerrarPerfil() {
  document.getElementById("perfil-modal").style.display = "none";
}

// Detectar el hash al cargar la página para mostrar login o registro automáticamente
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash;

  if (hash === '#form-registra') {
    mostrarRegistro();
  } else if (hash === '#form-login') {
    mostrarLogin();
  }
});
