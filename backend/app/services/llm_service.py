import ollama

from app.services.rag_service import retrieve


MODEL = "llama3.2:3b"


def ask_ollama(question):

    context = retrieve(question)

    prompt = f"""
You are Lenny Growth Assistant.

Answer ONLY using the context below.

If the answer is not present,
say you don't know.

Context:

{context}

Question:

{question}
"""

    response = ollama.chat(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]