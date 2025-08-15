from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import quotes, results

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quotes.router)
app.include_router(results.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI"}