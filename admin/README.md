# FPFT Lab 관리자 편집기 설정

관리자 화면: **https://cnu-fpft-lab.github.io/admin/**

관리 UI와 콘텐츠 필드는 이미 구성되어 있습니다. 최초 1회 Decap Turbo 연결만 필요합니다.

## 최초 설정

1. Decap Turbo에서 계정을 만들고 Organization을 생성합니다.
2. Organization에 GitHub를 연결합니다.
3. 새 Site를 만들 때 아래 값을 사용합니다.
   - Repo: `CNU-FPFT-Lab/cnu-fpft-lab.github.io`
   - Branch: `main`
   - Config path: `admin/config.yml`
   - Admin interface URL: `https://cnu-fpft-lab.github.io/admin/`
4. Site의 Overview에서 **Site ID**를 복사합니다.
5. `admin/config.yml`에서 아래 한 줄을 찾습니다.

```yaml
turbo_site_id: REPLACE_WITH_DECAP_TURBO_SITE_ID
```

6. `REPLACE_WITH_DECAP_TURBO_SITE_ID`를 실제 Site ID로 교체하고 commit합니다.
7. `/admin/`을 다시 열어 로그인합니다.

## 관리 가능한 항목

- 논문
- 연구실 활동·사진
- 구성원 및 프로필 사진
- 연구과제
- 연구분야

관리 UI에서 업로드한 사진은 기본적으로 `assets/uploads/`에 저장됩니다.

## 저장 및 배포

관리 UI에서 저장하면 `main` 브랜치에 실제 Git commit이 생성됩니다. GitHub Pages가 해당 commit을 배포하면 홈페이지에 반영됩니다.
