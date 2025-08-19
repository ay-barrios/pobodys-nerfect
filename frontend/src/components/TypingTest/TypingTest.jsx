import { useEffect, useRef, useState } from "react";

import Timer from "./Timer";
import QuoteDisplay from "./QuoteDisplay";
import InputBox from "./InputBox";
import Stats from "./Stats";

import useTimer from "../../hooks/useTimer";
import useTypingTest from "../../hooks/useTypingTest";
import useFetchQuotes from "../../hooks/useFetchQuotes";

export default function TypingTest() {
    const[stage, setStage] = useState("welcome");
    const [duration, setDuration] = useState(60);
    const { quotes, loading, error, reload } = useFetchQuotes();
    const { timeLeft, elapsedTime, isRunning, isFinished, hasStarted, start, stop, reset, updateSettings, currentTime, currentZen } = useTimer(duration, false);
    const typingTest = useTypingTest(quotes, isRunning, elapsedTime);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!currentZen && timeLeft === 0) {
            stop();
            setStage("results");
        }
    }, [timeLeft, currentZen, stop]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (currentZen && e.key === "Escape") {
                stop();
                setStage("results");
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [currentZen, stop]);

    useEffect(() => {
        const handleCtrlSlash = (e) => {
            if (!currentZen && e.key === "/" && e.ctrlKey) {
                stop();
                typingTest.resetTest();
                setStage("welcome");
            }
        };
        window.addEventListener("keydown", handleCtrlSlash);
        return () => window.removeEventListener("keydown", handleCtrlSlash);
    }, [currentZen, stop, typingTest]);

    if (loading) return <p>Loading quotes...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleRestart = async () => {
        reset();
        typingTest.resetTest();
        await reload();
        inputRef.current?.focus();
    }

    const handleTimeSelect = async (newDuration) => {
        setDuration(newDuration);
        updateSettings(newDuration, false);
        typingTest.resetTest();
        await reload();
        inputRef.current?.focus();
        setStage("typing");
    };

    const handleZenToggle = async () => {
        updateSettings(currentTime, true);
        typingTest.resetTest();
        await reload();
        inputRef.current?.focus();
        setStage("typing");
    }

    if (stage === "welcome") {
        return (
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">Welcome! Everything is fine,</h1>
                <p>Select your test mode:</p>
                <div className="space-x-2">
                    <button onClick={() => handleTimeSelect(60)}>Jeremy</button>
                    <button onClick={() => handleTimeSelect(120)}>Bearimy</button>
                    <button onClick={() => handleTimeSelect(300)}>Jeremy Bearimy</button>
                    <button onClick={handleZenToggle}>Dot over the i</button>
                </div>
            </div>
        );
    }

    if (stage === "typing") {
        return (
            <div>
                {/* Top bar */}
                <div className="flex justify-between items-center mb-4">
                    {!currentZen && (
                        <div className="flex items-center gap-2">
                            <Timer timeLeft={timeLeft} />
                            <p>- Press Ctrl + / to exit</p>
                        </div>
                    )}
                    {currentZen && <span>Zen Mode - Press ESC to stop</span>}
                </div>

                {/* Typing area */}
                <QuoteDisplay 
                    wordList={typingTest.wordList}
                    history={typingTest.history}
                    currentWordIndex={typingTest.currentWordIndex}
                    typedWord={typingTest.typedWord}
                />
                <InputBox 
                    ref={inputRef}
                    typedWord={typingTest.typedWord}
                    handleTyping={(e) => {
                        if (!isRunning) start();
                        typingTest.handleTyping(e.target.value);
                    }}
                    disabled={isFinished || (!currentZen && timeLeft === 0) || (currentZen && hasStarted && !isRunning)}
                    onFocus={() => {
                        if (isFinished) handleRestart();
                    }}
                />
            </div>
        );
    }

    if (stage === "results") {
        return (
            <div className="text-center space-y-4">
                <h2 className="text-xl font-bold">Results</h2>
                <Stats 
                    rawWpm={typingTest.rawWpm} 
                    accuracy={typingTest.accuracy} 
                    netWpm={typingTest.netWpm} 
                    errors={typingTest.errors} 
                    currentZen={currentZen}
                />
                <button 
                    onClick={() => {
                        stop();
                        typingTest.resetTest();
                        setStage("welcome");
                    }}
                >
                    Reboot
                </button>
            </div>
        );
    }
}