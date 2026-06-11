import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://master.e-hcg.com"),
  title: {
    default: "HCG Master · HR 자문 5분 체험",
    template: "%s | HCG Master",
  },
  description:
    "HCG 컨설팅을 5분에 직접 체험해보세요. 진단 → 자문 → 산출물 → 프로세스 → 변화 → 플랜 선택. 회사 소개가 아니라, 실제 자문 흐름을 손가락으로 따라가는 인터랙티브 투어.",
  openGraph: {
    title: "HCG Master · HR 자문 5분 체험",
    description: "회사 소개 사이트가 아닙니다. 5분 인터랙티브 체험입니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://master.e-hcg.com",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased bg-bg text-primary-900">
        {/*
          Intentionally NO Header / Footer here.
          - Welcome (/) renders its own full-bleed shell.
          - Tour steps (/tour/*) get the persistent ProgressBar + TourNav from /tour/layout.tsx.
        */}
        {children}
      </body>
    </html>
  );
}
