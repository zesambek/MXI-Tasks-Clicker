// JavaScript for managing check types and parameters with Chrome Storage Sync
class CheckType {
    constructor(name) {
        this.name = name;
        this.parameters = {};
    }

    addOrUpdateParameter(paramName, paramType, paramValue, required) {
        const parsedValue = this.parseValue(paramType, paramValue);
        this.parameters[paramName] = {
            type: paramType,
            value: parsedValue,
            required: required,
        };
    }

    removeParameter(paramName) {
        delete this.parameters[paramName];
    }

    listParameters() {
        return Object.entries(this.parameters).map(([key, param]) => ({
            name: key,
            ...param,
        }));
    }

    parseValue(paramType, paramValue) {
        switch (paramType) {
            case "number":
                return parseFloat(paramValue);
            case "boolean":
                return paramValue.toLowerCase() === "true";
            default:
                return paramValue;
        }
    }

    toJSON() {
        return {
            name: this.name,
            parameters: this.parameters,
        };
    }

    static fromJSON(json) {
        const instance = new CheckType(json.name);
        instance.parameters = json.parameters;
        return instance;
    }
}

// App data
const checkTypes = {};

// DOM elements
const addBtn = document.getElementById("add-check-type");
const checkTypeNameInput = document.getElementById("check-type-name");
const checkTypeList = document.getElementById("check-type-list");
const parametersSection = document.getElementById("parameters-section");
const currentCheckTypeSpan = document.getElementById("current-check-type");
const paramNameInput = document.getElementById("param-name");
const paramTypeSelect = document.getElementById("param-type");
const paramValueInput = document.getElementById("param-value");
const paramRequiredInput = document.getElementById("param-required");
const addParamBtn = document.getElementById("add-param");
const paramList = document.getElementById("param-list");

// Current check type being managed
let currentCheckType = null;

// Save all check types to sync storage
function saveToStorage() {
    const data = Object.fromEntries(
        Object.entries(checkTypes).map(([key, value]) => [key, value.toJSON()])
    );
    chrome.storage.sync.set({ checkTypes: data });
}

// Load all check types from sync storage
function loadFromStorage() {
    chrome.storage.sync.get("checkTypes", (result) => {
        if (result.checkTypes) {
            Object.entries(result.checkTypes).forEach(([key, value]) => {
                const checkType = CheckType.fromJSON(value);
                checkTypes[key] = checkType;
                addCheckTypeToUI(checkType);
            });
        }
    });
}

// Add a new check type
addBtn.addEventListener("click", () => {
    const name = checkTypeNameInput.value.trim();
    if (!name) {
        alert("Please enter a valid check type name.");
        return;
    }

    if (checkTypes[name]) {
        alert("Check type already exists.");
        return;
    }

    // Create a new CheckType instance
    const newCheckType = new CheckType(name);
    checkTypes[name] = newCheckType;

    // Update the UI
    addCheckTypeToUI(newCheckType);

    // Save to storage
    saveToStorage();

    // Clear the input field
    checkTypeNameInput.value = "";
});

// Add check type to UI
function addCheckTypeToUI(checkType) {
    const listItem = document.createElement("li");
    listItem.textContent = `Check Type: ${checkType.name}`;
    listItem.id = `check-type-${checkType.name}`;

    const manageBtn = document.createElement("button");
    manageBtn.textContent = "Manage";
    manageBtn.addEventListener("click", () => {
        currentCheckType = checkType;
        currentCheckTypeSpan.textContent = checkType.name;
        updateParameterList();
        parametersSection.style.display = "block";
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
        delete checkTypes[checkType.name];
        checkTypeList.removeChild(listItem);
        if (currentCheckType === checkType) {
            parametersSection.style.display = "none";
            currentCheckType = null;
        }
        saveToStorage();
    });

    listItem.appendChild(manageBtn);
    listItem.appendChild(deleteBtn);
    checkTypeList.appendChild(listItem);
}

// Add a new parameter
addParamBtn.addEventListener("click", () => {
    if (!currentCheckType) return;

    const paramName = paramNameInput.value.trim();
    const paramType = paramTypeSelect.value;
    const paramValue = paramValueInput.value.trim();
    const required = paramRequiredInput.checked;

    if (!paramName) {
        alert("Please enter a valid parameter name.");
        return;
    }

    // Add or update the parameter in the current check type
    currentCheckType.addOrUpdateParameter(paramName, paramType, paramValue, required);
    updateParameterList();

    // Save to storage
    saveToStorage();

    // Clear parameter input fields
    paramNameInput.value = "";
    paramValueInput.value = "";
    paramRequiredInput.checked = false;
});

// Update the parameter list in the UI
function updateParameterList() {
    paramList.innerHTML = "";
    const parameters = currentCheckType.listParameters();

    parameters.forEach(({ name, type, value, required }) => {
        const listItem = document.createElement("li");
        listItem.textContent = `Name: ${name}, Type: ${type}, Value: ${value}, Required: ${required}`;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => {
            currentCheckType.removeParameter(name);
            updateParameterList();
            saveToStorage();
        });
        listItem.appendChild(removeBtn);
        paramList.appendChild(listItem);
    });
}

// Initialize the app by loading stored data
document.addEventListener("DOMContentLoaded", loadFromStorage);

