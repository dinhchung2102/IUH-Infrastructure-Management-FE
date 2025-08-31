// OtpDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import authService from "../../../api/auth";

export default function OtpDialog({ open, onClose, email, onConfirm }) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const hasSentOtp = useRef(false);

  useEffect(() => {
    if (open && !hasSentOtp.current) {
 
      hasSentOtp.current = true;
    }
    if (!open) {
      setOtp("");
      setLoading(false);
      setResendTimer(0);
      hasSentOtp.current = false;
    }
  }, [open]);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleConfirm = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      await onConfirm(otp);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await authService.resendOtp({ email });
      setResendTimer(30);
    } catch (err) {
      console.error("Resend OTP failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 2 } }}>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.25rem" }}>
        {t("auth.register.otp.verifyEmail")}
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {t("auth.register.otp.sentTo", { email })}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <TextField
            fullWidth
            placeholder="••••••"
            inputProps={{ maxLength: 6, style: { textAlign: "center", fontSize: "1.2rem", letterSpacing: "0.5rem" } }}
            label={t("auth.register.otp.enterOtp")}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </Box>

        <Button variant="text" disabled={loading || resendTimer > 0} onClick={handleResend}>
          {resendTimer > 0
            ? t("auth.register.otp.resendIn", { seconds: resendTimer })
            : t("auth.register.otp.resend")}
        </Button>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
        <Button onClick={onClose} sx={{ borderRadius: 2 }}>
          {t("common.cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={!otp || loading}
          sx={{ borderRadius: 2, px: 3 }}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {t("auth.register.otp.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
