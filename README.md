# Oneiros - Advanced AI Dream Journal

Oneiros is a full-stack dream journaling application that leverages a hybrid architecture to combine high-performance web services with a specialized Python-based Machine Learning analytical engine.

## 🧠 Deep AI Architecture

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
- **TanStack Query**: State synchronization between the web client and the ML engine.
- **Framer Motion**: Symbolic animation logic.
