
document.addEventListener("DOMContentLoaded", () => {
    // var containerSvg = document.getElementById("svg-container");
    var containerSvg = document.querySelector("body");
    let startX;
    let startY;
    containerSvg.addEventListener('touchstart', function (e) {
        const log = document.getElementById('log')
        log.textContent = `x: ${e.touches[0].clientX},y: ${e.touches[0].clientY}`;
        document.querySelector('body').prepend(log)
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, false);

    containerSvg.addEventListener('touchmove', function (e) {
        const log = document.getElementById('log')
        log.textContent = `x: ${e.touches[0].clientX},y: ${e.touches[0].clientY}`;
        document.querySelector('body').prepend(log)
        let moveY = e.touches[0].clientY;
        let moveX = e.touches[0].clientX;
        window.scrollBy(0, startX - moveX);
        window.scrollBy(0, startY - moveY);
        startX = moveX; // Reset startX for continuous scrolling
        startY = moveY; // Reset startY for continuous scrolling
    }, false);
    containerSvg.addEventListener('mouseover', function (e) {
        // alert('moved')
        const log = document.getElementById('log')
        log.textContent = `x: ${e.clientX},y: ${e.clientY}`;
        // document.querySelector('body').prepend(log)
        let moveY = e.clientY;
        let moveX = e.clientX;
        window.scrollBy(0, startX - moveX);
        window.scrollBy(0, startY - moveY);
        startX = moveX; // Reset startX for continuous scrolling
        startY = moveY; // Reset startY for continuous scrolling
    }, false);
    containerSvg.addEventListener('mousemove', function (e) {
        const log = document.getElementById('log')
        log.textContent = `x: ${e.clientX},y: ${e.clientY}`;
        // document.querySelector('body').prepend(log)
        let moveY = e.clientY;
        let moveX = e.clientX;
        window.scrollBy(0, startX - moveX);
        window.scrollBy(0, startY - moveY);
        startX = moveX; // Reset startX for continuous scrolling
        startY = moveY; // Reset startY for continuous scrolling
    }, false);
}); 
