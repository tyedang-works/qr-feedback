export type RestaurantSettings = {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
};

export type UpdateRestaurantSettingsInput = {
    name: string;
    phone: string;
    email: string;
    address: string;
};
