# CNU FPFT Lab website

전남대학교 식품가공 및 푸드테크연구실 홈페이지입니다.

**Website:** https://cnu-fpft-lab.github.io/

## 구성

Home, Research, Members, Publications, Education, Photos, Contact의 7개 페이지입니다. 기존 Google Sites에서 교수·구성원 6명·논문 19편·활동 사진 4장·연락처를 선별하고, 소개와 연구 내용은 네 연구축 중심으로 새롭게 구성했습니다.

## 수정 방법

Python 3만 필요하며, 생성된 HTML이 저장소에 포함되어 있습니다.

```sh
python3 scripts/build.py
python3 -m http.server 8000
```

브라우저에서 http://localhost:8000 을 엽니다.

| 수정 대상 | 파일 |
| --- | --- |
| 공통 레이아웃·페이지 본문 | scripts/build.py |
| 논문 서지정보 | data/publications.json |
| 공통 디자인 | assets/style.css |
| 개별 페이지 디자인 | assets/pages.css |
| 모바일 메뉴·연도 필터 | assets/main.js |
| 사진 | assets/*.jpg |

수정 후 생성 스크립트를 실행하고 변경된 HTML도 함께 커밋합니다. GitHub Pages는 main의 루트 디렉터리를 게시합니다. 외부 JavaScript 라이브러리, 방문자 추적 코드, 비밀키는 사용하지 않습니다.

## 연구 코드 공유

홈페이지는 연구실 소개를 담당합니다. 연구 코드는 각 연구의 별도 저장소에서 실행 방법·의존성·라이선스와 함께 관리한 뒤 관련 페이지에서 연결할 수 있습니다. 아직 공개되지 않은 코드나 데이터 링크를 생성하지 않습니다.

출처와 편집 범위는 CONTENT_SOURCES.md를 참고하세요.
