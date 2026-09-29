import React, { useState, useMemo } from 'react';
import * as math from 'mathjs';
import {
  Calculator,
  Radio,
  Wifi,
  Sun,
  BatteryCharging,
  Activity,
  Code2,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  HelpCircle,
  ArrowRight,
  Zap,
  Cpu,
  Layers,
  Info,
  CheckCircle2,
  Sliders,
  Terminal
} from 'lucide-react';

export const EngineeringCalculatorSuite: React.FC = () => {
  const [activeCalcTab, setActiveCalcTab] = useState<'friis' | 'shannon' | 'power' | 'adc' | 'sandbox'>('friis');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  // ==========================================
  // 1. FRIIS TRANSMISSION & PATH LOSS STATES
  // ==========================================
  const [txPowerDbm, setTxPowerDbm] = useState<number>(20); // 20 dBm (100mW)
  const [txGainDbi, setTxGainDbi] = useState<number>(6); // 6 dBi
  const [rxGainDbi, setRxGainDbi] = useState<number>(2); // 2 dBi
  const [freqGhz, setFreqGhz] = useState<number>(24.0); // 24 GHz (LD2451 radar or 5G mmWave)
  const [distanceM, setDistanceM] = useState<number>(50); // 50 meters
  const [rxSensitivityDbm, setRxSensitivityDbm] = useState<number>(-90); // -90 dBm

  const friisResult = useMemo(() => {
    try {
      // Speed of light
      const c = 299792458; // m/s
      const freqHz = freqGhz * 1e9;
      
      // math.js evaluation for wavelength: lambda = c / f
      const lambda = math.evaluate(`${c} / ${freqHz}`);
      
      // FSPL formula: (4 * pi * d / lambda)^2
      const fsplLinear = math.evaluate(`(4 * pi * ${distanceM} / ${lambda})^2`);
      const fsplDb = math.evaluate(`10 * log10(${fsplLinear})`);
      
      // Received Power: Pr(dBm) = Pt + Gt + Gr - FSPL
      const rxPowerDbm = math.evaluate(`${txPowerDbm} + ${txGainDbi} + ${rxGainDbi} - ${fsplDb}`);
      
      // Linear Pr in mW and uW
      const rxPowerMw = math.evaluate(`10 ^ (${rxPowerDbm} / 10)`);
      const rxPowerUw = rxPowerMw * 1000;
      
      // Link Margin
      const linkMarginDb = math.evaluate(`${rxPowerDbm} - ${rxSensitivityDbm}`);

      return {
        success: true,
        lambda: math.round(lambda * 1000, 3), // mm
        fsplDb: math.round(fsplDb, 2),
        rxPowerDbm: math.round(rxPowerDbm, 2),
        rxPowerMw: rxPowerMw < 0.0001 ? math.format(rxPowerMw, { notation: 'exponential', precision: 3 }) : math.round(rxPowerMw, 5),
        rxPowerUw: rxPowerUw < 0.001 ? math.format(rxPowerUw, { notation: 'exponential', precision: 3 }) : math.round(rxPowerUw, 3),
        linkMarginDb: math.round(linkMarginDb, 2),
        isLinkReliable: linkMarginDb >= 10,
        evalExpression: `Pr_dBm = ${txPowerDbm} + ${txGainDbi} + ${rxGainDbi} - 10*log10((4*pi*${distanceM} / (${c}/${freqGhz}e9))^2)`
      };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }, [txPowerDbm, txGainDbi, rxGainDbi, freqGhz, distanceM, rxSensitivityDbm]);

  // ==========================================
  // 2. SHANNON-HARTLEY CAPACITY & MIMO STATES
  // ==========================================
  const [bandwidthMhz, setBandwidthMhz] = useState<number>(20); // 20 MHz (WiFi / 4G / 5G sub-band)
  const [snrDb, setSnrDb] = useState<number>(25); // 25 dB
  const [mimoTx, setMimoTx] = useState<number>(4); // 4x4 MIMO
  const [mimoRx, setMimoRx] = useState<number>(4);

  const shannonResult = useMemo(() => {
    try {
      // SNR linear using math.js: 10^(snrDb/10)
      const snrLinear = math.evaluate(`10 ^ (${snrDb} / 10)`);
      
      // SISO Capacity: C = B * log2(1 + SNR)
      // math.js log2: log2(x)
      const sisoCapBps = math.evaluate(`${bandwidthMhz * 1e6} * log2(1 + ${snrLinear})`);
      const sisoCapMbps = sisoCapBps / 1e6;
      
      // Spectral Efficiency: C / B = log2(1 + SNR)
      const spectralEfficiency = math.evaluate(`log2(1 + ${snrLinear})`);
      
      // MIMO Rank = min(Tx, Rx)
      const mimoRank = Math.min(mimoTx, mimoRx);
      // MIMO spatial multiplexing capacity: rank * B * log2(1 + SNR/rank)
      const mimoCapBps = math.evaluate(`${mimoRank} * ${bandwidthMhz * 1e6} * log2(1 + (${snrLinear} / ${mimoRank}))`);
      const mimoCapMbps = mimoCapBps / 1e6;
      const mimoSpectralEfficiency = mimoCapBps / (bandwidthMhz * 1e6);

      return {
        success: true,
        snrLinear: math.round(snrLinear, 2),
        sisoCapMbps: math.round(sisoCapMbps, 2),
        spectralEfficiency: math.round(spectralEfficiency, 3),
        mimoRank,
        mimoCapMbps: math.round(mimoCapMbps, 2),
        mimoSpectralEfficiency: math.round(mimoSpectralEfficiency, 3),
        gainMultiplier: math.round(mimoCapMbps / sisoCapMbps, 2),
        evalExpression: `C = ${mimoRank} * ${bandwidthMhz}MHz * log2(1 + 10^(${snrDb}/10) / ${mimoRank})`
      };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }, [bandwidthMhz, snrDb, mimoTx, mimoRx]);

  // ==========================================
  // 3. SOLAR PV & BATTERY SIZING STATES
  // ==========================================
  const [loadPowerW, setLoadPowerW] = useState<number>(12.5); // Default: Radar + RPi5 + LED + Camera
  const [operatingHours, setOperatingHours] = useState<number>(24); // 24h continuous
  const [busVoltage, setBusVoltage] = useState<number>(12.0); // 12V bus
  const [peakSunHours, setPeakSunHours] = useState<number>(3.5); // 3.5h Korea
  const [autonomyDays, setAutonomyDays] = useState<number>(3); // 3 days
  const [dodPercent, setDodPercent] = useState<number>(85); // 85% for LiFePO4
  const [ctrlEfficiency, setCtrlEfficiency] = useState<number>(96); // 96% MPPT
  const [safetyMarginPercent, setSafetyMarginPercent] = useState<number>(25); // 25%

  const solarResult = useMemo(() => {
    try {
      // E_daily = Load_W * Hours
      const dailyEnergyWh = math.evaluate(`${loadPowerW} * ${operatingHours}`);
      const dailyAh = math.evaluate(`${dailyEnergyWh} / ${busVoltage}`);
      
      const safetyFactor = math.evaluate(`1 + (${safetyMarginPercent} / 100)`);
      const ctrlEffFactor = math.evaluate(`${ctrlEfficiency} / 100`);
      const systemLossFactor = 0.85; // dust/temp
      
      // P_panel (Wp) = (E_daily * Safety) / (PSH * ctrl_eff * loss)
      const requiredWp = math.evaluate(`(${dailyEnergyWh} * ${safetyFactor}) / (${peakSunHours} * ${ctrlEffFactor} * ${systemLossFactor})`);
      
      // Battery Ah = (E_daily * Autonomy) / (V_bus * DoD * TempEff)
      const dodFactor = math.evaluate(`${dodPercent} / 100`);
      const tempEffFactor = 0.85; // winter
      const requiredBattAh = math.evaluate(`(${dailyEnergyWh} * ${autonomyDays}) / (${busVoltage} * ${dodFactor} * ${tempEffFactor})`);
      const requiredBattWh = math.evaluate(`${requiredBattAh} * ${busVoltage}`);
      
      // Max Charging Current (A) = Panel_Wp / Charging_V (14.4V bulk)
      const maxChargeCurrentA = math.evaluate(`${requiredWp} / 14.4`);

      // Rounding to commercial steps
      const recWp = math.ceil(requiredWp / 20) * 20;
      const recAh = math.ceil(requiredBattAh / 10) * 10;

      return {
        success: true,
        dailyEnergyWh: math.round(dailyEnergyWh, 1),
        dailyAh: math.round(dailyAh, 2),
        requiredWp: math.round(requiredWp, 1),
        recWp: Math.max(50, recWp),
        requiredBattAh: math.round(requiredBattAh, 1),
        requiredBattWh: math.round(requiredBattWh, 0),
        recAh: Math.max(20, recAh),
        maxChargeCurrentA: math.round(maxChargeCurrentA, 2),
        evalExpression: `Wp = (${dailyEnergyWh} * ${safetyFactor}) / (${peakSunHours} * ${ctrlEffFactor} * 0.85)`
      };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }, [loadPowerW, operatingHours, busVoltage, peakSunHours, autonomyDays, dodPercent, ctrlEfficiency, safetyMarginPercent]);

  // ==========================================
  // 4. ADC QUANTIZATION & ENOB STATES
  // ==========================================
  const [adcBits, setAdcBits] = useState<number>(12); // 12-bit ADC
  const [vrefVolt, setVrefVolt] = useState<number>(3.3); // 3.3V
  const [sampleRateKhz, setSampleRateKhz] = useState<number>(1000); // 1 MSps = 1000 kHz
  const [measuredSinadDb, setMeasuredSinadDb] = useState<number>(68); // 68 dB SINAD

  const adcResult = useMemo(() => {
    try {
      // 2^N
      const levels = math.evaluate(`2 ^ ${adcBits}`);
      // LSB = Vref / 2^N
      const lsbVolt = math.evaluate(`${vrefVolt} / ${levels}`);
      const lsbMv = lsbVolt * 1000;
      const lsbUv = lsbMv * 1000;
      
      // Theoretical SNR = 6.02 * N + 1.76 dB
      const theoSnrDb = math.evaluate(`6.02 * ${adcBits} + 1.76`);
      
      // Quantization Noise RMS: LSB / sqrt(12)
      const qNoiseRmsMv = math.evaluate(`${lsbMv} / sqrt(12)`);
      
      // ENOB = (SINAD - 1.76) / 6.02
      const enob = math.evaluate(`(${measuredSinadDb} - 1.76) / 6.02`);
      
      // Dynamic Range DR = 6.02 * N
      const dynamicRangeDb = math.evaluate(`6.02 * ${adcBits}`);
      
      // Nyquist Bandwidth
      const nyquistKhz = sampleRateKhz / 2;

      return {
        success: true,
        levels: levels.toLocaleString(),
        lsbMv: math.round(lsbMv, 4),
        lsbUv: math.round(lsbUv, 2),
        theoSnrDb: math.round(theoSnrDb, 2),
        qNoiseRmsMv: math.round(qNoiseRmsMv, 4),
        enob: math.round(enob, 2),
        dynamicRangeDb: math.round(dynamicRangeDb, 1),
        nyquistKhz: math.round(nyquistKhz, 1),
        evalExpression: `SNR_ideal = 6.02 * ${adcBits} + 1.76 = ${math.round(theoSnrDb, 2)} dB`
      };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  }, [adcBits, vrefVolt, sampleRateKhz, measuredSinadDb]);

  // ==========================================
  // 5. LIVE CUSTOM MATH.JS FORMULA SANDBOX
  // ==========================================
  const [sandboxExpr, setSandboxExpr] = useState<string>('20 * log10(100 / 0.1)');
  const [sandboxScope] = useState<Record<string, number>>({
    c: 299792458,
    pi: Math.PI,
    e: Math.E,
    mu0: 4 * Math.PI * 1e-7,
    eps0: 8.8541878128e-12,
    V_bat: 12.0,
    I_rpi: 1.5,
    I_radar: 0.107
  });

  const sandboxResult = useMemo(() => {
    try {
      if (!sandboxExpr.trim()) {
        return { success: true, value: '(수식을 입력하세요)', type: 'empty' };
      }
      const evaluated = math.evaluate(sandboxExpr, sandboxScope);
      const formatted = math.format(evaluated, { precision: 8 });
      return {
        success: true,
        value: formatted,
        type: typeof evaluated
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        error: message
      };
    }
  }, [sandboxExpr, sandboxScope]);

  const presetFormulas = [
    { label: '전압 이득 (dB)', expr: '20 * log10(100 / 0.1)', desc: 'Vout=100V, Vin=0.1V' },
    { label: '빛의 속도 검증 (μ0, ε0)', expr: '1 / sqrt(mu0 * eps0)', desc: 'c = 1 / sqrt(μ0·ε0)' },
    { label: '라즈베리파이 5V 1.5A 전력', expr: '5 * I_rpi', desc: 'P = V * I' },
    { label: 'RC 저역통과 차단주파수', expr: '1 / (2 * pi * 1000 * 0.1e-6)', desc: 'R=1kΩ, C=0.1μF' },
    { label: '반사계수 Γ로부터 VSWR', expr: '(1 + 0.2) / (1 - 0.2)', desc: 'Γ = 0.2' },
    { label: '12V 배터리 100Ah 에너지(Wh)', expr: '12 * 100', desc: 'E = V * Ah' }
  ];

  return (
    <div id="calculator" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                Math.js Core Engine
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                전자 & 통신 공학 정밀 계산기 도구 모음
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              프리스 전파 손실, 섀넌 용량, 태양광 전력 수지, ADC 양자화 및 자유 수식 샌드박스를 고정밀 <code className="text-amber-300 font-mono">math.js</code>로 실시간 계산합니다.
            </p>
          </div>
        </div>

        {/* Engine status indicator */}
        <div className="flex items-center space-x-2 self-start md:self-auto bg-slate-800/90 px-3.5 py-1.5 rounded-xl border border-slate-700 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-300 font-mono">mathjs v14+ Active</span>
        </div>
      </div>

      {/* Calculator Navigation Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveCalcTab('friis')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCalcTab === 'friis'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>1. 프리스 전파 & 경로손실</span>
        </button>

        <button
          onClick={() => setActiveCalcTab('shannon')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCalcTab === 'shannon'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Wifi className="w-4 h-4" />
          <span>2. 섀넌 용량 & MIMO 효율</span>
        </button>

        <button
          onClick={() => setActiveCalcTab('power')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCalcTab === 'power'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <BatteryCharging className="w-4 h-4" />
          <span>3. 태양광 & 배터리 수지</span>
        </button>

        <button
          onClick={() => setActiveCalcTab('adc')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCalcTab === 'adc'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>4. ADC 양자화 & ENOB</span>
        </button>

        <button
          onClick={() => setActiveCalcTab('sandbox')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeCalcTab === 'sandbox'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>5. 실시간 math.js 샌드박스</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: FRIIS TRANSMISSION EQUATION & PATH LOSS                */}
      {/* ============================================================== */}
      {activeCalcTab === 'friis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inputs Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>RF 송수신 파라미터 입력</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Friis Equation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Tx Power */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>송신 전력 (Pt):</span>
                    <span className="font-mono font-bold text-amber-400">{txPowerDbm} dBm ({(math.pow(10, txPowerDbm/10) as number).toFixed(1)} mW)</span>
                  </div>
                  <input
                    type="range"
                    min={-10}
                    max={40}
                    step={1}
                    value={txPowerDbm}
                    onChange={(e) => setTxPowerDbm(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>-10 dBm (0.1mW)</span>
                    <span>+40 dBm (10W)</span>
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>반송파 주파수 (f):</span>
                    <span className="font-mono font-bold text-blue-400">{freqGhz} GHz</span>
                  </div>
                  <input
                    type="range"
                    min={0.4}
                    max={60}
                    step={0.1}
                    value={freqGhz}
                    onChange={(e) => setFreqGhz(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>400 MHz (IoT)</span>
                    <span>24G (레이더)</span>
                    <span>60 GHz (밀리미터파)</span>
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>전파 전송 거리 (d):</span>
                    <span className="font-mono font-bold text-emerald-400">{distanceM} m</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={1000}
                    step={1}
                    value={distanceM}
                    onChange={(e) => setDistanceM(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>1 m</span>
                    <span>100 m</span>
                    <span>1,000 m (1km)</span>
                  </div>
                </div>

                {/* Rx Sensitivity */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>수신 감도 한계 (Sensitivity):</span>
                    <span className="font-mono font-bold text-purple-400">{rxSensitivityDbm} dBm</span>
                  </div>
                  <input
                    type="range"
                    min={-110}
                    max={-60}
                    step={1}
                    value={rxSensitivityDbm}
                    onChange={(e) => setRxSensitivityDbm(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>-110 dBm (초고감도)</span>
                    <span>-60 dBm</span>
                  </div>
                </div>

                {/* Tx Gain */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>송신 안테나 이득 (Gt):</span>
                    <span className="font-mono font-bold text-slate-200">{txGainDbi} dBi</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={0.5}
                    value={txGainDbi}
                    onChange={(e) => setTxGainDbi(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-slate-400 cursor-pointer"
                  />
                </div>

                {/* Rx Gain */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>수신 안테나 이득 (Gr):</span>
                    <span className="font-mono font-bold text-slate-200">{rxGainDbi} dBi</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={0.5}
                    value={rxGainDbi}
                    onChange={(e) => setRxGainDbi(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-slate-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Quick Presets */}
              <div className="pt-2 border-t border-slate-700/80">
                <span className="text-[11px] text-slate-400 block mb-2 font-medium">추천 사전 설정 (Presets):</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => {
                      setTxPowerDbm(10);
                      setFreqGhz(24.0);
                      setDistanceM(50);
                      setTxGainDbi(12);
                      setRxGainDbi(12);
                      setRxSensitivityDbm(-90);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px]"
                  >
                    24GHz 과속 레이더 (HLK-LD2451)
                  </button>
                  <button
                    onClick={() => {
                      setTxPowerDbm(20);
                      setFreqGhz(2.4);
                      setDistanceM(10);
                      setTxGainDbi(3);
                      setRxGainDbi(2);
                      setRxSensitivityDbm(-85);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px]"
                  >
                    2.4GHz 실내 Wi-Fi
                  </button>
                  <button
                    onClick={() => {
                      setTxPowerDbm(30);
                      setFreqGhz(28.0);
                      setDistanceM(200);
                      setTxGainDbi(18);
                      setRxGainDbi(8);
                      setRxSensitivityDbm(-95);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px]"
                  >
                    28GHz 5G mmWave 기지국
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Output Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {friisResult.success ? (
              <div className="bg-slate-800/95 rounded-2xl p-5 border border-blue-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    Math.js 실시간 해석 결과
                  </span>
                  <button
                    onClick={() => handleCopy(String(friisResult.rxPowerDbm), 'friis')}
                    className="text-slate-400 hover:text-white text-xs flex items-center space-x-1"
                  >
                    {copiedKey === 'friis' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'friis' ? '복사됨' : 'Pr 복사'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-slate-400">수신 신호 전력 (Pr):</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black font-mono text-blue-400">
                        {friisResult.rxPowerDbm}
                      </span>
                      <span className="text-sm font-bold text-slate-300">dBm</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      ≒ {friisResult.rxPowerMw} mW ({friisResult.rxPowerUw} µW)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/80 text-xs">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 block text-[11px]">자유공간 경로손실(FSPL)</span>
                      <span className="text-base font-bold font-mono text-rose-400">
                        {friisResult.fsplDb} dB
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 block text-[11px]">전파 파장 (λ)</span>
                      <span className="text-base font-bold font-mono text-amber-300">
                        {friisResult.lambda} mm
                      </span>
                    </div>
                  </div>

                  {/* Link Margin Status */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    friisResult.isLinkReliable
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                  }`}>
                    <div>
                      <span className="text-[11px] font-bold block">링크 마진 (Link Margin):</span>
                      <span className="text-lg font-black font-mono">
                        {friisResult.linkMarginDb} dB
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-md ${
                      friisResult.isLinkReliable ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {friisResult.isLinkReliable ? '통신 안정 (마진 ≥ 10dB)' : '신호 감쇠 위험 (마진 < 10dB)'}
                    </span>
                  </div>

                  {/* Math.js Formula String */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 break-all">
                    <span className="text-amber-400 block font-bold mb-0.5">// Math.js 연산식:</span>
                    {friisResult.evalExpression}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500 text-rose-300 text-xs">
                오류: {friisResult.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SHANNON CAPACITY & MIMO SPECTRAL EFFICIENCY            */}
      {/* ============================================================== */}
      {activeCalcTab === 'shannon' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Wifi className="w-4 h-4" />
                  <span>대역폭 및 다중 안테나(MIMO) 파라미터</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Shannon-Hartley</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Bandwidth */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>채널 대역폭 (B):</span>
                    <span className="font-mono font-bold text-purple-400">{bandwidthMhz} MHz</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={200}
                    step={1}
                    value={bandwidthMhz}
                    onChange={(e) => setBandwidthMhz(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>1 MHz (IoT)</span>
                    <span>20 MHz (LTE)</span>
                    <span>100 MHz (5G)</span>
                    <span>200 MHz</span>
                  </div>
                </div>

                {/* SNR (dB) */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>신호 대 잡음비 (SNR):</span>
                    <span className="font-mono font-bold text-amber-400">{snrDb} dB</span>
                  </div>
                  <input
                    type="range"
                    min={-10}
                    max={40}
                    step={1}
                    value={snrDb}
                    onChange={(e) => setSnrDb(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>-10 dB (극악)</span>
                    <span>0 dB</span>
                    <span>20 dB</span>
                    <span>40 dB (이상적)</span>
                  </div>
                </div>

                {/* Tx Antennas */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>송신 안테나 수 (Nt):</span>
                    <span className="font-mono font-bold text-blue-400">{mimoTx} Tx</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 4, 8].map((val) => (
                      <button
                        key={val}
                        onClick={() => setMimoTx(val)}
                        className={`py-1.5 rounded-lg border text-center font-bold ${
                          mimoTx === val ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rx Antennas */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>수신 안테나 수 (Nr):</span>
                    <span className="font-mono font-bold text-emerald-400">{mimoRx} Rx</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 4, 8].map((val) => (
                      <button
                        key={val}
                        onClick={() => setMimoRx(val)}
                        className={`py-1.5 rounded-lg border text-center font-bold ${
                          mimoRx === val ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-5 space-y-4">
            {shannonResult.success ? (
              <div className="bg-slate-800/95 rounded-2xl p-5 border border-purple-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                    채널 용량 한계 (Channel Capacity)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    MIMO Rank: {shannonResult.mimoRank}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-slate-400">MIMO 공간 다중화 총 채널 용량:</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black font-mono text-purple-400">
                        {shannonResult.mimoCapMbps}
                      </span>
                      <span className="text-sm font-bold text-slate-300">Mbps</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      ≒ {(shannonResult.mimoCapMbps / 1000).toFixed(3)} Gbps
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/80 text-xs">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 block text-[11px]">SISO 기본 용량</span>
                      <span className="text-base font-bold font-mono text-slate-200">
                        {shannonResult.sisoCapMbps} Mbps
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 block text-[11px]">MIMO 속도 향상 배수</span>
                      <span className="text-base font-bold font-mono text-emerald-400">
                        × {shannonResult.gainMultiplier}배
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">스펙트럼 효율 (Spectral Efficiency):</span>
                      <span className="font-mono font-bold text-amber-300">{shannonResult.mimoSpectralEfficiency} bps/Hz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">선형 SNR 값:</span>
                      <span className="font-mono text-slate-300">{shannonResult.snrLinear}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 break-all">
                    <span className="text-amber-400 block font-bold mb-0.5">// Math.js 연산식:</span>
                    {shannonResult.evalExpression}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500 text-rose-300 text-xs">
                오류: {shannonResult.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: SOLAR PV & BATTERY STORAGE SIZING                      */}
      {/* ============================================================== */}
      {activeCalcTab === 'power' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sun className="w-4 h-4" />
                  <span>부하 전력 및 환경 변수 설정</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Off-Grid PV Sizing</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Load Power */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>시스템 총 부하 전력 (P_load):</span>
                    <span className="font-mono font-bold text-amber-400">{loadPowerW} W</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    step={0.5}
                    value={loadPowerW}
                    onChange={(e) => setLoadPowerW(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>1W</span>
                    <span>12.5W (풀세트)</span>
                    <span>50W</span>
                  </div>
                </div>

                {/* Operating Hours */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>일일 가동 시간:</span>
                    <span className="font-mono font-bold text-blue-400">{operatingHours} 시간/일</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={24}
                    step={1}
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer"
                  />
                </div>

                {/* Peak Sun Hours */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>피크 일조시간 (PSH):</span>
                    <span className="font-mono font-bold text-yellow-400">{peakSunHours} h</span>
                  </div>
                  <input
                    type="range"
                    min={2.0}
                    max={5.0}
                    step={0.1}
                    value={peakSunHours}
                    onChange={(e) => setPeakSunHours(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-yellow-400 cursor-pointer"
                  />
                </div>

                {/* Autonomy Days */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>무일조 보장 일수:</span>
                    <span className="font-mono font-bold text-emerald-400">{autonomyDays} 일</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={7}
                    step={1}
                    value={autonomyDays}
                    onChange={(e) => setAutonomyDays(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Battery DoD */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>방전 심도 (DoD):</span>
                    <span className="font-mono font-bold text-emerald-400">{dodPercent}% ({dodPercent >= 80 ? '인산철' : '납축전지'})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setDodPercent(85)}
                      className={`py-1 rounded-lg border text-[11px] font-bold ${
                        dodPercent === 85 ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      LiFePO4 (85%)
                    </button>
                    <button
                      onClick={() => setDodPercent(50)}
                      className={`py-1 rounded-lg border text-[11px] font-bold ${
                        dodPercent === 50 ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      납축전지 (50%)
                    </button>
                  </div>
                </div>

                {/* Controller Efficiency */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>충전 컨트롤러 효율:</span>
                    <span className="font-mono font-bold text-amber-300">{ctrlEfficiency}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setCtrlEfficiency(96)}
                      className={`py-1 rounded-lg border text-[11px] font-bold ${
                        ctrlEfficiency === 96 ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      MPPT (96%)
                    </button>
                    <button
                      onClick={() => setCtrlEfficiency(75)}
                      className={`py-1 rounded-lg border text-[11px] font-bold ${
                        ctrlEfficiency === 75 ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}
                    >
                      PWM (75%)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-5 space-y-4">
            {solarResult.success ? (
              <div className="bg-slate-800/95 rounded-2xl p-5 border border-amber-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    태양광 & 배터리 권장 사양
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    일일 {solarResult.dailyEnergyWh} Wh
                  </span>
                </div>

                <div className="space-y-3">
                  {/* PV Sizing */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-amber-500/20">
                    <span className="text-xs text-amber-300 font-bold block mb-1">
                      ☀️ 권장 태양광 패널 (PV Module):
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black font-mono text-amber-400">
                        {solarResult.recWp}
                      </span>
                      <span className="text-sm font-bold text-slate-300">Wp</span>
                      <span className="text-[11px] text-slate-400">
                        (최소 필요: {solarResult.requiredWp} Wp)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block mt-1">
                      최대 충전 전류: 약 {solarResult.maxChargeCurrentA} A (10A 컨트롤러 규격 적합)
                    </span>
                  </div>

                  {/* Battery Sizing */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-emerald-500/20">
                    <span className="text-xs text-emerald-300 font-bold block mb-1">
                      🔋 권장 배터리 뱅크 (12V 버스):
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black font-mono text-emerald-400">
                        {solarResult.recAh}
                      </span>
                      <span className="text-sm font-bold text-slate-300">Ah</span>
                      <span className="text-[11px] text-slate-400">
                        (최소: {solarResult.requiredBattAh} Ah / {solarResult.requiredBattWh} Wh)
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono block mt-1">
                      {dodPercent >= 80 ? '12.8V LiFePO4 인산철 팩 권장' : '12V 딥사이클 납축전지'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 break-all">
                    <span className="text-amber-400 block font-bold mb-0.5">// Math.js 연산식:</span>
                    {solarResult.evalExpression}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500 text-rose-300 text-xs">
                오류: {solarResult.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: ADC QUANTIZATION, NOISE & ENOB                        */}
      {/* ============================================================== */}
      {activeCalcTab === 'adc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Activity className="w-4 h-4" />
                  <span>ADC 분해능 및 신호 파라미터</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">ADC & ENOB</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Resolution Bits */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>양자화 비트 수 (N):</span>
                    <span className="font-mono font-bold text-emerald-400">{adcBits} 비트</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={24}
                    step={1}
                    value={adcBits}
                    onChange={(e) => setAdcBits(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>8비트</span>
                    <span>12비트(MCU)</span>
                    <span>16비트(오디오)</span>
                    <span>24비트</span>
                  </div>
                </div>

                {/* Reference Voltage */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>기준 전압 (Vref):</span>
                    <span className="font-mono font-bold text-blue-400">{vrefVolt} V</span>
                  </div>
                  <input
                    type="range"
                    min={1.0}
                    max={5.0}
                    step={0.1}
                    value={vrefVolt}
                    onChange={(e) => setVrefVolt(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-blue-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>1.8V</span>
                    <span>3.3V</span>
                    <span>5.0V</span>
                  </div>
                </div>

                {/* Sampling Rate */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>샘플링 레이트 (fs):</span>
                    <span className="font-mono font-bold text-purple-400">{sampleRateKhz} kSps</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={10000}
                    step={50}
                    value={sampleRateKhz}
                    onChange={(e) => setSampleRateKhz(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-purple-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>44.1k (Audio)</span>
                    <span>1 MSps (1000k)</span>
                    <span>10 MSps</span>
                  </div>
                </div>

                {/* Measured SINAD */}
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>실측 SINAD:</span>
                    <span className="font-mono font-bold text-amber-400">{measuredSinadDb} dB</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={120}
                    step={1}
                    value={measuredSinadDb}
                    onChange={(e) => setMeasuredSinadDb(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>30 dB</span>
                    <span>68 dB</span>
                    <span>100 dB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-5 space-y-4">
            {adcResult.success ? (
              <div className="bg-slate-800/95 rounded-2xl p-5 border border-emerald-500/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    ADC 분해능 및 잡음 수치
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {adcResult.levels} 계조
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-slate-400">1 LSB 최소 전압 분해능:</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-black font-mono text-emerald-400">
                        {adcResult.lsbMv}
                      </span>
                      <span className="text-sm font-bold text-slate-300">mV</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        ({adcResult.lsbUv} µV)
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/80 text-xs">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 block text-[11px]">이론적 최대 SNR</span>
                      <span className="text-base font-bold font-mono text-blue-400">
                        {adcResult.theoSnrDb} dB
                      </span>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                      <span className="text-slate-400 block text-[11px]">유효 비트 수 (ENOB)</span>
                      <span className="text-base font-bold font-mono text-amber-300">
                        {adcResult.enob} 비트
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">나이퀴스트 대역폭 한계 (fs/2):</span>
                      <span className="font-mono font-bold text-slate-200">{adcResult.nyquistKhz} kHz</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">양자화 잡음 실효값 (RMS):</span>
                      <span className="font-mono text-slate-300">{adcResult.qNoiseRmsMv} mV</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 break-all">
                    <span className="text-amber-400 block font-bold mb-0.5">// Math.js 연산식:</span>
                    {adcResult.evalExpression}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500 text-rose-300 text-xs">
                오류: {adcResult.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: LIVE MATH.JS CUSTOM FORMULA SANDBOX                     */}
      {/* ============================================================== */}
      {activeCalcTab === 'sandbox' && (
        <div className="space-y-4">
          <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Terminal className="w-4 h-4" />
                <span>자유 수식 실시간 인터프리터 (Live Expression Sandbox)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">math.evaluate()</span>
            </div>

            {/* Expression Input Area */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                임의의 수학·공학 수식을 입력하세요:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={sandboxExpr}
                  onChange={(e) => setSandboxExpr(e.target.value)}
                  placeholder="예: 20 * log10(100 / 0.1) 또는 sqrt(4 * pi * 1e-7)"
                  className="w-full bg-slate-950 text-amber-300 font-mono text-sm px-4 py-3 rounded-xl border border-slate-700 focus:border-rose-500 focus:outline-none"
                />
                <button
                  onClick={() => setSandboxExpr('')}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300"
                  title="초기화"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Evaluated Output Card */}
            <div className={`p-4 rounded-xl border ${
              sandboxResult.success
                ? 'bg-slate-950/80 border-slate-700 text-white'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>계산 결과:</span>
                {sandboxResult.success && (
                  <button
                    onClick={() => handleCopy(String(sandboxResult.value), 'sandbox')}
                    className="flex items-center space-x-1 text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'sandbox' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'sandbox' ? '복사 완료' : '결과 복사'}</span>
                  </button>
                )}
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-400 break-all">
                {sandboxResult.success ? sandboxResult.value : sandboxResult.error}
              </div>
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <span className="text-xs font-bold text-slate-300 block mb-2">자주 쓰는 공학 공식 프리셋:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {presetFormulas.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSandboxExpr(p.expr)}
                    className="text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-750 border border-slate-700/80 text-xs transition"
                  >
                    <div className="font-bold text-slate-200">{p.label}</div>
                    <div className="font-mono text-amber-300 text-[11px] truncate">{p.expr}</div>
                    <div className="text-[10px] text-slate-500">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Scope Variables Info */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="text-slate-300 font-bold block">사용 가능한 내장 물리 상수 및 변수:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 font-mono text-[10px]">
                <div><code className="text-blue-400">c</code> = 299,792,458 m/s</div>
                <div><code className="text-blue-400">pi</code> = 3.141592...</div>
                <div><code className="text-blue-400">mu0</code> = 4π×10⁻⁷ H/m</div>
                <div><code className="text-blue-400">eps0</code> = 8.854×10⁻¹² F/m</div>
                <div><code className="text-emerald-400">V_bat</code> = 12.0 V</div>
                <div><code className="text-emerald-400">I_rpi</code> = 1.5 A</div>
                <div><code className="text-emerald-400">I_radar</code> = 0.107 A</div>
                <div><code className="text-amber-400">e</code> = 2.71828...</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
