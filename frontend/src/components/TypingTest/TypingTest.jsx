import { useEffect, useRef, useState } from "react";

import Timer from "./Timer";
import QuoteDisplay from "./QuoteDisplay";
import InputBox from "./InputBox";
import Stats from "./Stats";

import useTimer from "../../hooks/useTimer";
import useTypingTest from "../../hooks/useTypingTest";
import useFetchQuotes from "../../hooks/useFetchQuotes";

export default function TypingTest() {
    const [duration, setDuration] = useState(60);
    const { quotes, loading, error, reload } = useFetchQuotes();
    const { timeLeft, elapsedTime, isRunning, isFinished, hasStarted, start, stop, reset, updateSettings, currentTime, currentZen } = useTimer(duration, false);
    const typingTest = useTypingTest(quotes, isRunning, elapsedTime);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!currentZen && timeLeft === 0) {
            stop();
        }
    }, [timeLeft, currentZen]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (currentZen && e.key === "Escape") {
                stop();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [currentZen, stop]);

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
    };

    const handleZenToggle = async () => {
        updateSettings(currentTime, true);
        typingTest.resetTest();
        await reload();
        inputRef.current?.focus();
    }

    return (
        <div>
            <div className="mb-4 space-x-2">
                <button onClick={() => handleTimeSelect(60)}>Jeremy</button>
                <button onClick={() => handleTimeSelect(120)}>Bearimy</button>
                <button onClick={() => handleTimeSelect(300)}>Jeremy Bearimy</button>
                <button onClick={handleZenToggle}>Dot over the i</button>
            </div>

            {!currentZen && <Timer timeLeft={timeLeft} />}
            {currentZen && <h2>Zen Mode - Press ESC to stop</h2>}
            
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
                    if (!isRunning) start ();
                    typingTest.handleTyping(e.target.value);
                }}
                disabled={isFinished || (!currentZen && timeLeft === 0) || (currentZen && hasStarted && !isRunning)}
                onFocus={() => {
                    if (isFinished) {
                        handleRestart();
                    }
                }}
            />
            <Stats 
                rawWpm={typingTest.rawWpm} 
                accuracy={typingTest.accuracy} 
                netWpm={typingTest.netWpm} 
                errors={typingTest.errors} 
                currentZen={currentZen}
            />
            <div className="mt-4">
                <button
                    onClick={handleRestart}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Reboot
                </button>
            </div>
        </div>
    );
}