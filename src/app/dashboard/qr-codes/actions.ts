"use server";

import { getUserContext } from "@/lib/auth/queries";
import { getQRCodeTablesByIds } from "@/lib/qr-codes/queries";

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
