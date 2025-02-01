figma.showUI(__html__, {
    width: 400,
    height: 500
});
// Handle messages from the UI
figma.ui.onmessage = msg => {
    if (msg.type === 'close') {
        figma.closePlugin();
    }
    // Add other message handlers here
};
