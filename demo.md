# Gemini CLI Demo: The "Blind Research" Protocol

This document explains the structured, bias-free development protocol currently active in this workspace. 

## 🛡️ The Goal: Zero-Bias Development
Most AI agents jump into "solution mode" the moment you tell them a goal. This leads to hallucinations and architectural opinions that ignore your existing codebase's reality. 

Our protocol solves this by separating **Intent** from **Fact-Finding**.

---

## ⚡ The 8-Phase Lifecycle

### PHASE 1: DISCOVERY & SCOPING (The Supervisor)
*   **What happens:** We discuss your goal. I (the Supervisor) use the `ask_user` tool to gather structured requirements.
*   **Artifact:** `plans/00_REQUIREMENTS.md` (The "What").

### PHASE 2: BLIND RESEARCH BRIEFING (The Supervisor)
*   **What happens:** I translate your Requirements into **factual, context-free technical questions**. 
*   **The Secret Sauce:** I **NEVER** tell the Researcher what we are building. I only ask what *is* currently in the code.

### PHASE 3: FACTUAL RESEARCH (The Scout / Codebase-Analyzer)
*   **What happens:** A specialized agent (the "Factual Cartographer") maps the existing codebase.
*   **Constraint:** It has no knowledge of the final goal, so it provides a raw, objective map with file:line references.
*   **Artifact:** `plans/01_RESEARCH_REPORT.md` (The "Truth").

### PHASE 4: DESIGN (The Architect)
*   **What happens:** The Architect finally sees BOTH the Requirements and the Research Report. It synthesizes them into a high-level solution.
*   **Artifact:** `plans/02_DESIGN.md`.

### PHASE 5: STRUCTURE & PLANNING (The Architect)
*   **What happens:** The Architect creates the directory structure, empty file skeletons, and a step-by-step task list.
*   **Artifact:** `plans/03_IMPLEMENTATION_PLAN.md`.

### PHASE 6: WORKTREE & HUMAN REVIEW GATE (🛑 STOP)
*   **What happens:** I create an isolated branch/worktree and **STOP**. You must approve the plan before a single line of code is changed.

### PHASE 7: IMPLEMENTATION LOOP (Engineer ⇄ Auditor)
*   **What happens:** The Engineer implements tasks one by one. The Auditor verifies them with tests and SOLID checks. I (the Supervisor) ask for your approval before every single `git commit`.

### PHASE 8: PULL REQUEST (The Supervisor)
*   **What happens:** The feature is pushed and a PR is generated.

---

## 🚀 Demo: "Delete Workstations" Feature

To see this in action, we are starting with **Phase 1: Discovery**.

### Next Steps for the User:
1.  Answer the discovery questions I am about to ask.
2.  Watch as I generate the `plans/00_REQUIREMENTS.md` file.
3.  Observe how the "Research Brief" I send to the Scout is purely technical and contains no mention of the "Delete" feature.
