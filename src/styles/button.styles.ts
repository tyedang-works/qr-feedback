import { SxProps, Theme } from "@mui/material/styles";

export const buttonBaseSx: SxProps<Theme> = {
    minWidth: 100,
    height: 40,
    borderRadius: 1.5,
    backgroundColor: "#193B56",
    fontSize: 14,
    fontWeight: 400,
    textTransform: "none",
    boxShadow: "none",
    "&:hover": {
        backgroundColor: "#142f45",
        boxShadow: "none",
    },
};

export const buttonBaseCancelSx: SxProps<Theme> = {
    minWidth: 88,
    minHeight: 40,
    borderColor: "#D0D5DD",
    color: "#344054",
    textTransform: "none",
    borderRadius: 2,
    "&:hover": {
        borderColor: "#98A2B3",
        backgroundColor: "#F9FAFB",
    },
};
