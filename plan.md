# 🚀 Jabecha Events – Robust Master Plan

## 1. Vision & Product Goals

Build the #1 mobile-first platform for African-style funerals & events, blending event management (AllEvents), memorial/community (EverLoved), and service marketplace (Thumbtack).

**Success metrics (Year 1):**
1. 20 K monthly active users (MAU) across 5 African countries
2. 5 K events created; ≥80 % with at least one shared media asset or PDF program
3. Marketplace GMV ≥ $250 K with ≥100 verified vendors
4. NPS > 45, App-store rating ≥ 4.5

---

## 2. Technical Architecture

### Frontend
* React Native (Expo SDK 53)
* TypeScript (strict mode)
* React Navigation v6 (stack + bottom-tabs)
* React Native Paper for UI (theming & accessibility)
* Zustand for lightweight global state; React Query for server state & caching
* Form handling: React Hook Form + Zod (validation)

### Backend
* Firebase Auth (email/password)
* Firestore (events, users, listings, comments)
* Firebase Storage (images, PDF programs)
* Cloud Functions (serverless logic, notifications, PDF generation)
* OneSignal for push notifications
* 3rd-party integrations: WhatsApp deep links, Flutterwave / Paystack payments

### DevOps / Quality
* GitHub Actions CI: lint, type-check, unit tests, E2E (Detox)
* Release channels: dev → staging → production (Expo EAS)
* Sentry + Firebase Crashlytics
* eslint, prettier, husky pre-commit hooks
* Storybook for isolated UI work

---

## 3. Phased Roadmap & Milestones

Legend: ✅ MVP scope ⭐ Post-MVP 🚀 Scale

### Phase 1 — Foundation & Theming (Weeks 1–2)
* Project scaffolding, strict TypeScript, eslint/prettier, husky
* Custom Paper theme (`/src/theme/theme.ts`) ✅
* Base UI kit: `JButton`, `JInput`, `JScreen`, `JCard`, `JAvatar` ✅
* Navigation skeleton (AuthStack, MainTabs) ✅
* CI pipeline + automated testing scaffold ✅

### Phase 2 — Core Authentication (Weeks 3–4)
* Email/password signup, login, logout ✅
* Forgot-password email flow ✅
* Reusable auth screens with illustrations
* Session persistence, global user context ✅
* Basic profile screen (name, phone, avatar upload) ✅
* Unit & integration tests ✅

### Phase 3 — Event Management (Weeks 5–8)
* Event CRUD UI (title, date/time, venue, description, cover image) ✅
* Firestore security rules v1 ✅
* Host/guest role model & RSVP tracking ⭐
* Event list, calendar filtering, infinite scroll
* PDF Program Builder v1 (Cloud Function generates PDF) ✅
* QR code generator for event page ⭐
* Share sheet (WhatsApp, native share) ✅

### Phase 4 — Gallery & Media (Weeks 9–10)
* Multiple image picker (Expo ImagePicker) ✅
* Upload progress, offline retry queue ⭐
* Per-event gallery grid with pinch-zoom/lightbox
* Cloud Function to create thumbnails

### Phase 5 — Marketplace (Weeks 11–14)
* Vendor onboarding form ✅
* Listings browse & search (filters, map view)
* Vendor profile & reviews ⭐
* WhatsApp deep-link contact ✅
* Escrow / payments v0 using Flutterwave SDK ⭐
* Admin moderation dashboard 🚀

### Phase 6 — Notifications & Engagement (Weeks 15–16)
* OneSignal setup, device token capture ✅
* Event reminders via Cloud Function ✅
* Gallery comment replies & likes push ⭐
* Post-event “leave a review” notification ⭐

### Phase 7 — Testing, Hardening, Accessibility (Weeks 17–18)
* Full regression suite (Detox + Jest)
* Performance profiling (Flipper, Hermes)
* Accessibility audit (screen readers, contrast)
* Security review (Firestore rules, OWASP Mobile Top 10)

### Phase 8 — Launch & Growth (Weeks 19–20)
* Beta release to 200 seed users (TestFlight + Google Play Internal)
* Collect analytics (Firebase, Amplitude)
* Iterate on feedback, critical bug fixes
* Press kit & social media teaser
* Public launch on App Store & Play Store

---

## 4. Team & Roles
| Role | Responsibilities |
|------|------------------|
| Product Lead | Roadmap, scope, KPIs |
| Tech Lead | Architecture, code reviews, CI/CD |
| Mobile Dev ×2 | Feature implementation, tests |
| Design Lead | UX flows, UI kit, accessibility |
| QA Engineer | Test plans, automation, regression |
| Growth Marketer | Launch campaigns, ASO |
| Firebase/Cloud Eng | Firestore rules, Cloud Functions |

---

## 5. Development Conventions
* Git flow: `main` ↔ `dev` ↔ feature branches
* Conventional Commits (`feat:`, `fix:`)
* PR template with screenshots & test-plan checklist
* Branch naming: `feat/xyz`, `bug/xyz`, `chore/xyz`
* Storybook stories for every reusable UI component

---

## 6. Risk & Mitigation
| Risk | Impact | Mitigation |
|------|--------|------------|
| Poor network coverage | High | Offline caching, retry queues |
| Payment provider API changes | Medium | Abstract gateway interface, monitor updates |
| Cultural UX misalignment | High | Continuous user research, local beta testers |
| Platform store rejection | Medium | Guideline checklist, external QA review |
| Scope creep | High | Strict MVP gate, backlog grooming, weekly demos |

---

## 7. Next 2-Week Sprint Backlog

### Sprint 0 (current)
* Finish Expo scaffold (DONE)
* Add eslint/prettier, husky pre-commit hooks
* Create `/src` folder skeleton

### Sprint 1 (Phase 1 start)
* Implement custom Paper theme & typography
* Build `JButton`, `JInput`, `JScreen`
* Set up NavigationContainer with AuthStack/MainTabs
* Configure GitHub Actions CI (lint + test)

---

## 8. Communication & Cadence
* Daily stand-up (15 min) on Slack
* Weekly demo Friday
* Sprint retro & planning every 2 weeks
* Notion board for tasks; Figma for design; Linear/GitHub Projects for engineering boards 