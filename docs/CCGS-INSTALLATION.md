# Claude Code Game Studios 설치 기록

- 설치 대상: the_sweeper 프로젝트 루트 (개인 전역 설정 아님).
- 원본: https://github.com/Donchitos/Claude-Code-Game-Studios
- 고정 커밋: abc0de79d6ceb0b5d7aa693945849b3937afbe6a
- 프레임워크 버전: 1.3.0; 스킬 폴더 78개(구 이름 호환 포함), 에이전트 49개.
- .claude 전체와 참조 문서·템플릿·studio-tests 포함. 기존 설계서와 게임 소스 보존. 원본 GitHub 워크플로는 가져오지 않음.
- MIT 라이선스: third_party/CCGS-LICENSE.
- 설정: Web, JavaScript, game/, tests/, standard, autonomous. 모바일 웹 우선, Android 패키지는 후속 작업.
- 자동 업데이트 확인은 끔. 업데이트는 고정 커밋을 검토하고 적용.
- JSON 구문, Bash 68개 구문, config resolver의 game/standard/autonomous 값 확인 완료.
- 현재 작업 환경에 claude 실행기가 없으므로 실제 Claude Code 세션·슬래시 명령·자동 훅 실행은 미검증.

## 사용

Claude Code가 설치된 PC에서 이 저장소를 pull한 뒤 **저장소 루트**에서 `claude`를 실행합니다.
`/project-stage-detect`로 기존 상태를 확인하고 `/map-systems`로 시스템 목록을 정리할 수 있습니다.
`/start`를 사용할 때 기존 프로젝트, Web, standard를 유지합니다. 새 게임으로 초기화하지 않습니다.
설치 자체는 /start를 실행하거나 GDD를 승인한 것으로 취급하지 않습니다.

사용자의 기존 지시: 작업 완료마다 검증·커밋·배포. 이미 허가된 변경은 반복 확인하지 않으며 실제 검증되지 않은 작업을 완료로 표시하지 않습니다.
