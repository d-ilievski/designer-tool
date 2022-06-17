import { Box, IconButton, Slider } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import { useState } from "react";
import { useAppContext } from "../../context/AppContext";

const ZoomControl = ({ sx }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { state, actions } = useAppContext();

  function preventHorizontalKeyboardNavigation(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
    }
  }

  return (
    <>
      <Box sx={{ background: "#fff", zIndex: 2, ...sx }}>
        <Box sx={{ position: "relative" }}>
          {isOpen && (
            <Box
              sx={{
                height: 250,
                position: "absolute",
                bottom: 48,
                left: "50%",
                transform: "translateX(-50%)",
                background: "#fff",
                width: 48,
                paddingBottom: 2,
                display: "flex",
                flexFlow: "column",
                alignItems: "center",
              }}
            >
              <IconButton
                aria-label="fit-to-screen"
                size="large"
                onClick={() => actions.fitToScreen()}
                color="primary"
                sx={{ marginBottom: 2 }}
              >
                <FitScreenIcon />
              </IconButton>
              <Slider
                sx={{
                  '& input[type="range"]': {
                    WebkitAppearance: "slider-vertical",
                  },
                }}
                orientation="vertical"
                aria-label="Zoom"
                onKeyDown={preventHorizontalKeyboardNavigation}
                min={state.canvasMinimumScaleFactor}
                max={state.canvasMaximumScaleFactor}
                step={0.05}
                value={state.canvasCurrentScaleFactor}
                onChange={(_, newValue) => actions.zoomArtboard(newValue)}
              />
            </Box>
          )}

          <IconButton
            aria-label="zoom"
            size="large"
            onClick={() => setIsOpen(!isOpen)}
            color="primary"
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: isOpen ? "block" : "none",
          zIndex: 1,
        }}
        onClick={() => setIsOpen(false)}
        onTouchStart={() => setIsOpen(false)}
      ></Box>
    </>
  );
};

export default ZoomControl;
