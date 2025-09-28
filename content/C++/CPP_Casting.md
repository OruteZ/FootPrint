---
created_date: 2025-09-28
tags:
  - cpp
---
어떠한 변수의 타입을 다른 타입으로 변경하는 것을 `casting`이라고 한다.
일반적으로 `a = (float)b` 처럼 c-style로 캐스팅하는 경우가 많은데, 실제로 cpp 프로그래밍에서는 명시적 캐스팅이 존재하며, 이를 사용하는 것이 여러가지로 좋다.
<br>
# Casting 종류
---
## const_cast

```cpp
char* p = const_cast<char*>("hello");  
```

- `const`/`volatile` 한정자만 제거/부여한다. 
- 원래 읽기 전용 메모리(문자열 리터럴 등)를 수정하면 **`Undefined Behaviour`**. 
- 보통 “API가 const를 안 받는다” 같은 레거시 호환용으로 사용.

---

## static_cast
```cpp
int i = static_cast<int>(3.14);  // 3
```

- compile_time에 검사 가능한 명시적 변환(수치형 변환, 안전한 업캐스트 등). 
- runtime 타입 검사는 없음 → 잘못된 다운캐스트에 쓰면 **`Undefined Behaviour`** 가능.

---

## dynamic_cast

```cpp
Derived* pd = dynamic_cast<Derived*>(basePtr);  // 실패 시 nullptr
```

- runtime에서 타입 안정성이 필요한 다형(virtual) 계층에서 사용. 
- 실패 시 포인터는 `nullptr`(참조는 `std::bad_cast` 에러 throw).
- 형제 타입이나, 복잡한 상속의 정확한 포인터 보정도 처리.
- 전제: 기반 타입이 **``polymorphic``(가상 함수 보유)** 이어야 함.

---

## reinterpret_cast
```cpp
std::uintptr_t addr = reinterpret_cast<std::uintptr_t>(ptr);
```

- 비트나 주소단위로 재해석하여 변수를 대입한다.
- 시스템/플랫폼 의존, 타입 안전성 없음. 
- 정말 저수준(메모리 맵, 장치 I/O, 직렬화 트릭 등)에서만 신중히 사용.
<br>

# 번외 : C-Style Casting의 전개 과정
---
c++로 넘어오면서 여러가지 캐스팅 구문이 생겨났으나, 여전히 C-style casting을 사용할 수 있으며, 또한 간편하여 자주 사용되곤 한다.

```cpp
int a = 10;

float b = (float)a;
```

그렇다면 이 캐스팅은 내부적으로 c++의 어떤 캐스팅과 대응된다고 볼 수 있을까?
<br>
## casting process
`C-style cast`는 어느 하나의 캐스팅을 하는 것이 아닌, 아래 세 cast를 전부 순서대로 시도한다: 
### 1. const_cast
- 우선 const가 달려있을 경우, const 키워드를 벗겨낼 수 있는지 시도함

### 2. static_cast
- 두 타입 사이의 정적 변환
	- 이때 `dynamic_cast`가 아니기 때문에 `static_cast`를 강제로 실행하려 할 때의 문제점을 그대로 가짐

### 3. reinterpret_cast
- 메모리 해석 변경등의 저수준 변환 시도 

`static_cast` 같은 다운캐스팅에서 **`Undefined Behaviour`** 가 발생할 수도 있고, 코드상에서 그 목적이 제대로 드러나지 않기에 (`reinterpret` 인지, `const_cast` 인지 등 . . ) 명시적 캐스트 쓰는것이 좋음
