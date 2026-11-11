# the_sweeper

모바일 웹 청소·회수 게임. 첫 착륙장 A-01 프로토타입입니다. Android 패키지는 미구현입니다.

- [게임 플레이](https://jflakeee.github.io/the_sweeper/game/)
- [통합 설계 v1.1](docs/moon_sweepers_benchmark_design.md)
- [구현·검증 범위](docs/implementation_status.md)
- [Claude Code Game Studios 설치 기록](docs/CCGS-INSTALLATION.md)

검사: `node --test tests/*.test.mjs`

Claude Code는 저장소 루트에서 실행합니다. `game/`과 기존 설계서를 유지하며 `/project-stage-detect`부터 사용할 수 있습니다. 설정은 Web / standard / autonomous입니다.

변경 검증 → 커밋 → GitHub Pages 배포 → 실제 배포 확인 순서로 진행합니다. 미검증 항목은 별도로 보고합니다.
