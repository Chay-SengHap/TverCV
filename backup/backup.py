import os
import subprocess
from datetime import datetime

# -------------------------------------------------------------------
# Aiven MySQL Connection Information
# -------------------------------------------------------------------

import os

DB_HOST = os.environ["DB_HOST"]
DB_PORT = os.environ["DB_PORT"]
DB_USER = os.environ["DB_USER"]
DB_PASSWORD = os.environ["DB_PASSWORD"]
DB_NAME = os.environ["DB_NAME"]

OUTPUT_DIR = OUTPUT_DIR = "./backup"


def backup_database(host, port, user, password, db_name, output_file):

    command = [
        "mysqldump",
        f"--host={host}",
        f"--port={port}",
        f"--user={user}",
        f"--password={password}",
        "--ssl-mode=REQUIRED",
        "--single-transaction",
        "--set-gtid-purged=OFF",
        "--no-tablespaces",
        db_name,
        f"--result-file={output_file}",
    ]

    print("Running backup...")
    print([c if not c.startswith("--password=") else "--password=****" for c in command])

    result = subprocess.run(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    if result.returncode == 0:
        print("\nBackup completed successfully.")
        print(f"Backup saved to:\n{output_file}")
    else:
        print("\nBackup failed!")
        print(result.stderr)
        raise RuntimeError(result.stderr)


if __name__ == "__main__":

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    output_file = os.path.join(
        OUTPUT_DIR,
        f"{DB_NAME}_backup_{timestamp}.sql"
    )

    backup_database(
        DB_HOST,
        DB_PORT,
        DB_USER,
        DB_PASSWORD,
        DB_NAME,
        output_file
    )