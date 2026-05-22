import sqlite3

def dump_db():
    conn = sqlite3.connect('prisma/dev.db')
    out_path = 'prisma/dump.sql'
    
    with open(out_path, 'w', encoding='utf-8') as f:
        for line in conn.iterdump():
            # Clean up SQL for D1 compatibility
            trimmed = line.strip()
            if trimmed.startswith('PRAGMA '):
                continue
            if trimmed in ('BEGIN TRANSACTION;', 'COMMIT;', 'ROLLBACK;'):
                continue
            if 'sqlite_sequence' in trimmed:
                continue
            
            f.write(line + '\n')
            
    print("Successfully dumped sqlite db to prisma/dump.sql")

if __name__ == '__main__':
    dump_db()
