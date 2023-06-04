from flask import Flask, render_template, request, jsonify
from transformers import pipeline
from bs4 import BeautifulSoup
import requests

model_name = "sshleifer/distilbart-cnn-12-6"
model_revision = "main"

summarizer = pipeline("summarization", model=model_name, revision=model_revision)

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        input_type = request.form['input-type']
        input_text = request.form['input-text']
        summary = get_summary(input_type, input_text)
        return render_template('summarizer-tool-fe.html', summary=summary)
    return render_template('summarizer-tool-fe.html')

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.get_json()
    input_type = data['inputType']
    input_text = data['inputText']
    summary = get_summary(input_type, input_text)
    return jsonify({'summary': summary})

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
    app.run(port=2500)
