import React, { useState, useMemo } from 'react';
import { Activity, Sliders, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

export const AnalogSection: React.FC = () => {
  // Op-Amp State
  const [opampMode, setOpampMode] = useState<'inverting' | 'noninverting'>('inverting');
  const [rinKohms, setRinKohms] = useState<number>(10);
  const [rfKohms, setRfKohms] = useState<number>(100);
  const [vinVolts, setVinVolts] = useState<number>(0.25);
  const [vccRail, setVccRail] = useState<number>(5.0); // Power rail limit +/- Vcc

  // ADC State
  const [adcBits, setAdcBits] = useState<number>(12);
  const [adcVref, setAdcVref] = useState<number>(3.3); // Volts
  const [adcMeasuredSnr, setAdcMeasuredSnr] = useState<number>(68.5); // dB

  // Op-Amp Calculations
  const { linearGain, gainDb, voutIdeal, isSaturated, voutActual } = useMemo(() => {
    const rin = Math.max(0.1, rinKohms);
    const rf = Math.max(0, rfKohms);
    const gain = opampMode === 'inverting' ? -(rf / rin) : 1 + rf / rin;
    const db = 20 * Math.log10(Math.abs(gain) || 1e-6);
    const vout = vinVolts * gain;
    const sat = Math.abs(vout) > vccRail;
    const actVout = sat ? (vout > 0 ? vccRail : -vccRail) : vout;

    return {
      linearGain: gain,
      gainDb: db,
      voutIdeal: vout,
      isSaturated: sat,
      voutActual: actVout
    };
  }, [opampMode, rinKohms, rfKohms, vinVolts, vccRail]);

  // ADC Calculations
  const { lsbMv, lsbMicroV, idealSnr, calculatedEnob, qNoiseRms } = useMemo(() => {
    const totalLevels = Math.pow(2, adcBits);
    const lsbVolts = adcVref / totalLevels;
    const lsb_mv = lsbVolts * 1000;
    const lsb_uv = lsbVolts * 1e6;

    // Ideal SNR = 6.02 * n + 1.76 dB
    const snrIdeal = 6.02 * adcBits + 1.76;

    // ENOB = (SNR_measured - 1.76) / 6.02
    const enob = (adcMeasuredSnr - 1.76) / 6.02;

    // Quantization noise RMS = LSB / sqrt(12)
    const noiseRms = (lsbVolts / Math.sqrt(12)) * 1e6; // in uV

    return {
      lsbMv: lsb_mv,
      lsbMicroV: lsb_uv,
      idealSnr: snrIdeal,
      calculatedEnob: Math.min(adcBits, Math.max(0, enob)),
      qNoiseRms: noiseRms
    };
  }, [adcBits, adcVref, adcMeasuredSnr]);

  return (
    <div id="conversion" className="space-y-8">
      {/* Section Header */}
      <div className="border-l-4 border-emerald-600 pl-4 py-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            Pillar 03
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            3. 아날로그 신호 처리 및 디지털 데이터 변환
          </h2>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          자연계의 연속적인 아날로그 신호를 컨디셔닝하는 부성 귀환 연산 증폭기(Op-Amp)와 이진 디지털로 샘플링하는 ADC의 분해능, 양자화 잡음 및 ENOB 지표를 실시간 계산합니다.
        </p>
      </div>

      {/* 2 Calculators Side-by-Side Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Op-Amp Calculator */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-emerald-100 text-emerald-700">
                  <Activity className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  연산 증폭기 (Op-Amp) 폐루프 이득 계산기
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                부성 귀환 (Negative Feedback)
              </span>
            </div>

            {/* Topology Switch */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => setOpampMode('inverting')}
                className={`py-2 rounded-xl border transition ${
                  opampMode === 'inverting'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                반전 증폭기 (-Rf / Rin)
              </button>
              <button
                onClick={() => setOpampMode('noninverting')}
                className={`py-2 rounded-xl border transition ${
                  opampMode === 'noninverting'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                비반전 증폭기 (1 + Rf / Rin)
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">입력 저항 R_in (kΩ)</label>
                <input
                  type="number"
                  value={rinKohms}
                  min="0.1"
                  step="1"
                  onChange={(e) => setRinKohms(parseFloat(e.target.value) || 0.1)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-600 font-semibold block mb-1">귀환 저항 R_f (kΩ)</label>
                <input
                  type="number"
                  value={rfKohms}
                  min="0"
                  step="5"
                  onChange={(e) => setRfKohms(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-slate-600 font-semibold block mb-1">입력 전압 V_in (V)</label>
                <input
                  type="number"
                  value={vinVolts}
                  step="0.05"
                  onChange={(e) => setVinVolts(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Power Rails Setting */}
            <div className="mt-3 flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-600">공급 전원 레일 한계 (±Vcc):</span>
              <div className="flex items-center space-x-1">
                <span className="font-mono text-slate-500">±</span>
                <input
                  type="number"
                  value={vccRail}
                  min="1"
                  max="24"
                  step="0.5"
                  onChange={(e) => setVccRail(parseFloat(e.target.value) || 1)}
                  className="w-16 bg-white border border-slate-300 rounded px-2 py-0.5 font-mono font-bold text-slate-800"
                />
                <span className="text-slate-500">V</span>
              </div>
            </div>
          </div>

          {/* Results Output */}
          <div className="space-y-3">
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80 flex justify-between items-center">
              <div>
                <span className="text-xs text-emerald-800 font-semibold block">계산된 전압 이득 (Gain)</span>
                <span className="text-lg font-black font-mono text-emerald-950">
                  {linearGain.toFixed(2)} 배 ({gainDb.toFixed(1)} dB)
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-800 font-semibold block">실제 출력 전압 (V_out)</span>
                <span className="text-2xl font-black font-mono text-emerald-700">
                  {voutActual.toFixed(2)} V
                </span>
              </div>
            </div>

            {isSaturated && (
              <div className="flex items-center space-x-2 text-xs bg-rose-50 text-rose-800 p-3 rounded-xl border border-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>
                  <strong>레일 포화 경고 (Saturation):</strong> 이론 출력({voutIdeal.toFixed(2)}V)이 공급 전원 한계(±{vccRail}V)를 초과하여 파형 클리핑 왜곡이 발생합니다.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ADC Quantization & ENOB Calculator */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded bg-blue-100 text-blue-700">
                  <Sliders className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                  ADC 분해능 (LSB) & 유효 비트 수 (ENOB)
                </h3>
              </div>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                Quantization & SNR
              </span>
            </div>

            {/* Inputs */}
            <div className="space-y-4 mt-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>ADC 분해능 비트 수 (n-bit)</span>
                  <span className="font-mono text-blue-600 font-bold">{adcBits} Bit ({Math.pow(2, adcBits).toLocaleString()} 양자화 계단)</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="24"
                  step="1"
                  value={adcBits}
                  onChange={(e) => setAdcBits(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">기준 전압 V_ref (V)</label>
                  <input
                    type="number"
                    value={adcVref}
                    step="0.1"
                    min="0.5"
                    max="10"
                    onChange={(e) => setAdcVref(parseFloat(e.target.value) || 0.5)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">실측 SNR (dB)</label>
                  <input
                    type="number"
                    value={adcMeasuredSnr}
                    step="0.5"
                    min="10"
                    max="140"
                    onChange={(e) => setAdcMeasuredSnr(parseFloat(e.target.value) || 10)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">최하위 비트 계단 (LSB)</span>
                <span className="text-base font-black font-mono text-slate-900">
                  {lsbMv >= 1 ? `${lsbMv.toFixed(3)} mV` : `${lsbMicroV.toFixed(2)} µV`}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">V_ref / 2ⁿ</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[11px] text-slate-500 block">이론적 이상 SNR</span>
                <span className="text-base font-black font-mono text-slate-900">
                  {idealSnr.toFixed(2)} dB
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">6.02·n + 1.76 dB</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-900 font-semibold block">유효 비트 수 (ENOB, Effective Bits)</span>
                <span className="text-[11px] text-blue-700">비선형 왜곡 및 열잡음 반영 실질 분해능</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black font-mono text-blue-700">
                  {calculatedEnob.toFixed(2)} Bit
                </span>
                <span className="text-[10px] text-slate-500 block">
                  손실: {(adcBits - calculatedEnob).toFixed(2)} Bit
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ADC Architectures Summary Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          주요 아날로그-디지털 변환기 (ADC) 아키텍처 토폴로지 비교
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 text-sm">Flash ADC</div>
            <p className="text-slate-600">2ⁿ-1개의 비교기를 병렬 배치하여 1클럭 내 즉각 변환.</p>
            <span className="inline-block text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              초고속 (Gsps) / 저분해능 (6~8bit)
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 text-sm">SAR ADC (축차 비교형)</div>
            <p className="text-slate-600">이진 탐색 알고리즘(DAC+비교기)으로 1비트씩 n사이클 동안 축차 결정.</p>
            <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              중고속 (Msps) / 저전력 MCU 내장
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 text-sm">Delta-Sigma (ΔΣ)</div>
            <p className="text-slate-600">오버샘플링 및 노이즈 셰이핑(Noise Shaping)으로 양자화 잡음을 고주파로 밀어냄.</p>
            <span className="inline-block text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              초정밀 (16~24bit) / 오디오·센서
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 text-sm">Pipeline ADC</div>
            <p className="text-slate-600">여러 단의 서브 ADC를 파이프라인 지연 처리하여 처리량(Throughput) 극대화.</p>
            <span className="inline-block text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
              통신 기지국 / 의료용 영상(초음파)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
