# Chromachannel | 福祉×AIクリエイター 山本倫久 公式サイト

福祉×AIクリエイター、山本倫久 (Norihisa Yamamoto) の活動内容や制作実績を紹介する公式サイトです。
AI技術で福祉の現場に新しい「できる」と「楽しい」を届けることをミッションに、AIを活用した制作実績や、実践的なナレッジ（ブログ記事、プロンプト集など）を紹介しています。

▶ **公式サイトをプレビューする:** [https://chromachannel.online/](https://chromachannel.online/)

![Site Preview](./Img/ogp_top.webp)

## 📖 コンセプト

このサイトは、私、山本倫久の「AIという最先端のテクノロジーを駆使して、福祉の現場に新しい『できる』と『楽しい』を届ける」というミッションを体現するものです。私の持つ多様なスキルセット、具体的な作品群（ポートフォリオ）、そして実践的なノウハウ（ブログやプロンプト集など）を、訪問者が直感的に理解できるよう、構造的に設計されています。

このサイト自体が、AIを「共同制作者」として活用する、私の制作スタイルの最大のショーケースです。

## ✨ 主な機能と特徴

- **マルチページ構成:** サイトの目的別にページを分割 (`index`, `portfolio`, `learn`, `blog`, `prompt`, `novels`) し、ユーザーが必要な情報にアクセスしやすい構造。
- **ピラーページ戦略:** 専門テーマごとの「まとめページ」を設置し、サイト全体の情報構造を強化。
- **モジュール化CSS:** `style.css` (共通), `topview.css` (トップページ), `only_read.css` (記事等), `hakase-style.css` (チャット) にファイルを分割し、高いメンテナンス性と拡張性を実現。
- **レスポンシブデザイン:** PC、タブレット、スマートフォンなど、あらゆるデバイスで最適な表示を実現。
- **インタラクティブUI:** スクロールに応じたフェードインアニメーションや、モバイル用のハンバーガーメニューを実装。
- **高機能な一覧ページ:** ポートフォリオとプロンプト集には、カテゴリ別の絞り込み（フィルター）機能をJavaScriptで実装。
- **新機能: AI博士の研究室:** Gemini APIと連携した、プライバシー配慮型の対話AIチャットボットを実装。会話履歴の自動保存・復元・削除機能も搭載。
- **高度なSEO対策:** 各ページに最適化された`meta`タグ, `canonical`タグ, `OGP`タグを設定。さらに、構造化データ（JSON-LD）や`sitemap.xml`も活用し、検索エンジンからの評価を最大化。

## 💻 使用技術

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Font Awesome](https://img.shields.io/badge/Font%20Awesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white)
![Google Gemini API](https://img.shields.io/badge/Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)

- **ライブラリ:** ress.min.css

## 📂 サイト構造

```
├── index.html
├── portfolio.html
├── learn.html
├── blog.html
├── prompt.html
├── novels.html
├── privacy.html
├── sitemap.xml
├── README.md
├── learning-summary.html
├── business-summary.html
├── creative-summary.html
├── entertainment-summary.html
├── apps-summary.html
├── lifehack-summary.html
└── rabbit-summary.html
│
├── Blog/
│   ├── goal-setting-for-ai-learning.html
│   ├── ai-tool-diagnostic-chart.html
│   ├── A-magic-wand-called-AI.html
│   ├── announcing-ai-hakase.html
│   ├── How-to-Create-a-4-Step-Learning-Roadmap-with-AI.html
│   ├── How-to-Customize-Prompt.html
│   ├── How-to-Prompt.html
│   ├── making-this-site-with-ai.html
│   ├── release-chatgpt-course.html
│   ├── report-making-picture-book-with-ai.html
│   └── report-making-travel-plan-with-ai.html
│
├── Learn/
│   └── learn_lesson1.html
│
├── Novels/
│   ├── hoshizora-no-melody.html
│   ├── isekai-no-ou.html
│   ├── kieta-mura.html
│   ├── seishun-no-1page.html
│   ├── unmei-no-akaiito.html
│   ├── unmei-no-ito.html
│   └── yoru-no-koe.html
│
├── Portfolio/
│   ├── Adaptive_System/adaptive_system.html
│   ├── Ai-Slide-App/ai-slide-app.html
│   ├── Components/components.html
│   ├── Demo/demo.html
│   ├── Fuwamoco/
│   │   ├── fuwamoco.html
│   │   ├── 3-match-puzzle.html
│   │   ├── cafe.html
│   │   ├── company-info.html
│   │   ├── company.html
│   │   ├── contact.html
│   │   ├── privacy-policy.html
│   │   ├── questionnaire.html
│   │   └── rabbit.html
│   ├── Game/pict.html
│   ├── Household_Account_Book/household-account-book.html
│   ├── Real-time-preview/real-time-preview.html
│   ├── Task-Tool/task-tool.html
│   ├── Timer/timer.html
│   └── chirashi/chirashi.html
│
├── Prompt/
│   ├── hakase.html
│   ├── prompt-personality-test.html
│   ├── prompt-business-email.html
│   ├── prompt-consultant.html
│   ├── prompt-decline-coach.html
│   ├── prompt-hakase.html
│   ├── prompt-imagefx.html
│   ├── prompt-kondate.html
│   ├── prompt-novel-writing.html
│   ├── prompt-picture-book-writing.html
│   ├── prompt-reminder-coach.html
│   ├── prompt-roadmap-lv1.html
│   ├── prompt-roadmap-lv2.html
│   ├── prompt-roadmap-lv3.html
│   ├── prompt-science-teacher.html
│   ├── prompt-stable-diffusion.html
│   ├── prompt-suno-ai.html
│   ├── prompt-suno-ai-v2.html
│   ├── prompt-travel-planner.html
│   ├── prompt-vegetable-hero.html
│   └── prompt-youtube-shorts.html
│
├── CSS/
├── JavaScript/
├── Img/
└── Audio/
```

## 👤 制作者

- **氏名:** 山本 倫久 (Norihisa Yamamoto)
- **役職:** 福祉 × AIクリエイター
- **住所:** 大阪府大阪市
- **連絡先:** from.aito.the.infinity@gmail.com

---
© 2025 chromachannel. All rights reserved.