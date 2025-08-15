export default function Stats({ rawWpm, accuracy, netWpm, errors }) {
    return (
        <>
            <p>Raw WPM: {rawWpm}</p>
            <p>Accuracy: {accuracy}</p>
            <p>WPM: {netWpm}</p>
            <p>Errors: {errors}</p>
        </>
    )
}