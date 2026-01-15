# Oneiros - Advanced AI Dream Journal

Oneiros is a full-stack dream journaling application that leverages a hybrid architecture to combine high-performance web services with advanced machine learning analysis.

## 🚀 Tech Stack

### Backend & API
- **Node.js & Express**: Handles user authentication, session management, and primary CRUD operations.
- **PostgreSQL & Drizzle ORM**: Reliable data persistence for user dreams, profiles, and analytical metadata.
- **Replit Auth**: Seamless OpenID Connect integration for secure user management.

### AI/ML Engine (Python)
The core intelligence of Oneiros is powered by a sophisticated Python-based ML engine located in the `ml/` directory.

#### 1. LangChain LCEL (Expression Language)
I implemented a robust orchestration layer using **LangChain LCEL**. This allows for:
- **Symbolic Interpretation Chains**: Structured pipelines that process raw dream text into Jungian psychological insights.
- **Weekly Synthesis**: A multi-document aggregation chain that identifies overarching subconscious patterns and emotional climates across multiple dream entries.
- **Dynamic Prompting**: Context-aware prompts that extract archetypes and triggers with high precision.

#### 2. Hugging Face Transformers
Applied deep learning expertise by integrating **Hugging Face** for:
- **Fine-Tuning Pipeline**: A dedicated script (`ml/fine_tune.py`) demonstrating the fine-tuning of pretrained transformer models (e.g., DistilBERT) for dream-specific emotion and sentiment classification.
- **Inference**: Using state-of-the-art models to generate high-dimensional embeddings and classify complex psychological states.

#### 3. PyTorch & Temporal Analysis
- **LSTM Architecture**: Implemented a custom **PyTorch LSTM** model to detect temporal patterns and emotional anomalies in a user's dream sequence over time.
- **Embeddings**: Utilized `sentence-transformers` to map subconscious content into semantic vector space for advanced similarity search and clustering.

### Frontend
- **React (TypeScript)**: A mystical, dark-themed UI built with performance and aesthetics in mind.
- **Tailwind CSS & Shadcn/UI**: Modern styling with custom animations and mystical design language.
- **Framer Motion**: Smooth micro-interactions and transitions to enhance the user experience.
- **TanStack Query**: Efficient server-state management and real-time data fetching.

## 🧠 Key Features
- **Deep Psychological Analysis**: Instant symbolic interpretation using Jungian perspectives.
- **Weekly Psychological Synthesis**: Aggregated insights that reveal long-term subconscious trends.
- **Archetype Extraction**: Automatic detection of core psychological archetypes.
- **Emotional Landscape Tracking**: Visualizing emotional shifts using advanced sentiment analysis.
