import psycopg2

new_hash = "$pbkdf2-sha256$29000$3vtfS6k1JmSsde59z1lrTQ$irPOGy8vIRzT/Gsd1vvZeAU3xkjQtxFsjJ/XQOvJGjY"

try:
    conn = psycopg2.connect(
        dbname="pmposhan",
        user="postgres",
        password="Ayush@202325",
        host="localhost",
        port="5434"
    )
    cur = conn.cursor()
    cur.execute("UPDATE profiles SET hashed_password = %s WHERE email IN ('laxman@gmail.com', 'master@pmposhan.gov.in')", (new_hash,))
    conn.commit()
    print("Passwords for both accounts updated to 'admin123'")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
