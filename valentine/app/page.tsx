"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

// ─── Types ──────────────────────────────────────────────────────────────────
type NoButtonStage = 1 | 2 | 3;

// ─── Constants ──────────────────────────────────────────────────────────────
const EVASION_RADIUS = 120;
const EVASION_MOVES_TO_SWAP = 8;
const BUTTON_WIDTH = 160;
const BUTTON_HEIGHT = 56;
const BUTTON_GAP = 24;
const VIEWPORT_PADDING = 20;

const HAPPY_CAT_GIF = "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif";

// ─── Helpers ────────────────────────────────────────────────────────────────
function clampPosition(x: number, y: number) {
    const maxX = window.innerWidth - BUTTON_WIDTH - VIEWPORT_PADDING;
    const maxY = window.innerHeight - BUTTON_HEIGHT - VIEWPORT_PADDING;
    return {
        x: Math.max(VIEWPORT_PADDING, Math.min(x, maxX)),
        y: Math.max(VIEWPORT_PADDING, Math.min(y, maxY)),
    };
}

function clampToViewport(x: number, y: number, width: number, height: number) {
    const maxX = window.innerWidth - width - VIEWPORT_PADDING;
    const maxY = window.innerHeight - height - VIEWPORT_PADDING;
    return {
        x: Math.max(VIEWPORT_PADDING, Math.min(x, maxX)),
        y: Math.max(VIEWPORT_PADDING, Math.min(y, maxY)),
    };
}

function getRandomPosition() {
    const maxX = window.innerWidth - BUTTON_WIDTH - VIEWPORT_PADDING * 2;
    const maxY = window.innerHeight - BUTTON_HEIGHT - VIEWPORT_PADDING * 2;
    return {
        x: VIEWPORT_PADDING + Math.random() * maxX,
        y: VIEWPORT_PADDING + Math.random() * maxY,
    };
}

function fireConfetti() {
    const duration = 4000;
    const end = Date.now() + duration;

    const colors = [
        "#f472b6",
        "#ec4899",
        "#f43f5e",
        "#ef4444",
        "#fb7185",
        "#fda4af",
    ];

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 70,
            origin: { x: 0, y: 0.6 },
            colors,
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 70,
            origin: { x: 1, y: 0.6 },
            colors,
        });
        confetti({
            particleCount: 3,
            angle: 90,
            spread: 120,
            origin: { x: 0.5, y: 0.3 },
            colors,
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}

// ─── Floating Hearts Background ─────────────────────────────────────────────
function FloatingHearts() {
    const hearts = useMemo(
        () =>
            Array.from({ length: 15 }, (_, i) => ({
                id: i,
                left: `${Math.random() * 100}%`,
                size: 14 + Math.random() * 22,
                delay: Math.random() * 12,
                duration: 8 + Math.random() * 10,
                opacity: 0.15 + Math.random() * 0.25,
            })),
        [],
    );

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {hearts.map((h) => (
                <div
                    key={h.id}
                    className="floating-heart"
                    style={{
                        left: h.left,
                        fontSize: h.size,
                        animationDelay: `${h.delay}s`,
                        animationDuration: `${h.duration}s`,
                    }}
                >
                    ♥
                </div>
            ))}
        </div>
    );
}

