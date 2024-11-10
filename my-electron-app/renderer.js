// renderer.js

// Listen for a response from the main process
window.electron.on('my-channel-response', (data) => {
    console.log('Received data from main process:', data);
});
