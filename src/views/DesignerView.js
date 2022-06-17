import { Grid, useTheme } from "@mui/material";
import AppCanvas from "../components/AppCanvas/AppCanvas";
import AppSidebar from "../components/AppSidebar/AppSidebar";
import useMediaQuery from "@mui/material/useMediaQuery";

const DesignerView = () => {
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.between("xs", "md"));

  return (
    <Grid container>
      <Grid item xs={12} md={8} sx={{ height: matchesSm ? "70vh" : "100vh" }}>
        <AppCanvas />
      </Grid>
      <Grid item xs={12} md={4}>
        <AppSidebar />
      </Grid>
    </Grid>
  );
};

export default DesignerView;
