import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useAuth } from "../auth/authProvider";
import loader from "../../smart-robot-with-idea.gif";
import { Box, IconButton } from "@mui/material";

export default function SimpleBackdrop() {
  const { loading, setLoading } = useAuth();
  const handleClose = () => {
    setLoading(false);
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1, opacity: 0.1, overflow: 'hidden' }}
        open={loading}
        onClick={handleClose}
      >
        {" "}
        <Box sx={{width: 100, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          {/* <CircularProgress sx={{width: 100}} color="primary" /> */}
          <img src={loader} alt="loading..." width={400} height={"auto"} />
        </Box>
      </Backdrop>
    </div>
  );
}
