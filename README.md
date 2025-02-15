# Sanzo Wada Color Library - Figma Plugin

<img width="300" alt="Screenshot 2025-02-06 at 4 38 40 PM" src="https://github.com/user-attachments/assets/5e5d8bfb-141c-4cb9-8ba2-0a6c9d7c41cc" />
<img width="300" alt="Screenshot 2025-02-06 at 4 39 06 PM" src="https://github.com/user-attachments/assets/b6f0d328-c52a-471f-b009-663407724e89" />


A Figma plugin that brings Sanzo Wada's "A Dictionary of Color Combinations" to life in your design workflow. This plugin provides easy access to Sanzo Wada's carefully curated color combinations, allowing designers to explore and apply these historically significant color palettes in their work.

## Features

- 🎨 Browse through Sanzo Wada's complete color collection
- 🔍 Search colors by name or hex value
- 🎲 Generate random color combinations
- 📋 One-click copy of color values
- 🎯 Direct application of colors to Figma elements
- 💫 Modern, intuitive interface

## Installation

1. Open Figma
2. Go to Menu > Plugins > Browse Plugins in Community
3. Search for "Sanzo Wada Color Library"
4. Click "Install"

## Usage

1. Select an element in your Figma design
2. Right-click > Plugins > Sanzo Wada Color Library
3. Browse or search for colors
4. Click on a color to view its combinations
5. Click the "Generate" button to discover random color combinations
6. Click on any color swatch to apply it to your selected element

## Development

To work on this plugin locally:

1. Clone this repository
```bash
git clone [repository-url]
cd wado-sanzo-color
```

2. Install dependencies
```bash
npm install
```

3. Build the plugin
```bash
npm run build
```

4. Import the plugin in Figma Desktop app:
   - Go to Plugins > Development > Import plugin from manifest
   - Select the `manifest.json` file from this project

## Credits

This plugin is based on Sanzo Wada's work "A Dictionary of Color Combinations" (早稲田, 三造, 1883-1967) and inspired by:

- [Sanzo Wada Color Combinations](https://sanzo-wada.dmbk.io/) by Dain M. Blodorn Kim
- [Dictionary Of Color Combinations](https://github.com/dblodorn/sanzo-wada) color data

## License

MIT License - feel free to use this in your own projects!

Below are the steps to get your plugin running. You can also find instructions at:

  https://www.figma.com/plugin-docs/plugin-quickstart-guide/

This plugin template uses Typescript and NPM, two standard tools in creating JavaScript applications.

First, download Node.js which comes with NPM. This will allow you to install TypeScript and other
libraries. You can find the download link here:

  https://nodejs.org/en/download/

Next, install TypeScript using the command:

  npm install -g typescript

Finally, in the directory of your plugin, get the latest type definitions for the plugin API by running:

  npm install --save-dev @figma/plugin-typings

If you are familiar with JavaScript, TypeScript will look very familiar. In fact, valid JavaScript code
is already valid Typescript code.

TypeScript adds type annotations to variables. This allows code editors such as Visual Studio Code
to provide information about the Figma API while you are writing code, as well as help catch bugs
you previously didn't notice.

For more information, visit https://www.typescriptlang.org/

Using TypeScript requires a compiler to convert TypeScript (code.ts) into JavaScript (code.js)
for the browser to run.

We recommend writing TypeScript code using Visual Studio code:

1. Download Visual Studio Code if you haven't already: https://code.visualstudio.com/.
2. Open this directory in Visual Studio Code.
3. Compile TypeScript to JavaScript: Run the "Terminal > Run Build Task..." menu item,
    then select "npm: watch". You will have to do this again every time
    you reopen Visual Studio Code.

That's it! Visual Studio Code will regenerate the JavaScript file every time you save.
