## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `graphify update .` to keep the graph current (graphify is installed via pipx as `graphifyy`, exposing the `graphify` CLI on PATH; the old `python3 -c "from graphify.watch import _rebuild_code ..."` form fails because the module isn't on the system Python path)
