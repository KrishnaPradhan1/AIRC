import os
import json
import google.generativeai as genai
import pypdf
import docx

class ResumeAnalyzer:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        if not self.api_key:
            print("Warning: GEMINI_API_KEY not found in environment variables.")
        else:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')

    def extract_text(self, file_path):
        """Extracts text from PDF or DOCX file."""
        ext = file_path.rsplit('.', 1)[1].lower()
        text = ""
        try:
            if ext == 'pdf':
                reader = pypdf.PdfReader(file_path)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            elif ext in ['docx', 'doc']:
                doc = docx.Document(file_path)
                for para in doc.paragraphs:
                    text += para.text + "\n"
            else:
                return None
        except Exception as e:
            print(f"Error extracting text: {e}")
            return None
        return text.strip()

    def analyze_resume(self, resume_text, job_description=None):
        """
        Analyzes resume text against a job description (optional) using LLM.
        Returns a structured JSON object.
        """
        if not resume_text:
            return {"error": "No text provided"}

        system_prompt = """
        You are an expert Senior Technical Recruiter and AI Resume Analyzer (AIRC). 
        Your goal is to provide a highly accurate, critical, and detailed analysis of a resume.
        
        Output must be a valid JSON object with the following structure:
        {
            "summary": "Professional summary of the candidate (max 3 sentences)",
            "skills": ["List", "of", "extracted", "skills"],
            "experience_level": "Junior/Mid/Senior/Lead",
            "years_of_experience": "Estimated years (e.g. '5+ years')",
            "education": "Highest degree found",
            "strengths": ["List", "of", "key", "strengths"],
            "weaknesses": ["List", "of", "potential", "weaknesses" or "missing critical skills"],
            "match_score": 0-100 (integer, only if job description provided, else null),
            "classification": "Recommended Role/Category (e.g. 'Backend Developer', 'Data Scientist')",
            "recommendation": "Hire/Interview/Reject/Hold" (based on quality)
        }
        """

        user_prompt = f"{system_prompt}\n\nResume Text:\n{resume_text}\n\n"
        if job_description:
            user_prompt += f"Job Description:\n{job_description}\n\n"
            user_prompt += "Compare the resume against the job description. Be strict with the Match Score."
        else:
            user_prompt += "Analyze this resume for general profile classification and quality."

        try:
            response = self.model.generate_content(user_prompt)
            # Clean up response text to ensure it's valid JSON
            text_response = response.text.strip()
            if text_response.startswith("```json"):
                text_response = text_response[7:-3]
            elif text_response.startswith("```"):
                text_response = text_response[3:-3]
            
            result = json.loads(text_response)
            return result
        except Exception as e:
            print(f"LLM Analysis Error: {e}")
            # Fallback mock response if API fails
            return {
                "summary": f"Analysis failed due to API error: {str(e)}",
                "skills": [],
                "experience_level": "Unknown",
                "match_score": 0,
                "classification": "Unclassified"
            }

# Singleton instance
analyzer = ResumeAnalyzer()
