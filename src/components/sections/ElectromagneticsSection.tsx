import React, { useState, useMemo } from 'react';
import { maxwellEquations } from '../../data/engineeringData';
import { InteractiveChart, ChartSeries } from '../InteractiveChart';
import { Layers, Activity, Info, CheckCircle2 } from 'lucide-react';

export const ElectromagneticsSection: React.FC = () => {
  const [qFactorMode, setQFactorMode] = useState<'high' | 'medium' | 'low' | 'custom'>('medium');
  const [customQ, setCustomQ] = useState<number>(10);
  const [lValMh, setLValMh] = useState<number>(1.0); // 1.0 mH
  const [cValNf, setCValNf] = useState<number>(25.33); // 25.33 nF -> resonant at ~1000 kHz = 1.0 MHz

  // Effective Q value
  const currentQ = useMemo(() => {
    if (qFactorMode === 'high') return 25;
    if (qFactorMode === 'medium') return 8;
    if (qFactorMode === 'low') return 2.5;
    return customQ;
  }, [qFactorMode, customQ]);

  // Resonant frequency calculation: f0 = 1 / (2 * pi * sqrt(L * C))
  const resonantFreqKhz = useMemo(() => {
    const lHenries = lValMh * 1e-3;
    const cFarads = cValNf * 1e-9;
    if (lHenries <= 0 || cFarads <= 0) return 1000;
    const f0 = 1 / (2 * Math.PI * Math.sqrt(lHenries * cFarads));
    return f0 / 1e3; // in kHz
  }, [lValMh, cValNf]);

  const bandwidthKhz = useMemo(() => {
    return resonantFreqKhz / currentQ;
  }, [resonantFreqKhz, currentQ]);

  // Generate Frequency Data Points for the Chart
  const { freqs, series } = useMemo(() => {
    const f0 = resonantFreqKhz;
    const span = f0 * 0.4;
    const pointsCount = 45;
    const freqArr: number[] = [];
    const dataGain: number[] = [];

    for (let i = 0; i < pointsCount; i++) {
      const f = (f0 - span) + (i / (pointsCount - 1)) * (2 * span);
      freqArr.push(Math.round(f));

      // Normalized amplitude response of series RLC bandpass resonator:
      // |H(f)| = 1 / sqrt(1 + Q^2 * (f/f0 - f0/f)^2)
      const ratio = f / f0 - f0 / f;
      const gain = 1 / Math.sqrt(1 + currentQ * currentQ * ratio * ratio);
      dataGain.push(gain);
    }

    const chartSeries: ChartSeries[] = [
      {
        name: `Q=${currentQ} 공진 이득`,
        data: dataGain,
        color: '#2563eb',
        fillColor: 'rgba(37, 99, 235, 0.12)'
      }
    ];

    return { freqs: freqArr, series: chartSeries };
  }, [resonantFreqKhz, currentQ]);

  return (
    <div id="theory" className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-l-4 border-blue-600 pl-4 py-1 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Pillar 01
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              1. 전자기학 기초 & 회로 수학 모델링
            </h2>
          </div>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            전자기파 방사와 자유공간 전파의 물리적 근원인 맥스웰 4대 방정식과 거시적 RLC 공진 필터 특성을 심층 탐구합니다.
          </p>
        </div>
      </div>

      {/* 4 Maxwell Equations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {maxwellEquations.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-black uppercase text-blue-600 font-mono">
                  Equation #{item.number}
                </span>
                <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                <span className="text-[11px] text-slate-400 font-medium">{item.nameEn}</span>
              </div>

              {/* Math Display Box */}
              <div className="my-3 p-3 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl text-center shadow-inner">
                <span className="font-mono text-base sm:text-lg font-black text-amber-300 tracking-wider">
                  {item.formula}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.meaning}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-start space-x-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <span><strong>핵심 응용:</strong> {item.application}</span>
            </div>
          </div>
        ))}
      </div>

      {/* RLC Resonator & Q-Factor Visualizer */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-blue-100 text-blue-700">
                <Activity className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                RLC 직렬 공진 회로 & Q-Factor (품질 계수) 동적 시뮬레이터
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              공진 조건 <span className="font-mono font-bold text-blue-600">ω₀L = 1/(ω₀C)</span> 일 때 유도성과 용량성 리액턴스가 상쇄되어 순수 저항(R)만 남아 전류가 최대가 됩니다. Q인자가 높을수록 통과 대역(BW)이 좁고 선택도(Selectivity)가 예리한 고주파 필터가 됩니다.
            </p>
          </div>

          {/* Q Selection Pills */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl text-xs font-semibold self-start lg:self-auto">
            <button
              onClick={() => setQFactorMode('high')}
              className={`px-3 py-1.5 rounded-lg transition ${
                qFactorMode === 'high' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              High Q (25, 협대역)
            </button>
            <button
              onClick={() => setQFactorMode('medium')}
              className={`px-3 py-1.5 rounded-lg transition ${
                qFactorMode === 'medium' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Medium Q (8)
            </button>
            <button
              onClick={() => setQFactorMode('low')}
              className={`px-3 py-1.5 rounded-lg transition ${
                qFactorMode === 'low' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Low Q (2.5, 광대역)
            </button>
          </div>
        </div>

        {/* Parameters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
          <div>
            <label className="text-slate-600 font-semibold block mb-1">인덕턴스 L (mH)</label>
            <input
              type="number"
              value={lValMh}
              step="0.1"
              min="0.1"
              onChange={(e) => setLValMh(parseFloat(e.target.value) || 0.1)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 font-semibold block mb-1">커패시턴스 C (nF)</label>
            <input
              type="number"
              value={cValNf}
              step="1"
              min="0.5"
              onChange={(e) => setCValNf(parseFloat(e.target.value) || 1)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-slate-600 font-semibold block mb-1">사용자 정의 Q Factor</label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={currentQ}
                onChange={(e) => {
                  setQFactorMode('custom');
                  setCustomQ(parseFloat(e.target.value));
                }}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="font-mono font-bold text-blue-700 bg-white px-2.5 py-1 rounded border border-slate-300 min-w-[3rem] text-center">
                {currentQ}
              </span>
            </div>
          </div>
        </div>

        {/* Output Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl">
            <span className="text-[11px] text-blue-700 font-semibold block">공진 주파수 (f₀ = 1 / 2π√LC)</span>
            <span className="text-lg font-black font-mono text-blue-900">{resonantFreqKhz.toFixed(2)} kHz</span>
          </div>
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl">
            <span className="text-[11px] text-indigo-700 font-semibold block">통과 대역폭 (-3dB Bandwidth, BW)</span>
            <span className="text-lg font-black font-mono text-indigo-900">{bandwidthKhz.toFixed(2)} kHz</span>
          </div>
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <span className="text-[11px] text-emerald-700 font-semibold block">반치폭 주파수 영역 (f_L ~ f_H)</span>
            <span className="text-base font-black font-mono text-emerald-900">
              {(resonantFreqKhz - bandwidthKhz / 2).toFixed(1)} ~ {(resonantFreqKhz + bandwidthKhz / 2).toFixed(1)} kHz
            </span>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="pt-2">
          <InteractiveChart
            xLabels={freqs}
            series={series}
            xAxisTitle="주파수 (Frequency)"
            yAxisTitle="정규화 전압 이득 (V/V)"
            xUnit="kHz"
            height={300}
            highlightX={Math.round(resonantFreqKhz)}
          />
        </div>
      </div>
    </div>
  );
};
