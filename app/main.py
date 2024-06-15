import os.path
from io import BytesIO

from fastapi import FastAPI, UploadFile
from starlette.requests import Request
from starlette.responses import StreamingResponse, HTMLResponse
from starlette.staticfiles import StaticFiles
from starlette.templating import Jinja2Templates

current_dir = os.path.dirname(__file__)

app = FastAPI()
app.mount("/static", StaticFiles(directory=f"{current_dir}/static"), name="static")
templates = Jinja2Templates(directory=f"{current_dir}/templates")


@app.get("/", response_class=HTMLResponse)
def copy_file_form(request: Request):
    return templates.TemplateResponse(request, name="index.html", context={})


@app.post("/copy_file/")
async def copy_file(file: UploadFile):
    return StreamingResponse(
        content=BytesIO(await file.read(-1)),
        status_code=200,
        headers={"content-disposition": f"attachment; filename={file.filename}"},
    )
