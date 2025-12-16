// =================== LOCALSTORAGE HELPER ===================
function guardarLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function cargarLS(key, defaultValue) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}


// =================== USUARIOS INICIALES ===================
let usuarios = cargarLS('usuarios', []);

// Crear usuario admin inicial si no existe
if (!usuarios.some(u => u.rol === 'Admin')) {
    usuarios.push({
        usuario: 'admin',
        email: 'admin@gmail.com',
        pass: '12345678',
        rol: 'Admin'
    });
    guardarLS('usuarios', usuarios);
}

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
const adminMenu = document.getElementById('admin-menu'); // panel admin opcional

let currentUser = cargarLS('sesionActiva', null);
let currentItem = 4; // cuántos productos se muestran inicialmente

// =================== PRODUCTOS ===================
const products = [
    { id: 1, name: "Cheesecake de Maracuya", price: 70.00, image: "assets/Postre_MussMara.jpg", porciones: "1", descripcion: "Suave y cremoso cheesecake bañado con una vibrante reducción de maracuyá natural.El equilibrio perfecto entre lo dulce y lo cítrico." },
    { id: 2, name: "Torta Selva Negra", price: 70.00, image: "assets/Torta_Selva_Negra.jpg", porciones: "1", descripcion: "Deliciosa torta de chocolate, ideal para cumpleaños y celebraciones especiales." },
    { id: 3, name: "Torta 3 Leches", price: 70.00, image: "assets/Torta_3Leches.JPG", porciones: "2", descripcion: "Exquisita torta bañada en tres leches con un sabor sin igual para degustar con amigos y familia." },
    { id: 4, name: "Empanada de Queso", price: 5.00, image: "assets/Salado_EmpanadaQueso.jpg", porciones: "2", descripcion: "Torta suave y húmeda con mezcla de tres tipos de leche." },
    { id: 5, name: "Papa Rellena", price: 5.00, image: "assets/Salado_PapaRellena.jpg", porciones: "1", descripcion: "Bebida refrescante de sabor único." },
    { id: 6, name: "Gelatina", price: 3.00, image: "assets/Postre_Gelatina.jpg", porciones: "1", descripcion: "Deliciosa torta casera, ideal para cualquier ocasión." },
    { id: 7, name: "Torta Helada", price: 70.00, image: "assets/Torta_Helada.jpg", porciones: "2", descripcion: "Exquisita torta de chocolate con cobertura de cacao puro." },
    { id: 8, name: "Bebidas Gaseosas", price: 5.00, image: "assets/Bebidas_CocaInkaAgua.jpg", porciones: "2", descripcion: "Torta suave y húmeda con mezcla de tres tipos de leche." }
];




// =================== FUNCIONES MOSTRAR/OCULTAR FORMULARIOS ===================
function mostrarLogin() {
    if (registerFormContainer) registerFormContainer.style.display = "none";
    if (loginFormContainer) loginFormContainer.style.display = "flex";
}

function mostrarRegistro() {
    if (loginFormContainer) loginFormContainer.style.display = "none";
    if (registerFormContainer) registerFormContainer.style.display = "flex";
}

function cerrarForm() {
    if (loginFormContainer) loginFormContainer.style.display = "none";
    if (registerFormContainer) registerFormContainer.style.display = "none";
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
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usuario = loginUsuario.value.trim();
        const pass = loginPass.value;
        if (errorLogin) { errorLogin.textContent = ""; errorLogin.classList.remove("success", "error"); }

        if (!usuario || !pass) {
            if (errorLogin) { errorLogin.textContent = "Todos los campos son obligatorios."; errorLogin.classList.add("error"); }
            return;
        }

        const usuariosLS = cargarLS("usuarios", []);
        const encontrado = usuariosLS.find(u =>
            ((u.email && u.email.toLowerCase() === usuario.toLowerCase()) ||
            (u.user && u.user.toLowerCase() === usuario.toLowerCase()) ||
            (u.usuario && u.usuario.toLowerCase() === usuario.toLowerCase())) &&
            u.pass === pass
        );

        if (!encontrado) {
            if (errorLogin) { errorLogin.textContent = "Datos incorrectos."; errorLogin.classList.add("error"); }
            return;
        }

        guardarLS("sesionActiva", encontrado);
            currentUser = encontrado;

            // Si es administrador, redirigir al panel admin
            if (encontrado.rol === 'Admin') {
                window.location.href = 'admin.html'; // redirige a admin.html
                return; // salir para que no siga cargando el carrito
            }

            // Si es cliente normal, sigue el flujo
            cerrarForm();
            mostrarUsuario(encontrado);
            cargarCarrito();

    });
}

