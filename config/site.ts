export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "千问 (交互与体验设计结课作业)",
  description: "阿里云千问 - 大规模语言模型，为您提供智能对话、内容创作、知识问答等 AI 服务。",
  url: "https://qwen.alibabacloud.com",
  locale: "zh_CN",
  author: "Jerry Lu",

  // SEO 配置
  keywords: [
    "千问",
    "AI",
    "人工智能",
    "大语言模型",
    "智能对话",
    "内容创作",
    "知识问答",
    "交互设计",
    "用户体验",
    "阿里云",
  ],

  // 导航菜单
  navItems: [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Tech Stack", href: "/#tech-stack" },
  ],

  // 外部链接
  links: {
    github: "https://github.com/LingChen-tsjmdlc/interaction-and-experience-design-frontend",
    docs: "https://heroui.com",
  },

  // 图标配置
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.png", sizes: "256x256", type: "image/png" },
    ],
  },

  // Open Graph 图片
  openGraph: {
    image: {
      url: "/og-image.png",
      width: 2549,
      height: 1313,
      alt: "千问 - 阿里云大规模语言模型",
    },
  },
};
