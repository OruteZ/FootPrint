---
created_date: 2023-11-29
updated_date: 2023-11-29
type:
  - Algorithm Note
tags:
  - "#problem_solving"
aliases:
  - bipartite_matching
---

#  Bipartite Matching
## 📝 Notes
- 정점을 두 개의 그룹으로 나누었을 때, 존재하는 모든 간선의 양 끝 점이 서로 다른 그룹에 속하는 형태의 그래프를 Bipartite Graph라고 이야기한다.
- 이때 두 그룹 이외에 Source 정점과 Sink 정점이 존재하고 Source -> A그룹 -> B그룹 -> Sink 로 방향그래프가 구성될때, [[Maximum Flow Problem]] 을 Bipartite Matching이라고 이야기한다.
- [[DFS]]의 개념을 활용하며, 알고리즘 과정은 다음과 같다.
	- 매칭을 시도할 때, 우선 매칭 안된 상대가 있을경우 Match를 수행한다.
	- 만약 해당 상대가 Match가 되어있을 경우, "상대의 상대" (그니까 나와 같은 그룹에 속했는데, 매칭하려는 상대를 선점한 정점) 에게 다른 정점을 Match해보라고 함수를 호출한다.
	- 만약 해당 시도가 성공했을 경우, Match를 완료하고 True를 반환한다.
	- 이를 실패했을 경우, For문을 활용해 다음 연결된 상대에게 똑같은 로직을 수행한다.
	- 모든 상대와 Match에 실패했을경우 false를 반환한다.
	- 이떄 Match를 새로 시작하기전 visited를 초기화 해주어서 무한루프를 방지한다.
## 🔗 Links
- [11375 열혈강호](https://www.acmicpc.net/problem/11375)
## Code
```c++
#include<iostream>
#include<cmath>
#include<queue>
#include<algorithm>
#include<stack>
#include<array>
#include<vector>

#define LL long long
#define DEBUG true
#define PRINT_LINE std::cout << "--------------------" << '\n'
#define REPEAT(n) for(int _ = 0; _ < n; _++)
#define FAST_IO std::ios_base::sync_with_stdio(false);std::cin.tie(nullptr);std::cout.tie(nullptr)

#define MAX 1000

std::vector<int> possible_works[MAX];

int person[MAX];
int works[MAX];

bool visited[MAX];

void clear_visited();

bool TryMatch(int p) {
    if(p == -1) return true;
    if(visited[p]) return false;
    visited[p] = true;

    for(int work : possible_works[p]) {
        if(TryMatch(works[work])) {
            person[p] = work;
            works[work] = p;
            return true;
        }
    }

    return false;
}

int main() {
    FAST_IO;
    int n, m;
    std::cin >> n >> m;

    for(int i = 0; i < MAX; i++) {
        person[i] = -1;
        works[i] = -1;
    }

    for(int i = 0; i < n; i++) {
        int cnt; std::cin >> cnt;
        REPEAT(cnt) {
            int w; std::cin >> w;
            w--;

            possible_works[i].push_back(w);
        }
    }

    int match_cnt = 0;
    for(int i = 0; i < n; i++) {
        if(person[i] != -1) continue;

        clear_visited();
        match_cnt += (int)TryMatch(i);
    }

    std::cout << match_cnt << std::endl;

    return 0;
}

void clear_visited() {
    for(int i = 0; i < MAX; i++) visited[i] = false;
}

```