// =================== REGISTRO ===================
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = regEmail.value.trim();
        const user = regUser.value.trim();
        const pass = regPass.value;
        const pass2 = regPass2.value;
        if (errorRegistro) errorRegistro.textContent = "";

        const regex = /^[^\s@]+@(gmail\.com|hotmail\.com)$/i;
        if (!regex.test(email)) { if (errorRegistro) errorRegistro.textContent = "Correo inválido."; return; }
        if (user.length < 3) { if (errorRegistro) errorRegistro.textContent = "El nombre de usuario debe tener mínimo 3 caracteres."; return; }
        if (pass.length < 8) { if (errorRegistro) errorRegistro.textContent = "La contraseña debe tener mínimo 8 caracteres."; return; }
        if (pass !== pass2) { if (errorRegistro) errorRegistro.textContent = "Las contraseñas no coinciden."; return; }

        const usuariosLS = cargarLS("usuarios", []);
        if (usuariosLS.some(u => u.email === email)) { if (errorRegistro) errorRegistro.textContent = "Este correo ya está registrado."; return; }

        usuariosLS.push({ nombre: user, usuario: user, user: user, email, pass, rol: 'Cliente' });
        guardarLS("usuarios", usuariosLS);
        alert("Cuenta creada correctamente.");
        mostrarLogin();
        registerForm.reset();
    });
}

