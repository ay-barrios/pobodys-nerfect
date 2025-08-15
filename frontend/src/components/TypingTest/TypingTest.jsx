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
    const [zenMode, setZenMode] = useState(false);
    const { quotes, loading, error, reload } = useFetchQuotes();
    const { timeLeft, isRunning, start, reset } = useTimer(duration, zenMode);
    const elapsedTime = zenMode ? timeLeft : duration - timeLeft;
    const typingTest = useTypingTest(quotes, isRunning, elapsedTime);
    const inputRef = useRef(null);

    useEffect(() => {
        if (!zenMode && timeLeft === 0) {
            typingTest.stop();
        }
    }, [timeLeft, zenMode]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (zenMode && e.key === "Escape") {
                typingTest.stop();
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [zenMode]);

    if (loading) return <p>Loading quotes...</p>;
    if (error) return <p>Error: {error}</p>;

    const handleRestart = async () => {
        reset();
        typingTest.resetTest();
        await reload();
        inputRef.current?.focus();
    }

    return (
        <div>
            <div className="mb-4 space-x-2">
                <button onClick={() => { setDuration(60); setZenMode(false); }}>Jeremy</button>
                <button onClick={() => { setDuration(120); setZenMode(false); }}>Bearimy</button>
                <button onClick={() => { setDuration(300); setZenMode(false); }}>Jeremy Bearimy</button>
                <button onClick={() => { setZenMode(true); }}>Dot over the i</button>
            </div>

            {!zenMode && <Timer timeLeft={timeLeft} />}
            {zenMode && <h2>Zen Mode - Press ESC to stop</h2>}
            
            <QuoteDisplay 
                wordList={typingTest.wordList}
                history={typingTest.history}
                currentWordIndex={typingTest.currentWordIndex}
                typedWord={typingTest.typedWord}
            />
            <InputBox 
                typedWord={typingTest.typedWord}
                handleTyping={(e) => {
                    if (!isRunning) start ();
                    typingTest.handleTyping(e.target.value);
                }}
                disabled={!isRunning && timeLeft === 0}
            />
            <Stats 
                rawWpm={typingTest.rawWpm} 
                accuracy={typingTest.accuracy} 
                netWpm={typingTest.netWpm} 
                errors={typingTest.errors} 
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