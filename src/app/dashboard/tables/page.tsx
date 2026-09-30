import { Box, Button, Stack, Typography } from "@mui/material";

import TablesList from "@/components/tables/TablesList";
import TablesSummary from "@/components/tables/TablesSummary";
import { getUserContext } from "@/lib/auth/queries";
import {
    getRestaurantTableList,
    getRestaurantTableSummary,
} from "@/lib/tables/queries";
import AddTableDialog from "@/components/tables/AddTableDialog";

export default async function TablesPage() {
    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    const [tables, summary] = await Promise.all([
        getRestaurantTableList(userContext.restaurantId),
        getRestaurantTableSummary(userContext.restaurantId),
    ]);

    return (
        <Stack
            sx={{
                gap: { xs: 2.5, sm: 3 },
            }}
        >
            <Stack
                sx={{
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: {
                        xs: "flex-start",
                        sm: "center",
                    },
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            fontSize: {
                                xs: 22,
                                sm: 24,
                            },
                            lineHeight: 1.3,
                            fontWeight: 700,
                            color: "#193B56",
                        }}
                    >
                        Quản lý bàn
                    </Typography>

                    <Typography
                        sx={{
                            mt: 0.5,
                            fontSize: 14,
                            color: "#667085",
                        }}
                    >
                        Quản lý bàn và mã QR của nhà hàng.
                    </Typography>
                </Box>

                <AddTableDialog
                    tableNames={tables.map((table) => table.name)}
                />
            </Stack>

            <TablesSummary data={summary} />

            <TablesList data={tables} />
        </Stack>
    );
}
