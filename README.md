## About
This is a website for meteorology enthusiast monitoring & comparing daily average & seasonal changing! 

## How to deploy
Prerequisite: python3.10, pip, git. Tested on Windows 11.
Recommended to have conda installed, for easier environment management.
```bash
git clone https://github.com/lucky0218/meteo.git
git checkout -b your_branch
pip install uv
uv venv venv
venv\Scripts\activate
uv pip install .
cd src
python -m show.app
```
Check `localhost:5000` to see the website.