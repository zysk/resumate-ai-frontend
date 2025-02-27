import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { useAuth } from "../auth/authProvider";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface CustomSnackbarProps {
  open: boolean;
  setOpen: Function;
  severity: AlertColor;
  message: any;
}

export default function CustomSnackbar(props: CustomSnackbarProps) {
  const { open, setOpen, severity } = props;
  const { setSnackOpen, snackOpen, message, setMessage } = useAuth();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setSnackOpen(false);
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar open={snackOpen} autoHideDuration={2000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={message?.color}
          sx={{ width: "100%" }}
        >
          {message?.msg}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
