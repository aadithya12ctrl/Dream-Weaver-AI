import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer, Trainer, TrainingArguments
from datasets import Dataset

# ============================================================
# Hugging Face Fine-Tuning Script
# This demonstrates fine-tuning a transformer for dream sentiment/emotion
# ============================================================

def fine_tune_dream_model():
    model_name = "distilbert-base-uncased"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=3) # Pos, Neg, Neutral

    # Example Dataset (Mocking for demonstration)
    data = {
        "text": ["I was flying over a city", "I was being chased by a shadow", "I was walking in a peaceful garden"],
        "label": [2, 0, 2] # 2: Pos, 0: Neg
    }
    dataset = Dataset.from_dict(data)

    def tokenize_function(examples):
        return tokenizer(examples["text"], padding="max_length", truncation=True)

    tokenized_datasets = dataset.map(tokenize_function, batched=True)

    training_args = TrainingArguments(
        output_dir="./results",
        num_train_epochs=3,
        per_device_train_batch_size=8,
        logging_dir="./logs",
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_datasets,
    )

    # trainer.train() # Commented out for demonstration purposes
    print("Fine-tuning pipeline prepared and model loaded.")

if __name__ == "__main__":
    fine_tune_dream_model()
