export default async function createPanel(innerHtml){
    const {
        x,
        y,
        width,
        height,
        top,
        right,
        bottom,
        left,
    } = document.getElementById("graph-display-card").getBoundingClientRect();
    console.log({
        x,
        y,
        width,
        height,
        top,
        right,
        bottom,
        left,
    })
    const panel = document.createElement("div");
    // // panel.innerHTML = `<div ><h1>&nbsp;</h1><p style="min-width:${width}px;">New Doc</p></div>`
    panel.style.position = "absolute";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.gap = ".5rem";
    // panel.style.alignItems = "center";
    // panel.style.justifyContent = "center";
    panel.style.margin = "0";
    // panel.style.top = top;
    // panel.style.bottom = bottom;
    panel.style.bottom = 0;
    panel.style.left = 0;
    // panel.style.left = left;
    // panel.style.right = right;
    // panel.style.width = width;
    panel.style.width = "min-content";
    panel.style.height = "min-content";
    // panel.style.height = height;
    // panel.style.x = x;
    // panel.style.y = y;
    // panel.style.width = width / 4 + "px";
    // panel.style.height = height / 4 + "px";
    // // panel.style.minWidth = width;
    // // panel.style.minHeight = height;
    // panel.style.border = "thin solid white";
    panel.style.borderRadius = "0 15px 0 0";
    panel.style.padding = "8px";
    panel.style.paddingTop = "15px";
    panel.style.paddingRight = "15px";
    // // panel.style.zIndex = 2;
    // // panel.style.pointerEvents = "none";
    panel.style.cursor = "pointer";
    // panel.style.backgroundColor = "rgba(0, 255, 0, .15)";
    innerHtml.forEach((ele)=>{
        panel.append(ele);
    })
    document.getElementById("graph-display-card").append(panel);
    return panel;
};
