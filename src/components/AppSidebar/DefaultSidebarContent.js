import { fabric } from "fabric";
import {
  Box,
  Button,
  Grid,
  styled,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { useAppContext } from "../../context/AppContext";
import ColorPicker from "./ColorPicker";
import Layers from "./Layers";
import { useState } from "react";
import { v4 as uuid } from "uuid";

const DefaultContent = () => {
  const { state, setState, actions } = useAppContext();
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const Input = styled("input")({
    display: "none",
  });

  const applyColorToBackground = (color) => {
    state.canvasArtboard.set({ fill: color });
    state.canvas.requestRenderAll();
  };

  const addImageToCanvas = (event) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const imgUrl = e.target.result;

      fabric.Image.fromURL(
        imgUrl,
        (oImg) => {
          oImg.set({
            originX: "center",
            originY: "center",
            snapThreshold: 3,
            snapAngle: 90,
            centeredScaling: true,
            id: uuid(),
          });

          oImg.scaleToWidth(state.canvasArtboard.width);
          state.canvas.add(oImg);

          state.canvas.viewportCenterObject(oImg);
          oImg.setCoords();
          state.canvas.setActiveObject(oImg);
          state.canvas.renderAll();

          // scroll to center of canvas
          state.canvasWrapperElement.scrollTo(
            0,
            state.canvasWrapperElement.clientHeight / 2
          );

          actions.updateLayers();
        },
        {
          crossOrigin: "Anonymous",
        }
      );
    };

    reader.readAsDataURL(event.target.files[0]); // convert to base64 string
  };

  const addTextToCanvas = () => {
    const placeholderText = "Your Text";
    const text = new fabric.IText(placeholderText, {
      fontFamily: "Roboto",
      fontSize: 72,
      scaleX: 1.5,
      scaleY: 1.5,
      lineHeight: 1,
      snapAngle: 90,
      snapThreshold: 3,
      originX: "center",
      originY: "center",
      centeredScaling: true,
      selectionColor: "#df74ff98",
    });

    text.id = uuid();

    state.canvas.add(text);
    state.canvas.viewportCenterObject(text);
    text.setCoords();
    state.canvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
    state.canvas.renderAll();

    // scroll to center of canvas
    state.canvasWrapperElement.scrollTo(
      0,
      state.canvasWrapperElement.clientHeight / 2
    );

    actions.updateLayers();
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: 2 }}>
      {state.canvasLayers.length > 0 && (
        <Grid item xs={12}>
          <Layers />
        </Grid>
      )}
      <Grid item xs={12}>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          component="span"
          startIcon={
            <Box
              sx={{
                width: 32,
                height: 32,
                backgroundColor: state.canvasArtboard?.fill,
              }}
            />
          }
          onClick={() => setIsPickerVisible(true)}
        >
          Background Fill Color
        </Button>
        <ColorPicker
          initialColor={state.canvasBackgroundColor}
          onChange={(color) => applyColorToBackground(color)}
          onChangeComplete={(color) =>
            setState((prevState) => ({
              ...prevState,
              canvasBackgroundColor: color,
            }))
          }
          isPickerVisible={isPickerVisible}
          setIsPickerVisible={setIsPickerVisible}
        ></ColorPicker>
      </Grid>
      <Grid item xs={6}>
        <label htmlFor="image-upload-button">
          <Input
            accept="image/*"
            id="image-upload-button"
            type="file"
            onChange={addImageToCanvas}
          />
          <Button variant="outlined" size="large" fullWidth component="span">
            Upload Image
          </Button>
        </label>
      </Grid>
      <Grid item xs={6}>
        <Button
          variant="outlined"
          size="large"
          fullWidth
          onClick={addTextToCanvas}
        >
          Add Text
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" onClick={() => actions.exportDesign()}>
          Export
        </Button>
      </Grid>
      <Grid item xs={12}>
        <InputLabel id="template-select">Template</InputLabel>
        <Select
          fullWidth
          labelId="template-select-label"
          id="template-select"
          value={state.currentTemplate}
          label="Template"
          onChange={(event) => {
            setState((prevState) => ({
              ...prevState,
              currentTemplate: event.target.value,
            }));
            actions.applyTemplate(event.target.value);
          }}
        >
          {state.templates.map((template) => (
            <MenuItem value={template.value} key={template.key}>
              {template.value.name}
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </Grid>
  );
};

export default DefaultContent;
