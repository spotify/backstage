---
'@backstage/ui': patch
---

Fixed `useTable` in complete mode showing an empty page labelled "NaN - NaN of N" when `paginationOptions` switched from `type: 'none'` to paged pagination after mount.
