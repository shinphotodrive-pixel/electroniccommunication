import { MaxwellEquation, SemiconductorData, InterconnectData, KnowledgeItem, QuizQuestion } from '../types';

export const maxwellEquations: MaxwellEquation[] = [
  {
    id: 'gauss-electric',
    number: 1,
    name: '가우스 법칙 (전기장)',
    nameEn: "Gauss's Law for Electricity",
    formula: '∇ · E = ρ / ε₀',
    meaning: '공간 내 전하 밀도(ρ)가 전기장(E)의 발산(Divergence)을 유발하며, 임의의 폐곡면을 통과하는 순수 전기 선속은 폐곡면 내부의 총 전하량에 비례합니다.',
    application: '정전기학, 커패시터 정전용량 모델링, 반도체 PN 접합 공핍 영역(Depletion Region) 전계 분석',
    badge: '전하 & 전기장',
    accentColor: 'blue'
  },
  {
    id: 'gauss-magnetic',
    number: 2,
    name: '가우스 법칙 (자기장)',
    nameEn: "Gauss's Law for Magnetism",
    formula: '∇ · B = 0',
    meaning: '자기장(B)의 발산은 항시 0입니다. 즉, 자속선은 언제나 시작과 끝이 닫힌 폐루프를 형성하며 자연계에는 고립된 N극/S극 자기 홀극(Magnetic Monopole)이 존재하지 않습니다.',
    application: '인덕터 자속 폐쇄 회로 설계, 자기 차폐(Magnetic Shielding), 전파 원거리 방사 조건 규명',
    badge: '자기 비발산',
    accentColor: 'indigo'
  },
  {
    id: 'faraday',
    number: 3,
    name: '패러데이의 전자기 유도 법칙',
    nameEn: "Faraday's Law of Induction",
    formula: '∇ × E = -∂B / ∂t',
    meaning: '시간에 따라 변화하는 자기장(∂B/∂t)이 공간상에 소용돌이치는 회전 전기장(Curl of E)을 발생시킵니다. 마이너스 부호는 변화를 방해하려는 렌츠의 법칙을 의미합니다.',
    application: '발전기 및 변압기 결합, 상호 인덕턴스(Mutual Inductance), 무선 충전(Qi 전자기 유도)',
    badge: '전자기 유도',
    accentColor: 'emerald'
  },
  {
    id: 'ampere-maxwell',
    number: 4,
    name: '앙페르-맥스웰 법칙',
    nameEn: "Ampère-Maxwell Law",
    formula: '∇ × B = μ₀J + μ₀ε₀(∂E / ∂t)',
    meaning: '전도 전류 밀도(J)뿐만 아니라 시간에 따라 변화하는 전기장인 변위 전류(Displacement Current, ∂E/∂t)가 자기장의 회전을 유도합니다. 이로써 진공 속에서도 전자기파가 연속 자가 전파될 수 있습니다.',
    application: '커패시터 교류 도통 원리, 안테나 방사 이론, 무선 RF 전자기파 자유공간 전파',
    badge: '변위 전류 & 파동',
    accentColor: 'amber'
  }
];

