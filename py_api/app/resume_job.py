from flask import current_app
from app.config import Config
import os, sys
from pypdf import PdfReader
import json
from openai import OpenAI


class ResumeJob:
    def __init__(self, id=None):
        models = ["gpt-4o-mini", "gpt-4o", "openai-o3-mini", "openai-o1", "gpt-4.5"]
        self.ai_model = models[0]
        if id:
            self.id = id
        else:
            self.id = self.generate_id()
            os.makedirs(os.path.join(Config.UPLOAD_PATH, self.id), exist_ok=True)
            with open(
                os.path.join(Config.UPLOAD_PATH, self.id, Config.RESUME_JOB_CONFIG), "w"
            ) as file:
                json.dump({}, file)
        self.config_path = os.path.join(
            Config.UPLOAD_PATH, self.id, Config.RESUME_JOB_CONFIG
        )
        self.initial_resume_path = os.path.join(
            Config.UPLOAD_PATH, self.id, Config.INITIAL_RESUME_FILE
        )

    def generate_id(self):
        path = os.path.join(Config.UPLOAD_PATH, "sequence.txt")
        id = 0
        if os.path.exists(path):
            with open(path, "r+") as file:
                last_count = file.read()
                file.seek(0)
                file.truncate()
                new_count = int(last_count) + 1
                file.write(str(new_count))
                return str(new_count)
        else:
            with open(path, "w") as file:
                file.write("0")
                return str(0)

    def write_config(self, key, value):
        data = self.read_config()
        data[key] = value
        with open(self.config_path, "w", encoding="utf-8") as file:
            json.dump(data, file, indent=4)

    def read_config(self):
        data = {}
        with open(self.config_path, "r") as file:
            data = json.load(file)
        return data

    def create_job(self, doc, jd):
        doc.save(self.initial_resume_path)
        self.write_config("job_description", jd)

    def read_resume_content_from_pdf(self, path: str) -> str:
        reader = PdfReader(path)
        data = ""

        for page_no in range(len(reader.pages)):
            page = reader.pages[page_no]
            data += page.extract_text()

        return data

    def parse_resume(self):
        prompt = """
                You are an AI bot designed to act as a professional for parsing resumes. You are given with resume and your job is to extract the following information from the resume:
                1. full name
                2. email id
                3. github portfolio
                4. linkedin id
                5. employment details
                6. technical skills
                7. soft skills
                Give the extracted information in parseable json format only
                """

        resume_data = self.read_resume_content_from_pdf(self.initial_resume_path)

        openai_client = OpenAI(api_key=Config.OPEN_AI_KEY)

        messages = [{"role": "system", "content": prompt}]

        user_content = resume_data

        messages.append({"role": "user", "content": user_content})

        response = openai_client.chat.completions.create(
            model=self.ai_model, messages=messages, temperature=0.0
        )

        data = (
            response.choices[0]
            .message.content.replace("json", "")
            .replace("\n", "")
            .strip()
        )

        current_app.logger.info(f"Resume extraction completed for job id: {self.id}")

        self.write_config("extracted_resume", data)

    def generate_ats_score(
        self,
    ):
        prompt = """
                You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality.
                You are given a resume and a job description.
                Your task is to evaluate the resume against the job description and provide only the ATS score without the percentage sign or any additional explanation.
                """

        resume_data = self.read_resume_content_from_pdf(self.initial_resume_path)

        openai_client = OpenAI(api_key=Config.OPEN_AI_KEY)

        messages = [{"role": "system", "content": prompt}]

        user_content = f"Job Description: {self.read_config()['job_description']}\n\nResume: {resume_data}"

        messages.append({"role": "user", "content": user_content})

        response = openai_client.chat.completions.create(
            model=self.ai_model, messages=messages, temperature=0.0, max_tokens=1000
        )

        data = response.choices[0].message.content

        current_app.logger.info(f"ATS score generated for job id: {self.id}")

        self.write_config("initial_ats_score", data)
