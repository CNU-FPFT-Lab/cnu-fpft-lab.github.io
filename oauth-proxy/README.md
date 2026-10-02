# FPFT Lab Decap CMS OAuth Proxy

Decap CMS의 `github` backend를 GitHub Pages에서 사용하기 위한 Cloudflare Worker OAuth 프록시입니다.

## 편집 경로

- 간편 관리: `https://cnu-fpft-lab.github.io/admin/`
  - 교수 + 허용된 학생 계정
  - 공지사항, 논문, 연구실 활동, 연구과제
- 교수용 전체 관리: `https://cnu-fpft-lab.github.io/manage/`
  - 관리자 허용목록 계정만 접근
  - 공지사항, 논문, 활동, 구성원, 연구과제, 연구분야 전체

두 화면은 같은 GitHub 저장소 `CNU-FPFT-Lab/cnu-fpft-lab.github.io`를 사용하지만 OAuth Worker가 `site_id`를 기준으로 역할을 구분합니다.

## GitHub OAuth App

Homepage URL:

```text
https://cnu-fpft-lab.github.io/
```

Authorization callback URL:

```text
https://cnu-fpft-decap-oauth.<cloudflare-account>.workers.dev/callback?provider=github
```

OAuth App의 Client Secret은 저장소에 기록하지 않습니다.

## Worker 배포

```bash
cd oauth-proxy
npm install
npx wrangler login
npx wrangler secret put GITHUB_OAUTH_ID
npx wrangler secret put GITHUB_OAUTH_SECRET
npx wrangler secret put STATE_SECRET
npm run deploy
```

`GITHUB_OAUTH_ID`, `GITHUB_OAUTH_SECRET`, `STATE_SECRET`은 Cloudflare secret으로만 관리합니다.

## 계정별 접근 설정

`wrangler.toml`의 다음 변수를 사용합니다.

```toml
MANAGER_GITHUB_USERS = "dkrnd2"
STUDENT_GITHUB_USERS = "student-a,student-b"
```

- `MANAGER_GITHUB_USERS`: `/manage/` 접근 허용 계정
- `STUDENT_GITHUB_USERS`: `/admin/` 추가 허용 계정
- 관리자 계정은 `/admin/`에도 자동으로 접근할 수 있습니다.
- 학생 목록이 비어 있으면 교수/관리자 계정만 `/admin/`을 사용할 수 있습니다.

학생을 추가하거나 삭제한 뒤에는 Worker를 다시 배포합니다.

```bash
cd oauth-proxy
npm run deploy
```

## 저장소 권한

OAuth 허용목록과 별개로, Decap CMS에서 실제 저장하려면 GitHub 저장소 쓰기 권한이 필요합니다.

권장 운영:

1. `CNU-FPFT-Lab` Organization에 `website-editors` 팀 생성
2. 학생 계정에는 이 저장소의 `Write` 권한 부여
3. `STUDENT_GITHUB_USERS`에도 동일한 GitHub username 등록
4. 졸업 또는 담당 종료 시 팀과 허용목록에서 모두 제거

주의: 학생에게 저장소 `Write` 권한이 있으면 GitHub 웹사이트를 통해 저장소 파일을 직접 수정할 수도 있습니다. `/admin/`과 `/manage/` 분리는 CMS 로그인 권한을 구분하는 장치이며, GitHub 자체의 파일별 쓰기 권한 분리 기능은 아닙니다. 더 강한 승인 절차가 필요하면 별도 student branch + PR 승인 방식으로 전환할 수 있습니다.

## 역할 구분 방식

- `/admin/config.yml` → `site_domain: cnu-fpft-lab.github.io`
- `/manage/config.yml` → `site_domain: cnu-fpft-lab.github.io/manage`

Worker가 OAuth 시작 시 `site_id`를 읽어 `student` 또는 `manager` 역할을 signed state에 넣고, callback에서 해당 역할의 GitHub username allowlist를 검사합니다.

## 보안 원칙

- OAuth Client Secret과 `STATE_SECRET`은 저장소에 넣지 않습니다.
- `/manage/` 허용목록은 최소 계정만 유지합니다.
- 학생에게 Organization Admin 권한을 주지 않습니다.
- 담당 종료 시 GitHub 팀 권한과 `STUDENT_GITHUB_USERS`를 모두 제거합니다.
