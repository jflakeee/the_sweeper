# Project Stage Analysis — the_sweeper

**Date:** 2026-11-11 (Asia/Seoul)
**Stage:** Production (project.yaml에 설정된 값; 이번 진단에서 변경하지 않음)
**Observed stage:** Pre-Production — 첫 구역 A-01 프로토타입 검증 단계
**Stage Confidence:** CONCERNS — 설정 단계와 관찰 증거 불일치
**Analysis Scope:** 전체 프로젝트; standard / autonomous
**분석 기준 커밋:** 9801e1e0e24e4f35823f2cc07b372530ae2f1017

Claude Code 실행기 없이 설치된 `/project-stage-detect` 절차와 보조 스크립트를 수행했다. 실제 Claude Code 세션의 슬래시 명령 실행이나 단계 승인으로 취급하지 않는다.

## Completeness Overview

전체 완료율은 산정하지 않는다. 승인된 시스템 목록과 기능별 수용 기준의 실행 결과가 없어 분모가 확정되지 않았고, 파일 수는 완료율이 아니다.

| 영역 | 확인된 상태 | 남은 확인 |
|---|---|---|
| 설계 | 통합 설계 v1.1과 ForgeTax 분석 2개 기존 문서. 통합 설계 19·20절에 A단계 규격·예외·검수 사례 존재 | 시스템별 구현/미구현/검증 상태 연결, 오래된 상단 상태 문구 정리 |
| 코드 | game/ 실행 파일 4개: ES 모듈 2개, HTML 1개, CSS 1개 | 브라우저 전체 완주·모바일 실사용 검수 |
| 아키텍처 | 게임 규칙(core.mjs)과 화면·입력(app.mjs) 분리. 문서화된 ADR 0개 | 저장 원자성·백업·다중 탭·중단 복구의 핵심 결정 기록 |
| 생산 관리 | A-01 구현·검증 기록 1개; 정식 스프린트·마일스톤·스토리 0개 | 첫 구역 수용 기준과 우선순위를 연결한 검수 계획 |
| 테스트 | tests/core.test.mjs 1개, 6개 테스트 이번 재실행 통과 | 커버리지 비율 미측정; UI/E2E/실기기 테스트 미실시 |
| 배포 | 기존 커밋의 Pages 배포 및 공개 파일 일치는 직전 작업에서 확인됨 | 이번 진단 문서 배포는 별도 Actions 결과로 판정 |

## Stage Classification Rationale

**Configured stage:** Production (`project.yaml: project.stage`). 설치 시 기록된 값이며 게이트 통과 기록은 없다.

**Observed stage:** Pre-Production. Web 엔진과 실행 가능한 첫 구역이 있으나 로직 소스는 2개이며, 전체 완주·휴대폰 조작·저장 장애의 브라우저 검수가 남아 있다. 스킬의 10개 미만 소스 규칙도 이 단계에 해당한다. 다만 파일 개수를 늘리는 것이 단계 승격 조건은 아니다. 실제 수용 기준 검증이 우선이다.

기획 내용이 없어 Concept인 것은 아니다. 기존 통합 설계가 프레임워크 기본 경로 밖에 있으므로 내용을 직접 확인해 보정했다. 현재 상태는 **설계는 상세하지만 실행 검증은 초기인 프로젝트**다. 웹에 배포됐다는 사실만으로 Release/Polish로 판정하지 않는다.

## 자동 검사 결과와 보정

- `artifact-check.sh`: 7개 phase, 49개 step, 25개 NO_CHECK. 나머지 24개 중 기본 경로 기준 PRESENT 1개, ABSENT 23개. 이는 전체 티어 공통 존재 검사이며 standard의 필수 결함 개수가 아니다.
- `project-state.sh`: source_files=0, concept=absent, phase_inferred=concept를 출력했다.
- **코드 누락 원인:** `.claude/scripts/project-state.sh` 확장자 목록에 `.mjs`가 없다. 실제 `game/core.mjs`, `game/app.mjs`를 직접 확인했다. 0개 결과는 채택하지 않는다.
- **설계 경로 차이:** `design/gdd/game-concept.md`는 없지만 `docs/moon_sweepers_benchmark_design.md`에 콘셉트·핵심 시스템·A단계 명세가 존재한다. 통합 설계 전체를 없다고 판단하지 않는다.
- **CI 경로 차이:** `.github/workflows/tests.yml`은 없지만 `pages.yml`에서 `node --test tests/*.test.mjs`를 배포 전에 실행한다. 테스트 CI 부재로 판단하지 않는다.
- **프로토타입 경로 차이:** `prototypes/`는 없지만 `game/`이 현재 실행 프로토타입이다.
- 설치된 프레임워크 템플릿·레지스트리·엔진 참고 자료는 게임 제작 완료 산출물로 세지 않는다. 49개 에이전트·78개 스킬은 게임 기능 수가 아니다.

