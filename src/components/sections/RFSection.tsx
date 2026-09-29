import React, { useState, useMemo } from 'react';
import { InteractiveChart, ChartSeries } from '../InteractiveChart';
import { Radio, ShieldAlert, Sparkles, ArrowUpRight, Compass } from 'lucide-react';

export const RFSection: React.FC = () => {
  const [selectedFreqMhz, setSelectedFreqMhz] = useState<number>(3500); // 3.5 GHz (5G Sub-6)
  const [targetDistKm, setTargetDistKm] = useState<number>(2.0); // 2 km
  const [txPowerDbm, setTxPowerDbm] = useState<number>(43); // 43 dBm = 20 Watts (Macro cell)
  const [txGainDbi, setTxGainDbi] = useState<number>(18); // 18 dBi (Base station sector antenna)
  const [rxGainDbi, setRxGainDbi] = useState<number>(0); // 0 dBi (Smartphone dipole)

  // FSPL Formula: FSPL (dB) = 20*log10(d_km) + 20*log10(f_MHz) + 32.44
  const calculateFSPL = (distKm: number, freqMhz: number) => {
    if (distKm <= 0) return 0;
    return 20 * Math.log10(distKm) + 20 * Math.log10(freqMhz) + 32.44;
  };

  const currentFspl = useMemo(() => {
    return calculateFSPL(targetDistKm, selectedFreqMhz);
  }, [targetDistKm, selectedFreqMhz]);

  // Received Signal Power: Rx = Tx + G_tx + G_rx - FSPL
  const rxPowerDbm = useMemo(() => {
    return txPowerDbm + txGainDbi + rxGainDbi - currentFspl;
  }, [txPowerDbm, txGainDbi, rxGainDbi, currentFspl]);

  // Generate Comparison Chart across distances: 0.2km to 8km
  const { distLabels, series } = useMemo(() => {
    const distances: number[] = [];
    const count = 30;
    for (let i = 1; i <= count; i++) {
      distances.push(parseFloat((i * 0.25).toFixed(2))); // 0.25km to 7.5km
    }

    const freqProfiles = [
      { name: 'Sub-1GHz (900 MHz)', freq: 900, color: '#10b981' },
      { name: '5G Sub-6 (3.5 GHz)', freq: 3500, color: '#3b82f6' },
      { name: '5G mmWave (28 GHz)', freq: 28000, color: '#f59e0b' },
      { name: '6G Sub-THz (140 GHz)', freq: 140000, color: '#ec4899' }
    ];

    const chartSeries: ChartSeries[] = freqProfiles.map((p) => ({
      name: p.name,
      data: distances.map((d) => calculateFSPL(d, p.freq)),
      color: p.color,
      dashed: p.freq !== selectedFreqMhz
    }));

    return { distLabels: distances, series: chartSeries };
  }, [selectedFreqMhz]);

  return (
    <div id="rf" className="space-y-8">
      {/* Section Header */}
      <div className="border-l-4 border-indigo-600 pl-4 py-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
            Pillar 04
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            4. 고주파(RF) 공학 및 전파 통신 이론
          </h2>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          분포 정수 전송선로의 S-Parameter, 50Ω 임피던스 타협, 프리스 연쇄 공식에 의한 LNA 중요성 및 자유공간 경로 손실(FSPL)을 시뮬레이션합니다.
        </p>
      </div>

      {/* FSPL Simulator Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-indigo-100 text-indigo-700">
                <Radio className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                자유공간 경로 손실 (Free Space Path Loss) 인터랙티브 시뮬레이터
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              공식: <span className="font-mono font-bold text-indigo-600">FSPL(dB) = 20 log₁₀(d) + 20 log₁₀(f) + 32.44</span> (d: km, f: MHz). 거리가 2배 멀어질 때마다 <strong>6.02 dB</strong>의 수신 전력 감소(1/4 전력)가 발생합니다.
            </p>
          </div>

          {/* Quick Frequency Selectors */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {[
              { label: 'Sub-1G (900MHz)', freq: 900 },
              { label: '5G Sub-6 (3.5GHz)', freq: 3500 },
              { label: '5G mmWave (28GHz)', freq: 28000 },
              { label: '6G THz (140GHz)', freq: 140000 }
            ].map((p) => (
              <button
                key={p.freq}
                onClick={() => setSelectedFreqMhz(p.freq)}
                className={`px-3 py-1.5 rounded-xl border transition ${
                  selectedFreqMhz === p.freq
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <label className="text-slate-600 font-semibold block mb-1">목표 통신 거리 (d, km)</label>
            <input
              type="number"
              value={targetDistKm}
              step="0.25"
              min="0.1"
              max="20"
              onChange={(e) => setTargetDistKm(parseFloat(e.target.value) || 0.1)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 font-semibold block mb-1">송신 전력 (Tx Power, dBm)</label>
            <input
              type="number"
              value={txPowerDbm}
              step="1"
              onChange={(e) => setTxPowerDbm(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 font-semibold block mb-1">송신 안테나 이득 (G_tx, dBi)</label>
            <input
              type="number"
              value={txGainDbi}
              step="1"
              onChange={(e) => setTxGainDbi(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 font-semibold block mb-1">수신 안테나 이득 (G_rx, dBi)</label>
            <input
              type="number"
              value={rxGainDbi}
              step="1"
              onChange={(e) => setRxGainDbi(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Results readout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-indigo-950 text-white p-5 rounded-2xl space-y-1">
            <span className="text-xs text-indigo-300 font-medium block">자유공간 전파 감쇠 (FSPL)</span>
            <div className="text-3xl font-black font-mono text-amber-400">
              {currentFspl.toFixed(1)} dB
            </div>
            <span className="text-[11px] text-slate-400 block">
              거리 {targetDistKm} km @ {selectedFreqMhz >= 1000 ? `${(selectedFreqMhz / 1000).toFixed(1)} GHz` : `${selectedFreqMhz} MHz`}
            </span>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-1">
            <span className="text-xs text-slate-400 font-medium block">단말기 수신 신호 강도 (RSRP)</span>
            <div className={`text-3xl font-black font-mono ${rxPowerDbm >= -95 ? 'text-emerald-400' : rxPowerDbm >= -115 ? 'text-amber-400' : 'text-rose-400'}`}>
              {rxPowerDbm.toFixed(1)} dBm
            </div>
            <span className="text-[11px] text-slate-400 block">
              {rxPowerDbm >= -95 ? '수신 품질 최상 (Excellent)' : rxPowerDbm >= -115 ? '통화 가능 (Edge Cell)' : '수신 불량 한계 (Deep Fade)'}
            </span>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-900 block">주요 거리별 경로 손실 벤치마크</span>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-600">100m 기준 손실:</span>
              <span className="font-mono font-bold text-slate-900">{calculateFSPL(0.1, selectedFreqMhz).toFixed(1)} dB</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-600">1km 기준 손실:</span>
              <span className="font-mono font-bold text-slate-900">{calculateFSPL(1.0, selectedFreqMhz).toFixed(1)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">5km 기준 손실:</span>
              <span className="font-mono font-bold text-slate-900">{calculateFSPL(5.0, selectedFreqMhz).toFixed(1)} dB</span>
            </div>
          </div>
        </div>

        {/* Dynamic Comparison Chart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">거리 증가에 따른 대역별 경로 손실 추이 비교 (0.25km ~ 7.5km)</span>
            <span className="text-[11px] text-slate-500 font-mono">주황 실선: 현재 선택 주파수</span>
          </div>
          <InteractiveChart
            xLabels={distLabels}
            series={series}
            xAxisTitle="통신 거리 (Distance)"
            yAxisTitle="경로 손실 (FSPL, dB)"
            xUnit="km"
            yUnit="dB"
            height={320}
            highlightX={targetDistKm}
          />
        </div>
      </div>

      {/* 3 Core RF Theoretical Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: S-Parameters */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
              S-Parameter (산란 행렬)
            </span>
            <span className="text-xs font-mono text-slate-400">S₁₁, S₂₁</span>
          </div>
          <h4 className="font-bold text-slate-900 text-base">반사 계수 & 전달 이득</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            고주파 회로에서는 전압·전류 대신 진행파와 반사파의 비로 해석합니다. <strong>S₁₁ (반사 손실, Return Loss)</strong>이 <strong>-20 dB 이하</strong>일 때 입사 전력의 1% 미만만 반사되어 이상적인 임피던스 매칭을 의미합니다. <strong>S₂₁</strong>은 전방향 신호 전달 이득을 나타냅니다.
          </p>
        </div>

        {/* Card 2: 50 Ohm Rationale */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
              표준 임피던스
            </span>
            <span className="text-xs font-mono text-slate-400">50 Ω Standard</span>
          </div>
          <h4 className="font-bold text-slate-900 text-base">왜 하필 50 Ω 인가?</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            공기 절연 동축선로에서 도체 전압 절연 파괴 없이 <strong>최대 전력을 전송하는 임피던스는 약 30 Ω</strong>이며, 유전체 및 도체 표피 손실(Attenuation)이 <strong>최소화되는 지점은 약 77 Ω</strong>입니다. 50 Ω은 두 물리적 최적점의 기하학적 평균 절충점으로 세계 표준이 되었습니다.
          </p>
        </div>

        {/* Card 3: Friis Cascaded Noise */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              프리스 연쇄 잡음 공식
            </span>
            <span className="text-xs font-mono text-slate-400">Friis Cascade</span>
          </div>
          <h4 className="font-bold text-slate-900 text-base">수신단 LNA 배치의 절대적 이유</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            수신 시스템의 전체 잡음 지수는 <span className="font-mono font-bold text-slate-800">F_tot = F₁ + (F₂ - 1)/G₁ + ...</span> 로 정의됩니다. 2번째 단 이후의 모든 부품 잡음은 첫째 단의 이득(G₁)으로 나누어지므로, 안테나 직후에 저잡음 고이득 LNA를 배치해야 전체 수신 감도가 보호됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};
