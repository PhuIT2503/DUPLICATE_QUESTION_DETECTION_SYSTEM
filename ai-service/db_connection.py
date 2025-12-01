import pyodbc

def get_db():
    try:
        conn = pyodbc.connect(
            "Driver={ODBC Driver 17 for SQL Server};"
            "Server=26.75.216.162,1433;"
            "Database=sql1;"
            "UID=sa;"
            "PWD=Abc12345689#@;"
            # "Server=localhost,1433;"
            # "Database=Test;"
            # "UID=sa;"
            # "PWD=Ab123456@;"
        )
        print("Kết nối thành công!")
        return conn
    except pyodbc.Error as e:
        print("Lỗi kết nối đến SQL Server:")
        print(e)
        return None