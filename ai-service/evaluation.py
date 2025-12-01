import pandas as pd
from question_encoder import QuestionEncoder
from duplicate_checker import DuplicateChecker
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import matplotlib.pyplot as plt

encoder = QuestionEncoder()
checker = DuplicateChecker(threshold=0.85)

df = pd.read_excel("test_model.xlsx")

y_true = []
y_pred = []

for idx, row in df.iterrows():
    q1, q2, label = row["Question 1"], row["Question 2"], row["is_duplicate"]
    
    emb1 = encoder.generate_embedding(q1)[0]
    emb2 = encoder.generate_embedding(q2)[0]

    from sklearn.metrics.pairwise import cosine_similarity
    similarity = cosine_similarity([emb1], [emb2])[0][0]

    pred = 1 if similarity >= checker.threshold else 0

    y_true.append(label)
    y_pred.append(pred)

acc = accuracy_score(y_true, y_pred)
pre = precision_score(y_true, y_pred)
rec = recall_score(y_true, y_pred)
f1 = f1_score(y_true, y_pred)

print(f"Accuracy: {acc:.4f}")
print(f"Precision: {pre:.4f}")
print(f"Recall: {rec:.4f}")
print(f"F1 Score: {f1:.4f}")
metrics = ['Accuracy', 'Precision', 'Recall', 'F1 Score']
values = [acc, pre, rec, f1]

plt.figure(figsize=(9, 5))
plt.rcParams.update({'font.size': 13})

bars = plt.bar(metrics, values, color="#CF3C3C", width=0.6, edgecolor='black', linewidth=1.2)

for bar in bars:
    bar.set_linewidth(0)
    bar.set_alpha(0.95)
    bar.set_zorder(3)

for i, v in enumerate(values):
    plt.text(i, v + 0.03, f"{int(v * 100)} %", ha='center', fontweight='bold', fontsize=12)

plt.xlabel('Metrics')
plt.ylabel('Values')
plt.ylim(0, 1.1)
plt.grid(axis='y', linestyle='--', alpha=0.6, zorder=0)
plt.gca().set_facecolor('white')
plt.tight_layout()
plt.show()