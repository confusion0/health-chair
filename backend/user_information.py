from __future__ import annotations
import mysql.connector as connector
import os
from dotenv import load_dotenv

from dataclasses import dataclass
from typing import List

load_dotenv(".env")

database_password = os.getenv("DATABASE_PASSWORD")

db = connector.connect(
    host="localhost",
    username="root",
    password=database_password,
    port=8282,
    database="hackathon"
)

@dataclass(kw_only=True)
class Patient:
    uid: int
    email: str
    name: str
    sex: str
    birth_year: int
    weight: int
    height: int
    heart_rate: int
    blood_sugar: int
    medical_conditions: List[str]
    symptoms: List[str]
    
    def retrieve_data(self):
        """returns the relevant health advice for the current pateint"""
        return (f"{self.sex=}, {self.birth_year=}, {self.weight=}, {self.height=}, {self.heart_rate=}, " +
                f"{self.blood_sugar=}, {self.medical_conditions=}, {self.symptoms=}")

    def to_dict(self):
        return {
            "id": self.uid,
            "email": self.email,
            "name": self.name,
            "sex": self.sex,
            "birthYear": self.birth_year,
            "weight": self.weight,
            "height": self.height,
            "bloodSugar": self.blood_sugar,
            "medicalConditions": self.medical_conditions,
            "symptoms": self.symptoms
        }


if __name__ == "__main__":
    # test_user = Patient(sex="M", birth_year=2000, weight=40, height=170, heart_rate=60, blood_sugar=10, medical_conditions=["diabetes"],symptoms=["fever"])
    print(Patient.get_from_db(33))
