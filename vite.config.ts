import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { llmFriendlyPlugin, llmTxtPlugin } from "vite-plugin-llm-friendly";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 处理 Accept: text/markdown 内容协商，将请求映射到对应的 .md 文件
    llmFriendlyPlugin(),
    // 处理 llms.txt 标准，自动注入 <link> 发现标签
    llmTxtPlugin(),
  ],
  base: "/sexxion-blog/",
});

