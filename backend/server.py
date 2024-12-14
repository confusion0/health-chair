import os
from threading import Thread
from dotenv import load_dotenv
import json
from hashlib import sha256
import secrets
from user_information import Patient

from flask import Flask, jsonify, request, session
import mysql.connector as connector
from openai import AzureOpenAI

load_dotenv(".env")

client = AzureOpenAI(
    azure_endpoint=os.getenv("OPEN_AI_ENDPOINT"),
    api_key=os.getenv("OPEN_AI_KEY"),
    api_version="2024-02-01",
) # connect to OpenAI

secret_key = secrets.token_hex(16)

app = Flask("")
app.config['SECRET_KEY'] = secret_key
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

# connect to database
database_password = os.getenv("DATABASE_PASSWORD")
db = connector.connect(
    host="localhost",
    username="root",
    password=database_password,
    port=8282,
    database="hackathon"
)

@app.route("/")
def main():
    return "Hello World!"

@app.route("/generate-planner")
def generate_planner(patient: Patient):
    # Prepare the patient's data for the GPT model
    patient_data = {
        "Sex": patient.sex,
        "Age": 2024 - patient.birth_year,  # Calculate age from birth year
        "Bodyweight": patient.weight,
        "Height": patient.height,
        "Average Heart Rate": patient.heart_rate,
        "Blood Sugar": patient.blood_sugar,
        "Medical Conditions": patient.medical_conditions,
        "Symptoms": patient.symptoms,
    }

    # Send data to the chat model
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": '''
                    You are an AI planner that helps plan out a day for a user based on their personal health information.

                    You will be given the following parameters for the health information:
                    1. Sex
                    2. Age
                    3. Bodyweight
                    4. Height
                    5. Average Heart Rate
                    6. Blood Sugar
                    6. Medical conditions
                    7. Symptoms

                    Based on the following user data, your task is to create a checklist of items that the user is to complete to maintain a healthy lifestyle.

                    Some examples of tasks include:
                    1. Amount of time for exercise that needs to be completed
                    2. Amount of sleep per day that needs to be achieved
                    3. Amount of caloric intake that needs to be met
                    4. Amount of water intake that needs to be met
                    5. Amount of steps per day that should be met
                    6. Amount of outdoor time

                    You are encouraged to **add your own tasks where applicable** based on the user's health metrics/data. For example, if the user's blood sugar is high, you may suggest reducing sugar intake, or if the user is a teenager, you may add a task related to mental health, etc.

                    Respond in a JSON object with this format:
                    [
                        {
                            "Task": "the name of the task that needs to be completed",
                            "Goal": "a brief description of the task that needs to be completed. For example, if the item is related to exercise, you can mention the types of exercises that the user can do."
                        }
                    ]
                '''
            },
            {
                "role": "user",
                "content": json.dumps(patient_data)  # Convert patient data to JSON string
            }
        ],
        model="gpt4o",
    )

    # Parse the GPT response
    planner = json.loads(chat_completion.choices[0].message.content)

    return jsonify(planner)  
@app.route("/signup", methods=["POST"])
def signup_route_():
    cursor = db.cursor()

    def get_the_json():
        try:
            json = request.get_json()
        except:
            return {"res": "Invalid request body"}, 400

        if "email" not in json or "password" not in json:
            return {"res": "Invalid request body"}, 400
        
        if json["email"] == "":
            return {"res": "Please provide an email"}, 400
        if json["password"] == "":
            return {"res": "Please provide a password"}, 400

        cursor.execute("SELECT NULL FROM userreal WHERE email = %s", (json["email"],))
        if cursor.rowcount > 0:
            return {"res": "That email is already in use"}, 400
        
        cursor.execute("""
            INSERT INTO userreal (email, password) VALUES (%s, %s)
        """, (json["email"], hash_password(json["password"])))
        
        cursor.execute("SELECT last_insert_id()")
        session["id"] = next(cursor)
        print(session)
        return {}, 200

    resp, code = get_the_json()
    cursor.close()
    return jsonify(resp), code

def hash_password(password):
    return sha256(password.encode('utf-8')).hexdigest()

@app.route("/users")
def get_users_():
    cursor = db.cursor()
    cursor.execute("SELECT * FROM userreal")
    s = ""
    for res in cursor:
        s += str(res) + "\n\n"
    cursor.close()
    return s

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

def run():
    app.run(host="0.0.0.0", port=1234)


def keep_alive():
    server = Thread(target=run)
    server.start()


keep_alive()