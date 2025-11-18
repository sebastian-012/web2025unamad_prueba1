// =================== LOCALSTORAGE HELPER ===================
function guardarLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function cargarLS(key, defaultValue) {
    return JSON.parse(localStorage.getItem(key)) || defaultValue;
}

// =================== USUARIOS INICIALES ===================
let usuarios = cargarLS('usuarios', [
    { nombre: 'Administrador', usuario: 'admin', pass: '12345678', rol: 'Administrador', correo: 'admin@gmail.com', ciudad: 'pto.m' },
    { nombre: 'Cliente', usuario: 'cliente', pass: 'cliente123', rol: 'Cliente', correo: 'cliente@correo.com', ciudad: 'lima' }
]);

// =================== VARIABLES GLOBALES ===================
const loginFormContainer = document.getElementById("login");
const registerFormContainer = document.getElementById("registro");
const loginForm = document.querySelector("#login form");
const registerForm = document.querySelector("#registro form");
const loginUsuario = document.getElementById("loginUsuario");
const loginPass = document.getElementById("loginPass");
const regEmail = document.getElementById("regEmail");
const regUser = document.getElementById("regUser");
const regPass = document.getElementById("regPass");
const regPass2 = document.getElementById("regPass2");
const errorLogin = document.getElementById("errorLogin");
const errorRegistro = document.getElementById("errorRegistro");
const msgEmail = document.getElementById("msgEmail");
const adminPanel = document.getElementById('admin-panel');
const detalleProducto = document.getElementById('detalle-producto');
const carrito = document.getElementById('carrito');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const elementos1 = document.getElementById('lista-1');
const searchInput = document.getElementById('search');
const suggestions = document.getElementById('suggestions');
const loadMoreBtn = document.getElementById('load-more');
const userInfo = document.getElementById('user-info');
const welcomeMsg = document.getElementById('welcome-msg');
const logoutBtn = document.getElementById('logout-btn');
const btnAbrir = document.querySelector('.btnAbrir');

let currentUser = JSON.parse(localStorage.getItem('sesionActiva')) || null;
let currentItem = 4;

// =================== PRODUCTOS ===================
const products = [
    { id: 1, name: "Refresco", price: 100, image: "assets/imagen4.jpeg", porciones: "1", descripcion: "Bebida refrescante de sabor único." },
    { id: 2, name: "Torta", price: 100, image: "assets/imagen2.jpeg", porciones: "1", descripcion: "Deliciosa torta casera, ideal para cualquier ocasión." },
    { id: 3, name: "Torta de chocolate", price: 100, image: "assets/imagen5.jpeg", porciones: "2", descripcion: "Exquisita torta de chocolate con cobertura de cacao puro." },
    { id: 4, name: "Torta de tres leches", price: 100, image: "assets/imagen3.jpeg", porciones: "2", descripcion: "Torta suave y húmeda con mezcla de tres tipos de leche." },
    { id: 5, name: "Refresco", price: 100, image: "assets/imagen4.jpeg", porciones: "1", descripcion: "Bebida refrescante de sabor único." },
    { id: 6, name: "Torta", price: 100, image: "assets/imagen2.jpeg", porciones: "1", descripcion: "Deliciosa torta casera, ideal para cualquier ocasión." },
    { id: 7, name: "Torta de chocolate", price: 100, image: "assets/imagen5.jpeg", porciones: "2", descripcion: "Exquisita torta de chocolate con cobertura de cacao puro." },
    { id: 8, name: "Torta de tres leches", price: 100, image: "assets/imagen3.jpeg", porciones: "2", descripcion: "Torta suave y húmeda con mezcla de tres tipos de leche." }
];

// =================== FUNCIONES MOSTRAR/OCULTAR FORMULARIOS ===================
function mostrarLogin() {
    registerFormContainer.style.display = "none";
    loginFormContainer.style.display = "flex";
}

function mostrarRegistro() {
    loginFormContainer.style.display = "none";
    registerFormContainer.style.display = "flex";
}

function cerrarForm() {
    loginFormContainer.style.display = "none";
    registerFormContainer.style.display = "none";
}

// =================== VER/Ocultar contraseña ===================
function verPass(id) {
    const campo = document.getElementById(id);
    campo.type = campo.type === "password" ? "text" : "password";
}

