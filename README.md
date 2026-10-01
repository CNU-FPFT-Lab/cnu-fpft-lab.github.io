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

## 관리자 편집 화면

일상적인 콘텐츠 업데이트는 아래 관리자 UI를 사용하는 것을 권장합니다.

**Admin:** https://cnu-fpft-lab.github.io/admin/

관리 화면에서 다음 항목을 웹 폼으로 수정할 수 있습니다.

- 논문 추가·수정·삭제 및 순서 변경
- 학회·수상·연구실 활동 추가
- 활동 사진 업로드
- 구성원 추가·수정 및 프로필 사진 업로드
- 연구과제 추가·수정
- 연구분야와 세부 주제 수정

관리 화면은 Decap CMS + Decap Turbo를 사용합니다. 최초 1회 Turbo Site 연결 후 `admin/config.yml`의 `turbo_site_id`만 실제 Site ID로 교체하면 됩니다.

## 콘텐츠 데이터

자주 바뀌는 내용은 HTML과 분리해 `data/` 폴더의 JSON 파일에서 관리합니다.

| 수정 대상 | 파일 |
| --- | --- |
| 연구분야·현재 연구주제 | `data/research.json` |
| 현재 수행 연구과제 | `data/projects.json` |
| 논문 목록 | `data/publications.json` |
| 구성원 이름·과정·이메일 | `data/members.json` |
| 학회·수상·연구실 활동 | `data/activities.json` |

관리자 UI에서 저장하면 위 파일이 자동으로 commit되고 GitHub Pages가 변경 내용을 반영합니다. 별도의 빌드 명령은 필요하지 않습니다.

## 이미지 관리

관리자 UI에서 업로드한 이미지는 기본적으로 `assets/uploads/`에 저장됩니다. 기존 연구실 사진은 `assets/`에 유지합니다.

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
