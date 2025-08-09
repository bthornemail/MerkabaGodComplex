
const header = document.querySelector("header");
// var header = document.getElementById("header");
var sticky = header.offsetTop;

function stickyHeader() {
  if (window.scrollY > sticky) {
    ''
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}
window.addEventListener("scroll", () => {
  // console.log("Scrolling")
  // console.log("window.parent.pageYOffset", window.parent.pageYOffset)
  // console.log("window.pageYOffset", window.pageYOffset)
  // console.log("sticky", sticky)
  stickyHeader()
})