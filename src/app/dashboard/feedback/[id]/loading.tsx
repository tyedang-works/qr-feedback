import { cardSx } from "@/styles/card.styles";
import { Box, Skeleton, Stack } from "@mui/material";

const skeletonSx = {
    bgcolor: "var(--color-skeleton, rgba(145, 158, 171, 0.16))",
    "&::after": {
        background:
            "linear-gradient(90deg, transparent, var(--color-skeleton-highlight, rgba(255, 255, 255, 0.12)), transparent)",
    },
};

const dividerSx = {
    borderColor: "var(--color-border, #E5E7EB)",
};

function Placeholder({
    width,
    height,
    variant = "text",
}: {
    width?: number | string;
    height: number;
    variant?: "text" | "rounded";
}) {
    return (
        <Skeleton
            variant={variant}
            width={width}
            height={height}
            animation="wave"
            sx={{
                ...skeletonSx,
                ...(variant === "text" && { transform: "none" }),
                ...(variant === "rounded" && { borderRadius: 1.5 }),
            }}
        />
    );
}

function SectionCard({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                ...cardSx,
                p: 0,
                overflow: "hidden",
                boxShadow: "none",
            }}
        >
            {children}
        </Box>
    );
}

function SectionHeadingSkeleton({
    titleWidth,
    descriptionWidths,
}: {
    titleWidth: number;
    descriptionWidths: Array<number | string>;
}) {
    return (
        <Box>
            <Placeholder width={titleWidth} height={23} />

            <Stack sx={{ mt: 0.5, gap: 0.25 }}>
                {descriptionWidths.map((width, index) => (
                    <Placeholder
                        key={`${width}-${index}`}
                        width={width}
                        height={19}
                    />
                ))}
            </Stack>
        </Box>
    );
}

export default function FeedbackDetailLoading() {
    return (
        <Stack sx={{ width: "100%", gap: 2.5 }}>
            <Placeholder width={145} height={18} />
            <Box>
                <Placeholder width={185} height={28} />

                <Stack sx={{ mt: 0.75, gap: 0.25 }}>
                    <Placeholder width="100%" height={20} />
                    <Placeholder width="76%" height={20} />
                </Stack>

                <Box sx={{ mt: 1.5 }}>
                    <Placeholder width={80} height={30} variant="rounded" />
                </Box>
            </Box>

            <SectionCard>
                <Stack sx={{ p: 2, gap: 2.5 }}>
                    <SectionHeadingSkeleton
                        titleWidth={160}
                        descriptionWidths={["100%", "68%"]}
                    />
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "var(--color-surface-hover, #F9FAFB)",
                            border: "1px solid var(--color-border, #E5E7EB)",
                        }}
                    >
                        <Placeholder width={32} height={18} />

                        <Box sx={{ mt: 0.5 }}>
                            <Placeholder width={100} height={23} />
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "var(--color-surface-hover, #F9FAFB)",
                            border: "1px solid var(--color-border, #E5E7EB)",
                        }}
                    >
                        <Placeholder width={95} height={18} />

                        <Box sx={{ mt: 0.5 }}>
                            <Placeholder width={160} height={22} />
                        </Box>
                    </Box>

                    <Box sx={{ borderTop: "1px solid", ...dividerSx }} />
                    <Box>
                        <Placeholder width={175} height={22} />

                        <Stack
                            sx={{
                                mt: 1.25,
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: 1,
                            }}
                        >
                            <Placeholder
                                width={155}
                                height={32}
                                variant="rounded"
                            />
                            <Placeholder
                                width={125}
                                height={32}
                                variant="rounded"
                            />
                        </Stack>
                    </Box>
                </Stack>
            </SectionCard>

            <SectionCard>
                <Stack sx={{ p: 2, gap: 2 }}>
                    <SectionHeadingSkeleton
                        titleWidth={165}
                        descriptionWidths={["100%"]}
                    />
                    <Box
                        sx={{
                            p: 2,
                            minHeight: 100,
                            borderRadius: 2,
                            bgcolor: "var(--color-surface-hover, #F9FAFB)",
                            border: "1px solid var(--color-border, #E5E7EB)",
                        }}
                    >
                        <Placeholder width="88%" height={19} />
                        <Placeholder width="64%" height={19} />
                    </Box>

                    <Box sx={{ borderTop: "1px solid", ...dividerSx }} />
                    <Box>
                        <Placeholder width={140} height={18} />

                        <Box sx={{ mt: 0.5 }}>
                            <Placeholder width={115} height={22} />
                        </Box>
                    </Box>
                </Stack>
            </SectionCard>

            <SectionCard>
                <Box sx={{ p: 2 }}>
                    <SectionHeadingSkeleton
                        titleWidth={145}
                        descriptionWidths={["100%", "72%"]}
                    />
                </Box>

                <Box sx={{ borderTop: "1px solid", ...dividerSx }} />
                <Stack sx={{ p: 2, gap: 2 }}>
                    <Box>
                        <Placeholder width={95} height={18} />

                        <Box sx={{ mt: 0.75 }}>
                            <Placeholder
                                width="100%"
                                height={42}
                                variant="rounded"
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Placeholder width={120} height={18} />

                        <Box sx={{ mt: 0.75 }}>
                            <Placeholder
                                width="100%"
                                height={80}
                                variant="rounded"
                            />
                        </Box>
                    </Box>

                    <Stack
                        sx={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Placeholder
                            width={130}
                            height={40}
                            variant="rounded"
                        />
                    </Stack>
                </Stack>
            </SectionCard>
        </Stack>
    );
}
