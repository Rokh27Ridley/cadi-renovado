let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slides .card-image');
const dots = document.querySelectorAll('.dot');
const btnLogout = document.querySelector('.btn-logout');

if (btnLogout) {
    btnLogout.addEventListener('click', e => {
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 500);
    });
}

// Muestra la diapositiva en base al índice enviado
function showSlide(index) {
    if (index >= slides.length) { slideIndex = 0; }
    if (index < 0) { slideIndex = slides.length - 1; }

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

// Control manual cuando el usuario da clic en un círculo
function currentSlide(index) {
    slideIndex = index;
    showSlide(slideIndex);
    resetTimer();
}

// Temporizador automático: cambia de foto cada 4 segundos
let slideTimer = setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);
}, 4000);

function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 4000);
}

// Almacenamiento de reservas en el navegador
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

const reservas = obtenerReservas();

document.getElementById('reservationForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const area = document.getElementById('area').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const errorMessage = document.getElementById('error-message');

    if (!area || !fecha || !hora) {
        errorMessage.innerHTML = 'Please select an area, date and hour.';
        return;
    }

    const hoy = toInputDate(dateOnly(new Date()));
    if (fecha === hoy) {
        const horaSeleccionada = parseInt(hora, 10);
        const horaActual = new Date().getHours();
        if (horaSeleccionada < horaActual) {
            alert("No puedes reservar en una hora anterior a la actual.");
            return;
        }
    }

    const duplicada = reservas.some(r => r.fecha === fecha && r.hora === hora);
    if (duplicada) {
        alert("Ya existe una reserva para el mismo día y la misma hora.");
        return;
    }

    reservas.push({
        area: area,
        fecha: fecha,
        hora: hora,
        creada: new Date().toISOString()
    });
    guardarReservas(reservas);

    const micro = document.getElementById('microInteraction');
    micro.style.display = 'flex';

    const button = this.querySelector('button[type="submit"]');
    button.disabled = true;
    button.style.opacity = '0.5';

    setTimeout(function () {
        window.location.href = "reservas.html";
    }, 2000);
});

function toInputDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + dia;
}

function dateOnly(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function obtenerSabado(d) {
    const sabado = new Date(d);
    const dia = sabado.getDay();
    sabado.setDate(sabado.getDate() + ((6 - dia) % 7));
    sabado.setHours(0, 0, 0, 0);
    return sabado;
}

const inputFecha = document.getElementById('fecha');
const inputHora = document.getElementById('hora');

function ajustarHoras() {
    if (!inputFecha || !inputHora) return;
    const sel = new Date(inputFecha.value + 'T00:00:00');
    const esSabado = inputFecha.value !== '' && sel.getDay() === 6;
    Array.from(inputHora.options).forEach(op => {
        op.disabled = esSabado && op.value !== '' && op.value > '14:00';
    });
}

function validarFecha(input) {
    const ahora = new Date();
    const dia = ahora.getDay();
    const minutos = ahora.getHours() * 60 + ahora.getMinutes();

    ajustarHoras();

    if (input.value === '') return;

    const sel = new Date(input.value + 'T00:00:00');

    // No permitir fechas pasadas
    if (sel < dateOnly(ahora)) {
        alert("No puedes agendar una reserva antes del día de hoy.");
        input.value = "";
        ajustarHoras();
        return;
    }

    // No permitir agendar fuera de la semana actual (más allá del sábado)
    const maxFecha = obtenerSabado(ahora);
    if (sel > maxFecha) {
        alert("Solo puedes agendar dentro de la semana actual, de lunes a sábado.");
        input.value = "";
        ajustarHoras();
        return;
    }

    // Ventana de reserva abierta: de lunes 08:00 a sábado 14:00
    let abierta = true;
    if (dia === 0) {
        abierta = false;
    } else if (dia === 6 && minutos >= 14 * 60) {
        abierta = false;
    } else if (dia === 1 && minutos < 8 * 60) {
        abierta = false;
    }

    if (!abierta) {
        alert("El CADI no acepta reservas en este momento. El horario de reserva es de lunes a sábado, de 08:00 a 14:00 hrs. Se reabre el lunes a las 08:00 hrs.");
        input.value = "";
        ajustarHoras();
    }
}

if (inputFecha) {
    inputFecha.min = toInputDate(dateOnly(new Date()));
    inputFecha.max = toInputDate(obtenerSabado(new Date()));
    inputFecha.addEventListener('change', ajustarHoras);
    ajustarHoras();
}

