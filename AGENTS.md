# AGENTS.md

## Cursor Cloud specific instructions

This is a simple single-service **Streamlit GDP Dashboard** app (Python). No external databases, queues, or microservices are needed.

### Running the app

```bash
streamlit run streamlit_app.py --server.headless true --server.port 8501
```

The app will be available at `http://localhost:8501`. The health endpoint is at `/_stcore/health`.

### Dependencies

Only `streamlit` and `pandas` are required (see `requirements.txt`). Install with:

```bash
pip install -r requirements.txt
```

### Lint / Test / Build

This project has no dedicated linting, testing, or build tooling configured. To verify correctness:

- Syntax check: `python3 -m py_compile streamlit_app.py`
- Run app and confirm health: `curl http://localhost:8501/_stcore/health` returns `ok`

### Notes

- The app reads GDP data from `data/gdp_data.csv` (static file, no external data source needed).
- Python 3.11+ is required (3.12 works fine).
- No environment variables or secrets are needed to run the app.
