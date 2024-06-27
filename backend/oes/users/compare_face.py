from deepface import DeepFace


def compare_face(current_image, profile_picture):

    # result = DeepFace.verify(image1_path, image2_path)
    try:
        # DeepFace.setThreshold(0.2)
        print("image1*****", current_image)
        print("image2*****", profile_picture)

        result = DeepFace.verify(current_image, profile_picture, model_name="ArcFace")
        return result
    except:
        return False
