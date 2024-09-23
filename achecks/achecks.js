document.addEventListener('DOMContentLoaded', () => {
    // List of button IDs
    const buttonIds = ['1AButton', '2AButton', '3AButton', '4AButton', '5AButton'];

    // Function to handle button clicks
    const handleButtonClick = (buttonId) => {
        console.log(`${buttonId} button clicked`);
        // Add your specific logic for each button here
    };

    // Attach event listeners to each button
    buttonIds.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => handleButtonClick(id));
        } else {
            console.error(`Button with ID '${id}' not found.`);
        }
    });

    // Handle the Home button click
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
        homeButton.addEventListener('click', () => {
            console.log("Home button clicked"); // Debug message
            goToHome(); // Call the goToHome function
        });
    } else {
        console.error("Home button not found.");
    }
});

// Function to go to the home page
function goToHome() {
    const homeUrl = chrome.runtime.getURL('../popup/popup.html'); // Generate the home URL
    alert("Redirecting to home!"); // Temporary alert for testing
    window.location.href = homeUrl; // Redirect to the home URL
}

