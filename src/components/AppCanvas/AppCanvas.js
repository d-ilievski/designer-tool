import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import FontFaceObserver from "fontfaceobserver";
import { Box } from "@mui/material";
import { useAppContext } from "../../context/AppContext";

import ZoomControl from "./ZoomControl";
import RotateControl from "./RotateControl";
import { fonts } from "../../utils";

import Legend from "./Legend";

const AppCanvas = () => {
  const canvasRef = useRef(null);
  const canvasWrapperRef = useRef(null);

  const { state, setState, actions } = useAppContext();

  const initCanvas = () => {
    const canvasElement = canvasRef.current;
    const canvasWrapperElement = canvasWrapperRef.current;

    const canvas = new fabric.Canvas(canvasElement, {
      height: 3000,
      width: canvasWrapperElement.clientWidth,
      preserveObjectStacking: true,
      controlsAboveOverlay: true,
      backgroundColor: "#fff",
      allowTouchScrolling: true,
      selection: false,
    });

    window.c = canvas;

    setState((prevState) => ({
      ...prevState,
      canvas,
      canvasElement,
      canvasWrapperElement,
    }));

    actions.applyTemplate(undefined, canvas, canvasWrapperElement);

    document.onkeydown = function (e) {
      switch (e.key) {
        case "Delete":
          const activeObject = canvas.getActiveObject();
          if (activeObject && !activeObject.isEditing) {
            canvas.remove(activeObject);
          }
          break;
        default:
          break;
      }
      canvas.renderAll();
    };
  };

  // load fonts, then initialize the app
  useEffect(() => {
    if (!canvasRef.current || !canvasWrapperRef.current) return;

    const observers = [];
    fonts.forEach((font) => {
      let obs = new FontFaceObserver(font.label);
      observers.push(obs.load());
    });

    Promise.all(observers)
      .catch((err) => {
        console.warn("Some critical font are not available:", err);
      })
      .finally(() => {
        initCanvas();
      });
  }, [canvasRef, canvasWrapperRef]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow:
          state.canvasArtboardRotation === "horizontal"
            ? "auto hidden"
            : "hidden auto",
        background: "#e9e9e9",
        position: "relative",
        top: 0,
      }}
      ref={canvasWrapperRef}
    >
      <RotateControl
        sx={{
          position: "sticky",
          top: canvasWrapperRef.current?.clientHeight * 0.025,
          left:
            canvasWrapperRef.current?.clientWidth -
            canvasWrapperRef.current?.clientWidth * 0.025 -
            48,
          width: 48,
        }}
      />
      <ZoomControl
        sx={{
          position: "sticky",
          top:
            canvasWrapperRef.current?.clientHeight -
            canvasWrapperRef.current?.clientHeight * 0.025 -
            48, // 48 is the size of the button, 0.025 is 2.5% of the size of the element as a "padding"
          left:
            canvasWrapperRef.current?.clientWidth -
            canvasWrapperRef.current?.clientWidth * 0.025 -
            48,
          width: 48,
        }}
      />

      <Legend
        sx={{
          position: "sticky",
          top:
            canvasWrapperRef.current?.clientHeight -
            canvasWrapperRef.current?.clientHeight * 0.025 -
            48, // 48 is the size of the button, 0.025 is 2.5% of the size of the element as a "padding"
          left: "2.5%",
          width: 48,
        }}
      />
      <Box sx={{ position: "absolute", top: 0 }}>
        <canvas ref={canvasRef}></canvas>
      </Box>
    </Box>
  );
};

export default AppCanvas;
