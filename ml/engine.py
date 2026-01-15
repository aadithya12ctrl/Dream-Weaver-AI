import os
import torch
import torch.nn as nn
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnablePassthrough
import json

# ============================================================
# 1. Temporal Pattern Detection (PyTorch LSTM)
# ============================================================
class DreamTemporalLSTM(nn.Module):
    def __init__(self, input_dim=384, hidden_dim=128, num_layers=2):
        super().__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1) # Predict emotional trend or anomaly
        
    def forward(self, x):
        # x: (batch, seq_len, input_dim)
        out, _ = self.lstm(x)
        return self.fc(out[:, -1, :])

# ============================================================
# 2. LangChain LCEL Analysis Pipeline
# ============================================================
class DreamAnalysisEngine:
    def __init__(self):
        # Using Replit AI Integration endpoint (OpenAI compatible)
        self.llm = ChatOpenAI(
            model="gpt-5.1",
            openai_api_key=os.environ.get("AI_INTEGRATIONS_OPENAI_API_KEY", "dummy"),
            openai_api_base=os.environ.get("AI_INTEGRATIONS_OPENAI_BASE_URL")
        )
        
        # LCEL Chain 1: Symbolic Interpretation
        self.interpretation_prompt = ChatPromptTemplate.from_template("""
        As a psychological dream analyst, analyze the following dream content:
        {content}
        
        Provide:
        1. Symbolic Interpretation (Jungian/Freudian perspective)
        2. Key Archetypes identified
        3. Potential psychological triggers
        
        Return the result in valid JSON format with keys: interpretation, archetypes (list), triggers (list).
        """)
        
        self.analysis_chain = (
            {"content": RunnablePassthrough()} 
            | self.interpretation_prompt 
            | self.llm 
            | JsonOutputParser()
        )

        # LCEL Chain 2: Weekly Pattern Aggregator
        self.weekly_prompt = ChatPromptTemplate.from_template("""
        Analyze this collection of dreams from the past week:
        {dreams_json}
        
        Identify overarching psychological patterns:
        1. Recurring Symbols and their evolving meaning.
        2. Dominant Archetypes across all entries.
        3. Psychological Growth or Regression trends.
        4. Emotional Climate summary.
        
        Provide a deep psychological synthesis. Even if there are few dreams, analyze the core subconscious signals.
        Return JSON: {{ "synthesis": "string", "patterns": ["string"], "archetypes": ["string"], "emotional_climate": "string" }}
        """)

        self.weekly_chain = (
            {"dreams_json": RunnablePassthrough()}
            | self.weekly_prompt
            | self.llm
            | JsonOutputParser()
        )

    def analyze_dream(self, content):
        return self.analysis_chain.invoke(content)

    def analyze_weekly(self, dreams):
        dreams_json = json.dumps(dreams)
        return self.weekly_chain.invoke(dreams_json)

# Example Usage Bridge
if __name__ == "__main__":
    engine = DreamAnalysisEngine()
    # Logic to be called by analyze.py
