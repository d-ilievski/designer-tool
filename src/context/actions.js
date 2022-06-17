import { fabric } from "fabric";
import { useState } from "react";
import { SelectionTypes } from "../utils/types";

export const ActionTypes = {
  initCanvas: "initCanvas",
  updateActiveObject: "updateActiveObject",
  updateState: "updateState",
};

export const useActions = (initialState) => {
  const [state, setState] = useState(initialState);

  /**
   *
   *  PRIVATE
   *
   */

  const serializeTextSelection = (object) => {
    const selection = {};

    selection.type = SelectionTypes.Text;

    const styles = [];
    if (object.get("fontWeight") === "bold") styles.push("bold");
    if (object.get("fontStyle") === "italic") styles.push("italic");
    if (object.get("underline")) styles.push("underline");
    if (object.get("linethrough")) styles.push("linethrough");

    selection.fontStyles = styles;
    selection.textAlign = object.get("textAlign");
    selection.fill = object.get("fill");
    selection.fontFamily = object.get("fontFamily");
    selection.scaleX = object.get("scaleX");
    selection.scaleY = object.get("scaleY");
    selection.textBackgroundColor = object.get("textBackgroundColor");

    return selection;
  };

  const serializeImageSelection = (object) => {
    const selection = {};

    selection.type = SelectionTypes.Image;

    selection.scaleX = object.get("scaleX");
    selection.scaleY = object.get("scaleY");

    return selection;
  };

  const updateSelection = (object) => {
    let payload;

    const objectType = object?.get("type") || "none";
    switch (objectType) {
      case "i-text":
        payload = serializeTextSelection(object);
        break;
      case "image":
        payload = serializeImageSelection(object);
        break;
      default:
        payload = { type: SelectionTypes.None };
    }
    setState((prevState) => ({
      ...prevState,
      activeObject: { ...prevState.activeObject, ...payload },
    }));
  };

  /**
   *
   *  PUBLIC
   *
   */

  const adjustArtboardSize = (
    scaleFactor,
    rotation = state.canvasArtboardRotation,
    canvasWrapperElement = state.canvasWrapperElement,
    canvasArtboard = state.canvasArtboard,
    canvas = state.canvas
  ) => {
    let artboardHeight, artboardWidth;
    if (rotation === "horizontal") {
      artboardHeight = canvasWrapperElement.offsetHeight;
      artboardWidth =
        canvasArtboard.height * scaleFactor > canvasWrapperElement.offsetWidth
          ? canvasArtboard.height * scaleFactor
          : canvasWrapperElement.offsetWidth;
    } else {
      artboardHeight =
        canvasArtboard.height * scaleFactor > canvasWrapperElement.offsetHeight
          ? canvasArtboard.height * scaleFactor
          : canvasWrapperElement.offsetHeight;
      artboardWidth = canvasWrapperElement.offsetWidth;
    }
    canvas.setWidth(artboardWidth);
    canvas.setHeight(artboardHeight);

    canvas.renderAll();
  };

  const centerArtboard = (
    scaleFactor,
    canvasArtboard = state.canvasArtboard,
    canvas = state.canvas
  ) => {
    let object = canvasArtboard;
    let zoom = scaleFactor || canvas.getZoom();
    let panX = 0;
    let panY = 0;

    canvas.setViewportTransform([zoom, 0, 0, zoom, panX, panY]);

    let centerX = object.width / 2;
    let centerY = object.height / 2;

    panX = (canvas.getVpCenter().x - centerX) * zoom;
    panY = (canvas.getVpCenter().y - centerY) * zoom;
    canvas.relativePan({ x: panX, y: panY });

    canvas.renderAll();
  };

  const zoomArtboard = (scaleFactor, rotation) => {
    adjustArtboardSize(scaleFactor, rotation);
    centerArtboard(scaleFactor);

    setState((prevState) => ({
      ...prevState,
      canvasCurrentScaleFactor: scaleFactor,
    }));

    state.canvas.renderAll();
  };

  const fitToScreen = (
    rotation = state.canvasArtboardRotation,
    canvasWrapperElement = state.canvasWrapperElement,
    canvasArtboard = state.canvasArtboard
  ) => {
    let canvasCurrentScaleFactor, canvasMaximumScaleFactor;
    if (rotation === "horizontal") {
      canvasCurrentScaleFactor =
        canvasWrapperElement.offsetWidth / canvasArtboard.height;
      canvasMaximumScaleFactor =
        canvasWrapperElement.clientHeight / canvasArtboard.width;
    } else {
      canvasCurrentScaleFactor =
        canvasWrapperElement.offsetHeight / canvasArtboard.height;
      canvasMaximumScaleFactor =
        canvasWrapperElement.clientWidth / canvasArtboard.width;
    }

    canvasCurrentScaleFactor = canvasCurrentScaleFactor - 0.01; // slightly zoomed out

    zoomArtboard(canvasCurrentScaleFactor, rotation);

    state.canvas.renderAll();

    setState((prevState) => ({
      ...prevState,
      canvasCurrentScaleFactor,
      canvasMaximumScaleFactor,
    }));
  };

  const rotateArtboard = (forceRotation) => {
    const canvasArtboardRotation =
      forceRotation || state.canvasArtboardRotation === "vertical"
        ? "horizontal"
        : "vertical";

    let canvasCenter = new fabric.Point(
      state.canvas.overlayImage.width / 2,
      state.canvas.overlayImage.height / 2
    ); // center of artboard / overlay
    let radians = fabric.util.degreesToRadians(
      canvasArtboardRotation === "horizontal" ? -90 : 90
    );

    state.canvas
      .getObjects()
      .slice(0, state.canvas.getObjects().length - 1) // skip the greyOverlay
      .forEach(function (obj) {
        const objectOrigin = new fabric.Point(obj.left, obj.top);
        const new_loc = fabric.util.rotatePoint(
          objectOrigin,
          canvasCenter,
          radians
        );
        obj.top = new_loc.y;
        obj.left = new_loc.x;
        obj.angle =
          canvasArtboardRotation === "horizontal"
            ? obj.angle - 90
            : obj.angle + 90; //rotate each object buy the same angle
      });

    state.canvas.overlayImage.rotate(
      canvasArtboardRotation === "horizontal" ? -90 : 0
    );

    state.canvasHorizontalCenterGuideline.rotate(
      canvasArtboardRotation === "horizontal" ? -90 : 0
    );
    state.canvasVerticalCenterGuideline.rotate(
      canvasArtboardRotation === "horizontal" ? -90 : 0
    );

    fitToScreen(canvasArtboardRotation);

    state.canvas.renderAll();

    setState((prevState) => ({
      ...prevState,
      canvasArtboardRotation,
      canvasMinimumScaleFactor: 0.1,
    }));
  };

  const updateLayers = () => {
    if (!state.canvas) {
      return;
    }
    const newLayers = [];
    state.canvas.getObjects()?.forEach((object) => {
      if (object.id === "greyOverlay") {
        object.bringToFront();
        return;
      }

      if (!object.id) return; // filter out the non-user objects

      const item = {
        id: object.id,
        canvasObject: object,
        locked: !object.get("selectable"),
        selected: object?.id === state.canvas.getActiveObject()?.id,
      };
      const objectType = object?.get("type") || "none";

      switch (objectType) {
        case "i-text":
          item.primary = object.text;
          item.secondary = "Text";
          item.type = SelectionTypes.Text;
          break;
        default:
          item.primary = object.cacheKey;
          item.secondary = "Image";
          item.type = SelectionTypes.Image;
      }

      newLayers.push(item);
    });

    newLayers.reverse();

    setState((prevState) => ({
      ...prevState,
      canvasLayers: newLayers,
    }));
  };

  const exportDesign = () => {
    let originalTransform = state.canvas.viewportTransform;
    let originalArtboardClipPath = state.canvasArtboard.clipPath;

    state.canvas.overlayImage.set({ opacity: 0 }); // hide elements
    state.canvasGreyOverlay.set({ opacity: 0 });
    state.canvasArtboard.clipPath = null;

    const isArtboardHorizontal = state.canvasArtboardRotation === "horizontal";

    if (isArtboardHorizontal) {
      // rotate artboard to normal (vertical) if needed
      rotateArtboard();
    }

    // reset view (zoom, pan, etc)
    state.canvas.viewportTransform = fabric.iMatrix.slice(0);

    const dataUrl = state.canvas.toDataURL({
      top: state.canvasArtboard.top,
      left: state.canvasArtboard.left,
      width: state.canvasArtboard.width,
      height: state.canvasArtboard.height,
      format: "png",
      quality: 1,
    });

    // revert back changes
    state.canvas.viewportTransform = originalTransform;
    state.canvas.overlayImage.set({ opacity: 1 });
    state.canvasGreyOverlay.set({ opacity: 0.8 });
    state.canvasArtboard.clipPath = originalArtboardClipPath;

    if (isArtboardHorizontal) {
      // this means the artboard was horizontal, so we need to put it back
      rotateArtboard("horizontal");
    }

    // trigger download
    // eslint-ignore-next-line
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "skateboard";
    link.click();
  };

  const applyTemplate = (
    currentTemplate = state.currentTemplate,
    canvas = state.canvas,
    canvasWrapperElement = state.canvasWrapperElement
  ) => {
    let guidelinesImage;
    let artboard;
    let outline;
    let lineHorizontal, lineVertical;

    const isArtboardHorizontal = state.canvasArtboardRotation === "horizontal";

    if (isArtboardHorizontal) {
      // rotate artboard to normal (vertical) if needed
      rotateArtboard();
    }

    let prevObjects = canvas.getObjects();
    prevObjects = prevObjects.slice(1, prevObjects.length - 1);

    canvas.clear();

    fabric.loadSVGFromURL(currentTemplate.shape, (objects, options) => {
      outline = fabric.util.groupSVGElements(objects, options);
      outline.set({ originX: "center", originY: "center" });

      fabric.loadSVGFromURL(currentTemplate.outline, (objects, options) => {
        guidelinesImage = fabric.util.groupSVGElements(objects, options);

        guidelinesImage.set({ top: 0, left: 0 });

        artboard = new fabric.Rect({
          selectable: false,
          evented: false,
          inverted: true,
          top: 0,
          left: 0,
          width: guidelinesImage.width,
          height: guidelinesImage.height,
          fill: state.canvasArtboard?.fill || "white",
          strokeWidth: 1,
          clipPath: outline,
          new: true,
        });

        canvas.add(artboard);

        const scaleFactor =
          canvasWrapperElement.offsetHeight / artboard.height - 0.01; // slightly zoomed out
        const maximumScaleFactor =
          canvasWrapperElement.clientWidth / artboard.width;

        const greyOverlay = new fabric.Rect({
          width: 10000,
          height: 10000,
          top: -5000,
          left: -5000,
          fill: "#ebebeb",
          opacity: 0.8,
          evented: false,
          selectable: false,
          clipPath: artboard,
          id: "greyOverlay",
        });

        canvas.add(greyOverlay);

        canvas.setOverlayImage(guidelinesImage);

        canvas.setHeight(
          artboard.height * scaleFactor > canvasWrapperElement.offsetHeight
            ? artboard.height * scaleFactor
            : canvasWrapperElement.offsetHeight
        );

        canvas.setZoom(scaleFactor);

        canvas.absolutePan(
          new fabric.Point(
            -(canvasWrapperElement.offsetWidth / 2) +
              (artboard.width * scaleFactor) / 2,
            -(canvasWrapperElement.offsetHeight / 2) +
              (artboard.height * scaleFactor) / 2
          )
        );

        // Guide lines init
        lineVertical = new fabric.Line(
          [
            guidelinesImage.width / 2,
            0,
            guidelinesImage.width / 2,
            guidelinesImage.height,
          ],
          {
            strokeDashArray: [5, 5],
            stroke: "red",
          }
        );

        lineVertical.selectable = false;
        lineVertical.evented = false;

        lineHorizontal = new fabric.Line(
          [
            0,
            guidelinesImage.height / 2,
            guidelinesImage.width,
            guidelinesImage.height / 2,
          ],
          {
            strokeDashArray: [5, 5],
            stroke: "red",
            strokeWidth: 1,
          }
        );
        lineHorizontal.selectable = false;
        lineHorizontal.evented = false;

        if (prevObjects.length > 0)
          prevObjects.forEach((obj) => canvas.add(obj));

        updateLayers();

        canvas.renderAll();

        canvas.off();

        canvas.on({
          "selection:created": (event) =>
            updateSelection(event.selected[0], canvas),
          "selection:updated": (event) =>
            updateSelection(event.selected[0], canvas),
          "selection:cleared": () => updateSelection(null, canvas),
          "object:moving": (options) => {
            const snapZone = 30;
            const objectCenterPoint = options.target.getCenterPoint();
            const isArtboardVertical = artboard.angle === 0;

            if (
              objectCenterPoint.x > guidelinesImage.width / 2 - snapZone &&
              objectCenterPoint.x < guidelinesImage.width / 2 + snapZone
            ) {
              options.target
                .set({
                  left: guidelinesImage.width / 2,
                })
                .setCoords();

              if (isArtboardVertical) {
                if (!canvas.contains(lineVertical, true)) {
                  canvas.add(lineVertical);
                }
              } else {
                if (!canvas.contains(lineHorizontal, true)) {
                  canvas.add(lineHorizontal);
                }
              }

              document.addEventListener("mouseup", () => {
                canvas.remove(lineVertical);
              });
            } else {
              canvas.remove(isArtboardVertical ? lineVertical : lineHorizontal);
            }

            if (
              objectCenterPoint.y > guidelinesImage.height / 2 - snapZone &&
              objectCenterPoint.y < guidelinesImage.height / 2 + snapZone
            ) {
              options.target
                .set({
                  top: guidelinesImage.height / 2,
                })
                .setCoords();

              if (isArtboardVertical) {
                // artboard is vertical
                if (!canvas.contains(lineHorizontal, true)) {
                  canvas.add(lineHorizontal);
                }
              } else {
                if (!canvas.contains(lineVertical, true)) {
                  canvas.add(lineVertical);
                }
              }

              document.addEventListener("mouseup", () => {
                canvas.remove(lineHorizontal);
              });
            } else {
              canvas.remove(isArtboardVertical ? lineHorizontal : lineVertical);
            }
          },
          "mouse:down": (event) => {
            if (event.target) {
              return;
            }
          },
        });

        setState((prevState) => {
          return {
            ...prevState,
            canvasArtboard: artboard,
            canvasArtboardGuidelinesImage: guidelinesImage,
            canvasHorizontalCenterGuideline: lineHorizontal,
            canvasVerticalCenterGuideline: lineVertical,
            canvasGreyOverlay: greyOverlay,
            canvasMinimumScaleFactor: 0.1,
            canvasMaximumScaleFactor: maximumScaleFactor,
            canvasCurrentScaleFactor: scaleFactor,
            currentTemplate,
          };
        });
      });
    });
  };

  const actions = {
    adjustArtboardSize,
    centerArtboard,
    zoomArtboard,
    fitToScreen,
    rotateArtboard,
    updateLayers,
    exportDesign,
    applyTemplate,
  };

  return { state, setState, actions };
};
