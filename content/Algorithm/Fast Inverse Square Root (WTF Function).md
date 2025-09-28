---
created_date: 2025-09-25
updated_date: 2025-09-26
type:
  - Algorithm Note
tags:
  - game
  - computer_science
aliases:
---
```cpp
float Q_rsqrt( float number )
{
	long i;
	float x2, y;
	const float threehalfs = 1.5F;

	x2 = number * 0.5F;
	y = number;
	i = * ( long * ) &y;          // evil floating point bit level hacking
	i = 0x5f3759df - ( i >> 1 );  // what the fuck?
	y = * ( float * ) &i;
	
	y = y * ( threehalfs - ( x2 * y * y ) ); // 1st iteration
//	y = y * ( threehalfs - ( x2 * y * y ) ); // 2nd iteration,can be removed

	return y;
}
```

Quake에서 사용된, $\frac{1}{\sqrt x}$ 를 매우 빠른 방법으로 해낼 수 있는 알고리즘이다.
오로지 비트 연산과 곱셈만으로 함수가 구성되어있어 연산이 나이브한 방법보다 훨씬 빠르지만,
주석으로 작성된 WTF이 이 함수의 난해함을 잘 표현한다.

사실 최근에도 사용되는 공식은 아닌 것으로 알지만, float의 비트표현식을 응용했다는 점에서, float의 표현방법을 외울 수 있는 가장 재밌는 방식이 아닐까 싶어 공부하게 되었다.

<br><br>
# 왜 필요한가?
---
빛 반사를 표현하기 위해서는, "법선 벡터"를 알아내는 것, 그 중에서도 **법선 벡터의 단위 백터**를 알아내는 것은 매우 중요하다.
이 때, 어떠한 삼차원 벡터 $v$의 단위벡터는 다음과 같다.
$$
\frac{\mathbf{v}}{\lVert \mathbf{v}\rVert}
= \left(
\frac{v_1}{\sqrt{v_1^{2}+v_2^{2}+v_3^{2}}},
\frac{v_2}{\sqrt{v_1^{2}+v_2^{2}+v_3^{2}}},
\frac{v_3}{\sqrt{v_1^{2}+v_2^{2}+v_3^{2}}}
\right)
$$
이때, 가장 연산 시간에 큰 영향을 끼지는 작업은 $\frac{1}{\sqrt x}$를 알아내는 것이다. 

<br><br>
# 개요
---
이 함수를 전개하는 과정은 다음과 같다.
1. float의 부동소수점의 표현식을 이용하여, $\frac{1}{\sqrt x}$과 최대한 근접한 값을 찾아낸다.
2. 이 값을 [뉴턴-랍슨 방법 (Newton–Raphson method)](Newton-Raphson-method)에 적용하여 정확도를 크게 높인다.

<br><br>
# Float의 비트 구성
---
_이 표현방식은 IEEE-754를 따른다._
float의 표현 비트는, 총 32비트다.
- 1비트 : Sign Bit, 이 float의 부호를 표현한다.
- 지수부 (Exponent, 이하 $E$) : 개별적인 `signed bit`다.
- 가수부 (Fraction, 이하 $F$) : `unsigned bit`다.

일반적으로 10.5 를 이진수로 표현한다면 $1010.1_2$ 일 것이다.
허나 이 비트를 그대로 담아내지 않고, 다른 표현법을 사용한다.

- 가수부에 있는 비트는 소수점을 표현한다. 즉 비트로 표현한다면$1.F$ 로써 표현되며, 수식으로는 $\left(1 + \frac{F}{2^{23}}\right)$ 로써 표현할 수 있다.

- 지수부에 있는 비트가 그대로 정수를 표현하지 않는다, 이는 직관적이지만, 표현할 수 있는 수의 크기가 매우 적어지게 된다. 0.1이라는 소수를 표현하기 위해서 할당된 비트의 다수를 날려버리는 것은 너무나 아깝다.

- 따라서 가수부에 실수에 대한 정보를 전부 담고, 지수부를 곱하는 방식으로 구성한다.

