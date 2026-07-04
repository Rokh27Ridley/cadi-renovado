let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-slides .card-image');
const dots = document.querySelectorAll('.dot');
const btnLogout = document.querySelector('.btn-logout');

/*hacer un sistema para poder evaluar hora, fecha y demas para poner mensajes personalizados debajo*/

if(btnLogout){
    btnLogout.addEventListener('click', e=> {
        //activa el fadeout para salir de la sesion
        e.preventDefault();
        document.body.classList.add('fade-out');
        setTimeout(()=> {
            window.location.href = 'index.html';
        }, 500);
    });
}

// Muestra la diapositiva en base al índice enviado
function showSlide(index) {
    if (index >= slides.length) { slideIndex = 0; }
    if (index < 0) { slideIndex = slides.length - 1; }

    // Limpia la clase active de todas las fotos y círculos
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Asigna la clase active al elemento actual
    slides[slideIndex].classList.add('active');
    dots[slideIndex].classList.add('active');
}

// Control manual cuando el usuario da clic en un círculo
function currentSlide(index) {
    slideIndex = index;
    showSlide(slideIndex);
    resetTimer(); // Reinicia el contador automático para evitar saltos bruscos
}

// Temporizador automático: cambia de foto cada 4 segundos (4000ms)
let slideTimer = setInterval(() => {
    slideIndex++;
    showSlide(slideIndex);
}, 4000);

// Función para reiniciar el tiempo automático tras interacción manual
function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 4000);
}

document.getElementById('reservationForm').addEventListener('submit', function(event) {
    // 1. Detiene el envío automático del formulario
    event.preventDefault(); 

    // 2. Muestra el contenedor de la microinteracción
    const micro = document.getElementById('microInteraction');
    micro.style.display = 'flex'; 

    // 3. Desactiva el botón para evitar que den doble clic
    const button = this.querySelector('button[type="submit"]');
    button.disabled = true;
    button.style.opacity = '0.5';

    // 4. Espera 2 segundos (2000 milisegundos) y redirige
    setTimeout(function() {
        window.location.href = "agenda.html";
    }, 2000); 
});
function validarFinDeSemana(input) {
    const fechaSeleccionada = new Date(input.value + 'T00:00:00');
    const diaSemana = fechaSeleccionada.getDay(); // 0 = Domingo, 6 = Sábado

    // Si el día es Sábado (6) o Domingo (0)
    if (diaSemana === 0) {
        alert("El CADI está cerrado los Domingos. Por favor, selecciona un día de lunes a sabado.");
        input.value = ""; // Borra la fecha incorrecta seleccionada
    }
}
function validarHora(input) {
    const horaSeleccionada = input.value;
    const horaMinima = "07:00";
    const horaMaxima = "19:00";
    const horaSabado = "13:00";
    
    
    if (horaSeleccionada < horaMinima || horaSeleccionada > horaMaxima){
        alert("CADI no admite reservas fuera del horario de 07:00 a 19:00. Por favor, selecciona una hora dentro de este rango.");
        input.value = ""; // Borra la hora incorrecta seleccionada
    }
}

