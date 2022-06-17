import { useMediaQuery, useTheme } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { SelectionTypes } from "../../utils/types";
import DefaultContent from "./DefaultSidebarContent";
import TextContent from "./TextSidebarContent";
import ImageContent from "./ImageSidebarContent";

const AppSidebar = () => {
  const { state } = useAppContext();
  const [currentContent, setCurrentContent] = useState("");

  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.between("xs", "md"));

  useEffect(() => {
    switch (state.activeObject.type) {
      case SelectionTypes.Text:
        setCurrentContent(<TextContent />);
        break;
      case SelectionTypes.Image:
        setCurrentContent(<ImageContent />);
        break;
      default:
        setCurrentContent(null);
    }
  }, [state.activeObject.type]);

  return (
    <Box
      sx={{
        maxWidth: 580,

        height: matchesSm ? "auto" : "100vh", // TODO: Make it dynamic (aka growing when neeeded on mobile)
        overflow: "hidden auto",
      }}
    >
      <Box sx={{ padding: 2 }}>
        {currentContent}
        <DefaultContent />
      </Box>
    </Box>
  );
};

export default AppSidebar;
