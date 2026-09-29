import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Cpu, Radio } from 'lucide-react';
import { CategoryType } from '../types';

interface ExecutiveBannerProps {
  onSelectCategory: (cat: CategoryType) => void;
}

export const ExecutiveBanner: React.FC<ExecutiveBannerProps> = ({ onSelectCategory }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 shadow-2xl border border-slate-700/60">
      {/* Subtle Background Glows */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-blue-400/30 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>전자 및 정보통신 공학 종합 핵심 리포트 & 대화형 시뮬레이터</span>
        </div>

        <div className="space-y-3 max-w-4xl">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-snug">
            기초 <span className="text-blue-400">전자기학 수학 모델</span>부터 차세대 <span className="text-amber-400">6G RIS 인프라</span>까지
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            맥스웰 4대 방정식, 초미세 GAAFET 트랜지스터(2nm), 부성 귀환 Op-Amp 및 ADC 분해능(ENOB), RF 50Ω 임피던스 타협과 자유공간 전파 손실(FSPL), 섀넌 채널 용량 법칙, AI 데이터센터 CPO 광통신, 6G 지능형 반사 표면(RIS)을 실시간 인터랙티브 그래픽과 계산기로 탐색하세요.
          </p>
        </div>

        {/* 4 Core Pillars KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Card 1 */}
          <div
            onClick={() => onSelectCategory('theory')}
            className="group cursor-pointer bg-slate-800/80 hover:bg-slate-750 p-4 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition duration-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>전자기학의 근원</span>
                <span className="p-1 rounded-md bg-blue-500/20 text-blue-400"><ShieldCheck className="w-3.5 h-3.5" /></span>
              </div>
              <div className="text-xl font-extrabold text-blue-300 font-mono group-hover:text-blue-200 transition">
                4대 맥스웰 식
              </div>
              <p className="text-xs text-slate-400 mt-1">변위 전류(∂E/∂t)와 빛의 전자기파 속도(c) 도출</p>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-blue-400 font-bold mt-3 group-hover:translate-x-1 transition-transform">
              <span>수식 및 공진 곡선 보기</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onSelectCategory('info')}
            className="group cursor-pointer bg-slate-800/80 hover:bg-slate-750 p-4 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition duration-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>통신 이론 절대 한계</span>
                <span className="p-1 rounded-md bg-amber-500/20 text-amber-400"><Flame className="w-3.5 h-3.5" /></span>
              </div>
              <div className="text-xl font-extrabold text-amber-400 font-mono group-hover:text-amber-300 transition">
                -1.59 dB (Eb/N₀)
              </div>
              <p className="text-xs text-slate-400 mt-1">대역폭 무한 확장 시에도 극복 불가능한 섀넌 한계</p>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-amber-400 font-bold mt-3 group-hover:translate-x-1 transition-transform">
              <span>Shannon 용량 계산기</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onSelectCategory('rf')}
            className="group cursor-pointer bg-slate-800/80 hover:bg-slate-750 p-4 rounded-2xl border border-slate-700 hover:border-emerald-500/50 transition duration-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>RF 전송선로 표준</span>
                <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400"><Radio className="w-3.5 h-3.5" /></span>
              </div>
              <div className="text-xl font-extrabold text-emerald-400 font-mono group-hover:text-emerald-300 transition">
                50 Ω 임피던스
              </div>
              <p className="text-xs text-slate-400 mt-1">최대 전력 전송(30Ω)과 최소 감쇠 손실(77Ω)의 조화</p>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-emerald-400 font-bold mt-3 group-hover:translate-x-1 transition-transform">
              <span>FSPL 감쇠 시뮬레이션</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => onSelectCategory('optical6g')}
            className="group cursor-pointer bg-slate-800/80 hover:bg-slate-750 p-4 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition duration-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
                <span>6G & 광 인터커넥트</span>
                <span className="p-1 rounded-md bg-purple-500/20 text-purple-400"><Cpu className="w-3.5 h-3.5" /></span>
              </div>
              <div className="text-xl font-extrabold text-purple-400 font-mono group-hover:text-purple-300 transition">
                ≥ 1 Tbps & RIS
              </div>
              <p className="text-xs text-slate-400 mt-1">CPO 실리콘 포토닉스 패키징 및 THz 음영 메타물질 제어</p>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-purple-400 font-bold mt-3 group-hover:translate-x-1 transition-transform">
              <span>CPO & RIS 메커니즘</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
