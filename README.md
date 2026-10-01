# OpenAI API Lab

A complete beginner-friendly project demonstrating how to integrate the OpenAI API into a Python application.

## Description

This project demonstrates how a Python FastAPI backend communicates with the OpenAI API and provides a simple browser-based chat interface. It is designed to be easy to understand for beginners while maintaining a professional structure suitable for a portfolio.

## Features

* **OpenAI API integration**: Uses the official `openai` Python SDK.
* **FastAPI backend**: A modern, fast web framework for building APIs with Python.
* **Responses API**: Uses the modern OpenAI chat completions API.
* **Simple chat interface**: Built with HTML, CSS, and vanilla JavaScript (No React/Next.js).
* **Environment variable based API key**: Keeps your secrets safe using `python-dotenv`.
* **Error handling**: Gracefully handles missing keys, empty messages, and network errors.
* **GitHub-ready structure**: Clean separation of frontend and backend.

## Architecture

The request flows from the browser to the backend, which securely forwards it to the OpenAI API:

```text
Browser
   ↓ (fetch POST /api/chat)
Frontend JavaScript
   ↓
FastAPI Backend (main.py)
   ↓ (OpenAI Python SDK)
OpenAI API
   ↓
FastAPI Backend
   ↓
Browser (Updates UI)
```

## Installation

Follow these steps to set up the project locally on Windows PowerShell.

1. **Clone the repository** (if you haven't already):
   ```powershell
   git clone <repository-url>
   cd openai-api-lab
   ```

2. **Navigate to the backend directory**:
   ```powershell
   cd backend
   ```

3. **Create a virtual environment**:
   ```powershell
   python -m venv venv
   ```

4. **Activate the virtual environment**:
   ```powershell
   .\venv\Scripts\activate
   ```

5. **Install the dependencies**:
   ```powershell
   pip install -r requirements.txt
   ```

6. **Configure the Environment Variables**:
   * Copy the `.env.example` file and name it `.env`:
     ```powershell
     cp .env.example .env
     ```
   * Open the `.env` file and replace `your_api_key_here` with your actual OpenAI API key.

## Running the application

1. **Start the backend server**:
   Make sure your virtual environment is active, then run:
   ```powershell
   uvicorn main:app --reload
   ```

2. **Access the application**:
   The FastAPI server serves both the API and the frontend static files.
   Open your web browser and navigate to:
   ```text
   http://127.0.0.1:8000
   ```

## API Endpoint Documentation

### `GET /api`
Health check endpoint.
**Response:**
```json
{
  "message": "OpenAI API Lab is running"
}
```

### `POST /api/chat`
Sends a message to the AI and returns the response.
**Request:**
```json
{
  "message": "Hello"
}
```
**Response:**
```json
{
  "response": "Hello! How can I help you today?"
}
```

## Troubleshooting

* **API key missing**: Ensure you have created the `.env` file and added `OPENAI_API_KEY`.
* **Invalid API key**: Check if your OpenAI API key is correct and active.
* **Module not found**: Ensure your virtual environment is activated and you ran `pip install -r requirements.txt`.
* **Port already in use**: If port 8000 is occupied, you can run uvicorn on a different port: `uvicorn main:app --reload --port 8080`.
* **OpenAI API error / Network failure**: The frontend will display a red error message. Check your internet connection and OpenAI platform account balance.
* **Empty message**: The backend will reject empty strings with a `400 Bad Request`.
