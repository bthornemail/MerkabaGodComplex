document.addEventListener("DOMContentLoaded", () => {

    const body = document.querySelector("body")
    var containerSvg = document.getElementById("svg-container");
    var mainSvg = document.getElementById("main-svg");
    var viewBox = mainSvg.getAttribute("viewBox").split(' ');
    const addNodeButton = document.querySelector("#add-node")
    // mainSvg.style.backgroundColor = "red";

    addNodeButton.addEventListener("click", (e) => {
        e.preventDefault()
        
        var svgImage = document.createElementNS("http://www.w3.org/2000/svg", "image");
        svgImage.setAttributeNS("http://www.w3.org/1999/xlink", "href", "/big-data-connection-network-svgrepo-com.svg");
        const imgWidth = 48;
        svgImage.setAttribute("height", imgWidth);  // Set as needed
        svgImage.setAttribute("width", imgWidth);   // Set as needed
        //alert(mainSvg.getBoundingClientRect().x)
        //alert(mainSvg.getBoundingClientRect().y)
        //alert(mainSvg.getBoundingClientRect().top)
        //alert(mainSvg.getBoundingClientRect().left)
        //alert(mainSvg.getBoundingClientRect().right)
        //alert(mainSvg.getBoundingClientRect().bottom)
        //const x = (mainSvg.getBoundingClientRect().right) / 2;
        //const y = (mainSvg.getBoundingClientRect().bottom) / 2;
        svgImage.setAttribute("x", (viewBox[0] - imgWidth) * 0.5);
        svgImage.setAttribute("y", (viewBox[1] - imgWidth) * 0.5);
        window.scrollTo(viewBox[0] * 0.5, viewBox[1] * 0.5)
        // viewBox[0] = parseInt(mainSvg.width / 2);
        // viewBox[1] = parseInt(mainSvg.height / 2);
        // console.log(viewBox[0])
        // console.log(viewBox[1])
        //viewBox[2] = 400;
        //viewBox[3] = 400;
        // mainSvg.setAttribute("viewBox", viewBox.join(' '))

        svgImage.addEventListener('click', (event) => {
            // Check if the clicked element is the item we want to center
            var item = event.currentTarget;
            var mainSvg = document.getElementById("main-svg");
            var svgRect = mainSvg.getBoundingClientRect();

            // Get item's center coordinates
            var itemX = item.cx.baseVal.value;
            var itemY = item.cy.baseVal.value;

            // Calculate new viewBox values to center on the item
            var newViewBoxX = itemX - svgRect.width / 2;
            var newViewBoxY = itemY - svgRect.height / 2;
            var newViewBox = [newViewBoxX, newViewBoxY, svgRect.width, svgRect.height];

            // Update the viewBox of the SVG
            mainSvg.setAttribute("viewBox", newViewBox.join(' '));
        });

        svgImage.addEventListener('click', (e) => {
            // Function to move the SVG element
            // New position coordinates, e.g., incrementing the current position
            var newX = parseInt(e.target.getAttribute("x")) + (window.innerWidth * .1 * Math.random(-1, 1));
            var newY = parseInt(e.target.getAttribute("y")) + (window.innerHeight * .1 * Math.random(-1, 1));
            e.target.setAttribute("x", newX);
            e.target.setAttribute("y", newY);
        })
        mainSvg.appendChild(svgImage);
    })

}); 
