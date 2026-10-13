import PageHeader from "@/components/common/layout/PageHeader";
import AddTableDialog from "@/components/tables/AddTableDialog";
import TablesList from "@/components/tables/TablesList";
import TablesSummary from "@/components/tables/TablesSummary";
import { canManageTables as canManageTablesPermission } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import {
    getRestaurantTableList,
    getRestaurantTableSummary,
} from "@/lib/tables/queries";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { Box, Stack } from "@mui/material";

export default async function TablesPage() {
    const userContext = await getUserContext();

    if (!userContext) {
        return null;
    }

    const [tables, summary] = await Promise.all([
        getRestaurantTableList(userContext.restaurantId),
        getRestaurantTableSummary(userContext.restaurantId),
    ]);

    const canManageTables = canManageTablesPermission(userContext.role);

    return (
        <Stack
            sx={{
                gap: { xs: 2.5, sm: 3 },
                width: "100%",
                minWidth: 0,
            }}
        >
            <Stack
                sx={{
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: {
                        xs: "stretch",
                        sm: "center",
                    },
                    justifyContent: "space-between",
                    gap: 2,
                }}
            >
                <PageHeader
                    title="Quản lý bàn"
                    subtitle="Quản lý bàn và mã QR của nhà hàng."
                    icon={faTableCellsLarge}
                />

                {canManageTables && (
                    <Box sx={{ flexShrink: 0 }}>
                        <AddTableDialog
                            tableNames={tables.map((table) => table.name)}
                        />
                    </Box>
                )}
            </Stack>

            <TablesSummary data={summary} />
            <TablesList data={tables} canManageTables={canManageTables} />
        </Stack>
    );
}
