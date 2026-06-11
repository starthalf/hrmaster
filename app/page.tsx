"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Step 0 — Welcome.
 * Full-screen meaningful first decision: Turnkey (coming soon, → e-hcg.com) vs Master (start the 5-min tour).
 * No Hero / ServiceStack / HowItWorks / Coverage / SocialProof / CTA sections — this page is
 * intentionally NOT a marketing landing.
 */
export default function WelcomePage() {
  const handleTurnkeyClick = async () => {
    // Fire-and-forget analytics; never block the redirect.
    try {
      await fetch("/api/turnkey-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "welcome" }),
      });
    } catch {
      /* swallow — analytics must not block UX */
    }
    window.open("https://e-hcg.com/professional-services", "_blank");
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Minimal header — logo only, no menu (this is not a marketing site). */}
      <header className="h-16 flex items-center container-x">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-primary-900 tracking-tight"
        >
          <span
            aria-hidden
            className="inline-flex w-7 h-7 rounded-md bg-gradient-to-br from-accent-500 to-accent-700 text-white items-center justify-center font-bold text-[13px]"
          >
            H
          </span>
          <span>HCG Master</span>
        </Link>
      </header>

      {/* Main chooser — vertically centered */}
      <section className="flex-1 flex items-center justify-center py-12">
        <div className="container-tour w-full">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="text-center max-w-[760px] mx-auto"
          >
            <span className="chip chip-accent inline-flex items-center gap-1.5">
              <Sparkles size={13} />
              5분 인터랙티브 체험
            </span>
            <h1 className="h-hero mt-5">
              HCG 컨설팅,
              <br className="hidden sm:block" />
              <span className="text-accent-600"> 어떻게 함께</span>하시겠어요?
            </h1>
            <p className="body-lg text-primary-600 mt-5 max-w-[560px] mx-auto">
              회사 소개 페이지가 아닙니다. 회사 상황에 맞는 방식을 고르시면, 컨설팅 흐름을
              직접 체험해보실 수 있어요.
            </p>
          </motion.div>

          {/* Two-card chooser */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
            }}
            className="grid md:grid-cols-2 gap-5 mt-14"
          >
            {/* LEFT — Turnkey (coming soon, redirects to e-hcg.com) */}
            <motion.button
              type="button"
              onClick={handleTurnkeyClick}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              className="card card-soft border-dashed text-left group hover:border-primary-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="chip">준비 중</span>
                <ArrowUpRight
                  size={20}
                  className="text-primary-400 group-hover:text-primary-600 transition-colors"
                />
              </div>
              <h2 className="h-2 mt-5 text-primary-700">통합 컨설팅</h2>
              <p className="body-sm text-primary-500 mt-2">
                3~4개월 상주형 · 풀패키지
              </p>
              <p className="body text-primary-600 mt-5">
                처음부터 끝까지 새로 설계해야 할 때.
                <br />
                직급 · 평가 · 보상 · 진단 풀세트.
              </p>
              <p className="body-sm text-primary-400 mt-6 inline-flex items-center gap-1">
                HCG 본사 사이트에서 상담받으실 수 있어요
                <ArrowUpRight size={14} />
              </p>
            </motion.button>

            {/* RIGHT — Master (start tour) */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
            >
              <Link
                href="/tour/1-diagnose"
                className="card border-accent-500 bg-white relative overflow-hidden block group hover:shadow-[0_24px_48px_-20px_rgba(14,165,233,0.4)] transition-all"
              >
                {/* Decorative accent gradient */}
                <div
                  aria-hidden
                  className="absolute -top-20 -right-20 w-60 h-60 bg-accent-100 rounded-full blur-3xl opacity-60"
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="chip chip-accent">추천 · 지금 체험</span>
                    <ArrowRight
                      size={20}
                      className="text-accent-500 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <h2 className="h-2 mt-5 text-primary-900">Master 자문</h2>
                  <p className="body-sm text-primary-600 mt-2">
                    월 retainer · 필요할 때 함께
                  </p>
                  <p className="body text-primary-600 mt-5">
                    HR 담당자 옆에 전문가 한 명을 두는 비용으로.
                    <br />
                    핫라인 · 방문 · 템플릿 · 제도 설계까지.
                  </p>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-accent-600 font-medium text-[14px]">
                    5분 투어 시작
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>

          {/* Tiny print */}
          <p className="caption text-center mt-12">
            이 사이트는 일반 소개 페이지가 아닙니다. 5분 인터랙티브 체험입니다.
          </p>
        </div>
      </section>
    </main>
  );
}
