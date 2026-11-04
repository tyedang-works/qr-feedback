"use client";

import { useTranslation } from "@/components/common/providers/useTranslation";
import type { FeedbackListItem } from "@/lib/feedback/types";
import { Box, Card, Typography } from "@mui/material";
import { Heart } from "lucide-react";
import { useState } from "react";

import QRDialog from "@/components/common/dialog/QRDialog";

import FeedbackCard from "./FeedbackCard";
import FeedbackCardGrid from "./FeedbackCardGrid";
import FeedbackDetailPanel from "./FeedbackDetailPanel";
import FeedbackStatusChip from "../common/feedback/FeedbackStatusChip";

type FeedbackListProps = {
    data: FeedbackListItem[];
};

function EmptyFeedbackState() {
    const { t } = useTranslation();

    return (
        <Card
            elevation={0}
            sx={{
                py: 7,
                px: 3,
                border: "1px solid var(--color-border)",
                borderRadius: 2,
                bgcolor: "var(--color-surface)",
                color: "var(--color-text-primary)",
                textAlign: "center",
            }}
        >
            <Box
                sx={{
                    width: 48,
                    height: 48,
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    bgcolor: "var(--color-surface-active)",
                    color: "var(--color-text-secondary)",
                }}
            >
                <Heart size={23} strokeWidth={1.6} />
            </Box>

            <Typography
                sx={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                }}
            >
                {t("dashboard", "noFeedbackYet")}
            </Typography>

            <Typography
                sx={{
                    mt: 0.75,
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                }}
            >
                {t("dashboard", "feedbackWillAppearHere")}
            </Typography>
        </Card>
    );
}

export default function FeedbackList({ data }: FeedbackListProps) {
    const { t } = useTranslation();
    const [selectedFeedback, setSelectedFeedback] =
        useState<FeedbackListItem | null>(null);

    const handleOpenDetail = (item: FeedbackListItem) => {
        setSelectedFeedback(item);
    };

    const handleCloseDetail = () => {
        setSelectedFeedback(null);
    };

    if (data.length === 0) {
        return <EmptyFeedbackState />;
    }

    return (
        <>
            <FeedbackCardGrid>
                {data.map((item) => (
                    <FeedbackCard
                        key={item.id}
                        item={item}
                        onClick={() => handleOpenDetail(item)}
                    />
                ))}
            </FeedbackCardGrid>

            <QRDialog
                open={Boolean(selectedFeedback)}
                onClose={handleCloseDetail}
                title={t("dashboard", "feedbackDetails")}
                maxWidth="md"
                titleAdornment={
                    selectedFeedback && (
                        <FeedbackStatusChip status={selectedFeedback.status} />
                    )
                }
            >
                {selectedFeedback && (
                    <FeedbackDetailPanel
                        data={selectedFeedback}
                        onClose={handleCloseDetail}
                    />
                )}
            </QRDialog>
        </>
    );
}
