"use client";

import { useEffect, useRef, useState } from "react";

interface Point {
    x: number;
    y: number;
    age: number;
}

export function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [points, setPoints] = useState<Point[]>([]);
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateSize();
        window.addEventListener("resize", updateSize);

        // Track mouse
        const handleMouseMove = (e: MouseEvent) => {
            setPoints((prev) => [
                ...prev.slice(-25), // Keep last 25 points
                { x: e.clientX, y: e.clientY, age: 0 }
            ]);
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Animation loop
        const animate = (time: number) => {
            if (previousTimeRef.current !== undefined) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Update and draw points
                setPoints((prev) => {
                    const updated = prev
                        .map((p) => ({ ...p, age: p.age + 1 }))
                        .filter((p) => p.age < 30);

                    // Draw trail
                    if (updated.length > 1) {
                        ctx.beginPath();
                        ctx.moveTo(updated[0].x, updated[0].y);

                        for (let i = 1; i < updated.length; i++) {
                            const p = updated[i];
                            const opacity = 1 - p.age / 30;
                            const size = (1 - p.age / 30) * 3;

                            ctx.lineTo(p.x, p.y);

                            // Draw glow dots
                            ctx.save();
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                            ctx.fillStyle = `rgba(99, 102, 241, ${opacity * 0.8})`;
                            ctx.shadowColor = "rgba(99, 102, 241, 0.8)";
                            ctx.shadowBlur = 10;
                            ctx.fill();
                            ctx.restore();
                        }

                        ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
                        ctx.lineWidth = 2;
                        ctx.lineCap = "round";
                        ctx.lineJoin = "round";
                        ctx.stroke();
                    }

                    return updated;
                });
            }
            previousTimeRef.current = time;
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", updateSize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ opacity: 0.7 }}
        />
    );
}
