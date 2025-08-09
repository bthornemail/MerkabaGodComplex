function dialPad(func, { id, defaultValue } = { id: '#dialpad', defaultValue: null }) {
    // Create main dialpad div
    const dialpadDiv = document.createElement('div');
    dialpadDiv.className = 'dialpad';

    // Create input
    const outputInput = document.createElement('input');
    outputInput.type = 'text';
    outputInput.id = 'output';
    defaultValue ? outputInput.defaultValue = defaultValue : null;
    outputInput.readOnly = true;
    dialpadDiv.appendChild(outputInput);

    // Create buttons container
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'dial-buttons';

    // Create an array of button values
    const buttons = [
        { value: '1', id: null },
        { value: '2', id: null },
        { value: '3', id: null },
        { value: '4', id: null },
        { value: '5', id: null },
        { value: '6', id: null },
        { value: '7', id: null },
        { value: '8', id: null },
        { value: '9', id: null },
        { value: 'Reset', id: 'reset' },
        { value: '0', id: null },
        { value: 'Submit', id: 'submit' }
    ];

    // Create and append buttons
    for (const btn of buttons) {
        const buttonElem = document.createElement('button');
        buttonElem.innerText = btn.value;
        buttonElem.className = 'dial-button';
        switch (btn.id) {
            case 'submit':
                buttonElem.addEventListener("click", () => {
                    // Here you can handle the submission of the number and passcode
                    console.log(`Submitted: ${output.value}`);
                    func(output.value);
                    outputInput.value = "";
                });
                break;
            case 'reset':
                buttonElem.addEventListener("click", () => {
                    outputInput.value = "";
                });
                break;

            default:
                buttonElem.addEventListener("click", () => {
                    beep();
                    if (outputInput.value === defaultValue) {
                        outputInput.value = "";
                    }
                    outputInput.value += btn.value;
                });
                break;
        }
        // if (btn.id === 'submit') {
        //     buttonElem.addEventListener("click", () => {
        //         // Here you can handle the submission of the number and passcode
        //         alert(`Submitted: ${output.value}`);
        //         outputInput.value = "";
        //     });
        // }
        // else if (btn.id === 'reset') {
        //     // buttonElem.id = btn.id;
        //     buttonElem.addEventListener("click", () => {
        //         outputInput.value = "";
        //     });
        // } else {
        //     // buttonElem.setAttribute('data-value', btn.value);
        //     buttonElem.addEventListener("click", () => {
        //         outputInput.value += btn.value;
        //     });
        // }
        buttonsDiv.appendChild(buttonElem);
    }

    // Append buttons to dialpad div
    dialpadDiv.appendChild(buttonsDiv);
    // Append dialpad div to body
    document.querySelector(id ? id : "#dialpad").appendChild(dialpadDiv);
}