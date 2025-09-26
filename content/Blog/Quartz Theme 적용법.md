---
created_date: 2025-09-26
tags:
  - quartz
  - obsidian
  - github
---
Quartz를 통해서 블로그를 구성했다면, 블로그의 외형을 변경하기 위해서는 크게 두 가지 방식을 이용해야 한다.

1. 직접 CSS 설정을 수정 (quartz/styles/custom.scss)
2. Git Repository와 연동하여 Github Action을 사용하여 연결

# meta info
---
- Quartz의 배포를 Github Actions를 기반으로 진행했을 때를 기준으로 작성하였다.

# custom.scss
---
quartz/styles/custom.scss파일이 있는데, 여기서 여러가지 css 요소를 변경해주면 그대로 블로그의 테마에 자동적으로 반영이 된다.

```scss
@use "./base.scss";
```

# Theme Template
---
다음과 같은 Repository가 존재한다.
https://github.com/saberzero1/quartz-themes

기존 옵시디언의 테마들을 Quartz에 똑같이 적용할 수 있도록 만들어둔 레포다.
상당히 많은 테마가 존재하며, 각 테마에 대한 저작권 역시도 명시되어있다.

## 적용법 1 : SCSS
---
레포지토리 내부 각 테마에 대한 `_index.scss`파일을 긁어서 그대로 `custom.scss`파일에 집어넣으면 된다.
아니면 Templates 폴더를 통째로 `styles`폴더로 옮긴 다음, `custom.scss`에서 매번 적용 테마를 변경해도 된다.

## 적용법 2 : Github Actions
---
애초에 배포를 Github Actions 기반으로 했다면, 이 방식이 더 편할 것이다.
`deploy.yml` 파일에 두 부분을 추가해주면 된다.

1. 원하는 테마를 골라 다음과 같이 작성한다.
```yml
env:
	THEME_NAME: <THEME-NAME>
```

2. 빌드 부분 아래에 다음과 같이 추가한다.
```yml
- name: Fetch Quartz Theme
  run: curl -s -S https://raw.githubusercontent.com/saberzero1/quartz-themes/master/action.sh | bash -s -- $THEME_NAME
```

이후에 테마를 변경하고싶다면, env 부분만 수정하면 즉시 변경이 가능하다.
~~원본 레포지토리에서 매변 긁어오는거라, 이쪽이 최신화에 더 유리할거라 생각하여 해당 방식을 채택했다.~~
