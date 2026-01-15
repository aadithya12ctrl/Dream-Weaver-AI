import sys
import json
import random

# Try to load ML libraries, fallback to mock if missing (Lite env limitation)
try:
    from sentence_transformers import SentenceTransformer
    # Load embedding model (Small/Fast)
    model = SentenceTransformer('all-MiniLM-L6-v2')
    HAS_MODEL = True
except Exception as e:
    HAS_MODEL = False
    sys.stderr.write(f"ML Libs missing, using mock: {str(e)}\n")

def analyze(text):
    if HAS_MODEL:
        try:
            embedding = model.encode(text).tolist()
        except:
            embedding = [0.1] * 384
    else:
        # Dummy embedding (384 dim for MiniLM)
        # In a real env, we'd ensure deps are installed.
        embedding = [random.random() for _ in range(384)]
    
    return {
        "embedding": embedding,
        "vector_dim": 384,
        "mock": not HAS_MODEL
    }

if __name__ == "__main__":
    try:
        # Read input from Node.js
        input_str = sys.stdin.read()
        if not input_str:
            sys.exit(0)
            
        data = json.loads(input_str)
        content = data.get("content", "")
        
        if content:
            result = analyze(content)
            print(json.dumps(result))
        else:
            print(json.dumps({"embedding": []}))
            
    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)
