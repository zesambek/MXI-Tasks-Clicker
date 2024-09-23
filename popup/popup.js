// Function to handle the button click event
function handleButtonClick(action) {
    if (action === 'clickHeavyButton' || action === 'clickNonRoutineButton') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tabId = tabs[0].id;
            sendMessageToTab(tabId, action);
        });
    } else if (action === 'navigateToAChecks') {
        loadAChecksPage();
    }
}

// Function to send a message to the content script
function sendMessageToTab(tabId, action) {
    chrome.tabs.sendMessage(tabId, { action }, (response) => {
        console.log(`Message sent to ${action}`);
    });
}

// Function to load the A Checks page into the popup
function loadAChecksPage() {
    fetch('../achecks/achecks.html')
        .then(response => response.text())
        .then(html => {
            // Insert the A Checks HTML into the popup and add a class to scope the styles
            const mainContent = document.getElementById('mainContent');
            mainContent.classList.add('a-checks-content'); // Add a class for scoping
            mainContent.innerHTML = html;

            // Dynamically load the A Checks JavaScript file
            const script = document.createElement('script');
            script.src = '../achecks/achecks.js';
            document.body.appendChild(script);

            // Check if the stylesheet is already loaded to avoid duplicates
            if (!document.querySelector('link[href="../achecks/achecks.css"]')) {
                // Dynamically load the A Checks CSS file
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '../achecks/achecks.css';
                document.head.appendChild(link);
            }
        })
        .catch(error => console.error('Error loading A Checks page:', error));
}

// Adding event listeners for each button
document.addEventListener('DOMContentLoaded', () => {
    const heavyButton = document.getElementById('heavyButton');
    const nonRoutineButton = document.getElementById('nonRoutineButton');
    const aChecksButton = document.getElementById('aChecksButton');

    if (heavyButton) {
        heavyButton.addEventListener('click', () => handleButtonClick('clickHeavyButton'));
    } else {
        console.error('Heavy button not found in the DOM.');
    }

    if (nonRoutineButton) {
        nonRoutineButton.addEventListener('click', () => handleButtonClick('clickNonRoutineButton'));
    } else {
        console.error('Non-Routine button not found in the DOM.');
    }

    if (aChecksButton) {
        aChecksButton.addEventListener('click', () => handleButtonClick('navigateToAChecks'));
    } else {
        console.error('A Checks button not found in the DOM.');
    }
});

