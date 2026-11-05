"use server";

import { canManageTables } from "@/lib/auth/permissions";
import { getUserContext } from "@/lib/auth/queries";
import {
    createRestaurantTable,
    deleteRestaurantTable,
    hasRestaurantTableFeedback,
    updateRestaurantTable,
} from "@/lib/tables/queries";
import { revalidatePath } from "next/cache";

type TableActionMessageKey =
    | "loginRequired"
    | "tableManagePermissionDenied"
    | "tableNameRequired"
    | "createTableFailed"
    | "createTableSuccess"
    | "duplicateTableName"
    | "tableNotFound"
    | "noTableDataToUpdate"
    | "updateTableFailed"
    | "updateTableSuccess"
    | "cannotDeleteTableWithFeedback"
    | "deleteTableFailed"
    | "deleteTableSuccess"
    | "updateTableStatusFailed";

export type TableActionState = {
    success: boolean;
    message: TableActionMessageKey | "";
    fieldErrors?: {
        name?: TableActionMessageKey;
    };
};

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
            message: "loginRequired",
        };
    }

    if (!canManageTables(userContext.role)) {
        return {
            success: false,
            message: "tableManagePermissionDenied",
        };
    }

    const name = String(formData.get("name") ?? "").trim();

    if (!name) {
        return {
            success: false,
            message: "",
            fieldErrors: {
                name: "tableNameRequired",
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
                message: "createTableFailed",
            };
        }

        revalidatePath("/dashboard/tables");

        return {
            success: true,
            message: "createTableSuccess",
        };
    } catch (error) {
        if (isDuplicateTableNameError(error)) {
            return {
                success: false,
                message: "",
                fieldErrors: {
                    name: "duplicateTableName",
                },
            };
        }

        console.error("Failed to create table:", error);

        return {
            success: false,
            message: "createTableFailed",
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
            message: "loginRequired",
        };
    }

    if (!canManageTables(userContext.role)) {
        return {
            success: false,
            message: "tableManagePermissionDenied",
        };
    }

    const tableId = String(formData.get("tableId") ?? "").trim();

    const name = String(formData.get("name") ?? "").trim();

    const isActiveValue = String(formData.get("isActive") ?? "");

    if (!tableId) {
        return {
            success: false,
            message: "tableNotFound",
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
            message: "noTableDataToUpdate",
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
                message: "updateTableFailed",
            };
        }

        revalidatePath("/dashboard/tables");

        return {
            success: true,
            message: "updateTableSuccess",
        };
    } catch (error) {
        if (isDuplicateTableNameError(error)) {
            return {
                success: false,
                message: "",
                fieldErrors: {
                    name: "duplicateTableName",
                },
            };
        }

        console.error("Failed to update table:", error);

        return {
            success: false,
            message: "updateTableFailed",
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
            message: "loginRequired",
        };
    }

    if (!canManageTables(userContext.role)) {
        return {
            success: false,
            message: "tableManagePermissionDenied",
        };
    }

    const tableId = String(formData.get("tableId") ?? "").trim();

    if (!tableId) {
        return {
            success: false,
            message: "tableNotFound",
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
                message: "cannotDeleteTableWithFeedback",
            };
        }

        const deleted = await deleteRestaurantTable(
            userContext.restaurantId,
            tableId,
        );

        if (!deleted) {
            return {
                success: false,
                message: "deleteTableFailed",
            };
        }

        revalidatePath("/dashboard/tables");

        return {
            success: true,
            message: "deleteTableSuccess",
        };
    } catch (error) {
        console.error("Failed to delete table:", error);

        return {
            success: false,
            message: "deleteTableFailed",
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
            message: "loginRequired",
        };
    }

    if (!canManageTables(userContext.role)) {
        return {
            success: false,
            message: "tableManagePermissionDenied",
        };
    }

    if (!tableId) {
        return {
            success: false,
            message: "tableNotFound",
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
                message: "updateTableStatusFailed",
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
            message: "updateTableStatusFailed",
        };
    }
}
