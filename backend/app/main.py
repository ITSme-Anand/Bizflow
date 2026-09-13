from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import dashboard, sales, expenses, inventory, analysis

app = FastAPI(
    title="Bizflow API",
    description="Smart business management backend",
    version="1.0.0",
)

# CORS — allow the React dev server and any deployed frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000","https://bizflow-mu-dun.vercel.app" "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])
app.include_router(sales.router, prefix="/api", tags=["Sales"])
app.include_router(expenses.router, prefix="/api", tags=["Expenses"])
app.include_router(inventory.router, prefix="/api", tags=["Inventory"])
app.include_router(analysis.router, prefix="/api", tags=["Analysis"])


@app.get("/")
async def root():
    return {"message": "Bizflow API is running"}
