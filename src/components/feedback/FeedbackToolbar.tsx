import { FEEDBACK_ISSUES } from "@/lib/feedback/constants";
import type { RestaurantTableOption } from "@/lib/tables/queries";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
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
            method="get"
            sx={{
                p: {
                    xs: 1.5,
                    sm: 1.5,
                },
                backgroundColor: "#ffffff",
                border: "1px solid #eaecf0",
                borderRadius: 2,
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
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
                    gap: {
                        xs: 3,
                        md: 1,
                    },
                }}
            >
                {/* Search */}
                <TextField
                    name="keyword"
                    placeholder="Tìm kiếm phản hồi..."
                    defaultValue={keyword}
                    fullWidth
                    size="small"
                    sx={{
                        flex: {
                            md: 1,
                        },
                        minWidth: 0,

                        "& .MuiInputBase-root": {
                            height: 40,
                            fontSize: 14,
                        },

                        "& .MuiInputBase-input": {
                            fontSize: 14,
                        },

                        "& .MuiInputBase-input::placeholder": {
                            fontSize: 14,
                            opacity: 1,
                            color: "#98a2b3",
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
                <FormControl
                    size="small"
                    fullWidth
                    sx={{
                        width: {
                            xs: "100%",
                            md: 220,
                        },
                    }}
                >
                    <InputLabel
                        sx={{
                            fontSize: 14,
                        }}
                    >
                        Vấn đề
                    </InputLabel>

                    <Select
                        name="issue"
                        defaultValue={issue || "all"}
                        label="Vấn đề"
                        sx={{
                            height: 40,
                            fontSize: 14,
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
                    </Select>
                </FormControl>

                {/* Table */}
                <FormControl
                    size="small"
                    fullWidth
                    sx={{
                        width: {
                            xs: "100%",
                            md: 170,
                        },
                    }}
                >
                    <InputLabel
                        sx={{
                            fontSize: 14,
                        }}
                    >
                        Bàn
                    </InputLabel>

                    <Select
                        name="tableId"
                        defaultValue={tableId || "all"}
                        label="Bàn"
                        sx={{
                            height: 40,
                            fontSize: 14,
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
                    </Select>
                </FormControl>

                {/* Search button */}
                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        width: {
                            xs: "100%",
                            md: "auto",
                        },
                        minWidth: {
                            md: 100,
                        },
                        height: 40,
                        px: 2.5,
                        borderRadius: 1.5,
                        backgroundColor: "#1976d2",
                        fontSize: 14,
                        fontWeight: 600,
                        textTransform: "none",
                        boxShadow: "none",
                        flexShrink: 0,

                        "&:hover": {
                            backgroundColor: "#1565c0",
                            boxShadow: "none",
                        },
                    }}
                >
                    Tìm kiếm
                </Button>
            </Stack>
        </Box>
    );
}