// =================== COMPRAR ELEMENTO ===================
function comprarElemento(e) {
    // 1. Lógica para el botón MÁS (+)
    if (e.target.classList.contains('sumar-cantidad')) {
        // Buscamos el input vecino (el número '1' en medio)
        const input = e.target.parentElement.querySelector('.cantidad');
        let valor = parseInt(input.value) || 1;
        if (valor < 10) { // Límite máximo (opcional)
            input.value = valor + 1;
        }
        return; 
    }

    // 2. Lógica para el botón MENOS (-)
    if (e.target.classList.contains('restar-cantidad')) {
        const input = e.target.parentElement.querySelector('.cantidad');
        let valor = parseInt(input.value) || 1;
        if (valor > 1) { // Evita que baje de 1
            input.value = valor - 1;
        }
        return;
    }

    // 3. Lógica para el botón AGREGAR AL CARRITO
    if (e.target.classList.contains('agregar-carrito')) {
        e.preventDefault();
        if (!currentUser) { mostrarLogin(); return; }

        const elemento = e.target.closest('.box');
        
        // CAPTURAMOS EL NÚMERO ACTUAL DEL INPUT
        const inputCantidad = elemento.querySelector('.cantidad');
        const cantidadElegida = Number(inputCantidad.value) || 1;

        const infoProducto = {
            imagen: elemento.querySelector('img').src,
            titulo: elemento.querySelector('h3').textContent,
            precio: elemento.querySelector('.precio').textContent,
            id: e.target.dataset.id,
            cantidad: cantidadElegida // ¡Enviamos la cantidad correcta!
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
// Manejo del carrito usando un array serializado en localStorage.
let cartKey = 'carrito_' + (currentUser && (currentUser.user || currentUser.usuario) ? (currentUser.user || currentUser.usuario) : 'guest');
let carritoItems = cargarLS(cartKey, []);

function saveCart() {
    guardarLS(cartKey, carritoItems);
    renderCart();
}

function renderCart() {
    // Rellenar tabla
    lista.innerHTML = '';
    carritoItems.forEach(item => {
        const tr = document.createElement('tr');
        const importe = (Number(item.precio) * Number(item.cantidad)).toFixed(2);
        tr.innerHTML = `
            <td><img src="${item.imagen}" alt=""/></td>
            <td>${item.titulo}</td>
            <td>${item.descripcion || ''}</td>
            <td>S/ ${Number(item.precio).toFixed(2)}</td>
            <td><input class="cart-qty" type="number" min="1" value="${item.cantidad}" data-id="${item.id}"></td>
            <td>S/ ${importe}</td>
            <td><a href="#" class="borrar" data-id="${item.id}">X</a></td>
        `;
        lista.appendChild(tr);
    });
    // actualizar total y contador
    updateCartSummary();
}

function updateCartSummary() {
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const total = carritoItems.reduce((sum, it) => sum + (Number(it.precio) * Number(it.cantidad)), 0);
    const count = carritoItems.reduce((c, it) => c + Number(it.cantidad), 0);
    if (countEl) countEl.textContent = count;
    if (totalEl) totalEl.textContent = 'S/ ' + total.toFixed(2);
}

function insertarCarrito(elemento) {
    const id = Number(elemento.id);
    const prod = products.find(p => p.id === id) || {};
    const price = prod.price || Number(String(elemento.precio || '').replace(/[^0-9\.]/g, '')) || 0;
    
    // Aquí recibimos la cantidad que viene del botón, o usamos 1 por defecto
    const cantidadAAgregar = elemento.cantidad || 1; 

    const existente = carritoItems.find(i => Number(i.id) === id);
    
    if (existente) {
        // Sumamos la cantidad real en lugar de solo +1
        existente.cantidad = Number(existente.cantidad) + cantidadAAgregar;
    } else {
        carritoItems.push({
            id: id,
            imagen: elemento.imagen || prod.image || '',
            titulo: elemento.titulo || prod.name || 'Producto',
            descripcion: prod.descripcion || '',
            precio: price,
            cantidad: cantidadAAgregar // Usamos la cantidad elegida
        });
    }
    saveCart();

}

function eliminarElemento(e) {
    if (e.target.classList.contains('borrar')) {
        e.preventDefault();
        const id = Number(e.target.dataset.id);
        carritoItems = carritoItems.filter(i => Number(i.id) !== id);
        saveCart();
    }
}

function handleQtyChange(e) {
    if (e.target.classList.contains('cart-qty')) {
        const id = Number(e.target.dataset.id);
        const val = Number(e.target.value) || 1;
        const item = carritoItems.find(i => Number(i.id) === id);
        if (item) {
            item.cantidad = val;
            saveCart();
        }
    }
}

function vaciarCarrito(e) {
    e && e.preventDefault();
    carritoItems = [];
    saveCart();
}

function cargarCarrito() {
    // recalcular cartKey por si cambió el usuario
    cartKey = 'carrito_' + (currentUser && (currentUser.user || currentUser.usuario) ? (currentUser.user || currentUser.usuario) : 'guest');
    carritoItems = cargarLS(cartKey, []);
    renderCart();
}

// Eventos carrito
elementos1.addEventListener('click', comprarElemento);
detalleProducto.addEventListener('click', comprarDetalle);
lista.addEventListener('click', eliminarElemento);
lista.addEventListener('input', handleQtyChange);
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);



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
    if (!usuario) return;
    welcomeMsg.textContent = `Bienvenido, ${usuario.user || usuario.usuario || usuario.nombre}`;
    if (userInfo) userInfo.style.display = 'flex';
    if (btnAbrir) btnAbrir.style.display = 'none';
    if (usuario.rol === 'Admin' && adminMenu) adminMenu.style.display = 'block';
    if (usuario.rol !== 'Admin' && adminMenu) adminMenu.style.display = 'none';
}

function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    userInfo.style.display = 'none';
    if (btnAbrir) btnAbrir.style.display = 'inline-block';
    currentUser = null;
    if (adminMenu) adminMenu.style.display = 'none';
    cargarCarrito();
}

if (logoutBtn) logoutBtn.addEventListener('click', cerrarSesion);

// =================== INICIALIZAR ===================
(function init() {
    if (loginFormContainer) loginFormContainer.style.display = "none";
    if (registerFormContainer) registerFormContainer.style.display = "none";
    currentUser = cargarLS('sesionActiva', null);
    if (currentUser) mostrarUsuario(currentUser);
    cargarCarrito();
})();

// =================== SLIDER AUTOMÁTICO ===================
const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
function nextSlide() {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}
if (slides.length > 0) setInterval(nextSlide, 4000);
