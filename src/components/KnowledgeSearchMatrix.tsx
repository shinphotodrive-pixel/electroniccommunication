import React, { useState, useMemo } from 'react';
import { knowledgeData } from '../data/engineeringData';
import { Search, Copy, Check, Filter, BookOpen } from 'lucide-react';
import { CategoryType } from '../types';

export const KnowledgeSearchMatrix: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories: { id: CategoryType; label: string }[] = [
    { id: 'all', label: '전체 (All)' },
    { id: 'theory', label: '전자기학' },
    { id: 'semicon', label: '반도체' },
    { id: 'conversion', label: '아날로그·ADC' },
    { id: 'rf', label: 'RF통신' },
    { id: 'info', label: '정보이론' },
    { id: 'optical6g', label: '광통신·6G' },
    { id: 'power', label: '소모전력·태양광' }
  ];

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return knowledgeData.filter((item) => {
      const matchCat = activeCategory === 'all' || item.cat === activeCategory;
      if (!matchCat) return false;

      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.eq.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, activeCategory]);

  const handleCopyFormula = (id: string, formula: string) => {
    navigator.clipboard.writeText(formula);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 1800);
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      {/* Header & Search Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-blue-100 text-blue-700">
              <BookOpen className="w-4 h-4" />
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              전자 및 통신 공학 공식 & 핵심 개념 지식 매트릭스
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            보고서 내 총 {knowledgeData.length}가지 핵심 수식, 동작 원리, 파라미터를 실시간 키워드로 검색하고 복사하세요.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="공식, 키워드 검색 (예: Shannon, FSPL, LSB, RIS...)"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-semibold">
        <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
              activeCategory === c.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid of Knowledge Cards */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs">
          검색어 &apos;{searchQuery}&apos; 에 일치하는 수식이나 개념이 없습니다. 다른 키워드로 검색해 보세요.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-slate-50/70 hover:bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-blue-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{item.title}</span>
                    <span className="text-[10px] font-semibold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                      {item.catLabel}
                    </span>
                  </div>

                  {/* Formula Box with Copy Action */}
                  <div className="mt-2 relative bg-white border border-slate-200 rounded-xl p-2.5 font-mono text-xs font-bold text-blue-800 shadow-inner flex items-center justify-between">
                    <span className="truncate pr-2">{item.eq}</span>
                    <button
                      onClick={() => handleCopyFormula(item.id, item.eq)}
                      title="수식 복사"
                      className="text-slate-400 hover:text-blue-600 p-1 rounded-md hover:bg-slate-100 transition flex-shrink-0"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-200/60">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      onClick={() => setSearchQuery(tag)}
                      className="text-[10px] bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 px-1.5 py-0.5 rounded cursor-pointer border border-slate-200 transition"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
