import React, { useState } from 'react';
import { interconnectComparison } from '../../data/engineeringData';
import { Globe, Cpu, Sparkles, Zap, Radio, CornerDownRight, CheckCircle2 } from 'lucide-react';

export const Optical6GSection: React.FC = () => {
  const [risActive, setRisActive] = useState<boolean>(true);
  const [selectedInterconnect, setSelectedInterconnect] = useState<string>('CPO');

  return (
    <div id="optical6g" className="space-y-8">
      {/* Section Header */}
      <div className="border-l-4 border-slate-900 pl-4 py-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Pillar 06
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            6. 차세대 광통신과 6G 무선 네트워크 아키텍처
          </h2>
        </div>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          초거대 AI 데이터센터 인터커넥트 패러다임(DAC vs AOC vs CPO)과 6G 테라헤르츠(THz) 전파 음영을 극복하는 초저전력 지능형 반사 표면(RIS)을 분석합니다.
        </p>
      </div>

      {/* Interconnect Comparison Matrix */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              데이터센터 AI 연산 클러스터 인터커넥트 기술 3대 계층 비교
            </h3>
            <p className="text-xs text-slate-500">
              GPU와 스위치 간 대역폭 폭증(800Gbps → 1.6Tbps)에 대응하는 물리 계층 배선 기술
            </p>
          </div>
          <span className="text-xs font-semibold bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-200 self-start sm:self-auto">
            AI Cluster Interconnects
          </span>
        </div>

        {/* 3 Interconnect Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {interconnectComparison.map((item) => {
            const isSelected = selectedInterconnect === item.title;
            return (
              <div
                key={item.title}
                onClick={() => setSelectedInterconnect(item.title)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50/20 shadow-md ring-2 ring-purple-400/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-900 font-mono">{item.title}</span>
                      <span className="text-xs text-slate-400 block font-medium">{item.titleEn}</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {item.badge}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-purple-800 bg-purple-100/60 p-2 rounded-lg">
                    전송 거리: {item.distance}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.features}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-emerald-700 block">장점:</span>
                    <p className="text-slate-600">{item.advantages}</p>
                  </div>
                  <div>
                    <span className="font-bold text-rose-700 block">한계:</span>
                    <p className="text-slate-600">{item.limitations}</p>
                  </div>
                  <div className="pt-1">
                    <span className="font-bold text-slate-900 block">적용:</span>
                    <span className="text-slate-600 font-medium">{item.application}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6G RIS Interactive Mechanism Card */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>6G 전파 음영 극복 게임체인저</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
              RIS (Reconfigurable Intelligent Surface / 지능형 반사 표면)
            </h3>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-300 font-semibold px-2">RIS 반사 제어:</span>
            <button
              onClick={() => setRisActive(!risActive)}
              className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                risActive
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {risActive ? '활성화 (NLoS 연결)' : '비활성화 (단절)'}
            </button>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
          6G 테라헤르츠(100GHz~1THz) 대역은 파장이 극히 짧아 건물이나 장애물에 가로막히면 <strong>회절(Diffraction)되지 않고 극심한 전파 음영 구역(Blind Spot)</strong>이 발생합니다. 기존 중계기(Repeater)는 전력을 많이 소모하고 잡음까지 증폭시키지만, <strong>RIS는 수천 개의 초저전력 메타물질 소자의 위상(Phase)을 전자기적으로 능동 제어하여 원하는 방향으로 전파를 꺾어주는(Beam Steering)</strong> 스마트 무선 환경(SMRE)을 구현합니다.
        </p>

        {/* Visual Architectural Simulation Block */}
        <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {/* Step 1: Base Station */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700/80 space-y-2">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                1
              </div>
              <div className="font-bold text-sm text-blue-300">6G THz 초고주파 기지국</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                직진성이 매우 강한 140 GHz 테라헤르츠 빔 방사 (건물에 가로막혀 단말로 직접 도달 불가)
              </p>
              <div className="text-[11px] text-blue-400 font-mono pt-1">
                직접 경로(LoS): <strong>차단됨 ✖</strong>
              </div>
            </div>

            {/* Step 2: RIS Metamaterial */}
            <div
              className={`p-4 rounded-xl border transition-all duration-300 space-y-2 ${
                risActive
                  ? 'bg-purple-900/40 border-purple-500/60 shadow-lg ring-1 ring-purple-500'
                  : 'bg-slate-900 border-slate-800 opacity-60'
              }`}
            >
              <div className="w-10 h-10 mx-auto rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                2
              </div>
              <div className="font-bold text-sm text-purple-300">벽면 RIS 메타물질 표면</div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                수천 개의 버랙터/PIN 다이오드가 반사 전파의 위상을 조작하여 음영 방향으로 반사 조향
              </p>
              <div className="text-[11px] font-mono pt-1 text-purple-300">
                {risActive ? '위상 조향 빔스티어링: 작동 중 ✓' : '단순 난반사 (미작동)'}
              </div>
            </div>

            {/* Step 3: Blind Spot Device */}
            <div
              className={`p-4 rounded-xl border transition-all duration-300 space-y-2 ${
                risActive
                  ? 'bg-emerald-900/40 border-emerald-500/60 shadow-lg'
                  : 'bg-rose-950/40 border-rose-800'
              }`}
            >
              <div
                className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold ${
                  risActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                3
              </div>
              <div className={`font-bold text-sm ${risActive ? 'text-emerald-300' : 'text-rose-400'}`}>
                음영 구역 6G 모바일 단말
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {risActive
                  ? '건물 모퉁이 뒤에서도 RIS 우회 반사파(NLoS)를 수신하여 기가비트 통신 유지'
                  : '전파 차단으로 서비스 먹통(Deep Blind Spot) 상태'}
              </p>
              <div
                className={`text-[11px] font-mono font-bold pt-1 ${
                  risActive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                수신 상태: {risActive ? '초고속 연결 성공 (≥ 100 Gbps)' : '신호 없음 (0 bps)'}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span><strong>전력 소모:</strong> 메타물질 수동 반사이므로 mW 단위 초저전력 (친환경 6G)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span><strong>잡음 특성:</strong> RF 증폭기 노이즈(NF) 추가 없는 순수 위상 변조</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
