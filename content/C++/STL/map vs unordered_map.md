---
created_date: 2025-09-27
tags:
  - cpp
  - data_structure
  - cpp/stl
---
# map
---
```cpp
template<  
    class Key,  
    class T,  
    class Compare = std::less<Key>,  
    class Allocator = std::allocator<std::pair<const Key, T>>  
> class map;
```
`key` `value` 쌍을 저장하는 STL 자료구조다. 
key값들을 정렬해서 가지고 있기 때문에 `bidirectional_iterator`를 통한 순차탐색이 가능하다.

내부적인 구현은 [[Red-black tree]]로 이루어져 있어, 삽입,삭제,탐색 연산에 $O(\log_{2}{n})$ 의 시간복잡도를 가진다.
<br>
# unordered_map
---
```cpp
template<  
    class Key,  
    class T,  
    class Hash = std::hashKey>,  
    class KeyEqual = std::equal_to<Key>,  
    class Allocator = std::allocator<std::pair<const Key, T>>  
> class unordered_map;
```
`map` 과 동일하게 `key` `value` 쌍을 가지고 있으나, 내부적으로 `hashTable`을 사용하여 **정렬되어있지 않다**.
지원하는 열거자는 `forward_iterator`이며, 역시 순차 탐색이 가능하다.
다만 `bidirectional_iterator`과의 차이점으로는, 역방향 순회가 불가능하다.

내부적인 구현으로 해쉬테이블 (버킷 + 체이닝)을 사용하기 때문에,
삽입삭제탐색 연산에 $O(1)$ , 모든 키의 해쉬값이 몰리는 순간에는 최악$O(N)$의 시간 복잡도를 가진다.