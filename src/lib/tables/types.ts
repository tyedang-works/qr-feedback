export type RestaurantTable = {
    id: string;
    name: string;
    token: string;
    isActive: boolean;
};

export type CreateTableInput = {
    name: string;
};

export type UpdateTableInput = {
    name?: string;
    isActive?: boolean;
};