figma.showUI(__html__, {
  width: 560,
  height: 560,
  themeColors: true
});

interface GradientColor {
  hex: string;
  name: string;
}

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
  
  if (msg.type === 'apply-gradient') {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify('Please select a frame or shape to apply the gradient');
      return;
    }

    const node = selection[0];
    if ('fills' in node) {
      const colors: GradientColor[] = msg.colors;
      const gradientStops = colors.map((color: GradientColor, index: number) => {
        const hex = color.hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16) / 255;
        const g = parseInt(hex.substring(2, 4), 16) / 255;
        const b = parseInt(hex.substring(4, 6), 16) / 255;
        
        return {
          position: index / (colors.length - 1),
          color: { r, g, b, a: 1 }
        };
      });

      const gradientTransform: Transform = msg.gradientType === 'LINEAR' 
        ? [[1, 0, 0.5], [0, 1, 0]]
        : [[0.5, 0, 0.5], [0, 0.5, 0.5]];

      const gradientFill: GradientPaint = {
        type: msg.gradientType === 'LINEAR' ? 'GRADIENT_LINEAR' :
              msg.gradientType === 'RADIAL' ? 'GRADIENT_RADIAL' :
              msg.gradientType === 'ANGULAR' ? 'GRADIENT_ANGULAR' :
              'GRADIENT_DIAMOND',
        gradientTransform,
        gradientStops
      };

      node.fills = [gradientFill];
      figma.notify(`Applied ${msg.gradientType.toLowerCase()} gradient with ${colors.length} colors`);
    } else {
      figma.notify('Selected element doesn\'t support fills');
    }
  }

  if (msg.type === 'copy') {
    figma.notify(`${msg.text} is ready to copy!`);
  }
  if (msg.type === 'notify') {
    figma.notify(msg.text);
  }
}; 