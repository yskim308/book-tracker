import json  # For parsing gcloud output if needed
import os
import subprocess

from dotenv import dotenv_values  # pip install python-dotenv


def upload_env_via_gcloud_cli(project_id, env_file_path=".env"):
    """
    Reads an .env file and uploads each key-value pair as a secret
    to Google Cloud Secret Manager using the gcloud CLI.
    """
    config = dotenv_values(env_file_path)

    # Ensure gcloud is configured for the right project
    # This might not be strictly necessary if gcloud init was run correctly,
    # but good for explicit control in a script.
    subprocess.run(["gcloud", "config", "set", "project", project_id], check=True)

    for key, value in config.items():
        secret_id = key.replace('.', '_').replace('-', '_').upper() # Sanitize for secret name conventions
        print(f"Processing secret: {secret_id}")

        try:
            # Check if secret exists (optional, but good for idempotency)
            # This is more robust than catching an error on create
            check_cmd = ["gcloud", "secrets", "describe", secret_id, "--format=json", "--project", project_id]
            result = subprocess.run(check_cmd, capture_output=True, text=True, check=False)

            secret_exists = result.returncode == 0

            if not secret_exists:
                # Create the secret if it doesn't exist
                create_cmd = [
                    "gcloud", "secrets", "create", secret_id,
                    "--replication-policy=automatic",
                    "--data-file=-",
                    "--project", project_id # Explicitly specify project
                ]
                print(f"Creating secret {secret_id}...")
                subprocess.run(create_cmd, input=value, text=True, check=True)
                print(f"Secret {secret_id} created.")
            else:
                print(f"Secret {secret_id} already exists. Adding new version.")

            # Add a new version with the value
            add_version_cmd = [
                "gcloud", "secrets", "versions", "add", secret_id,
                "--data-file=-",
                "--project", project_id # Explicitly specify project
            ]
            subprocess.run(add_version_cmd, input=value, text=True, check=True)
            print(f"Added new version for secret {secret_id}.")

        except subprocess.CalledProcessError as e:
            print(f"Error processing secret {secret_id}: {e}")
            print(f"Stderr: {e.stderr}")
            print(f"Stdout: {e.stdout}")
        except Exception as e:
            print(f"An unexpected error occurred for secret {secret_id}: {e}")


if __name__ == "__main__":
    # You MUST set this environment variable or replace it directly
    # For example: GCP_PROJECT_ID = "your-actual-project-id"
    GCP_PROJECT_ID = os.getenv("GCP_PROJECT_ID")
    
    if not GCP_PROJECT_ID:
        print("Please set the GCP_PROJECT_ID environment variable (e.g., export GCP_PROJECT_ID=your-project-id).")
        exit(1)

    ENV_FILE = ".env.local"

    if not os.path.exists(ENV_FILE):
        print(f"Error: {ENV_FILE} not found.")
        exit(1)

    upload_env_via_gcloud_cli(GCP_PROJECT_ID, ENV_FILE)
    print("Secret upload process complete using gcloud CLI commands.")
