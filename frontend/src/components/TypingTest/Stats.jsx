export default function Stats({ rawWpm, accuracy, netWpm, errors, currentZen }) {
    if (currentZen) {
        return (
            <div className="stats">
                <p>Accuracy: {accuracy}%</p>
                <p>Errors: {errors}</p>
            </div>            
        );
    }
    
    return (
        <div className="stats">
            <p>Raw WPM: {rawWpm}</p>
            <p>Accuracy: {accuracy}%</p>
            <p>WPM: {netWpm}</p>
            <p>Errors: {errors}</p>
        </div>
    );
}