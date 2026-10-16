export type RestaurantSettings = {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    logo_url: string | null;
    favicon_url: string | null;
};

export type UpdateRestaurantSettingsInput = {
    name: string;
    phone: string;
    email: string;
    address: string;
};
