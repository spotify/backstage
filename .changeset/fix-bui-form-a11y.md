---
'@backstage/plugin-scaffolder-react': patch
---

Added missing accessibility attributes to BUI form templates. `FieldErrorTemplate` now includes `role="alert"` and `aria-live="polite"` so screen readers announce inline errors upon validation. `ArrayFieldItemTemplate` now incorporates contextual item titles into button aria-labels (`"Move up <itemTitle>"`, `"Remove <itemTitle>"`, `"Duplicate <itemTitle>"`, `"Expand/Collapse <itemTitle>"`) to prevent repetitive and ambiguous announcements.
