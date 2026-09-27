import type { IssueDistributionItem } from "@/lib/dashboard/types";
import {
    Box,
    Card,
    Stack,
    Typography,
} from "@mui/material";

type IssueDistributionProps = {
    data: IssueDistributionItem[];
};

export default function IssueDistribution({
    data,
}: IssueDistributionProps) {
    const maxCount = Math.max(
        ...data.map((item) => item.count),
        1,
    );

    return (
        <Card
            elevation={0}
            sx={{
                p: 3,
                border: "1px solid #e5e7eb",
                borderRadius: 2,
                backgroundColor: "#ffffff",
            }}
        >
            <Typography
                sx={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#193B56",
                }}
            >
                Issue Distribution
            </Typography>

            <Typography
                sx={{
                    mt: 0.5,
                    fontSize: 13,
                    color: "#667085",
                }}
            >
                Các vấn đề được khách hàng lựa chọn
            </Typography>

            <Stack
                sx={{
                    mt: 3,
                    gap: 2.5,
                }}
            >
                {data.map((item) => {
                    const width =
                        item.count === 0
                            ? 0
                            : Math.max(
                                (item.count / maxCount) * 100,
                                4,
                            );

                    return (
                        <Box key={item.option}>
                            <Stack
                                sx={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 2,
                                    mb: 0.75,
                                }}
                            >
                                <Typography
                                    sx={{
                                        minWidth: 0,
                                        fontSize: 13,
                                        color: "#344054",
                                    }}
                                >
                                    {item.label}
                                </Typography>

                                <Typography
                                    sx={{
                                        flexShrink: 0,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "#193B56",
                                    }}
                                >
                                    {item.count} ({item.percentage}%)
                                </Typography>
                            </Stack>

                            <Box
                                sx={{
                                    width: "100%",
                                    height: 7,
                                    overflow: "hidden",
                                    borderRadius: 10,
                                    backgroundColor: "#eef2f5",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: `${width}%`,
                                        height: "100%",
                                        borderRadius: 10,
                                        backgroundColor: "#193B56",
                                        transition:
                                            "width 300ms ease",
                                    }}
                                />
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
        </Card>
    );
}