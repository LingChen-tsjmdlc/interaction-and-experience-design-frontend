/**
 * 大广赛 - 阿里云（千问）互动广告
 *
 * 命题来源：全国大学生广告艺术大赛
 * 官方网址：sun-ada.net
 */

"use client";

import DefaultLayout from "@/layouts/default";
import { BackgroundLines } from "@/components/aceternity-ui/BackgroundLines";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureSection } from "@/components/home/FeatureSection";
import BlurText from "@/components/reactbits-ui/BlurText";
import { ModelShowcase } from "@/components/home/ModelShowcase";

export default function HomePage() {
  return (
    <DefaultLayout>
      {/* 首屏 Hero 区域 - 占据全屏（减去导航栏高度） */}
      <div className="relative min-h-[calc(100vh-4rem)]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <BackgroundLines className="!h-full">{null}</BackgroundLines>
        </div>
        <HeroSection />
      </div>

      {/* 功能介绍区域 */}
      <BlurText
        replay
        text="功能介绍"
        delay={90}
        animateBy="letters"
        direction="bottom"
        className="w-full items-center justify-center text-5xl font-bold text-center mt-24"
      />
      <FeatureSection />

      <BlurText
        replay
        text="更多千问家族模型"
        delay={90}
        animateBy="letters"
        direction="bottom"
        className="w-full items-center justify-center text-5xl font-bold text-center my-24"
      />
      <ModelShowcase />
    </DefaultLayout>
  );
}
