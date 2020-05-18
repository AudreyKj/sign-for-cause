let canvas = document.querySelector("canvas#signature");

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
context.lineWidth = 1.5;

function drawline(x2, y2) {
    context.lineTo(x2, y2);
    context.stroke();
}

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

//mobile
canvas.addEventListener("touchstart", function(e) {
    //e.preventDefault();
    drawing = true;

    console.log(context);
    context.moveTo(e.touches[0].clientX, e.touches[0].clientY);
    console.log("e.touches[0].clientX", e.touches[0].clientX);
    console.log("e.touches[0].clientY", e.touches[0].clientY);
    context.beginPath();
});

canvas.addEventListener("touchmove", function(e) {
    e.preventDefault();
    if (drawing === true) {
        drawline(e.touches[0].clientX, e.touches[0].clientY);
    }
});

canvas.addEventListener("touchend", function(e) {
    e.preventDefault();
    drawing = false;

    let dataURL = canvas.toDataURL("image/png", 1.0);
    document.getElementById("signature").value = dataURL;

    context.closePath();
});
