import { useState, useRef, useEffect } from "react";

export default function useTimer(initialTime = 60, zenMode = false) {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [currentTime, setCurrentTime] = useState(initialTime);
    const [currentZen, setCurrentZen] = useState(zenMode);
    const timerRef = useRef(null);

    const start = () => {
        if (!isRunning) {
            setIsRunning(true);
            timerRef.current = setInterval(() => {
                setElapsedTime(prev => prev + 1);
                if (!currentZen) {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(timerRef.current);
                            setIsRunning(false);
                            return 0;
                        }
                        return prev - 1;
                    });
                }
            }, 1000);
        }
    };

    const stop = () => {
        clearInterval(timerRef.current);
        setIsRunning(false);
    }

    const reset = (newTime = currentTime, newZen = currentZen) => {
        clearInterval(timerRef.current);
        setCurrentTime(newTime);
        setCurrentZen(newZen);
        setElapsedTime(0);
        setTimeLeft(newTime);
        setIsRunning(false);
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return { timeLeft, elapsedTime, isRunning, start, stop, reset };
}