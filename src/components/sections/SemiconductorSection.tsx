import React, { useState, useMemo } from 'react';
import { semiconductorData } from '../../data/engineeringData';
import { Cpu, Zap, Flame, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

export const SemiconductorSection: React.FC = () => {
  const [alpha, setAlpha] = useState<number>(0.2); // switching activity factor
  const [capacitancePf, setCapacitancePf] = useState<number>(15); // pF
  const [vdd, setVdd] = useState<number>(1.1); // Volts
  const [freqGhz, setFreqGhz] = useState<number>(3.6); // GHz
  const [clockGatingPercent, setClockGatingPercent] = useState<number>(30); // 30% reduction via clock gating

  // CMOS Dynamic Power: P = alpha * C * Vdd^2 * f
  // C in pF (1e-12), f in GHz (1e9) -> 1e-12 * 1e9 = 1e-3 (mW)
  const dynamicPowerMw = useMemo(() => {
    return alpha * capacitancePf * Math.pow(vdd, 2) * freqGhz;
  }, [alpha, capacitancePf, vdd, freqGhz]);

  // Savings with Clock Gating
  const powerWithGatingMw = useMemo(() => {
    return dynamicPowerMw * (1 - clockGatingPercent / 100);
  }, [dynamicPowerMw, clockGatingPercent]);

  // If Vdd was scaled down by 20%
  const voltageScaledPowerMw = useMemo(() => {
    const reducedVdd = vdd * 0.8;
    return alpha * capacitancePf * Math.pow(reducedVdd, 2) * freqGhz;
  }, [alpha, capacitancePf, vdd, freqGhz]);

  return (
    <div id="semicon" className="space-y-8">
      {/* Section Header */}
      <div className="border-l-4 border-amber-500 pl-4 py-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
            Pillar 02
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            2. 반도체 소자 물성 및 집적회로의 진화
          </h2>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          BJT의 전류 제어부터 2D Planar MOSFET의 단채널 효과(SCE), 3D FinFET, 4면 전방위 제어 GAAFET 나노시트(2nm) 및 SiC/GaN 와이드 밴드갭까지 분석합니다.
        </p>
      </div>

      {/* Interactive CMOS Power Calculator */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-2">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                CMOS 동적 전력 소모 (Dynamic Power) 시뮬레이터
              </h3>
              <p className="text-xs text-slate-400">
                디지털 스위칭 충방전 에너지 손실 공식: <span className="text-amber-400 font-mono font-bold">P = α · C_L · V_dd² · f</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-800 text-amber-300 px-3 py-1 rounded-full border border-slate-700 self-start sm:self-auto">
            Quadratic V_dd Law
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
            <label className="text-slate-300 font-semibold block">스위칭 활동 계수 (α, 0~1)</label>
            <input
              type="number"
              value={alpha}
              step="0.05"
              min="0"
              max="1"
              onChange={(e) => setAlpha(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white font-mono font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">평균 클럭 대비 게이트 토글 비율</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
            <label className="text-slate-300 font-semibold block">부하 커패시턴스 (C_L, pF)</label>
            <input
              type="number"
              value={capacitancePf}
              step="1"
              min="1"
              onChange={(e) => setCapacitancePf(parseFloat(e.target.value) || 1)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white font-mono font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">게이트 및 인터커넥트 총 기생 용량</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
            <label className="text-slate-300 font-semibold block">공급 전압 (V_dd, Volt)</label>
            <input
              type="number"
              value={vdd}
              step="0.05"
              min="0.5"
              max="3.3"
              onChange={(e) => setVdd(parseFloat(e.target.value) || 0.5)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white font-mono font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">로직 구동 전압 (초미세 공정 0.7~1.1V)</span>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
            <label className="text-slate-300 font-semibold block">동작 주파수 (f, GHz)</label>
            <input
              type="number"
              value={freqGhz}
              step="0.1"
              min="0.1"
              max="8.0"
              onChange={(e) => setFreqGhz(parseFloat(e.target.value) || 0.1)}
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-2 text-white font-mono font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400">클럭 주파수 (CPU/GPU 코어 주파수)</span>
          </div>
        </div>

        {/* Real-time Computed Results Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/80">
            <span className="text-xs text-slate-400 block font-medium">기본 동적 전력 소모 (P_dynamic)</span>
            <div className="text-3xl font-black font-mono text-amber-400 mt-1">
              {dynamicPowerMw.toFixed(2)} mW
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">게이트 토글당 에너지 소모</span>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/80">
            <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
              <span>클럭 게이팅({clockGatingPercent}%) 적용 시</span>
              <span className="text-emerald-400 font-bold">-{(dynamicPowerMw - powerWithGatingMw).toFixed(2)} mW</span>
            </div>
            <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
              {powerWithGatingMw.toFixed(2)} mW
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="80"
                step="5"
                value={clockGatingPercent}
                onChange={(e) => setClockGatingPercent(parseInt(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
          </div>

          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700/80">
            <span className="text-xs text-slate-400 block font-medium">전압 20% 스케일링({(vdd * 0.8).toFixed(2)}V) 효과</span>
            <div className="text-3xl font-black font-mono text-blue-400 mt-1">
              {voltageScaledPowerMw.toFixed(2)} mW
            </div>
            <span className="text-[11px] text-blue-300 mt-1 block">
              제곱 법칙으로 전력 <strong>36% 급감!</strong>
            </span>
          </div>
        </div>

        {/* Insight Box */}
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-xs text-slate-300 leading-relaxed flex items-start space-x-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <strong>초미세 공정 설계의 딜레마:</strong> 동적 전력은 전압(V_dd)의 제곱에 비례하므로 전압을 낮추는 것이 가장 효과적이지만, 전압이 임계 전압(V_th)에 근접할수록 트랜지스터 스위칭 지연(Delay)이 기하급수적으로 증가합니다. 따라서 현대 반도체는 <strong>DVFS(Dynamic Voltage and Frequency Scaling)</strong>와 <strong>GAAFET의 우수한 정전기 통제력</strong>을 결합하여 초저전압(0.7V)에서도 누설 없이 고속 스위칭을 달성합니다.
          </div>
        </div>
      </div>

      {/* Semiconductor Comparison Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              트랜지스터 아키텍처 스케일링 및 차세대 전력 화합물 비교
            </h3>
            <p className="text-xs text-slate-500">
              평면(2D)에서 지느러미(3D), 나노시트(4D GAAFET), 그리고 실리콘 한계를 넘어서는 WBG 화합물 소재까지의 진화
            </p>
          </div>
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto">
            공정 로드맵 (BJT → GAAFET 2nm)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5 rounded-tl-xl">소자 명칭</th>
                <th className="p-3.5">동작 원리 & 구조</th>
                <th className="p-3.5">물리적 한계 및 극복 메커니즘</th>
                <th className="p-3.5 rounded-tr-xl">주요 적용 분야</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {semiconductorData.map((item, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors ${
                    item.highlight ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center space-x-1.5">
                      {item.highlight && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                      <span>{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3.5 leading-relaxed">
                    <span className="font-semibold text-slate-900 block mb-0.5">{item.type}</span>
                    {item.mechanism}
                  </td>
                  <td className="p-3.5 leading-relaxed text-slate-600">
                    {item.limitation}
                  </td>
                  <td className="p-3.5 font-medium text-blue-700">
                    {item.application}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