각각 E와 F를 unsigned int로써 보았을 때, 실제 float x는 다음과 같이 표현된다.
**$\sqrt x$ 를 구하는 과정이기에, Sign Bit는 무조건 0으로 본다.**
$$
x = 2^{E-127}(1 + \frac{F}{2^{23}})
$$
<br><br>
## float $\Rightarrow$ long
그렇다면 이 X를 long의 관점으로 본다면 어떻게 될까?
다음과 같이 나타낼 수 있을것이다. (이하 $I_x$로 표기하겠다.)
$$
I_{x}= 2^{23}E + F
$$
<div style="page-break-after: always;"></div>

<br><br>
# $\log_{2}{x}$ 와 $I_x$ 의 일대일 대응 증명
---
난 처음에 위키피디아가 

>float 양수 x를 long비트로 취급하면 $\log_{2}x$로 다룰 수 있다. 

라길래 $\log_{2}x \approx I_x$ 인줄알았다. 해보니까 아니더라...

결론부터 말하자면 알아낼 수 있는것은 다음과 같다.
$$
\begin{align}
& \log_{2}x \approx \frac{I_x}{2^{23}} -127 + U \\
& U = 0.043 . . .. 
\end{align}
$$
이 이하로 이 수식의 도출 과정을 작성하였다.
<div style="page-break-after: always;"></div>
<br><br>

## 전개 과정

---
아까 작성한 float x의 표현식에서, 양변에 $log_{2}$를 씌워보자.
$$
\begin{align}
\log_{2}x & = \log_{2}\left(2^{E-127}\left(1 + \frac{F}{2^{23}}\right)\right) \\
& = \log_{2}{2^{E-127}} + \log_{2}\left(1+\frac{F}{2^{23}}\right)\\
& = (E - 127) + \log_{2}\left(1+\frac{F}{2^{23}}\right)\\
\end{align}
$$
여기까지는 기존의 log 공식으로 도달 할 수 있다.
여기서 우리는 $I_x$를 유도해낼 것이다.
$$
\begin{align} \\
I_{x}= 2^{23}E + F \\
\therefore \frac{I_x}{2^{23}} = E + \frac{F}{2^{23}}
\end{align}
$$
따라서, 정수로 이쁘게 튀어나온 $(E - 127)$ 사이에 $\frac{F}{2^{23}}$ 을 끼워넣어줌으로써 $I_x$ 를 유도할 수 있다.


이제 $\frac{F}{2^{23}} - \frac{F}{2^{23}}$ 을 식의 적절한 곳에 추가해보자.
$$
\begin{align}
\log_{2}{x} & = (E + \frac{F}{2^{23}} - 127) + \log_{2}\left(1+\frac{F}{2^{23}}\right)  - \frac{F}{2^{23}}\\
& =  \frac{I_x}{2^{23}} - 127 + \overbrace{\log_{2}\left(1+\frac{F}{2^{23}}\right)  - \frac{F}{2^{23}}} ^ U
\end{align}
$$
<div style="page-break-after: always;"></div>
<br><br>

## 상수 U의 정확도 증명

---
여기까지 잘 따라왔다면, 이상한 점이 보인다. 
분명 $U=0.043 \cdots$ 인데, 어째서 U에는 F가 들어가있을까? 이건 상수가 아니지 않은가?
맞다. U는 엄밀히 말하면 **0.043 으로 퉁친것이다.**
왜 퉁쳤을까? 어짜피 U의 범위는 $0 \leq U \leq 0.086 \cdots$ 이다.

계산의 편리함을 위해서, 잠시 $\frac{F}{2^{23}}$ 을 변수 $t$ 로 잡겠다.
F는 어짜피 23개의 Bit로 이루어져있으므로, $0 \leq t < 1$ 임을 알 수 있다.

우리가 추정해야 하는 값은
$$
\log_{2}{(1 + t)} - t
$$
이며, 이 그래프는 $[0 , 1)$ 범위에서 아치형 모양을 그린다.
이 값의 극댓값은 계산상으로 0.0860713이 나오게 된다.
따라서 정확히 그 중간인 0.0430357으로 정해놓아도 log2x의 근사값은 구할 수 있는것이다.

완벽하게 같을 필요는 없다. 우리의 목표는 근사치를 구하는 것이니까.
<br><br>
## 결론
---
$$
\begin{align} \\
& \log_{2}x \approx \frac{I_x}{2^{23}} -127 + U \\
& U = 0.043 . . .. 
\end{align}
$$
이렇게 우리는 로그를 통해서 float값 x를 long 비트 $I_x$ 로 표현하는 수식을 얻어냈다.
이제 $\frac{1}{\sqrt x}$ 도 정수 비트로써 알아낼 수 있을까?
<div style="page-break-after: always;"></div>

