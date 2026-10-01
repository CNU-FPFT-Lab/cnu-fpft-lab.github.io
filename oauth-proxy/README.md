# FPFT Lab Decap CMS OAuth Proxy

Decap CMS의 `github` backend를 GitHub Pages에서 사용하기 위한 소형 OAuth 프록시입니다.

- 홈페이지: `https://cnu-fpft-lab.github.io/`
- 관리자: `https://cnu-fpft-lab.github.io/admin/`
- 저장소: `CNU-FPFT-Lab/cnu-fpft-lab.github.io`
- 실행 환경: Cloudflare Workers

Decap Turbo 구독 없이 여러 학생이 각자의 GitHub 계정으로 로그인할 수 있도록 구성합니다. 편집자는 GitHub 저장소에 push 권한이 있어야 합니다.

## 1. GitHub OAuth App 생성

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

입력 예시:

```text
Application name
CNU FPFT Lab CMS

Homepage URL
https://cnu-fpft-lab.github.io/
```

Authorization callback URL은 Worker를 먼저 배포한 뒤 다음과 같이 입력합니다.

```text
https://cnu-fpft-decap-oauth.<cloudflare-account>.workers.dev/callback?provider=github
```

이 프록시는 refresh token 처리를 하지 않으므로 OAuth App 설정에서 **Expire user access tokens** 옵션은 비활성화하는 것을 권장합니다.

생성 후 `Client ID`와 새로 생성한 `Client Secret`을 복사합니다. Client Secret은 GitHub 저장소에 절대 기록하지 않습니다.

## 2. Cloudflare Worker 배포

Node.js가 설치된 PC에서 저장소를 clone한 뒤:

```bash
cd oauth-proxy
npm install
npx wrangler login
```

secret을 등록합니다.

```bash
npx wrangler secret put GITHUB_OAUTH_ID
npx wrangler secret put GITHUB_OAUTH_SECRET
npx wrangler secret put STATE_SECRET
```

- `GITHUB_OAUTH_ID`: GitHub OAuth App Client ID
- `GITHUB_OAUTH_SECRET`: GitHub OAuth App Client Secret
- `STATE_SECRET`: 임의로 만든 충분히 긴 랜덤 문자열

그 다음 배포합니다.

```bash
npm run deploy
```

출력되는 `https://....workers.dev` 주소를 기록합니다.

## 3. GitHub OAuth App callback URL 확정

GitHub OAuth App 설정의 callback URL을 실제 Worker 주소로 정확히 설정합니다.

```text
https://<실제-worker>.workers.dev/callback?provider=github
```

wildcard callback은 사용할 필요가 없습니다.

## 4. Decap CMS 연결

`admin/config.yml`의 아래 값을 변경합니다.

```yaml
base_url: REPLACE_WITH_OAUTH_WORKER_URL
```

예:

```yaml
base_url: https://cnu-fpft-decap-oauth.example.workers.dev
```

`/auth`를 뒤에 붙이지 않습니다. Decap CMS가 `auth_endpoint: auth`를 이용해 자동으로 `/auth`를 호출합니다.

커밋한 뒤:

```text
https://cnu-fpft-lab.github.io/admin/
```

에 접속해 **Login with GitHub**를 선택합니다.

## 5. 학생 편집 권한

학생 GitHub 계정은 저장소에 `Write` 권한이 있어야 합니다.

권장 운영:

1. `CNU-FPFT-Lab` Organization에 `website-editors` 팀 생성
2. 해당 팀에 이 저장소 `Write` 권한 부여
3. 홈페이지 관리 학생을 팀에 추가
4. 졸업 시 팀에서 제거

Worker의 `ALLOWED_GITHUB_USERS` 변수에 GitHub username을 쉼표로 입력하면 OAuth 로그인 자체를 특정 사용자로 제한할 수도 있습니다.

예:

```toml
ALLOWED_GITHUB_USERS = "student-a,student-b,professor-account"
```

비워두면 OAuth 로그인은 누구나 시도할 수 있지만, 저장소 push 권한이 없는 계정은 Decap에서 변경사항을 저장할 수 없습니다.

## 보안 원칙

- `GITHUB_OAUTH_SECRET`은 반드시 Wrangler secret으로 저장합니다.
- GitHub 저장소, HTML, JavaScript, `config.yml`에 Client Secret을 넣지 않습니다.
- callback URL은 정확한 Worker URL을 사용합니다.
- `STATE_SECRET`은 외부에 공개하지 않습니다.
- 저장소 권한은 `Admin` 대신 학생에게 `Write` 수준만 부여하는 것을 권장합니다.
