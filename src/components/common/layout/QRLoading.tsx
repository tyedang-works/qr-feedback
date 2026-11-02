type QRLoadingProps = {
    size?: number;
};

const QR_LOADING_STYLES = `
    .qr-loading {
        display: block;
        flex-shrink: 0;
    }

    .qr-loading__ring {
        animation: qrRingA 2s linear infinite;
    }

    .qr-loading__ring--a {
        stroke: #f42f25;
    }

    .qr-loading__ring--b {
        animation-name: qrRingB;
        stroke: #f49725;
    }

    .qr-loading__ring--c {
        animation-name: qrRingC;
        stroke: #255ff4;
    }

    .qr-loading__ring--d {
        animation-name: qrRingD;
        stroke: #f42582;
    }

    @keyframes qrRingA {
        from, 4% {
            stroke-dasharray: 0 660;
            stroke-width: 20;
            stroke-dashoffset: -330;
        }

        12% {
            stroke-dasharray: 60 600;
            stroke-width: 30;
            stroke-dashoffset: -335;
        }

        32% {
            stroke-dasharray: 60 600;
            stroke-width: 30;
            stroke-dashoffset: -595;
        }

        40%, 54% {
            stroke-dasharray: 0 660;
            stroke-width: 20;
            stroke-dashoffset: -660;
        }

        62% {
            stroke-dasharray: 60 600;
            stroke-width: 30;
            stroke-dashoffset: -665;
        }

        82% {
            stroke-dasharray: 60 600;
            stroke-width: 30;
            stroke-dashoffset: -925;
        }

        90%, to {
            stroke-dasharray: 0 660;
            stroke-width: 20;
            stroke-dashoffset: -990;
        }
    }

    @keyframes qrRingB {
        from, 12% {
            stroke-dasharray: 0 220;
            stroke-width: 20;
            stroke-dashoffset: -110;
        }

        20% {
            stroke-dasharray: 20 200;
            stroke-width: 30;
            stroke-dashoffset: -115;
        }

        40% {
            stroke-dasharray: 20 200;
            stroke-width: 30;
            stroke-dashoffset: -195;
        }

        48%, 62% {
            stroke-dasharray: 0 220;
            stroke-width: 20;
            stroke-dashoffset: -220;
        }

        70% {
            stroke-dasharray: 20 200;
            stroke-width: 30;
            stroke-dashoffset: -225;
        }

        90% {
            stroke-dasharray: 20 200;
            stroke-width: 30;
            stroke-dashoffset: -305;
        }

        98%, to {
            stroke-dasharray: 0 220;
            stroke-width: 20;
            stroke-dashoffset: -330;
        }
    }

    @keyframes qrRingC {
        from {
            stroke-dasharray: 0 440;
            stroke-width: 20;
            stroke-dashoffset: 0;
        }

        8% {
            stroke-dasharray: 40 400;
            stroke-width: 30;
            stroke-dashoffset: -5;
        }

        28% {
            stroke-dasharray: 40 400;
            stroke-width: 30;
            stroke-dashoffset: -175;
        }

        36%, 58% {
            stroke-dasharray: 0 440;
            stroke-width: 20;
            stroke-dashoffset: -220;
        }

        66% {
            stroke-dasharray: 40 400;
            stroke-width: 30;
            stroke-dashoffset: -225;
        }

        86% {
            stroke-dasharray: 40 400;
            stroke-width: 30;
            stroke-dashoffset: -395;
        }

        94%, to {
            stroke-dasharray: 0 440;
            stroke-width: 20;
            stroke-dashoffset: -440;
        }
    }

    @keyframes qrRingD {
        from, 8% {
            stroke-dasharray: 0 440;
            stroke-width: 20;
            stroke-dashoffset: 0;
        }

        16% {
            stroke-dasharray: 40 400;
            stroke-width: 30;
            stroke-dashoffset: -5;
        }

        36% {
            stroke-dasharray: 40 400;
            stroke-width: 30;
            stroke-dashoffset: -175;
        }

        44%, 50% {
            stroke-dasharray: 0 440;
            stroke-width: 20;
            stroke-dashoffset: -220;
        }

        58% {
            stroke-dasharray: 40 400;
            stroke-width: 30;
            stroke-dashoffset: -225;
        }

        78% {
            stroke-dasharray: 40 400;
            stroke-width: 30;
            stroke-dashoffset: -395;
        }

        86%, to {
            stroke-dasharray: 0 440;
            stroke-width: 20;
            stroke-dashoffset: -440;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .qr-loading__ring {
            animation: none;
        }
    }
`;

export default function QRLoading({ size = 72 }: QRLoadingProps) {
    return (
        <>
            <style>{QR_LOADING_STYLES}</style>

            <svg
                className="qr-loading"
                width={size}
                height={size}
                viewBox="0 0 240 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Loading"
            >
                <circle
                    className="qr-loading__ring qr-loading__ring--a"
                    cx="120"
                    cy="120"
                    r="105"
                    stroke="#000"
                    strokeWidth="20"
                    strokeDasharray="0 660"
                    strokeDashoffset="-330"
                    strokeLinecap="round"
                />

                <circle
                    className="qr-loading__ring qr-loading__ring--b"
                    cx="120"
                    cy="120"
                    r="35"
                    stroke="#000"
                    strokeWidth="20"
                    strokeDasharray="0 220"
                    strokeDashoffset="-110"
                    strokeLinecap="round"
                />

                <circle
                    className="qr-loading__ring qr-loading__ring--c"
                    cx="85"
                    cy="120"
                    r="70"
                    stroke="#000"
                    strokeWidth="20"
                    strokeDasharray="0 440"
                    strokeLinecap="round"
                />

                <circle
                    className="qr-loading__ring qr-loading__ring--d"
                    cx="155"
                    cy="120"
                    r="70"
                    stroke="#000"
                    strokeWidth="20"
                    strokeDasharray="0 440"
                    strokeLinecap="round"
                />
            </svg>
        </>
    );
}
