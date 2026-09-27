import { FEEDBACK_ISSUES } from "@/lib/feedback/constants";
import type {
    RestaurantTableOption,
} from "@/lib/tables/queries";
import {
    Box,
    Button,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";

type FeedbackToolbarProps = {
    keyword: string;
    issue: string;
    tableId: string;
    tables: RestaurantTableOption[];
};

export default function FeedbackToolbar({
    keyword,
    issue,
    tableId,
    tables,
}: FeedbackToolbarProps) {
    return (
        <Box
            component="form"
            method="GET"
            sx={{
                p: 1.5,
                border: "1px solid #e4e7ec",
                borderRadius: 2,
                backgroundColor: "#ffffff",
                boxShadow:
                    "0 1px 2px rgba(16, 24, 40, 0.03)",
            }}
        >
            <Stack
                sx={{
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    alignItems: {
                        xs: "stretch",
                        md: "center",
                    },
                    gap: 1.25,
                }}
            >
                {/* Search */}
                <TextField
                    name="keyword"
                    defaultValue={keyword}
                    placeholder="Tìm kiếm phản hồi..."
                    size="small"
                    fullWidth
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        "& .MuiOutlinedInput-root": {
                            height: 40,
                            borderRadius: 1.5,
                            backgroundColor: "#ffffff",
                            "& fieldset": {
                                borderColor: "#d0d5dd",
                            },
                            "&:hover fieldset": {
                                borderColor: "#98a2b3",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1976d2",
                                borderWidth: 1,
                            },
                        },
                        "& .MuiInputBase-input": {
                            fontSize: 14,
                            lineHeight: 1.5,
                            py: 1,
                            px: 1.5,
                            "&::placeholder": {
                                fontSize: 14,
                                color: "#98a2b3",
                                opacity: 1,
                            },
                        },
                        "& .MuiInputBase-input:-webkit-autofill": {
                            WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
                            WebkitTextFillColor: "#344054",
                            caretColor: "#344054",
                            transition: "background-color 5000s ease-in-out 0s",
                        },
                    }}
                />

                {/* Issue */}
                <TextField
                    select
                    name="issue"
                    defaultValue={issue || "all"}
                    size="small"
                    label="Vấn đề"
                    sx={{
                        width: {
                            xs: "100%",
                            md: 220,
                        },
                        "& .MuiOutlinedInput-root": {
                            height: 40,
                            borderRadius: 1.5,
                            backgroundColor: "#ffffff",
                            "& fieldset": {
                                borderColor: "#d0d5dd",
                            },
                            "&:hover fieldset": {
                                borderColor: "#98a2b3",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1976d2",
                                borderWidth: 1,
                            },
                        },

                        "& .MuiInputLabel-root": {
                            fontSize: 14,
                        },
                        "& .MuiInputLabel-shrink": {
                            fontSize: 12,
                        },
                        "& .MuiSelect-select": {
                            fontSize: 14,
                            lineHeight: 1.5,
                            display: "flex",
                            alignItems: "center",
                        },
                        "& .MuiSelect-icon": {
                            color: "#667085",
                        },
                    }}
                >
                    <MenuItem
                        value="all"
                        sx={{
                            fontSize: 14,
                        }}
                    >
                        All
                    </MenuItem>

                    {FEEDBACK_ISSUES.map((item) => (
                        <MenuItem
                            key={item.option}
                            value={item.option}
                            sx={{
                                fontSize: 14,
                            }}
                        >
                            {item.label}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Table */}
                <TextField
                    select
                    name="tableId"
                    defaultValue={tableId || "all"}
                    size="small"
                    label="Bàn"
                    sx={{
                        width: {
                            xs: "100%",
                            md: 170,
                        },
                        "& .MuiOutlinedInput-root": {
                            height: 40,
                            borderRadius: 1.5,
                            backgroundColor: "#ffffff",
                            "& fieldset": {
                                borderColor: "#d0d5dd",
                            },
                            "&:hover fieldset": {
                                borderColor: "#98a2b3",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#1976d2",
                                borderWidth: 1,
                            },
                        },
                        "& .MuiInputLabel-root": {
                            fontSize: 14,
                        },
                        "& .MuiInputLabel-shrink": {
                            fontSize: 12,
                        },
                        "& .MuiSelect-select": {
                            fontSize: 14,
                            lineHeight: 1.5,
                            display: "flex",
                            alignItems: "center",
                        },
                        "& .MuiSelect-icon": {
                            color: "#667085",
                        },
                    }}
                >
                    <MenuItem
                        value="all"
                        sx={{
                            fontSize: 14,
                        }}
                    >
                        All
                    </MenuItem>

                    {tables.map((table) => (
                        <MenuItem
                            key={table.id}
                            value={table.id}
                            sx={{
                                fontSize: 14,
                            }}
                        >
                            {table.name}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Submit */}
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        minWidth: {
                            xs: "100%",
                            md: 100,
                        },
                        height: 40,
                        px: 2,
                        borderRadius: 1.5,
                        textTransform: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        boxShadow:
                            "0 1px 2px rgba(16, 24, 40, 0.08)",
                    }}
                >
                    Tìm kiếm
                </Button>
            </Stack>
        </Box>
    );
}