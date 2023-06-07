from flask import Flask, render_template, request, jsonify
import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
from bs4 import BeautifulSoup
import requests
from transformers import pipeline
from flask_caching import Cache
import atexit

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

model_path = './models/GrammarCorrector'
torch_device = 'cuda' if torch.cuda.is_available() else 'cpu'
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(model_path).to(torch_device)
num_return_sequences = 1

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/dictionary')
def dictionary():
    return render_template('dictionary.html')

@app.route('/grammar-correction', methods=['GET', 'POST'])
def grammar_correction():
    if request.method == 'POST':
        input_text = request.json.get('input_text')
        batch = tokenizer(
            [input_text],
            truncation=True,
            padding='max_length',
            max_length=64,
            return_tensors="pt"
        ).to(torch_device)
        translated = model.generate(
            **batch,
            max_length=64,
            num_beams=4,
            num_return_sequences=num_return_sequences,
            temperature=1.5
        )
        corrected_text = tokenizer.batch_decode(translated, skip_special_tokens=True)

        return jsonify({'corrected_text': corrected_text[0]})

    return render_template('gec-fe.html')

@app.route('/text-summarization', methods=['GET', 'POST'])
@cache.cached(timeout=None, unless=lambda: request.method == 'POST')  # Disable caching for POST requests, Disable timeout
def text_summarization():
    if request.method == 'POST':
        input_type = request.json.get('input_type')
        input_text = request.json.get('input_text')

        # Check if result is already cached
        cached_result = cache.get(input_text)
        if cached_result is not None:
            return jsonify({'summary':cached_result})
        
        if input_type == 'url':
            r = requests.get(input_text)
            soup = BeautifulSoup(r.text, 'html.parser')
            results = soup.find_all(['h1', 'p'])
            text = [result.text for result in results]
            article = ' '.join(text)
        else:
            article = input_text

        # model_name = "sshleifer/distilbart-cnn-12-6"
        model_name = "./models/distilbart-cnn-12-6"
        model_revision = "main"
        summarizer = pipeline("summarization", model=model_name, revision=model_revision)
        max_chunk = 500

        article = article.replace('.', '.<eos>')
        article = article.replace('?', '?<eos>')
        article = article.replace('!', '!<eos>')
        sentences = article.split('<eos>')
        current_chunk = 0
        chunks = []

        for sentence in sentences:
            if len(chunks) == current_chunk + 1:
                if len(chunks[current_chunk]) + len(sentence.split(' ')) <= max_chunk:
                    chunks[current_chunk].extend(sentence.split(' '))
                else:
                    current_chunk += 1
                    chunks.append(sentence.split(' '))
            else:
                chunks.append(sentence.split(' '))

        for chunk_id in range(len(chunks)):
            chunks[chunk_id] = ' '.join(chunks[chunk_id])

        summaries = []
        for chunk in chunks:
            res = summarizer(chunk, max_length=120, min_length=30, do_sample=False)
            summaries.append(res[0]['summary_text'])

        summary = ' '.join(summaries)

        # Cache the result
        cache.set(input_text, summary)

        return jsonify({'summary': summary})

    return render_template('ts-fe.html')

# Function to clear cache on application exit
def clear_cache():
    cache.clear()

# Register the clear_cache function to be called on application exit
atexit.register(clear_cache)

if __name__ == '__main__':
    
    app.run(debug=True, port=1000)