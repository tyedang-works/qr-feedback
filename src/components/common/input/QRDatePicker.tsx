"use client";

import dayjs from "@/lib/dayjs";
import { Box, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { viVN } from "@mui/x-date-pickers/locales";
import type { DateValidationError } from "@mui/x-date-pickers/models";
import type { Modifier } from "@popperjs/core";
import type { Dayjs } from "dayjs";
import "dayjs/locale/vi";
import { CalendarDays } from "lucide-react";
import type { ComponentProps } from "react";
import { useMemo } from "react";

import { formErrorSx, formLabelSx, formRequiredSx } from "@/styles/form.styles";

const matchAnchorWidthModifier: Modifier<
    "matchAnchorWidth",
    Record<string, never>
> = {
    name: "matchAnchorWidth",
    enabled: true,
    phase: "beforeWrite",
    requires: ["computeStyles"],
    fn: ({ state }) => {
        state.styles.popper.width = `${state.rects.reference.width}px`;
    },
};

const datePickerInputSx = {
    "& .MuiPickersOutlinedInput-root": {
        height: 42,
        borderRadius: 1,
        backgroundColor: "var(--color-input-background)",
        color: "var(--color-text-primary)",
        transition: "background-color 150ms ease, border-color 150ms ease",
        "& .MuiPickersOutlinedInput-notchedOutline": {
            borderWidth: 1,
            borderColor: "var(--color-input-border)",
        },
        "&:hover .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "var(--color-input-border-hover)",
        },
        "&.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
            borderWidth: 1,
            borderColor: "var(--color-input-focus)",
        },
        "&.Mui-error .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#D92D20",
        },
        "&.Mui-error.Mui-focused .MuiPickersOutlinedInput-notchedOutline": {
            borderColor: "#D92D20",
        },
        "&.Mui-disabled": {
            backgroundColor: "var(--color-surface-hover)",
        },
    },
    "& .MuiPickersInputBase-sectionsContainer": {
        display: "flex",
        alignItems: "center",
        height: "100%",
    },
    "& .MuiPickersSectionList-root": {
        display: "flex",
        alignItems: "center",
        fontSize: "13px !important",
        lineHeight: "20px",
        fontFamily: "var(--font-momo-trust-sans)",
    },
    "& .MuiPickersSectionList-section": {
        fontSize: "13px !important",
        lineHeight: "20px",
    },
    "& .MuiPickersSectionList-sectionContent": {
        fontSize: "13px !important",
        fontWeight: 400,
        lineHeight: "20px",
    },
    "& .MuiPickersInputBase-input": {
        boxSizing: "border-box",
        fontSize: "13px !important",
        lineHeight: "20px",
        fontWeight: 400,
        fontFamily: "var(--font-momo-trust-sans)",
        color: "var(--color-text-primary)",
        WebkitTextFillColor: "var(--color-text-primary)",
        "&::placeholder": {
            fontSize: 13,
            color: "var(--color-text-muted)",
            opacity: 0.5,
        },
    },
    "& .MuiIconButton-root": {
        padding: "8px",
        color: "var(--color-text-secondary)",
    },
    "& .lucide": {
        width: 18,
        height: 18,
        strokeWidth: 2,
    },
    "& .MuiPickersInputBase-root.Mui-disabled": {
        backgroundColor: "var(--color-surface-hover)",
    },
};

const datePickerCalendarSx = {
    fontFamily: "var(--font-momo-trust-sans)",
    "& .MuiDateCalendar-root": {
        width: "100%",
        minWidth: 0,
        height: "auto",
        minHeight: 0,
        maxHeight: "none",
        fontFamily: "var(--font-momo-trust-sans)",
    },
    "& .MuiPickersCalendarHeader-root": {
        mt: 1,
        mb: 0.5,
        px: 1.5,
    },
    "& .MuiPickersCalendarHeader-label": {
        fontSize: "13px !important",
        fontWeight: 600,
        color: "var(--color-text-primary)",
    },
    "& .MuiPickersCalendarHeader-switchViewButton, & .MuiPickersArrowSwitcher-button":
        {
            width: 28,
            height: 28,
            color: "var(--color-text-secondary)",
        },
    "& .MuiDateCalendar-viewTransitionContainer": {
        height: "auto",
        flex: "0 0 auto",
        minHeight: 0,
    },
    "& .MuiPickersDay-root, & .MuiMonthCalendar-button, & .MuiYearCalendar-button":
        {
            fontFamily: "var(--font-momo-trust-sans) !important",
            fontSize: "13px !important",
            lineHeight: "20px !important",
            fontWeight: "400 !important",
            color: "var(--color-text-primary)",
            "&:hover": {
                backgroundColor: "var(--color-surface-hover)",
            },
            "&.Mui-selected": {
                backgroundColor: "var(--color-button-primary-bg)",
                color: "var(--color-button-primary-text)",
                fontWeight: "500 !important",

                "&:hover": {
                    backgroundColor: "var(--color-button-primary-hover)",
                },
            },
            "&.Mui-disabled": {
                color: "var(--color-text-muted)",
                opacity: 0.4,
                cursor: "not-allowed",
                backgroundColor: "transparent",
            },
        },

    "& .MuiDayCalendar-weekDayLabel": {
        width: 34,
        height: 30,
        fontSize: "13px !important",
        fontWeight: 500,
        fontFamily: "var(--font-momo-trust-sans)",
        color: "var(--color-text-muted)",
    },
    "& .MuiPickersDay-root": {
        width: 30,
        height: 30,
        margin: "2px",
        borderRadius: 1,
    },
    "& .MuiPickersDay-today": {
        border: "1px solid var(--color-input-focus)",
    },
    "& .MuiYearCalendar-root": {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        width: "100%",
        maxHeight: 260,
        padding: "4px 8px 12px",
        boxSizing: "border-box",
        overflowX: "hidden",
    },
    "& .MuiYearCalendar-button": {
        width: "100%",
        minWidth: 0,
        height: 36,
        margin: "2px 0",
        borderRadius: 1,
        boxSizing: "border-box",
    },
    "& .MuiMonthCalendar-root": {
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        width: "100%",
        height: "auto",
        maxHeight: "none",
        padding: "4px 8px 16px",
        margin: 0,
        boxSizing: "border-box",
        overflowX: "hidden",
    },
    "& .MuiMonthCalendar-button": {
        width: "100%",
        minWidth: 0,
        height: 36,
        margin: "2px 0",
        borderRadius: 1,
        boxSizing: "border-box",
    },
};

