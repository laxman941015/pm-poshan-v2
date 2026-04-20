import psycopg2
import sys

# Ensure UTF-8 output for Marathi characters
sys.stdout.reconfigure(encoding='utf-8')

try:
    conn = psycopg2.connect(
        dbname="pmposhan",
        user="postgres",
        password="Ayush@202325",
        host="localhost",
        port="5434"
    )
    cur = conn.cursor()
    cur.execute("SELECT item_name, current_balance, standard_group FROM inventory_stock WHERE teacher_id = (SELECT id FROM profiles WHERE email = 'laxman@gmail.com')")
    rows = cur.fetchall()
    for row in rows:
        print(f"{row[0]}: {row[1]} ({row[2]})")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
