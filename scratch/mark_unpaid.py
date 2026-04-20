import psycopg2

try:
    conn = psycopg2.connect(
        dbname='pmposhan',
        user='postgres',
        password='Ayush@202325',
        host='localhost',
        port='5434'
    )
    cur = conn.cursor()
    cur.execute("UPDATE profiles SET saas_payment_status = 'unpaid', saas_expiry_date = NULL WHERE email = 'laxman@gmail.com'")
    conn.commit()
    print("User laxman@gmail.com has been marked as unpaid.")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
