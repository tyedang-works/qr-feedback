import PageHeader from "@/components/common/layout/PageHeader";
import AddTableDialog from "@/components/tables/AddTableDialog";
import TablesList from "@/components/tables/TablesList";
import TablesSummary from "@/components/tables/TablesSummary";
import { Locale, translations } from "@/i18n/translations";
import { canManageTables as canManageTablesPermission } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import {
    getRestaurantTableList,
    getRestaurantTableSummary,
} from "@/lib/tables/queries";
import { Box, Stack } from "@mui/material";
import { Table2 } from "lucide-react";
import { cookies } from "next/headers";

export default async function TablesPage() {
    const cookieStore = await cookies();
    const locale: Locale =
        cookieStore.get("qr-locale")?.value === "en" ? "en" : "vi";

    const t = translations[locale].table;
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
                gap: 1,
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
                    mb: 1.5,
                }}
            >
                <PageHeader
                    title={t.tablesManagement}
                    subtitle={t.tablesManagementDescription}
                    icon={Table2}
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
