from examinee_answers.models import ExamineeAnswer, Flag


def calculate_score(user, exam):
    score, flags = 0, 0
    answers = ExamineeAnswer.objects.filter(examinee=user, exam=exam)

    for answer in answers:
        if Flag.objects.filter(examinee_answer=answer).exists():
            flags += 1
            continue
        score += answer.result

    return [score, flags]
