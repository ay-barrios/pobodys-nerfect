export default function QuoteDisplay({ wordList, history, currentWordIndex, typedWord }) {
    return (
        <div className="quote-display">
            {wordList.map((word, index) => {
                // For words already typed, we set the text color to green if isCorrect is true and red if isCorrect is false
                if (index < currentWordIndex) {
                    const past = history[index];
                    return (
                        <span
                            key={index}
                            className={past?.isCorrect ? "text-green-500" : "text-red-500"}
                        >
                            {word}{" "}
                        </span>
                    );
                }

                if (index === currentWordIndex) {
                    return (
                        // We highlight index with yellow
                        <span key={index} className="bg-yellow-200"> 
                            {/* We split word into individual characters and color the character based on its correctness (green is correct; red is incorrect) */}
                            {word.split("").map((char, charIndex) => {
                                let charClass = "";
                                if (typedWord[charIndex] != null) {
                                    charClass =
                                        typedWord[charIndex] === char
                                            ? "text-green-500"
                                            : "text-red-500";
                                }
                                return (
                                    <span key={charIndex} className="{charClass}">
                                        {char}
                                    </span>
                                );
                            })}
                            {/* For extra chracters we color it red */}
                            {typedWord.length > word.length && (
                                <span className="text-red-500">
                                    {typedWord.slice(word.length)}
                                </span>
                            )}
                            {" "}
                        </span>
                    );
                }
                // For words user hasn't typed yet, color is gray
                return (
                    <span key={index} className="text-gray-400">
                        {word}{" "}
                    </span>
                )
            })}
        </div>
    )
}