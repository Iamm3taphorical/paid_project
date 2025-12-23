"use client";

import { useEffect, useRef } from "react";

type TubesCursorProps = {
    title?: string;
    subtitle?: string;
    caption?: string;
    initialColors?: string[];
    lightColors?: string[];
    lightIntensity?: number;
    titleSize?: string;
    subtitleSize?: string;
    captionSize?: string;
    enableRandomizeOnClick?: boolean;
    className?: string;
};

const TubesCursor = ({
    title = "Freelance",
    subtitle = "Pro",
    caption = "Project Management System",
    initialColors = ["#6366f1", "#8b5cf6", "#3b82f6"],
    lightColors = ["#60a5fa", "#a78bfa", "#818cf8", "#c4b5fd"],
    lightIntensity = 200,
    titleSize = "text-[80px]",
    subtitleSize = "text-[60px]",
    captionSize = "text-base",
    enableRandomizeOnClick = true,
    className = "",
}: TubesCursorProps) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const appRef = useRef<any>(null);

    useEffect(() => {
        let removeClick: (() => void) | null = null;
        let destroyed = false;

        const loadTubesCursor = async () => {
            try {
                // Use dynamic import via Function to bypass TypeScript module resolution
                const importDynamic = new Function(
                    'specifier',
                    'return import(specifier)'
                );
                const mod = await importDynamic(
                    "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
                );
                const TubesCursorCtor = (mod as any).default ?? mod;

                if (!canvasRef.current || destroyed) return;

                const app = TubesCursorCtor(canvasRef.current, {
                    tubes: {
                        colors: initialColors,
                        lights: {
                            intensity: lightIntensity,
                            colors: lightColors,
                        },
                    },
                });

                appRef.current = app;

                if (enableRandomizeOnClick) {
                    const handler = () => {
                        const colors = randomColors(initialColors.length);
                        const lights = randomColors(lightColors.length);
                        app.tubes.setColors(colors);
                        app.tubes.setLightsColors(lights);
                    };
                    document.body.addEventListener("click", handler);
                    removeClick = () =>
                        document.body.removeEventListener("click", handler);
                }
            } catch (error) {
                console.warn("TubesCursor: WebGL not supported or failed to load", error);
            }
        };

        loadTubesCursor();

        return () => {
            destroyed = true;
            if (removeClick) removeClick();
            try {
                appRef.current?.dispose?.();
                appRef.current = null;
            } catch {
                // ignore
            }
        };
    }, [initialColors, lightColors, lightIntensity, enableRandomizeOnClick]);

    return (
        <div className={`relative h-screen w-screen overflow-hidden ${className}`}>
            {/* Background canvas */}
            <canvas ref={canvasRef} className="fixed inset-0 block h-full w-full" />

            {/* Hero text */}
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 select-none">
                <h1
                    className={`m-0 p-0 text-white font-bold uppercase leading-none drop-shadow-[0_0_20px_rgba(0,0,0,1)] ${titleSize}`}
                >
                    {title}
                </h1>
                <h2
                    className={`m-0 p-0 text-white font-medium uppercase leading-none drop-shadow-[0_0_20px_rgba(0,0,0,1)] ${subtitleSize}`}
                >
                    {subtitle}
                </h2>
                <p
                    className={`m-0 p-0 text-white leading-none drop-shadow-[0_0_20px_rgba(0,0,0,1)] ${captionSize}`}
                >
                    {caption}
                </p>
            </div>
        </div>
    );
};

function randomColors(count: number) {
    return new Array(count).fill(0).map(
        () =>
            "#" +
            Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, "0")
    );
}

export { TubesCursor };
