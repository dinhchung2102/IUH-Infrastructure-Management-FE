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
import LoginDialog from "./LoginDialog"; 

export default function RegisterDialog({ open, onClose }) {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [openLogin, setOpenLogin] = useState(false);

  const handleClose = () => {
    onClose?.();
  };

  const handleErrorClose = () => {
    setError("");
  };

  const handleOpenLogin = () => {
    handleClose();      
    setOpenLogin(true);  
  };

  const handleCloseLogin = () => {
    setOpenLogin(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
                onClick={handleOpenLogin}
              >
                {t("auth.login.signIn")}
              </Link>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>

      <LoginDialog open={openLogin} onClose={handleCloseLogin} />

      <ErrorAlert error={error} onClose={handleErrorClose} />
    </>
  );
}
