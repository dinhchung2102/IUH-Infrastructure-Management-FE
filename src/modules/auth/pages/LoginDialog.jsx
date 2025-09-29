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

export default function LoginDialog({
  open,
  onClose,
  onSwitchToRegister,
  onSwitchToForgot,
}) {
  const { t } = useTranslation();
  const [error, setError] = useState("");

  const handleErrorClose = () => {
    setError("");
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.3rem" }}
        >
          {t("auth.login.title")}
        </DialogTitle>

        <DialogContent>
          {/* ✅ Truyền thêm onClose và callbacks xuống LoginForm */}
          <LoginForm
            onError={setError}
            onClose={onClose}
            onSwitchToRegister={onSwitchToRegister}
            onSwitchToForgot={onSwitchToForgot}
          />
        </DialogContent>
      </Dialog>

      <ErrorAlert error={error} onClose={handleErrorClose} />
    </>
  );
}
