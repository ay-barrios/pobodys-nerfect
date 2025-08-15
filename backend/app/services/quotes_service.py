import os, random, json

QUOTES_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "quotes.json")

def get_all_quotes_shuffled():
    '''
    Return all quotes but in shuffled order
    '''
    with open(QUOTES_FILE, "r", encoding="utf-8") as f:
        quotes = json.load(f)
    random.shuffle(quotes)
    return quotes