// =================== VALIDACIÓN EMAIL TIEMPO REAL ===================
regEmail.addEventListener("input", () => {
    const email = regEmail.value.trim();
    const regex = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;
    msgEmail.textContent = regex.test(email) ? "✓ Correo válido" : "Debe terminar en @gmail.com o @hotmail.com";
});

// =================== LOGIN ===================
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = loginUsuario.value.trim();
    const pass = loginPass.value;
    errorLogin.textContent = "";
    errorLogin.classList.remove("success", "error");

    if (!usuario || !pass) {
        errorLogin.textContent = "Todos los campos son obligatorios.";
        errorLogin.classList.add("error");
        return;
    }

    const usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    const encontrado = usuariosLS.find(u =>
        (u.email?.toLowerCase() === usuario.toLowerCase() || u.user?.toLowerCase() === usuario.toLowerCase() || u.usuario?.toLowerCase() === usuario.toLowerCase()) &&
        u.pass === pass
    );

    if (!encontrado) {
        errorLogin.textContent = "Datos incorrectos.";
        errorLogin.classList.add("error");
        return;
    }

    localStorage.setItem("sesionActiva", JSON.stringify(encontrado));
    currentUser = encontrado;

    cerrarForm();
    mostrarUsuario(encontrado);
    cargarCarrito();
});

// =================== REGISTRO ===================
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = regEmail.value.trim();
    const user = regUser.value.trim();
    const pass = regPass.value;
    const pass2 = regPass2.value;
    errorRegistro.textContent = "";

    const regex = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;
    if (!regex.test(email)) { errorRegistro.textContent = "Correo inválido."; return; }
    if (user.length < 3) { errorRegistro.textContent = "El nombre de usuario debe tener mínimo 3 caracteres."; return; }
    if (pass.length < 8) { errorRegistro.textContent = "La contraseña debe tener mínimo 8 caracteres."; return; }
    if (pass !== pass2) { errorRegistro.textContent = "Las contraseñas no coinciden."; return; }

    const usuariosLS = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (usuariosLS.some(u => u.email === email)) { errorRegistro.textContent = "Este correo ya está registrado."; return; }

    // Unificar propiedades
    usuariosLS.push({ nombre: user, usuario: user, email, pass, rol: 'Cliente', ciudad: '' });
    localStorage.setItem("usuarios", JSON.stringify(usuariosLS));
    alert("Cuenta creada correctamente.");
    mostrarLogin();
    registerForm.reset();
});

// =================== COMPRAR ELEMENTO ===================
function comprarElemento(e) {
    e.preventDefault();
    if (!currentUser) { mostrarLogin(); return; }
    if (e.target.classList.contains('agregar-carrito')) {
        const elemento = e.target.closest('.box');
        const infoProducto = {
            imagen: elemento.querySelector('img').src,
            titulo: elemento.querySelector('h3').textContent,
            precio: elemento.querySelector('.precio').textContent,
            id: e.target.dataset.id
        };
        insertarCarrito(infoProducto);
    }
}

function comprarDetalle(e) {
    e.preventDefault();
    if (!currentUser) { mostrarLogin(); return; }
    if (e.target.classList.contains('agregar-carrito')) {
        const box = e.target.closest('.box-detalle');
        if (!box) return;
        const productName = box.querySelector('h3').textContent;
        const product = products.find(p => p.name === productName);
        insertarCarrito({
            imagen: product.image,
            titulo: product.name,
            precio: "S/ " + product.price.toFixed(2),
            id: product.id
        });
    }
}

// Evitar clicks sin sesión
document.querySelectorAll('.agregar-carrito').forEach(btn => {
    btn.addEventListener('click', e => { if (!currentUser) { e.preventDefault(); mostrarLogin(); } });
});

