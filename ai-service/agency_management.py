from hashlib import sha256
import json
from db_connection import get_db
import threading
from sklearn.metrics.pairwise import cosine_similarity

class AgencyAI:
    def __init__(self):
        self.lock = threading.Lock()

    def register_question(self, user_id: str, question: str, embedding: list,
                          difficulty: str = None, question_type: str = None):
        """
        Đăng ký câu hỏi mới: kiểm tra trùng lặp embedding với người dùng khác,
        nếu chưa có thì thêm mới vào bảng `questions`.
        """
        embed_json = json.dumps(embedding)
        embed_hash = sha256(embed_json.encode()).hexdigest()

        with self.lock:
            conn = get_db()
            cursor = conn.cursor()

            # 1. Lấy embedding của các câu hỏi của người khác để so sánh
            cursor.execute("""
                SELECT id, content, embedding, created_by
                FROM questions
                WHERE created_by IS NOT NULL AND created_by != ?
            """, (user_id,))
            rows = cursor.fetchall()

            duplicates = []
            for row in rows:
                try:
                    existing_embedding = json.loads(row.embedding)
                    sim = cosine_similarity([embedding], [existing_embedding])[0][0]
                    if sim >= 0.85:
                        duplicates.append({
                            "id": row.id,
                            "user": row.created_by,
                            "question": row.content,
                            "similarity": round(sim, 4)
                        })
                except Exception:
                    continue

            # 2. Lưu câu hỏi nếu chưa tồn tại trong bảng (so sánh embedding)
            cursor.execute("""
                IF NOT EXISTS (
                    SELECT 1 FROM questions
                    WHERE CAST(embedding AS NVARCHAR(MAX)) = CAST(? AS NVARCHAR(MAX))
                )
                BEGIN
                    INSERT INTO questions (
                        content, embedding, created_by, difficulty, question_type, created_at, updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, GETDATE(), GETDATE())
                END
            """, (embed_json, question, embed_json, user_id, difficulty, question_type))
            conn.commit()
            return duplicates, len(duplicates) == 0
