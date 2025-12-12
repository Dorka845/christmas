/**
 * @typedef {{what:string, who1:string, shift1:string, who2?:string, shift2?:string}} Elves
 */

/**
 * @typedef {{id:string, label:string, name:string, type?:'select'|'checkbox', optionList?: {value:string,label:string}[]}} FormField
 */

/**
 * @type {Elves[]}
 */
const elves = [
    {
        what: "Logisztika",
        who1: "Kovács Máté",
        shift1: "Délelöttös",
        who2: "Kovács József",
        shift2: "Délutános",
    },
    { 
        what: "Könyvelés", 
        who1: "Szabó Anna", 
        shift1: "Éjszakai" 
    },
    {
        what: "Játékfejlesztés",
        who1: "Varga Péter",
        shift1: "Délutános",
        who2: "Nagy Eszter",
        shift2: "Éjszakai",
    },
];

/**
 * @type {FormField[]}
 */
const formFields = [
    { 
        id: "osztaly", 
        label: "Osztály", 
        name: "osztaly" 
    },
    { 
        id: "mano1",
        label: "Manó 1", 
        name: "mano1" 
    },
    {
        id: "muszak1",
        label: "Manó 1 műszak",
        name: "muszak1",
        type: "select",
        optionList: [{ value: "1", label: "Délelöttös" }, { value: "2", label: "Délutános" }, { value: "3", label: "Éjszakai" }],
    },
    {
        id: "masodikmano",
        label: "Két manót veszek fel",
        name: "masodikmano",
        type: "checkbox",
    },
    { 
        id: "mano2", 
        label: "Manó 2", 
        name: "mano2" 
    },
    {
        id: "muszak2",
        label: "Manó 2 műszak",
        name: "muszak2",
        type: "select",
        optionList: [{ value: "1", label: "Délelöttös" }, { value: "2", label: "Délutános" },
        { value: "3", label: "Éjszakai" }],
    },
];

/**
 * Létrehoz egy section div-et és hozzáadja a body-hoz
 *
 * @param {string} id
 * @param {boolean} hidden - kapjon-e hide osztályt
 * @returns {HTMLDivElement}
 */
function createSection(id, hidden) {
    const div = document.createElement("div");
    div.id = id;

    if (hidden) {
        div.classList.add("hide");
    }

    document.body.appendChild(div);
    return div;
}

/**
 * Létrehoz egy cellát (td/th)
 *
 * @param {'td'|'th'} cellType
 * @param {string} text
 * @param {HTMLTableRowElement} parentRow
 * @returns {HTMLTableCellElement}
 */
function createCell(cellType, text, parentRow) {
    const cell = document.createElement(cellType);
    cell.innerText = text;
    parentRow.appendChild(cell);
    return cell;
}

/**
 * Fejléc létrehozás
 *
 * @param {HTMLTableElement} table
 * @param {string[]} headerList
 * @returns {HTMLTableSectionElement}
 */
function generateHeader(table, headerList) {
    const thead = document.createElement("thead");
    table.appendChild(thead);

    const tr = document.createElement("tr");
    thead.appendChild(tr);

    for (const h of headerList) {
        createCell("th", h, tr);
    } 

    return thead;
}

/**
 * Táblázat létrehozás (thead + tbody)
 *
 * @param {string[]} headerList
 * @param {string} tbodyId
 * @returns {HTMLTableElement}
 */
function generateTable(headerList, tbodyId) {
    const table = document.createElement("table");
    generateHeader(table, headerList);

    const tbody = document.createElement("tbody");
    tbody.id = tbodyId;
    table.appendChild(tbody);

    return table;
}

/**
 * Egy sor kirenderelése (rowspan kezeléssel)
 *
 * @param {HTMLTableSectionElement} tbody
 * @param {Elves} elf
 * @returns {void}
 */
function renderRow(tbody, elf) {
    const tr = document.createElement("tr");
    tbody.appendChild(tr);

    const tdWhat = createCell("td", elf.what, tr);
    createCell("td", elf.who1, tr);
    createCell("td", elf.shift1, tr);

    if (elf.who2 !== undefined && elf.shift2 !== undefined) {
        tdWhat.rowSpan = 2;

        const tr2 = document.createElement("tr");
        tbody.appendChild(tr2);

        createCell("td", elf.who2, tr2);
        createCell("td", elf.shift2, tr2);
    }
}

