from fastapi import APIRouter
from app.services.quotes_service import get_all_quotes_shuffled

router = APIRouter ()

@router.get("/api/quotes")
def get_quotes():
    '''
    Returns a random Good Place quote as a JSON object.
    '''
    return get_all_quotes_shuffled()