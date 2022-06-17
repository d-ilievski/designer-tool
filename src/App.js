import { Route, Routes } from "react-router-dom";
import DesignerView from "./views/DesignerView";
import { fabric } from "fabric";
import { useEffect } from "react";
// import { useMediaQuery, useTheme } from "@mui/material";
import rotateIcon from "./assets/rotateIcon";

function App() {
  // const theme = useTheme();
  // const matchesSm = useMediaQuery(theme.breakpoints.between("xs", "md"));

  const setupFabric = () => {
    const defaultOnTouchStartHandler = fabric.Canvas.prototype._onTouchStart;
    fabric.util.object.extend(fabric.Canvas.prototype, {
      _onTouchStart: function (e) {
        const target = this.findTarget(e);
        // if allowTouchScrolling is enabled, touched object is not selected OR no object was at the
        // the touch position and we're not in drawing mode, then
        // let the event skip the fabricjs canvas and do default
        // behavior
        if (
          this.allowTouchScrolling &&
          !this.isDrawingMode &&
          (!target ||
            !target.selectable ||
            !(target.id === this.getActiveObject()?.id))
        ) {
          // returning here should allow the event to propagate and be handled
          // normally by the browser
          return;
        }

        // otherwise call the default behavior
        defaultOnTouchStartHandler.call(this, e);
      },
    });

    fabric.Object.prototype.set({
      transparentCorners: false,
      borderColor: "magenta",
      cornerColor: "cyan",
      cornerSize: 10,
    });

    let dataBlob = rotateIcon;

    let image = document.createElement("img");
    image.src = dataBlob;

    fabric.Object.prototype.controls.mtr = new fabric.Control({
      ...fabric.Object.prototype.controls.mtr,
      render: function (ctx, left, top, styleOverride, fabricObject) {
        const size = 20;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));

        ctx.drawImage(image, -size / 2, -size / 2, size, size);
        ctx.restore();
      },
    });
  };

  useEffect(() => {
    setupFabric();
  }, []);

  // useEffect(() => {
  //   if (matchesSm) {
  //     fabric.Object.prototype.set({
  //       cornerSize: 15,
  //       padding: 8,
  //     });
  //   }
  // }, [matchesSm]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<DesignerView />} />
      </Routes>
    </div>
  );
}

export default App;
