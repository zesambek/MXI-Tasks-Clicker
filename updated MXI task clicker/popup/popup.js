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

// Load all check types from sync storage and display them as buttons
function loadAndDisplayCheckTypes() {
    chrome.storage.sync.get("checkTypes", (result) => {
        const checkTypesContainer = document.getElementById("check-types-container");
        checkTypesContainer.innerHTML = ""; // Clear existing buttons

        if (result.checkTypes) {
            Object.entries(result.checkTypes).forEach(([key, value]) => {
                const checkType = CheckType.fromJSON(value);
                addCheckTypeButton(checkType);
            });
        }
    });
}

// Function to create and display a button for a check type
function addCheckTypeButton(checkType) {
    const button = document.createElement("button");
    button.textContent = checkType.name;
    button.classList.add("check-type-button"); // Optional: Add a class for styling

    // Add an event listener for button clicks
    button.addEventListener("click", () => {
        alert(`You clicked on: ${checkType.name}`); // Replace with desired action
    });

    document.getElementById("check-types-container").appendChild(button);
}

// Initialize the popup by loading and displaying stored check types
document.addEventListener("DOMContentLoaded", loadAndDisplayCheckTypes);

