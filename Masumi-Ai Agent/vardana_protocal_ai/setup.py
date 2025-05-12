from setuptools import setup, find_packages

setup(
    name="vardana_protocal_ai",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "fastapi",
        "uvicorn",
        "python-dotenv",
        "crewai",
        "masumi-crewai",
        "aiohttp",
        "pydantic"
    ],
)
