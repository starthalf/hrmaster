# HCG Master · Guided Tour

5분 인터랙티브 컨설팅 체험. Next.js 13 + Tailwind + Supabase + Anthropic.

회사 소개 SaaS 랜딩이 아니라, **한 화면 = 한 단계**로 컨설팅 흐름을 손가락으로 따라가는 투어입니다.

---

## 구조

```
Welcome (Step 0)              /
  ├ 통합 컨설팅 (준비 중)        → e-hcg.com/professional-services (외부)
  └ Master 자문 (추천)          → 투어 시작

투어 (5분 체험)
  Step 1  진단                /tour/1-diagnose
  Step 2  자문 체험            /tour/2-demo
  Step 3  산출물               /tour/3-deliverables
  Step 4  6개월 프로세스        /tour/4-process
  Step 5  Before / After      /tour/5-before-after
  Step 6  플랜 선택 + 상담      /tour/6-master
```

- **상단**: Progress Bar (1/6 · 진단 중)
- **하단**: Prev / Next 버튼 (sticky)
- **메뉴 없음**: 회사 사이트 느낌이 안 나도록 의도적으로 헤더 메뉴 제거

---

## Bolt에서 시작하기

1. zip 압축 풀어서 폴더 전체를 Bolt에 import
2. Supabase 프로젝트 만들고 아래 SQL 한 번 실행:

   ```sql
   create table if not exists leads (
     id          uuid primary key default gen_random_uuid(),
     name        text,
     email       text,
     phone       text,
     company     text,
     tier        text,
     status      text not null default 'diagnosing',
     metadata    jsonb default '{}'::jsonb,
     created_at  timestamptz default now(),
     updated_at  timestamptz default now()
   );

   create table if not exists turnkey_clicks (
     id          uuid primary key default gen_random_uuid(),
     source      text,
     created_at  timestamptz default now()
   );
   ```

3. `.env.example`을 `.env.local`로 복사하고 키 채우기
   - 비워둬도 투어는 동작합니다 (mock 모드)
   - Supabase 키만 채워도 lead capture만 작동
   - Anthropic 키까지 채우면 Step 2 채팅이 실제 LLM 응답으로 전환

4. `npm install && npm run dev`

---

## 새 스텝 추가 / 순서 변경

`lib/tour-config.ts`에서 `TOUR_STEPS` 배열 하나만 수정하면 됩니다.
ProgressBar, Prev/Next, 라우팅 전부 여기서 따라옵니다.

---

## 디자인 토큰

- 폰트: Pretendard Variable (CDN, globals.css에서 import)
- 컬러: `accent-500 (#0EA5E9)` 강조, `primary-*` 텍스트 스케일
- 폼팩터: max-width 1040px (tour) / 1200px (general)

`tailwind.config.ts`에서 일괄 관리.

---

## 의도적으로 빠진 것

회사 소개 페이지를 만들지 않기 위해 의도적으로 제외:

- ❌ Hero 섹션 (마케팅 카피)
- ❌ Service Stack (서비스 나열)
- ❌ How It Works (3-step 흐름도)
- ❌ Coverage / Social Proof (로고 모음)
- ❌ Final CTA 섹션
- ❌ 헤더 메뉴 (홈/서비스/도입문의/...)
- ❌ Footer (회사 정보, 인증, 연락처) — 투어 끝나면 e-hcg.com으로 유도

대신 모든 마케팅은 **투어 단계 안에서 맥락으로** 전달됩니다.
