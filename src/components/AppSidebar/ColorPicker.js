import { Box, Button, Drawer, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { SketchPicker } from "react-color";
import { useMediaQuery } from "@mui/material";

const ColorPicker = ({
  onChange,
  onChangeComplete,
  onClear,
  initialColor,
  isPickerVisible,
  setIsPickerVisible,
  disableAlpha = true,
  clearable = false,
}) => {
  const [color, setColor] = useState("#fff");

  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.between("xs", "md"));

  useEffect(() => {
    if (color !== initialColor) {
      setColor(initialColor);
    }
  }, [initialColor]); // eslint-disable-line

  const handleChange = (c) => {
    setColor(c.hex);
    onChange(c.hex);
  };

  const handleChangeComplete = (c) => {
    onChangeComplete(c.hex);
  };

  const handleClearColor = () => {
    onClear();
    setIsPickerVisible(false);
  };

  return (
    <>
      {matchesSm ? (
        <Drawer anchor="bottom" open={isPickerVisible} hideBackdrop>
          <Box
            sx={{
              padding: 2,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              flexFlow: "column",
            }}
          >
            <SketchPicker
              disableAlpha={disableAlpha}
              presetColors={[]}
              color={color}
              onChange={handleChange}
              onChangeComplete={handleChangeComplete}
              styles={{ width: "100%" }}
            ></SketchPicker>
            {clearable && (
              <Button
                variant="text"
                size="small"
                sx={{ marginTop: 2 }}
                onClick={handleClearColor}
              >
                Clear
              </Button>
            )}

            <Button
              variant="outlined"
              size="large"
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={() => setIsPickerVisible(false)}
            >
              Done
            </Button>
          </Box>
        </Drawer>
      ) : (
        <>
          <Box
            sx={{
              position: "absolute",
              display: isPickerVisible ? "block" : "none",
              userSelect: "none",
              zIndex: (theme) => theme.zIndex.drawer,
            }}
          >
            <SketchPicker
              disableAlpha
              presetColors={[]}
              color={color}
              onChange={handleChange}
              onChangeComplete={handleChangeComplete}
            ></SketchPicker>
            {clearable && (
              <Button
                variant="contained"
                size="small"
                sx={{ marginTop: 2 }}
                onClick={handleClearColor}
              >
                Clear
              </Button>
            )}
          </Box>
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: isPickerVisible ? "block" : "none",
            }}
            onClick={() => setIsPickerVisible(false)}
          ></Box>
        </>
      )}
    </>
  );
};

export default ColorPicker;
