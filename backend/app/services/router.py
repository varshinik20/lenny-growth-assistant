def detect_skill(prompt: str):

    prompt = prompt.lower()

    if "ship30" in prompt or "essay" in prompt:
        return "essay"

    if "html" in prompt or "landing page" in prompt:
        return "artifact"

    if "markdown" in prompt:
        return "artifact"

    return "qa"