# Background & Motivation
The objective is to build a Python Command-Line Interface (CLI) task manager with full test coverage, placed in the `./demo/` directory. The tool will provide a reliable, dependency-minimal way to manage tasks directly from the terminal.

# Scope & Impact
- **Location:** All source code and tests will reside in the `./demo/` directory.
- **Language/Frameworks:** Python 3 standard library (`argparse`, `json`, `datetime`) for the application logic. `pytest` for unit testing.
- **Features:** 
  - Add, List, Complete, Delete tasks.
  - Set and view due dates and priorities (Low, Medium, High).
  - Filter tasks by status (completed/pending) or priority.
  - Persistent storage via a JSON file (`./demo/tasks.json`).
- **Test Coverage:** Aim for 100% line coverage for the application logic.

# Proposed Solution
1.  **Core Task Model:** A `Task` class (or typed dictionary) to represent individual tasks with properties: `id`, `title`, `status`, `priority`, `due_date`, `created_at`.
2.  **Storage Engine:** A `TaskManager` class responsible for reading/writing to `tasks.json` and providing CRUD operations.
3.  **CLI Interface:** An `argparse`-based script (`task_cli.py`) that maps CLI arguments to `TaskManager` methods.
4.  **Testing Strategy:** `pytest` tests using mock files or a temporary directory for the JSON storage to isolate test environments. Tests will cover edge cases (e.g., invalid JSON, missing file, incorrect arguments).

# Alternatives Considered
-   Using `click` or `typer` instead of `argparse`: Decided against to minimize external dependencies, keeping the application as self-contained as possible.
-   Using `sqlite3` instead of JSON: Decided against for simplicity; JSON is sufficient for a basic task manager and easier to inspect manually.

# Implementation Plan
### Phase 1: Core Logic & Storage
-   Create `./demo/task_manager.py` implementing the `TaskManager` class.
-   Create `./demo/test_task_manager.py` with `pytest` covering all `TaskManager` methods (add, remove, update status, list, filter).

### Phase 2: CLI Interface
-   Create `./demo/task_cli.py` integrating `argparse` with `TaskManager`.
-   Create `./demo/test_task_cli.py` using `unittest.mock` to simulate command-line arguments and verify output/behavior.

### Phase 3: Verification & Coverage
-   Run `pytest --cov=demo demo/` to ensure 100% coverage. Refactor or add tests if coverage is insufficient.

# Verification
1.  Run `python -m pytest ./demo -v --cov=demo --cov-report=term-missing`.
2.  Manually execute CLI commands:
    - `python ./demo/task_cli.py add "Buy milk" --priority High`
    - `python ./demo/task_cli.py list --status pending`
    - `python ./demo/task_cli.py complete 1`

# Migration & Rollback
-   No existing data to migrate. If issues arise, the `./demo/` folder can be safely deleted or reverted using git.