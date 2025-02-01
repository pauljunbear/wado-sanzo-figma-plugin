import * as React from 'react';
const UI = () => {
    return (React.createElement("div", null,
        React.createElement("style", null, `
        body {
          font-family: Inter, sans-serif;
          padding: 20px;
        }
        .controls {
          margin-bottom: 20px;
        }
        input, select {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
          margin-bottom: 20px;
        }
        .color-item {
          border: 1px solid #e5e5e5;
          border-radius: 4px;
          padding: 8px;
        }
        .color-swatch {
          width: 100%;
          height: 60px;
          border-radius: 4px;
          margin-bottom: 5px;
        }
        .color-name {
          font-size: 12px;
          margin-bottom: 4px;
        }
        .color-hex {
          font-size: 11px;
          color: #666;
        }
      `),
        React.createElement("div", { className: "controls" },
            React.createElement("input", { type: "text", id: "searchInput", placeholder: "Search colors..." }),
            React.createElement("button", { id: "randomButton" }, "Random Color")),
        React.createElement("div", { className: "color-grid", id: "colorGrid" })));
};
export default UI;
