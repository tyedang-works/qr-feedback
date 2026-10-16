import { Skeleton, Stack } from "@mui/material";

export default function FeedbackButtonExportSkeleton() {
    return (
        <Stack
            sx={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                flexWrap: "wrap",
                gap: 1.5,
            }}
        >
            <Skeleton
                variant="rounded"
                width={122}
                height={38}
                sx={{ borderRadius: 1.5 }}
            />
        </Stack>
    );
}
