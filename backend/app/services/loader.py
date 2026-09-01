from pathlib import Path

TRANSCRIPT_DIR = Path("data/transcripts")


def split_text(text, chunk_size=1000):
    chunks = []

    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])

    return chunks


def load_documents():
    docs = []

    for file in TRANSCRIPT_DIR.rglob("transcript.md"):

        text = file.read_text(
            encoding="utf-8",
            errors="ignore"
        )

        chunks = split_text(text)

        for chunk in chunks:
            docs.append({
                "file": file.parent.name,
                "content": chunk
            })

    print(f"Loaded {len(docs)} chunks")

    return docs