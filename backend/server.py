import os
from threading import Thread
from dotenv import load_dotenv
import json
from hashlib import sha256
import secrets
from user_information import Patient
from datetime import datetime

from flask import Flask, jsonify, request, session
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity,
    verify_jwt_in_request
)
from flask_cors import CORS

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
CORS(app)

app.config['SECRET_KEY'] = secret_key
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False

app.config['JWT_SECRET_KEY'] = 'o(*Q*&u982uq489)092#yhd'
jwt = JWTManager(app)


# connect to database
database_password = os.getenv("DATABASE_PASSWORD")
db = connector.connect(
    host="localhost",
    username="root",
    password=database_password,
    port=8282,
    database="hackathon"
)


def get_from_db(uid: int) -> Patient:
    print("the id is",uid,type(uid))
    cursor = db.cursor()
    cursor.execute("""
        SELECT email, name, sex, birth_year, weight, height, heart_rate, blood_sugar, conditions, symptoms
        FROM userreal WHERE id = %(id)s
    """, {"id": str(uid)})
    alls = []
    for resp in cursor:
        alls.append(resp)
    print(alls,"all")
    cursor.close()
    if len(alls) > 1:
        raise Exception("Should never happen!")
    elif len(alls) == 0:
        return None
    
    res = alls[0]
    return Patient(
        uid=uid,
        email=res[0],
        name=res[1],
        sex=res[2],
        birth_year=res[3],
        weight=res[4],
        height=res[5],
        heart_rate=res[6],
        blood_sugar=res[7],
        medical_conditions=res[8],
        symptoms=res[9]
    )


@app.route("/generate-planner")
def generate_planner():
    """Inputs a patient class"""
    
    try:
        verify_jwt_in_request()
    except Exception:
        return {"res": "Please log in"}, 400
    
    user_id = get_jwt_identity()
    
    patient: Patient = get_from_db(user_id)
    
    if patient.birth_year is None:
        pd_age = None
    else:
        pd_age = datetime.now().year - patient.birth_year
        
    patient_data = {
        "Sex": patient.sex,
        "Age": pd_age,  # Calculate age from birth year
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

                    You will be given the following parameters for the health information, although some data will not be present:
                    1. Sex
                    2. Age
                    3. Bodyweight
                    4. Height
                    5. Average Heart Rate
                    6. Blood Sugar
                    6. Medical conditions
                    7. Symptoms

                    Based on the following user data, your task is to create a checklist of items that the user is to complete to maintain a healthy lifestyle.
                    If there is no user data, create a generalized checklist.

                    Some examples of tasks include:
                    1. Amount of time for exercise that needs to be completed
                    2. Amount of sleep per day that needs to be achieved
                    3. Amount of caloric intake that needs to be met
                    4. Amount of water intake that needs to be met
                    5. Amount of steps per day that should be met
                    6. Amount of outdoor time

                    You are encouraged to **add your own tasks where applicable** based on the user's health metrics/data/medical conditions. For example, if the user's blood sugar is high, you may suggest reducing sugar intake, or if the user is a teenager, you may add a task related to mental health, etc.


                    Respond in a JSON object with this format:
                    "checklist": [
                        {
                            "task": "the name of the task that needs to be completed",
                            "goal": "a brief description of the task that needs to be completed. For example, if the item is related to exercise, you can mention the types of exercises that the user can do. ***Also make sure to include the medical reason why the task is included***"
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
        response_format={"type": "json_object"}
    )

    # Parse the GPT response
    print(chat_completion.choices[0].message.content)

    return chat_completion.choices[0].message.content

@app.route("/signup", methods=["POST"])
def signup_route_():
    verify_jwt_in_request(optional=True)
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
        cursor.fetchall()
        
        cursor.execute("""
            INSERT INTO userreal (email, password) VALUES (%s, %s)
        """, (json["email"], hash_password(json["password"])))
        cursor.fetchall()
        
        cursor.execute("SELECT last_insert_id()")
        the_id = next(cursor)[0]
        db.commit()
        access_token = create_access_token(identity=the_id)

        return {"access_token": access_token}, 200

    resp, code = get_the_json()
    cursor.close()
    return jsonify(resp), code

@app.route("/login", methods=["POST"])
def login_route():
    verify_jwt_in_request(optional=True)
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
        
        cursor.execute("""
            SELECT id FROM userreal WHERE email = %s AND password = %s
        """, (json["email"], hash_password(json["password"])))
        if cursor.rowcount == 0:
            return {"res": "Incorrect email and/or password"}, 400
        if cursor.rowcount > 1:
            raise Exception("This should never happen!")
        
        the_id = next(cursor)[0]
        access_token = create_access_token(identity=the_id)
        
        return {"access_token": access_token}, 200

    resp, code = get_the_json()
    cursor.close()
    return jsonify(resp), code

@app.route("/edit-data", methods=["POST"])
def edit_data_route():
    try:
        verify_jwt_in_request()
    except Exception:
        return {"res": "Please log in"}, 400
    
    user_id = get_jwt_identity()

    cursor = db.cursor()

    def get_the_json():
        try:
            json = request.get_json()
        except:
            return {"res": "Invalid request body"}, 400
        
        fields = [
            "name", "sex", "birth_year", "weight", "height", "heart_rate", "blood_sugar",
            "conditions", "symptoms"
        ]
        
        for f in fields:
            if f not in json:
                return {"res": "Invalid request body"}, 400
        
        field_values = tuple(None if json[f] == "" else json[f] for f in fields)

        cursor.execute("""
            UPDATE userreal SET
                name = %s,
                sex = %s,
                birth_year = %s,
                weight = %s,
                height = %s,
                heart_rate = %s,
                blood_sugar = %s,
                conditions = %s,
                symptoms = %s
            WHERE id = %s
        """, (*field_values, user_id))
        for _ in cursor:
            pass
        
        db.commit()
        
        return {}, 200

    resp, code = get_the_json()
    cursor.close()
    return jsonify(resp), code

@app.route("/get-data")
def get_data_route():
    try:
        verify_jwt_in_request()
    except Exception:
        return {"res": "Please log in"}, 400
    
    user_id = get_jwt_identity()
    
    patient: Patient = get_from_db(user_id)
    if patient:
        return jsonify(patient.to_dict()), 200
    else:
        return jsonify({"res": "Invalid user ID"}), 400

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


def run():
    app.run(host="0.0.0.0", port=1234)


def keep_alive():
    server = Thread(target=run)
    server.start()

keep_alive()