export const semiconductorData: SemiconductorData[] = [
  {
    name: 'BJT (Bipolar Junction Transistor)',
    type: '전류 제어형 3단자 (NPN/PNP)',
    mechanism: '베이스에 주입되는 미세 소수 캐리어 전류(I_B)로 컬렉터의 대전류(I_C = β·I_B)를 선형 증폭.',
    limitation: '지속적인 베이스 바이어스 전류 유입으로 인한 높은 정적 전력 소모(Static Power), 낮은 집적도 한계.',
    application: '초저잡음 아날로그 오디오 프리앰프, 고선형성 RF 전력 증폭기(PA)',
    highlight: false
  },
  {
    name: 'Planar MOSFET',
    type: '전압 제어형 평면 2D 구조',
    mechanism: '게이트 산화막(SiO₂)을 통한 전계(E-field) 형성으로 소스-드레인 간 반전 채널을 형성하여 도통.',
    limitation: '20nm 이하 공정 스케일링 시 드레인 유도 장벽 감소(DIBL), 서브스레숄드 누설 전류 급증 등 단채널 효과(SCE) 발생.',
    application: '레거시 마이크로컨트롤러, 전력 스위치, 디스플레이 드라이버 IC(DDI)',
    highlight: false
  },
  {
    name: '3D FinFET',
    type: '3차원 입체 핀(Fin) 게이트',
    mechanism: '실리콘 채널을 물고기 지느러미 형태 3D 돌출 구조로 제작하여 게이트가 채널의 3면을 감싸 정전기적 통제력 강화.',
    limitation: '3nm 이하 스케일링 진입 시 핀 하부 누설 전류 발생 및 Fin 피치 미세화에 따른 게이트 커패시턴스 한계 봉착.',
    application: '7nm, 5nm, 3nm 주력 AP 및 GPU (Apple M시리즈, NVIDIA Hopper, 삼성 4nm)',
    highlight: false
  },
  {
    name: 'GAAFET (Nanosheet / MBCFET)',
    type: '차세대 4면 전방위 게이트',
    mechanism: '수평으로 적층된 다층 나노시트(Nanosheet) 와이어를 게이트 산화막이 4면 전체(Gate-All-Around)를 빈틈없이 포위.',
    limitation: '극도로 복잡한 수직 에칭 및 나노시트 부유 공정 난도, 후면 전력 공급망(BS-PDN)과의 복합 설계 요구.',
    application: 'TSMC 2nm (N2), 삼성 3nm/2nm MBCFET, 인텔 20A/18A (RibbonFET), 최첨단 AI 가속기',
    highlight: true
  },
  {
    name: 'SiC / GaN (와이드 밴드갭 전력 반도체)',
    type: 'Wide Bandgap (WBG) 화합물',
    mechanism: '실리콘(1.1eV) 대비 훨씬 넓은 에너지 밴드갭(SiC 3.2eV, GaN 3.4eV)으로 고전압 절연 파괴 강도 및 전자 이동도 극대화.',
    limitation: '원자재 기판(Wafer) 단가가 높고 결함 밀도 관리가 까다로우나, 전체 시스템 효율 및 방열 소형화로 정당화.',
    application: 'SiC: 전기차(EV) 트랙션 인버터, 고전압 태양광 / GaN: 초고속 소형 충전기, 5G/6G 기지국 고효율 RF PA',
    highlight: false
  }
];

