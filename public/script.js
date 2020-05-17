let canvas = document.querySelector("canvas");
let colorInput = document.getElementById("signature-color");

colorInput.addEventListener("input", function() {
    context.strokeStyle = colorInput.value;
});

let drawing = false;
let x = 0;
let y = 0;
let x2 = 0;
let y2 = 0;

let context = canvas.getContext("2d");
context.lineWidth = 0.5;

canvas.addEventListener("mousedown", function(e) {
    x = e.offsetX;
    y = e.offsetY;

    drawing = true;
    context.beginPath();
    context.moveTo(x, y);
});

canvas.addEventListener("mousemove", function(e) {
    x2 = e.offsetX;
    y2 = e.offsetY;

    if (drawing === true) {
        drawline(x2, y2);
    }
});

document.addEventListener("mouseup", function() {
    drawing = false;

    let dataURL = canvas.toDataURL("image/png", 1.0);
    document.getElementById("signature").value = dataURL;

    context.closePath();
});

//responsive
canvas.addEventListener("touchstart", function(e) {
    e.preventDefault();
    x = e.offsetX;
    y = e.offsetY;

    drawing = true;
    context.beginPath();
    context.moveTo(x, y);
});

canvas.addEventListener("touchmove", function(e) {
    e.preventDefault();
    x2 = e.offsetX;
    y2 = e.offsetY;

    if (drawing === true) {
        drawline(x2, y2);
    }
});

document.addEventListener("touchend", function() {
    e.preventDefault();
    drawing = false;

    let dataURL = canvas.toDataURL("image/png", 1.0);
    document.getElementById("signature").value = dataURL;

    context.closePath();
});

function drawline(x2, y2) {
    context.lineTo(x2, y2);
    context.stroke();
}