// ─── Success View ───────────────────────────────────────────────────────────
function SuccessView() {
    useEffect(() => {
        fireConfetti();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center justify-center gap-8 z-10 px-4"
        >
            <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-4xl md:text-6xl font-extrabold text-pink-600 text-center drop-shadow-lg"
            >
                Yay! I knew you&apos;d say yes! ❤️
            </motion.div>

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="relative"
            >
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-300">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={HAPPY_CAT_GIF}
                        alt="Happy cat celebrating"
                        className="w-64 h-64 md:w-80 md:h-80 object-cover"
                    />
                </div>
                <div className="absolute -top-4 -right-4 text-4xl animate-pulse-heart">
                    💕
                </div>
                <div className="absolute -bottom-4 -left-4 text-4xl animate-pulse-heart">
                    💖
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-xl md:text-2xl text-pink-500 font-semibold text-center"
            >
                I love you!
            </motion.p>
        </motion.div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ValentinePage() {
    const [accepted, setAccepted] = useState(false);
    const [stage, setStage] = useState<NoButtonStage>(1);
    const [noPosition, setNoPosition] = useState<{
        x: number;
        y: number;
    } | null>(null);
    const [yesPosition, setYesPosition] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
    } | null>(null);
    const [evasionCount, setEvasionCount] = useState(0);
    const [swapped, setSwapped] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const noButtonRef = useRef<HTMLButtonElement>(null);
    const yesButtonRef = useRef<HTMLButtonElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const animFrameRef = useRef<number | null>(null);
    const lastEvasionAt = useRef(0);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        const updatePositions = () => {
            if (!yesButtonRef.current) return;
            const rect = yesButtonRef.current.getBoundingClientRect();
            setYesPosition({
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
            });

            setNoPosition((prev) => {
                if (stage !== 1 || swapped) return prev;
                if (!prev) {
                    return clampPosition(rect.right + BUTTON_GAP, rect.top);
                }
                return clampPosition(prev.x, prev.y);
            });
        };

        updatePositions();
        window.addEventListener("resize", updatePositions);
        return () => window.removeEventListener("resize", updatePositions);
    }, [stage, swapped]);

    // Track mouse position globally for Stage 1 evasion
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // Stage 1: Evasion — button runs away from cursor
    useEffect(() => {
        if (stage !== 1 || accepted || isMobile || !noPosition) return;

        const evade = () => {
            const btn = noButtonRef.current;
            if (!btn) {
                animFrameRef.current = requestAnimationFrame(evade);
                return;
            }

            const rect = btn.getBoundingClientRect();
            const btnCenterX = rect.left + rect.width / 2;
            const btnCenterY = rect.top + rect.height / 2;

            const dx = btnCenterX - mousePos.current.x;
            const dy = btnCenterY - mousePos.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < EVASION_RADIUS) {
                const angle = Math.atan2(dy, dx);
                const pushDistance = EVASION_RADIUS - distance + 60;
                const newX = rect.left + Math.cos(angle) * pushDistance;
                const newY = rect.top + Math.sin(angle) * pushDistance;

                const clamped = clampPosition(newX, newY);

                // If clamped to a corner, add random offset to escape
                if (
                    (clamped.x <= VIEWPORT_PADDING + 5 ||
                        clamped.x >=
                            window.innerWidth -
                                BUTTON_WIDTH -
                                VIEWPORT_PADDING -
                                5) &&
                    (clamped.y <= VIEWPORT_PADDING + 5 ||
                        clamped.y >=
                            window.innerHeight -
                                BUTTON_HEIGHT -
                                VIEWPORT_PADDING -
                                5)
                ) {
                    const escape = getRandomPosition();
                    setNoPosition(escape);
                } else {
                    setNoPosition(clamped);
                }

                const now = performance.now();
                if (now - lastEvasionAt.current > 200) {
                    lastEvasionAt.current = now;
                    setEvasionCount((count) => {
                        const next = count + 1;
                        if (next >= EVASION_MOVES_TO_SWAP) {
                            setStage(2);
                            setSwapped(true);
                            setNoPosition(null);
                        }
                        return next;
                    });
                }
            }

            animFrameRef.current = requestAnimationFrame(evade);
        };

        animFrameRef.current = requestAnimationFrame(evade);
        return () => {
            if (animFrameRef.current)
                cancelAnimationFrame(animFrameRef.current);
        };
    }, [stage, accepted, noPosition, isMobile]);

    // Handle "No" button click → escalate stages
    const handleNoClick = useCallback(() => {
        if (stage === 1) {
            if (evasionCount >= EVASION_MOVES_TO_SWAP) {
                setStage(2);
                setSwapped(true);
                setNoPosition(null);
            }
        } else if (stage === 2) {
            // Stage 4: Jail
            setStage(3);
            setSwapped(false);
            setNoPosition(null);
        }
    }, [stage, evasionCount]);

    // Mobile: tap on No escalates stages directly
    const handleNoTouch = useCallback(
        (e: React.TouchEvent) => {
            e.preventDefault();
            if (stage === 1) {
                setEvasionCount((count) => {
                    const next = count + 1;
                    if (next >= EVASION_MOVES_TO_SWAP) {
                        setStage(2);
                        setSwapped(true);
                        setNoPosition(null);
                    }
                    return next;
                });
            } else if (stage === 2) {
                setStage(3);
                setSwapped(false);
                setNoPosition(null);
            }
        },
        [stage],
    );

    const handleYesClick = () => {
        setAccepted(true);
    };

    // ─── Yes Button ──────────────────────────────────────────────────────────
    const YesButton = (
        <motion.button
            ref={yesButtonRef}
            onClick={handleYesClick}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative px-10 py-4 rounded-2xl font-bold text-lg md:text-xl",
                "bg-gradient-to-r from-pink-500 to-rose-500 text-white",
                "shadow-lg shadow-pink-300/50 hover:shadow-xl hover:shadow-pink-400/60",
                "transition-shadow duration-300",
                "min-w-[160px] cursor-pointer",
            )}
        >
            <span className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 fill-white" />
                Yes!
                <Heart className="w-5 h-5 fill-white" />
            </span>
        </motion.button>
    );

    // ─── No Button ───────────────────────────────────────────────────────────
    const NoButton = (
        <motion.button
            ref={noButtonRef}
            onClick={handleNoClick}
            onTouchStart={handleNoTouch}
            whileHover={stage < 3 ? { scale: 1.05 } : undefined}
            whileTap={stage < 3 ? { scale: 0.95 } : undefined}
            className={cn(
                "relative px-10 py-4 rounded-2xl font-bold text-lg md:text-xl",
                "bg-white text-pink-500 border-2 border-pink-300",
                "shadow-md hover:shadow-lg transition-shadow duration-300",
                "min-w-[160px]",
                stage === 3
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer",
            )}
            disabled={stage === 3}
        >
            No
            {stage === 3 && <div className="jail-bars" />}
        </motion.button>
    );

    const shouldFloatNo = stage === 1 && !!noPosition && !swapped;
    const NoButtonFloating = shouldFloatNo ? (
        <motion.button
            ref={noButtonRef}
            onClick={handleNoClick}
            onTouchStart={handleNoTouch}
            whileHover={stage < 3 ? { scale: 1.05 } : undefined}
            whileTap={stage < 3 ? { scale: 0.95 } : undefined}
            animate={{ x: noPosition?.x ?? 0, y: noPosition?.y ?? 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            style={{ position: "fixed", left: 0, top: 0, zIndex: 50 }}
            className={cn(
                "relative px-10 py-4 rounded-2xl font-bold text-lg md:text-xl",
                "bg-white text-pink-500 border-2 border-pink-300",
                "shadow-md hover:shadow-lg transition-shadow duration-300",
                "min-w-[160px]",
                stage === 3
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer",
            )}
            disabled={stage === 3}
        >
            No
            {stage === 3 && <div className="jail-bars" />}
        </motion.button>
    ) : null;

    // ─── Stage 3 Arrow ───────────────────────────────────────────────────────
    const arrowPosition = useMemo(() => {
        if (!yesPosition) return null;
        const width = 220;
        const height = 40;
        const targetX = yesPosition.x - width - 12;
        const targetY = yesPosition.y + yesPosition.height / 2 - height / 2;
        return clampToViewport(targetX, targetY, width, height);
    }, [yesPosition]);

    const Stage3Arrow =
        stage === 3 && arrowPosition ? (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                    position: "fixed",
                    left: arrowPosition.x,
                    top: arrowPosition.y,
                    zIndex: 40,
                }}
                className="flex items-center gap-2 text-pink-600 font-extrabold text-lg md:text-2xl"
            >
                <span>Click here instead!</span>
                <ArrowRight className="w-8 h-8 animate-bounce-right" />
            </motion.div>
        ) : null;

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden select-none"
        >
            <FloatingHearts />

            <AnimatePresence mode="wait">
                {accepted ? (
                    <SuccessView key="success" />
                ) : (
                    <motion.div
                        key="question"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                            opacity: 0,
                            y: -20,
                            transition: { duration: 0.3 },
                        }}
                        className="flex flex-col items-center z-10 px-4"
                    >
                        {/* Title */}
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="mb-4 text-6xl md:text-8xl"
                        >
                            <span className="animate-pulse-heart inline-block">
                                💝
                            </span>
                        </motion.div>

                        <h1 className="text-3xl md:text-5xl font-extrabold text-pink-700 text-center mb-2 drop-shadow">
                            Will you be my Valentine?
                        </h1>

                        <p className="text-pink-500/80 text-base md:text-lg mb-10 text-center max-w-md">
                            I have a very important question for you...
                        </p>

                        {/* Buttons container */}
                        <div className="flex flex-col items-center gap-6">
                            <div
                                className="flex items-center justify-start gap-6"
                                style={{ width: BUTTON_WIDTH * 2 + BUTTON_GAP }}
                            >
                                {swapped ? (
                                    <>
                                        {NoButton}
                                        {YesButton}
                                    </>
                                ) : stage === 1 ? (
                                    <>
                                        {YesButton}
                                        <div className="w-40 h-14" />
                                    </>
                                ) : (
                                    <>
                                        {YesButton}
                                        {NoButton}
                                    </>
                                )}
                            </div>

                            {/* Arrow for stage 3 */}
                            {Stage3Arrow}
                        </div>

                        {/* Stage indicator (subtle) */}
                        {stage > 1 && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 text-sm text-pink-400/60 italic"
                            >
                                {stage === 2 && "Wait, did they just swap? 🤔"}
                                {stage === 3 &&
                                    "Okay fine, the No button is in jail now. 🔒"}
                            </motion.p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating No button (Stage 1 only) */}
            {!accepted && NoButtonFloating}
        </div>
    );
}
