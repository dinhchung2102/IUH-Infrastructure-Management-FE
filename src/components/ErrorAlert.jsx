import * as React from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

export default function ErrorAlert({ error, onClose }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (error) {
      setOpen(true);
      const timer = setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
        }, 300);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, onClose]);

  if (!error) return null;

  return (
    <Box sx={{ paddingX: 10, position: "fixed", bottom: 16, right: 0 }}>
      <Collapse in={open} timeout={300}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
                setTimeout(() => {
                  if (onClose) {
                    onClose();
                  }
                }, 300);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{
            mb: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            borderRadius: 2,
          }}
        >
          {error}
        </Alert>
      </Collapse>
    </Box>
  );
}
