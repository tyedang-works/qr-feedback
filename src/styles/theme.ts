import { createTheme } from "@mui/material/styles";

export type ThemeMode = "light" | "dark";

const fontFamily = "var(--font-momo-trust-sans), sans-serif";

export function createAppTheme(mode: ThemeMode) {
    const isDark = mode === "dark";

    return createTheme({
        palette: {
            mode,
            primary: {
                main: isDark ? "#F9FAFB" : "#111827",
                contrastText: isDark ? "#111827" : "#FFFFFF",
            },
            background: {
                default: isDark ? "#111827" : "#FFFFFF",
                paper: isDark ? "#1F2937" : "#FFFFFF",
            },
            text: {
                primary: isDark ? "#F9FAFB" : "#111827",
                secondary: isDark ? "#D1D5DB" : "#6B7280",
                disabled: isDark ? "#6B7280" : "#9CA3AF",
            },
            divider: isDark ? "#374151" : "#F0F1F3",
        },
        typography: {
            fontFamily,
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        fontFamily,
                        backgroundColor: "var(--color-background)",
                        color: "var(--color-text-primary)",
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        fontFamily,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        lineHeight: 1.2,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                    },
                },
            },
        },
    });
}
