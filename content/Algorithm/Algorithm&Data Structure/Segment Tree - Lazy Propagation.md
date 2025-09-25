---
created_date: 2023-11-27
updated_date: 2023-11-27
type: Algorithm Note
---
# Segment Tree
- **🏷️Tags** : #data_structure #segment_tree
## 📝 Notes
- 기존 [[Segment Tree]]에서 값이 변경될 때 방식은, 무조건 바뀐 부분을 찾아 리프노드 까지 내려가서 값을 갱신하고 올라오는 방식임.
- 이렇게 알고리즘이 작동할 경우, 배열에서 n개의 값이 공통적으로 증감할 때 최대 O(nlogn)의 시간복잡도를 가지게 됨.
- 이 문제를 해결하기 위해서 Lazy Propagtion이라는 방식이 나타남.
- 이 방식은 Segment_Tree와 1대1 대응되는 자료구조 Lazy를 만들어서, 증감 수치를 해당 자료구조에 저장해두는 방식임
	- 이 Lazy에 저장 된 증감수치가 실제로 적용되는 것은 Segment Tree에서 해당 값을 참조해야 할 경우임. 아래 서술한 코드와 푼 백준문제 "수열과 쿼리 21"의 경우에는 get_value함수와 update부분에서 참조하게 됨.
## 🔗 Links
- [수열과 쿼리 21](https://www.acmicpc.net/problem/16975)
- [참조 사이트](https://4legs-study.tistory.com/128)
### Code
```C++
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

LL cal_tree_size(int arr_size) {
    long long h = ceil(log2(arr_size));
    long long tree_size = 1 << (h + 1);

    return tree_size + 1;
}

std::vector<LL> seg_tree;
std::vector<LL> lazy;
void init_tree(const std::vector<LL>& arr);
LL init(LL node, LL begin_idx, LL end_idx, const std::vector<LL>& arr);
LL get_value(LL target, LL begin, LL end, LL node);

void update_lazy(LL node, LL begin, LL end) {
    if(lazy[node] == 0) return;

    LL length = end - begin;
    seg_tree[node] += length * lazy[node];

    if(length == 1) {
        lazy[node] = 0;
        return;
    }

    lazy[node * 2] += lazy[node];
    lazy[node * 2 + 1] += lazy[node];
    lazy[node] = 0;
}

LL update(LL target_begin, LL target_end, LL begin, LL end, LL node, LL value) {
    if(begin >= target_end or end <= target_begin) return 0;

    if(target_begin <= begin and end <= target_end) {
        lazy[node] += value;
        update_lazy(node, begin, end);
        return seg_tree[node];
    }

    LL mid = (begin + end) / 2;
    LL l = update(target_begin, target_end, begin, mid, node * 2, value);
    LL r = update(target_begin, target_end, mid, end, node * 2 + 1, value);
    return seg_tree[node] = l + r;
}

void init_tree(const std::vector<LL>& arr) {
    LL size = arr.size();

    LL tree_size = cal_tree_size(size);
    seg_tree.resize(tree_size);
    lazy.resize(tree_size);

    init(1, 0, arr.size(), arr);
}

LL init(long long int node, long long int begin, long long int end, const std::vector<long long int> &arr) {
    int size = end - begin;
    if(size == 1) {
        seg_tree[node] = arr[begin];
        return seg_tree[node];
    }

    int mid = (begin + end) / 2;
    LL l_value = init(node * 2, begin, mid, arr);
    LL r_value = init(node * 2 + 1, mid, end, arr);

    return l_value + r_value;
}

LL get_value(long long int target, long long int begin, long long int end, long long int node) {
    if(target < begin or target >= end) return INT64_MAX;

    //if current node has lazy value, update lazy
    update_lazy(node, begin, end);
    if(target == begin and end - begin == 1) return seg_tree[node];

    LL mid = begin + end;
    mid /= 2;

    LL l_value = get_value(target, begin, mid, node * 2);
    LL r_value = get_value(target, mid, end, node * 2 + 1);

    return std::min(l_value, r_value);
}



int main() {
    FAST_IO;
    int n; std::cin >> n;

    std::vector<LL> array(n);
    for(LL &i : array) std::cin >> i;

    init_tree(array);

    int m; std::cin >> m;

    int order, i, j, x;
    REPEAT(m) {
        std::cin >> order;
        if(order == 1) {
            std::cin >> i >> j >> x;
            i--;
            j--;

            update(i, j + 1, 0, n, 1, x);
        }

        if(order == 2) {
            std::cin >> x;
            x--;

            std::cout << get_value(x, 0, n, 1) << '\n';
        }
    }
}
```