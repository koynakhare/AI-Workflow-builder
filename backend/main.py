from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineRequest(BaseModel):
    nodes: List[Any]
    edges: List[Any]

def is_dag(nodes: List[Any], edges: List[Any]) -> bool:
    adjacency = {node["id"]: [] for node in nodes}

    for edge in edges:
        source = edge.get("source")
        if source in adjacency:
            adjacency[source].append(edge.get("target"))

    visited = set()
    rec_stack = set()

    def has_cycle(node: str) -> bool:
        visited.add(node)
        rec_stack.add(node)
        for neighbor in adjacency.get(node, []):
            if neighbor not in visited and has_cycle(neighbor):
                return True
            if neighbor in rec_stack:
                return True
        rec_stack.discard(node)
        return False

    return not any(
        has_cycle(node)
        for node in adjacency
        if node not in visited
    )

@app.get("/")
def read_root():
    return {"Ping": "Pong"}

@app.post("/pipelines/parse")
def parse_pipeline(pipeline: PipelineRequest):
    return {
        "num_nodes": len(pipeline.nodes),
        "num_edges": len(pipeline.edges),
        "is_dag": is_dag(pipeline.nodes, pipeline.edges),
    }