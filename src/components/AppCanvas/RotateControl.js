import { Box, IconButton } from "@mui/material";
import Rotate90DegreesCwIcon from "@mui/icons-material/Rotate90DegreesCw";
import { useAppContext } from "../../context/AppContext";

const RotateControl = ({ sx }) => {
  const { actions } = useAppContext();

  return (
    <Box sx={{ background: "#fff", zIndex: 1, ...sx }}>
      <Box sx={{ position: "relative" }}>
        <IconButton
          aria-label="zoom"
          size="large"
          onClick={() => actions.rotateArtboard()}
          color="primary"
        >
          <Rotate90DegreesCwIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default RotateControl;
