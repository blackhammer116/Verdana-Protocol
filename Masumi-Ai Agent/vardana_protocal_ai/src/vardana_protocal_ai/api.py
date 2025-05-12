import os
import sys
import uuid
import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, Query, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
from datetime import datetime, timezone
from masumi_crewai.config import Config
from masumi_crewai.payment import Payment, Amount

# Change the import to relative import
from .crew import VardanaProtocalAi

app = FastAPI(title="Vardana Protocol API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory task storage (replace with database in production)
tasks_db = {}

# Validation models


class CrewRunRequest(BaseModel):
    project_context: Dict[str, str]
    farmer_data: Dict[str, Any]
    satellite_data: Dict[str, Any]
    carbon_metrics: Dict[str, float]
    blockchain_config: Dict[str, str]


@app.get("/")
async def root():
    return {"message": "Vardana Protocol API is running"}


@app.post("/api/run")
async def run_crew(request: CrewRunRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())

    # Format inputs for the crew
    inputs = {
        'project_context': request.project_context,
        'farmer_data': request.farmer_data,
        'satellite_data': request.satellite_data,
        'carbon_metrics': request.carbon_metrics,
        'blockchain_config': request.blockchain_config,
        'current_year': str(datetime.now().year),
        'topic': 'Tree planting and CO2 verification using blockchain',
    }

    # Store task info
    tasks_db[task_id] = {
        "task_id": task_id,
        "status": "pending",
        "created_at": datetime.now().isoformat(),
        "inputs": inputs,
        "result": None
    }

    # Run the crew in the background
    background_tasks.add_task(process_crew_task, task_id, inputs)

    return {"task_id": task_id, "status": "processing"}


def process_crew_task(task_id: str, inputs: Dict):
    """Process the crew task in the background"""
    tasks_db[task_id]["status"] = "processing"

    try:
        # Run the crew
        result = VardanaProtocalAi().crew().kickoff(inputs=inputs)

        # Update task status and store result
        tasks_db[task_id]["status"] = "completed"
        tasks_db[task_id]["result"] = result
        tasks_db[task_id]["completed_at"] = datetime.now().isoformat()

    except Exception as e:
        # Handle errors
        tasks_db[task_id]["status"] = "failed"
        tasks_db[task_id]["error"] = str(e)
        tasks_db[task_id]["completed_at"] = datetime.now().isoformat()


@app.get("/api/tasks/{task_id}")
async def get_task_status(task_id: str):
    if task_id not in tasks_db:
        return {"error": "Task not found"}, 404

    return tasks_db[task_id]


@app.get("/api/tasks")
async def list_tasks():
    return list(tasks_db.values())

# Add this to your main.py to run the API
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
# masumi AI
# load_dotenv()

# # Initialize FastAPI
# app = FastAPI(title="Vardano Protocol AI API")

# # Get environment variables
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# PAYMENT_SERVICE_URL = os.getenv("PAYMENT_SERVICE_URL")
# PAYMENT_API_KEY = os.getenv("PAYMENT_API_KEY")
# AGENT_IDENTIFIER = os.getenv("AGENT_IDENTIFIER", "your_agent_identifier")

# # Initialize storage
# jobs = {}
# payment_instances = {}

# # Initialize Masumi config
# config = Config(
#     payment_service_url=PAYMENT_SERVICE_URL,
#     payment_api_key=PAYMENT_API_KEY
# )


# class StartJobRequest(BaseModel):
#     """Request model for starting a new job"""
#     project_context: dict
#     farmer_data: dict
#     satellite_data: dict
#     carbon_metrics: dict
#     blockchain_config: dict


# async def execute_crew_task(input_data: dict) -> str:
#     """Execute CrewAI task with Vardano Protocol agents"""
#     crew = VardanaProtocalAi()
#     result = crew.crew().kickoff(inputs=input_data)
#     return result


# @app.post("/start_job")
# async def start_job(data: StartJobRequest):
#     """Start a new verification job with payment"""
#     job_id = str(uuid.uuid4())

#     # Set payment amount (2 ADA for verification)
#     amounts = [Amount(amount="2000000", unit="lovelace")]

#     # Create payment request
#     payment = Payment(
#         agent_identifier=AGENT_IDENTIFIER,
#         amounts=amounts,
#         config=config,
#         identifier_from_purchaser=job_id
#     )

#     payment_request = await payment.create_payment_request()
#     payment_id = payment_request["data"]["blockchainIdentifier"]
#     payment.payment_ids.add(payment_id)

#     # Store job info
#     jobs[job_id] = {
#         "status": "awaiting_payment",
#         "payment_status": "pending",
#         "payment_id": payment_id,
#         "input_data": data.dict(),
#         "result": None,
#         "created_at": datetime.now(timezone.utc).isoformat()
#     }

#     async def payment_callback(payment_id: str):
#         await handle_payment_status(job_id, payment_id)

#     payment_instances[job_id] = payment
#     await payment.start_status_monitoring(payment_callback)

#     return {
#         "status": "success",
#         "job_id": job_id,
#         "blockchainIdentifier": payment_request["data"]["blockchainIdentifier"],
#         "submitResultTime": payment_request["data"]["submitResultTime"],
#         "unlockTime": payment_request["data"]["unlockTime"],
#         "externalDisputeUnlockTime": payment_request["data"]["externalDisputeUnlockTime"],
#         "agentIdentifier": AGENT_IDENTIFIER,
#         "amounts": amounts
#     }


# async def handle_payment_status(job_id: str, payment_id: str) -> None:
#     """Handle payment confirmation and execute verification"""
#     print(f"Processing job {job_id} after payment {payment_id}")

#     jobs[job_id]["status"] = "processing"

#     try:
#         # Execute verification with crew
#         result = await execute_crew_task(jobs[job_id]["input_data"])

#         # Hash the result for payment completion
#         result_hash = str(result)[:64]
#         await payment_instances[job_id].complete_payment(payment_id, result_hash)

#         # Update job status
#         jobs[job_id].update({
#             "status": "completed",
#             "payment_status": "completed",
#             "result": result,
#             "completed_at": datetime.now(timezone.utc).isoformat()
#         })
#     except Exception as e:
#         jobs[job_id]["status"] = "failed"
#         print(f"Job failed: {str(e)}")
#     finally:
#         if job_id in payment_instances:
#             payment_instances[job_id].stop_status_monitoring()
#             del payment_instances[job_id]


# @app.get("/status/{job_id}")
# async def get_status(job_id: str):
#     """Get job and payment status"""
#     if job_id not in jobs:
#         raise HTTPException(status_code=404, detail="Job not found")

#     job = jobs[job_id]
#     if job_id in payment_instances:
#         status = await payment_instances[job_id].check_payment_status()
#         job["payment_status"] = status.get("data", {}).get("status")

#     return job


# @app.get("/input_schema")
# async def input_schema():
#     """Get the expected input schema"""
#     return {
#         "input_data": [
#             {
#                 "project_context": {
#                     "name": "string",
#                     "description": "string",
#                     "goal": "string"
#                 },
#                 "farmer_data": {
#                     "location": {"lat": "float", "lon": "float"},
#                     "land_size": "float",
#                     "tree_type": "string",
#                     "tree_count": "integer"
#                 },
#                 "satellite_data": {
#                     "ndvi_value": "float",
#                     "timestamp": "string",
#                     "image_url": "string"
#                 }
#             }
#         ]
#     }


# @app.get("/availability")
# async def check_availability():
#     """Check if the service is available"""
#     return {
#         "status": "available",
#         "timestamp": datetime.now(timezone.utc).isoformat()
#     }
