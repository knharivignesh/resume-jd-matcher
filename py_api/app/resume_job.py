from flask import current_app
from app.config import Config
import os, json, pdfkit
from pypdf import PdfReader
from openai import OpenAI
from jinja2 import Template


class ResumeJob:
    def __init__(self, id=None):
        models = ["gpt-4o-mini", "gpt-4o", "openai-o3-mini", "openai-o1", "gpt-4.5"]
        self.low_ai_model = models[0]
        self.high_ai_model = models[1]
        if id:
            self.id = id
        else:
            self.id = self.generate_id()
            os.makedirs(os.path.join(Config.UPLOAD_PATH, self.id), exist_ok=True)
            with open(
                os.path.join(Config.UPLOAD_PATH, self.id, Config.RESUME_JOB_CONFIG),
                "w",
            ) as file:
                json.dump({}, file)

        self.config_path = os.path.join(
            Config.UPLOAD_PATH, self.id, Config.RESUME_JOB_CONFIG
        )
        self.initial_resume_path = os.path.join(
            Config.UPLOAD_PATH, self.id, Config.INITIAL_RESUME_FILE
        )
        self.final_resume_path = os.path.join(
            Config.UPLOAD_PATH, self.id, "final_resume.pdf"
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
        self.write_config("is_loading", True)

    def read_resume_content_from_pdf(self, path: str) -> str:
        reader = PdfReader(path)
        data = ""

        for page_no in range(len(reader.pages)):
            page = reader.pages[page_no]
            data += page.extract_text()

        return data

    def rephrase_resume(self):
        prompt = """
                You are an AI assistant specializing in resume enhancement while ensuring accuracy, authenticity, and alignment with 
                job descriptions. Given a candidates resume and a job description, rephrase the resume content to highlight relevant skills, 
                experience, and achievements without altering actual experience or fabricating details. Maintain a high ATS score by using 
                industry-relevant keywords and professional language while keeping the formatting clear and structured for readability.

                Ensure that: 
                    1. The candidates original skills, experience, and achievements remain factual.
                    2. The wording is optimized for ATS compatibility by incorporating relevant keywords from the job description.
                    3. The structure and clarity of each section are improved for readability and impact.
                    4. Any unrelated experience is either kept concise or reframed to highlight transferable skills, but never fabricated.
                    5. Format the output in the same structure as the original resume. Do not introduce any new experiences, 
                    job roles, or skills that the candidate has not mentioned.
                    6.The rephrased content seamlessly integrates into predefined templates (PDF) while preserving consistency. 
                    instead of making assumptions or adding false information. 
                    7. The final output should present the candidates true qualifications in a way that maximizes relevance for the given 
                    role without misrepresentation.
                    8. You can reorder the points if needed to match the job description.
                    9. Mainly if the ATS score low between resume and JD give gaps also in the output.
                    
                The answer needs to be in JSON format which follows the below given structure also the input will be in this same format.
                {
                   "fullName": "",
                    "emailId": "",
                    "phoneNumber": "",
                    "githubPortfolio": "",
                    "linkedinId": "",
                    "professionalSummary": "",
                    "experience": [
                        {
                            "companyName": "",
                            "role": "",
                            "duration": "",     
                            "responsibilities": []
                        }
                    ],
                    "technicalSkills": [],
                    "softSkills": [],
                    "achievements": [],
                    "gaps": []
                }
                """

        resume_config = self.read_config()

        openai_client = OpenAI(api_key=Config.OPEN_AI_KEY)

        messages = [{"role": "system", "content": prompt}]

        user_content = {
            "jobDescription": resume_config["job_description"],
            "resumeData": resume_config["extracted_resume"],
        }

        messages.append({"role": "user", "content": json.dumps(user_content)})

        response = openai_client.chat.completions.create(
            model=self.high_ai_model, messages=messages, temperature=0.0
        )

        data = (
            response.choices[0]
            .message.content.replace("json", "")
            .replace("\n", "")
            .replace("```", "")
            .strip()
        )

        current_app.logger.info(f"Resume rephrasing completed for job id: {self.id}")

        self.write_config("rephrased_resume", json.loads(data))

    def parse_resume(self):
        prompt = """
                You are an AI bot designed to act as a professional for parsing resumes. 
                You are given with resume and your job is to extract the following information from the resume.
                The answer needs to be in JSON format which follows the below given structure
                {
                   "fullName": "",
                    "emailId": "",
                    "phoneNumber": "",
                    "githubPortfolio": "",
                    "linkedinId": "",
                    "professionalSummary": "",
                    "experience": [
                        {
                            "companyName": "",
                            "role": "",
                            "duration": "",     
                            "responsibilities": []
                        }
                    ],
                    "technicalSkills": [],
                    "softSkills": [],
                    "achievements": [],
                }
                """

        resume_data = self.read_resume_content_from_pdf(self.initial_resume_path)

        openai_client = OpenAI(api_key=Config.OPEN_AI_KEY)

        messages = [{"role": "system", "content": prompt}]

        messages.append({"role": "user", "content": resume_data})

        response = openai_client.chat.completions.create(
            model=self.low_ai_model, messages=messages, temperature=0.0
        )

        data = (
            response.choices[0]
            .message.content.replace("json", "")
            .replace("\n", "")
            .replace("```", "")
            .strip()
        )

        current_app.logger.info(f"Resume extraction completed for job id: {self.id}")

        self.write_config("extracted_resume", json.loads(data))

    def generate_ats_score(self, key):
        prompt = """
                You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS 
                functionality. You are given a resume and a job description.
                Your task is to evaluate the resume against the job description and provide only the ATS score 
                without the percentage sign or any additional explanation.
                """
        resume_config = self.read_config()

        openai_client = OpenAI(api_key=Config.OPEN_AI_KEY)

        messages = [{"role": "system", "content": prompt}]

        user_content = {
            "jobDescription": resume_config["job_description"],
            "resumeData": resume_config[key],
        }

        messages.append({"role": "user", "content": json.dumps(user_content)})

        response = openai_client.chat.completions.create(
            model=self.low_ai_model, messages=messages, temperature=0.0, max_tokens=1000
        )

        data = response.choices[0].message.content

        current_app.logger.info(f"{key} ATS score generated for job id: {self.id}")

        self.write_config(f"{key}_ats_score", data)

    def generate_final_pdf(self, template_id, resume_data):
        self.write_config("rephrased_resume", json.loads(resume_data))
        data = self.read_config()["rephrased_resume"]
        self.generate_resume(
            data,
            template_id,
        )

    def generate_resume(self, data, template_id):
        output_pdf = os.path.join(
            Config.UPLOAD_PATH, self.id, f"{template_id}_{Config.PROCESSED_RESUME_FILE}"
        )

        template_path = os.path.join(Config.TEMPLATE_PATH, template_id + ".html")

        output_html = self.initial_resume_path = os.path.join(
            Config.UPLOAD_PATH, self.id, Config.OUTPUT_RESUME_HTML
        )

        with open(template_path, "r") as file:
            template = Template(file.read())

        # Render the template with user data
        rendered_html = template.render(data)

        # Save the HTML file (optional for debugging)
        with open(output_html, "w") as file:
            file.write(rendered_html)

        # Convert HTML to PDF
        pdfkit.from_file(output_html, output_pdf)
