import {
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { fonts } from "../../utils";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatStrikethroughIcon from "@mui/icons-material/FormatStrikethrough";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TextIncreaseIcon from "@mui/icons-material/TextIncrease";
import TextDecreaseIcon from "@mui/icons-material/TextDecrease";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import ColorPicker from "./ColorPicker";

const TextContent = () => {
  const { state, setState } = useAppContext();
  const [isTextColorPickerVisible, setIsTextColorPickerVisible] =
    useState(false);
  const [
    isTextBackgroundColorPickerVisible,
    setIsTextBackgroundColorPickerVisible,
  ] = useState(false);

  const handleFontFamilyChange = (event) => {
    const activeObject = state.canvas.getActiveObject();
    if (!activeObject) return;

    const value = event.target.value;

    activeObject.set("fontFamily", value);

    activeObject.setCoords();
    state.canvas.renderAll();

    setState((prevState) => ({
      ...prevState,
      activeObject: { ...prevState.activeObject, fontFamily: value },
    }));
  };

  const handleFontStyleChange = (_, styles) => {
    const activeObject = state.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.set("fontWeight", styles.includes("bold") ? "bold" : "normal");
    activeObject.set(
      "fontStyle",
      styles.includes("italic") ? "italic" : "normal"
    );
    activeObject.set("underline", styles.includes("underline"));
    activeObject.set("linethrough", styles.includes("linethrough"));

    activeObject.setCoords();
    state.canvas.renderAll();

    setState((prevState) => ({
      ...prevState,
      activeObject: { ...prevState.activeObject, fontStyles: styles },
    }));
  };

  const handleTextAlignChange = (_, textAlign) => {
    if (!textAlign) return;

    const activeObject = state.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.set("textAlign", textAlign);

    activeObject.setCoords();
    state.canvas.renderAll();

    setState((prevState) => ({
      ...prevState,
      activeObject: { ...prevState.activeObject, textAlign },
    }));
  };

  const handleTextColorChange = (textColor) => {
    const activeObject = state.canvas.getActiveObject();
    if (!activeObject) return;
    activeObject.set("fill", textColor);

    state.canvas.requestRenderAll();
  };

  const handleTextBackgroundColorChange = (textBackgroundColor) => {
    const activeObject = state.canvas.getActiveObject();
    if (!activeObject) return;
    activeObject.set("textBackgroundColor", textBackgroundColor);

    activeObject.setCoords();
    state.canvas.renderAll();
  };

  const handleTextSizeChange = (_, value) => {
    const activeObject = state.canvas.getActiveObject();
    if (!activeObject) return;

    if (value[0] === "increase") {
      activeObject.set("scaleX", activeObject.scaleX * 1.1);
      activeObject.set("scaleY", activeObject.scaleY * 1.1);
    } else if (value[0] === "decrease") {
      activeObject.set("scaleX", activeObject.scaleX * 0.9);
      activeObject.set("scaleY", activeObject.scaleY * 0.9);
    }

    state.canvas.requestRenderAll();
  };

  const handleTextRotationChange = (_, value) => {
    const activeObject = state.canvas.getActiveObject();
    if (!activeObject) return;

    if (value[0] === "left") {
      activeObject.rotate(activeObject.get("angle") - 15);
    } else if (value[0] === "right") {
      activeObject.rotate(activeObject.get("angle") + 15);
    }

    state.canvas.requestRenderAll();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <InputLabel id="font-select-label">Font</InputLabel>
        <Select
          labelId="font-select-label"
          fullWidth
          options={fonts}
          onChange={handleFontFamilyChange}
          value={state.activeObject.fontFamily}
        >
          {fonts.map((font) => (
            <MenuItem
              key={font.label}
              value={font.label}
              sx={{ fontFamily: font.label }}
            >
              {font.label}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} justifyContent={"space-between"}>
          <Grid item>
            <ToggleButtonGroup
              value={state.activeObject.fontStyles}
              onChange={handleFontStyleChange}
              aria-label="text styles"
              size="small"
            >
              <ToggleButton value="bold" aria-label="bold">
                <FormatBoldIcon />
              </ToggleButton>
              <ToggleButton value="italic" aria-label="italic">
                <FormatItalicIcon />
              </ToggleButton>
              <ToggleButton value="underline" aria-label="underline">
                <FormatUnderlinedIcon />
              </ToggleButton>
              <ToggleButton value="linethrough" aria-label="linethrough">
                <FormatStrikethroughIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item>
            <ToggleButtonGroup
              size="small"
              value={state.activeObject.textAlign}
              onChange={handleTextAlignChange}
              exclusive
              aria-label="text alignment"
            >
              <ToggleButton value="left" aria-label="left aligned">
                <FormatAlignLeftIcon />
              </ToggleButton>
              <ToggleButton value="center" aria-label="centered">
                <FormatAlignCenterIcon />
              </ToggleButton>
              <ToggleButton value="right" aria-label="right aligned">
                <FormatAlignRightIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2} justifyContent={"space-between"}>
          <Grid item>
            <ToggleButtonGroup size="small" aria-label="text colors">
              {/* <InputLabel id="font-color-label">Text Color</InputLabel> */}
              <ToggleButton
                aria-labelledby="font-color-label"
                value="color"
                aria-label="color"
                onClick={() => setIsTextColorPickerVisible(true)}
              >
                <FormatColorTextIcon sx={{ color: state.activeObject.fill }} />
                <ArrowDropDownIcon />
              </ToggleButton>
              <ToggleButton
                aria-labelledby="font-background-color-label"
                value="background color"
                aria-label="background color"
                onClick={() => setIsTextBackgroundColorPickerVisible(true)}
              >
                <FormatColorFillIcon
                  sx={{
                    color: (theme) =>
                      state.activeObject.textBackgroundColor ||
                      theme.palette.text.secondary,
                  }}
                />
                <ArrowDropDownIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <ColorPicker
              initialColor={state.activeObject.fill}
              onChange={(color) => handleTextColorChange(color)}
              onChangeComplete={(color) =>
                setState((prevState) => ({
                  ...prevState,
                  activeObject: { ...prevState.activeObject, fill: color },
                }))
              }
              isPickerVisible={isTextColorPickerVisible}
              setIsPickerVisible={setIsTextColorPickerVisible}
            ></ColorPicker>
            <ColorPicker
              initialColor={state.activeObject.textBackgroundColor}
              onChange={(color) => handleTextBackgroundColorChange(color)}
              onChangeComplete={(color) =>
                setState((prevState) => ({
                  ...prevState,
                  activeObject: {
                    ...prevState.activeObject,
                    textBackgroundColor: color,
                  },
                }))
              }
              isPickerVisible={isTextBackgroundColorPickerVisible}
              setIsPickerVisible={setIsTextBackgroundColorPickerVisible}
              clearable
              onClear={() => handleTextBackgroundColorChange("")}
              disableAlpha={false}
            ></ColorPicker>
          </Grid>
          <Grid item>
            <ToggleButtonGroup
              size="small"
              onChange={handleTextSizeChange}
              aria-label="text size"
            >
              <ToggleButton value="decrease" aria-label="decrease text size">
                <TextDecreaseIcon />
              </ToggleButton>
              <ToggleButton value="increase" aria-label="increase text size">
                <TextIncreaseIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item>
            <ToggleButtonGroup
              size="small"
              onChange={handleTextRotationChange}
              aria-label="text rotate"
            >
              <ToggleButton value="left" aria-label="rotate text left">
                <RotateLeftIcon />
              </ToggleButton>
              <ToggleButton value="right" aria-label="rotate text right">
                <RotateRightIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => state.canvas.discardActiveObject().renderAll()}
        >
          Done
        </Button>
      </Grid>
    </Grid>
  );
};

export default TextContent;
