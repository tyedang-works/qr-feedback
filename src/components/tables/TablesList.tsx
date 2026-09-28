import {
    Box,
    Chip,
    Divider,
    Stack,
    Typography,
} from "@mui/material";

import type { RestaurantTable } from "@/lib/tables/types";

type TablesListProps = {
    data: RestaurantTable[];
};

function getStatusStyles(isActive: boolean) {
    if (isActive) {
        return {
            backgroundColor: "#ecfdf3",
            color: "#027a48",
            label: "Đang hoạt động",
        };
    }

    return {
        backgroundColor: "#f2f4f7",
        color: "#667085",
        label: "Đã tắt",
    };
}

export default function TablesList({
    data,
}: TablesListProps) {
    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 900,
                backgroundColor: "#ffffff",
                border: "1px solid #eaecf0",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow:
                    "0 1px 2px rgba(16, 24, 40, 0.04)",
            }}
        >
            {data.length === 0 ? (
                <Box
                    sx={{
                        px: 2,
                        py: 6,
                        textAlign: "center",
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "#344054",
                        }}
                    >
                        Chưa có bàn nào
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 13,
                            color: "#98a2b3",
                        }}
                    >
                        Hãy thêm bàn đầu tiên cho nhà hàng của bạn.
                    </Typography>
                </Box>
            ) : (
                <>
                    {/* Desktop */}
                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "1.5fr 1.5fr 1fr 80px",
                                alignItems: "center",
                                px: 2.5,
                                py: 1.5,
                                backgroundColor: "#f8fafc",
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#667085",
                                }}
                            >
                                Bàn
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#667085",
                                }}
                            >
                                Mã QR
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#667085",
                                }}
                            >
                                Trạng thái
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#667085",
                                    textAlign: "right",
                                }}
                            >
                                Thao tác
                            </Typography>
                        </Box>

                        <Divider />

                        {data.map((table, index) => {
                            const status =
                                getStatusStyles(
                                    table.isActive,
                                );

                            return (
                                <Box key={table.id}>
                                    {index > 0 && <Divider />}

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gridTemplateColumns:
                                                "1.5fr 1.5fr 1fr 80px",
                                            alignItems: "center",
                                            px: 2.5,
                                            py: 1.75,
                                            transition:
                                                "background-color 150ms ease",
                                            "&:hover": {
                                                backgroundColor:
                                                    "#f8fafc",
                                            },
                                        }}
                                    >
                                        <Typography
                                            sx={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: "#193B56",
                                            }}
                                        >
                                            {table.name}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                color: "#667085",
                                                overflow:
                                                    "hidden",
                                                textOverflow:
                                                    "ellipsis",
                                                whiteSpace:
                                                    "nowrap",
                                                pr: 2,
                                            }}
                                        >
                                            {table.token}
                                        </Typography>

                                        <Box>
                                            <Chip
                                                label={
                                                    status.label
                                                }
                                                size="small"
                                                sx={{
                                                    height: 28,
                                                    borderRadius: 1.5,
                                                    backgroundColor:
                                                        status.backgroundColor,
                                                    color: status.color,
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </Box>

                                        <Typography
                                            sx={{
                                                fontSize: 20,
                                                lineHeight: 1,
                                                color: "#98a2b3",
                                                textAlign:
                                                    "right",
                                            }}
                                        >
                                            ⋮
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Mobile */}
                    <Stack
                        sx={{
                            display: {
                                xs: "flex",
                                sm: "none",
                            },
                        }}
                    >
                        {data.map((table, index) => {
                            const status =
                                getStatusStyles(
                                    table.isActive,
                                );

                            return (
                                <Box key={table.id}>
                                    {index > 0 && <Divider />}

                                    <Box
                                        sx={{
                                            px: 2,
                                            py: 2,
                                        }}
                                    >
                                        <Stack
                                            sx={{
                                                flexDirection:
                                                    "row",
                                                alignItems:
                                                    "flex-start",
                                                justifyContent:
                                                    "space-between",
                                                gap: 1.5,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    minWidth: 0,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 15,
                                                        fontWeight: 600,
                                                        color: "#193B56",
                                                    }}
                                                >
                                                    {
                                                        table.name
                                                    }
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        mt: 0.5,
                                                        fontSize: 12,
                                                        color: "#667085",
                                                        overflow:
                                                            "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace:
                                                            "nowrap",
                                                    }}
                                                >
                                                    {
                                                        table.token
                                                    }
                                                </Typography>
                                            </Box>

                                            <Typography
                                                sx={{
                                                    flexShrink: 0,
                                                    fontSize: 20,
                                                    lineHeight: 1,
                                                    color: "#98a2b3",
                                                }}
                                            >
                                                ⋮
                                            </Typography>
                                        </Stack>

                                        <Chip
                                            label={
                                                status.label
                                            }
                                            size="small"
                                            sx={{
                                                mt: 1.25,
                                                height: 28,
                                                borderRadius: 1.5,
                                                backgroundColor:
                                                    status.backgroundColor,
                                                color: status.color,
                                                fontSize: 12,
                                                fontWeight: 500,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            );
                        })}
                    </Stack>
                </>
            )}
        </Box>
    );
}