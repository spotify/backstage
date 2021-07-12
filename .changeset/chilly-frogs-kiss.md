---
'@backstage/plugin-catalog-backend': patch
---

Support filtering entities via property existence. For example you can now query with `/entities?filter=metadata.annotations.blah` to fetch all entities that has the particular property defined.
