import localFont from "next/font/local";

export const momoTrustSans = localFont({
    variable: "--font-momo-trust-sans",
    display: "swap",
    src: [
        {
            path: "../fonts/MomoTrustSans-ExtraLight.ttf",
            weight: "200",
            style: "normal",
        },
        {
            path: "../fonts/MomoTrustSans-Light.ttf",
            weight: "300",
            style: "normal",
        },
        {
            path: "../fonts/MomoTrustSans-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/MomoTrustSans-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "../fonts/MomoTrustSans-SemiBold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "../fonts/MomoTrustSans-Bold.ttf",
            weight: "700",
            style: "normal",
        },
        {
            path: "../fonts/MomoTrustSans-ExtraBold.ttf",
            weight: "800",
            style: "normal",
        },
    ],
});
