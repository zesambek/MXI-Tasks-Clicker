// Get the current URL
const url = window.location.href;

// Check if the URL contains the specific query parameters you're interested in
if (url.includes("aTab=Open.OpenTasks") || url.includes("aTab=Open.OpenFaults")) {
    console.log("The URL contains either OpenTasks or OpenFaults.");
}

// Function to handle interaction with the specified table, checking multiple cells for specific content
function handleTableInteraction(tableId, cellChecks) {
    const table = document.getElementById(tableId);

    if (table) {
        console.log(`Table '${tableId}' found, iterating over rows...`);

        // Iterate over the rows, starting from row 3 (index 2)
        for (let i = 2; i < table.rows.length; i++) {
            const row = table.rows[i];
            console.log(`Inspecting Row ${i + 1} in '${tableId}'...`);

            // Check each specified cell for its corresponding content
            let allChecksSatisfied = true;

            cellChecks.forEach(check => {
                const cell = row.cells[check.cellIndex];
                const content = cell ? cell.innerText.trim() : '';

                // If contentToCheck is a string, compare it directly
                if (typeof check.contentToCheck === 'string') {
                    if (content !== check.contentToCheck) {
                        allChecksSatisfied = false;
                        return; // No need to check further if one condition fails
                    }
                }

                // If contentToCheck is a function, use it to evaluate the content
                if (typeof check.contentToCheck === 'function') {
                    if (!check.contentToCheck(content)) {
                        allChecksSatisfied = false;
                        return; // No need to check further if one condition fails
                    }
                }
            });

            // If all checks are satisfied, toggle the checkbox in Cell 1
            if (allChecksSatisfied) {
                console.log(`    All conditions satisfied for Row ${i + 1}, toggling the checkbox in Cell 1.`);

                // Find the checkbox in cell 1
                const checkbox = row.cells[0].querySelector('input[type="checkbox"]');
                if (checkbox) {
                    // Flip the checkbox status
                    checkbox.checked = !checkbox.checked;
                    console.log(`    Checkbox in Cell 1 has been toggled. New status: ${checkbox.checked}`);
                } else {
                    console.error('    Checkbox in Cell 1 not found.');
                }
            }
        }
    } else {
        console.log(`Table '${tableId}' not found. Ensure the ID is correct and the content is fully loaded.`);
    }
}

// Function to simulate clicking the heavy tasks button
function clickHeavyTasks() {
    const heavyTasks = document.getElementById('OpenTasks_link');
    if (heavyTasks) {
        console.log('Heavy tasks button found, attempting to click...');

        // Handle table interaction after clicking
        setTimeout(() => {
            handleTableInteraction('idTableOpenTasks', [
                { cellIndex: 10, contentToCheck: 'HEAVY' }
            ]);
        }, 500); // Adding a small delay to ensure DOM updates
    } else {
        console.error('Heavy tasks button not found in the DOM.');
    }
}

// Function to simulate clicking the non-routine button
function clickNonRoutineTasks() {
    const nonRoutineTasks = document.getElementById('OpenFaults_link');
    if (nonRoutineTasks) {
        console.log('Non-routine tasks button found, attempting to click...');

        // Handle table interaction after clicking
        setTimeout(() => {
            handleTableInteraction('idTableOpenFaults', [
                { cellIndex: 7, contentToCheck: '' },
                { cellIndex: 8, contentToCheck: content => content !== 'MEL' && content !== 'CDL' }
            ]);
        }, 500); // Adding a small delay to ensure DOM updates
    } else {
        console.error('Non-routine tasks button not found in the DOM.');
    }
}

// Function to handle the message received from the popup
function handleButtonClickMessage(message) {
    if (message.action === 'clickHeavyButton') {
        clickHeavyTasks();
    } else if (message.action === 'clickNonRoutineButton') {
        clickNonRoutineTasks();
    }
}

// Add listener to receive messages from the popup
chrome.runtime.onMessage.addListener(handleButtonClickMessage);

// Ensure the document is ready before interacting with it
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document fully loaded and ready.');
});