## Gaps Identified

1. **P0 — A단계 브라우저 수용 검증 미완료.** 청소→판매→개선→900 완주→재접속을 실제 UI로 끝까지 검증하지 않았다. 360 CSS px, 포인터 취소, 화면 회전, 백그라운드 복귀, 저장 실패 재시도, 다중 탭 잠금 확인이 필요하다.
2. **P0 — 테스트 범위 한계.** 6개 검사는 순수 로직 중심이다. 일부 적재/판매 테스트는 초기 먼지를 차감하지 않고 가방만 채운 fixture를 사용하므로 자원 보존까지 검증한 사례가 아니다. 유효한 상태에서 거래→persist→read를 연결하는 통합 사례를 보강해야 한다. 이 지적은 게임 결함 재현을 뜻하지 않는다.
3. **P1 — 시스템 인덱스 부재.** 통합 설계와 코드가 존재하지만 이동·청소·적재·거래·성장·완주·저장·입력의 구현/검증 근거를 연결한 목록이 없다. 기본 경로에 모든 문서를 복제하기보다 기존 절을 연결한다.
4. **P1 — Foundation ADR 부재.** localStorage 단일 snapshot, 이전 백업, Web Locks, 중단 시 손실 범위에 대한 선택 이유와 제약을 기록해야 한다. standard에서 필요한 핵심 결정만 다룬다.
5. **P1 — 상태 표시 불일치.** 통합 설계 첫머리는 아직 실행판 미구현으로 표시되어 현재 구현 상태 문서와 다르다. project.stage=Production 역시 실제 검증 단계와 차이가 있다. 이번에는 진단 사실만 기록하고 단계 값·GDD 승인 상태를 바꾸지 않았다.

standard 기준으로 별도 아트 바이블, 비핵심 UX 문서, 전체 엔진 문서, 모든 스프린트 양식의 부재를 필수 차단 사유로 삼지 않는다. Android 패키지·추가 구역·원정·확률 보너스·오디오·저장 import는 현 프로토타입 밖의 미구현 항목이며, 이번 진단에서 범위를 확대하지 않는다.

## Recommended Next Steps

1. `/map-systems`: 기존 통합 설계 19·20절 및 코드·테스트를 연결한 시스템 인덱스 작성. 설계됨/구현됨/자동검증됨/UI검증됨을 분리한다.
2. 첫 구역 안정화: 유효 상태 기반 거래·저장 통합 검사와 브라우저 전체 완주·360px·저장 오류·다중 탭 검수. 결함을 먼저 수정한다.
3. `/architecture-decision`: 저장·복구·동시 실행에 대한 핵심 ADR 작성. 기존 동작과 개선 제안을 구분한다.
4. 검수 결과를 바탕으로 단계 정합성을 재검토한다. 이 보고서는 게이트 승인이나 정식 출시 판정이 아니다.

## Appendix: File Counts by Directory

| 경로 | 게임 관련 실질 산출물 수 |
|---|---:|
| design/gdd/ | 0 |
| design/narrative/, design/levels/ | 각각 0 |
| docs/ 기존 통합 설계·벤치마크 분석 | 2 |
| game/ | 4 (동작 로직 ES 모듈 2) |
| docs/architecture/ ADR | 0 (레지스트리는 ADR 아님) |
| production/ 스프린트·마일스톤·스토리 | 각각 0 |
| tests/ | 1 파일 / 6 테스트 |
| prototypes/ | 0 (실제 실행판은 game/) |

소스 4개 파일의 물리적 줄 수는 36줄이나 여러 문장이 한 줄에 있어 규모·품질 지표로 쓰지 않았다. 테스트는 9줄이다. 퍼센트 커버리지는 측정하지 않았다.

## 실행 기록

- 설정 해석: workflow=standard, automation=autonomous, engine=Web, code_root=game.
- 실행: artifact-check.sh, project-state.sh, Node tests.
- 기존 사용자 지시와 autonomous 설정에 따라 진단 보고서 저장·커밋·배포를 진행한다.
- 이번 변경은 진단 문서와 공개 링크 연결이다. 게임 로직·프레임워크 스크립트·project.yaml은 수정하지 않는다.
