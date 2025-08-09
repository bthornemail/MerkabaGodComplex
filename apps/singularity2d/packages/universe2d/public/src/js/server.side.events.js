document.addEventListener("DOMContentLoaded", async () => {
    // Your data URL
    const sse = new EventSource("http://localhost:3000/sse");

    sse.addEventListener("message", ({ data }) => {
        console.log(data);
    });

    // sse.addEventListener("createPNGStream", ({data}) => {
    //     console.log(data);
    //     const data = JSON.parse(data);
    //     console.log(data);
    //     // Create an image element and set its source to the received data
    //     const img = new Image();
    //     img.src = 'data:image/png;base64,' + data.base64;
    //     img.onload = function () {
    //         console.log(img)
    //         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //     };
    // });
})