/**
 * Tbody újrarenderelése (tömb alapján)
 *
 * @param {string} tbodyId
 * @param {Elves[]} arr
 * @returns {void}
 */
function renderTableBody(tbodyId, arr) {
    /** @type {HTMLTableSectionElement} */
    const tbody = document.getElementById(tbodyId);
    tbody.innerHTML = "";

    for (const elf of arr) {
        renderRow(tbody, elf);
    }
}

/**
 *
 * @param {Elves[]} arr
 * @returns {void}
 */
function renderTbody(arr) {
  renderTableBody("jstbody", arr);
}


/**
 * 
 * @param {HTMLDivElement} wrapper 
 * @param {FormField} field 
 * @returns {void}
 */
function createCheckboxField(wrapper, field) {
    const input = document.createElement("input");
    input.id = field.id;
    input.name = field.name;
    input.type = "checkbox";
    wrapper.appendChild(input);

    const label = document.createElement("label");
    label.innerText = field.label;
    label.htmlFor = field.id;
    wrapper.appendChild(label);
}

/**
 * Form létrehozása
 *
 * @param {string} id
 * @param {FormField[]} fields
 * @returns {HTMLFormElement}
 */
function generateForm(id, fields) {
    const form = document.createElement("form");
    form.id = id;

    for (const field of fields) {
        createField(field, form);
    }

    const button = document.createElement("button");
    button.type = "submit";
    button.innerText = "Hozzáadás";
    form.appendChild(button);

    return form;
}

/**
 * Mező létrehozása a field leíró alapján
 *
 * @param {FormField} field
 * @param {HTMLFormElement} form
 * @returns {void}
 */
function createField(field, form) {
    const wrapper = createFieldWrapper(form);

    if (field.type === "checkbox") {
        createCheckboxField(wrapper, field);
        return;
    }

    if (field.type === "select") {
        createSelectField(wrapper, field);
        return;
    }

    createInputField(wrapper, field);
}

/**
 * Input mező létrehozása
 *
 * @param {HTMLDivElement} wrapper
 * @param {FormField} field
 * @returns {void}
 */
function createInputField(wrapper, field) {
    const label = document.createElement("label");
    label.innerText = field.label;
    label.htmlFor = field.id;
    wrapper.appendChild(label);
    wrapper.appendChild(document.createElement("br"));

    /** @type {HTMLInputElement} */
    const input = document.createElement("input");
    input.id = field.id;
    input.name = field.name;
    wrapper.appendChild(input);

    wrapper.appendChild(document.createElement("br"));
}

/**
 * Egy mező wrapperének létrehozása + error span
 *
 * @param {HTMLFormElement} form
 * @returns {HTMLDivElement}
 */
function createFieldWrapper(form) {
    const wrapper = document.createElement("div");
    form.appendChild(wrapper);

    const errorSpan = document.createElement("span");
    errorSpan.classList.add("error");
    wrapper.appendChild(errorSpan);

    return wrapper;
}

/**
 * Select mező létrehozása
 *
 * @param {HTMLDivElement} wrapper
 * @param {FormField} field
 * @returns {void}
 */
function createSelectField(wrapper, field) {
    const label = document.createElement("label");
    label.innerText = field.label;
    label.htmlFor = field.id;
    wrapper.appendChild(label);
    wrapper.appendChild(document.createElement("br"));

    /** @type {HTMLSelectElement} */
    const select = document.createElement("select");
    select.id = field.id;
    select.name = field.name;
    wrapper.appendChild(select);

    const placeholder = document.createElement("option");
    placeholder.innerText = "Válassz műszakot!";
    placeholder.value = "";
    select.appendChild(placeholder);

    const opts = field.optionList ?? [];
    for (const opt of opts) {
        const option = document.createElement("option");
        option.innerText = opt.label;
        option.value = opt.value;
        select.appendChild(option);
    }
}


/**
 * Hibák törlése egy formon belül
 *
 * @param {HTMLFormElement} form
 * @returns {void}
 */
