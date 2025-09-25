# 문제 목록
```dataview
TABLE without id 
	prob_id AS "Index", file.link AS "문제", tier AS "난이도"
FROM ""
WHERE file.folder = this.file.folder
  AND !regexmatch("^@", file.name)
SORT created_date DESC
LIMIT 5

```


### Task
---
- [x] 레거시 PS 문서 5개 양식 맞춰서 변동시켜주기 (1)  [completion:: 2025-01-27]
- [x] 레거시 PS 문서 5개 양식 맞춰서 변동시켜주기 (2)  [completion:: 2025-01-28]
- [x] PS 문서 티어 조정  [completion:: 2025-01-30]