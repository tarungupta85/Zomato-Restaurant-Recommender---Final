# Use a lightweight official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code and dataset into the container
COPY src/ ./src/
COPY data/ ./data/

# Expose the default port (FastAPI standard)
EXPOSE 8000

# Start uvicorn with shell form to support dynamic PORT environment variable on Railway
CMD uvicorn src.main:app --host 0.0.0.0 --port ${PORT:-8000}
