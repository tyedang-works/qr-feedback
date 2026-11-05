import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Typography from "@mui/material/Typography";

import { useTranslation } from "../common/providers/useTranslation";

type ImageItem =
    | {
          type: "image";
          img: string;
          title: string;
          aspectRatio: string;
      }
    | {
          type: "stat";
          value: string;
          description: string;
          background: string;
      };

export default function LoginBrandPanel() {
    const { t } = useTranslation();

    const imageItems: ImageItem[] = [
        {
            type: "image",
            img: "/assets/login-brand/restaurant-interior.jpg",
            title: t("loginBrandPanel", "restaurantInterior"),
            aspectRatio: "4 / 5",
        },
        {
            type: "stat",
            value: "41%",
            description: t("loginBrandPanel", "returningCustomers"),
            background: "#E85B3E",
        },
        {
            type: "image",
            img: "/assets/login-brand/restaurant-space.jpg",
            title: t("loginBrandPanel", "restaurantSpace"),
            aspectRatio: "4 / 5",
        },
        {
            type: "image",
            img: "/assets/login-brand/dining-area.jpg",
            title: t("loginBrandPanel", "diningArea"),
            aspectRatio: "4 / 5",
        },
        {
            type: "image",
            img: "/assets/login-brand/restaurant-kitchen.jpg",
            title: t("loginBrandPanel", "restaurantKitchen"),
            aspectRatio: "4 / 5",
        },
        {
            type: "image",
            img: "/assets/login-brand/restaurant-decoration.jpg",
            title: t("loginBrandPanel", "restaurantDecoration"),
            aspectRatio: "4 / 5",
        },
        {
            type: "stat",
            value: "76%",
            description: t("loginBrandPanel", "serviceQuality"),
            background: "#24AE79",
        },
        {
            type: "image",
            img: "/assets/login-brand/restaurant-furniture.jpg",
            title: t("loginBrandPanel", "restaurantFurniture"),
            aspectRatio: "4 / 5",
        },
        {
            type: "image",
            img: "/assets/login-brand/restaurant-workspace.jpg",
            title: t("loginBrandPanel", "restaurantWorkspace"),
            aspectRatio: "4 / 5",
        },
        {
            type: "image",
            img: "/assets/login-brand/restaurant-interior-2.jpg",
            title: t("loginBrandPanel", "restaurantInterior"),
            aspectRatio: "4 / 5",
        },
        {
            type: "image",
            img: "/assets/login-brand/coffee.jpg",
            title: t("loginBrandPanel", "coffee"),
            aspectRatio: "4 / 5",
        },
    ];

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
                minWidth: 0,
                minHeight: 0,
                overflow: "hidden",
            }}
        >
            <ImageList
                variant="masonry"
                cols={4}
                gap={8}
                sx={{
                    width: "min(100%, calc((100dvh - 100px) * 1.25))",
                    height: "auto",
                    m: 0,
                    flexShrink: 0,

                    "& .MuiImageListItem-root": {
                        display: "block",
                        overflow: "hidden",
                        borderRadius: "9px",
                        backgroundColor: "#f3f4f6",
                        border: "1px solid rgba(17, 24, 39, 0.06)",
                        isolation: "isolate",
                    },

                    "& img": {
                        display: "block",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 350ms ease",
                    },

                    "& .MuiImageListItem-root:hover img": {
                        transform: "scale(1.035)",
                    },

                    "@media (prefers-reduced-motion: reduce)": {
                        "& img": {
                            transition: "none",
                        },
                    },
                }}
            >
                {imageItems.map((item, index) => (
                    <ImageListItem
                        key={item.type === "image" ? item.img : `stat-${index}`}
                    >
                        {item.type === "image" ? (
                            <Box
                                sx={{
                                    width: "100%",
                                    aspectRatio: item.aspectRatio,
                                    overflow: "hidden",
                                }}
                            >
                                <Box
                                    component="img"
                                    src={item.img}
                                    alt={item.title}
                                    loading="eager"
                                    draggable={false}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    minHeight: 190,
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "flex-start",
                                    p: { xs: 1.75, lg: 2.25 },
                                    backgroundColor: item.background,
                                    color: "#ffffff",
                                }}
                            >
                                <Typography
                                    component="div"
                                    sx={{
                                        fontSize: {
                                            xs: 30,
                                            sm: 36,
                                            lg: 40,
                                        },
                                        lineHeight: 1,
                                        fontWeight: 800,
                                        letterSpacing: "-1.8px",
                                        mb: 1.5,
                                    }}
                                >
                                    {item.value}
                                </Typography>

                                <Typography
                                    component="p"
                                    sx={{
                                        m: 0,
                                        fontSize: {
                                            xs: 10,
                                            sm: 11,
                                        },
                                        lineHeight: 1.65,
                                        fontWeight: 600,
                                        maxWidth: 190,
                                        color: "rgba(255,255,255,0.95)",
                                    }}
                                >
                                    {item.description}
                                </Typography>
                            </Box>
                        )}
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
}
