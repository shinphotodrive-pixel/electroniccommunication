import React, { useState, useMemo } from 'react';
import { InteractiveChart, ChartSeries } from '../InteractiveChart';
import { Wifi, Flame, Sparkles, Layers, Sliders } from 'lucide-react';

export const InfoTheorySection: React.FC = () => {
  const [bwMhz, setBwMhz] = useState<number>(100); // 100 MHz (e.g. 5G C-band component carrier)
  const [snrDb, setSnrDb] = useState<number>(22); // 22 dB
  const [mimoOrder, setMimoOrder] = useState<number>(4); // 4x4 MIMO

  // Shannon Channel Capacity Calculation:
  // C = M * B * log2(1 + 10^(SNR_dB / 10))
  const calcCapacityGbps = (bw: number, snr: number, mimo: number) => {
    const snrLinear = Math.pow(10, snr / 10);
    const bps = bw * 1e6 * Math.log2(1 + snrLinear) * mimo;
    return bps / 1e9;
  };

  const currentTotalGbps = useMemo(() => {
    return calcCapacityGbps(bwMhz, snrDb, mimoOrder);
  }, [bwMhz, snrDb, mimoOrder]);

  const sisoGbps = useMemo(() => {
    return calcCapacityGbps(bwMhz, snrDb, 1);
  }, [bwMhz, snrDb]);

  const spectralEfficiency = useMemo(() => {
    // bits / sec / Hz = C / B
    const snrLinear = Math.pow(10, snrDb / 10);
    return Math.log2(1 + snrLinear) * mimoOrder;
  }, [snrDb, mimoOrder]);

  // Chart Data: SNR from -6dB to 40dB
  const { snrLabels, series } = useMemo(() => {
    const snrs: number[] = [];
    const count = 24;
    for (let i = 0; i <= count; i++) {
      snrs.push(-6 + i * 2); // -6, -4, ..., 40 dB
    }

    const configs = [
      { name: '1x1 SISO (기본)', mimo: 1, color: '#94a3b8' },
      { name: '2x2 MIMO (2계층)', mimo: 2, color: '#3b82f6' },
      { name: '4x4 MIMO (4계층)', mimo: 4, color: '#8b5cf6' },
      { name: '8x8 MIMO (8계층)', mimo: 8, color: '#ec4899' }
    ];

    const chartSeries: ChartSeries[] = configs.map((c) => ({
      name: c.name,
      data: snrs.map((s) => calcCapacityGbps(bwMhz, s, c.mimo)),
      color: c.color,
      dashed: c.mimo !== mimoOrder
    }));

    return { snrLabels: snrs, series: chartSeries };
  }, [bwMhz, mimoOrder]);

  return (
    <div id="info" className="space-y-8">
      {/* Section Header */}
      <div className="border-l-4 border-purple-600 pl-4 py-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full">
            Pillar 05
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            5. 정보 이론과 디지털 변조 및 다중화 기술
          </h2>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          클로드 섀넌의 채널 용량 정리, 절대적 섀넌 한계(-1.59 dB), 고차 QAM 변조와 대역폭 증가 없이 용량을 선형 확장하는 MIMO 공간 다중화를 다룹니다.
        </p>
      </div>

      {/* Shannon Capacity Calculator & Simulator */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded bg-purple-100 text-purple-700">
                <Wifi className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                섀넌-하틀리 채널 용량 (Shannon-Hartley Capacity) 계산기
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl">
              공식: <span className="font-mono font-bold text-purple-600">C = N_mimo · B · log₂(1 + S/N)</span>. 대역폭(B)과 신호 대 잡음비(SNR)가 주어졌을 때 물리적으로 달성 가능한 에러 프리 전송 속도의 이론적 상한선입니다.
            </p>
          </div>

          <span className="text-xs font-mono bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200 self-start lg:self-auto">
            Shannon Theorem
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div>
            <label className="text-slate-600 font-semibold block mb-1">대역폭 (B, MHz)</label>
            <input
              type="number"
              value={bwMhz}
              min="1"
              max="2000"
              step="10"
              onChange={(e) => setBwMhz(parseFloat(e.target.value) || 1)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-1">5G C-band: 100MHz / mmWave: 400~800MHz</span>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">신호 대 잡음비 (SNR, dB)</label>
            <input
              type="number"
              value={snrDb}
              min="-10"
              max="50"
              step="1"
              onChange={(e) => setSnrDb(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 block mt-1">선형 SNR: {Math.pow(10, snrDb / 10).toFixed(1)}배</span>
          </div>

          <div>
            <label className="text-slate-600 font-semibold block mb-1">MIMO 공간 다중화 안테나 수</label>
            <select
              value={mimoOrder}
              onChange={(e) => setMimoOrder(parseInt(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="1">1x1 SISO (단일 스트림, 1배)</option>
              <option value="2">2x2 MIMO (듀얼 스트림, 2배)</option>
              <option value="4">4x4 MIMO (쿼드 스트림, 4배)</option>
              <option value="8">8x8 Massive MIMO (8배)</option>
              <option value="16">16x16 Ultra MIMO (16배)</option>
            </select>
            <span className="text-[10px] text-slate-400 block mt-1">대역폭 추가 없이 채널 용량 선형 증대</span>
          </div>
        </div>

        {/* Results readout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-1">
            <span className="text-xs text-purple-300 font-medium block">계산된 최고 채널 용량 (C)</span>
            <div className="text-3xl font-black font-mono text-amber-400">
              {currentTotalGbps >= 1 ? `${currentTotalGbps.toFixed(2)} Gbps` : `${(currentTotalGbps * 1000).toFixed(1)} Mbps`}
            </div>
            <span className="text-[11px] text-slate-400 block">
              SISO 단일 안테나 환산 시: {sisoGbps >= 1 ? `${sisoGbps.toFixed(2)} Gbps` : `${(sisoGbps * 1000).toFixed(1)} Mbps`}
            </span>
          </div>

          <div className="bg-purple-50/70 border border-purple-200 p-5 rounded-2xl space-y-1">
            <span className="text-xs text-purple-900 font-medium block">주파수 스펙트럼 효율 (Spectral Efficiency)</span>
            <div className="text-3xl font-black font-mono text-purple-800">
              {spectralEfficiency.toFixed(2)} bps/Hz
            </div>
            <span className="text-[11px] text-purple-600 block">
              1 Hz 대역폭당 초당 전송 가능 비트 수
            </span>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-1">
            <div className="flex items-center space-x-1.5 text-xs text-amber-900 font-semibold">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>절대적 섀넌 한계 (Shannon Limit)</span>
            </div>
            <div className="text-2xl font-black font-mono text-amber-800">
              Eb/N₀ ≥ -1.59 dB
            </div>
            <span className="text-[11px] text-amber-700 block leading-tight">
              Eb/N₀ &lt; -1.59 dB 영역에서는 어떤 LDPC/Polar 코드로도 무오류 전송 불가
            </span>
          </div>
        </div>

        {/* Dynamic Capacity vs SNR Curve */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700">SNR 변화에 따른 MIMO 안테나 차수별 전송 용량 비교 (-6dB ~ 40dB)</span>
            <span className="text-[11px] text-slate-500 font-mono">대역폭: {bwMhz} MHz 고정</span>
          </div>
          <InteractiveChart
            xLabels={snrLabels}
            series={series}
            xAxisTitle="신호 대 잡음비 (SNR)"
            yAxisTitle="채널 용량 (Gbps)"
            xUnit="dB"
            yUnit="Gbps"
            height={320}
            highlightX={snrDb}
          />
        </div>
      </div>

      {/* Digital Modulation Schemes Spectrum Efficiency Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          디지털 직교 진폭 변조 (QAM) 차수별 효율 및 요구 SNR 비교
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          {[
            { mod: 'QPSK (4-QAM)', bits: '2 bits/symbol', snr: '~6 dB', desc: '강한 잡음 내성, 셀 경계 단말' },
            { mod: '16-QAM', bits: '4 bits/symbol', snr: '~12 dB', desc: 'LTE 기본 변조, 음영 지역 통신' },
            { mod: '64-QAM', bits: '6 bits/symbol', snr: '~18 dB', desc: '기지국 중거리 표준 전송' },
            { mod: '256-QAM', bits: '8 bits/symbol', snr: '~24 dB', desc: '5G Sub-6 고속 다운로드' },
            { mod: '1024-QAM', bits: '10 bits/symbol', snr: '~30 dB', desc: 'Wi-Fi 6/7 및 5G-Advanced' },
            { mod: '4096-QAM', bits: '12 bits/symbol', snr: '~36 dB', desc: 'Wi-Fi 7 극초근거리 기가비트' },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">{item.mod}</div>
              <div className="text-purple-700 font-mono font-bold text-[11px]">{item.bits}</div>
              <div className="text-[10px] text-slate-500">요구 SNR: {item.snr}</div>
              <div className="text-[10px] text-slate-400">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
