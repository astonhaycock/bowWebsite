let content = document.getElementById("content");
let links = document.getElementById("links");

function toggleMenu() {
    
    links.classList.toggle("closed");
    console.log("toggleMenu() called");
}
let hamburger = document.getElementById("hamburger");

hamburger.addEventListener("click", toggleMenu);

links.classList.add("closed");