function clearErrors(form) {
    const errors = form.querySelectorAll(".error");
    for (const err of errors) {
        err.innerText = "";
    }
}

/**
 * Kötelező mező validálása
 *
 * @param {HTMLInputElement|HTMLSelectElement} input
 * @param {string} msg
 * @returns {boolean}
 */
function validateRequired(input, msg) {
    if (input.value === "") {
        const parent = input.parentElement;
        const error = parent.querySelector(".error");
        if (error) error.innerText = msg;
        return false;
    }
    return true;
}


/**
 * JS form submit
 *
 * @param {SubmitEvent} e
 * @returns {void}
 */
function jsFormSubmitListener(e) {
    e.preventDefault();
    /** @type {HTMLFormElement} */
    const form = e.target;

    /** @type {HTMLInputElement} */
    const osztaly = form.querySelector("#osztaly");
    /** @type {HTMLInputElement} */
    const mano1 = form.querySelector("#mano1");
    /** @type {HTMLSelectElement} */
    const muszak1 = form.querySelector("#muszak1");

    /** @type {HTMLInputElement} */
    const mano2 = form.querySelector("#mano2");
    /** @type {HTMLSelectElement} */
    const muszak2 = form.querySelector("#muszak2");

    /** @type {HTMLInputElement} */
    const masodikmano = form.querySelector("#masodikmano");

    clearErrors(form);

    const ok = validateRequired(osztaly, "Kötelező elem!") & validateRequired(mano1, "Kötelező elem!") &validateRequired(muszak1, "Kötelező elem!");

    if (!ok) {
        return;
    }

    /** @type {Elves} */
    const obj = {
        what: osztaly.value,
        who1: mano1.value,
        shift1: mapMuszak(muszak1.value),
    };

    if (masodikmano.checked) {
        obj.who2 = mano2.value;
        obj.shift2 = mapMuszak(muszak2.value);
    }

    createNewElement(obj, form, elves);
}

/**
 * HTML form submit (Manó feladata)
 *
 * @param {SubmitEvent} e
 * @returns {void}
 */
function htmlFormSubmitListener(e) {
    e.preventDefault();
    /** @type {HTMLFormElement} */
    const form = e.target;

    /** @type {HTMLSelectElement} */
    const manochooser = form.querySelector("#manochooser");
    /** @type {HTMLInputElement} */
    const manotev1 = form.querySelector("#manotev1");
    /** @type {HTMLInputElement} */
    const manotev2 = form.querySelector("#manotev2");

    clearErrors(form);

    const ok = validateRequired(manochooser, "Kötelező elem!") & validateRequired(manotev1, "Kötelező elem!");

    if (!ok) {
        return;
    }

    /** @type {HTMLTableSectionElement} */
    const htmltbody = document.getElementById("htmltbody");

    const tr = document.createElement("tr");
    htmltbody.appendChild(tr);

    createCell("td", manochooser.value, tr);

    const tdAct1 = createCell("td", manotev1.value, tr);

    if (manotev2.value) {
        createCell("td", manotev2.value, tr);
    } 
    else {
        tdAct1.colSpan = 2;
    }

    form.reset();
}


/**
 * JS rész felépítése és init
 *
 * @returns {void}
 */
function initJsSection() {
    const jsSection = createSection("jssection", true);

    const table = generateTable(["Osztály", "Manó", "Műszak"], "jstbody");
    jsSection.appendChild(table);

    renderTableBody("jstbody", elves);

    const jsForm = generateForm("jsform", formFields);
    jsSection.appendChild(jsForm);

    jsForm.addEventListener("submit", jsFormSubmitListener);

    /** @type {HTMLInputElement} */
    const checkbox = jsForm.querySelector("#masodikmano");
    initCheckbox(checkbox);
}

/**
 * HTML form submit listener regisztráció
 *
 * @returns {void}
 */
function initHtmlForm() {
    const htmlForm = document.getElementById("htmlform");
    htmlForm.addEventListener("submit", htmlFormSubmitListener);
}

/**
 * Teljes init
 *
 * @returns {void}
 */
function init() {
    initSelect(elves);
    initJsSection();
    initHtmlForm();
}

init();