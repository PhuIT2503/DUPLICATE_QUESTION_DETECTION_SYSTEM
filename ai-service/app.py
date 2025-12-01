from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from question_encoder import QuestionEncoder
from duplicate_checker import DuplicateChecker
from agency_management import AgencyAI
from typing import Optional
import logging

# Khởi tạo các mô-đun
encoder = QuestionEncoder()
dup_checker = DuplicateChecker(threshold=0.85)
agency_ai = AgencyAI()

# Setup
app = FastAPI(title="AI Question API")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("api")

# ==== Models ====
class QuestionRequest(BaseModel):
    user_id: str
    question: str
    difficulty: Optional[str] = None
    question_type: Optional[str] = None

class DuplicateCheckRequest(BaseModel):
    user_id: str
    question: str

# ==== Endpoints ====

@app.get("/")
def read_root():
    return {"message": "AI API is running properly!"}

@app.post("/add-question")
def add_question(data: QuestionRequest):
    try:
        embedding = encoder.generate_embedding(data.question)[0]
        success = encoder.save_to_db(
            question_text=data.question,
            embedding=embedding,
            user_id=data.user_id,
            difficulty=data.difficulty,
            question_type=data.question_type
        )
        if not success:
            raise HTTPException(status_code=400, detail="Failed to save question")
        return {"message": "Question added successfully."}
    except Exception as e:
        logger.exception("Error in /add-question")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/check-duplicate")
def check_duplicate(data: DuplicateCheckRequest):
    try:
        embedding = encoder.generate_embedding(data.question)[0]
        result, similar_questions = dup_checker.check_duplicate(embedding)
        return {
            "status": result,
            "duplicates": similar_questions or []
        }
    except Exception as e:
        logger.exception("Error in /check-duplicate")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agency-register")
def agency_register(data: DuplicateCheckRequest):
    try:
        embedding = encoder.generate_embedding(data.question)[0]
        status, duplicates = dup_checker.check_duplicate(embedding)
        return {
            "is_new_question": status == "unique",
            "similar_found": duplicates
        }
    except Exception as e:
        logger.exception("Error in /agency-register")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/check-duplicates-from-file")
async def check_duplicates_from_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        lines = content.decode("utf-8").splitlines()
        questions = [line.strip() for line in lines if line.strip()]

        if not questions:
            return JSONResponse(status_code=400, content={"detail": "File không chứa câu hỏi nào."})

        embeddings = encoder.generate_embedding(questions)
        results = dup_checker.check_duplicates_batch(embeddings, questions)

        return {"results": results}
    except Exception as e:
        logger.exception("Error in /check-duplicates-from-file")
        raise HTTPException(status_code=500, detail=str(e))
