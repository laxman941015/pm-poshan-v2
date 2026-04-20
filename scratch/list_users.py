import psycopg2
import os

try:
    conn = psycopg2.connect(
        dbname="pmposhan",
        user="postgres",
        password="Ayush@202325",
        host="localhost",
        port="5434"
    )
    cur = conn.cursor()
    cur.execute("SELECT email FROM profiles")
    rows = cur.fetchall()
    for row in rows:
        print(row[0])
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
