import { Skeleton } from "@mui/material";
import PageLoadingSkeleton from "@/components/common/skeleton/PageLoadingSkeleton";
import TablesDesktopSkeleton from "@/components/tables/skeletons/TablesDesktopSkeleton";
import TablesFilterSkeleton from "@/components/tables/skeletons/TablesFilterSkeleton";
import TablesMobileSkeleton from "@/components/tables/skeletons/TablesMobileSkeleton";
import TablesSummarySkeleton from "@/components/tables/skeletons/TablesSummarySkeleton";

export default function TablesLoading() {
    return (
        <PageLoadingSkeleton
            titleWidth={150}
            subtitleWidth={280}
            gap={2}
            action={
                <Skeleton
                    variant="rounded"
                    sx={{
                        width: { xs: "100%", sm: 110 },
                        height: 34,
                        borderRadius: 1.5,
                        flexShrink: 0,
                    }}
                />
            }
        >
            <TablesSummarySkeleton />
            <TablesFilterSkeleton />
            <TablesDesktopSkeleton />
            <TablesMobileSkeleton />
        </PageLoadingSkeleton>
    );
}
