import { Skeleton, Stack } from "@mui/material";

export default function QRCodesLoading() {
    return (
        <Stack sx={{ gap: 2 }}>
            {/* Header */}
            <Stack sx={{ gap: 1 }}>
                <Skeleton
                    variant="text"
                    width={140}
                    height={36}
                    sx={{ transform: "none" }}
                />

                <Skeleton
                    variant="text"
                    width={300}
                    height={24}
                    sx={{ transform: "none" }}
                />
            </Stack>

            {/* Filters */}
            <Skeleton variant="rounded" height={64} sx={{ borderRadius: 2 }} />

            {/* QR table */}
            <Skeleton variant="rounded" height={560} sx={{ borderRadius: 2 }} />

            {/* Pagination */}
            <Stack sx={{ alignItems: "flex-end" }}>
                <Skeleton
                    variant="rounded"
                    width={240}
                    height={40}
                    sx={{ borderRadius: 1 }}
                />
            </Stack>
        </Stack>
    );
}
