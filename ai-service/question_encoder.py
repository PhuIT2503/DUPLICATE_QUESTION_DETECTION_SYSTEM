from sentence_transformers import SentenceTransformer
import numpy as np
import json
from db_connection import get_db
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class QuestionEncoder:
    def __init__(self, model_name='all-mpnet-base-v2'):
        """Khởi tạo model SBERT encoder"""
        self.model = SentenceTransformer(model_name)
        logger.info(f"Loaded model: {model_name}")

    def generate_embedding(self, texts):
        """Sinh embedding từ 1 hoặc nhiều câu hỏi"""
        if isinstance(texts, str):
            texts = [texts]
        embeddings = self.model.encode(texts)
        return [emb.tolist() for emb in embeddings]

    def save_to_db(self, question_text, embedding, user_id=None,
                   difficulty=None, question_type=None):
        """Lưu câu hỏi và embedding vào bảng `questions`"""
        conn = None
        try:
            conn = get_db()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO questions (
                    content, embedding, created_by, difficulty, question_type, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, GETDATE(), GETDATE())
            """, (
                question_text,
                json.dumps(embedding),
                user_id,
                difficulty,
                question_type
            ))
            conn.commit()
            logger.info("Đã lưu câu hỏi thành công vào bảng `questions`.")
            return True
        except Exception as e:
            logger.error(f"Lỗi DB khi lưu: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            if conn:
                conn.close()
