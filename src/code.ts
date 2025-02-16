figma.showUI(__html__, {
  width: 560,
  height: 560,
  themeColors: true
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-color') {
    const color = msg.color;
    const rect = figma.createRectangle();
    
    rect.resize(100, 100);
    rect.x = figma.viewport.center.x - 50;
    rect.y = figma.viewport.center.y - 50;
    
    const rgbColor = {
      r: color.rgb_array[0] / 255,
      g: color.rgb_array[1] / 255,
      b: color.rgb_array[2] / 255
    };
    
    rect.fills = [{
      type: 'SOLID',
      color: rgbColor
    }];
    
    rect.name = color.name;
    
    figma.currentPage.selection = [rect];
    figma.viewport.scrollAndZoomIntoView([rect]);
  }
  if (msg.type === 'copy') {
    figma.notify(`${msg.text} is ready to copy!`);
  }
  if (msg.type === 'notify') {
    figma.notify(msg.text);
  }
}; 