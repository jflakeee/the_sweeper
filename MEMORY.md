# the_sweeper — 프로젝트 메모리

갱신일: 2026-11-11 (한국). 이 파일은 다음 작업을 이어가기 위한 저장소 기록이다. 전체 대화 원문이나 ChatGPT 계정 메모리 변경을 뜻하지 않는다.

## 목표와 작업 원칙

- Moon Sweepers, King in the Mountain, ForgeTax 등을 참고한 독자 청소·회수 게임. 모바일 웹 우선, Android는 후속 대상.
- 기존 코드·설계·Git 기록을 보존한다.
- 사용자는 작업 완료마다 검증 → Git 커밋 → 배포 → 실제 반영 확인을 요청했다. 이미 허가된 작업에 반복 확인하지 않는다.
- 구현 완료, 자동 테스트, 커밋, 배포 성공, 실제 브라우저/실기기 검증을 분리해 보고한다. 수행하지 않은 검사를 통과로 표시하지 않는다.
- 보상은 현금 가치 없는 게임 크레딧. 현재 A단계에는 유료·무작위 보상이 없다. 원정·확률 보너스는 기본 플레이 검증 이후의 설계 실험이다.

## 기준 자료와 현재 상태

- 저장소: https://github.com/jflakeee/the_sweeper
- 실행판: https://jflakeee.github.io/the_sweeper/game/
- 설계 원본: docs/moon_sweepers_benchmark_design.md. A단계는 19절과 20절을 우선한다.
- 분석: docs/forgetax_deep_research.md
- 구현/검증 기록: docs/implementation_status.md
- 단계 진단: production/project-stage-report.md
- 기존 실행판·프레임워크 설치 커밋: 9801e1e0e24e4f35823f2cc07b372530ae2f1017. 해당 Pages 배포 성공 및 공개 파일 일치를 확인했다.

## 단계 진단 결과

설정은 Production이지만 관찰 단계는 **Pre-Production: 첫 구역 프로토타입 검증**이다. 신뢰 판정은 CONCERNS(설정과 증거 불일치). 이번 진단은 project.yaml 단계 변경·GDD 승인·출시 승인을 수행하지 않았다.

- 실행 파일: game/core.mjs, game/app.mjs, game/index.html, game/style.css.
- 이동·전방 자동 청소·적재90·기지 판매·처리율 개선50·먼지900 완주·보너스100·마지막 정리·저장/백업·다중 탭 잠금 구현.
- tests/core.test.mjs의 6개 자동 테스트 통과. 브라우저 실행·조이스틱 이동·일시정지/저장 UI는 확인했다.
- 전체 완주 UI, 360px 화면, Android 실기기, 성능, 저장 오류 UI, 다중 탭 경합은 미검증.
- Android 패키지, 추가 구역, 원정, 오디오, 저장 import는 미구현.
- 일부 적재/판매 단위 테스트 fixture는 전체 자원 보존을 만족하지 않으므로 유효 상태 기반 통합 테스트가 필요하다.
- 전체 완료율·테스트 커버리지 비율은 산정하지 않았다.

## Claude Code Game Studios

- 1.3.0, 원본 커밋 abc0de79d6ceb0b5d7aa693945849b3937afbe6a.
- 프로젝트 로컬 설치: .claude 파일582개, 스킬78개(호환 이름 포함), 에이전트49개.
- Web / JavaScript / game / tests / standard / autonomous.
- JSON·Bash68개 구문·설정 해석 검증 완료. 설치 당시 Claude 실행기가 없어 실제 Claude 세션·자동 훅·슬래시 명령은 미검증.
- 상세: docs/CCGS-INSTALLATION.md. 시작 시 기존 게임을 새 템플릿으로 초기화하지 않는다.

## 검사 도구의 오탐 주의

- project-state.sh가 .mjs를 세지 않아 source_files=0을 출력한다. 실제 동작 모듈은2개다. 코드를 없다고 판정하지 않는다.
- 통합 설계는 docs/에 있어 design/gdd 기본 경로 검사에서 누락된다.
- 테스트는 .github/workflows/pages.yml에서 실행한다. tests.yml이 없다고 CI 부재로 판정하지 않는다.
- 실행 프로토타입은 game/에 있다. prototypes/가 없다는 사실과 구분한다.
- 프레임워크 템플릿·레지스트리·엔진 참고 문서를 게임 완성 산출물로 세지 않는다.
- 통합 설계 첫머리의 실행판 미구현 문구는 현재 상태보다 오래된 기록이다. 현재 구현 상태는 implementation_status.md와 단계 보고서를 함께 확인한다.

## 다음 작업 순서

1. /map-systems: 기존 통합 설계 절과 코드·테스트를 연결해 시스템별 설계/구현/자동검증/UI검증 상태를 작성한다.
2. 첫 구역 안정화: 유효 상태의 거래·저장 통합 검사, 전체 완주·360px·입력 취소·회전·백그라운드·저장 실패·다중 탭 검사.
3. 저장·복구·단일 작성자 보호의 핵심 ADR 작성. 기존 동작과 개선 제안을 구분한다.
4. 증거를 바탕으로 단계 정합성 재검토. 파일 수를 늘려 단계 판정을 맞추지 않는다.

## 이어서 작업할 때

원격 main의 최신 커밋과 변경사항을 먼저 확인한다. 이 메모리 이후 추가 작업이 있으면 최신 코드·검증 기록을 우선한다. 이번 메모리 배포의 성공 여부는 해당 커밋의 Actions와 공개 파일로 확인하며, 작성 시점에 미래 배포 성공을 단정하지 않는다.
