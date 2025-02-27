import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { Box, List } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";

const baseStyle = {
  display: "flex",
  flexDirection: "column" as FlexDirection,
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  transition: "border .3s ease-in-out",
  height: "12rem",
};

const activeStyle = {
  borderColor: "#556cd6",
};

const acceptStyle = {
  borderColor: "#556cd6",
};

const rejectStyle = {
  borderColor: "#556cd6",
};

const maxLength = 40;

function nameLengthValidator(file: File) {
  if (file.name.length > maxLength) {
    return {
      code: "name-too-large",
      message: `Name is larger than ${maxLength} characters`,
    };
  }

  return null;
}

function DropzoneComponent(props: any) {
  const { files, setFiles } = props;

  const onDrop = useCallback((acceptedFiles: any) => {
    setFiles(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);

  const {
    fileRejections,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    validator: nameLengthValidator,
    accept: {
      "application/*": [".pdf", ".docx", ".doc"],
    },
  });

  const style: CSSProperties = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const handleDelete = (chipToDelete: any) => () => {
    setFiles((chips: any) =>
      chips.filter((chip: any) => chip.name !== chipToDelete.name)
    );
  };

  const thumbs = (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {files?.map((data: any) => {
        let icon;

        return (
          <ListItem key={data.name}>
            <Chip icon={icon} label={data.name} onDelete={handleDelete(data)} />
          </ListItem>
        );
      })}
    </Paper>
  );

  const fileRejectionItems = fileRejections.map(({ file, errors }: any) => (
    <ListItem key={file.path} sx={{ color: "red", fontSize: 14 }}>
      {file.path} - {file.size} bytes
      <List>
        {errors.map((e: any) => (
          <ListItem key={e.code} sx={{ color: "gray", fontSize: 13 }}>
            {e.message}
          </ListItem>
        ))}
      </List>
    </ListItem>
  ));

  // clean up
  useEffect(
    () => () => {
      files.forEach((file: any) => URL.revokeObjectURL(file?.preview));
    },
    [files]
  );

  return (
    <section>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <Box>
          <AddCircleIcon color="primary" fontSize="large" />
        </Box>
        <div>Click/Drag & drop your files.</div>
      </div>
      <aside>
        {thumbs}
        <ul>{fileRejectionItems}</ul>
      </aside>
    </section>
  );
}

export default DropzoneComponent;
