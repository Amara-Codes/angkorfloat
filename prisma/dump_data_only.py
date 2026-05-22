import sqlite3

def dump_data_only():
    conn = sqlite3.connect('prisma/dev_d1.db')
    out_path = 'prisma/data_only_dump.sql'
    
    with open(out_path, 'w', encoding='utf-8') as f:
        # Disable foreign key checks for the duration of the data import
        f.write('PRAGMA foreign_keys = OFF;\n')
        
        for line in conn.iterdump():
            trimmed = line.strip()
            
            # We ONLY want the INSERT INTO statements and skip _prisma_migrations table inserts
            if trimmed.startswith('INSERT INTO ') and '_prisma_migrations' not in trimmed:
                # Replace double quotes or any sqlite specific syntax if necessary,
                # but standard sqlite iterdump insert lines are perfectly compatible with D1.
                f.write(line + '\n')
                
        # Re-enable foreign key checks at the end
        f.write('PRAGMA foreign_keys = ON;\n')
        
    conn.close()
    print(f"Successfully generated data-only SQL dump: {out_path}")

if __name__ == '__main__':
    dump_data_only()
