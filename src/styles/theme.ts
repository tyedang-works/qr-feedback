import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    typography: {
        fontFamily: "var(--font-momo-trust-sans), sans-serif",
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontFamily: "var(--font-momo-trust-sans), sans-serif",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: 1.2,
                },
            },
        },
    },
});
