from fastapi import APIRouter
from pydantic import BaseModel
from app.services.results_service import save_result, get_results

router = APIRouter()

class Result(BaseModel):
    wpm: int
    accuracy: float

@router.post("/api/result")
def post_result(result: Result):
    '''
    Save a typing test result to the in-memory list
    '''
    save_result(result.wpm, result.accuracy)
    return {"status": "ok"}

@router.get("/api/results")
def read_results():
    '''
    Return all saved results
    '''
    return {"results": get_results()}