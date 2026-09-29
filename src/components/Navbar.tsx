import React, { useState } from 'react';
import { Zap, Menu, X, HelpCircle, Layers, Cpu, Activity, Radio, Wifi, Globe, Search, BatteryCharging, Calculator } from 'lucide-react';
import { CategoryType } from '../types';

interface NavbarProps {
  activeTab: CategoryType;
  onTabChange: (tab: CategoryType) => void;
  onScrollToQuiz: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onScrollToQuiz, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'theory', label: '전자기학 & 회로', icon: Layers },
    { id: 'semicon', label: '반도체 & 집적회로', icon: Cpu },
    { id: 'conversion', label: '아날로그 & ADC', icon: Activity },
    { id: 'rf', label: 'RF & 전파통신', icon: Radio },
    { id: 'info', label: '정보이론 & MIMO', icon: Wifi },
    { id: 'optical6g', label: '광통신 & 6G', icon: Globe },
    { id: 'power', label: '소모전력 & 태양광', icon: BatteryCharging },
    { id: 'calc', label: '공학 계산기', icon: Calculator },
  ] as const;

  const handleSelect = (id: CategoryType) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleSelect('all')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white font-mono">ELEC-TELECOM</span>
                <span className="text-[10px] uppercase font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">전자기학 이론에서 6G RIS 인프라까지</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center space-x-1 text-xs font-semibold">
            <button
              onClick={() => handleSelect('all')}
              className={`px-3 py-2 rounded-lg transition ${
                activeTab === 'all' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              전체 보기
            </button>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 py-2 rounded-lg transition ${
                    isActive ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Search & Quiz CTA & Mobile Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Search Modal Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-750 text-slate-200 hover:text-white px-3 py-2 rounded-xl text-xs border border-slate-700 hover:border-blue-400/60 transition shadow-inner group"
              title="전문 용어 퀵 서치 (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="font-semibold hidden md:inline">용어 퀵 서치</span>
              <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-900/90 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={onScrollToQuiz}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-amber-500/20 transition active:scale-95"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">자가 진단 퀴즈</span>
              <span className="sm:hidden">퀴즈</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="메뉴 열기"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <button
            onClick={() => {
              onOpenSearch();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-blue-900/30 text-blue-300 border border-blue-700/50 mb-2"
          >
            <Search className="w-4 h-4 text-blue-400" />
            <span>전문 용어 퀵 서치 모달 열기</span>
          </button>
          <button
            onClick={() => handleSelect('all')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold ${
              activeTab === 'all' ? 'bg-amber-400/20 text-amber-300' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            전체 개요 보기
          </button>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold ${
                  isActive ? 'bg-blue-600/30 text-blue-300' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

