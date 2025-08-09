function newImage(node) {
    const imageContainer = document.createElement("div")
    imageContainer.style.display = "flex"
    imageContainer.style.alignItems = "center"
    imageContainer.style.justifyContent = "center"
    imageContainer.style.width = "100%"
    imageContainer.style.height = "100%"
    const myImage = new Image();
    myImage.src = node.imgSrc;
    myImage.style.minHeight = 120;
    myImage.style.minWidth = 120;
    imageContainer.append(myImage)
    // return myImage
    return imageContainer
}