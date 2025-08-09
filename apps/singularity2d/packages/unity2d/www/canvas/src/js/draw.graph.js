const canvas = document.querySelector("#neural-net-graph-view");
if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "http://localhost:3000/stream" // 'data:image/png;base64,' + data.base64;

    let lastImageData;

    img.onload = function () {
        console.log('img', img)
        lastImageData = img;
        // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    // Event listener for canvas click
    canvas.addEventListener('click', function (event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        nodes.forEach(node => {
            if (isPointInNode(x, y, node)) {
                console.log('Node clicked:', node);
                // Handle node click
            }
        });
    });
    animate = () => {
        if (lastImageData) {
            ctx.drawImage(lastImageData, 0, 0, canvas.width, canvas.height);
        }
        requestAnimationFrame(animate);
    }

    animate();
}
