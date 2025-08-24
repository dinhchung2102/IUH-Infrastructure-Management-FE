import { Box, Typography, Card, CardContent, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import { useTranslation } from "react-i18next";

export default function RegisterPage() {
   const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 3,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t("auth.register.title")}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
           {t("auth.register.subtitle")}
          </Typography>

          <RegisterForm />

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" variant="body2">
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
