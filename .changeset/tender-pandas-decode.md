---
'@backstage/plugin-scaffolder': patch
---

Fixed non-ASCII characters being corrupted in Template Editor dry-run results. Emoji, accented letters and other multi-byte characters are now shown correctly in the file preview and kept intact in the downloaded ZIP, instead of appearing as garbled text.
