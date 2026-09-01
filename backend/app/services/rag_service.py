import faiss
import numpy as np

from app.services.loader import load_documents
from app.services.embed_service import get_embedding

documents = load_documents()

if len(documents) == 0:
    raise Exception("No transcript chunks found!")

texts = [doc["content"] for doc in documents]

embeddings = np.array(
    [get_embedding(text) for text in texts],
    dtype=np.float32
)

dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(embeddings)


def retrieve(query, k=5):

    query_embedding = np.array(
        [get_embedding(query)],
        dtype=np.float32
    )

    distances, indices = index.search(query_embedding, k)

    results = []

    for idx in indices[0]:
        results.append(documents[idx]["content"])

    return "\n\n".join(results)