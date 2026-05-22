import sqlite3
import json
import re

def inspect_post():
    conn = sqlite3.connect('prisma/dev.db')
    c = conn.cursor()
    c.execute('SELECT title, content FROM BlogPost WHERE id="cmp5kjqhs00035m0k50a9cf4r"')
    row = c.fetchone()
    if not row:
        print("Post not found")
        return
        
    title, content = row
    print(f"Post Title: {title}")
    print(f"Content Length: {len(content)}")
    
    # Try parsing as JSON
    try:
        data = json.loads(content)
        print("Successfully parsed content as JSON.")
        
        # Check modules inside
        for idx, module in enumerate(data):
            m_type = module.get('type')
            m_props = module.get('props', {})
            print(f"Module {idx}: Type={m_type}")
            # Find any large values in props
            for k, v in m_props.items():
                if isinstance(v, str) and len(v) > 10000:
                    print(f"  Prop '{k}' is extremely large (length: {len(v)})")
                    if v.startswith('data:'):
                        print(f"  Prop '{k}' is a data URL / Base64 image!")
                    else:
                        print(f"  Prop '{k}' starts with: {v[:100]}")
    except Exception as e:
        print(f"Failed to parse content as JSON: {e}")

if __name__ == '__main__':
    inspect_post()
