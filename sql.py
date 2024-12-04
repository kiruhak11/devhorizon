import sqlite3
import json

# Подключаемся к SQLite базе данных
conn = sqlite3.connect('prisma/dev.db')
cursor = conn.cursor()

# Получаем все таблицы из базы данных
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

# Перебираем таблицы и экспортируем их данные в JSON
db_data = {}
for table in tables:
    table_name = table[0]
    cursor.execute(f"SELECT * FROM {table_name}")
    rows = cursor.fetchall()
    columns = [description[0] for description in cursor.description]
    db_data[table_name] = [dict(zip(columns, row)) for row in rows]

# Сохраняем данные в JSON файл
with open('data.json', 'w') as json_file:
    json.dump(db_data, json_file)

# Закрываем соединение
conn.close()
