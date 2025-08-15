import { useState, useEffect } from "react";

export default function useTypingTest(quotes, isRunning, elapsedTime) {
    const [wordList, setWordList] = useState([]); // Sequence of words the user will type
    const [currentWordIndex, setCurrentWordIndex] = useState(0); // Current word user is typing
    const [nextQuoteIndex, setNextQuoteIndex] = useState(0);
    const [typedWord, setTypedWord] = useState(""); // Characters typed for the current word
    const [history, setHistory] = useState([]); // Stores what the user typed for each past word

    // Metrics
    const [correctWords, setCorrectWords] = useState(0);
    const [correctChars, setCorrectChars] = useState(0);
    const [totalTypedChars, setTotalTypedChars] = useState(0);
    const [errors, setErrors] = useState(0);

    /* 
    Whenever quotes changes/first loads:
    - Reset everything
    - Take initial 2 quotes in the list of quotes
    - Merge words in the 2 quotes into wordList
    - Set nextQuoteIndex to the 3rd quote to load later
    */
    const resetTest = () => {
        if (!quotes || quotes.length === 0) {
            setWordList([]);
            setCurrentWordIndex(0);
            setTypedWord("");
            setHistory([]);
            setCorrectWords(0);
            setCorrectChars(0);
            setTotalTypedChars(0);
            setErrors(0);
            setNextQuoteIndex(0);
            return;
        }

        const firstIdx = 0;
        const secondIdx = quotes.length > 1 ? 1 : 0;
        const firstWords = quotes[firstIdx].quote.split(" ");
        const secondWords = quotes[secondIdx].quote.split(" ");

        setWordList([...firstWords, ...secondWords]);
        setCurrentWordIndex(0);
        setTypedWord("");
        setHistory([]);
        setCorrectWords(0);
        setCorrectChars(0);
        setTotalTypedChars(0);
        setErrors(0);
        setNextQuoteIndex((secondIdx + 1) % quotes.length);
    };

    useEffect(() => {
        resetTest();
    }, [quotes]);

    const handleTyping = (value) => {
        setTypedWord(value); // Update typedWord every keystroke

        /*
        Trim space to compare only word itself.
        Check if current word matches expectWord in the wordList.
        If yes then isCorrect is true.
        */
        if (value.endsWith(" ")) {
            const trimmed = value.trim();
            const expectedWord = wordList[currentWordIndex];
            const isCorrect = trimmed === expectedWord;

            if (isCorrect) {
                setCorrectWords(prev => prev + 1); // Increase count of correct words
                setCorrectChars(prev => prev + trimmed.length); // Add number of correct chars
            } else {
                setErrors(prev => prev + 1); // Increase count of errors
            }
            setTotalTypedChars(prev => prev + trimmed.length); // Increase totalTypedChars for WPM calc

            setHistory(prev => [
                ...prev,
                { word: expectedWord, typed: trimmed, isCorrect }
            ]);

            const nextIndex = currentWordIndex + 1;
            setCurrentWordIndex(nextIndex); // Increment currentWordIndex so UI can highlight next word
            setTypedWord(""); // Clear typedWord

            /* 
            Calculate next quote index.
            Append words to the wordList.
            */
            if (nextIndex > wordList.length - 10) {
                const nextQuote = quotes[nextQuoteIndex % quotes.length];
                if (nextQuote) {
                    const words = nextQuote.quote.split(" ");
                    setWordList((prev) => [...prev, ...words]);
                    setNextQuoteIndex((p) => (p + 1) % quotes.length);
                }
            }
        }
    };

    const minutes = elapsedTime / 60;

    const rawWpm = minutes > 0
        ? Math.round((totalTypedChars/ 5) / minutes)
        : 0;

    const accuracy = totalTypedChars > 0
        ? +( (correctChars / totalTypedChars) * 100 ).toFixed(1)
        : 100;

    const netWpm = minutes > 0 
        ? Math.round(rawWpm * (accuracy / 100))
        : 0;

    return { wordList, currentWordIndex, typedWord, history, handleTyping, resetTest, correctWords, correctChars, totalTypedChars, errors, rawWpm, netWpm, accuracy };
}