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
import RegisterDialog from "./RegisterDialog"; // import dialog đăng ký

export default function LoginDialog({ open, onClose }) {
  const { t } = useTranslation();
  const [error, setError] = useState("");
  const [openRegister, setOpenRegister] = useState(false);

  const handleErrorClose = () => {
    setError("");
  };

  const handleOpenRegister = () => {
    onClose?.(); // đóng login dialog
    setOpenRegister(true); // mở register dialog
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
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
              <Link component="button" variant="body2" onClick={handleOpenRegister}>
                {t("auth.login.signUp")}
              </Link>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{t("common.close")}</Button>
        </DialogActions>
      </Dialog>

      <RegisterDialog open={openRegister} onClose={handleCloseRegister} />

      <ErrorAlert error={error} onClose={handleErrorClose} />
    </>
  );
}
