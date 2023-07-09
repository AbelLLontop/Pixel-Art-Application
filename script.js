const sizeStage = 600;
const stage = new Konva.Stage({
  container: "container",
  width: sizeStage,
  height: sizeStage,
});
const layer = new Konva.Layer();
const layerHover = new Konva.Layer({
  listening: false,
});
stage.add(layer);
stage.add(layerHover);

let columns = 25;
let rows = 25;
let size = sizeStage / columns;
let isDrawing = false;
let color = "black";

function setDimension(input) {
  const sizedimension = input.value;
  if (sizedimension <= 0) {
    input.value = columns;
    return;
  }
  if (sizedimension > 30) {
    input.value = columns;
    return;
  }

  size = sizeStage / sizedimension;
  columns = sizedimension;
  rows = sizedimension;
  createGrid();
}

const action = {
  draw: "draw",
  erase: "erase",
};
let currentAction = action.draw;

function setAction(actionName) {
  currentAction = actionName;
}

function createGrid() {
  layer.destroyChildren();
  layerHover.destroyChildren();
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      const rect = new Konva.Rect({
        x: i * size,
        y: j * size,
        width: size,
        height: size,
        fill: "white",
        stroke: "transparent",
        strokeWidth: 1,
      });
      const rectHover = new Konva.Rect({
        x: i * size,
        y: j * size,
        width: size,
        height: size,
        fill: "transparent",
        stroke: "#00000016",
        strokeWidth: 1,
      });

      rect.on("mouseenter", () => {
        if (currentAction === action.draw) {
          rectHover.fill(color);
        }
        if (currentAction === action.erase) {
          rectHover.fill("white");
        }
      });
      rect.on("mouseleave", () => {
        rectHover.fill("transparent");
      });

      layer.add(rect);
      layerHover.add(rectHover);
    }
  }

  layer.on("touchstart", (e) => {
    const rect = e.target;
    if (currentAction === action.draw) {
      rect.fill(color);
    }
    if (currentAction === action.erase) {
      rect.fill("white");
    }
  });
  layer.on("touchmove", (e) => {
    const rect = e.target;
    if (currentAction === action.draw) {
      rect.fill(color);
    }
    if (currentAction === action.erase) {
      rect.fill("white");
    }
  });

  layer.on("mousedown", (e) => {
    const rect = e.target;
    if (currentAction === action.draw) {
      isDrawing = true;
      rect.fill(color);
    }
    if (currentAction === action.erase) {
      isDrawing = true;
      rect.fill("white");
    }
  });

  layer.on("mousemove", (e) => {
    const rect = e.target;
    if (currentAction === action.draw) {
      if (isDrawing) {
        rect.fill(color);
      }
    }
    if (currentAction === action.erase) {
      if (isDrawing) {
        rect.fill("white");
      }
    }
  });
}
createGrid();
let zoomLevel = 1;
const inputColor = document.getElementById("inputColor");
inputColor.addEventListener("input", (e) => {
  color = e.target.value;
});

const range = document.getElementById("range");
range.addEventListener("input", (e) => {
  stage.scale({ x: e.target.value, y: e.target.value });
  stage.position({
    x: stage.width() / 2 - (stage.width() / 2) * e.target.value,
    y: stage.height() / 2 - (stage.height() / 2) * e.target.value,
  });
});

stage.scale({ x: range.value, y: range.value });
stage.position({
  x: stage.width() / 2 - (stage.width() / 2) * range.value,
  y: stage.height() / 2 - (stage.height() / 2) * range.value,
});

document.addEventListener("mouseup", (e) => {
  isDrawing = false;
});

const exportImage = () => {
  const canvas = document.createElement("canvas");
  canvas.width = columns;
  canvas.height = rows;
  const ctx = canvas.getContext("2d");
  const children = layer.children;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const x = child.x() / size;
    const y = child.y() / size;
    const color = child.fill();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }

  const dataUrl = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.download = "pixelart.png";
  link.href = dataUrl;
  link.click();
  return canvas;
};

function setShowLines(showLines) {
  layerHover.children.forEach((rect) => {
    rect.stroke(showLines ? "#00000016" : "transparent");
  });
}
