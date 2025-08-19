import { useState, useRef, useEffect } from "react";

export default function useTimer(initialTime = 60, initialZen=false) {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [currentTime, setCurrentTime] = useState(initialTime);
    const [currentZen, setCurrentZen] = useState(initialZen);
    
    const timerRef = useRef(null);
    const zenRef = useRef(initialZen);

    useEffect(() => {
        zenRef.current = currentZen;
    }, [currentZen]);

    const clear = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }

    const tick = () => {
        setElapsedTime((prev) => prev + 1);
        if (!zenRef.current) {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clear();
                    setIsRunning(false);
                    setIsFinished(true);
                    return 0;
                }
                return prev - 1;
            });
        }
    }

    const start = () => {
        if (!isRunning) {
            setIsFinished(false);
            setIsRunning(true);
            setHasStarted(true);
            timerRef.current = setInterval(tick, 1000);
        }
    };

    const stop = () => {
        clear();
        setIsRunning(false);
    };

    const reset = (newTime = currentTime, newZen = currentZen) => {
        clear();
        setElapsedTime(0);
        setTimeLeft(newTime);
        setIsRunning(false);
        setHasStarted(false);
        setIsFinished(false);
    };

    const updateSettings = (newTime, newZen = currentZen) => {
        clear();
        setCurrentTime(newTime);
        setCurrentZen(newZen);
        setElapsedTime(0);
        setTimeLeft(newTime);
        setIsRunning(false);
    }

    useEffect(() => {
        if (!isRunning && !currentZen) {
            setTimeLeft(currentTime);
        }
    }, [currentTime, currentZen, isRunning]);

    return { timeLeft, elapsedTime, isRunning, isFinished, hasStarted, currentTime, currentZen, start, stop, reset, updateSettings };
}