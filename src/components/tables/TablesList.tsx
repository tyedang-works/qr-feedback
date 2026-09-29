import { Box, Divider, Stack, Typography } from "@mui/material";

import DeleteTableDialog from "@/components/tables/DeleteTableDialog";
import EditTableDialog from "@/components/tables/EditTableDialog";
import TableStatusSwitch from "@/components/tables/TableStatusSwitch";
import type { RestaurantTable } from "@/lib/tables/types";

type TablesListProps = {
    data: RestaurantTable[];
};

export default function TablesList({ data }: TablesListProps) {
    const tableNames = data.map((table) => table.name);

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: 900,
                backgroundColor: "#ffffff",
                border: "1px solid #eaecf0",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
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
                                gridTemplateColumns: "1.5fr 1.5fr 1fr 160px",
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
                                Trạng thái hoạt động
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

                        {data.map((table, index) => (
                            <Box key={table.id}>
                                {index > 0 && <Divider />}

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1.5fr 1.5fr 1fr 160px",
                                        alignItems: "center",
                                        px: 2.5,
                                        py: 1.75,
                                        transition:
                                            "background-color 150ms ease",
                                        "&:hover": {
                                            backgroundColor: "#f8fafc",
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
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            pr: 2,
                                        }}
                                    >
                                        {table.token}
                                    </Typography>

                                    <TableStatusSwitch
                                        tableId={table.id}
                                        isActive={table.isActive}
                                    />

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                            gap: 0.5,
                                        }}
                                    >
                                        <EditTableDialog
                                            tableId={table.id}
                                            tableName={table.name}
                                            tableNames={tableNames}
                                        />

                                        <DeleteTableDialog
                                            tableId={table.id}
                                            tableName={table.name}
                                            disabled={table.hasFeedback}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
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
                        {data.map((table, index) => (
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
                                            flexDirection: "row",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
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
                                                {table.name}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    mt: 0.5,
                                                    fontSize: 12,
                                                    color: "#667085",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {table.token}
                                            </Typography>
                                        </Box>

                                        <Stack
                                            sx={{
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 0.5,
                                                flexShrink: 0,
                                            }}
                                        >
                                            <EditTableDialog
                                                tableId={table.id}
                                                tableName={table.name}
                                                tableNames={tableNames}
                                            />

                                            <DeleteTableDialog
                                                tableId={table.id}
                                                tableName={table.name}
                                                disabled={table.hasFeedback}
                                            />
                                        </Stack>
                                    </Stack>

                                    <Box
                                        sx={{
                                            mt: 1.25,
                                        }}
                                    >
                                        <TableStatusSwitch
                                            tableId={table.id}
                                            isActive={table.isActive}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </>
            )}
        </Box>
    );
}
