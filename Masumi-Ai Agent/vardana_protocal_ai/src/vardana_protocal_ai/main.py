#!/usr/bin/env python
import sys
import warnings

from datetime import datetime

from vardana_protocal_ai.crew import VardanaProtocalAi

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information


def run():
    """
    Run the crew to analyze and manage tree planting verification on Cardano blockchain.
    """
    inputs = {
        'project_context': {
            'name': 'Vardano Protocol',
            'description': 'Blockchain-based Payment for Ecosystem Services (PES) platform on Cardano',
            'goal': 'Verify and reward farmers for planting trees and capturing CO2',
        },
        'farmer_data': {
            # Example location in Niger
            'location': {'lat': -1.95, 'lon': 30.05},
            'land_size': 2.5,  # hectares
            'tree_type': 'Eucalyptus',
            'tree_count': 100,  # trees per hectare
        },
        'satellite_data': {
            'ndvi_value': 0.82,
            'timestamp': str(datetime.now().isoformat()),
            'image_url': 'https://example.com/satellite/image.png',
        },
        'carbon_metrics': {
            'estimated_co2_per_tree': 0.048,  # tons per year
            'token_rate': 6.0,  # USD per ton of CO2
            'min_threshold': 1.0,  # minimum CO2 tons for token minting
        },
        'blockchain_config': {
            'network': 'testnet',
            'token_name': 'COTREE',
            'smart_contract_address': 'addr_test1...',
        },
        'current_year': str(datetime.now().year),
        'topic': 'Tree planting and CO2 verification using blockchain',  # ✅ Add this line

    }

    try:
        result = VardanaProtocalAi().crew().kickoff(inputs=inputs)
        print("\nCrew Analysis Results:")
        print("---------------------")
        print(result)
        return result
    except Exception as e:
        print("Error", e)
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew on tree planting verification scenarios.
    """
    inputs = {
        "topic": "Tree Planting Verification and Carbon Credit Generation",
        "focus_areas": [
            "Satellite data analysis for tree growth",
            "CO2 absorption calculation",
            "Carbon credit tokenization",
            "Farmer engagement and rewards"
        ],
        "success_metrics": [
            "Accurate tree count verification",
            "Reliable CO2 absorption estimates",
            "Transparent token distribution",
            "Farmer satisfaction and retention"
        ]
    }
    try:
        VardanaProtocalAi().crew().train(n_iterations=int(
            sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")


def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        VardanaProtocalAi().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")


def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs",
        "current_year": str(datetime.now().year)
    }
    try:
        VardanaProtocalAi().crew().test(n_iterations=int(
            sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "api":
        import uvicorn
        from vardana_protocal_ai.api import app
        print("Starting Vardano Protocol API server...")
        uvicorn.run(app, host="0.0.0.0", port=8000)
    else:
        run()
