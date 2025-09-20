import firebase_admin
from firebase_admin import credentials, storage
from decouple import config

if not firebase_admin._apps:
    cred = credentials.Certificate({
        "type": "service_account",
        "project_id": config("FIREBASE_PROJECT_ID"),
        "private_key_id": config("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": config("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
        "client_email": config("FIREBASE_CLIENT_EMAIL"),
        "client_id": config("FIREBASE_CLIENT_ID"),
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{config('FIREBASE_CLIENT_EMAIL')}"
    })

    firebase_admin.initialize_app(cred, {
        "storageBucket": config("FIREBASE_STORAGE_BUCKET")
    })


def upload_file_to_firebase(file, path):
    """Uploads file to Firebase Storage and returns public URL"""
    bucket = storage.bucket()
    blob = bucket.blob(path)
    blob.upload_from_file(file, content_type=file.content_type)
    blob.make_public()
    return blob.public_url
