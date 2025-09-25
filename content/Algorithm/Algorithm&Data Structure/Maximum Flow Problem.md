---
created_date: 2023-11-28
updated_date: 2023-11-28
type:
  - Algorithm Note
aliases:
  - "#maximum_flow"
---
#  Maximum Flow Problem
- **🏷️Tags** :  #problem_solving #graph #maximum_flow 
## 📝 Notes
### Maximum Flow Problem이란?
[방향 그래프](Directional Graph) 에서, 각 간선의 용량이 정해져 있을 때 정해진 출발점에서 도착점까지 보낼 수 있는 최대의 유량을 계산하는 문제
### Ford-Fulkerson Algorithm
증가경로가 나오지 않을 때 까지, 유량을 Greedy 하게 흘려주는 방식
이때 꽉 찼을 경우, 역간선 개념을 활용하여 문제를 해결 할 수 있다.
A -> B고, 용량이 3/3인 간선에 -3/0의 역간선의 존재이유는 (내가 해석하기론) 다음과 같다.
- 역간선을 통해서 유량이 성립하면, 그만큼 3/3에서 유량을 다시 빼주면 된다.
- 그러면 기존에 남은 유량을 역간선을 통해 성립된 경로에 부어주고, 역간선 이전의 유량이 비워진 부분을 채워주면서, 최대 유량을 달성할 수 있게 된다.

### Edmonds-Karp Algorithm
Ford-Fulkerson 알고리즘은 최악의 경우에 $O(Ef)$ (E = 간선의 수, f = 최대 유량)의 시간복잡도를 가진다. 하지만 그리디하게 경로를 찾는 과정을 [[BFS]] 로 변경해주면, 에드몬드 - 카프 알고리즘이 완성된다. 이 경우 시간복잡도는 $O(VE^2)$가 된다.

## 🔗 Classic Problem
- [6086 - 최대 유량](https://www.acmicpc.net/problem/6086)
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

#define MAX_V 100

int graph[MAX_V][MAX_V] = {0, };
int flow[MAX_V][MAX_V] = {0, };
bool connected[MAX_V][MAX_V] = {0, };

int from[MAX_V];

bool bfs(int start, int end, int& total_flow) {
    for(int& i : from) i = -1;

    std::queue<int> q;
    q.push(start);
    from[start] = start;

    while(not q.empty()) {
        int cur = q.front();
        q.pop();

        for(int next = 0; next < MAX_V; next++) if(next != cur) {
            if(not connected[cur][next]) continue;
            if(from[next] != -1) continue; //visited;
            if(flow[cur][next] >= graph[cur][next]) continue; //full

            from[next] = cur;
            q.push(next);

            if(next == end) break;
        }
    }

    if(from[end] == -1) return false;

    int flow_value = INT32_MAX;
    for(int i = end; i != start; i = from[i]) {
        flow_value = std::min(flow_value, graph[from[i]][i] - flow[from[i]][i]);
    }

    for(int i = end; i != start; i = from[i]) {
        flow[from[i]][i] += flow_value;
        flow[i][from[i]] -= flow_value;
    }

    total_flow += flow_value;
    return true;
}

int main() {
    FAST_IO;
    int e; std::cin >> e;

    char u, v; int w;
    REPEAT(e) {
        std::cin >> u >> v >> w;
        if(u == v) continue;

        int u_num = u - 'A';
        int v_num = v - 'A';
        graph[u_num][v_num] += w;
        graph[v_num][u_num] += w;

        connected[u_num][v_num] = connected[v_num][u_num] = true;
    }

    int start = 0;
    int dest = 'Z' - 'A';
    int answer = 0;

    while(true) { //BFS 자체를 증가 경로가 없을 때 까지 반복
        if(not bfs(start, dest, answer)) break;
    }

    std::cout << answer << '\n';

    return 0;
}
```