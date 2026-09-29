import React, { useState } from 'react';
import { quizQuestions } from '../data/engineeringData';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizSection: React.FC = () => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (userAnswers[questionIndex] !== undefined) return; // already answered

    const updated = { ...userAnswers, [questionIndex]: optionIndex };
    setUserAnswers(updated);

    // Check if all answered
    if (Object.keys(updated).length === quizQuestions.length) {
      setIsCompleted(true);
      // Calculate score
      let correct = 0;
      quizQuestions.forEach((q, idx) => {
        if (updated[idx] === q.ans) correct++;
      });
      if (correct >= 4) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsCompleted(false);
  };

  const score = Object.keys(userAnswers).reduce((acc, key) => {
    const idx = parseInt(key);
    return userAnswers[idx] === quizQuestions[idx].ans ? acc + 1 : acc;
  }, 0);

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <section id="quiz" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
      {/* Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white">
              전자 및 통신 공학 실무 이해도 자가 진단 퀴즈
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            보고서에서 학습한 핵심 이론(LNA, 50Ω, FSPL, Shannon Limit, GAAFET, RIS)을 객관식 문제로 점검하세요.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">진행 상황</span>
            <span className="font-mono text-sm font-black text-amber-400">
              {answeredCount} / {quizQuestions.length} 완료
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 font-mono font-bold text-sm text-emerald-400">
            점수: {score} / {quizQuestions.length}
          </div>

          {answeredCount > 0 && (
            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
              title="퀴즈 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-5">
        {quizQuestions.map((qObj, qIdx) => {
          const selectedOpt = userAnswers[qIdx];
          const hasAnswered = selectedOpt !== undefined;
          const isCorrect = selectedOpt === qObj.ans;

          return (
            <div
              key={qObj.id}
              className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 space-y-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 inline-block mb-1">
                      {qObj.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {qObj.q}
                    </h4>
                  </div>
                </div>

                {hasAnswered && (
                  <div className="flex-shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center space-x-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>정답</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-xs font-bold text-rose-400 bg-rose-950/60 px-2.5 py-1 rounded-full border border-rose-800">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>오답</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {qObj.options.map((opt, optIdx) => {
                  let btnStyle = 'bg-slate-900/90 hover:bg-slate-700 text-slate-300 border-slate-700';

                  if (hasAnswered) {
                    if (optIdx === qObj.ans) {
                      btnStyle = 'bg-emerald-700 text-white font-bold border-emerald-500 shadow-md';
                    } else if (optIdx === selectedOpt && !isCorrect) {
                      btnStyle = 'bg-rose-800 text-white border-rose-600';
                    } else {
                      btnStyle = 'bg-slate-900/40 text-slate-500 border-slate-800 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      className={`text-left p-3 rounded-xl border text-xs leading-relaxed transition-all flex items-start space-x-2 ${btnStyle}`}
                    >
                      <span className="font-mono font-bold opacity-75">{optIdx + 1}.</span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box on Answer */}
              {hasAnswered && (
                <div
                  className={`p-3.5 rounded-xl text-xs leading-relaxed border flex items-start space-x-2 ${
                    isCorrect
                      ? 'bg-emerald-950/50 text-emerald-200 border-emerald-800/80'
                      : 'bg-rose-950/50 text-rose-200 border-rose-800/80'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div>
                    <strong className="block mb-0.5">
                      {isCorrect ? '정답 해설:' : `오답 (정답: ${qObj.ans + 1}번):`}
                    </strong>
                    {qObj.explain}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-800 to-blue-500/20 border border-amber-500/40 text-center space-y-3">
          <Award className="w-8 h-8 text-amber-400 mx-auto" />
          <h4 className="text-lg font-black text-white">
            퀴즈 완료! 최종 점수: <span className="text-amber-400">{score}점</span> / {quizQuestions.length}점
          </h4>
          <p className="text-xs text-slate-300 max-w-lg mx-auto">
            {score === quizQuestions.length
              ? '축하합니다! 전자 및 통신 공학의 핵심 맥스웰, GAAFET, 50Ω, FSPL, 섀넌 법칙, 6G RIS 개념을 완벽하게 마스터하셨습니다!'
              : score >= 4
              ? '우수한 성적입니다! 오답 해설을 복습하여 기초 물리와 차세대 통신 개념을 다져보세요.'
              : '수고하셨습니다! 상단 섹션들의 대화형 시뮬레이터와 지식 매트릭스를 다시 확인해 보세요.'}
          </p>
          <button
            onClick={handleReset}
            className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>다시 풀기</span>
          </button>
        </div>
      )}
    </section>
  );
};
