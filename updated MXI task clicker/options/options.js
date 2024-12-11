// Step 1: Define the CheckType class
class CheckType {
    constructor(name) {
        this.name = name; // Name of the check type
        this.parameters = {}; // Initialize an empty parameters object
    }

    // Step 2: Method to add or update a parameter
    addOrUpdateParameter(paramName, paramValue, paramType = null, isRequired = true) {
        if (!paramName || typeof paramName !== "string") {
            throw new Error("Parameter name must be a non-empty string.");
        }

        // Determine the type dynamically if not explicitly provided
        const valueType = paramType || typeof paramValue;

        // Add or update the parameter
        this.parameters[paramName] = {
            type: valueType,
            value: paramValue,
            required: isRequired
        };
    }

    // Method to get the value of a parameter
    getParameterValue(paramName) {
        return this.parameters[paramName] ? this.parameters[paramName].value : undefined;
    }

    // Method to update only the value of an existing parameter
    updateParameterValue(paramName, newValue) {
        if (this.parameters[paramName]) {
            this.parameters[paramName].value = newValue;
            this.parameters[paramName].type = typeof newValue; // Update type if necessary
        } else {
            throw new Error(`Parameter '${paramName}' does not exist.`);
        }
    }

    // Method to remove a parameter
    removeParameter(paramName) {
        if (this.parameters[paramName]) {
            delete this.parameters[paramName];
        } else {
            throw new Error(`Parameter '${paramName}' does not exist.`);
        }
    }

    // Method to list all parameters with their types and values
    listParameters() {
        return Object.entries(this.parameters).map(([key, { type, value, required }]) => ({
            name: key,
            type: type,
            value: value,
            required: required
        }));
    }
}

// Step 3: Create instances of CheckType
const checkType1 = new CheckType("CheckType1");
checkType1.addOrUpdateParameter("Parameter1", "Default Value"); // string
checkType1.addOrUpdateParameter("Parameter2", 42);             // number

const checkType2 = new CheckType("CheckType2");
checkType2.addOrUpdateParameter("ParameterA", "Another Value"); // string
checkType2.addOrUpdateParameter("ParameterB", 100);             // number

// Adding a new check type '1A'
const checkType1A = new CheckType("1A");
checkType1A.addOrUpdateParameter("ParamX", "Value for ParamX"); // string
checkType1A.addOrUpdateParameter("ParamY", 10);                 // number
checkType1A.addOrUpdateParameter("ParamZ", false);              // boolean

// Accessing parameters
console.log(checkType1.parameters); // Outputs parameters of CheckType1
console.log(checkType1A.getParameterValue("ParamX")); // Outputs: Value for ParamX

// Updating a parameter value
checkType1.updateParameterValue("Parameter1", "Updated Value");
console.log(checkType1.getParameterValue("Parameter1")); // Outputs: Updated Value

// Removing a parameter
checkType1.removeParameter("Parameter2");
console.log(checkType1.parameters); // Outputs parameters without Parameter2

// Listing all parameters in CheckType1
console.log(checkType1.listParameters()); 

// Output all check types
console.log(checkType1);
console.log(checkType2);
console.log(checkType1A);

