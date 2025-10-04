import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

export default function SessionExpiredDialog({ open, onConfirm }) {
  return (
    <Dialog open={open} onClose={() => {}} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <WarningIcon color="warning" fontSize="large" />
          <Typography variant="h6" component="span">
            Phiên đăng nhập đã hết hạn
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục
          sử dụng.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          sx={{ minWidth: 120 }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
