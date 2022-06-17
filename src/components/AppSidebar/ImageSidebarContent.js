import {
  Grid,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import { useAppContext } from "../../context/AppContext";

const TextContent = () => {
  const { state } = useAppContext();

  const handleImageSizeChange = (_, value) => {
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

  const handleImageRotationChange = (_, value) => {
    const activeObject = state.canvas.getActiveObject();
    if (!activeObject) return;

    if (value[0] === "left") {
      activeObject.rotate(activeObject.get("angle") - 90);
    } else if (value[0] === "right") {
      activeObject.rotate(activeObject.get("angle") + 90);
    }

    state.canvas.requestRenderAll();
  };

  const handleImageAutoSize = (_, value) => {
    const activeObject = state.canvas.getActiveObject();
    if (!activeObject) return;

    activeObject.scale(1);
    const artboardCenter = state.canvasArtboard.getCenterPoint();

    if (value[0] === "fill") {
      if (state.canvasArtboardRotation === "vertical") {
        activeObject.scaleToHeight(
          state.canvasArtboard.height * state.canvasCurrentScaleFactor
        );
      } else {
        activeObject.scaleToWidth(
          state.canvasArtboard.height * state.canvasCurrentScaleFactor
        );
      }

      activeObject.set({ top: artboardCenter.y, left: artboardCenter.x });
    } else if (value[0] === "fit") {
      if (state.canvasArtboardRotation === "vertical") {
        activeObject.scaleToWidth(
          state.canvasArtboard.width * state.canvasCurrentScaleFactor
        );
      } else {
        activeObject.scaleToHeight(
          state.canvasArtboard.width * state.canvasCurrentScaleFactor
        );
      }

      activeObject.set({ left: artboardCenter.x });
    }
    activeObject.setCoords();

    state.canvas.requestRenderAll();
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <InputLabel>Image Size</InputLabel>
            <ToggleButtonGroup
              onChange={handleImageSizeChange}
              aria-label="image size"
            >
              <ToggleButton value="decrease" aria-label="decrease image size">
                <RemoveIcon />
              </ToggleButton>
              <ToggleButton value="increase" aria-label="increase image size">
                <AddIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item>
            <InputLabel>Image Rotation</InputLabel>
            <ToggleButtonGroup
              onChange={handleImageRotationChange}
              aria-label="image rotate"
            >
              <ToggleButton value="left" aria-label="rotate image left">
                <RotateLeftIcon />
              </ToggleButton>
              <ToggleButton value="right" aria-label="rotate image right">
                <RotateRightIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item>
            <InputLabel>Auto Sizing</InputLabel>
            <ToggleButtonGroup
              onChange={handleImageAutoSize}
              aria-label="image auto sizing"
            >
              <ToggleButton value="fill" aria-label="fill skateboard">
                Fill
              </ToggleButton>
              <ToggleButton value="fit" aria-label="fit skateboard">
                Fit
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default TextContent;
