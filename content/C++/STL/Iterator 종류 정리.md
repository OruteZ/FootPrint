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
가장 좁은 기능을 하는 두 `iterator`인 `input`과 `output`이 있다.
이 기능을 보장해주며 순회가 가능한 `forward iterator`, 역행이 가능한 `bidirectional iterator`, 인덱스 기반 접근이 가능한 `random access iterator`로 구분된다.


# Input, 