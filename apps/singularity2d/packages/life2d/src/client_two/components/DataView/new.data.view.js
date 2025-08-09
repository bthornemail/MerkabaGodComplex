function newDataView(node) {
    const card = document.createElement("div")
    const cardTitle = document.createElement("div")
    const cardBody = document.createElement("div")

    card.classList.add("card")
    // card.style.display = "flex"
    // card.style.alignItems = "center"
    // card.style.justifyContent = "space-around"
    card.style.width = "100%"
    card.style.height = "100%"
    cardTitle.classList.add("card-title")
    cardBody.classList.add("card-body")
    if(node.title) { cardTitle.textContent = node.title }
    else if(node.label) { cardTitle.innerHTML = node.label }
    if(node.text) { cardBody.textContent = node.text }
    else if(node.html){ cardBody.innerHTML = node.html }
    else if(node.data){ cardBody.textContent = JSON.stringify(node.data) }
    card.append(cardTitle)
    card.append(cardBody)
    return card
}