export const interconnectComparison: InterconnectData[] = [
  {
    title: 'DAC',
    titleEn: 'Direct Attach Copper',
    badge: '구리선 직접 연결',
    badgeColor: 'amber',
    distance: '초단거리 (≤ 3m)',
    features: '동축 트윈액스(Twinax) 구리 케이블 양단에 커넥터를 결합하여 서버 랙 내부 탑오브랙(ToR) 스위치와 서버를 직결.',
    advantages: '광모듈 변환 없이 전기 신호 그대로 전송하므로 전력 소모가 사실상 0W에 수렴, 레이턴시 극소화, 최고의 가격 경쟁력.',
    limitations: '전송 속도가 800Gbps, 1.6Tbps로 올라갈수록 도체 표피 효과(Skin Effect)와 유전체 손실로 도달 거리가 1~2m 내로 급격히 단축.',
    application: 'AI 서버 랙 내부 GPU 간 NVLink 연결 및 ToR 스위치 직결'
  },
  {
    title: 'AOC',
    titleEn: 'Active Optical Cable',
    badge: '일체형 액티브 광케이블',
    badgeColor: 'blue',
    distance: '중단거리 (3m ~ 100m)',
    features: '케이블 양단 커넥터 내부에 광 트랜시버(VCSEL 레이저 + 포토다이오드)가 일체형으로 내장되어 전기 신호를 광 신호로 자동 변환.',
    advantages: '광섬유를 사용하여 매우 가볍고 유연하며 배선 용이, 구리선 대비 전자파 간섭(EMI)이 전무하여 데이터 무결성 보장.',
    limitations: '양단 트랜시버 모듈에서 지속적으로 전력(포트당 수 W)을 소비하며, 광-전 변환 레이턴시와 발열 관리 필요.',
    application: '데이터센터 랙 간(Row-to-Row) 스위치 상호 연결, 슈퍼컴퓨터 InfiniBand 패브릭'
  },
  {
    title: 'CPO',
    titleEn: 'Co-Packaged Optics',
    badge: '실리콘 포토닉스 통합 패키징',
    badgeColor: 'purple',
    distance: '랙 내부 ~ 데이터센터 전반 (1m ~ 2km)',
    features: '스위치 ASIC 반도체 다이(Die)와 초소형 광학 엔진(Optical Engine)을 동일 인터포저 기판 위에 원칩 수준으로 동시 패키징.',
    advantages: '기판 위 구리 배선 트레이스 길이를 수십 cm에서 수 mm로 단축하여 신호 감쇠 극소화, 인터커넥트 전력 소모를 30~50% 획기적으로 절감.',
    limitations: '레이저 결함 시 고가의 스위치 전체를 교체해야 하는 보수성 문제(External Laser Source 분리 연구), 초정밀 광섬유 결합 패키징 공정 난이도.',
    application: '차세대 51.2Tbps / 102.4Tbps 초거대 AI 클러스터(NVIDIA, Broadcom, Intel 차세대 스위치)'
  }
];

