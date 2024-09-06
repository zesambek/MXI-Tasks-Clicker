/*chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'clickHeavyButton') {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'clickHeavyButton' });
        });
	    console.log('Hello from the background script!');
    }
});
*/
console.log('Hello from the background script!');
chrome.runtime.onMessage.addListener((msg) => {
 console.log(msg.text);
});
