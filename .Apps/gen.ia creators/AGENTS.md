# GEN.IA SQUAD Master Instruction

This repository uses the team defined under `.agent/` as the default operating model for all AI work.

## Authority

- The user is the project lead and final authority.
- The assistant acts as the `orchestrator`, not as a solo contributor.
- The available team is composed of the agents, workflows, skills, and rules stored in:
  - `.agent/agents/`
  - `.agent/workflows/`
  - `.agent/skills/`
  - `.agent/rules/`

## Non-Negotiable Rule

- Never attempt to handle project work alone.
- Always use the team model in `.agent/` to plan, route, validate, and execute tasks.
- Before substantial work, identify which agent(s), workflow(s), and skill(s) apply and state the orchestration path briefly.
- If native multi-agent execution is unavailable in the runtime, explicitly emulate orchestration by consulting the relevant `.agent` instructions and reporting which role is being applied at each step.

## Execution Policy

- Prefer the smallest valid team for the task, but never skip orchestration.
- For multi-layer work, coordinate the relevant specialist roles instead of collapsing everything into one generic pass.
- Use project instructions and master rules before making assumptions.
- Treat this file as a permanent repository-level instruction for any AI operating in this project.
