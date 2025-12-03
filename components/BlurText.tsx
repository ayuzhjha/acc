"use client";
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: "words" | "letters";
    direction?: "top" | "bottom";
    onAnimationComplete?: () => void;
}

const BlurText = ({
    text,
    delay = 200,
    className = "",
    animateBy = "words",
    direction = "top",
    onAnimationComplete,
}: BlurTextProps) => {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const elements = animateBy === "words" ? text.split(" ") : text.split("");

    const defaultVariants = {
        hidden: { filter: "blur(10px)", opacity: 0, transform: direction === 'top' ? 'translate3d(0,-50px,0)' : 'translate3d(0,50px,0)' },
        visible: { filter: "blur(0px)", opacity: 1, transform: 'translate3d(0,0,0)' },
    };

    return (
        <div ref={ref} className={`flex flex-wrap ${className}`}>
            {elements.map((el, i) => (
                <motion.span
                    key={i}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={defaultVariants}
                    transition={{
                        duration: 1,
                        delay: i * (delay / 1000),
                        ease: [0.2, 0.65, 0.3, 0.9],
                    }}
                    className="inline-block mr-2"
                    onAnimationComplete={i === elements.length - 1 ? onAnimationComplete : undefined}
                >
                    {el === " " ? "\u00A0" : el}
                </motion.span>
            ))}
        </div>
    );
};

export default BlurText;
