results = [] # Stores all results for the current server session

def save_result(wpm: float, accuracy: float):
    results.append({
        "wpm": wpm,
        "accuracy": accuracy
    })

def get_results():
    return results