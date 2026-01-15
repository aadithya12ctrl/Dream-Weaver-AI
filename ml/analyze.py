import sys
import json
import os
from engine import DreamAnalysisEngine
from sentence_transformers import SentenceTransformer

# Re-implementing analyze.py to use the new Engine and LCEL
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    engine = DreamAnalysisEngine()
except Exception as e:
    sys.stderr.write(f"Initialization error: {str(e)}\n")

def run_analysis(content):
    # 1. Generate Embedding
    embedding = model.encode(content).tolist()
    
    # 2. Run LangChain LCEL Analysis
    analysis_results = engine.analyze_dream(content)
    
    return {
        "embedding": embedding,
        "analysis": analysis_results
    }

def run_weekly_analysis(dreams_list):
    # Process multiple dreams for patterns
    results = engine.analyze_weekly(dreams_list)
    return results

if __name__ == "__main__":
    try:
        input_str = sys.stdin.read()
        if not input_str:
            sys.exit(0)
            
        data = json.loads(input_str)
        
        # Check if weekly mode
        if len(sys.argv) > 1 and sys.argv[1] == "weekly":
            dreams = data.get("dreams", [])
            result = run_weekly_analysis(dreams)
            print(json.dumps(result))
        else:
            content = data.get("content", "")
            if content:
                result = run_analysis(content)
                print(json.dumps(result))
    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)
