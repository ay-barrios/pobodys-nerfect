export default function InputBox({ typedWord, handleTyping, disabled }) {
    return (
        <input 
            value={typedWord}
            onChange={handleTyping}
            disabled={disabled}
        />
    );
}