from flask import Flask, render_template, request, jsonify
from transformers import T5Tokenizer, T5ForConditionalGeneration, pipeline
import torch
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)
app.debug = True

# Grammar Correction
model_path = './models/GrammarCorrector'
torch_device = 'cuda' if torch.cuda.is_available() else 'cpu'
tokenizer = T5Tokenizer.from_pretrained(model_path)
model = T5ForConditionalGeneration.from_pretrained(model_path).to(torch_device)

# Summarization
# model_name = "sshleifer/distilbart-cnn-12-6"
model_name = "./models/distilbart-cnn-12-6"
model_revision = "main"
summarizer = pipeline("summarization", model=model_name, revision=model_revision)


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/grammar-check', methods=['GET', 'POST'])
def grammar_check():
    if request.method == 'POST':
        input_text = request.form.get('input_text')
        if not input_text:
            return jsonify({'error': 'Input text is empty'})

        num_return_sequences = 1  # Change this as needed

        # Perform grammar correction using the model
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

    return render_template('grammar-check-fe.html')


@app.route('/summarization-tool', methods=['GET', 'POST'])
def summarization_tool():
    if request.method == 'POST':
        data = request.get_json()
        input_type = data['inputType']
        input_text = data['inputText']
        summary = get_summary(input_type, input_text)
        return jsonify({'summary': summary})

    return render_template('summarization-tool-fe.html')


def get_summary(input_type, input_text):
    if input_type == 'url':
        r = requests.get(input_text)
        soup = BeautifulSoup(r.text, 'html.parser')
        results = soup.find_all(['h1', 'p'])
        text = [result.text for result in results]
        article = ' '.join(text)
    else:
        article = input_text

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
    return summary


if __name__ == '__main__':
    app.run(port=5000)
