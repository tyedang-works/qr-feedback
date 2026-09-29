"use server";

import { getUserContext } from "@/lib/auth/queries";
import {
    getQRCodeTablesByIds,
    getQRCodeTablesForBulkPrint,
} from "@/lib/qr-codes/queries";
import type { QRCodeFilters } from "@/lib/qr-codes/types";

export async function getSelectedQRCodeTables(ids: string[]) {
    if (ids.length === 0) {
        return [];
    }

    const userContext = await getUserContext();

    if (!userContext) {
        throw new Error("Không tìm thấy thông tin nhà hàng.");
    }

    return getQRCodeTablesByIds(userContext.restaurantId, ids);
}

export async function getAllQRCodeTablesForBulkPrint(
    filters: QRCodeFilters,
    excludedIds: string[],
) {
    const userContext = await getUserContext();

    if (!userContext) {
        throw new Error("Không tìm thấy thông tin nhà hàng.");
    }

    return getQRCodeTablesForBulkPrint(
        userContext.restaurantId,
        filters,
        excludedIds,
    );
}
