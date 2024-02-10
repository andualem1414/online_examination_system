import requests

exam_id = input("What is the product id: ")

try:
    exam_id = int(exam_id)
except:
    exam_id = None
    print(f"{exam_id} not valid")

if exam_id:
    endpoint = f"http://localhost:8000/api/exams/{exam_id}/delete/"

    get_response = requests.delete(endpoint)
    print(get_response.status_code, get_response.status_code == 204)
