import EasyMDE from "easymde";

function newTextEditor() {
    const textarea = document.createElement("textarea");
    textarea.setAttribute("name", "controller-area");
    textarea.id = "controller-area";
    textarea.classList.add("form-control")
    textarea.rows = 15;
    return textarea;
}

function newNodeController(domElement: HTMLDivElement) {
    // domElement.id = "broker-manager";
    // domElement.classList.add("card");
    const label = document.createElement("label");
    label.classList.add("mb-1");
    domElement.append(label);

    const btnGrp = document.createElement("div");
    btnGrp.classList.add("btn-group");
    btnGrp.style.width = "100%";
    btnGrp.style.gap = "1rem";
    domElement.append(btnGrp);


    const linkBtn = document.createElement("button");
    linkBtn.classList.add("btn", "btn-outline-warning", "btn-sm");
    linkBtn.innerText = "Link";
    linkBtn.style.color = "white";
    btnGrp.append(linkBtn);


    const inputGrp = document.createElement("div");
    inputGrp.classList.add("input-group");
    btnGrp.append(inputGrp);

    const entityInput = document.createElement("input");
    entityInput.classList.add("form-control", "form-control-sm");
    entityInput.id = "entity";
    entityInput.placeholder = "Entity";
    entityInput.type = "text";
    inputGrp.append(entityInput);


    const registerBtn = document.createElement("button");
    registerBtn.classList.add("btn", "btn-outline-success", "btn-sm");
    registerBtn.innerText = "Register";
    registerBtn.style.color = "white";
    inputGrp.append(registerBtn);

    const activateBtn = document.createElement("button");
    activateBtn.classList.add("btn", "btn-outline-primary", "btn-sm");
    activateBtn.innerText = "Activate";
    activateBtn.style.color = "white";
    inputGrp.append(activateBtn);

    // return domElement;
    return {
        linkBtn,
        entityInput,
        registerBtn,
        activateBtn
    }
}
export class Manager {
    editor: EasyMDE;
    textarea: HTMLTextAreaElement
    linkBtn: HTMLButtonElement;
    entityInput: HTMLInputElement;
    registerBtn: HTMLButtonElement;
    activateBtn: HTMLButtonElement;

    edit(text: string) {
        // this.editor = new EasyMDE({ element: this.textarea });
        this.editor.value(text);
        // const editor = new EasyMDE({ element: this.textarea });
        // editor.value(text);
    }
    abort() {
        this.editor.value("");
    }
    save() {
        this.editor.toTextArea();
    }
    constructor(view: HTMLDivElement, options: HTMLDivElement) {
        this.textarea = newTextEditor();
        const {
            linkBtn,
            entityInput,
            registerBtn,
            activateBtn
        } = newNodeController(options);
        this.linkBtn = linkBtn;
        this.entityInput = entityInput;
        this.registerBtn = registerBtn;
        this.activateBtn = activateBtn;
        view.append(this.textarea);
        this.editor = new EasyMDE({ element: this.textarea });
    }
}