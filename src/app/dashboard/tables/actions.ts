"use server";

import { USER_ROLES } from "@/lib/auth/constants";
import { getUserContext } from "@/lib/auth/queries";
import {
    createRestaurantTable,
    deleteRestaurantTable,
    hasRestaurantTableFeedback,
    updateRestaurantTable,
} from "@/lib/tables/queries";
import { revalidatePath } from "next/cache";

export type TableActionState = {
    success: boolean;
    message: string;
    fieldErrors?: {
        name?: string;
    };
};

function canManageTables(role: string): boolean {
    return role === USER_ROLES.OWNER || role === USER_ROLES.MANAGER;
}

function isDuplicateTableNameError(error: unknown): boolean {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
    );
}

export async function createTableAction(
    _previousState: TableActionState,
    formData: FormData,
): Promise<TableActionState> {
    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: "Bạn chưa đăng nhập.",
        };
    }

    if (!canManageTables(userContext.role)) {
        return {
            success: false,
            message: "Bạn không có quyền quản lý bàn.",
        };
    }

    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
        return {
            success: false,
            message: "",
            fieldErrors: {
                name: "Vui lòng nhập tên bàn.",
            },
        };
    }

    try {
        const table = await createRestaurantTable(userContext.restaurantId, {
            name,
        });

        if (!table) {
            return {
                success: false,
                message: "Không thể tạo bàn. Vui lòng thử lại.",
            };
        }

        revalidatePath("/dashboard/tables");

        return {
            success: true,
            message: "Đã tạo bàn thành công.",
        };
    } catch (error) {
        if (isDuplicateTableNameError(error)) {
            return {
                success: false,
                message: "",
                fieldErrors: {
                    name: "Tên bàn này đã tồn tại.",
                },
            };
        }

        console.error("Failed to create table:", error);

        return {
            success: false,
            message: "Không thể tạo bàn. Vui lòng thử lại.",
        };
    }
}

export async function updateTableAction(
    _previousState: TableActionState,
    formData: FormData,
): Promise<TableActionState> {
    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: "Bạn chưa đăng nhập.",
        };
    }

    if (!canManageTables(userContext.role)) {
        return {
            success: false,
            message: "Bạn không có quyền quản lý bàn.",
        };
    }

    const tableId = String(formData.get("tableId") ?? "").trim();

    const name = String(formData.get("name") ?? "").trim();

    const isActiveValue = String(formData.get("isActive") ?? "");

    if (!tableId) {
        return {
            success: false,
            message: "Không xác định được bàn.",
        };
    }

    const updateData: {
        name?: string;
        isActive?: boolean;
    } = {};

    if (name) {
        updateData.name = name;
    }

    if (isActiveValue === "true") {
        updateData.isActive = true;
    }

    if (isActiveValue === "false") {
        updateData.isActive = false;
    }

    if (updateData.name === undefined && updateData.isActive === undefined) {
        return {
            success: false,
            message: "Không có thông tin cần cập nhật.",
        };
    }

    try {
        const table = await updateRestaurantTable(
            userContext.restaurantId,
            tableId,
            updateData,
        );

        if (!table) {
            return {
                success: false,
                message: "Không thể cập nhật bàn. Vui lòng thử lại.",
            };
        }

        revalidatePath("/dashboard/tables");

        return {
            success: true,
            message: "Đã cập nhật bàn thành công.",
        };
    } catch (error) {
        if (isDuplicateTableNameError(error)) {
            return {
                success: false,
                message: "",
                fieldErrors: {
                    name: "Tên bàn này đã tồn tại.",
                },
            };
        }

        console.error("Failed to update table:", error);

        return {
            success: false,
            message: "Không thể cập nhật bàn. Vui lòng thử lại.",
        };
    }
}

export async function deleteTableAction(
    _previousState: TableActionState,
    formData: FormData,
): Promise<TableActionState> {
    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: "Bạn chưa đăng nhập.",
        };
    }

    if (!canManageTables(userContext.role)) {
        return {
            success: false,
            message: "Bạn không có quyền quản lý bàn.",
        };
    }

    const tableId = String(formData.get("tableId") ?? "").trim();

    if (!tableId) {
        return {
            success: false,
            message: "Không xác định được bàn.",
        };
    }

    try {
        const hasFeedback = await hasRestaurantTableFeedback(
            userContext.restaurantId,
            tableId,
        );

        if (hasFeedback) {
            return {
                success: false,
                message:
                    "Không thể xóa bàn đã có phản hồi. Vui lòng tắt bàn thay vì xóa.",
            };
        }

        const deleted = await deleteRestaurantTable(
            userContext.restaurantId,
            tableId,
        );

        if (!deleted) {
            return {
                success: false,
                message: "Không thể xóa bàn. Vui lòng thử lại.",
            };
        }

        revalidatePath("/dashboard/tables");

        return {
            success: true,
            message: "Đã xóa bàn thành công.",
        };
    } catch (error) {
        console.error("Failed to delete table:", error);

        return {
            success: false,
            message: "Không thể xóa bàn. Vui lòng thử lại.",
        };
    }
}

export async function updateTableStatusAction(
    tableId: string,
    isActive: boolean,
): Promise<TableActionState> {
    const userContext = await getUserContext();

    if (!userContext) {
        return {
            success: false,
            message: "Bạn chưa đăng nhập.",
        };
    }

    if (!canManageTables(userContext.role)) {
        return {
            success: false,
            message: "Bạn không có quyền quản lý bàn.",
        };
    }

    if (!tableId) {
        return {
            success: false,
            message: "Không xác định được bàn.",
        };
    }

    try {
        const table = await updateRestaurantTable(
            userContext.restaurantId,
            tableId,
            {
                isActive,
            },
        );

        if (!table) {
            return {
                success: false,
                message: "Không thể cập nhật trạng thái bàn.",
            };
        }

        revalidatePath("/dashboard/tables");

        return {
            success: true,
            message: "",
        };
    } catch (error) {
        console.error("Failed to update table status:", error);

        return {
            success: false,
            message: "Không thể cập nhật trạng thái bàn.",
        };
    }
}
