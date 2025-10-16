---
created_date:
  - 2025-10-16
tags:
  - cpp/stl
---
# Iterator
---
`iterator`란 C++의 STL에서 여러 `container`들의 내부 요소를 순회하기 위한 공통 인터페이스다. 

`container`의 종류에 따라서 랜덤 엑세스가 가능 안 할 수도 있고, 단일 연결리스트라면 전방으로 움직일 순 있어도 후방으로 그 포인터가 돌아갈 수는 없을 것이다. 

이에 따라서 `iterator`에도 그 종류가 정해져 있다.
<br>
# 개괄
---
![[Pasted image 20251016094628.png]]