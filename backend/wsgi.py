## Entry point for Flask App

from App import init_app
from dotenv import load_dotenv
import os

load_dotenv()

app = init_app()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        debug=True,
        port=os.environ.get("PORT")
    )