const datePickerPopupSx = {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    border: "1px solid var(--color-border)",
    borderRadius: 1.5,
    backgroundColor: "var(--color-surface)",
    backgroundImage: "none",
    color: "var(--color-text-primary)",
    boxShadow: "var(--shadow-card)",
    overflow: "hidden",
};

type QRDatePickerProps = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    minDate?: string;
    maxDate?: string;
    disabled?: boolean;
    required?: boolean;
    errorMessage?: string;
    onError?: (error: DateValidationError | null) => void;
    format?: string;
};

type QRCalendarIconProps = ComponentProps<typeof CalendarDays> & {
    ownerState?: unknown;
};

function QRCalendarIcon({ ownerState, ...props }: QRCalendarIconProps) {
    void ownerState;
    return <CalendarDays {...props} />;
}

export default function QRDatePicker({
    label,
    value,
    onChange,
    minDate,
    maxDate,
    disabled = false,
    required = false,
    errorMessage,
    onError,
    format = "DD/MM/YYYY",
}: QRDatePickerProps) {
    const parsedValue = useMemo<Dayjs | null>(() => {
        if (!value) return null;

        const parsedDate = dayjs(value, "YYYY-MM-DD", true);

        return parsedDate.isValid() ? parsedDate : null;
    }, [value]);

    const parsedMinDate = minDate
        ? dayjs(minDate, "YYYY-MM-DD", true)
        : undefined;

    const parsedMaxDate = maxDate
        ? dayjs(maxDate, "YYYY-MM-DD", true)
        : undefined;

    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="vi"
            localeText={
                viVN.components.MuiLocalizationProvider.defaultProps.localeText
            }
        >
            <Box sx={{ width: "100%", position: "relative" }}>
                {label && (
                    <Typography component="label" sx={formLabelSx}>
                        {label}
                        {required && (
                            <Typography component="span" sx={formRequiredSx}>
                                *
                            </Typography>
                        )}
                    </Typography>
                )}

                <DatePicker
                    value={parsedValue}
                    onChange={(date) => {
                        if (date === null) {
                            onChange("");
                            return;
                        }

                        if (date.isValid()) {
                            onChange(date.format("YYYY-MM-DD"));
                        }
                    }}
                    format={format}
                    onError={onError}
                    minDate={
                        parsedMinDate?.isValid() ? parsedMinDate : undefined
                    }
                    maxDate={
                        parsedMaxDate?.isValid() ? parsedMaxDate : undefined
                    }
                    disableFuture
                    disabled={disabled}
                    slots={{
                        openPickerIcon: QRCalendarIcon,
                    }}
                    views={["year", "month", "day"]}
                    openTo="day"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: "small",
                            sx: datePickerInputSx,
                        },

                        desktopPaper: {
                            sx: {
                                ...datePickerPopupSx,
                                mt: 0.5,
                                ...datePickerCalendarSx,
                            },
                        },

                        popper: {
                            modifiers: [matchAnchorWidthModifier],
                            sx: {
                                "& .MuiPaper-root": {
                                    ...datePickerPopupSx,
                                    ...datePickerCalendarSx,
                                },
                            },
                        },
                    }}
                />

                {errorMessage && (
                    <Typography component="p" sx={formErrorSx}>
                        {errorMessage}
                    </Typography>
                )}
            </Box>
        </LocalizationProvider>
    );
}
