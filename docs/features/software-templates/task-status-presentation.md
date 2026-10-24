---
id: task-status-presentation
title: Presenting task status in the task list
---

The new frontend system supports an optional `ScaffolderTaskStatusBlueprint`
from `@backstage/plugin-scaffolder-react/alpha`. Register one extension in a
frontend module for the `scaffolder` plugin. Its component receives the full
`task` returned by the task-list API and `children`, containing the native status
presentation. Return `children` for tasks that your component does not handle.

```tsx
ScaffolderTaskStatusBlueprint.make({
  params: {
    component: ({ task, children }) => (
      <span title={`Task ${task.id}`}>{children}</span>
    ),
  },
});
```

This extension changes presentation only. It does not introduce a paused state,
change task permissions, replace the task list, or change filtering, pagination,
sorting or the underlying execution status. It does not automatically fetch
additional events. Applications that need more context are responsible for
retrieving it through authorized APIs and retaining the native fallback when
that context cannot be verified. Do not conceal unexpected execution failures.
