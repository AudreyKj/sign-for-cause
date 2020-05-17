const input_color = document.querySelector("input.input-color");
const body = document.querySelector("body");
const title = document.querySelector("h1");
const colorDiv = document.querySelector("div.color");
const button = document.querySelector(".button");
const label = document.querySelector("label");

input_color.addEventListener("input", function() {
    body.style.backgroundColor = input_color.value;

    const color = chroma(input_color.value);

    if (color.luminance() > 0.5) {
        body.classList.add("light");
        title.classList.add("light");
        colorDiv.classList.add("light");
        button.classList.add("light");
        label.classList.add("light");
    } else {
        body.classList.remove("light");
        title.classList.remove("light");
        colorDiv.classList.remove("light");
        button.classList.remove("light");
        label.classList.remove("light");
    }
});
