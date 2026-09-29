import React, { useState, useEffect, useRef, useMemo } from 'react';
import { glossaryTerms } from '../data/glossaryData';
import { CategoryType, GlossaryTerm } from '../types';
import { Search, X, ArrowRight, ExternalLink, Hash, Bookmark, BookOpen, Sparkles, CornerDownLeft } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection: (cat: CategoryType) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSection
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on open and prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setSelectedCategory('all');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Global ESC handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: '전체' },
    { id: 'theory', label: '1. 전자기학 & 회로' },
    { id: 'semicon', label: '2. 반도체 & 집적회로' },
    { id: 'conversion', label: '3. 아날로그 & ADC' },
    { id: 'rf', label: '4. RF & 전파통신' },
    { id: 'info', label: '5. 정보이론 & MIMO' },
    { id: 'optical6g', label: '6. 광통신 & 6G' },
    { id: 'power', label: '7. 소모전력 & 태양광' }
  ];

  // Filtering terms in real-time
  const filteredTerms = useMemo(() => {
    const q = query.toLowerCase().trim();
    return glossaryTerms.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;

      return (
        item.termKo.toLowerCase().includes(q) ||
        item.termEn.toLowerCase().includes(q) ||
        (item.acronym && item.acronym.toLowerCase().includes(q)) ||
        item.definition.toLowerCase().includes(q) ||
        item.sectionTitle.toLowerCase().includes(q) ||
        item.keyPoints.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [query, selectedCategory]);

  const handleSelectTerm = (term: GlossaryTerm) => {
    onNavigateToSection(term.category);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-8 sm:my-12 flex flex-col max-h-[85vh]">
        {/* Modal Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">전자 및 통신 공학 전문 용어 퀵 서치</h3>
                <p className="text-[11px] text-slate-500">실시간 용어 정의, 핵심 공식 및 관련 학습 섹션 바로가기</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="hidden sm:inline-flex items-center text-[10px] font-mono bg-slate-200 text-slate-600 px-2 py-1 rounded-md border border-slate-300">
                ESC 닫기
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                aria-label="모달 닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="전문 용어 또는 약어 입력 (예: Maxwell, GAAFET, ENOB, FSPL, 50 옴, Shannon, RIS, CPO...)"
              className="w-full bg-white border border-slate-300 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition whitespace-nowrap ${
                  selectedCategory === c.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count Bar */}
        <div className="px-5 py-2 bg-slate-100/70 border-b border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>
            검색 결과: <strong className="text-slate-800 font-bold">{filteredTerms.length}</strong>개 용어
          </span>
          <span className="text-[10px] text-slate-400">카드를 클릭하면 해당 섹션으로 즉시 이동합니다</span>
        </div>

        {/* Scrollable Terms List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-grow">
          {filteredTerms.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                &apos;{query}&apos;에 일치하는 전문 용어를 찾을 수 없습니다.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
                <span>추천 검색어:</span>
                {['GAAFET', 'FSPL', 'Shannon', '50 옴', 'RIS', 'Op-Amp', 'Maxwell', 'CPO'].map((rec) => (
                  <button
                    key={rec}
                    onClick={() => setQuery(rec)}
                    className="bg-slate-100 hover:bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-slate-200 transition"
                  >
                    #{rec}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            filteredTerms.map((term) => (
              <div
                key={term.id}
                onClick={() => handleSelectTerm(term)}
                className="group cursor-pointer bg-white hover:bg-blue-50/40 rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-blue-400 transition-all duration-150 shadow-sm hover:shadow space-y-2.5"
              >
                {/* Term Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {term.termKo}
                    </span>
                    <span className="text-xs text-slate-500 font-medium font-mono">
                      ({term.termEn})
                    </span>
                    {term.acronym && (
                      <span className="text-[10px] font-bold font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                        {term.acronym}
                      </span>
                    )}
                  </div>

                  {/* Section Badge */}
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 self-start sm:self-auto">
                    {term.sectionTitle}
                  </span>
                </div>

                {/* Definition */}
                <p className="text-xs text-slate-700 leading-relaxed">
                  {term.definition}
                </p>

                {/* Key Points & Formula */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div className="sm:col-span-2 space-y-1">
                    {term.keyPoints.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start space-x-1.5 text-[11px] text-slate-500">
                        <span className="text-blue-500 font-bold">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>

                  {term.formulaOrSpec && (
                    <div className="bg-slate-50 rounded-xl p-2 border border-slate-200 self-center text-center">
                      <span className="text-[10px] text-slate-400 block font-medium">수식 / 핵심 규격</span>
                      <span className="font-mono text-xs font-bold text-purple-700">
                        {term.formulaOrSpec}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Action Hint */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1 text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                    <span>{term.sectionTitle} 본문으로 이동</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="hidden sm:inline font-mono text-[10px]">Enter ↵</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-100/90 border-t border-slate-200 px-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            총 <strong className="text-slate-800">{glossaryTerms.length}개</strong> 전자·통신 전문 용어 수록
          </span>
          <div className="flex items-center space-x-2 text-[11px]">
            <span>단축키:</span>
            <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 font-mono text-[10px] text-slate-700 shadow-sm">
              Ctrl+K
            </kbd>
            <span>또는</span>
            <kbd className="bg-white border border-slate-300 rounded px-1.5 py-0.5 font-mono text-[10px] text-slate-700 shadow-sm">
              /
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
