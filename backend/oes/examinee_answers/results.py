def calculate_result(question, user_answer):
    result = 0

    if question.answer == user_answer:
        result = question.point

    return result
