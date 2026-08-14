const grid = document.getElementById('reservas-grid');
const btnLimpiar = document.getElementById('btn-limpiar');
const btnInfo = document.getElementById('btn-info');
const modalConfirm = document.getElementById('modal-confirm');
const modalInfo = document.getElementById('modal-info');
const confirmTitle = document.getElementById('confirm-title');
const confirmText = document.getElementById('confirm-text');
const confirmNo = document.getElementById('confirm-no');
const confirmYes = document.getElementById('confirm-yes');

const TOTAL_SEMANAL = 3;

let pendiente = null;

function obtenerReservas() {
    try {
        return JSON.parse(localStorage.getItem('cadiReservas')) || [];
    } catch (e) {
        return [];
    }
}

function guardarReservas(reservas) {
    localStorage.setItem('cadiReservas', JSON.stringify(reservas));
}

function obtenerCanceladas() {
    const valor = parseInt(localStorage.getItem('cadiCanceladas') || '0', 10);
    return isNaN(valor) ? 0 : valor;
}

function guardarCanceladas(cantidad) {
    localStorage.setItem('cadiCanceladas', String(cantidad));
}

function formatearFecha(fecha) {
    if (!fecha) return '';
    const partes = fecha.split('-');
    if (partes.length !== 3) return fecha;
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function abrirConfirm(titulo, texto, accion) {
    confirmTitle.textContent = titulo;
    confirmText.textContent = texto;
    pendiente = accion;
    modalConfirm.classList.add('abierto');
}

function cerrarConfirm() {
    modalConfirm.classList.remove('abierto');
    pendiente = null;
}

function renderizar() {
    const reservas = obtenerReservas();

    if (reservas.length === 0) {
        grid.innerHTML = `
            <div class="reserva-vacio">
                <img src="leoncito.png" alt="Sin reservas">
                No tienes reservas aún.
            </div>`;
    } else {
        grid.innerHTML = reservas.map((reserva, index) => `
            <div class="reserva-card">
                <span class="reserva-area">${reserva.area}</span>
                <span class="reserva-detalle">
                    <span class="reserva-fecha">${formatearFecha(reserva.fecha)}</span>
                    &nbsp;&middot;&nbsp;${reserva.hora}
                </span>
                <button type="button" class="borrar-reserva" data-index="${index}">Cancelar</button>
            </div>
        `).join('');
    }
}

function exportarPanel() {
    const reservas = obtenerReservas();
    const canceladas = obtenerCanceladas();
    const disponibles = Math.max(0, TOTAL_SEMANAL - reservas.length);
    document.getElementById('info-actuales').textContent = reservas.length;
    document.getElementById('info-disponibles').textContent = disponibles;
    document.getElementById('info-canceladas').textContent = canceladas;
}

function recargar() {
    renderizar();
    exportarPanel();
}

grid.addEventListener('click', e => {
    if (e.target.classList.contains('borrar-reserva')) {
        const index = Number(e.target.dataset.index);
        const reservas = obtenerReservas();
        const reserva = reservas[index];
        abrirConfirm(
            'Confirmar cancelación',
            '¿Deseas cancelar tu reserva del ' + formatearFecha(reserva.fecha) + ' a las ' + reserva.hora + '?',
            function () {
                reservas.splice(index, 1);
                guardarReservas(reservas);
                guardarCanceladas(obtenerCanceladas() + 1);
            }
        );
    }
});

confirmNo.addEventListener('click', cerrarConfirm);

confirmYes.addEventListener('click', () => {
    if (pendiente) {
        pendiente();
        pendiente = null;
    }
    cerrarConfirm();
    recargar();
});

btnLimpiar.addEventListener('click', () => {
    abrirConfirm(
        'Limpiar todo',
        '¡Advertencia! Esto cancelará todas las reservas de la semana.',
        function () {
            const reservas = obtenerReservas();
            guardarReservas([]);
            guardarCanceladas(obtenerCanceladas() + reservas.length);
        }
    );
});

modalConfirm.addEventListener('click', e => {
    if (e.target === modalConfirm) cerrarConfirm();
});

btnInfo.addEventListener('click', () => {
    exportarPanel();
    modalInfo.classList.add('abierto');
});

document.getElementById('info-close').addEventListener('click', () => {
    modalInfo.classList.remove('abierto');
});

modalInfo.addEventListener('click', e => {
    if (e.target === modalInfo) modalInfo.classList.remove('abierto');
});

recargar();