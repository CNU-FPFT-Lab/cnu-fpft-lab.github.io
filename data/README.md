# data 폴더 편집 가이드

이 폴더의 파일만 수정해도 홈페이지의 자주 바뀌는 내용을 업데이트할 수 있습니다.

- `research.json`: 연구분야와 현재 연구주제
- `projects.json`: 현재 수행 연구과제
- `publications.json`: 논문
- `members.json`: 구성원
- `activities.json`: 학회·수상·연구실 활동

## 주의

1. JSON의 마지막 항목 뒤에는 쉼표를 넣지 않습니다.
2. 큰따옴표 `"`를 지우지 않습니다.
3. 이미지 파일은 먼저 `assets/` 폴더에 올린 뒤 경로를 입력합니다.
4. 수정 후 GitHub에서 **Commit changes**를 누르면 GitHub Pages가 자동으로 반영합니다.

## 활동 추가 예시

```json
{
  "date": "2026.10.01",
  "title": "행사명",
  "type": "학회 · 발표",
  "image": "assets/example.jpg"
}
```

## 학생 추가 예시

```json
{
  "name": "홍길동",
  "name_en": "Gildong Hong",
  "course": "석사 과정",
  "email": "example@jnu.ac.kr"
}
```
