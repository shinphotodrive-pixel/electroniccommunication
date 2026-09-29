import React, { useState, useEffect } from 'react';
import { CategoryType } from './types';
import { Navbar } from './components/Navbar';
import { ExecutiveBanner } from './components/ExecutiveBanner';
import { ElectromagneticsSection } from './components/sections/ElectromagneticsSection';
import { SemiconductorSection } from './components/sections/SemiconductorSection';
import { AnalogSection } from './components/sections/AnalogSection';
import { RFSection } from './components/sections/RFSection';
import { InfoTheorySection } from './components/sections/InfoTheorySection';
import { Optical6GSection } from './components/sections/Optical6GSection';
import { PowerConsumptionSection } from './components/sections/PowerConsumptionSection';
import { EngineeringCalculatorSuite } from './components/EngineeringCalculatorSuite';
import { KnowledgeSearchMatrix } from './components/KnowledgeSearchMatrix';
import { QuizSection } from './components/QuizSection';
import { QuickSearchModal } from './components/QuickSearchModal';
import { Layers, Cpu, Activity, Radio, Wifi, Globe, LayoutGrid, BatteryCharging, Calculator } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<CategoryType>('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Keyboard Shortcuts (Ctrl+K, Cmd+K, or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // Check '/' key when not inside input or textarea
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToQuiz = () => {
    const quizEl = document.getElementById('quiz');
    if (quizEl) {
      quizEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabChange = (tab: CategoryType) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFromSearch = (cat: CategoryType) => {
    setActiveTab(cat);
    // Smooth scroll to target section
    setTimeout(() => {
      const el = document.getElementById(cat);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const tabPills = [
    { id: 'all' as CategoryType, label: '전체 보기', icon: LayoutGrid },
    { id: 'theory' as CategoryType, label: '1. 전자기학 & 회로', icon: Layers },
    { id: 'semicon' as CategoryType, label: '2. 반도체 & 집적회로', icon: Cpu },
    { id: 'conversion' as CategoryType, label: '3. 아날로그 & ADC', icon: Activity },
    { id: 'rf' as CategoryType, label: '4. RF & 전파통신', icon: Radio },
    { id: 'info' as CategoryType, label: '5. 정보이론 & MIMO', icon: Wifi },
    { id: 'optical6g' as CategoryType, label: '6. 광통신 & 6G', icon: Globe },
    { id: 'power' as CategoryType, label: '7. 소모전력 & 태양광', icon: BatteryCharging },
    { id: 'calc' as CategoryType, label: '8. 공학 계산기 (Math.js)', icon: Calculator }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-slate-800 antialiased">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onScrollToQuiz={scrollToQuiz}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
        {/* Executive Header Banner */}
        <ExecutiveBanner onSelectCategory={(cat) => handleTabChange(cat)} />

        {/* Tab Selection Filter Bar */}
        <div className="sticky top-16 z-40 bg-[#faf8f5]/95 backdrop-blur-md py-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-slate-200/80">
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold">
            {tabPills.map((pill) => {
              const Icon = pill.icon;
              const isActive = activeTab === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => handleTabChange(pill.id)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{pill.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1: Electromagnetics & Circuits */}
        {(activeTab === 'all' || activeTab === 'theory') && (
          <ElectromagneticsSection />
        )}

        {/* Section 2: Semiconductor & IC */}
        {(activeTab === 'all' || activeTab === 'semicon') && (
          <SemiconductorSection />
        )}

        {/* Section 3: Analog & ADC Conversion */}
        {(activeTab === 'all' || activeTab === 'conversion') && (
          <AnalogSection />
        )}

        {/* Section 4: RF & Propagation */}
        {(activeTab === 'all' || activeTab === 'rf') && (
          <RFSection />
        )}

        {/* Section 5: Information Theory & MIMO */}
        {(activeTab === 'all' || activeTab === 'info') && (
          <InfoTheorySection />
        )}

        {/* Section 6: Optical Interconnect & 6G */}
        {(activeTab === 'all' || activeTab === 'optical6g') && (
          <Optical6GSection />
        )}

        {/* Section 7: Power Consumption & Off-Grid Solar */}
        {(activeTab === 'all' || activeTab === 'power') && (
          <PowerConsumptionSection />
        )}

        {/* Section 8: Engineering Calculator Suite (math.js Powered) */}
        {(activeTab === 'all' || activeTab === 'calc') && (
          <EngineeringCalculatorSuite />
        )}

        {/* Global Knowledge Search Matrix (Shown in all or section context) */}
        <KnowledgeSearchMatrix />

        {/* Self-Assessment Verification Quiz */}
        <QuizSection />
      </main>

      {/* Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateToSection={handleNavigateFromSearch}
      />

      {/* Global Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <span className="font-bold text-white font-mono">ELEC-TELECOM KNOWLEDGE EXPLORER</span>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded">v2.5</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              기초 맥스웰 방정식 · 반도체 GAAFET · Op-Amp/ADC · RF 50Ω & FSPL · 섀넌 법칙 · 6G RIS
            </p>
          </div>
          <div className="text-slate-500 text-center sm:text-right text-[11px] space-y-0.5">
            <p>전자 및 정보통신 공학 전면 분석 대화형 웹 플랫폼</p>
            <p>React 19 · TypeScript · Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
