from flask import current_app
from app.config import Config
import os, json, pdfkit
from pypdf import PdfReader
from openai import OpenAI
from jinja2 import Template


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

    def read_resume_content_from_pdf(self, path: str) -> str:
        reader = PdfReader(path)
        data = ""

        for page_no in range(len(reader.pages)):
            page = reader.pages[page_no]
            data += page.extract_text()

        return data

    def parse_resume(self):
        prompt = """
                You are an AI bot designed to act as a professional for re-writing resumes.
                You will be provided with a job description and resume. Based on this, Create a new resume
                tailored for the job description. You can add the professional summary that includes metrics
                and total years of experience. Rearrange the work highlights and keep the existing work experiences.
                Include metrics in the achievements and incorporate the most important keywords from the job description in those achievements.
                The answer needs to be in JSON format which follows the below given structure
                {
                   "fullName": "",
                    "emailId": "",
                    "githubPortfolio": "",
                    "linkedinId": "",
                    "professionalSummary": "",
                    "employmentDetails": [],
                    "technicalSkills": [],
                    "softSkills": [],
                    "achievements": []
                }
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

    def generate_final_pdf(self, template_id):
        config = json.loads(self.read_config()["extracted_resume"].replace("```", ""))
        self.generate_resume(
            {},
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

        data = {
            "name": "John Doe",
            "email": "johndoe@example.com",
            "phone": "+1 234 567 890",
            "summary": "Experienced software engineer with expertise in Python and web development.",
            "experience": [
                {
                    "title": "Software Engineer",
                    "company": "TechCorp",
                    "duration": "2018 - Present",
                    "responsibilities": [
                        "Developed REST APIs using Django.",
                        "Led a team of 5 developers.",
                        "Improved system performance by 30%.",
                    ],
                },
                {
                    "title": "Junior Developer",
                    "company": "WebWorks",
                    "duration": "2015 - 2018",
                    "responsibilities": [
                        "Built responsive UI components.",
                        "Optimized database queries.",
                        "Automated CI/CD pipeline.",
                    ],
                },
            ],
            "skills": ["Python", "Django", "Flask", "JavaScript", "React", "AWS"],
        }

        # Render the template with user data
        rendered_html = template.render(data)

        # Save the HTML file (optional for debugging)
        with open(output_html, "w") as file:
            file.write(rendered_html)

        # Convert HTML to PDF
        pdfkit.from_file(output_html, output_pdf)
