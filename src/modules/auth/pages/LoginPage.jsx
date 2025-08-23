import { useState } from "react";
import { Box, Typography, Card, CardContent, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginForm from "../components/LoginForm";
import ErrorAlert from "../../../components/ErrorAlert";

export default function LoginPage() {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const handleErrorClose = () => {
    setError("");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 3,
        }}
      >
        <Card sx={{ maxWidth: 400, width: "100%" }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              {t("auth.login.title")}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mb: 3 }}
            >
              {t("auth.login.subtitle")}
            </Typography>

            <LoginForm onError={setError} />

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                {t("auth.login.noAccount")}{" "}
                <Link component={RouterLink} to="/register" variant="body2">
                  {t("auth.login.signUp")}
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <ErrorAlert error={error} onClose={handleErrorClose} />
    </>
  );
}
