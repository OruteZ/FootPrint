---
created_date:
  - 2025-10-16
tags:
  - cpp/stl
publish: true
---
# Iterator
---
`iterator`란 C++의 STL에서 여러 `container`들의 내부 요소를 순회하기 위한 공통 인터페이스다. 

`container`의 종류에 따라서 랜덤 엑세스가 가능 안 할 수도 있고, 단일 연결리스트라면 전방으로 움직일 순 있어도 후방으로 그 포인터가 돌아갈 수는 없을 것이다. 

이에 따라서 `iterator`에도 그 종류가 정해져 있다.
<br>
# Categories
---
![[Pasted image 20251016094628.png]]
가장 좁은 기능을 하는 두 `iterator`인 `input`과 `output`이 있다.
이 기능을 보장해주며 순회가 가능한 `forward iterator`, 역행이 가능한 `bidirectional iterator`, 인덱스 기반 접근이 가능한 `random access iterator`로 구분된다.

<br>

## Input, Output
---
### Input
이 `iterator`가 가리키는 값을 읽을 수 있다.
`a==b`, `a!=b`, `*a`, `a->m` 연산이 가능하다

### Output
할당 연산이 가능하다 (_`const`가 아니어야 한다._)
<br>

## Forward
---
input과 output의 기능을 모두 지원해준다.
`a++` 연산자를 통해 다음으로 넘어갈 수 있다

> _단, ++를 활용하여 앞으로 이동하는 연산은 Input과 Output을 포함한 모든 `iterator`가 지원해준다._
<br>

## Bidirectional
---
`a--` 연산자를 통해서 '뒤'로 이동할 수 있다.
<br>
## Random Access
---
- 각 `iterator`에 인덱스를 매길 수 있어 `[]` 연산자로 참조할 수 있다.
- `+`,`-` 연산으로 여러 칸을 한 번에 이동할 수 있다.
- `<, >, <=, >=` 대소 비교 연산이 가능하다.

# Container - Iterator
---
- input iterator
	- istream_iterator
- output iterator
	- ostream_iterator, inserter, front_inserter, back_insterter
- bidirectional_iterator
	- `list`, `set`, `multiset`, `map`, `multimap`
- random_access_iterator
	- `c-style pointer`, `vector`, `deque`

<br>

# Reference
---
- https://cplusplus.com/reference/iterator/