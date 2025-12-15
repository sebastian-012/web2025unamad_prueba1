// =================== HELPER ===================
function cargarLS(key, defaultValue) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) {
        return defaultValue;
    }
}

// =================== SEGURIDAD ===================
let currentUser = cargarLS('sesionActiva', null);
if (!currentUser || currentUser.rol !== 'Admin') {
    alert("Acceso denegado. Solo administradores.");
    window.location.href = "index.html"; 
}

// =================== LÓGICA DASHBOARD ===================
function cargarDashboard() {
    const usuarios = cargarLS('usuarios', []);
    const tablaUsuarios = document.querySelector('#tablaUsuarios tbody');
    const tablaCompras = document.querySelector('#tablaCompras tbody');
    
    // Elementos de Estadísticas (KPIs)
    const totalUsersEl = document.getElementById('totalUsers');
    const totalSalesEl = document.getElementById('totalSales');
    const totalIncomeEl = document.getElementById('totalIncome');

    // Variables acumuladoras
    let contadorVentas = 0;
    let totalIngresos = 0;

    // 1. CARGAR USUARIOS
    tablaUsuarios.innerHTML = '';
    usuarios.forEach(u => {
        // Asignar clase de color según el rol
        const badgeClass = u.rol === 'Admin' ? 'role-admin' : 'role-cliente';
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><div style="font-weight:600">${u.user || u.usuario}</div></td>
            <td>${u.email}</td>
            <td><span class="role-badge ${badgeClass}">${u.rol}</span></td>
        `;
        tablaUsuarios.appendChild(tr);

        // 2. BUSCAR VENTAS DE ESTE USUARIO
        const userCartKey = 'carrito_' + (u.user || u.usuario || u.nombre);
        const carrito = cargarLS(userCartKey, []);

        carrito.forEach(item => {
            const precioTotal = Number(item.precio) * Number(item.cantidad);
            
            // Sumar a estadísticas globales
            contadorVentas += Number(item.cantidad);
            totalIngresos += precioTotal;

            // Poner en la tabla de compras
            const trCompra = document.createElement('tr');
            trCompra.innerHTML = `
                <td>${u.user || u.usuario}</td>
                <td>${item.titulo} <br><small style="color:#888">x${item.cantidad}</small></td>
                <td style="color:#27ae60; font-weight:bold;">S/ ${precioTotal.toFixed(2)}</td>
            `;
            tablaCompras.appendChild(trCompra);
        });
    });

    // 3. ACTUALIZAR TARJETAS SUPERIORES
    totalUsersEl.textContent = usuarios.length;
    totalSalesEl.textContent = contadorVentas;
    totalIncomeEl.textContent = "S/ " + totalIngresos.toFixed(2);
}

// =================== LOGOUT ===================
document.getElementById('logoutAdmin').addEventListener('click', () => {
    localStorage.removeItem('sesionActiva');
    window.location.href = 'index.html';
});

// INICIALIZAR
cargarDashboard();