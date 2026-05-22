import sqlite3
import shutil
import json

def clean_and_dump():
    # 1. Copy the db to avoid modifying original local dev.db
    shutil.copyfile('prisma/dev.db', 'prisma/dev_d1.db')
    print("Copied dev.db to dev_d1.db for D1-specific preparation.")
    
    conn = sqlite3.connect('prisma/dev_d1.db')
    c = conn.cursor()
    
    # 2. Clean large binary blobs in Media, User, BlogPost, Therapist
    # We will nullify any blob larger than 50KB to fit D1 100KB statement limits comfortably
    c.execute("UPDATE Media SET bytes = NULL WHERE length(bytes) > 50000")
    print(f"Cleaned {c.rowcount} rows in Media table (bytes column).")
    
    c.execute("UPDATE User SET image = NULL WHERE length(image) > 50000")
    print(f"Cleaned {c.rowcount} rows in User table (image column).")
    
    c.execute("UPDATE BlogPost SET \"thumbnailImage\" = NULL WHERE length(\"thumbnailImage\") > 50000")
    c.execute("UPDATE BlogPost SET \"ogImage\" = NULL WHERE length(\"ogImage\") > 50000")
    print("Cleaned large images in BlogPost table.")
    
    c.execute("UPDATE Therapist SET image = NULL WHERE length(image) > 50000")
    print(f"Cleaned {c.rowcount} rows in Therapist table (image column).")
    
    # 3. Clean large base64 embedded images inside BlogPost.content
    c.execute("SELECT id, title, content FROM BlogPost")
    posts = c.fetchall()
    
    for post_id, title, content in posts:
        if not content:
            continue
        try:
            data = json.loads(content)
            modified = False
            for idx, module in enumerate(data):
                m_props = module.get('props', {})
                for k, v in m_props.items():
                    if isinstance(v, str) and len(v) > 30000 and v.startswith('data:'):
                        print(f"Post '{title}': replacing base64 image in module {idx} ({module.get('type')}), size {len(v)} chars")
                        m_props[k] = "/images/simple-hero/img-blog.png"
                        modified = True
            
            if modified:
                new_content = json.dumps(data)
                c.execute("UPDATE BlogPost SET content = ? WHERE id = ?", (new_content, post_id))
        except Exception as e:
            print(f"Skipping content parsing for post '{title}': {e}")
            
    conn.commit()
    print("Database cleaning complete and committed.")
    
    # 4. Dump the cleaned DB to dump_d1.sql
    out_path = 'prisma/dump_d1.sql'
    with open(out_path, 'w', encoding='utf-8') as f:
        for line in conn.iterdump():
            trimmed = line.strip()
            if trimmed.startswith('PRAGMA '):
                continue
            if trimmed in ('BEGIN TRANSACTION;', 'COMMIT;', 'ROLLBACK;'):
                continue
            if 'sqlite_sequence' in trimmed:
                continue
            
            f.write(line + '\n')
            
    conn.close()
    print(f"Successfully dumped D1-compatible DB to {out_path}")

if __name__ == '__main__':
    clean_and_dump()
