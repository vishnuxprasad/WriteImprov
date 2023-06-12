import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration

# model_path = './models/GrammarCorrector'
# model = T5ForConditionalGeneration.from_pretrained(model_path).to(torch_device)

model_name = 'deep-learning-analytics/GrammarCorrector'
torch_device = 'cuda' if torch.cuda.is_available() else 'cpu'
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name).to(torch_device)

def correct_grammar(input_text,num_return_sequences):
  batch = tokenizer([input_text],truncation=True,padding='max_length',max_length=64, return_tensors="pt").to(torch_device)
  translated = model.generate(**batch,max_length=64,num_beams=4, num_return_sequences=num_return_sequences, temperature=1.5)
  tgt_text = tokenizer.batch_decode(translated, skip_special_tokens=True)
  return tgt_text
text = 'My name as Arun. I ninteen year old. I like dance. I want to Engineer. I is the super.'
print(correct_grammar(text, num_return_sequences=1))