
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
