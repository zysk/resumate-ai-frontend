import * as React from "react";
import {
  AlertColor,
  Autocomplete,
  Box,
  Button,
  Chip,
  DialogContentText,
  Divider,
  Fab,
  FormLabel,
  Grid,
  IconButton,
  InputBase,
  LinearProgress,
  ListItem,
  MenuItem,
  Paper,
  Popover,
  Popper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridToolbar,
  GridRenderCellParams,
  GridActionsCellItem,
  GridRowParams,
} from "@mui/x-data-grid";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import axios from "axios";
import MaxWidthDialog from "../common/dialogBox";
import DropzoneComponent from "../common/dropzone";
import CustomSnackbar from "../common/snackBar";
import { useAuth } from "../auth/authProvider";
import { apidelete, apiget, apipost, apiput } from "../../services/axiosClient";
import { BASE_URL } from "../../appConstants";
import ReactWordcloud from "react-wordcloud";
import SearchChat from "../common/searchChat";
import { ChipColors, colors } from "../../services/colorsUtils";

export default function Table() {
  const { loading, snackOpen, setSnackOpen, message, setLoading, setMessage } =
    useAuth();
  const [open, setOpen] = React.useState(false);
  const [files, setFiles] = React.useState([] as any);
  const [selectedParams, setSelectedParams] = React.useState<any>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [data, setData] = React.useState([] as any);
  const [icon, setIcon] = React.useState(
    Array.from({ length: files?.length }, () => false)
  );
  const [status, setStatus] = React.useState(
    Array.from({ length: files?.length }, () => "")
  );
  const [comments, setComments] = React.useState(
    Array.from({ length: files?.length }, () => "")
  );
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const [anchorElName, setAnchorElName] = React.useState<null | HTMLElement>(
    null
  );

  const handleClose = () => {
    setOpen(false);
    setFiles([]);
  };

  const formatData = (list: any) => {
    const formattedData = [] as any;
    list?.map((resume: any, index: number) => {
      formattedData?.push({
        resumeId: resume?._id,
        id: index + 1,
        isDeleted: resume?.isDeleted,
        name: resume?.name,
        email: resume?.email,
        phone: resume?.phone,
        role: resume?.suitable_role,
        score: resume?.score,
        location: resume?.place,
        skills: resume?.skills,
        status: resume?.status,
        comments: resume?.comments,
      });
    });
    setData(formattedData);
    setLoading(false);
  };

  const fetchResumes = async () => {
    try {
      const data = await apiget("/pdf/list-scores");
      if (data?.data) {
        formatData(data?.data);
      }
    } catch (err: any) {
      setLoading(false);
      setSnackOpen(true);
      setMessage({ msg: "failed", color: "error" });
    }
  };

  const fetchEmails = async (email: string, index: number) => {
    try {
      const results = await apipost(`/pdf/generate-score?email=${email}`, {});
      if (index === files.length - 1 && results?.data) {
        setSnackOpen(true);
        setMessage({ msg: "uploaded files!!", color: "success" });
      }
      return results?.data;
    } catch (err: any) {
      setLoading(false);
      setSnackOpen(true);
      setMessage({ msg: "failed", color: "error" });
    }
  };

  const handleSubmit = async () => {
    setOpen(false);
    const formData = new FormData();
    files.map((file: File) => {
      formData.append("files", file);
    });
    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/pdf/extract-texts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response) {
        const emailPromises = response?.data?.map(
          (file: any, index: number) => {
            return fetchEmails(file?.text?.email, index);
          }
        );

        // Wait for all emailPromises to complete
        const emailsResults = await Promise.all(emailPromises);

        // Check if all email fetches were successful before calling fetchResumes
        if (emailsResults.every((result) => result !== null)) {
          await fetchResumes();
        }
        setFiles([]);
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
      setSnackOpen(true);
      setMessage({ msg: "failed", color: "error" });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setFiles([]);
  };

  const handleOpen = async (params: any) => {
    try {
      const email = params?.row?.email;
      const response = await apiget(`/pdf/list-S3?email=${email}`);
      const url = response?.data?.s3Url;
      if (response) window?.open(url, "_blank")?.focus();
    } catch (err: any) {
      setLoading(false);
      setSnackOpen(true);
      setMessage({ msg: "Failed to Open", color: "error" });
    }
  };

  const handleDelete = async () => {
    setDeleteOpen(false);
    setLoading(true);
    try {
      const email = selectedParams?.row?.email;
      const response = await apidelete(`/pdf/delete-user-score?email=${email}`);
      if (response?.data?.statusCode == 204) {
        setSnackOpen(true);
        setMessage({ msg: "Deleted successfully", color: "success" });
        fetchResumes();
        setLoading(false);
      }
    } catch (err: any) {
      setLoading(false);
      setSnackOpen(true);
      setMessage({ msg: "Failed to Delete", color: "error" });
    }
  };

  const handleDeleteConfirm = (params: any) => {
    setDeleteOpen(true);
    setSelectedParams(params);
  };

  React.useEffect(() => {
    setLoading(true);
    fetchResumes();
  }, []);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      headerClassName: "columnHeader",
      headerAlign: "left",
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      headerClassName: "columnHeader",
      headerAlign: "left",
      renderCell: (params: GridRenderCellParams<any>) => {
        const skills = params?.row?.skills.map((skill: any) => ({
          text: skill?.skill,
          value: skill?.score,
        }));

        const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
          setAnchorElName(event.currentTarget);
        };

        const handlePopoverClose = () => {
          setAnchorElName(null);
        };

        const openName = Boolean(anchorEl);
        return (
          <div>
            <Typography
              aria-owns={openName ? "mouse-over-popover" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
            >
              {params?.value}
            </Typography>
            <Popover
              id="mouse-over-popover"
              sx={{
                pointerEvents: "none",
              }}
              open={openName}
              anchorEl={anchorElName}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <ReactWordcloud words={skills} />
              <Typography sx={{ p: 1 }}>{params?.value}</Typography>
            </Popover>
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 300,
      maxWidth: 400,
      headerClassName: "columnHeader",
      headerAlign: "left",
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
      maxWidth: 300,
      headerClassName: "columnHeader",
      headerAlign: "left",
    },
    {
      field: "location",
      headerName: "Present Location",
      width: 150,
      maxWidth: 300,
      headerClassName: "columnHeader",
      headerAlign: "left",
    },
    {
      field: "role",
      headerName: "Suited Role",
      width: 150,
      headerClassName: "columnHeader",
      headerAlign: "left",
    },
    {
      field: "score",
      headerName: "Score",
      headerClassName: "columnHeader",
      headerAlign: "left",
      renderCell: (params: GridRenderCellParams<any>) => {
        let color = "0,0,0";
        let progress = params?.value;
        if (params?.value >= 75) {
          color = "133, 224, 133";
        } else if (params?.value >= 50) {
          color = "255, 153, 51";
        } else {
          color = "230, 0, 0";
        }
        return (
          <Stack sx={{ width: "100%" }}>
            <FormLabel sx={{ fontSize: 12 }}>{progress}%</FormLabel>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                borderRadius: 5,
                height: 10,
                backgroundColor: `rgb(${color},0.4)`,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: `rgb(${color})`,
                },
              }}
            />
          </Stack>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 180,
      headerClassName: "columnHeader",
      headerAlign: "left",
      renderCell: (params: GridRenderCellParams<any>) => {
        const handleChange = async (
          event: SelectChangeEvent,
          index: number
        ) => {
          const newStatuses = [...status];
          newStatuses[index] = event.target.value;
          setStatus(newStatuses);
          const data = {
            email: params?.row?.email,
            status: event?.target?.value,
            comments: params?.row?.comments,
          };
          try {
            const response = await apiput("/pdf/update-status/comments", data);
            if (response) {
              setSnackOpen(true);
              setMessage({ msg: "Status updated", color: "success" });
            }
          } catch (err) {
            setSnackOpen(true);
            setMessage({ msg: "Could not update status", color: "error" });
          }
        };
        let options = [
          { label: "New", value: "New" },
          { label: "InProgress", value: "InProgress" },
          { label: "Shortlisted", value: "Shortlisted" },
          { label: "OnHold", value: "OnHold" },
          { label: "Selected", value: "Selected" },
          { label: "Rejected", value: "Rejected" },
          { label: "Scheduled", value: "InterviewScheduled" },
        ];
        return (
          <Stack sx={{ width: "100%" }}>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={status[params?.row?.id - 1]}
              defaultValue={params?.value}
              onChange={(event) => handleChange(event, params?.row?.id - 1)}
              label="Status"
              variant="outlined"
              color="secondary"
              sx={{
                p: 0,
                m: 1,
                borderRadius: 5,
                height: 30,
                borderColor: "#556cd6",
              }}
            >
              {options.map((opt: any) => {
                return <MenuItem value={opt?.value}>{opt?.label}</MenuItem>;
              })}
            </Select>
          </Stack>
        );
      },
    },
    {
      field: "skills",
      headerName: "Skills",
      width: 300,
      maxWidth: 800,
      headerClassName: "columnHeader",
      headerAlign: "left",
      type: "actions",
      renderCell: (params: GridRenderCellParams<any>) => {
        let arr = [] as any;
        arr = params?.value
          ?.sort((a: any, b: any) => b?.score - a?.score)
          ?.slice(0, 4);
        return (
          <Grid container spacing={1}>
            {arr?.map((data: any, index: number) => {
              return (
                <Grid item>
                  <Chip
                    label={data?.skill}
                    sx={{
                      background: colors[index % colors.length],
                      borderColor: ChipColors[index]?.darkColor,
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        );
      },
    },
    {
      field: "comments",
      headerName: "Comments",
      minWidth: 240,
      headerClassName: "columnHeader",
      headerAlign: "left",
      renderCell: (params: GridRenderCellParams<any, Date>) => {
        const handleIconChange = async (event: any, index: number) => {
          const newIcons = [...icon];
          newIcons[index] = true;
          setIcon(newIcons);
          const newComments = [...comments];
          newComments[index] = event.target.value;
          setComments(newComments);
        };
        const handleChange = async (event: any, index: number) => {
          const newIcons = [...icon];
          newIcons[index] = false;
          setIcon(newIcons);
          const data = {
            email: params?.row?.email,
            status: params?.row?.status,
            comments: event?.target?.value,
          };
          try {
            const response = await apiput("/pdf/update-status/comments", data);
            if (response) {
              setSnackOpen(true);
              setMessage({ msg: "Comments updated", color: "success" });
            }
          } catch (err) {
            setSnackOpen(true);
            setMessage({ msg: "Could not update comments", color: "error" });
          }
        };
        return (
          <Stack sx={{ width: "100%" }}>
            <Paper
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                background: "#e5e8e8",
                fontSize: 4,
              }}
            >
              <TextField
                sx={{ ml: 1, flex: 1, border: "none !important" }}
                inputProps={{ "aria-label": "add comments" }}
                multiline
                rows={2}
                variant="standard"
                value={comments[params?.row?.id - 1]}
                defaultValue={params?.value}
                onChange={(event) =>
                  handleIconChange(event, params?.row?.id - 1)
                }
              />
              {icon[params?.row?.id - 1] && (
                <IconButton
                  type="submit"
                  sx={{ p: "10px" }}
                  aria-label="submit"
                  onClick={(event) => handleChange(event, params?.row?.id - 1)}
                >
                  <DoneOutlinedIcon color="primary" />
                </IconButton>
              )}
            </Paper>
          </Stack>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      pinnable: true,
      type: "actions",
      headerClassName: "columnHeader",
      headerAlign: "left",
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          icon={<RemoveRedEyeOutlinedIcon color="primary" />}
          onClick={(e: any) => handleOpen(params)}
          label="Open"
        />,
        <GridActionsCellItem
          icon={<DeleteForeverOutlinedIcon color="error" />}
          onClick={(e: any) => handleDeleteConfirm(params)}
          label="Delete"
        />,
      ],
    },
  ];
  const rows = data;

  return (
    <Box
      sx={{
        width: "100%",
        py: 5,
        px: 2,
        borderRadius: 5,
        "& .columnHeader": {
          backgroundColor: "#e5e8e8",
          fontSize: 16,
          fontWeight: 500,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          alignContent: "center",
          py: 2,
        }}
      >
        <Fab
          color="secondary"
          aria-label="edit"
          onClick={handleClickOpen}
          variant="extended"
        >
          <UploadFileIcon />
          Upload
        </Fab>
        <Box>
          <SearchChat setFiles={setFiles} />
        </Box>
      </Box>
      <MaxWidthDialog
        setOpen={setOpen}
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        children={<DropzoneComponent files={files} setFiles={setFiles} />}
      />
      <DataGrid
        autoHeight={true}
        rows={rows}
        columns={columns}
        slots={{
          toolbar: GridToolbar,
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
            },
          },
          columns: {
            columnVisibilityModel: {
              // Hide columns status and traderName, the other columns will remain visible
              comments: false,
              status: true,
              role: true,
            },
          },
        }}
        pageSizeOptions={[10]}
        sx={{
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
            py: 1,
          },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "15px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "22px",
          },
        }}
        // checkboxSelection
        disableRowSelectionOnClick
        getRowHeight={() => "auto"}
        components={{
          NoRowsOverlay: () => (
            <Box height="100%" alignItems="center" justifyContent="center">
              No rows in DataGrid
            </Box>
          ),
          NoResultsOverlay: () => (
            <Box height="100%" alignItems="center" justifyContent="center">
              Local filter returns no result
            </Box>
          ),
        }}
      />
      <MaxWidthDialog
        setOpen={setDeleteOpen}
        open={deleteOpen}
        handleClose={() => {
          setDeleteOpen(false);
        }}
        handleSubmit={handleDelete}
        sizeSmall={true}
        title=" Are you sure you want to delete?"
        primaryButtonText="Delete"
        children={
          <Box>
            <DialogContentText>
              This resume will be deleted permanently. Please confirm your
              action.
            </DialogContentText>
          </Box>
        }
      />
    </Box>
  );
}
