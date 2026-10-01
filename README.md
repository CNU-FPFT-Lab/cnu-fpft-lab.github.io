# CNU FPFT Lab website

전남대학교 식품가공 및 푸드테크 연구실 홈페이지입니다.

**Website:** https://cnu-fpft-lab.github.io/

## 사이트 구조

- 홈
- 연구
- 구성원
- 연구성과
  - 논문
  - 연구과제
  - 특허·기술이전
- 연구실 활동
- 문의·오시는 길

## 학생이 수정할 때 가장 먼저 볼 파일

자주 바뀌는 내용은 HTML과 분리해 `data/` 폴더의 JSON 파일에서 관리합니다.

| 수정 대상 | 파일 |
| --- | --- |
| 연구분야·현재 연구주제 | `data/research.json` |
| 현재 수행 연구과제 | `data/projects.json` |
| 논문 목록 | `data/publications.json` |
| 구성원 이름·과정·이메일 | `data/members.json` |
| 학회·수상·연구실 활동 | `data/activities.json` |

JSON 파일을 수정한 뒤 저장하고 commit하면 페이지가 자동으로 해당 데이터를 읽습니다. 별도의 빌드 명령은 필요하지 않습니다.

## 디자인·페이지 수정

| 수정 대상 | 파일 |
| --- | --- |
| 전체 색상·레이아웃·반응형 디자인 | `assets/site.css` |
| 데이터 표시·검색·모바일 메뉴 | `assets/main.js` |
| 홈 | `index.html` |
| 연구 | `research.html` |
| 구성원 | `members.html` |
| 연구성과 | `publications.html` |
| 연구실 활동 | `photos.html` |
| 문의·오시는 길 | `contact.html` |

## 이미지 관리

연구실 사진은 `assets/` 폴더에 넣고 `data/activities.json`의 `image` 값을 해당 경로로 바꿉니다.

예:

```json
{
  "date": "2026.10.01",
  "title": "행사명",
  "type": "학회 · 발표",
  "image": "assets/example.jpg"
}
```

## 전남대학교 UI

헤더에는 전남대학교 공식 UI 자료에 공개된 원형 심볼을 사용합니다. 사이트 기본색은 전남대학교 UI의 녹색을 중심으로 구성하고, 보조색으로 청색을 사용합니다.

## 배포

GitHub Pages가 `main` 브랜치의 루트 파일을 직접 게시합니다. 따라서 수정 후 별도의 생성 스크립트를 실행할 필요가 없습니다.

```sh
git pull
git add .
git commit -m "홈페이지 수정"
git push
```

GitHub 웹 편집기에서 직접 수정하고 **Commit changes**를 눌러도 동일하게 배포됩니다.
