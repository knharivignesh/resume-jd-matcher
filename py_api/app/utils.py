from pypdf import PdfReader
from openai import OpenAI
from app.config import Config


class Utils:
    @staticmethod
    def read_file_from_path(path: str) -> str:
        reader = PdfReader(path)
        data = ""

        for page_no in range(len(reader.pages)):
            page = reader.pages[page_no]
            data += page.extract_text()

        return data

    @staticmethod
    def parse_resume(resume_data):
        prompt = """
                You are an AI bot designed to act as a professional for parsing resumes. You are given with resume and your job is to extract the following information from the resume:
                1. full name
                2. email id
                3. github portfolio
                4. linkedin id
                5. employment details
                6. technical skills
                7. soft skills
                Give the extracted information in json format only
                """

        openai_client = OpenAI(api_key=Config.OPEN_AI_KEY)

        messages = [{"role": "system", "content": prompt}]

        user_content = resume_data

        messages.append({"role": "user", "content": user_content})

        models = ["gpt-4o-mini", "gpt-4o", "openai-o3-mini", "openai-o1", "gpt-4.5"]

        response = openai_client.chat.completions.create(
            model=models[0], messages=messages, temperature=0.0, max_tokens=1000
        )

        data = response.choices[0].message.content

        # print(data)
        return data
