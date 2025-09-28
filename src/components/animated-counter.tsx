'use client';

import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedCounter({ value, className, style }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const requestRef = useRef<number>();

  useEffect(() => {
    const prevValue = prevValueRef.current;
    if (prevValue === value) {
      return;
    }

    const duration = 500; // Animation duration in ms
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const animatedValue = Math.floor(prevValue + (value - prevValue) * percentage);
      
      setDisplayValue(animatedValue);

      if (progress < duration) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Ensure it ends on the exact value
        prevValueRef.current = value;
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [value]);

  return (
    <p className={className} style={style}>
      {displayValue.toLocaleString()}
    </p>
  );
}
