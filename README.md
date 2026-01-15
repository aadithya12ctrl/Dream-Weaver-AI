# Oneiros - Advanced AI Dream Journal

Oneiros is a full-stack dream journaling application that leverages a hybrid architecture to combine high-performance web services with a specialized Python-based Machine Learning analytical engine.

**## 🧠 Deep AI Architecture

### 1. Fine-Tuning Transformer Models
The system employs a custom fine-tuning pipeline for **Large Language Models (LLMs)** and **Encoder-only Transformers** to adapt them for specialized psychological tasks.
- **Model Architecture**: We utilize **DistilBERT-base-uncased** and **RoBERTa** as base encoders. These are fine-tuned via the `ml/fine_tune.py` script.
- **Task-Specific Fine-Tuning**:
    - **Sequence Classification**: Fine-tuned for 3-class emotion detection (Positive, Negative, Neutral) specific to dream narratives.
    - **Optimization**: Uses the **Hugging Face `Trainer` API** with specialized hyperparameter tuning (Learning Rate: 2e-5, Weight Decay: 0.01) to handle the nuances of subconscious text.
    - **Datasets**: Employs the **Hugging Face `datasets` library** to tokenize and prepare dream descriptions for training.

### 2. LangChain LCEL (Expression Language) Orchestration
The analytical backend uses **LangChain LCEL** to build highly modular, non-linear processing chains. This is the "brain" that connects raw data to psychological insights.
- **`RunnablePassthrough` & `RunnableParallel`**: Used in `ml/engine.py` to handle concurrent data flows, allowing the system to process symbolic interpretations while simultaneously generating archetypal metadata.
- **ChatPromptTemplate**: Custom-engineered psychological prompts that enforce strict JSON output formatting, ensuring the frontend receives deterministic data.
- **`JsonOutputParser`**: Integrates directly into the LCEL chain to automatically validate and parse the LLM's raw response into a structured schema.
- **Chains Implemented**:
    - **Symbolic Interpretation Chain**: Transforms dream content into Jungian/Freudian perspectives.
    - **Weekly Synthesis Chain**: An aggregator that uses LCEL to synthesize multiple dream entries into a single psychological report.

### 3. Neural Temporal Analysis (PyTorch)
Beyond LLMs, the system utilizes a **Recurrent Neural Network (RNN)** architecture for longitudinal tracking.
- **LSTM (Long Short-Term Memory)**: A custom PyTorch `DreamTemporalLSTM` module processes sequences of **384-dimensional embeddings** (generated via `all-MiniLM-L6-v2`).
- **Anomaly Detection**: This model identifies shifts in the "Subconscious Baseline," alerting users to significant psychological triggers or recurring motifs.

## 🚀 Full Tech Stack

### Backend
- **Node.js & Express**: API gateway delegating complex ML tasks to Python via IPC (Inter-Process Communication).
- **PostgreSQL & Drizzle ORM**: Vector storage (metadata) and relational dream logging.

### Frontend
- **React (TypeScript)**: Mystical dark-themed UI.
- **TanStack Query**: **🧠 Deep AI Architecture
Oneiros utilizes a hybrid AI architecture that combines the strengths of commercial Large Language Models with specialized, locally-hosted Machine Learning models.

1. LangChain LCEL (Expression Language) Orchestration
The analytical "brain" of the system is built using LangChain LCEL, which orchestrates non-linear, modular processing chains for complex psychological analysis.

Symbolic Interpretation Chain: This chain transforms raw dream content into deep psychological insights using Jungian and Freudian perspectives.

Components: It utilizes RunnablePassthrough for data handling, ChatPromptTemplate for custom-engineered psychological prompts, and a JsonOutputParser to ensure the frontend receives structured, deterministic data.

Weekly Synthesis Chain: This is a high-level aggregator that synthesizes multiple dream entries from a user's week into a single, cohesive psychological report.

Functionality: It analyzes overarching patterns, recurring symbols, and emotional climate shifts over time.

2. LLM Integration
The system leverages high-performance LLMs for natural language understanding and creative synthesis.

Model: Oneiros is configured to use GPT-5.1 through Replit's AI integration.

Role: The LLM handles the primary textual interpretation, identifying key symbols, themes, and emotional sentiments within a dream.

Safety & Structure: Strict JSON formatting is enforced via system prompts to ensure the output can be reliably parsed by the backend and displayed on the frontend.

3. Neural Temporal Analysis (PyTorch)
Beyond textual analysis, Oneiros uses a custom PyTorch-based LSTM (Long Short-Term Memory) architecture for longitudinal tracking.

DreamTemporalLSTM: A custom module that processes sequences of 384-dimensional embeddings generated from dream text.

Anomaly Detection: This model monitors the "Subconscious Baseline," identifying significant psychological triggers or shifts in recurring motifs that might otherwise go unnoticed in individual entries.

4. Specialized Transformer Fine-Tuning
The project includes a dedicated pipeline for fine-tuning encoder-only transformers for specialized tasks.

Base Encoders: Utilizing DistilBERT-base-uncased and RoBERTa.

Sequence Classification: Specifically fine-tuned for 3-class emotion detection (Positive, Negative, Neutral) tailored to the unique vocabulary of dream narratives.

🚀 Backend & Pipeline Architecture
The backend acts as an orchestrator between the user-facing API and the heavy-duty ML processing engine.

1. Tech Stack
Runtime: Node.js & Express.

Database: PostgreSQL with Drizzle ORM for managing relational dream logs and vector-ready metadata.

Language Bridge: Python 3.11+ is used for the ML engine, connected to the Node.js server via Inter-Process Communication (IPC) using child_process.spawn.

2. The Analysis Pipeline
When a user submits a dream for analysis, the following pipeline is triggered:

Node.js API Entry: The server receives the dream content and authenticates the user.

LLM Pre-processing: The server first calls the GPT-5.1 model to get a high-level Jungian interpretation and basic symbol extraction.

Python ML Invocation: The server spawns a Python process to run ml/analyze.py.

Embedding Generation: The Python engine uses the sentence-transformers library (all-MiniLM-L6-v2) to generate a 384-dimensional vector embedding of the dream.

Deep Analysis: The DreamAnalysisEngine (running LangChain LCEL) is invoked within Python to perform symbolic and structural analysis.

Data Synthesis: The results from both the LLM and the Python ML pipeline are synthesized and stored in the database.

3. Weekly Aggregation Flow
For weekly reports, the server filters the last 7 days of a user's dreams and streams them into the Python run_weekly_analysis function. This utilizes the Weekly Synthesis Chain to identify long-term psychological trends.State synchronization between the web client and the ML engine.

