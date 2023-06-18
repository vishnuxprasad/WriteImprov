from transformers import pipeline
from bs4 import BeautifulSoup
import requests

model_name = "sshleifer/distilbart-cnn-12-6"
model_revision = "main"
summarizer = pipeline("summarization", model=model_name, revision=model_revision)

URL = "https://www.freecodecamp.org/news/what-is-game-development/"
r = requests.get(URL)

soup = BeautifulSoup(r.text, 'html.parser')
results = soup.find_all(['h1', 'p'])
text = [result.text for result in results]
ARTICLE = ' '.join(text)

max_chunk = 500
ARTICLE = ARTICLE.replace('.', '.<eos>')
ARTICLE = ARTICLE.replace('?', '?<eos>')
ARTICLE = ARTICLE.replace('!', '!<eos>')
sentences = ARTICLE.split('<eos>')
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
print(summary)
