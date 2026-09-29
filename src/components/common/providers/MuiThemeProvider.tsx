"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@mui/material/styles";
import { theme } from "@/styles/theme";

type MuiThemeProviderProps = {
    children: ReactNode;
};

export default function MuiThemeProvider({ children }: MuiThemeProviderProps) {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
