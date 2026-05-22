import subprocess
import os
import sqlite3
import sys

def sync_remote_db():
    db_name = "angkorfloat-db"
    sql_dump_path = "prisma/remote_dump.sql"
    local_db_path = "prisma/dev.db"

    print("=== STARTING CLOUDFLARE D1 REMOTE DATABASE SYNC ===")
    
    # 1. Export remote D1 database to a SQL dump file
    print(f"1. Exporting remote D1 database '{db_name}' to {sql_dump_path}...")
    try:
        # Run wrangler export using npx
        cmd = ["npx", "wrangler", "d1", "export", db_name, "--remote", f"--output={sql_dump_path}"]
        # On Windows, shell=True is often safer/necessary for npx commands in subprocess
        result = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print("✓ Remote database exported successfully.")
    except subprocess.CalledProcessError as e:
        print("✗ Error exporting remote database from Cloudflare:", file=sys.stderr)
        print(e.stderr, file=sys.stderr)
        sys.exit(1)

    # 2. Verify SQL dump file exists and is not empty
    if not os.path.exists(sql_dump_path) or os.path.getsize(sql_dump_path) == 0:
        print(f"✗ SQL dump file {sql_dump_path} is empty or does not exist.", file=sys.stderr)
        sys.exit(1)

    # 3. Safely delete existing local dev.db database to avoid unique constraints/collisions
    print(f"2. Cleaning up local database files at {local_db_path}...")
    try:
        if os.path.exists(local_db_path):
            os.remove(local_db_path)
            print(f"✓ Removed old {local_db_path}")
        
        # Also clean SQLite journal files if they exist
        journal_path = f"{local_db_path}-journal"
        if os.path.exists(journal_path):
            os.remove(journal_path)
            print(f"✓ Removed old {journal_path}")
    except Exception as e:
        print(f"✗ Failed to delete local database files: {e}", file=sys.stderr)
        sys.exit(1)

    # 4. Import the SQL dump into the fresh local dev.db file
    print(f"3. Importing SQL dump into new local {local_db_path}...")
    try:
        conn = sqlite3.connect(local_db_path)
        cursor = conn.cursor()
        
        with open(sql_dump_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()
            
        # Execute the full SQLite dump script
        cursor.executescript(sql_script)
        conn.commit()
        conn.close()
        print("✓ Local database populated successfully with remote D1 data!")
    except Exception as e:
        print(f"✗ Failed to import SQL dump into local SQLite database: {e}", file=sys.stderr)
        sys.exit(1)

    # 5. Clean up the temporary dump file
    try:
        if os.path.exists(sql_dump_path):
            os.remove(sql_dump_path)
            print(f"✓ Cleaned up temporary dump file {sql_dump_path}")
    except Exception as e:
        print(f"✓ (Note) Could not clean up temporary dump file: {e}")

    print("\n=== SYNC COMPLETED SUCCESSFULLY ===")
    print("Your local Next.js development server is now running with live production D1 data!")

if __name__ == '__main__':
    sync_remote_db()
