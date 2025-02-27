import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import SearchModal from "./searchModal";
import { Popover } from "@mui/material";

export default function SearchChat(setFiles: any) {
  const [openSearchModal, setOpenSearchModal] = React.useState(false);
  const handleSearchOpen = () => {
    setOpenSearchModal(true);
  };
  return (
    <Box sx={{ "& > :not(style)": { p: 1} }}>
      <SearchModal open={openSearchModal} setOpen={setOpenSearchModal} setFiles={setFiles} />
      <Fab color="secondary" aria-label="edit" onClick={handleSearchOpen} variant="extended">
        <ManageSearchIcon />
        Custom Search
      </Fab>
    </Box>
  );
}
