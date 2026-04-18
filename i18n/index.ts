"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./locales/zh.json";
import en from "./locales/en.json";
import ja from "./locales/ja.json";

const resources = {
  "zh-CN": { translation: zh },
  "en-US": { translation: en },
  "ja-JP": { translation: ja },
};

// SSR 和客户端统一用默认语言初始化，避免 hydration mismatch
// 实际语言由 Navbar 在 useEffect 中从 localStorage 读取后切换
i18n.use(initReactI18next).init({
  resources,
  lng: "zh-CN",
  fallbackLng: "zh-CN",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
