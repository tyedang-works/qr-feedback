import { Box, Card, Skeleton, Stack } from "@mui/material";

const RING_RADII = [104, 78, 52];

const STATUS_COLORS = ["#10B981", "#F59E0B", "#FF8066"];

export default function FeedbackStatusChartSkeleton() {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                minWidth: 0,
                boxSizing: "border-box",
                p: { xs: 2, sm: 2.5 },
                border: "1px solid var(--color-border, #F0F2F5)",
                borderRadius: "16px",
                bgcolor: "var(--color-surface, #FFFFFF)",
                boxShadow: "var(--shadow-card)",
            }}
        >
            <Stack
                sx={{
                    height: "100%",
                    minWidth: 0,
                    gap: 0.5,
                }}
            >
                <Skeleton
                    variant="text"
                    width={155}
                    height={24}
                    sx={{ transform: "none" }}
                />

                <Skeleton
                    variant="text"
                    width={175}
                    height={20}
                    sx={{ transform: "none" }}
                />

                <Box
                    sx={{
                        py: { xs: 1, sm: 1.5 },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            width: "100%",
                            maxWidth: 380,
                            aspectRatio: "1 / 1",
                            mx: "auto",
                        }}
                    >
                        <svg
                            viewBox="0 0 320 320"
                            width="100%"
                            height="100%"
                            aria-hidden="true"
                        >
                            {RING_RADII.map((radius, index) => (
                                <g key={radius}>
                                    <circle
                                        cx={160}
                                        cy={160}
                                        r={radius}
                                        fill="none"
                                        stroke="#F3F4F6"
                                        strokeWidth={18}
                                    />

                                    <circle
                                        cx={160}
                                        cy={160}
                                        r={radius}
                                        fill="none"
                                        stroke={STATUS_COLORS[index]}
                                        strokeWidth={18}
                                        strokeLinecap="round"
                                        strokeDasharray={`${
                                            2 *
                                            Math.PI *
                                            radius *
                                            [0.7, 0.35, 0.22][index]
                                        } ${2 * Math.PI * radius}`}
                                        transform="rotate(-90 160 160)"
                                        opacity={0.45}
                                    />
                                </g>
                            ))}
                        </svg>

                        <Stack
                            sx={{
                                position: "absolute",
                                inset: 0,
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 0.25,
                            }}
                        >
                            <Skeleton
                                variant="text"
                                width={78}
                                height={17}
                                sx={{ transform: "none" }}
                            />

                            <Skeleton
                                variant="text"
                                width={54}
                                height={40}
                                sx={{ transform: "none" }}
                            />
                        </Stack>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: { xs: 1.5, sm: 2.5 },
                        rowGap: 1,
                        pt: 2,
                        mt: 1,
                        borderTop: "1px dashed var(--color-border, #E5E7EB)",
                    }}
                >
                    {[
                        { labelWidth: 54, countWidth: 14, percentWidth: 22 },
                        { labelWidth: 50, countWidth: 10, percentWidth: 18 },
                        { labelWidth: 62, countWidth: 12, percentWidth: 22 },
                    ].map((item, index) => (
                        <Stack
                            key={index}
                            sx={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 0.75,
                                minWidth: 0,
                            }}
                        >
                            <Skeleton
                                variant="circular"
                                width={10}
                                height={10}
                                sx={{
                                    flexShrink: 0,
                                    bgcolor: STATUS_COLORS[index],
                                    opacity: 0.65,
                                }}
                            />

                            <Skeleton
                                variant="text"
                                width={item.labelWidth}
                                height={19}
                                sx={{ transform: "none" }}
                            />

                            <Skeleton
                                variant="text"
                                width={item.countWidth}
                                height={19}
                                sx={{ transform: "none" }}
                            />

                            <Skeleton
                                variant="text"
                                width={item.percentWidth}
                                height={18}
                                sx={{ transform: "none" }}
                            />
                        </Stack>
                    ))}
                </Box>
            </Stack>
        </Card>
    );
}
