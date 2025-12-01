from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import json
from db_connection import get_db

class DuplicateChecker:
    def __init__(self, threshold=0.85):
        self.threshold = threshold

    def _get_embeddings_from_db(self):
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("SELECT id, content, embedding, created_by FROM questions")
        rows = cursor.fetchall()

        question_ids = []
        question_texts = []
        embeddings = []
        created_bys = []

        for row in rows:
            try:
                question_ids.append(row.id)
                question_texts.append(row.content)
                embeddings.append(json.loads(row.embedding))
                created_bys.append(row.created_by)
            except Exception as e:
                continue

        if not embeddings:
            return [], [], [], np.array([])

        return question_ids, question_texts, created_bys, np.array(embeddings)

    def check_duplicate(self, new_embedding):
        """
        Kiểm tra embedding mới có trùng với embedding đã lưu không.
        Trả về 'duplicate' kèm danh sách câu hỏi tương tự nếu có.
        """
        question_ids, question_texts, created_bys, existing_embeddings = self._get_embeddings_from_db()

        if len(existing_embeddings) == 0:
            return "unique", []

        sims = cosine_similarity([new_embedding], existing_embeddings)[0]

        duplicates = []
        for idx, sim in enumerate(sims):
            if sim >= self.threshold:
                duplicates.append({
                    "id": question_ids[idx],
                    "text": question_texts[idx],
                    "similarity": round(float(sim), 4),
                    "created_by": created_bys[idx]
                })

        if not duplicates:
            return "unique", []
        else:
            duplicates = sorted(duplicates, key=lambda x: x["similarity"], reverse=True)
            return "duplicate", duplicates

    def check_duplicates_batch(self, new_embeddings, new_texts=None):
        """
        Kiểm tra danh sách embedding mới với CSDL.
        Trả về danh sách kết quả dạng:
        [
            {"query": "abc", "status": "duplicate", "matches": [...]},
            ...
        ]
        """
        question_ids, question_texts, created_bys, existing_embeddings = self._get_embeddings_from_db()

        if len(existing_embeddings) == 0:
            return [{"query": txt, "status": "unique", "matches": []}
                    for txt in (new_texts or [""] * len(new_embeddings))]

        results = []
        sims = cosine_similarity(new_embeddings, existing_embeddings)

        for i, sim_row in enumerate(sims):
            matches = []
            for j, sim in enumerate(sim_row):
                if sim >= self.threshold:
                    matches.append({
                        "id": question_ids[j],
                        "text": question_texts[j],
                        "similarity": round(float(sim), 4),
                        "created_by": created_bys[j]
                    })

            matches = sorted(matches, key=lambda x: x["similarity"], reverse=True)
            status = "duplicate" if matches else "unique"

            results.append({
                "query": new_texts[i] if new_texts else "",
                "status": status,
                "matches": matches
            })

        return results