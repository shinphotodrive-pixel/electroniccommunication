import React, { useState, useMemo } from 'react';
import {
  Sun,
  BatteryCharging,
  Cpu,
  Zap,
  Radio,
  Camera,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Sparkles,
  Calculator
} from 'lucide-react';

export const PowerConsumptionSection: React.FC = () => {
  // 1. Interactive System Configuration States
  const [boardType, setBoardType] = useState<'rpi5' | 'esp32'>('rpi5');
  const [controllerType, setControllerType] = useState<'mppt' | 'pwm'>('mppt');
  const [batteryType, setBatteryType] = useState<'lifepo4' | 'leadAcid'>('lifepo4');

  // Duty cycles and operating hours
  const [radarHours, setRadarHours] = useState<number>(24); // Radar always active 24h
  const [ledHours, setLedHours] = useState<number>(12); // LED display active 12h/day (e.g. traffic/night)
  const [cameraHours, setCameraHours] = useState<number>(12); // Camera active 12h/day
  const [boardHours, setBoardHours] = useState<number>(24); // Controller active 24h

  // Environmental & Safety Factors
  const [peakSunHours, setPeakSunHours] = useState<number>(3.5); // Korea average ~3.2-3.5h
  const [autonomyDays, setAutonomyDays] = useState<number>(3); // 3 days without sun
  const [safetyMargin, setSafetyMargin] = useState<number>(1.25); // 25% safety margin

  // Fixed engineering parameters
  const systemVoltage = 12.0; // 12V DC system bus
  const dcdcEfficiency5V = 0.90; // 12V to 5V Step-Down Buck Converter efficiency ~90%

  // Component specs definitions
  const components = useMemo(() => {
    // 1. Radar HLK-LD2451
    const radar = {
      id: 'radar',
      name: '1. 레이더 센서 (Hi-Link HLK-LD2451)',
      spec: '5V 107mA, 최대 100m, UART/BLE/GPIO',
      voltage: 5.0,
      currentMa: 107,
      powerW: (5.0 * 107) / 1000, // 0.535 W
      busPowerW: ((5.0 * 107) / 1000) / dcdcEfficiency5V, // ~0.594 W with DC-DC loss
      dailyHours: radarHours,
      desc: '24GHz 밀리미터파 레이더. 다가오는 차량 속도/거리 실시간 감지'
    };

    // 2. LED Signboard PCBA
    const led = {
      id: 'led',
      name: '2. LED 안내판 PCBA',
      spec: '1단 1열 188 LED 전용 PCB (12V, 200mA)',
      voltage: 12.0,
      currentMa: 200,
      powerW: (12.0 * 200) / 1000, // 2.40 W
      busPowerW: (12.0 * 200) / 1000, // 12V bus direct, no step-down needed
      dailyHours: ledHours,
      desc: '차량 속도 표시 7세그먼트/도트 LED (12V 직접 구동)'
    };

    // 3. Shuttering Camera AR0234
    const camera = {
      id: 'camera',
      name: '3. 셔터링 카메라 모듈 (OnSemi AR0234)',
      spec: 'Global Shutter (5V, 200mA typ.)',
      voltage: 5.0,
      currentMa: 200,
      powerW: (5.0 * 200) / 1000, // 1.00 W
      busPowerW: ((5.0 * 200) / 1000) / dcdcEfficiency5V, // ~1.11 W
      dailyHours: cameraHours,
      desc: '고속 주행 차량의 왜곡 없는 번호판/차량 포착 글로벌 셔터'
    };

    // 4. Main Controller Board: RPi 5 vs ESP32
    const board = boardType === 'rpi5'
      ? {
          id: 'board',
          name: '4. 메인 제어보드 (라즈베리파이 5)',
          spec: '5V 1,500mA (평균 연산/영상 AI 모드)',
          voltage: 5.0,
          currentMa: 1500,
          powerW: (5.0 * 1500) / 1000, // 7.50 W
          busPowerW: ((5.0 * 1500) / 1000) / dcdcEfficiency5V, // ~8.33 W
          dailyHours: boardHours,
          desc: 'Linux OS, OpenCV 실시간 번호판 인식 및 고성능 엣지 AI 처리'
        }
      : {
          id: 'board',
          name: '4. 메인 제어보드 (ESP32 저전력 MCU)',
          spec: '3.3V/5V 변환 120mA (레이더 파싱 및 제어)',
          voltage: 5.0,
          currentMa: 120,
          powerW: (5.0 * 120) / 1000, // 0.60 W
          busPowerW: ((5.0 * 120) / 1000) / dcdcEfficiency5V, // ~0.667 W
          dailyHours: boardHours,
          desc: '초저전력 마이크로컨트롤러, 단순 레이더 UART 파싱 및 LED 제어'
        };

    // 5. Solar Charge Controller Standby Self-Consumption
    const controllerQuiescent = {
      id: 'controller',
      name: '5. 태양광 충전 컨트롤러 (대기 소모)',
      spec: `${controllerType.toUpperCase()} 12V 10A (자체 대기전류 ~12mA)`,
      voltage: 12.0,
      currentMa: 12,
      powerW: (12.0 * 12) / 1000, // 0.144 W
      busPowerW: (12.0 * 12) / 1000,
      dailyHours: 24,
      desc: '컨트롤러 내부 회로 구동 및 충전 모니터링 자체 소모'
    };

    return [radar, led, camera, board, controllerQuiescent];
  }, [boardType, controllerType, radarHours, ledHours, cameraHours, boardHours]);

  // System Power & Energy Totals
  const systemMetrics = useMemo(() => {
    // Total Instantaneous Pure Power (W)
    const instantPurePowerW = components.reduce((acc, c) => acc + c.powerW, 0);

    // Total Instantaneous 12V Bus Power with conversion loss (W)
    const instantBusPowerW = components.reduce((acc, c) => acc + c.busPowerW, 0);

    // Daily Energy Consumption (Wh/day)
    const dailyEnergyWh = components.reduce((acc, c) => acc + (c.busPowerW * c.dailyHours), 0);

    // Daily Amp-Hours on 12V Bus (Ah/day)
    const dailyAh = dailyEnergyWh / systemVoltage;

    // Average Power (W)
    const averagePowerW = dailyEnergyWh / 24;

    return {
      instantPurePowerW,
      instantBusPowerW,
      dailyEnergyWh,
      dailyAh,
      averagePowerW
    };
  }, [components]);

  // Battery Sizing Calculations
  const batterySizing = useMemo(() => {
    // Depth of Discharge (DoD): LiFePO4: 85%, Lead-Acid: 50%
    const dod = batteryType === 'lifepo4' ? 0.85 : 0.50;
    // Temperature coefficient (e.g. winter degradation factor ~0.85)
    const tempEfficiency = 0.85;

    // Formula: C_battery (Wh) = (Daily_Wh * Autonomy_Days) / (DoD * Temp_Eff)
    const requiredBatteryWh = (systemMetrics.dailyEnergyWh * autonomyDays) / (dod * tempEfficiency);

    // Formula: C_battery (Ah) = Required_Wh / System_Voltage (12V)
    const requiredBatteryAh = requiredBatteryWh / systemVoltage;

    // Recommended Commercial Sizing (round up to nearest standard size)
    const recommendedAh = Math.ceil(requiredBatteryAh / 10) * 10;
    const recommendedWh = recommendedAh * (batteryType === 'lifepo4' ? 12.8 : 12.0);

    return {
      dod,
      tempEfficiency,
      requiredBatteryWh,
      requiredBatteryAh,
      recommendedAh: Math.max(20, recommendedAh),
      recommendedWh
    };
  }, [systemMetrics.dailyEnergyWh, autonomyDays, batteryType]);

  // Solar Panel (PV) Sizing Calculations
  const solarSizing = useMemo(() => {
    // Controller Efficiency: MPPT ~96%, PWM ~75%
    const controllerEff = controllerType === 'mppt' ? 0.96 : 0.75;
    // Dust, Wiring, Thermal Loss Factor ~0.85
    const systemLossFactor = 0.85;

    // Total Daily Energy required including battery charge roundtrip loss (~90% for LiFePO4, 80% for Lead Acid)
    const batteryChargeEff = batteryType === 'lifepo4' ? 0.92 : 0.80;
    const effectiveDailyEnergyWh = systemMetrics.dailyEnergyWh / batteryChargeEff;

    // Formula: P_panel (Wp) = (Effective_Wh * Safety_Margin) / (Peak_Sun_Hours * Controller_Eff * Loss_Factor)
    const requiredPanelWp = (effectiveDailyEnergyWh * safetyMargin) / (peakSunHours * controllerEff * systemLossFactor);

    // Commercial standard recommendation (e.g. 50W, 100W, 150W, 200W, 300W)
    let recommendedPanelWp = 50;
    if (requiredPanelWp <= 50) recommendedPanelWp = 50;
    else if (requiredPanelWp <= 100) recommendedPanelWp = 100;
    else if (requiredPanelWp <= 160) recommendedPanelWp = 160;
    else if (requiredPanelWp <= 200) recommendedPanelWp = 200;
    else if (requiredPanelWp <= 300) recommendedPanelWp = 300;
    else recommendedPanelWp = Math.ceil(requiredPanelWp / 50) * 50;

    // Peak Charging Current (A) = Recommended_Wp / 12V
    const maxChargeCurrentA = recommendedPanelWp / 14.4; // Charging bulk voltage ~14.4V

    return {
      controllerEff,
      systemLossFactor,
      batteryChargeEff,
      effectiveDailyEnergyWh,
      requiredPanelWp,
      recommendedPanelWp,
      maxChargeCurrentA
    };
  }, [systemMetrics.dailyEnergyWh, safetyMargin, peakSunHours, controllerType, batteryType]);

  return (
    <div id="power" className="space-y-8">
      {/* Section Header */}
      <div className="border-l-4 border-amber-500 pl-4 py-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
            Special Pillar
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            소모전력 분석 및 독립형 태양광·배터리 설계
          </h2>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          레이더 센서(HLK-LD2451), LED 안내판, AR0234 카메라, 메인 보드(라즈베리파이5 vs ESP32) 구성 시 소모전력을 정밀 계산하고, 
          독립형 태양광 패널(Wp) 및 배터리(Ah) 사양 결정 엔지니어링 계산식을 제공합니다.
        </p>
      </div>

      {/* Top Architecture Controller & Mode Toggle */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Sliders className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                시스템 아키텍처 및 구성품 옵션 선택
              </h3>
              <p className="text-xs text-slate-400">
                제어보드 연산 부하, 충전 컨트롤러 방식, 배터리 화학종에 따른 전력 수지 변화를 실시간 비교합니다.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-800 text-amber-400 border border-slate-700">
              12V 버스 표준
            </span>
          </div>
        </div>

        {/* 3 Core Selection Switches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Main Board Selector */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>메인 제어 보드 선택</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${boardType === 'rpi5' ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                {boardType === 'rpi5' ? '고성능 AI (7.5W)' : '초저전력 MCU (0.6W)'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setBoardType('rpi5')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  boardType === 'rpi5'
                    ? 'bg-blue-600 text-white font-bold border-blue-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span className="block font-bold">라즈베리파이 5</span>
                <span className="text-[10px] opacity-80">5V 1,500mA (7.5W)</span>
              </button>

              <button
                onClick={() => setBoardType('esp32')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  boardType === 'esp32'
                    ? 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span className="block font-bold">ESP32</span>
                <span className="text-[10px] opacity-80">5V 120mA (0.6W)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {boardType === 'rpi5'
                ? 'OpenCV 실시간 영상 처리, 번호판 인식(ANPR) 등 엣지 AI에 필수이나 전력 소모가 큽니다.'
                : '단순 레이더 UART 속도 파싱 및 LED 숫자 표출 시 압도적인 전력 절감이 가능합니다.'}
            </p>
          </div>

          {/* 2. Solar Charge Controller Selector */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                <span>충전 컨트롤러 (12V 10A)</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${controllerType === 'mppt' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                {controllerType === 'mppt' ? '효율 96%' : '효율 75%'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setControllerType('mppt')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  controllerType === 'mppt'
                    ? 'bg-amber-600 text-white font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span className="block font-bold">MPPT 컨트롤러</span>
                <span className="text-[10px] opacity-80">최대 전력 추종 (96%)</span>
              </button>

              <button
                onClick={() => setControllerType('pwm')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  controllerType === 'pwm'
                    ? 'bg-amber-600 text-white font-bold border-amber-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span className="block font-bold">PWM 컨트롤러</span>
                <span className="text-[10px] opacity-80">직결 스위칭 (75%)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {controllerType === 'mppt'
                ? 'MPPT는 패널 전압을 최적으로 변환하여 흐린 날이나 동절기에도 20~30% 더 많은 전력을 충전합니다.'
                : 'PWM은 가격이 저렴하나 패널 전압을 배터리 전압(12V)으로 강제 클램핑하여 25% 이상의 전력 손실이 발생합니다.'}
            </p>
          </div>

          {/* 3. Battery Chemistry Selector */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
                <span>배터리 화학종</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {batteryType === 'lifepo4' ? 'DoD 85% (권장)' : 'DoD 50%'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setBatteryType('lifepo4')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  batteryType === 'lifepo4'
                    ? 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span className="block font-bold">LiFePO4 (인산철)</span>
                <span className="text-[10px] opacity-80">DoD 85% / 3,000회+</span>
              </button>

              <button
                onClick={() => setBatteryType('leadAcid')}
                className={`p-2.5 rounded-xl border text-center transition ${
                  batteryType === 'leadAcid'
                    ? 'bg-emerald-600 text-white font-bold border-emerald-400 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-750'
                }`}
              >
                <span className="block font-bold">납축전지 (AGM/GEL)</span>
                <span className="text-[10px] opacity-80">DoD 50% / 500회</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {batteryType === 'lifepo4'
                ? '인산철은 방전 심도(DoD)가 깊고 수명이 길며 겨울철에도 우수한 충방전 효율을 보입니다.'
                : '납축전지는 50% 이상 방전 시 극판 황산화(Sulfation)로 수명이 급감하여 2배 이상의 용량이 필요합니다.'}
            </p>
          </div>
        </div>

        {/* Operating Hours Sliders Row */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
            <span>일일 동작 시간 (Duty Cycle) 및 기상 환경 조건 조절</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* LED Hours Slider */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>LED 안내판 가동:</span>
                <span className="font-mono font-bold text-amber-400">{ledHours}시간/일</span>
              </div>
              <input
                type="range"
                min={1}
                max={24}
                value={ledHours}
                onChange={(e) => setLedHours(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">차량 접근 시에만 점등 시 4~12시간 가능</span>
            </div>

            {/* Camera Hours Slider */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>AR0234 카메라 가동:</span>
                <span className="font-mono font-bold text-blue-400">{cameraHours}시간/일</span>
              </div>
              <input
                type="range"
                min={1}
                max={24}
                value={cameraHours}
                onChange={(e) => setCameraHours(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">상시 녹화 vs 이벤트 트리거 캡처</span>
            </div>

            {/* Peak Sun Hours */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>일평균 피크 일조시간(PSH):</span>
                <span className="font-mono font-bold text-yellow-400">{peakSunHours.toFixed(1)}시간</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={5.0}
                step={0.1}
                value={peakSunHours}
                onChange={(e) => setPeakSunHours(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
              <span className="text-[10px] text-slate-400 block mt-1">한국 연평균 3.2~3.5h, 동절기 ~2.8h</span>
            </div>

            {/* Autonomy Days */}
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>무일조 연속 자립 일수:</span>
                <span className="font-mono font-bold text-emerald-400">{autonomyDays}일</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                value={autonomyDays}
                onChange={(e) => setAutonomyDays(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">비/눈으로 충전 불가 시 보장 일수</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Component-by-Component Power Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>구성품별 동작 전압, 소모전류 및 소비전력 상세 명세서</span>
            </h3>
            <p className="text-xs text-slate-500">
              각 구성품의 순수 소비전력(W)과 12V 배터리 버스에서의 DC-DC 변환 손실(효율 90%) 반영 전력 및 일일 전력량(Wh)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              DC-DC 벅 변환 효율: 90%
            </span>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold">
                <th className="py-3 px-3">구성품명 및 주요 사양</th>
                <th className="py-3 px-3">동작 전압 (V)</th>
                <th className="py-3 px-3">소모 전류 (mA)</th>
                <th className="py-3 px-3">순수 전력 (W)</th>
                <th className="py-3 px-3 bg-amber-50/60 text-amber-900">
                  12V 버스 전력 (W)*
                </th>
                <th className="py-3 px-3">일일 가동시간 (h)</th>
                <th className="py-3 px-3 bg-blue-50 text-blue-900 font-black">
                  일일 소비량 (Wh/day)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {components.map((comp) => {
                const dailyWh = comp.busPowerW * comp.dailyHours;
                return (
                  <tr key={comp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      <div>{comp.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{comp.spec}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">
                      {comp.voltage.toFixed(1)} V
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-blue-600">
                      {comp.currentMa} mA
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {comp.powerW.toFixed(3)} W
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-amber-700 bg-amber-50/30">
                      {comp.busPowerW.toFixed(3)} W
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {comp.dailyHours} 시간
                    </td>
                    <td className="py-3 px-3 font-mono font-black text-blue-700 bg-blue-50/40">
                      {dailyWh.toFixed(2)} Wh
                    </td>
                  </tr>
                );
              })}

              {/* Total Summary Row */}
              <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-700">
                <td className="py-3.5 px-3">
                  <span className="text-amber-400 font-extrabold uppercase">시스템 총합계 (Total)</span>
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-300">12.0 V (Bus)</td>
                <td className="py-3.5 px-3 font-mono text-emerald-400">
                  {(systemMetrics.instantBusPowerW / 12 * 1000).toFixed(0)} mA
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-300">
                  {systemMetrics.instantPurePowerW.toFixed(2)} W
                </td>
                <td className="py-3.5 px-3 font-mono text-amber-400 bg-slate-800/80">
                  {systemMetrics.instantBusPowerW.toFixed(2)} W
                </td>
                <td className="py-3.5 px-3 font-mono text-slate-300">24h 통합</td>
                <td className="py-3.5 px-3 font-mono text-xl font-black text-yellow-300 bg-blue-950/80">
                  {systemMetrics.dailyEnergyWh.toFixed(1)} Wh/일
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
          <span>* 5V 구성품(레이더, 카메라, 제어보드)은 12V→5V 고효율 스텝다운 벅 컨버터(효율 90%) 손실을 반영하여 계산되었습니다.</span>
          <span className="font-mono text-slate-600 font-bold">12V 버스 기준 일일 소모 전류량: {systemMetrics.dailyAh.toFixed(2)} Ah/day</span>
        </div>
      </div>

      {/* Sizing Results Cards: Solar Panel & Battery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Solar Panel Sizing Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 rounded-3xl p-6 sm:p-7 border border-amber-300 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-amber-500 text-slate-950 font-black">
                <Sun className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  태양광 패널 (PV) 사양 결정 계산식 및 권장 사양
                </h3>
                <span className="text-xs text-amber-800 font-medium">
                  {controllerType.toUpperCase()} 컨트롤러 기반 최적 용량 산출
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full border border-amber-200">
              안전 계수: {safetyMargin}배
            </span>
          </div>

          {/* Mathematical Formula Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 font-mono text-xs space-y-2 border border-slate-800">
            <div className="text-amber-400 font-bold text-[11px] uppercase tracking-wide">
              [태양광 패널 용량 결정 공식]
            </div>
            <div className="text-sm sm:text-base font-black text-yellow-300 py-1 overflow-x-auto">
              P_panel (Wp) = (E_daily × S_margin) / (T_sun × η_controller × η_loss)
            </div>
            <div className="text-[11px] text-slate-300 space-y-1 border-t border-slate-800 pt-2 leading-relaxed">
              <div>• <strong className="text-white">E_daily</strong>: 일일 소모 전력량 = {systemMetrics.dailyEnergyWh.toFixed(1)} Wh</div>
              <div>• <strong className="text-white">S_margin</strong>: 안전 마진율 = {safetyMargin} (25% 여유)</div>
              <div>• <strong className="text-white">T_sun</strong>: 일평균 피크 일조시간 = {peakSunHours} h (한국 연평균)</div>
              <div>• <strong className="text-white">η_controller</strong>: 컨트롤러 효율 = {(solarSizing.controllerEff * 100).toFixed(0)}% ({controllerType.toUpperCase()})</div>
              <div>• <strong className="text-white">η_loss</strong>: 패널 먼지/온도/배선 손실 계수 = 85% (0.85)</div>
            </div>
          </div>

          {/* Calculation Process & Result */}
          <div className="bg-white rounded-2xl p-4 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">수식 계산 필요 용량:</span>
              <span className="font-mono text-base font-bold text-slate-900">
                {solarSizing.requiredPanelWp.toFixed(1)} Wp
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-amber-100 pt-2">
              <span className="text-xs font-black text-amber-900">최종 권장 상용 패널 규격:</span>
              <div className="text-right">
                <span className="font-mono text-2xl font-black text-amber-600">
                  {solarSizing.recommendedPanelWp} Wp
                </span>
                <span className="text-[11px] text-slate-500 block">18V~22V Vmp 단결정 패널 1장</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-amber-50/70 p-3 rounded-xl border border-amber-200/80 leading-relaxed">
              <strong>엔지니어링 코멘트:</strong> 최대 충전 전류는 약{' '}
              <span className="font-mono font-bold text-amber-800">
                {(solarSizing.recommendedPanelWp / 14.4).toFixed(1)} A
              </span>
              로, 선택하신 <strong>12V 10A 컨트롤러의 허용 정격(10A) 이내</strong>에서 완벽하게 안전 동작합니다.
            </div>
          </div>
        </div>

        {/* 2. Battery Sizing Card */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-white to-emerald-500/5 rounded-3xl p-6 sm:p-7 border border-emerald-300 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-emerald-600 text-white font-black">
                <BatteryCharging className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  배터리 사양 결정 계산식 및 권장 용량
                </h3>
                <span className="text-xs text-emerald-800 font-medium">
                  {batteryType === 'lifepo4' ? 'LiFePO4 인산철 (고효율)' : 'AGM 납축전지'} 기반 용량 산출
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-full border border-emerald-200">
              무일조 자립: {autonomyDays}일
            </span>
          </div>

          {/* Mathematical Formula Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 font-mono text-xs space-y-2 border border-slate-800">
            <div className="text-emerald-400 font-bold text-[11px] uppercase tracking-wide">
              [배터리 용량(Ah) 결정 공식]
            </div>
            <div className="text-sm sm:text-base font-black text-emerald-300 py-1 overflow-x-auto">
              C_battery (Ah) = (E_daily × N_autonomy) / (V_sys × DoD × η_temp)
            </div>
            <div className="text-[11px] text-slate-300 space-y-1 border-t border-slate-800 pt-2 leading-relaxed">
              <div>• <strong className="text-white">E_daily</strong>: 일일 소모 전력량 = {systemMetrics.dailyEnergyWh.toFixed(1)} Wh</div>
              <div>• <strong className="text-white">N_autonomy</strong>: 무일조 보장일수 = {autonomyDays} 일 (연속 흐림/비)</div>
              <div>• <strong className="text-white">V_sys</strong>: 시스템 정격 전압 = 12.0 V</div>
              <div>• <strong className="text-white">DoD</strong>: 허용 방전 심도 = {(batterySizing.dod * 100).toFixed(0)}% ({batteryType === 'lifepo4' ? '인산철' : '납축전지'})</div>
              <div>• <strong className="text-white">η_temp</strong>: 동절기 저온 방전 효율 = 85% (0.85)</div>
            </div>
          </div>

          {/* Calculation Process & Result */}
          <div className="bg-white rounded-2xl p-4 border border-emerald-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">수식 계산 최소 필요 용량:</span>
              <span className="font-mono text-base font-bold text-slate-900">
                {batterySizing.requiredBatteryAh.toFixed(1)} Ah ({batterySizing.requiredBatteryWh.toFixed(0)} Wh)
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-emerald-100 pt-2">
              <span className="text-xs font-black text-emerald-900">최종 권장 상용 배터리 규격:</span>
              <div className="text-right">
                <span className="font-mono text-2xl font-black text-emerald-600">
                  {batterySizing.recommendedAh} Ah
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {batteryType === 'lifepo4' ? '12.8V LiFePO4 인산철 팩' : '12V Deep Cycle 납축전지'}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 leading-relaxed">
              <strong>수명 및 신뢰성 분석:</strong>{' '}
              {batteryType === 'lifepo4'
                ? 'LiFePO4 인산철 배터리는 3,000회 이상의 충방전 수명과 높은 방전 심도를 지원하여 유지보수 없이 5년 이상 안정 운용이 가능합니다.'
                : '납축전지는 저렴하지만 50% 초과 방전 시 수명이 1년 이내로 급단축되므로, 실외 교통 표지판에는 LiFePO4 인산철 배터리를 적극 권장합니다.'}
            </div>
          </div>
        </div>
      </div>

      {/* Practical Engineering Guidance Box */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base sm:text-lg font-bold text-white">
            실외 도로 환경 현장 설치 및 전력 무결성 엔지니어링 가이드
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2">
            <strong className="text-amber-300 font-bold block">1. DC-DC 변환 전원 무결성</strong>
            <p>
              12V 배터리 버스에서 5V로 전압을 내릴 때 리니어 레귤레이터(LDO)를 쓰면 발열로 전력의 58%가 낭비됩니다. 
              반드시 <strong>효율 90% 이상의 동기식 벅 컨버터(Synchronous Buck Converter)</strong>를 적용해야 하며, 
              레이더의 24GHz RF 및 카메라 노이즈 방지를 위해 LC 필터 및 바이패스 탄탈 커패시터를 배치해야 합니다.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2">
            <strong className="text-amber-300 font-bold block">2. 태양광 패널 각도 및 음영 관리</strong>
            <p>
              한국 도로변 폴(Pole) 설치 시 태양광 패널 경사각은 동절기(12~1월) 일조량 부족을 보상하기 위해 
              <strong>위도(36°~37°)보다 약간 가파른 40°~45°</strong>로 설치하는 것이 유리합니다. 
              가로수 및 전신주에 의한 부분 음영 발생 시 역방향 전류 방지를 위한 바이패스 다이오드가 필수입니다.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 space-y-2">
            <strong className="text-amber-300 font-bold block">3. 라즈베리파이 5 vs ESP32 전력 전략</strong>
            <p>
              라즈베리파이5는 24시간 풀가동 시 하루 약 <strong>200Wh</strong>를 소모하여 대형 패널(160Wp+)과 대형 배터리(80Ah+)가 필수입니다. 
              만약 ESP32를 사용하면 일일 소모량이 <strong>약 30~50Wh</strong>로 급감하여 초소형 패널(50Wp)과 20~30Ah 배터리만으로도 
              사계절 무중단 독립 운용이 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
