
let jsonData = [];

// Function to display JSON structure in the outline
function updateOutline() {
    const outlineList = document.getElementById('outline-list');
    outlineList.innerHTML = '';
    Object.entries(jsonData).forEach(([key, value], index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item draggable';
        listItem.textContent = key;
        listItem.setAttribute('data-index', index);
        listItem.onclick = () => editElement(index);
        outlineList.appendChild(listItem);
    });
}

// Filter outline items based on search input
document.getElementById('search-bar').addEventListener('input', function () {
    const filter = this.value.toLowerCase();
    const items = document.querySelectorAll('#outline-list .list-group-item');
    items.forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(filter) ? '' : 'none';
    });
});

// Function to add a new element to JSON data
function addElement() {
    const type = prompt('Enter element type (string, number, array, object):').toLowerCase();
    let newElement = null;

    switch (type) {
        case 'string':
            newElement = prompt('Enter string value:');
            break;
        case 'number':
            newElement = parseFloat(prompt('Enter number value:'));
            break;
        case 'array':
            newElement = [];
            break;
        case 'object':
            newElement = {};
            break;
        default:
            alert('Invalid type');
            return;
    }

    const newName = prompt('Enter element name:');
    if (newName) {
        jsonData.push({ name: newName, value: newElement });
        updateOutline();
        updateEditor();
    }
}

// Function to edit an element
function editElement(index) {
    const element = jsonData[index];
    const newName = prompt('Edit element name:', element.name);
    let newValue = element.value;

    if (Array.isArray(newValue)) {
        newValue = JSON.parse(prompt('Edit array (comma-separated values):', JSON.stringify(newValue)));
    } else if (typeof newValue === 'object' && newValue !== null) {
        newValue = JSON.parse(prompt('Edit object (JSON format):', JSON.stringify(newValue)));
    } else if (typeof newValue === 'number') {
        newValue = parseFloat(prompt('Edit number value:', newValue));
    } else {
        newValue = prompt('Edit string value:', newValue);
    }

    if (newName !== null && newValue !== null) {
        jsonData[index] = { name: newName, value: newValue };
        updateOutline();
        updateEditor();
    }
}
function getRandomColor(index) {
    const bootstrapColors = [
        "rgb(0, 123, 255)",     // Primary
        "rgb(108, 117, 125)",   // Secondary
        "rgb(40, 167, 69)",     // Success
        "rgb(255, 193, 7)",     // Warning
        "rgb(220, 53, 69)",     // Danger
        "rgb(23, 162, 184)",    // Info
        "rgb(52, 58, 64)",      // Dark
        // "rgb(248, 249, 250)",   // Light
        // "rgb(255, 255, 255)"    // White
    ];

    const randomIndex = index < bootstrapColors.length ? index : Math.floor(Math.random() * bootstrapColors.length);
    return bootstrapColors[randomIndex];
}
// Function to display JSON data in the editor area
function formatEditor(editorArea, jsonData) {
    editorArea.innerHTML = '';
    const backgroundColor = getRandomColor();
    Object.entries(jsonData).forEach(([key, value], index) => {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'p-2 mb-2 border draggable';
        // elementDiv.textContent = `${key}:\n ${JSON.stringify(value)}`;
        elementDiv.setAttribute('data-index', index);
        const child = document.createElement('div');
        try {
            const superScript = document.createElement('super');
            superScript.textContent = `${key}:`
            superScript.style.color = backgroundColor//"lightgrey";
            superScript.style.backgroundColor = "lightgrey";
            // superScript.classList.add("badge")
            // superScript.classList.add("badge-sm")
            superScript.style.width = "100%";
            if (typeof value !== "string") {
                if (!value) return;
                if(Array.isArray(value)){
                    formatEditor(child, Object.fromEntries(value));
                } 
                formatEditor(child, value);
            } else {
                child.textContent = `${JSON.stringify(value)}`
            }
            elementDiv.append(superScript)
        } catch (error) {
            console.log(error)
        }
        elementDiv.append(child)
        editorArea.appendChild(elementDiv);
    });
}
function updateEditor() {
    const editorArea = document.getElementById('editor-area');
    editorArea.innerHTML = '';
    // Object.entries(jsonData).forEach(([key, value], index) => {
    //     const elementDiv = document.createElement('div');
    //     elementDiv.className = 'p-2 mb-2 border draggable';
    //     // elementDiv.textContent = `${key}:\n ${JSON.stringify(value)}`;
    //     elementDiv.setAttribute('data-index', index);
    //     const superScript = document.createElement('super');
    //     const child = document.createElement('div');
    //     superScript.textContent = `${key}:`
    //     superScript.style.backgroundColor = "lightgrey";
    //     superScript.style.width = "100%";
    //     if (typeof value !== "string") {
    //         child.className = 'p-2 mb-2 border draggable';
    //         Object.entries(value).forEach(([key, value], index) => {
    //             const sub = document.createElement('p');
    //             sub.textContent = `${JSON.stringify(key)}`
    //             child.append(sub);
    //         });
    //     } else {
    //         child.textContent = `${JSON.stringify(value)}`
    //     }
    //     elementDiv.append(superScript)
    //     elementDiv.append(child)
    //     editorArea.appendChild(elementDiv);
    // });
    formatEditor(editorArea, jsonData);
}

// Function to import JSON data from a file
function importJSON() {
    document.getElementById('json-file-input').click();
}

function loadFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            jsonData = JSON.parse(e.target.result);
            updateOutline();
            updateEditor();
        };
        reader.readAsText(file);
    }
}

// Function to export JSON data as a downloadable file
function exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// Initialize the JSON editor with some data
jsonData = [{ name: 'Item 1', value: 'Example String' }, { name: 'Item 2', value: 42 }, { name: 'Item 3', value: [] }];
updateOutline();
updateEditor();