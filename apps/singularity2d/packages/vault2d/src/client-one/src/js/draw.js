
function draw() {
    const canvas = document.querySelector("#neural-net-graph-view");
    canvas.width = window.innerWidth
    canvas.height = window.innerWidth
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(10, 10, window.innerWidth - (20 * 2), window.innerHeight - (10 * 2));

        ctx.fillStyle = "rgba(0, 128, 0, .15)";
        // ctx.fillStyle = "rgba(0, 0, 0, .85)";
        ctx.fillRect(128, 84, window.innerWidth - (128 * 2), window.innerHeight - (84 * 2));

        const stream = canvas.captureStream(25); // 25 FPS
        // const video = document.createElement("video");
        // video.controls = true;
        // video.autoplay = true;

        // video.srcObject = stream;
        // video.play();

        const canvasMiniMap = document.getElementById("canvas-mini-map");
        // Set the size of the mini map
        canvasMiniMap.width = 300; // for example
        canvasMiniMap.height = 150; // for example
        if (canvasMiniMap.getContext) {
            const miniMapContext = canvasMiniMap.getContext("2d");
            // Draw the mini map
            ctx.fillStyle = "rgba(255, 0, 0, .25)";
            ctx.fillRect(window.innerWidth - (128 * 3), window.innerHeight - (84 * 3), 300, 150);
            // Function to draw on the mini-map
            function drawMiniMap() {
                // Clear the mini-map
                miniMapContext.clearRect(0, 0, canvasMiniMap.width, canvasMiniMap.height);

                // Draw a scaled-down version of the main canvas on the mini-map
                miniMapContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, canvasMiniMap.width, canvasMiniMap.height);

                // Continue drawing
                requestAnimationFrame(drawMiniMap);
            }

            drawMiniMap(); // Start the mini-map drawing loop
        }
    }
}
window.addEventListener("load", draw);
// const canvasMiniMap = document.getElementById("canvas-mini-map");

