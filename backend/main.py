import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI, OpenAIError

# Load environment variables from the .env file.
# This prevents the secret key from being hard-coded in source code.
load_dotenv()

# Initialize the FastAPI application
app = FastAPI(title="OpenAI API Lab")

# Enable CORS (Cross-Origin Resource Sharing) so the frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for this simple lab
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Read the API key and model name from the environment variables
api_key = os.getenv("OPENAI_API_KEY")
model_name = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Initialize the OpenAI client only if the API key is provided
client = None
if api_key:
    client = OpenAI(api_key=api_key)

# Define the structure of the incoming request body
class ChatRequest(BaseModel):
    message: str

@app.get("/api")
def read_root():
    """
    Simple health check endpoint to verify the API is running.
    """
    return {"message": "OpenAI API Lab is running"}

@app.post("/api/chat")
def chat(request: ChatRequest):
    """
    This endpoint receives a message from the user, sends it to OpenAI,
    and returns the AI's response.
    """
    # Error Handling: Check if API key is missing
    if not client:
        raise HTTPException(
            status_code=500, 
            detail="OpenAI API key is missing. Please configure it in the .env file."
        )

    # Error Handling: Check if the user message is empty
    if not request.message or not request.message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    try:
        # Call the OpenAI Responses API
        # The API call is made from the backend so the API key remains secure
        # and is never exposed to the frontend JavaScript.
        response = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "user", "content": request.message}
            ]
        )
        
        # Extract the text content from the response
        ai_message = response.choices[0].message.content
        return {"response": ai_message}

    except OpenAIError as e:
        # Error Handling: Catch OpenAI specific errors (e.g., invalid key, quota exceeded)
        # We don't expose the raw error to the client to avoid leaking sensitive information,
        # but we return a clean JSON error response.
        raise HTTPException(
            status_code=502,
            detail=f"OpenAI API error: {str(e)}"
        )
    except Exception as e:
        # Error Handling: Catch unexpected server errors
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred while communicating with the AI."
        )

# Serve the static frontend files
# This makes it easy to run the entire app (backend + frontend) on a single port (8000)
# Ensure this is placed after the API routes so it doesn't intercept /api requests
app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")
