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
    const historialVentas = cargarLS('historialVentas', []); // <--- LEER HISTORIAL
    
    const tablaUsuarios = document.querySelector('#tablaUsuarios tbody');
    const tablaCompras = document.querySelector('#tablaCompras tbody');
    
    const totalUsersEl = document.getElementById('totalUsers');
    const totalSalesEl = document.getElementById('totalSales');
    const totalIncomeEl = document.getElementById('totalIncome');

    // 1. TABLA USUARIOS
    tablaUsuarios.innerHTML = '';
    usuarios.forEach(u => {
        const badgeClass = u.rol === 'Admin' ? 'role-admin' : 'role-cliente';
        tablaUsuarios.innerHTML += `
            <tr>
                <td><div style="font-weight:600">${u.user || u.usuario || u.nombre}</div></td>
                <td>${u.email}</td>
                <td><span class="role-badge ${badgeClass}">${u.rol}</span></td>
            </tr>`;
    });

    // 2. TABLA VENTAS (HISTORIAL)
    tablaCompras.innerHTML = '';
    let contadorItems = 0;
    let totalDinero = 0;

    // Recorremos el historial (invertido para ver lo más reciente primero)
    historialVentas.slice().reverse().forEach(venta => {
        // Limpiar el texto "S/ " para sumar
        const monto = parseFloat(venta.total.replace('S/ ', '').replace('Total: ', '')) || 0;
        totalDinero += monto;

        // Crear resumen de productos
        let resumen = "";
        venta.items.forEach(item => {
            contadorItems += Number(item.cantidad);
            resumen += `<div>• ${item.titulo} (x${item.cantidad})</div>`;
        });

        tablaCompras.innerHTML += `
            <tr>
                <td>
                    <strong>${venta.usuario}</strong><br>
                    <small style="color:#888">${venta.fecha}</small>
                </td>
                <td style="font-size:13px">${resumen}</td>
                <td style="color:#27ae60; font-weight:bold">${venta.total}</td>
            </tr>`;
    });

    // 3. ACTUALIZAR TARJETAS
    totalUsersEl.textContent = usuarios.length;
    totalSalesEl.textContent = contadorItems;
    totalIncomeEl.textContent = "S/ " + totalDinero.toFixed(2);
}

// =================== LOGOUT ===================
document.getElementById('logoutAdmin').addEventListener('click', () => {
    localStorage.removeItem('sesionActiva');
    window.location.href = 'index.html';
});

// INICIALIZAR
cargarDashboard();