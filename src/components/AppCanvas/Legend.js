import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const Legend = ({ sx }) => {
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  return (
    <>
      <Box sx={{ background: "#fff", zIndex: 1, ...sx }}>
        <Box sx={{ position: "relative" }}>
          <IconButton
            aria-label="legend"
            size="large"
            onClick={() => setIsLegendOpen(true)}
            color="primary"
          >
            <HelpIcon />
          </IconButton>
        </Box>
      </Box>
      <Dialog open={isLegendOpen}>
        <DialogActions>
          <IconButton aria-label="close" onClick={() => setIsLegendOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogTitle>Legend and instructions</DialogTitle>
        <DialogContent>Placeholder dialog</DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={() => setIsLegendOpen(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Legend;
