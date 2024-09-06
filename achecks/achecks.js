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
});

