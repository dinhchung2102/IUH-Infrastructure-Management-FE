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
import RegisterForm from "../components/RegisterForm";
import ErrorAlert from "../../../components/ErrorAlert";

export default function RegisterDialog({ open, onClose, onSwitchToLogin }) {
  const [error, setError] = useState("");

  const handleErrorClose = () => {
    setError("");
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 600 }}
        >
          Đăng ký
        </DialogTitle>

        <DialogContent>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
            Email @student.iuh.edu.vn sẽ được xác định là sinh viên
          </Typography>

          <RegisterForm onError={setError} onSuccess={onClose} />

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Bạn đã có tài khoản?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={onSwitchToLogin}
                sx={{
                  textDecoration: "none",
                  verticalAlign: "baseline",
                }}
              >
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <ErrorAlert error={error} onClose={handleErrorClose} />
    </>
  );
}
