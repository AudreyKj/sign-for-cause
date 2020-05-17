let canvas = document.querySelector("canvas");
let colorInput = document.getElementById("signature-color");

console.log("colorInput", colorInput);

colorInput.addEventListener("input", function() {
    console.log("colorInput", colorInput.value);
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
    console.log("x", x);
    console.log("y", y);
    console.log("e.offsetX", e.offsetX);
    console.log("e.offsetY", e.offsetY);
    drawing = true;
    context.beginPath();
    context.moveTo(x, y);
});

canvas.addEventListener("mousemove", function(e) {
    console.log("x2", x2);
    console.log("y2", y2);
    x2 = e.offsetX;
    y2 = e.offsetY;

    if (drawing === true) {
        console.log("canvas offsetLeft", canvas.offsetLeft);
        console.log("canvas offsetTop", canvas.offsetTop);
        drawline(x2, y2);
    }
});

document.addEventListener("mouseup", function() {
    drawing = false;

    let dataURL = canvas.toDataURL("image/png", 1.0);
    document.getElementById("signature").value = dataURL;
    //$("input#sign").val($("canvas")[0].toDataurl());
    console.log("data URL", dataURL);
    context.closePath();
});

//responsive
canvas.addEventListener("touchstart", function(e) {
    x = e.offsetX;
    y = e.offsetY;
    console.log("x", x);
    console.log("y", y);
    console.log("e.offsetX", e.offsetX);
    console.log("e.offsetY", e.offsetY);
    drawing = true;
    context.beginPath();
    context.moveTo(x, y);
});

canvas.addEventListener("touchmove", function(e) {
    console.log("x2", x2);
    console.log("y2", y2);
    x2 = e.offsetX;
    y2 = e.offsetY;

    if (drawing === true) {
        console.log("canvas offsetLeft", canvas.offsetLeft);
        console.log("canvas offsetTop", canvas.offsetTop);
        drawline(x2, y2);
    }
});

document.addEventListener("touchend", function() {
    drawing = false;

    let dataURL = canvas.toDataURL("image/png", 1.0);
    document.getElementById("signature").value = dataURL;
    //$("input#sign").val($("canvas")[0].toDataurl());
    console.log("data URL", dataURL);
    context.closePath();
});

//prevent scroll on touch
document.body.addEventListener(
    "touchstart",
    function(e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    },
    false
);
document.body.addEventListener(
    "touchend",
    function(e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    },
    false
);
document.body.addEventListener(
    "touchmove",
    function(e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    },
    false
);

function drawline(x2, y2) {
    context.lineTo(x2, y2);
    context.stroke();
}
