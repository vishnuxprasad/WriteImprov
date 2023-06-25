# WriteImprov

WriteImprov is a **Flask** web application that offers a variety of language-related features, including a dictionary, grammar correction and text summarization. This repository contains the Flask backend and the corresponding frontend.


## Features

1. **Dictionary**: Look up the meanings, synonyms and examples of words.
3. **Grammar Correction**: Correct the grammar of a given text.
2. **Text Summarization**: Summarize the contents of a web article URL or given text/paragraphs.


## Backend

The backend of WriteImprov is built using Python and Flask, with the following dependencies:

- `transformers`: A popular open-source library for Natural Language Processing (NLP) developed by  Hugging Face. Used for grammar correction using the T5 model and text summarization using distilbart cnn 12-6 model.
- `beautifulsoup4` and `requests`: Used for web scraping and fetching web page content.
- `flask-caching`: Used for caching text summarization results.
- `atexit`: Used to clear the cache on application exit.

Follow the installation instructions within the link to [install `transformers`](https://huggingface.co/docs/transformers/installation).

[Free Dictionary API](https://dictionaryapi.dev/) used to implement **Dictionary** feature.

Link for reference regarding the training and usage of `sequence-to-sequence` model based on the `T5` (Text-to-Text Transfer Transformer) architecture used for **Grammar Correction**. [NLP: Building a Grammatical Error Correction Model](https://towardsdatascience.com/nlp-building-a-grammatical-error-correction-model-deep-learning-analytics-c914c3a8331b).

[Grammarly SDK editor](https://developer.grammarly.com/) was utilized for further enhancing the **Grammar Correction** feature.

Link  for reference regarding [distilbart-cnn-12-6](https://huggingface.co/sshleifer/distilbart-cnn-12-6) model used for **Text Summarization**.


## Frontend

The frontend of WriteImprov is built using HTML, CSS, and JavaScript. It provides a user-friendly interface for interacting with the backend features.


## Usage

1. Install the necessary dependencies and libraries.
   - Refer to the `dependancies-libraries.txt` file within the repository for more information.

2. Run the `backend.py` file to set up the server.
   - For initial setup the models will be downloaded (if not available locally). Refer [Manage huggingface_hub  cache-system](https://huggingface.co/docs/huggingface_hub/guides/manage-cache) for more details.
   - Once server is set up, access the WriteImprov web application by  opening `http://localhost:1000` in your web browser.

3.  Use the navigation menu to select the desired feature:
   - **Dictionary**: Enter a word in the search box to look up its meanings, synonyms, antonyms, and examples.
   - **Grammar Correction**: Enter a text to correct its grammar. The corrected text will be displayed.
   - **Text Summarization**: Enter a web article URL or text/paragraphs to generate a summary. The results will be cached for future requests.
