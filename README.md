# 전자 및 통신 공학 종합 지식 탐색기 (Electronic & Telecommunication Engineering Explorer)

맥스웰 방정식, 반도체 소자(GAAFET), 아날로그 및 ADC, RF 전파 경로 손실, 섀넌 정보이론, 6G RIS 무선 인프라 및 지능형 교통안내 시스템(레이더/카메라/LED 안내판) 소모전력 및 독립형 태양광·배터리 설계를 대화형으로 시뮬레이션하고 학습할 수 있는 엔지니어링 웹 플랫폼입니다.

---

## 🚀 주요 기능 및 핵심 모듈

### 1. 전자기학 & 맥스웰 방정식 (Electromagnetics)
- 가우스 법칙(전계/자계), 패러데이 유도 법칙, 앙페르-맥스웰 법칙의 미분형/적분형 수식 및 물리적 의미 해설
- 전자기파(EM Wave) 전파 원리 및 유전체·도체 경계 조건 시각화

### 2. 반도체 물성 & 트랜지스터 진화 (Semiconductors)
- 평면 MOSFET → 3D FinFET → MBCFET / GAAFET(Gate-All-Around) 구조적 진화 과정
- 단채널 효과(SCE) 억제 원리 및 에너지 밴드 다이어그램(Conduction Band, Valence Band, Fermi Level)

### 3. 아날로그 신호처리 & 데이터 변환 (Analog & ADC)
- 이상적 연산증폭기(Op-Amp) 특성 및 반전/비반전 증폭 회로 해석
- 나이퀴스트-섀넌 표본화 정리(Nyquist-Shannon Sampling Theorem)와 에일리어싱 방지
- 양자화 분해능 및 이론적 최대 신호 대 잡음비(SNR = 6.02N + 1.76 dB)

### 4. 고주파(RF) 회로 & 전파 통신 (RF & Propagation)
- 프리스 자유공간 경로 손실(Friis Free Space Path Loss) 방정식 시뮬레이터
- 스미스 차트(Smith Chart) 기반 복소 임피던스 정합 원리 및 $S$-파라미터($S_{11}$, $S_{21}$)

### 5. 정보이론 & 대용량 MIMO (Information Theory)
- 섀넌 채널 용량 공식($C = B \log_2(1 + \text{SNR})$) 및 대역폭-전력 트레이드오프 분석
- 대규모 다중입출력(Massive MIMO) 공간 다중화 및 제로포싱(Zero-Forcing) 빔포밍 기법

### 6. 광통신 & 차세대 6G 인프라 (Optical & 6G)
- 광섬유 전송 전파 감쇠($\alpha \approx 0.2\text{ dB/km}$ @ 1550nm) 및 DWDM(고밀도 파장분할다중화)
- 6G 재구성 가능 지능형 표면(RIS / Reconfigurable Intelligent Surface) 메타물질 반사 제어

### 7. 소모전력 정밀 분석 & 독립형 태양광·배터리 설계 (Power & Solar Sizing)
- **주요 구성품 전력 수지 계산**:
  - 레이더 센서: Hi-Link HLK-LD2451 (5V 107mA, 0.535W)
  - LED 안내판 PCBA: 1단 1열 188 LED 전용 PCB (12V 200mA, 2.4W)
  - 셔터링 카메라: OnSemi AR0234 글로벌 셔터 (5V 200mA, 1.0W)
  - 메인 제어보드: 라즈베리파이 5(7.5W) vs ESP32 저전력 MCU(0.6W) 실시간 비교
  - 태양광 컨트롤러 대기전력: 12V 10A MPPT/PWM (12mA, 0.144W)
- **태양광 패널($W_p$) 사양 결정식**:
  $$P_{\text{panel}} (\text{W}_p) = \frac{E_{\text{daily}} \times S_{\text{margin}}}{T_{\text{sun}} \times \eta_{\text{ctrl}} \times \eta_{\text{loss}}}$$
- **배터리($Ah$) 사양 결정식**:
  $$C_{\text{battery}} (\text{Ah}) = \frac{E_{\text{daily}} \times N_{\text{autonomy}}}{V_{\text{system}} \times \text{DoD} \times \eta_{\text{temp}}}$$
- 인산철(LiFePO4, DoD 85%) 및 납축전지(DoD 50%) 화학종별 비교 및 피크 일조시간(PSH) 슬라이더 지원

### 8. math.js 기반 공학 계산기 도구 모음 (Engineering Calculator Suite)
- **프리스(Friis) 전파 경로손실 계산기**: 송신 전력($P_t$), 안테나 이득($G_t, G_r$), 주파수(24GHz 레이더/5G mmWave), 거리에 따른 수신 전력($P_r$) 및 링크 마진(Link Margin) 실시간 산출
- **섀넌(Shannon) 용량 & MIMO 스펙트럼 효율**: 대역폭, SNR, MIMO 다중 스트림($N_t \times N_r$)에 따른 최대 전송 속도(Mbps/Gbps) 및 주파수 효율(bps/Hz)
- **독립형 태양광 & 배터리 수지 계산기**: 시스템 부하, 가동 시간, 피크 일조시간(PSH), 무일조 일수, 방전심도(DoD)를 반영한 최적 패널($W_p$) 및 배터리($Ah$) 용량
- **ADC 양자화 & ENOB 계산기**: 분해능($N$), 기준전압($V_{\text{ref}}$) 기반 1 LSB 전압, 이론적 최대 SNR($6.02N + 1.76\text{ dB}$), 실측 SINAD에 따른 유효 비트 수(ENOB)
- **자유 수식 실시간 샌드박스 (Live Evaluator)**: `math.evaluate()`를 활용하여 임의의 공학 수식, 물리 상수($c, \mu_0, \varepsilon_0$) 및 전자 회로 공식을 실시간 평가

---

## 🛠️ 기술 스택

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Scientific Computing**: math.js
- **Visualization & Animation**: Recharts, D3.js, Lucide React, Motion
- **Build & Dev Tool**: Vite, Node.js

---

## 💻 실행 방법 (로컬 환경)

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행 (포트 3000)
npm run dev

# 프로덕션 빌드
npm run build
```
