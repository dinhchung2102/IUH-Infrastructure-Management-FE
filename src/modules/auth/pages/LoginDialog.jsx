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
import LoginForm from "../components/LoginForm";
import ErrorAlert from "../../../components/ErrorAlert";

export default function LoginDialog({ open, onClose, onSwitchToRegister }) {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const handleErrorClose = () => {
    setError("");
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center" }}>
          {t("auth.login.title")}
        </DialogTitle>

        <DialogContent>
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
              <Link
                component="button"
                variant="body2"
                onClick={onSwitchToRegister}
              >
                {t("auth.login.signUp")}
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
