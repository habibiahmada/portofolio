'use client';
import { useEffect, useRef } from "react";

const CursorFollower = () => {
    const followerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (followerRef.current) {
                followerRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
                followerRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            ref={followerRef}
            className="fixed top-0 left-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full pointer-events-none z-10 opacity-50 blur-lg transition-transform duration-150 ease-out"
            style={{ transform: 'translate(calc(var(--mouse-x, 0px) - 50%), calc(var(--mouse-y, 0px) - 50%))' }}
            aria-hidden="true"
        />
    );
};

export default CursorFollower;
