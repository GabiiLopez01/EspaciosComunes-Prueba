
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



const scrollSpy = new bootstrap.ScrollSpy(document.body, {
    target: '#areasComunes, #reglamentos, #reservaciones'
})



$(document).ready(function () {
    $(".card-title").click(function () {
        $(this).siblings(".card-text").toggle();
    });
});



const timeSelect = document.getElementById('time');
for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const option = new Option(time, time);
        timeSelect.add(option);
    }
}

// Generar opciones de duración en minutos
const durationSelect = document.getElementById('duration');
for (let minutes = 30; minutes <= 480; minutes += 30) {
    const option = new Option(`${minutes} minutos`, minutes.toString());
    durationSelect.add(option);
}

function esDiaHabil(fecha) {
    const dia = fecha.getDay();
    return dia >= 1 && dia <= 5;
}

function esFeriadoIrreducible(fecha) {
    const feriados = [
        '2024-01-01',
        '2024-12-25',
    ];
    const fechaISO = fecha.toISOString().split('T')[0];
    return feriados.includes(fechaISO);
}

function updateAvailability() {
    const suggestions = document.getElementById('suggestions');
    const fechaSeleccionada = new Date(document.getElementById('date').value);
    if (!esDiaHabil(fechaSeleccionada)) {
        suggestions.innerHTML = 'Por favor, seleccione un día hábil.';
    } else if (esFeriadoIrreducible(fechaSeleccionada)) {
        suggestions.innerHTML = 'La fecha seleccionada es un feriado irrenunciable.';
    } else {
        const horarios = Array.from(timeSelect.options).map(option => option.value).join(', ');
        suggestions.innerHTML = `Horarios sugeridos: ${horarios}`;
    }
}

function configurarCalendario() {
    const inputFecha = document.getElementById('date');
    inputFecha.addEventListener('input', () => {
        const fechaSeleccionada = new Date(inputFecha.value);
        if (!esDiaHabil(fechaSeleccionada) || esFeriadoIrreducible(fechaSeleccionada)) {
            inputFecha.setCustomValidity('Seleccione un día hábil.');
        } else {
            inputFecha.setCustomValidity('');
        }
    });

    const hoy = new Date();
    const fechaMinima = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    inputFecha.min = fechaMinima.toISOString().split('T')[0];

    inputFecha.addEventListener('change', (e) => {
        const fechaSeleccionada = new Date(e.target.value);
        if (!esDiaHabil(fechaSeleccionada) || esFeriadoIrreducible(fechaSeleccionada)) {
            alert('El día seleccionado no es válido. Seleccione un día hábil.');
            e.target.value = '';
        }
    });
}

document.getElementById('reservationForm').onsubmit = function (e) {
    e.preventDefault();
    const startTime = timeSelect.value;
    const duration = parseInt(durationSelect.value, 10);
    const [hours, minutes] = startTime.split(':').map(Number);
    const endTime = new Date(2000, 0, 1, hours, minutes + duration);

    if (endTime.getHours() > 20 || (endTime.getHours() === 20 && endTime.getMinutes() > 0)) {
        alert('La reserva no puede extenderse más allá de las 8:00 PM.');
        return;
    }

    const participants = document.getElementById('participants').value;
    let message = 'Reserva enviada.\n';
    message += `Hora: ${startTime} - ${endTime.getHours()}:${endTime.getMinutes().toString().padStart(2, '0')}\n`;
    if (participants) {
        message += `Participantes adicionales: ${participants}`;
    }
    alert(message);
};

document.getElementById('cancelReservation').onclick = function () {
    alert('Funcionalidad para anular reservas no implementada.');
};

document.getElementById('date').addEventListener('change', updateAvailability)