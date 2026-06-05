# ZeroBudget

A zero-based budgeting app built with React. Every dollar of income is assigned to a category before the month starts — the "Left to Assign" balance must reach zero.

**Live:** https://hoover-digital-media.github.io/ZeroBudget/

Built as the capstone project for the **React Foundations** course on the [Hoover Digital Media Learning Platform](https://hoovermedia.visualstudio.com/Learning%20Platform).

---

## Features

**Income**
- Add multiple income sources with a name and amount
- Edit and delete individual sources
- Total income calculated automatically

**Categories**
- 8 preset categories on first load: Housing, Transportation, Food, Utilities, Clothing, Personal, Savings, Giving
- Rename, add, or delete any category
- Each card shows budgeted amount (editable inline), total spent, remaining, and a progress bar (green → yellow → red)

**Left to Assign**
- Always visible at the top of the page
- Calculated as total income minus sum of all budgeted category amounts
- Turns red when over-assigned, green when exactly zero

**Transactions**
- Quick-add inline on each category card (amount + description)
- Full transaction form with category dropdown, amount, description, and date
- Collapsible transaction list per category card
- Delete transactions (no edit — delete and re-add)

**Month Management**
- Defaults to current month on load
- Navigate forward and back with arrow buttons
- Each month stores income, budgets, and transactions independently
- Copy budget amounts from the previous month
- Reset the current month (with confirmation)

**Persistence**
- All data stored in localStorage, keyed by `zb-YYYY-MM`

---

## Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite |
| Language | JavaScript (no TypeScript) |
| Styling | Plain CSS (component-scoped) |
| State | `useState`, `useMemo`, `useCallback`, Context API |
| Custom Hooks | `useBudget`, `useLocalStorage` |
| Persistence | localStorage |
| Deployment | GitHub Pages via GitHub Actions |

---

## React Concepts (Course Curriculum)

| Concept | Where it appears |
|---|---|
| `useState` | Income inputs, category budgets, transaction forms |
| Controlled inputs | All forms throughout |
| Derived state / `useMemo` | Left to Assign total, spent totals, remaining per category |
| Lifting state up | Income and categories live at App level, passed down |
| Component composition | IncomeSection, CategoryCard, TransactionForm, TransactionList |
| Conditional rendering | Empty states, over-budget warnings, zero balance indicator |
| List rendering + keys | Category list, transaction list |
| Event handling | Add, delete, rename, collapse |
| `useEffect` + localStorage | Persistence and month keying |
| Custom hooks | `useBudget` — extracts all state and logic from App |
| Context API | `BudgetContext` — avoids deep prop drilling |

---

## Project Structure

```
src/
├── components/
│   ├── CategoryCard/
│   ├── IncomeSection/
│   ├── LeftToAssign/
│   ├── MonthNav/
│   ├── TransactionForm/
│   └── TransactionList/
├── context/
│   └── BudgetContext.jsx
├── hooks/
│   ├── useBudget.js
│   └── useLocalStorage.js
├── data/
│   └── defaults.js
└── App.jsx
```

---

## Getting Started

```bash
npm install
npm run dev
```

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds `dist/` and deploys to GitHub Pages. The Pages source is set to **GitHub Actions** in the repo settings.
