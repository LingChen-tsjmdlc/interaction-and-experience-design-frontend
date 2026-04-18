"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify/react";
import { ThemeSwitch } from "@/components/theme-switch";
import { GooeyInput } from "@/components/aceternity-ui/GooeyInput";

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("zh-CN");
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 挂载后从 localStorage 读取保存的语言，同步到 i18n 和 state
  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "zh-CN";
    setSelectedLanguage(savedLang);
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
    setMounted(true);
  }, []);

  // 语言切换时同步 i18n
  const handleLanguageChange = (keys: { currentKey?: string | null }) => {
    const lang = keys.currentKey as string;
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleDownload = () => {
    setIsDownloadModalOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-default-200/50 bg-background/80 backdrop-blur-xl">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16 w-full">
            {/* ========== 左侧：千问 Logo（长条形） ========== */}
            <div className="flex-shrink-0 flex items-center justify-start">
              <Link href="/" className="flex items-center gap-2 group">
                <Icon
                  icon="logos:qwen"
                  className="h-7 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>

            {/* ========== 中间：Gooey搜索框（桌面端显示） ========== */}
            <div className="hidden md:flex items-center justify-center min-w-0">
              <GooeyInput placeholder={t("navbar.searchPlaceholder")} className="z-20" />
            </div>

            {/* ========== 右侧：语言选择 + 下载按钮 + 主题切换 ========== */}
            <div className="flex items-center gap-2 justify-end">
              {/* 语言选择下拉框 - 使用 i18n */}
              {mounted ? (
                <Select
                  selectedKeys={[selectedLanguage]}
                  onSelectionChange={handleLanguageChange}
                  className="w-28"
                  size="sm"
                  variant="flat"
                  scrollShadowProps={{
                    isEnabled: false,
                  }}
                  listboxProps={{
                    itemClasses: {
                      base: "py-1.5",
                    },
                  }}
                >
                  <SelectItem key="zh-CN">{t("navbar.language.zh")}</SelectItem>
                  <SelectItem key="en-US">{t("navbar.language.en")}</SelectItem>
                  <SelectItem key="ja-JP">{t("navbar.language.ja")}</SelectItem>
                </Select>
              ) : (
                <div className="w-28 h-8 rounded-md bg-default-100 animate-pulse" />
              )}

              {/* 下载按钮：手机端图标模式 / 桌面端文字模式 */}
              <Button
                color="primary"
                size="sm"
                variant="flat"
                isIconOnly
                radius="full"
                className="sm:hidden"
                onPress={handleDownload}
              >
                <Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />
              </Button>
              <Button
                color="primary"
                size="sm"
                variant="flat"
                startContent={<Icon icon="heroicons:arrow-down-tray" className="w-4 h-4" />}
                onPress={handleDownload}
                className="hidden sm:flex font-medium"
              >
                {t("navbar.downloadApp")}
              </Button>

              {/* 主题切换 */}
              <div className="pl-1">
                <ThemeSwitch />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 下载 Modal */}
      <Modal isOpen={isDownloadModalOpen} onOpenChange={setIsDownloadModalOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Image
                src="/qwen-icon.png"
                alt="千问"
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span>{t("downloadModal.title")}</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="flex flex-col items-center p-4 rounded-xl bg-default-100 hover:bg-default-200 transition-colors cursor-pointer">
                <Icon icon="simple-icons:apple" className="w-12 h-12 mb-2" />
                <span className="text-sm font-medium">{t("downloadModal.ios")}</span>
                <span className="text-xs text-default-500">{t("downloadModal.iosComing")}</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-xl bg-default-100 hover:bg-default-200 transition-colors cursor-pointer">
                <Icon icon="simple-icons:android" className="w-12 h-12 mb-2 text-[#3DDC84]" />
                <span className="text-sm font-medium">{t("downloadModal.android")}</span>
                <span className="text-xs text-default-500">{t("downloadModal.androidComing")}</span>
              </div>
              <div className="col-span-2 flex flex-col items-center p-4 rounded-xl bg-default-100 hover:bg-default-200 transition-colors cursor-pointer">
                <Icon icon="bi:windows" className="w-12 h-12 mb-2 text-[#0078D4]" />
                <span className="text-sm font-medium">{t("downloadModal.web")}</span>
                <span className="text-xs text-default-500">{t("downloadModal.webDesc")}</span>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setIsDownloadModalOpen(false)}>
              {t("downloadModal.close")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
