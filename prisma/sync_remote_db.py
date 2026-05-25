import subprocess
import os
import sqlite3
import sys
import time
import threading

def format_size(num_bytes):
    """Format bytes into a human-readable string."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if num_bytes < 1024.0:
            return f"{num_bytes:.1f} {unit}"
        num_bytes /= 1024.0
    return f"{num_bytes:.1f} TB"

def print_ok(msg):
    try:
        sys.stdout.write(f"✓ {msg}\n")
        sys.stdout.flush()
    except UnicodeEncodeError:
        print(f"[OK] {msg}")

def print_err(msg):
    try:
        sys.stderr.write(f"✗ {msg}\n")
        sys.stderr.flush()
    except UnicodeEncodeError:
        print(f"[ERROR] {msg}", file=sys.stderr)

def print_info(msg):
    try:
        sys.stdout.write(f"ℹ {msg}\n")
        sys.stdout.flush()
    except UnicodeEncodeError:
        print(f"[INFO] {msg}")

def sync_remote_db():
    db_name = "angkorfloat-db"
    sql_dump_path = "prisma/remote_dump.sql"
    local_db_path = "prisma/dev.db"

    print("=== STARTING CLOUDFLARE D1 REMOTE DATABASE SYNC ===")
    
    # 1. Export remote D1 database to a SQL dump file
    print(f"1. Exporting remote D1 database '{db_name}' to {sql_dump_path}...")
    try:
        # Run wrangler export using npx (Wrangler requires --output path parameter)
        cmd = ["npx", "wrangler", "d1", "export", db_name, "--remote", f"--output={sql_dump_path}"]
        
        # Start the subprocess (specifying encoding='utf-8' prevents Windows decoding issues)
        process = subprocess.Popen(
            cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding='utf-8'
        )
        
        # Safe spinner fallback for terminals/shells that do not support Unicode
        try:
            "⠋".encode(sys.stdout.encoding or 'utf-8')
            spinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
        except UnicodeEncodeError:
            spinners = ["|", "/", "-", "\\"]
            
        spinner_idx = 0
        start_time = time.time()
        
        # Poll process until it completes, displaying a real-time progress spinner and timer
        while process.poll() is None:
            elapsed = time.time() - start_time
            
            # Note: Wrangler writes to the output SQL file only at the very end when the export completes.
            # Thus, we display a live running timer and status.
            sys.stdout.write(f"\r  {spinners[spinner_idx % len(spinners)]} Running Cloudflare D1 Export... [elapsed: {elapsed:.1f}s] [status: downloading tables...]")
            sys.stdout.flush()
            
            spinner_idx += 1
            time.sleep(0.1)
            
        # Clear the spinner line safely
        sys.stdout.write("\r" + " " * 95 + "\r")
        sys.stdout.flush()
        
        elapsed = time.time() - start_time
        stdout, stderr = process.communicate()
        
        if process.returncode != 0:
            raise subprocess.CalledProcessError(
                returncode=process.returncode,
                cmd=cmd,
                output=stdout,
                stderr=stderr
            )
            
        final_size = "0.0 B"
        if os.path.exists(sql_dump_path):
            try:
                final_size = format_size(os.path.getsize(sql_dump_path))
            except Exception:
                pass
                
        print_ok(f"Remote database exported successfully ({final_size} in {elapsed:.1f}s).")
    except subprocess.CalledProcessError as e:
        print_err("Error exporting remote database from Cloudflare:")
        if hasattr(e, 'stderr') and e.stderr:
            print(e.stderr, file=sys.stderr)
        elif hasattr(e, 'output') and e.output:
            print(e.output, file=sys.stderr)
        sys.exit(1)

    # 2. Verify SQL dump file exists and is not empty
    if not os.path.exists(sql_dump_path) or os.path.getsize(sql_dump_path) == 0:
        print_err(f"SQL dump file {sql_dump_path} is empty or does not exist.")
        sys.exit(1)

    # 3. Safely delete existing local dev.db database to avoid unique constraints/collisions
    print(f"2. Cleaning up local database files at {local_db_path}...")
    try:
        if os.path.exists(local_db_path):
            os.remove(local_db_path)
            print_ok(f"Removed old {local_db_path}")
        
        # Also clean SQLite journal files if they exist
        journal_path = f"{local_db_path}-journal"
        if os.path.exists(journal_path):
            os.remove(journal_path)
            print_ok(f"Removed old {journal_path}")
    except Exception as e:
        print_err(f"Failed to delete local database files: {e}")
        sys.exit(1)

    # 4. Import the SQL dump into the fresh local dev.db file
    print(f"3. Importing SQL dump into new local {local_db_path}...")
    try:
        with open(sql_dump_path, 'r', encoding='utf-8') as f:
            sql_script = f.read()
            
        import_error = None
        
        def import_task():
            nonlocal import_error
            try:
                conn = sqlite3.connect(local_db_path)
                cursor = conn.cursor()
                cursor.executescript(sql_script)
                conn.commit()
                conn.close()
            except Exception as e:
                import_error = e

        # Execute sqlite import in a separate thread so we can show real-time progress
        t = threading.Thread(target=import_task)
        t.start()
        
        # Safe spinner fallback for terminals/shells that do not support Unicode
        try:
            "⠋".encode(sys.stdout.encoding or 'utf-8')
            spinners = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
        except UnicodeEncodeError:
            spinners = ["|", "/", "-", "\\"]
            
        spinner_idx = 0
        start_time = time.time()
        
        while t.is_alive():
            elapsed = time.time() - start_time
            sys.stdout.write(f"\r  {spinners[spinner_idx % len(spinners)]} Importing SQL statements... [elapsed: {elapsed:.1f}s]")
            sys.stdout.flush()
            spinner_idx += 1
            time.sleep(0.1)
            
        t.join()
        
        # Clear the spinner line safely
        sys.stdout.write("\r" + " " * 80 + "\r")
        sys.stdout.flush()
        
        if import_error:
            raise import_error
            
        print_ok("Local database populated successfully with remote D1 data!")
    except Exception as e:
        print_err(f"Failed to import SQL dump into local SQLite database: {e}")
        sys.exit(1)

    # 5. Clean up the temporary dump file
    try:
        if os.path.exists(sql_dump_path):
            os.remove(sql_dump_path)
            print_ok(f"Cleaned up temporary dump file {sql_dump_path}")
    except Exception as e:
        print_ok(f"(Note) Could not clean up temporary dump file: {e}")

    print("\n=== SYNC COMPLETED SUCCESSFULLY ===")
    print("Your local Next.js development server is now running with live production D1 data!")

if __name__ == '__main__':
    sync_remote_db()