// =================== CARRITO ===================
function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><img src="${elemento.imagen}" width="100"/></td>
        <td>${elemento.titulo}</td>
        <td>${elemento.precio}</td>
        <td><a href="#" class="borrar" data-id="${elemento.id}">❌</a></td>
    `;
    lista.appendChild(row);
    guardarCarrito();
}

function eliminarElemento(e) {
    if (e.target.classList.contains('borrar')) {
        e.preventDefault();
        e.target.closest('tr').remove();
        guardarCarrito();
    }
}

function vaciarCarrito() {
    while (lista.firstChild) lista.removeChild(lista.firstChild);
    guardarCarrito();
}

function guardarCarrito() {
    if (currentUser) localStorage.setItem('carrito_' + currentUser.user, lista.innerHTML);
}

function cargarCarrito() {
    if (currentUser && localStorage.getItem('carrito_' + currentUser.user)) {
        lista.innerHTML = localStorage.getItem('carrito_' + currentUser.user);
    } else lista.innerHTML = '';
}

// Eventos carrito
elementos1.addEventListener('click', comprarElemento);
detalleProducto.addEventListener('click', comprarDetalle);
carrito.addEventListener('click', eliminarElemento);
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

// =================== PANEL ADMIN ===================
function cargarUsuarios() {
    const tbody = document.querySelector('#user-list tbody');
    tbody.innerHTML = '';
    usuarios.forEach((u, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.usuario}</td>
            <td>${u.rol}</td>
            <td>${u.correo}</td>
            <td>${u.ciudad}</td>
            <td>
                ${u.usuario !== "admin" ? `<button onclick="editarUsuario(${i})">Editar</button>
                <button onclick="eliminarUsuario(${i})">Eliminar</button>` : 'Administrador'}
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function eliminarUsuario(index) {
    if (usuarios[index].usuario === "admin") { alert("El usuario administrador no se puede eliminar."); return; }
    if (confirm('¿Eliminar usuario?')) {
        usuarios.splice(index, 1);
        guardarLS('usuarios', usuarios);
        cargarUsuarios();
    }
}

function editarUsuario(index) {
    const usuario = usuarios[index];
    const nuevoNombre = prompt("Editar nombre:", usuario.nombre);
    const nuevoCorreo = prompt("Editar correo:", usuario.correo);
    const nuevaCiudad = prompt("Editar ciudad:", usuario.ciudad);

    if (nuevoNombre) usuario.nombre = nuevoNombre;
    if (nuevoCorreo) usuario.correo = nuevoCorreo;
    if (nuevaCiudad) usuario.ciudad = nuevaCiudad;

    guardarLS('usuarios', usuarios);
    cargarUsuarios();
}

// =================== BUSCADOR ===================
searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    suggestions.innerHTML = '';
    if (!query) { suggestions.style.display = 'none'; return; }

    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    filtered.forEach(product => {
        const item = document.createElement('div');
        item.classList.add('suggestion-item');
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div>
                <h4>${product.name}</h4>
                <p>S/ ${product.price.toFixed(2)}</p>
            </div>
        `;
        item.addEventListener('click', () => {
            suggestions.innerHTML = '';
            suggestions.style.display = 'none';
            detalleProducto.innerHTML = `
                <div class="box-detalle">
                    <img src="${product.image}" alt="${product.name}">
                    <div>
                        <h3>${product.name}</h3>
                        <p class="precio">S/ ${product.price.toFixed(2)}</p>
                        <p class="porciones">Porciones: ${product.porciones}</p>
                        <p class="descripcion">${product.descripcion}</p>
                        <input type="number" min="1" max="10" value="1" class="cantidad">
                        <a href="#" class="agregar-carrito btn-3">Agregar al carrito</a>
                    </div>
                </div>
            `;
            detalleProducto.scrollIntoView({ behavior: 'smooth' });
        });
        suggestions.appendChild(item);
    });
    suggestions.style.display = filtered.length ? 'block' : 'none';
});

document.addEventListener('click', e => {
    if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) suggestions.style.display = 'none';
});

// =================== CARGAR MÁS PRODUCTOS ===================
loadMoreBtn.addEventListener('click', () => {
    let boxes = [...document.querySelectorAll('.box-container .box')];
    for (let i = currentItem; i < currentItem + 4 && i < boxes.length; i++) boxes[i].style.display = 'inline-block';
    currentItem += 4;
    if (currentItem >= boxes.length) loadMoreBtn.style.display = 'none';
});

// =================== USUARIO LOGUEADO ===================
function mostrarUsuario(usuario) {
    welcomeMsg.textContent = `Bienvenido, ${usuario.user || usuario.usuario || usuario.nombre}`;
    userInfo.style.display = 'flex';
    btnAbrir.style.display = 'none';
}

function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    userInfo.style.display = 'none';
    btnAbrir.style.display = 'inline-block';
    currentUser = null;
    cargarCarrito();
}

logoutBtn.addEventListener('click', cerrarSesion);

// =================== INICIALIZAR ===================
cargarCarrito();
if (currentUser) mostrarUsuario(currentUser);
if (currentUser && currentUser.rol === 'Administrador') {
    adminPanel.style.display = 'block';
    cargarUsuarios();
} else adminPanel.style.display = 'none';
