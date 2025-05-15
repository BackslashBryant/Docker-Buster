<!--
Purpose: Contribution guide for Docker Buster
How to use: Follow these guidelines for setup, branching, commits, and PRs. Update as team practices evolve.
Last updated: 2024-06-09
-->
# Contributing to Docker Buster

## 🛠 Setup

- Clone the repo and follow the setup instructions in the [README](README.md).
- Use Python virtual environments for the backend.
- Use Node.js and `pnpm` or `npm` for the frontend.
- Ensure both the backend and frontend start without errors.

## 🌿 Branching Strategy

- `main`: stable, production-ready code
- `feat/<short-description>`: for new features
- `fix/<short-description>`: for bug fixes
- `refactor/<short-description>`: for structural code changes
- `test/<short-description>`: for testing-related updates
- Use kebab-case (not camelCase or snake_case) for `<short-description>`

## ✍️ Commit Style

- Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- Examples:
  - `feat(report): add license compliance indicator`
  - `fix(api): resolve 500 error on image scan`
  - `refactor(ui): simplify metrics card layout`

## ✅ Pull Request Checklist

Before submitting a PR, ensure you:

- [ ] Code builds and passes linting/tests
- [ ] PR description clearly explains context and changes
- [ ] Link the PR to relevant ticket(s) in [`tickets.md`](tickets.md)
- [ ] Add/update documentation if behavior or APIs changed
- [ ] All backend tests pass (`pytest` or CI run as defined)
- [ ] UI changes are accessible and visually consistent

---

_If in doubt, keep it simple, keep it clean, and ask for a review._
