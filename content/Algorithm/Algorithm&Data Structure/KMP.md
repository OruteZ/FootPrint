---
created_date: 2025-01-27
updated_date: 2025-01-27
type:
  - Algorithm Note
tags:
  - "#problem_solving"
aliases:
  - "#kmp"
---
> **문제 유형**  
> “텍스트(Text) 문자열 안에 패턴(Pattern) 문자열이 등장하는 위치를 효율적으로 찾는 문제”

> **주요 특징**
> 
> - **브루트포스**: 최악의 경우 O(N×M)O(N \times M)O(N×M) (N = 텍스트 길이, M = 패턴 길이)
> - **KMP**: 접두사/접미사 정보를 활용해 **최악의 경우에도 O(N+M)O(N + M)O(N+M)**

---

### 1. 동작 원리

1. **패턴 내부의 ‘접두사=접미사’ 정보(파이 테이블) 미리 계산**
    - 패턴에서 각 인덱스까지 고려했을 때, 자기 자신과 겹치지 않는 가장 긴 접두사이자 접미사의 길이를 구한다.
2. **텍스트 검색 시 불일치 발생**
    - 기존에 일치했던 접두사 길이를 재활용하여, 패턴을 최대한 건너뛴 상태에서 비교를 재개한다.

브루트포스에서는 불일치 발생 시 **한 칸씩** 이동했지만, KMP는 **파이 테이블**을 이용해 **여러 칸** 건너뛰어 효율을 높인다.

---

### 2. 파이 테이블(접두사-접미사 테이블) 계산

- `lps(Longest Prefix Suffix)` 또는 ‘실패 함수(Failure Function)’ 라고도 부름.
- 인덱스 `i`를 기준으로,  
    `패턴[0..i]`(부분 문자열)의 **접두사와 접미사가 일치하는 최대 길이**를 저장.

#### 파이 테이블 예시

예: 패턴 = `ABABCABAB`

- 인덱스별 최대 접두사=접미사 길이를 구하면

|i (인덱스)|패턴 글자|부분 문자열|최대 일치 길이|lps[i]|
|---|---|---|---|---|
|0|A|A|- (없음)|0|
|1|B|AB|- (없음)|0|
|2|A|ABA|A|1|
|3|B|ABAB|AB|2|
|4|C|ABABC|- (없음)|0|
|5|A|ABABCA|A|1|
|6|B|ABABCAB|AB|2|
|7|A|ABABCABA|ABA|3|
|8|B|ABABCABAB|ABAB|4|

결과적으로
`lps = [0, 0, 1, 2, 0, 1, 2, 3, 4]`

---

### 3. KMP 검색 과정

1. **파이 테이블(접두사=접미사 정보) 준비**
2. **텍스트를 왼쪽부터 오른쪽으로 탐색**
    - 텍스트의 글자와 패턴의 글자를 순차적으로 비교
    - 만약 불일치가 발생하면,
        - `j` (현재 패턴 인덱스)를 `lps[j - 1]`로 재조정 (매칭 가능한 최대 접두사 길이를 그대로 가져옴)
        - 텍스트 인덱스 `i`는 그대로 둔 채 재비교를 진행
3. **완전히 패턴이 매칭되면** (j가 패턴 길이에 도달),
    - 매칭된 시작 인덱스(`i - 패턴길이 + 1`)를 기록 후,
    - j를 `lps[j - 1]`로 조정해 다음 매칭 검사

---

### 4. C++ 예시 코드

cpp

복사편집

```cpp
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// 1) 파이 테이블(접두사=접미사) 계산 함수
vector<int> computeLPS(const string &pattern) {
    int M = pattern.size();
    vector<int> lps(M, 0);

    int j = 0; // 패턴 내 비교할 인덱스
    for(int i = 1; i < M; ) {
        if(pattern[i] == pattern[j]) {
            lps[i] = j + 1;
            j++; i++;
        } else {
            if(j > 0) {
                j = lps[j - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }
    return lps;
}

// 2) KMP 검색 함수
vector<int> kmpSearch(const string &text, const string &pattern) {
    vector<int> result;
    vector<int> lps = computeLPS(pattern);

    int i = 0; // 텍스트 인덱스
    int j = 0; // 패턴 인덱스
    int N = text.size();
    int M = pattern.size();

    while(i < N) {
        if(text[i] == pattern[j]) {
            i++; j++;
            // 패턴 완전히 매칭
            if(j == M) {
                result.push_back(i - M); // 매칭 시작 인덱스
                j = lps[j - 1];         // 다음 매칭을 위해 j 재조정
            }
        } else {
            // 불일치 발생
            if(j > 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }
    return result;
}

int main() {
    string text = "ABABABCABABABABD";
    string pattern = "ABABCABAB";

    vector<int> matches = kmpSearch(text, pattern);

    cout << "Matches at: ";
    for(int pos : matches) {
        cout << pos << " ";
    }
    cout << endl;

    return 0;
}

```

---

### 5. 시간 복잡도

- **파이 테이블 계산**: $O(M)$
- **텍스트 검색**: $O(N)$
- **전체**: $O(N+M)$