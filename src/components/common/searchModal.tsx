import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";
import { useAuth } from "../auth/authProvider";
import { apipost } from "../../services/axiosClient";

interface modalProps {
  open: boolean;
  setOpen: any;
  setFiles: any;
}
export default function SearchModal(props: modalProps) {
  const { open, setOpen, setFiles } = props;
  const { setMessage, setSnackOpen, setLoading } = useAuth();

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: any) => {
    setOpen(false);
    event.preventDefault();
    const data = { question: event?.target?.value };
    setLoading(true);
    try {
      const response = await apipost("/pdf/chat-bot", data);
      console.log(response);
      if (response) {
        setLoading(false);
        setFiles(response?.data?.candidatesData);
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
      setSnackOpen(true);
      setMessage({
        msg: "Not able to search now. Please try again",
        color: "error",
      });
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <DialogTitle>Search for resumes!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              "Discover your ideal candidates by entering your search prompt
              below. Let our AI find the perfect resumes for you!"
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="searchText"
              label="Prompt Here"
              multiline
              rows={5}
              fullWidth
              variant="outlined"
              sx={{borderRadius: 5}}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Search</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
