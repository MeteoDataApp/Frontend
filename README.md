## About
This is a website for meteorology enthusiast monitoring & comparing daily average & seasonal changing! 

## How to deploy
Prerequisite: python3.10, pip, git. Tested on Windows 11.
Recommended to have conda installed, for easier environment management.
```bash
git clone https://github.com/lucky0218/meteo.git
git checkout -b your_branch
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
python show/app.py
```
Check `localhost:5000` to see the website.