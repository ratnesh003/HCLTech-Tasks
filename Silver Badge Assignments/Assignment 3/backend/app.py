from flask import Flask, request, jsonify
from flask_cors import CORS
from deep_translator import GoogleTranslator
import os

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return jsonify({"data":"Translator app backend up and running!"}), 200


@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.json
    text = data.get("text")
    src_lang = data.get("source_language")
    tgt_lang = data.get("target_language")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    translated = GoogleTranslator(
        source=src_lang,
        target=tgt_lang
    ).translate(text)

    return jsonify({"translated_text": translated})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)