<br><br>

# 나눗셈 없이 $I_x$ 와 함께 $\frac{1}{\sqrt x}$ 구하기
---
우선, 식을 이항해서 $I_{x} = \dots$ 형식으로 변경해보자.
$$
\begin{align} \\
& \log_{2}x \approx \frac{I_x}{2^{23}} -127 + U ,\\
& I_{x}\approx 2^{23}\log_{2}{x} +2^{23}(127 - U)
\end {align}
$$

이제 이 식에 x대신 $\frac1{\sqrt x} = x^{-\frac{1}{2}}$ 를 집어넣어보자.
$$
\begin{align} 
\\
I_{x^{-\frac{1}{2}}} & \approx -2^{22}\log_{2}x+(127-U)2^{23} \\
\end{align}
$$
다시 $log_{2}x$ 가 튀어나왔다!
이전에 만든 수식을 집어넣자!
$$
\begin{align} \\
I_{x^{-\frac{1}{2}}} & \approx -\frac{1}{2}I_{x}+2^{22}(127-U)+2^{23}(127 -U) \\
&=-\frac{1}{2}I_{x}+(2^{22} +2^{23})(127-U)\\
&=-\frac{1}{2}I_{x}+\overbrace{\frac{2}{3} \times 2^{23}(127-U)} ^ {K} \\\\\\
& U = 0.0450466 \Rightarrow K = \mathrm{0x5f37bcb6}_{(16)} \\
\therefore I_{x^{-\frac{1}{2}}} & \approx  \mathrm{0x5f37bcb6}_{(16)} - \frac{1}{2}I_x
\end{align}
$$

- _상수 U가 `0.0450466`으로 바뀌었는데, 이는 직접 여러값을 넣어 관찰한 결과 저 값으로 계산했을 때 정확도가 더 높다고 판명되어 정해진 수로 보인다._


이 부분은, 다음과 같은 유명한 라인으로 남게 되었다.
```cpp
i = 0x5f3759df - ( i >> 1 ); // what the fuck?
```
<div style="page-break-after: always;"></div>
<br><br>

# 뉴턴-랩슨 방법

---
이로서 $\frac{1}{\sqrt x}$ 의 근사치를 찾아낼 수 있게 되었다.
그러나 오차율이 꽤나 많이 나기 때문에, 뉴턴/랩슨 방법을 활용하여 오차를 획기적으로 줄이는 과정이 마지막으로 필요하다.
자세한 설명은 [위키피디아](https://ko.wikipedia.org/wiki/%EB%89%B4%ED%84%B4_%EB%B0%A9%EB%B2%95)에 남기고, 이 방법을 실행하기 위한 방법은 다음과 같다.

- 원하는 방정식의 답 f(x)의 근사치를 구한다. (이미 구했다.)
- f(x)를 y라고 표현할 때, 다음 코드를 반복할수록 정확도가 기하급수적으로 상승한다.
```cpp
y = y * ( threehalfs - ( x2 * y * y ) ); // 1st iteration
```

- 한 번만 돌려도 정확도가 충분하여, 두 번째 줄은 주석처리가 되었다.

<br><br>
# 코드 재검토
---
```cpp
i = * ( long * ) &y;          // evil floating point bit level hacking
i = 0x5f3759df - ( i >> 1 );  // what the fuck?
y = * ( float * ) &i;
```
다른 줄들은 딱히 이해가 필요하지 않다. 다만 이 글에서 이야기한 수식의 핵심은 여기 전부 들어있다.
$$
I_{x^{-\frac{1}{2}}} \approx  \mathrm{0x5f37bcb6}_{(16)} - \frac{1}{2}I_x
$$
이 수식에 따라서, x를 long 비트로 캐스팅해서 해당 수식을 적용한 다음, 도출된 long 비트를 다시 float으로 해석하면 근사치를 구하는 작업이 매우 빠르게 끝나게 된다.

이후 한 두번의 뉴턴/랍슨 방법 적용만으로, $\frac{1}{\sqrt x}$ 의 정확도를 크게 늘릴 수 있다.