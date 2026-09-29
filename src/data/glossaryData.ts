import { GlossaryTerm } from '../types';

export const glossaryTerms: GlossaryTerm[] = [
  // 1. Electromagnetics & Circuits
  {
    id: 'maxwell',
    termKo: '맥스웰 방정식',
    termEn: "Maxwell's Equations",
    acronym: 'Maxwell',
    category: 'theory',
    sectionTitle: '1. 전자기학 & 회로',
    definition: '전기장과 자기장의 상호작용, 전하 밀도, 변위 전류가 만드는 전자기파 전파의 물리적 법칙을 4개의 편미분 방정식으로 통합한 전자기학의 기초.',
    keyPoints: ['가우스 전기장 법칙 (∇·E=ρ/ε₀)', '가우스 자기장 법칙 (∇·B=0)', '패러데이 유도 법칙 (∇×E=-∂B/∂t)', '앙페르-맥스웰 법칙 (∇×B=μ₀J+μ₀ε₀∂E/∂t)'],
    formulaOrSpec: '∇ × B = μ₀J + μ₀ε₀(∂E/∂t)'
  },
  {
    id: 'displacement-current',
    termKo: '변위 전류',
    termEn: 'Displacement Current',
    acronym: 'J_D',
    category: 'theory',
    sectionTitle: '1. 전자기학 & 회로',
    definition: '실제 전하의 이동 없이 시간에 따라 변화하는 전기장(∂E/∂t)이 가상 전류처럼 작용하여 주위에 자기장을 유도하는 현상. 진공 중에서 전자기파가 자가 전파될 수 있는 근거.',
    keyPoints: ['맥스웰의 앙페르 법칙 수정항', '커패시터 유전체 절연막 교류 도통 원리', '빛의 속도 c = 1/√(μ₀ε₀) 유도'],
    formulaOrSpec: 'J_D = ε₀(∂E/∂t)'
  },
  {
    id: 'quality-factor',
    termKo: '품질 계수 (Q 인자)',
    termEn: 'Quality Factor',
    acronym: 'Q-Factor',
    category: 'theory',
    sectionTitle: '1. 전자기학 & 회로',
    definition: '공진 회로 또는 필터에서 저장된 에너지 대비 주기당 소모 에너지의 비. Q가 높을수록 통과 대역폭이 좁아지고 주파수 선택도(Selectivity)가 예리해짐.',
    keyPoints: ['Q = f₀ / BW', '직렬 RLC: Q = (1/R)·√(L/C)', 'High Q는 협대역 고선택성, Low Q는 광대역 필터'],
    formulaOrSpec: 'BW = f₀ / Q'
  },
  {
    id: 'rlc-resonance',
    termKo: 'RLC 공진',
    termEn: 'RLC Resonance',
    acronym: 'Resonance',
    category: 'theory',
    sectionTitle: '1. 전자기학 & 회로',
    definition: '교류 회로에서 인덕턴스(L)의 유도 리액턴스와 커패시턴스(C)의 용량 리액턴스가 동일한 크기로 서로를 완전히 상쇄하여 임피던스가 순수 저항(R)만 남아 전류가 최대가 되는 상태.',
    keyPoints: ['공진 조건: ω₀L = 1/(ω₀C)', '공진 주파수: f₀ = 1/(2π√(LC))', '무선 수신 튜너 및 발진기 핵심'],
    formulaOrSpec: 'f₀ = 1 / (2π√(LC))'
  },
  {
    id: 'char-impedance',
    termKo: '특성 임피던스',
    termEn: 'Characteristic Impedance',
    acronym: 'Z₀',
    category: 'theory',
    sectionTitle: '1. 전자기학 & 회로',
    definition: '고주파 전송선로를 따라 전파되는 전압 진행파와 전류 진행파의 순시 진폭 비. 무손실 선로에서 Z₀ = √(L/C)로 주어지며 반사 없는 정합을 위해 부하와 일치시켜야 함.',
    keyPoints: ['무손실 동축선: Z₀ = √(L/C)', 'RF 표준: 50 Ω', '불일치 시 정재파(Standing Wave) 발생'],
    formulaOrSpec: 'Z₀ = √(L / C)'
  },

  // 2. Semiconductor & IC
  {
    id: 'cmos-power',
    termKo: 'CMOS 동적 전력 소모',
    termEn: 'CMOS Dynamic Power Dissipation',
    acronym: 'P_dyn',
    category: 'semicon',
    sectionTitle: '2. 반도체 & 집적회로',
    definition: '디지털 로직 게이트가 0과 1로 스위칭할 때 부하 커패시턴스(C_L)를 충전 및 방전하면서 발생하는 전력 손실. 공급 전압의 제곱에 비례함.',
    keyPoints: ['P = α · C_L · V_dd² · f', '전압 스케일링이 전력 절감에 가장 효과적', '클럭 게이팅(Clock Gating)으로 토글 비율(α) 억제'],
    formulaOrSpec: 'P = α · C_L · V_dd² · f'
  },
  {
    id: 'gaafet',
    termKo: 'GAAFET (전방위 게이트)',
    termEn: 'Gate-All-Around Field Effect Transistor',
    acronym: 'GAA / MBCFET',
    category: 'semicon',
    sectionTitle: '2. 반도체 & 집적회로',
    definition: '나노와이어 또는 수평 나노시트(Nanosheet) 형태의 채널 4면 전체를 게이트 산화막이 완전히 감싸서 3nm 및 2nm 이하 공정에서 정전기적 게이트 통제력을 극대화한 차세대 소자.',
    keyPoints: ['FinFET의 3면 게이트 한계 극복', '드레인 유도 장벽 감소(DIBL) 및 누설 전류 완벽 차단', '삼성 3nm MBCFET, TSMC 2nm N2 채택'],
    formulaOrSpec: '4-Sided Nanosheet Channel'
  },
  {
    id: 'finfet',
    termKo: '3D FinFET',
    termEn: 'Fin Field Effect Transistor',
    acronym: 'FinFET',
    category: 'semicon',
    sectionTitle: '2. 반도체 & 집적회로',
    definition: '실리콘 채널을 물고기 지느러미(Fin) 모양의 3차원 입체로 돌출시키고 게이트가 3면을 감싸 2D 평면 MOSFET의 단채널 효과를 억제한 16nm~3nm 주력 트랜지스터 구조.',
    keyPoints: ['2D 평면 대비 우수한 온/오프 전류비', '3nm 이하에서 핀 측면 누설 한계 도달', 'Apple A/M 시리즈, NVIDIA GPU 기반'],
    formulaOrSpec: '3-Sided 3D Tri-Gate'
  },
  {
    id: 'bjt',
    termKo: 'BJT (바이폴라 접합 트랜지스터)',
    termEn: 'Bipolar Junction Transistor',
    acronym: 'BJT',
    category: 'semicon',
    sectionTitle: '2. 반도체 & 집적회로',
    definition: '전자와 정공 두 종류의 캐리어가 모두 전도에 참여하는 소자로, 베이스에 흐르는 미세 전류(I_B)로 컬렉터 대전류(I_C = β·I_B)를 제어하는 전류 제어형 아날로그 트랜지스터.',
    keyPoints: ['전류 제어형 소자 (Current-Controlled)', '높은 트랜스컨덕턴스 및 뛰어난 선형성', '높은 정적 전력 소모로 디지털 로직엔 부적합, RF PA에 활용'],
    formulaOrSpec: 'I_C = β · I_B'
  },
  {
    id: 'mosfet',
    termKo: 'MOSFET',
    termEn: 'Metal-Oxide-Semiconductor Field-Effect Transistor',
    acronym: 'MOSFET',
    category: 'semicon',
    sectionTitle: '2. 반도체 & 집적회로',
    definition: '게이트 산화막 절연체에 인가되는 전압에 의해 형성된 전계(E-field)로 반도체 표면의 전도 채널을 개폐하는 전압 제어형 전계효과 트랜지스터.',
    keyPoints: ['전압 제어형 소자 (Voltage-Controlled)', '초고입력 임피던스 (DC 게이트 전류 ~ 0)', '현대 CMOS 디지털 논리 회로의 기본 단위'],
    formulaOrSpec: 'g_m = ∂I_D / ∂V_GS'
  },
  {
    id: 'dibl',
    termKo: 'DIBL (드레인 유도 장벽 감소)',
    termEn: 'Drain-Induced Barrier Lowering',
    acronym: 'DIBL',
    category: 'semicon',
    sectionTitle: '2. 반도체 & 집적회로',
    definition: '단채널 MOSFET에서 드레인 전압이 증가할 때 드레인 공핍 영역이 소스 근처까지 침범하여 소스-채널 간 전위 장벽을 낮추어 문턱전압(V_th)이 떨어지고 누설 전류가 급증하는 현상.',
    keyPoints: ['대표적인 단채널 효과(SCE)', '서브스레숄드 스윙 열화 및 오프 누설 증가', 'GAAFET 4면 게이트로 억제'],
    formulaOrSpec: 'ΔV_th / ΔV_DS'
  },
  {
    id: 'bs-pdn',
    termKo: 'BS-PDN (후면 전력 공급망)',
    termEn: 'Backside Power Delivery Network',
    acronym: 'BS-PDN',
    category: 'semicon',
    sectionTitle: '2. 반도체 & 집적회로',
    definition: '웨이퍼 전면(Front-side)에 복잡하게 얽혀 있던 전력 배선(VDD/VSS)을 웨이퍼 후면으로 분리하여, 전면은 신호선 전용으로 배치함으로써 전압 강하(IR-drop)와 RC 지연을 대폭 개선하는 2nm급 기술.',
    keyPoints: ['인텔 PowerVia, TSMC A16 적용', '전면 신호 배선 밀도 및 라우팅 자유도 극대화', '실리콘 관통 전극(TSV) 유사 나노비아 연결'],
    formulaOrSpec: 'Backside Metallization'
  },
  {
    id: 'wbg-semicon',
    termKo: '와이드 밴드갭 반도체 (SiC & GaN)',
    termEn: 'Wide Bandgap Semiconductors',
    acronym: 'WBG',
    category: 'semicon',
    sectionTitle: '2. 반도체 & 집적회로',
    definition: '실리콘(1.1eV)보다 훨씬 넓은 에너지 밴드갭(SiC 3.2eV, GaN 3.4eV)을 가져 고전압 절연 파괴 강도, 고온 동작 안정성, 높은 전자 포화 속도를 제공하는 차세대 전력 및 고주파 반도체.',
    keyPoints: ['SiC: 전기차(EV) 메인 인버터, 800V 고전압 배터리 시스템', 'GaN: 초고속 고효율 소형 충전기, 5G/6G 기지국 RF PA', '시스템 부피 축소 및 냉각 비용 절감'],
    formulaOrSpec: 'E_g: SiC(3.2eV), GaN(3.4eV)'
  },

  // 3. Analog & ADC Conversion
  {
    id: 'opamp',
    termKo: '연산 증폭기 (Op-Amp)',
    termEn: 'Operational Amplifier',
    acronym: 'Op-Amp',
    category: 'conversion',
    sectionTitle: '3. 아날로그 & ADC',
    definition: '이상적으로 무한대의 차동 전압 이득, 무한대의 입력 임피던스, 영(0)의 출력 임피던스를 갖는 차동 전압 증폭기. 부성 귀환(Negative Feedback)을 적용하여 정밀한 신호 증폭 및 연산 수행.',
    keyPoints: ['반전 증폭기: Gain = -R_f / R_in', '비반전 증폭기: Gain = 1 + R_f / R_in', '가상 단락(Virtual Short): V+ ≈ V-'],
    formulaOrSpec: 'V_out = A_OL · (V+ - V-)'
  },
  {
    id: 'virtual-ground',
    termKo: '가상 접지',
    termEn: 'Virtual Ground / Virtual Short',
    acronym: 'Virtual Ground',
    category: 'conversion',
    sectionTitle: '3. 아날로그 & ADC',
    definition: '부성 귀환이 걸린 이상적 연산 증폭기에서 반전 입력단(V-)과 비반전 입력단(V+) 사이의 전압차가 무한대 개루프 이득으로 인해 0V가 되는 현상. 실제로 접지되지 않았으나 접지 전위를 유지함.',
    keyPoints: ['V+ = V- (가상 단락 조건)', '입력단으로 전류가 흘러 들어가지 않음 (I_in ≈ 0)', '반전 증폭기 해석의 출발점'],
    formulaOrSpec: 'V_in(-) = V_in(+)'
  },
  {
    id: 'adc-lsb',
    termKo: '최하위 비트 계단 (LSB)',
    termEn: 'Least Significant Bit / Quantization Step Size',
    acronym: 'LSB / Δ',
    category: 'conversion',
    sectionTitle: '3. 아날로그 & ADC',
    definition: 'n비트 분해능의 아날로그-디지털 변환기(ADC)에서 디지털 출력이 1비트 변할 때 대응하는 최소 아날로그 입력 전압 단위.',
    keyPoints: ['LSB = V_ref / 2ⁿ', 'n이 1비트 늘어날 때마다 LSB는 절반으로 미세해짐', '양자화 오차 범위: ±LSB / 2'],
    formulaOrSpec: 'LSB = V_ref / 2ⁿ'
  },
  {
    id: 'enob',
    termKo: '유효 비트 수 (ENOB)',
    termEn: 'Effective Number of Bits',
    acronym: 'ENOB',
    category: 'conversion',
    sectionTitle: '3. 아날로그 & ADC',
    definition: '실제 ADC에서 열잡음, 클럭 지터, 고조파 왜곡(THD) 등을 포함하여 실측된 신호 대 잡음 및 왜곡비(SINAD)를 바탕으로 환산한 실질적인 유효 양자화 비트 수.',
    keyPoints: ['ENOB = (SINAD_dB - 1.76) / 6.02', '공칭 16비트 ADC라도 실제 ENOB는 14~15비트 수준', 'ADC 동적 성능의 가장 정직한 척도'],
    formulaOrSpec: 'ENOB = (SNR_dB - 1.76) / 6.02'
  },
  {
    id: 'sar-adc',
    termKo: 'SAR ADC (축차 비교형)',
    termEn: 'Successive Approximation Register ADC',
    acronym: 'SAR ADC',
    category: 'conversion',
    sectionTitle: '3. 아날로그 & ADC',
    definition: '내부 DAC와 비교기를 사용하여 MSB부터 LSB까지 이진 탐색(Binary Search) 방식으로 1클럭당 1비트씩 n사이클에 걸쳐 전압을 결정하는 ADC.',
    keyPoints: ['소형, 저전력, 우수한 에너지 효율', '8~18비트 중속(수 Msps) 애플리케이션 표준', '마이크로컨트롤러(MCU) 내장형 ADC의 표준 구조'],
    formulaOrSpec: 'n-Cycle Binary Search'
  },
  {
    id: 'flash-adc',
    termKo: 'Flash ADC (병렬형)',
    termEn: 'Flash / Direct-Conversion ADC',
    acronym: 'Flash ADC',
    category: 'conversion',
    sectionTitle: '3. 아날로그 & ADC',
    definition: '2ⁿ - 1개의 비교기를 전압 분배기 사다리에 병렬 배치하여 단 1클럭 사이클 내에 즉시 디지털 코드를 출력하는 최고속 ADC.',
    keyPoints: ['수 Gsps ~ 수십 Gsps 초고속 샘플링', '비교기 수가 비트 수에 따라 기하급수(2ⁿ)로 증가하여 고비트 불가 (보통 6~8비트)', '오실로스코프, 광통신 SerDes 수신단에 사용'],
    formulaOrSpec: '2ⁿ - 1 Parallel Comparators'
  },
  {
    id: 'delta-sigma-adc',
    termKo: '델타-시그마 ADC (ΔΣ)',
    termEn: 'Delta-Sigma ADC',
    acronym: 'ΔΣ / Sigma-Delta',
    category: 'conversion',
    sectionTitle: '3. 아날로그 & ADC',
    definition: '나이퀴스트 주파수보다 훨씬 높은 클럭으로 오버샘플링(Oversampling)하고 노이즈 셰이핑(Noise Shaping)을 적용하여 양자화 잡음을 고주파로 밀어낸 뒤 디지털 필터로 걸러내는 초고정밀 ADC.',
    keyPoints: ['16~24비트 이상의 초고분해능', '오디오 코덱, 정밀 센서 계측, 지진계', '디지털 데시메이션 필터 필요'],
    formulaOrSpec: 'Oversampling + Noise Shaping'
  },

  // 4. RF Engineering & Wave Propagation
  {
    id: 's-parameters',
    termKo: 'S-파라미터 (산란 계수)',
    termEn: 'Scattering Parameters',
    acronym: 'S-Params',
    category: 'rf',
    sectionTitle: '4. RF & 전파통신',
    definition: '파장이 회로 소자 크기와 비슷하거나 작은 고주파 영역에서 개방/단락 회로 대신 정합 종단 상태에서 입사파와 반사파의 진폭 및 위상 비로 포트 간 특성을 기술하는 행렬 파라미터.',
    keyPoints: ['S₁₁: 입력 반사 계수 (Return Loss, -20dB 이하 양호)', 'S₂₁: 순방향 전달 계수 (증폭기 Gain, 필터 Insertion Loss)', 'VNA(벡터 네트워크 분석기)로 측정'],
    formulaOrSpec: 'S₁₁ = b₁/a₁, S₂₁ = b₂/a₁'
  },
  {
    id: 'standard-50-ohm',
    termKo: '50 옴 표준 임피던스',
    termEn: '50 Ohm Standard Impedance',
    acronym: '50 Ω',
    category: 'rf',
    sectionTitle: '4. RF & 전파통신',
    definition: 'RF 고주파 동축 선로에서 공기 절연 기준 최대 전력 전송 임피던스(약 30 Ω)와 최소 신호 감쇠 손실 임피던스(약 77 Ω) 사이의 최적 기하학적 절충점으로 확립된 글로벌 표준.',
    keyPoints: ['최대 전력 전송: 30 Ω', '최소 신호 손실: 77 Ω', '두 최적점의 조화 타협값 = 50 Ω'],
    formulaOrSpec: 'Compromise: 30Ω vs 77Ω'
  },
  {
    id: 'friis-cascade',
    termKo: '프리스 연쇄 잡음 공식',
    termEn: 'Friis Formula for Noise Factor',
    acronym: 'Friis Noise',
    category: 'rf',
    sectionTitle: '4. RF & 전파통신',
    definition: '다단 수신 시스템의 총 잡음 지수(F_total)를 계산하는 공식으로, 2번째 단 이후의 모든 잡음은 앞선 단들의 이득(G)으로 나누어지므로 수신 안테나 직후 첫 단 증폭기(LNA)의 잡음 특성이 전체를 지배함을 증명.',
    keyPoints: ['F_total = F₁ + (F₂ - 1)/G₁ + (F₃ - 1)/(G₁G₂)', '첫 단 LNA의 저잡음·고이득이 절대적', '수신기 프런트엔드 설계의 헌법'],
    formulaOrSpec: 'F_tot = F₁ + (F₂-1)/G₁'
  },
  {
    id: 'lna',
    termKo: '저잡음 증폭기 (LNA)',
    termEn: 'Low Noise Amplifier',
    acronym: 'LNA',
    category: 'rf',
    sectionTitle: '4. RF & 전파통신',
    definition: '안테나를 통해 수신된 극미약 신호를 자체 잡음 추가를 극소화하면서 충분한 전압 이득으로 1차 증폭하여 후단 믹서 및 필터의 잡음 영향을 상쇄하는 핵심 RF 수신 소자.',
    keyPoints: ['안테나 바로 직후에 배치', '낮은 잡음 지수(NF < 1~2dB)와 적절한 이득(15~25dB)', '수신 감도(Sensitivity) 결정'],
    formulaOrSpec: 'Minimizes NF_total'
  },
  {
    id: 'fspl',
    termKo: '자유공간 경로 손실 (FSPL)',
    termEn: 'Free Space Path Loss',
    acronym: 'FSPL',
    category: 'rf',
    sectionTitle: '4. RF & 전파통신',
    definition: '장애물과 반사가 없는 이상적인 자유공간에서 무지향성 안테나로부터 방사된 전자기파가 구면파로 퍼져나감에 따라 거리가 멀어질수록 단위 면적당 수신 전력이 감소하는 기하학적 감쇠.',
    keyPoints: ['FSPL (dB) = 20 log₁₀(d) + 20 log₁₀(f) + 32.44 (d: km, f: MHz)', '통신 거리가 2배 멀어지면 6.02 dB 손실 (전력 1/4)', '주파수가 높을수록 파장(λ)이 짧아져 수신 안테나 유효 면적이 줄어 손실 가속'],
    formulaOrSpec: 'FSPL = 20 log₁₀(4πd / λ)'
  },

  // 5. Information Theory & MIMO
  {
    id: 'shannon-capacity',
    termKo: '섀넌 채널 용량 법칙',
    termEn: 'Shannon-Hartley Theorem',
    acronym: 'Shannon Capacity',
    category: 'info',
    sectionTitle: '5. 정보이론 & MIMO',
    definition: '대역폭(B)과 백색 가우시안 잡음(AWGN) 환경의 신호 대 잡음비(S/N)가 주어졌을 때, 임의로 작은 오류 확률로 달성 가능한 이론적 최대 정보 전송 속도(bps).',
    keyPoints: ['C = B · log₂(1 + S/N)', '대역폭 B에 선형 비례, SNR에는 로그 비례', '현대 채널 코딩(LDPC, Polar)의 목표 상한선'],
    formulaOrSpec: 'C = B · log₂(1 + S/N)'
  },
  {
    id: 'shannon-limit',
    termKo: '절대적 섀넌 한계 (-1.59 dB)',
    termEn: 'Absolute Shannon Limit',
    acronym: 'Eb/N0 Limit',
    category: 'info',
    sectionTitle: '5. 정보이론 & MIMO',
    definition: '대역폭이 무한대로 확장(B → ∞)되더라도 1비트의 정보를 무오류로 전송하기 위해 필요한 물리적 최소 에너지 대 잡음 밀도 비(Eb/N0). 이 값 미만에서는 어떤 부호화 기법으로도 에러 없는 전송이 불가능.',
    keyPoints: ['최소 Eb/N0 = ln 2 ≈ 0.6931 = -1.59 dB', '디지털 통신의 열역학 제2법칙에 해당', '통신 시스템 전력 효율의 절대 기준점'],
    formulaOrSpec: 'min(Eb/N₀) = -1.59 dB'
  },
  {
    id: 'mimo',
    termKo: 'MIMO 공간 다중화',
    termEn: 'Multiple-Input Multiple-Output Spatial Multiplexing',
    acronym: 'MIMO',
    category: 'info',
    sectionTitle: '5. 정보이론 & MIMO',
    definition: '송수신기에 복수의 다중 안테나를 배치하고 다중 경로(Multipath) 페이딩 환경을 활용하여 추가적인 주파수 대역폭 소모 없이 서로 독립적인 데이터 스트림을 병렬 전송하여 용량을 선형 증가시키는 기술.',
    keyPoints: ['C_mimo ≈ min(N_t, N_r) · C_siso', '5G Massive MIMO (32T32R, 64T64R)', '빔포밍(Beamforming)과 결합하여 전송 거리 및 용량 동시 개선'],
    formulaOrSpec: 'C_MIMO ∝ min(Nt, Nr)'
  },
  {
    id: 'qam',
    termKo: '직교 진폭 변조 (QAM)',
    termEn: 'Quadrature Amplitude Modulation',
    acronym: 'QAM',
    category: 'info',
    sectionTitle: '5. 정보이론 & MIMO',
    definition: '서로 90도 위상차를 갖는 두 개의 직교 반송파(I 채널과 Q 채널)의 진폭과 위상을 동시에 변조하여 심볼당 전송 비트 수를 늘리는 고효율 디지털 변조 방식.',
    keyPoints: ['16-QAM(4비트), 64-QAM(6비트), 256-QAM(8비트), 1024-QAM(10비트)', '차수가 높을수록 스펙트럼 효율 증가하나 심볼 간 거리가 좁아져 높은 SNR 요구', 'Wi-Fi 7 및 5G-Advanced의 4096-QAM 채택'],
    formulaOrSpec: 'k = log₂(M) bits/symbol'
  },
  {
    id: 'spectral-efficiency',
    termKo: '주파수 스펙트럼 효율',
    termEn: 'Spectral Efficiency',
    acronym: 'SE',
    category: 'info',
    sectionTitle: '5. 정보이론 & MIMO',
    definition: '주어진 무선 주파수 대역폭 1 Hz당 1초에 전송할 수 있는 순수 정보 비트 수의 비율. 단위는 bps/Hz.',
    keyPoints: ['스펙트럼 효율 = 전송 속도(bps) / 대역폭(Hz)', '고차 QAM 및 MIMO 적용 시 대폭 향상', '한정된 전파 자원 활용도의 핵심 KPI'],
    formulaOrSpec: 'SE = C / B (bps/Hz)'
  },

  // 6. Optical & 6G Infrastructure
  {
    id: 'cpo',
    termKo: 'CPO (공동 패키징 광학)',
    termEn: 'Co-Packaged Optics',
    acronym: 'CPO',
    category: 'optical6g',
    sectionTitle: '6. 광통신 & 6G',
    definition: '스위치 ASIC 반도체 다이와 실리콘 포토닉스(Silicon Photonics) 광학 엔진을 단일 패키지 기판(Interposer) 위에 원칩 수준으로 동시 집적하여 구리 전기 배선 길이를 mm 단위로 축소한 기술.',
    keyPoints: ['기존 플러그형 트랜시버 대비 인터커넥트 전력 30~50% 절감', '51.2Tbps / 102.4Tbps 초거대 AI 데이터센터 스위치 패러다임', '신호 무결성 및 지연 시간 대폭 개선'],
    formulaOrSpec: 'Silicon Photonics Packaging'
  },
  {
    id: 'dac',
    termKo: 'DAC (직접 연결 구리선)',
    termEn: 'Direct Attach Copper',
    acronym: 'DAC',
    category: 'optical6g',
    sectionTitle: '6. 광통신 & 6G',
    definition: '서버 랙 내부에서 ToR 스위치와 서버 간 초단거리(≤3m)를 동축 트윈액스(Twinax) 구리 케이블로 직결하는 케이블. 광-전 변환이 없어 전력 소모가 사실상 0W.',
    keyPoints: ['전력 소모 ~ 0W, 극초저지연, 최고 가성비', '800G/1.6T 고속화 시 표피 효과 및 고주파 감쇠로 전송 거리 1~2m로 단축 한계', 'AI 랙 내부 GPU 간 NVLink 배선'],
    formulaOrSpec: 'Passive Copper (≤ 3m)'
  },
  {
    id: 'aoc',
    termKo: 'AOC (액티브 광케이블)',
    termEn: 'Active Optical Cable',
    acronym: 'AOC',
    category: 'optical6g',
    sectionTitle: '6. 광통신 & 6G',
    definition: '광 트랜시버 모듈이 양단 커넥터에 일체형으로 봉인된 광케이블. 전기 신호를 받아 내부 VCSEL 레이저로 광 변환 전송하여 3m~100m 거리에서 전자파 간섭(EMI) 없이 전송.',
    keyPoints: ['구리선 대비 가볍고 유연하며 EMI 간섭 전무', '랙 간(Row-to-Row) 상호 연결', '양단 트랜시버 모듈 전력 소모 및 발열 존재'],
    formulaOrSpec: 'Optical Fiber (3m ~ 100m)'
  },
  {
    id: 'wdm',
    termKo: 'WDM (파장 분할 다중화)',
    termEn: 'Wavelength Division Multiplexing',
    acronym: 'WDM / DWDM',
    category: 'optical6g',
    sectionTitle: '6. 광통신 & 6G',
    definition: '단일 가닥의 광섬유 코어에 파장(색깔)이 서로 다른 수십~수백 개의 레이저 광 신호를 프리즘처럼 합성하여 동시에 병렬 전송함으로써 광통신 백본망의 대역폭을 극대화하는 광 다중화 기술.',
    keyPoints: ['DWDM: 0.8nm 이하의 조밀한 파장 간격으로 테라비트급 전송', 'CWDM: 20nm 간격의 저비용 도시권 네트워크', '광 인프라 추가 포설 없이 용량 수십 배 증대'],
    formulaOrSpec: 'Multi-λ over Single Fiber'
  },
  {
    id: 'ris',
    termKo: 'RIS (지능형 반사 표면)',
    termEn: 'Reconfigurable Intelligent Surface',
    acronym: 'RIS',
    category: 'optical6g',
    sectionTitle: '6. 광통신 & 6G',
    definition: '수천 개의 초저전력 전자 제어 메타물질(Metamaterial) 단위 셀로 구성된 인공 표면으로, 입사하는 고주파 전파의 위상과 진폭을 능동 제어하여 원하는 방향으로 빔을 꺾어 반사(Beam Steering)시키는 6G 기술.',
    keyPoints: ['6G 테라헤르츠(THz) 대역의 장애물 음영 구역(Blind Spot) 극복', '비가시거리(NLoS) 우회 전파 경로 생성', '자체 RF 증폭기 노이즈(NF)와 전력 소모가 거의 없는 mW급 친환경 무선 인프라'],
    formulaOrSpec: 'Passive Phase Metasurface'
  },
  {
    id: 'thz-band',
    termKo: '테라헤르츠 대역 (THz)',
    termEn: 'Terahertz Frequency Band',
    acronym: 'THz (0.1~10 THz)',
    category: 'optical6g',
    sectionTitle: '6. 광통신 & 6G',
    definition: '100 GHz부터 10 THz 사이의 초고주파 스펙트럼으로, 수십 GHz의 방대한 초광대역폭을 확보하여 100 Gbps ~ 1 Tbps 이상의 초고속 무선 전송을 가능케 하는 6G 후보 주파수 대역.',
    keyPoints: ['극초광대역 전송 속도 (≥ 1 Tbps)', '대기 중 수증기/산소 흡수 손실 및 심각한 전파 감쇠', '건물 투과 불가 및 회절 결핍으로 RIS 연계 필수'],
    formulaOrSpec: 'f = 0.1 ~ 10 THz'
  },
  {
    id: 'nlos',
    termKo: '비가시거리 통신 (NLoS)',
    termEn: 'Non-Line-of-Sight Propagation',
    acronym: 'NLoS',
    category: 'optical6g',
    sectionTitle: '6. 광통신 & 6G',
    definition: '송신 안테나와 수신 안테나 사이에 건물, 지형, 벽 등의 장애물이 존재하여 직접 경로(LoS)가 차단되었을 때, 반사파, 회절파, 산란파를 통해 신호가 도달하는 무선 전파 전송 환경.',
    keyPoints: ['고주파(mmWave, THz)로 갈수록 파장이 짧아져 NLoS 감쇠가 극심해짐', 'RIS 메타물질로 인공적인 강력한 NLoS 반사 경로 구축', '도심지 밀집 지역 6G 연결성의 핵심 과제'],
    formulaOrSpec: 'Indirect Reflection Path'
  },

  // 7. Power Consumption & Off-Grid Solar
  {
    id: 'hlk-ld2451',
    termKo: 'HLK-LD2451 (24GHz 레이더)',
    termEn: 'Hi-Link HLK-LD2451 Radar',
    acronym: 'LD2451',
    category: 'power',
    sectionTitle: '7. 소모전력 & 태양광',
    definition: 'Hi-Link 사의 24GHz FMCW/CW 밀리미터파 도플러 레이더 센서 모듈. 최대 100m 거리에서 다가오는 차량의 속도, 거리, 이동 방향을 정밀 감지.',
    keyPoints: ['동작 전압: 5V, 소모 전류: 107mA (순수 전력 0.535W)', '최대 탐지 거리 100m, UART/BLE/GPIO 출력', '지능형 과속 경고판 및 교통량 감지 표지판 표준 센서'],
    formulaOrSpec: '5V 107mA = 0.535W'
  },
  {
    id: 'ar0234',
    termKo: 'AR0234 글로벌 셔터 카메라',
    termEn: 'OnSemi AR0234 Global Shutter Sensor',
    acronym: 'AR0234',
    category: 'power',
    sectionTitle: '7. 소모전력 & 태양광',
    definition: '온세미(OnSemi) 사의 1/2.6인치 2.3메가픽셀 글로벌 셔터 CMOS 이미지 센서. 고속 이동 물체 촬영 시 롤링 셔터 특유의 젤로 왜곡 없이 선명한 번호판 및 차량 형상 캡처.',
    keyPoints: ['동작 전압 5V, 평균 전류 약 200mA (1.0W)', '120fps 풀해상도 고속 글로벌 셔터 캡처', '지능형 교통 시스템(ITS) 및 ANPR 번호판 인식 특화'],
    formulaOrSpec: '5V 200mA = 1.00W'
  },
  {
    id: 'mppt',
    termKo: 'MPPT (최대 전력 추종 충전 제어기)',
    termEn: 'Maximum Power Point Tracking',
    acronym: 'MPPT',
    category: 'power',
    sectionTitle: '7. 소모전력 & 태양광',
    definition: '태양광 패널의 전압-전류(P-V) 비선형 특성 곡선을 실시간 스캔하여 일사량과 온도에 따라 변화하는 최적 발전 지점(Vmp, Imp)을 추종, 고효율 DC-DC 변환으로 배터리를 충전하는 컨트롤러.',
    keyPoints: ['변환 효율: 95~98% (PWM 대비 20~30% 발전량 증대)', '패널 전압과 배터리 전압의 자유로운 매칭', '흐린 날 및 동절기 독립형 태양광 시스템 필수 장비'],
    formulaOrSpec: 'P_max = V_mp × I_mp (η ≥ 96%)'
  },
  {
    id: 'pwm-controller',
    termKo: 'PWM 충전 컨트롤러',
    termEn: 'Pulse Width Modulation Solar Controller',
    acronym: 'PWM',
    category: 'power',
    sectionTitle: '7. 소모전력 & 태양광',
    definition: '태양광 패널을 배터리에 직접 스위칭 방식으로 연결하여 충전하는 제어기로, 구조가 단순하고 저렴하나 패널의 전압이 배터리 전압(약 12~14V)으로 강제 제한되어 20~30% 전력 손실 발생.',
    keyPoints: ['변환 효율: 70~75%', '저렴한 비용, 단순한 회로', '고출력 패널 연결 시 비효율적'],
    formulaOrSpec: 'V_panel clamped to V_battery'
  },
  {
    id: 'dod',
    termKo: '방전 심도 (DoD)',
    termEn: 'Depth of Discharge',
    acronym: 'DoD',
    category: 'power',
    sectionTitle: '7. 소모전력 & 태양광',
    definition: '배터리 총 공칭 정격 용량 중에서 실제로 방전하여 사용할 수 있는 에너지의 비율(%). 배터리 수명 및 용량 산출의 가장 핵심적인 설계 변수.',
    keyPoints: ['LiFePO4 인산철: 안전 DoD 80~90% (3,000사이클 이상)', '딥사이클 납축전지(Lead-Acid): 권장 DoD 50% (50% 초과 방전 시 수명 급감)', 'DoD가 깊을수록 배터리 무게와 필요 용량(Ah) 절감'],
    formulaOrSpec: 'Usable Ah = Nominal Ah × DoD'
  },
  {
    id: 'peak-sun-hours',
    termKo: '피크 일조시간 (PSH)',
    termEn: 'Peak Sun Hours',
    acronym: 'PSH',
    category: 'power',
    sectionTitle: '7. 소모전력 & 태양광',
    definition: '하루 동안 지표면에 도달한 누적 일사량을 표준 일사 강도인 1,000 W/m²(1 Sun)로 환산했을 때의 가상 일조 지속 시간(h/day).',
    keyPoints: ['한국 연평균: 약 3.2 ~ 3.5 시간/일', '동절기(12~1월): 약 2.5 ~ 2.8 시간/일', '태양광 패널 최소 용량(Wp) 산출의 핵심 분모'],
    formulaOrSpec: 'PSH = Daily kWh/m² ÷ 1 kW/m²'
  },
  {
    id: 'watt-peak',
    termKo: '피크 와트 (Wp)',
    termEn: 'Watt-Peak',
    acronym: 'Wp',
    category: 'power',
    sectionTitle: '7. 소모전력 & 태양광',
    definition: '표준 시험 조건(STC: 일사량 1,000 W/m², 셀 온도 25°C, 대기 질량 AM 1.5) 하에서 태양광 모듈이 출력할 수 있는 최대 정격 전력 단위.',
    keyPoints: ['P_panel (Wp) = (E_daily × S_margin) / (PSH × η_eff)', '실외 온도 상승(여름철 60°C+) 시 발전 효율 약 10~15% 저하', '먼지, 각도 오차 등을 고려하여 안전율 1.25~1.3 적용'],
    formulaOrSpec: 'STC: 1000 W/m² @ 25°C'
  },
  {
    id: 'lifepo4',
    termKo: '리튬 인산철 배터리 (LiFePO4)',
    termEn: 'Lithium Iron Phosphate Battery',
    acronym: 'LFP / LiFePO4',
    category: 'power',
    sectionTitle: '7. 소모전력 & 태양광',
    definition: '올리빈 결정 구조의 인산철을 양극재로 사용하는 리튬 2차 전지로, 열폭주가 없어 화재 안전성이 뛰어나며 3,000회 이상의 긴 수명과 깊은 방전 심도(DoD 85%)를 지원하여 실외 독립형 태양광 시스템에 최적.',
    keyPoints: ['공칭 셀 전압: 3.2V (4S 팩 기준 12.8V)', '납축전지 대비 무게 1/3, 수명 5배 이상', '과충전/과방전 방지를 위한 BMS(Battery Management System) 내장 필수'],
    formulaOrSpec: '4S 팩: 12.8V Nom. (DoD 85%)'
  }
];
