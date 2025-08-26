import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import RegisterForm from "../components/RegisterForm";
import ErrorAlert from "../../../components/ErrorAlert";

export default function RegisterDialog({ open, onClose, onSwitchToLogin }) {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const handleErrorClose = () => {
    setError("");
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}>
          {t("auth.register.title")}
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
            {t("auth.register.subtitle")}
          </Typography>

          <RegisterForm onError={setError} />

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              {t("auth.register.hasAccount")}{" "}
              <Link
                component="button"
                variant="body2"
                onClick={onSwitchToLogin}
              >
                {t("auth.login.signIn")}
              </Link>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>

      <ErrorAlert error={error} onClose={handleErrorClose} />
    </>
  );
}
