import mysql.connector as connector
import os
from dotenv import load_dotenv
from __future__ import annotations

from dataclasses import dataclass
from typing import List

load_dotenv(".env")

database_password = os.getenv("DATABASE_PASSWORD")

db = connector.connect(
    host="localhost",
    username="root",
    password=database_password,
    port=8282,
    database="hackathonsigmas"
)

@dataclass
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

    def __post_init__(self):  # operations done after initialization
        ...

    def store_to_db():
        """
        Saves this object's user data to the database.
        """
        return False
        cursor = db.cursor()
        sql = """
        UPDATE userreal SET (sex, birth_year, weight, height, heart_rate, blood_sugar, medical_conditions, symptoms)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        
    def retrieve_data(self):
        """returns the relevant health advice for the current pateint"""
        return (f"{self.sex=}, {self.birth_year=}, {self.weight=}, {self.height=}, {self.heart_rate=}, " +
                f"{self.blood_sugar=}, {self.medical_conditions=}, {self.symptoms=}")

    @staticmethod
    def get_from_db(uid: int) -> UserClass:
        cursor = db.cursor()
        cursor.execute("""
            SELECT email, name, sex, birth_year, weight, height, heart_rase, blood_sugar
            FROM userreal WHERE id = %d
        """, (uid,))
        all = cursor.fetchall()
        if len(all) > 1:
            raise Exception("Should never happen!")
        elif len(all) == 0:
            return None
        
        res = all[0]
        return UserClass(
            uid, res[0], res[1], res[2], res[3], res[4], res[5], res[6], res[7], [], []
        )

if __name__ == "__main__":
    test_user = UserClass(sex="M", birth_year=2000, weight=40, height=170, heart_rate=60, blood_sugar=10, medical_conditions=["diabetes"],symptoms=["fever"])
