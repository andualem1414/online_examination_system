from sentence_transformers import SentenceTransformer, util


def calculate_result(question, user_answer):
    result = 0
    print(question)

    if question.type == "SHORT_ANSWER":

        model = SentenceTransformer("all-mpnet-base-v2")

        sentence1_embedding = model.encode(question.answer)
        sentence2_embedding = model.encode(user_answer)
        # Calculate cosine similarity
        cosine_similarity = util.pytorch_cos_sim(
            sentence1_embedding, sentence2_embedding
        )
        score = cosine_similarity.item()
        if score <= 0.2:
            score = 0
        result = score * question.point

    else:
        if question.answer == user_answer:
            result = question.point

    return result