export const knowledgeData: KnowledgeItem[] = [
  {
    id: 'k1',
    cat: 'theory',
    catLabel: '전자기학',
    title: '가우스 전기장 법칙',
    eq: '∇ · E = ρ / ε₀',
    desc: '전하 밀도가 전기장을 생성하며 임의의 폐곡면을 통과하는 전기 선속은 내부 전하량에 비례합니다.',
    tags: ['Maxwell', 'Gauss', '전기장', 'Divergence']
  },
  {
    id: 'k2',
    cat: 'theory',
    catLabel: '전자기학',
    title: '가우스 자기장 법칙',
    eq: '∇ · B = 0',
    desc: '자기장의 발산은 항시 0이며 자기 홀극(Monopole)이 자연계에 존재하지 않음을 수학적으로 입증합니다.',
    tags: ['Maxwell', '자기장', '자속선', '폐루프']
  },
  {
    id: 'k3',
    cat: 'theory',
    catLabel: '전자기학',
    title: '패러데이 전자기 유도 법칙',
    eq: '∇ × E = -∂B / ∂t',
    desc: '시간에 따라 변화하는 자기장이 회전하는 전기장을 유도하며 유도기전력을 발생시키는 발전기의 원리입니다.',
    tags: ['Maxwell', 'Faraday', '전자기유도', 'Curl']
  },
  {
    id: 'k4',
    cat: 'theory',
    catLabel: '전자기학',
    title: '앙페르-맥스웰 법칙',
    eq: '∇ × B = μ₀J + μ₀ε₀(∂E / ∂t)',
    desc: '전도 전류뿐만 아니라 변위 전류(변화하는 전기장)가 자기장을 유도하여 진공 중 전자기파 전파를 가능케 합니다.',
    tags: ['Maxwell', '변위전류', '전자기파', '파동방정식']
  },
  {
    id: 'k5',
    cat: 'theory',
    catLabel: '회로이론',
    title: '공진 주파수 및 Q인자',
    eq: 'f₀ = 1 / (2π√(LC)), Q = f₀ / BW',
    desc: '직렬 RLC에서 유도 리액턴스와 용량 리액턴스가 상쇄되어 임피던스가 최소(R)가 되며 전류가 최대가 됩니다.',
    tags: ['RLC', 'Resonance', '공진', 'Q-Factor']
  },
  {
    id: 'k6',
    cat: 'semicon',
    catLabel: '반도체',
    title: 'CMOS 동적 전력 소모 공식',
    eq: 'P_dyn = α · C_L · V_dd² · f',
    desc: '디지털 로직 스위칭 시 부하 커패시터 충방전에 의한 전력 소모이며, 전압의 제곱에 비례하므로 전압 스케일링이 핵심입니다.',
    tags: ['CMOS', 'Dynamic Power', '저전력', '스케일링']
  },
  {
    id: 'k7',
    cat: 'semicon',
    catLabel: '반도체',
    title: 'GAAFET (나노시트 아키텍처)',
    eq: '4-Side Gate All Around',
    desc: 'FinFET의 3면 게이트 한계를 극복하고 수평 나노시트 4면 전체를 게이트가 감싸 2nm 이하 누설 전류를 억제합니다.',
    tags: ['GAAFET', 'Nanosheet', 'FinFET', '2nm']
  },
  {
    id: 'k8',
    cat: 'semicon',
    catLabel: '반도체',
    title: '와이드 밴드갭 (SiC & GaN)',
    eq: 'Eg: Si(1.1eV) vs SiC(3.2eV) / GaN(3.4eV)',
    desc: '광범위한 에너지 밴드갭을 통해 고전압 파괴 전계와 고주파 전자 이동도를 확보하여 전기차 및 통신 효율을 극대화합니다.',
    tags: ['SiC', 'GaN', 'WBG', '전력반도체']
  },
  {
    id: 'k9',
    cat: 'conversion',
    catLabel: '아날로그',
    title: 'Op-Amp 반전 증폭기 이득',
    eq: 'Gain = -R_f / R_in',
    desc: '가상 접지(Virtual Ground) 특성과 부성 귀환을 통해 입력 신호를 반전 증폭하며 출력 임피던스가 매우 낮습니다.',
    tags: ['Op-Amp', 'Inverting', '가상접지', '이득']
  },
  {
    id: 'k10',
    cat: 'conversion',
    catLabel: '아날로그',
    title: 'Op-Amp 비반전 증폭기 이득',
    eq: 'Gain = 1 + (R_f / R_in)',
    desc: '동위상 증폭기로서 매우 높은 입력 임피던스를 가져 신호원 부하 효과를 방지하는 완충 증폭기로 사용됩니다.',
    tags: ['Op-Amp', 'Non-Inverting', 'Buffer', '임피던스']
  },
  {
    id: 'k11',
    cat: 'conversion',
    catLabel: '데이터변환',
    title: 'ADC 최소 계단 분해능 (LSB)',
    eq: 'LSB = V_ref / 2ⁿ',
    desc: 'n비트 분해능의 아날로그-디지털 변환기에서 최하위 비트가 감지할 수 있는 최소 아날로그 양자화 전압 단위입니다.',
    tags: ['ADC', 'LSB', 'Quantization', '양자화']
  },
  {
    id: 'k12',
    cat: 'conversion',
    catLabel: '데이터변환',
    title: '유효 비트 수 (ENOB)',
    eq: 'ENOB = (SNR_dB - 1.76) / 6.02',
    desc: '이상적인 양자화 잡음뿐만 아니라 실측 노이즈, 왜곡(THD)을 종합적으로 고려한 ADC의 실제 유효 분해능 지표입니다.',
    tags: ['ADC', 'ENOB', 'SNR', 'SNDR']
  },
  {
    id: 'k13',
    cat: 'rf',
    catLabel: 'RF통신',
    title: '산란 계수 (S-Parameters)',
    eq: 'S₁₁ = 반사 계수, S₂₁ = 전달 이득',
    desc: '고주파 분포 정수 회로에서 진행파와 반사파의 비율로 정의되며, S11이 -20dB 이하일 때 이상적인 정합 상태로 평가됩니다.',
    tags: ['S-Parameter', 'Return Loss', 'S11', 'S21']
  },
  {
    id: 'k14',
    cat: 'rf',
    catLabel: 'RF통신',
    title: '50 Ω 표준 임피던스 선정 배경',
    eq: '30 Ω (최대전력) ↔ 77 Ω (최소손실)',
    desc: '동축선로에서 전력 전송 용량이 최대가 되는 30Ω과 고주파 감쇠 손실이 최소화되는 77Ω 사이의 절충점입니다.',
    tags: ['50 Ohm', 'RF', '동축케이블', '임피던스']
  },
  {
    id: 'k15',
    cat: 'rf',
    catLabel: 'RF통신',
    title: '프리스 연쇄 잡음 공식 (Friis)',
    eq: 'F_total = F₁ + (F₂ - 1)/G₁ + (F₃ - 1)/(G₁G₂)',
    desc: '수신단 전체의 잡음 지수는 첫 단 저잡음 증폭기(LNA)의 잡음 특성과 이득에 의해 지배됨을 규명하는 핵심 정리입니다.',
    tags: ['Friis', 'Noise Figure', 'LNA', '수신기']
  },
  {
    id: 'k16',
    cat: 'rf',
    catLabel: 'RF통신',
    title: '자유공간 경로 손실 (FSPL)',
    eq: 'FSPL (dB) = 20 log₁₀(4πd / λ)',
    desc: '통신 거리가 2배 증가할 때마다 수신 전력이 1/4배(6dB 감소)로 감쇠하며, 반송파 주파수가 높을수록 손실이 가속됩니다.',
    tags: ['FSPL', 'Path Loss', '전파감쇠', '거리']
  },
  {
    id: 'k17',
    cat: 'info',
    catLabel: '정보이론',
    title: '섀넌-하틀리 채널 용량 법칙',
    eq: 'C = B · log₂(1 + S/N)',
    desc: '가우시안 잡음 환경에서 주어진 대역폭(B)과 SNR로 달성할 수 있는 물리적 최대 무오류 정보 전송 속도의 이론적 상한선입니다.',
    tags: ['Shannon', 'Channel Capacity', 'Bps', '대역폭']
  },
  {
    id: 'k18',
    cat: 'info',
    catLabel: '정보이론',
    title: '절대 섀넌 한계 (Shannon Limit)',
    eq: '최소 Eb/N₀ = ln 2 ≈ -1.6 dB',
    desc: '대역폭이 무한대로 확장되더라도 Eb/N0가 -1.6dB 미만이면 어떠한 부호화 기법으로도 에러 없는 통신이 불가능합니다.',
    tags: ['Shannon Limit', 'Eb/N0', '-1.6dB', '부호화']
  },
  {
    id: 'k19',
    cat: 'info',
    catLabel: '정보이론',
    title: 'MIMO 공간 다중화 (Spatial Multiplexing)',
    eq: 'C_mimo ≈ min(Nt, Nr) · C_siso',
    desc: '송수신 다중 안테나를 통해 대역폭을 추가로 소모하지 않고 독립적인 공간 경로를 생성하여 전송 용량을 선형 증대시킵니다.',
    tags: ['MIMO', 'Multiplexing', '공간다중화', '5G/6G']
  },
  {
    id: 'k20',
    cat: 'optical6g',
    catLabel: '광통신',
    title: 'CPO (Co-Packaged Optics)',
    eq: '광학 엔진 + ASIC 동축 패키징',
    desc: '구리선 전기 배선 손실을 원천 제거하기 위해 스위치 프로세서와 실리콘 포토닉스 광 트랜시버를 동일 기판에 통합 패키징합니다.',
    tags: ['CPO', 'Silicon Photonics', 'AI데이터센터', '저전력']
  },
  {
    id: 'k21',
    cat: 'optical6g',
    catLabel: '6G통신',
    title: 'RIS (지능형 반사 표면)',
    eq: 'Reconfigurable Intelligent Surface',
    desc: '초저전력 수동형 메타물질 배열을 벽면에 장착하여 테라헤르츠(THz) 전파의 위상과 각도를 제어, 음영 지역을 빔스티어링 극복합니다.',
    tags: ['RIS', 'Metamaterial', '6G', 'THz', 'NLoS']
  },
  {
    id: 'k22',
    cat: 'optical6g',
    catLabel: '광통신',
    title: '파장 분할 다중화 (WDM)',
    eq: 'DWDM (0.8nm 채널 간격) / CWDM',
    desc: '단일 광섬유 코어에 서로 다른 수십~수백 개의 광 파장(Laser Wavelength)을 동시에 전송하여 테라비트급 백본망을 구축합니다.',
    tags: ['WDM', 'DWDM', '광섬유', '백본']
  },
  {
    id: 'k23',
    cat: 'power',
    catLabel: '전력설계',
    title: '태양광 패널(PV) 용량 결정식',
    eq: 'P_panel (Wp) = (E_daily × S) / (T_sun × η_ctrl × η_loss)',
    desc: '일일 총 소모 에너지(Wh), 일평균 피크 일조시간(PSH), 컨트롤러 변환 효율(MPPT 96% vs PWM 75%), 먼지·온도 손실을 종합하여 최소 필요 패널 피크 와트(Wp)를 산출합니다.',
    tags: ['Solar', 'PV', 'Wp', 'MPPT', '소모전력']
  },
  {
    id: 'k24',
    cat: 'power',
    catLabel: '전력설계',
    title: '독립형 배터리 뱅크 용량 산출식',
    eq: 'C_battery (Ah) = (E_daily × N_autonomy) / (V_sys × DoD × η_temp)',
    desc: '연속 흐림/우천 무일조 자립 일수(N_autonomy), 시스템 전압(12V), 배터리 방전 심도(DoD: 인산철 85% vs 납축 50%), 동절기 저온 효율을 감안한 필수 배터리 용량을 결정합니다.',
    tags: ['Battery', 'LiFePO4', 'DoD', 'Ah', '독립형전원']
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'RF 통신',
    q: '다단 수신 시스템에서 전체 시스템 잡음 지수(Noise Figure)를 지배하므로 수신 안테나 바로 직후에 배치해야 하는 핵심 소자는 무엇인가?',
    options: ['고전력 증폭기 (PA)', '저잡음 증폭기 (LNA)', '축차 비교형 ADC', '파장 분할 다중화기 (WDM)'],
    ans: 1,
    explain: '프리스 연쇄 공식(Friis Cascade Formula)에 의해 2번째 단 이후의 모든 잡음 지수는 첫 번째 단의 이득(G1)으로 나누어집니다. 따라서 수신 안테나 직후에 저잡음이면서 고이득을 갖는 LNA를 배치해야 전체 시스템의 NF 열화를 막을 수 있습니다.'
  },
  {
    id: 2,
    category: 'RF 회로',
    q: 'RF 고주파 동축 케이블 전송선로에서 50 Ω이 글로벌 표준 임피던스로 지정된 물리적 근거는 무엇인가?',
    options: [
      '최대 전류 전송(10Ω)과 최소 저항(100Ω)의 단순 산술 평균',
      '최대 전력 전송 효율(약 30Ω)과 최소 신호 감쇠 손실(약 77Ω) 사이의 최적 절충점',
      '초기 동축 케이블을 만들 때 사용한 유전체 절연막의 고유 파괴 저항값',
      '안테나 공진 주파수(LC) 계산식을 1로 단순화하기 위해 합의된 값'
    ],
    ans: 1,
    explain: '동축 전송선로의 기하학적 수식에 따르면 공기 절연 기준 최대 전력 내압 전송은 약 30Ω에서 발생하고, 전송 손실(Attenuation)이 가장 작은 지점은 약 77Ω입니다. 50Ω은 전력 전송성과 저손실성을 모두 충족하는 최적의 기하학적 타협 표준입니다.'
  },
  {
    id: 3,
    category: '전파 전파',
    q: '자유공간 경로 손실(FSPL) 이론에 따르면, 송수신 안테나 간 통신 거리가 2배로 멀어질 때 발생하는 신호 수신 전력의 손실 변화량은?',
    options: ['3 dB 감소 (전력 1/2배)', '6.02 dB 손실 증가 (수신 전력 1/4배)', '10 dB 손실 증가 (수신 전력 1/10배)', '주파수에 무관하게 변화 없음'],
    ans: 1,
    explain: 'FSPL(dB) = 20 log10(d) 공식에 의해 거리 d가 2배가 되면 20 log10(2) ≈ 6.02 dB 의 추가 경로 손실이 발생하며, 이는 선형 전력으로 환산 시 1/4 (25%) 수준으로 격감함을 의미합니다.'
  },
  {
    id: 4,
    category: '정보이론',
    q: '대역폭이 무한대로 넓어지더라도 어떠한 채널 부호화(오류 정정 코딩)로도 무오류 통신이 물리적으로 불가능한 절대 섀넌 한계(Shannon Limit)의 최소 Eb/N0 값은?',
    options: ['0 dB', '-1.59 dB (약 -1.6 dB)', '-3.01 dB', '-10.0 dB'],
    ans: 1,
    explain: '섀넌 용량 극한 식에 따르면 비트당 신호 에너지 대 잡음 전력 밀도 비(Eb/N0)의 최소 이론적 극한은 ln 2 ≈ 0.6931 이며, 이를 데시벨로 환산하면 10 log10(ln 2) ≈ -1.59 dB (약 -1.6 dB) 입니다.'
  },
  {
    id: 5,
    category: '반도체 공정',
    q: '2nm 이하 차세대 로직 반도체에서 기존 3D FinFET의 3면 게이트 통제력 한계를 극복하기 위해 나노시트를 수평 적층하여 채널 4면 전체를 포위하는 소자 아키텍처는?',
    options: ['BJT', 'Planar MOSFET', 'GAAFET (Gate-All-Around / MBCFET)', 'Dual-Slope ADC'],
    ans: 2,
    explain: 'GAAFET(Gate-All-Around FET, 삼성 MBCFET / 인텔 RibbonFET)은 핀 대신 여러 장의 나노시트를 수평으로 층층이 쌓고 게이트 산화막이 채널 4면을 완전히 감싸 극초미세 공정에서도 드레인 유도 장벽 감소(DIBL)와 누설 전류를 완벽에 가깝게 차단합니다.'
  },
  {
    id: 6,
    category: '6G 인프라',
    q: '6G 테라헤르츠(THz) 대역의 심각한 직진성과 건물 장애물로 인한 전파 음영 지역(Blind Spot)을 극복하기 위해, 전파를 증폭하지 않고 수동형 메타물질 소자로 위상을 능동 조향하는 초저전력 기술은?',
    options: ['CPO (Co-Packaged Optics)', 'RIS (Reconfigurable Intelligent Surface / 지능형 반사 표면)', 'CWDM 필터', 'SAR ADC'],
    ans: 1,
    explain: 'RIS는 수천 개의 초저전력 전자 제어 메타물질 단위 셀로 구성되어, 테라헤르츠 고주파 전파가 벽면에 부딪힐 때 반사 각도와 위상을 능동적으로 조작하여 신호 증폭 노이즈 없이 건물 모퉁이 뒤의 수신 단말로 빔을 꺾어주는(Beam Steering) 차세대 무선 환경 제어 기술입니다.'
  }
];
