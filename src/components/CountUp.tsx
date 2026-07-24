"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion, useSpring, useMotionValue } from "framer-motion";

export interface CountUpProps {
  value?: number;
  to?: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function CountUp({ value, to, suffix = "", duration = 2, className = "" }: CountUpProps) {
  const targetValue = to ?? value ?? 0;
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState("0" + suffix);

  useEffect(() => {
    if (inView) motionVal.set(targetValue);
  }, [inView, targetValue, motionVal]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(Math.round(v) + suffix);
    });
    return unsubscribe;
  }, [spring, suffix]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {display}
    </motion.span>
  );
}
