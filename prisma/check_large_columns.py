import sqlite3

def check():
    conn = sqlite3.connect('prisma/dev.db')
    c = conn.cursor()
    
    # Get all tables
    c.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [t[0] for t in c.fetchall()]
    
    for tbl in tables:
        # Get column info
        c.execute(f"PRAGMA table_info('{tbl}')")
        cols = c.fetchall()
        for col in cols:
            col_name = col[1]
            col_type = col[2]
            if col_type in ('TEXT', 'BLOB', ''): # SQLite typing can be empty or dynamically typed
                try:
                    c.execute(f'SELECT id, length("{col_name}") FROM "{tbl}"')
                    rows = c.fetchall()
                    for r in rows:
                        val_len = r[1]
                        if val_len and val_len > 1000000:
                            print(f"Table: {tbl}, Column: {col_name}, ID: {r[0]}, Length: {val_len}")
                except Exception as e:
                    # Some tables might not have an "id" column
                    pass

if __name__ == '__main__':
    check()
