"use client";

import { useState, useTransition } from "react";

import { Box, Button, CircularProgress, Stack } from "@mui/material";

import QRSnackbar from "@/components/common/feedback/QRSnackbar";

import { updateRestaurantSettings } from "@/app/dashboard/settings/actions";
import QRTextField from "../common/input/QRTextField";

type RestaurantSettingsFormProps = {
    initialName: string;
};

export default function RestaurantSettingsForm({
    initialName,
}: RestaurantSettingsFormProps) {
    const [name, setName] = useState(initialName);
    const [errorMessage, setErrorMessage] = useState("");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    const [isPending, startTransition] = useTransition();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage("");

        const normalizedName = name.trim();

        if (!normalizedName) {
            setErrorMessage("Vui lòng nhập tên nhà hàng.");
            return;
        }

        if (normalizedName.length > 100) {
            setErrorMessage("Tên nhà hàng không được vượt quá 100 ký tự.");
            return;
        }

        startTransition(async () => {
            const result = await updateRestaurantSettings(normalizedName);

            if (!result.success) {
                setSnackbar({
                    open: true,
                    message: result.message,
                    severity: "error",
                });

                return;
            }

            setName(normalizedName);

            setSnackbar({
                open: true,
                message: result.message,
                severity: "success",
            });
        });
    };

    return (
        <>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    width: "100%",
                }}
            >
                <Stack
                    sx={{
                        gap: 3,
                    }}
                >
                    <QRTextField
                        label="Tên nhà hàng"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                        errorMessage={errorMessage}
                        required
                        placeholder="Nhập tên nhà hàng"
                        disabled={isPending}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isPending}
                            sx={{
                                minWidth: 120,
                                height: 40,
                            }}
                        >
                            {isPending ? (
                                <>
                                    <CircularProgress
                                        size={16}
                                        thickness={5}
                                        sx={{
                                            color: "inherit",
                                            mr: 1,
                                        }}
                                    />
                                    Đang lưu...
                                </>
                            ) : (
                                "Lưu thay đổi"
                            )}
                        </Button>
                    </Box>
                </Stack>
            </Box>

            <QRSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => {
                    setSnackbar((current) => ({
                        ...current,
                        open: false,
                    }));
                }}
            />
        </>
    );
}
