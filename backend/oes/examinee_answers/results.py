import google.generativeai as genai

from sentence_transformers import SentenceTransformer, util

import re
import requests

genai.configure(api_key="")
model = genai.GenerativeModel("gemini-pro")


chat = model.start_chat(history=[])


def gemini_call(sentence1, sentence2):
    chat.send_message(
        f'Imagine you are strict examiner grading examinee answers, rank this two answers based on only their precise meaning similarity on the scale of 1 to 10 and explain your reasoning. correct answer: "{sentence1}" and examinee answer: "{sentence2}" '
    )
    response2 = chat.send_message("give me a single number as response")

    numbers = re.findall(r"\d+", response2.text)

    print(chat.history)

    return int(numbers[0]) / 10


def calculate_result(question, user_answer):
    result = 0
    print(question)

    if question.type == "SHORT_ANSWER":
        try:
            response = requests.get("https://www.google.com", timeout=3)
            gemini_score = gemini_call(question.answer, user_answer)
            print(gemini_score)
            if gemini_score <= 0.2:
                gemini_score = 0
            result = gemini_score * question.point

        except requests.exceptions.RequestException as e:
            model = SentenceTransformer("all-mpnet-base-v2")

            print("no Internet")
            # custom model here
            sentence1_embedding = model.encode(question.answer)
            sentence2_embedding = model.encode(user_answer)
            # Calculate cosine similarity
            cosine_similarity = util.pytorch_cos_sim(
                sentence1_embedding, sentence2_embedding
            )
            score = cosine_similarity.item()
            if score <= 0.3:
                score = 0
            result = score * question.point

        except Exception as e:
            print("An error occurred:", e)
    else:
        if question.answer == user_answer:
            result = question.point

    return result
