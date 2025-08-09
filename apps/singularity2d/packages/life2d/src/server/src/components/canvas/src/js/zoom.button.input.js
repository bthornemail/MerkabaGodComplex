document.addEventListener("DOMContentLoaded", () => {

    var zoomIn = document.getElementById("zoom-in-canvas-btn");
    var centerCanvas = document.getElementById("center-canvas-btn");
    var zoomOut = document.getElementById("zoom-out-canvas-btn");

    zoomIn.addEventListener('click', () => {
        var containerSvg = document.getElementById("containerSvg");
        var viewBox = containerSvg.getAttribute("viewBox").split(' ');
        viewBox[2] = parseFloat(viewBox[2]) / 2;
        viewBox[3] = parseFloat(viewBox[3]) / 2;
        containerSvg.setAttribute("viewBox", viewBox.join(' '))
    })
    centerCanvas.addEventListener('click', () => {
        var containerSvg = document.getElementById("containerSvg");
        var viewBox = containerSvg.getAttribute("viewBox").split(' ');
        viewBox[0] = parseFloat(containerSvg.width) / 2;
        viewBox[1] = parseFloat(containerSvg.height) / 2;
        viewBox[2] = 400;
        viewBox[3] = 400;
        containerSvg.setAttribute("viewBox", viewBox.join(' '))
    })
    zoomOut.addEventListener('click', () => {
        var containerSvg = document.getElementById("containerSvg");
        var newViewBox = "50 50 200 200"; // minX minY width height
        var viewBox = containerSvg.getAttribute("viewBox").split(' ');
        viewBox[2] = parseFloat(viewBox[2]) * 2;
        viewBox[3] = parseFloat(viewBox[3]) * 2;
        containerSvg.setAttribute("viewBox", viewBox.join(' '))
    })
}); 
