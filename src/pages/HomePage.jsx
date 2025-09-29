import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100%",
        py: 4,
        px: { xs: 2, sm: 4, md: 6, lg: 8 },
        width: "100%",
        maxWidth: "100vw",
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom align="center">
        {t("home.welcome")}
      </Typography>

      <Typography
        variant="h6"
        color="text.secondary"
        align="center"
        paragraph
        sx={{ mb: 4 }}
      >
        {t("home.subtitle")}
      </Typography>

      <Grid container spacing={3} sx={{ maxWidth: "100%", width: "100%" }}>
        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent
              sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                {t("home.dashboardCard.title")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                {t("home.dashboardCard.description")}
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/dashboard"
                sx={{ mt: 2, alignSelf: "flex-start" }}
              >
                {t("home.dashboardCard.button")}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent
              sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                {t("home.infrastructureCard.title")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                {t("home.infrastructureCard.description")}
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/infrastructure"
                sx={{ mt: 2, alignSelf: "flex-start" }}
              >
                {t("home.infrastructureCard.button")}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <CardContent
              sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h5" component="h2" gutterBottom>
                {t("home.reportsCard.title")}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ flexGrow: 1 }}
              >
                {t("home.reportsCard.description")}
              </Typography>
              <Button
                variant="contained"
                component={RouterLink}
                to="/reports"
                sx={{ mt: 2, alignSelf: "flex-start" }}
              >
                {t("home.reportsCard.button")}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
