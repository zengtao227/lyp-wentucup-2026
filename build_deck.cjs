/**
 * 彬彬有礼 · 酒店 AI 全链路客服系统开发迭代实录
 * Design lock: swiss-klein-blue  Palette: Arctic Study (北极研究蓝)
 * Output: outputs/彬彬有礼-开发迭代介绍.pptx
 */

const PptxGenJS = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

// ─── Design tokens · Swiss Klein Blue × Arctic Study ─────────────────────────
const C = {
  bg:       "F0F4F8",  // Arctic Study: cool blue-gray bg
  ink:      "0A2540",  // Arctic Study: dark navy text
  accent:   "1A4480",  // Arctic Study: deep blue accent
  accentLt: "5A8FCC",  // lighter blue for dark bg text
  muted:    "52748C",  // Arctic Study: slate-blue muted
  tint:     "C8D8F0",  // light blue card tint
  block:    "0A2540",  // dark navy block bg
  white:    "FFFFFF",
  row1:     "DDE8F5",  // light blue table stripe
  dark2:    "0D2F52",  // slightly lighter navy
};

// Swiss lock: NO rounded corners anywhere — borderRadius strictly 0
const R = 0;

const F = {
  zh:   "Noto Sans SC",
  en:   "IBM Plex Sans",
  mono: "IBM Plex Mono",
};

const W = 10;
const H = 5.625;

// ─── Init ─────────────────────────────────────────────────────────────────────
const prs = new PptxGenJS();
prs.layout = "LAYOUT_16x9";
prs.title  = "彬彬有礼 · 酒店 AI 开发迭代实录";
prs.author = "WentuCup 2026";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function accentBar(sld) {
  sld.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.055,
    fill: { color: C.accent }, line: { type: "none" },
  });
}

function slideTitle(sld, title, opts = {}) {
  const { kicker, x = 0.46, y = 0.14, w = 9.1, color = C.ink } = opts;
  if (kicker) {
    sld.addText(kicker.toUpperCase(), {
      x, y, w, h: 0.22,
      fontSize: 8.5, bold: false, color: C.muted, fontFace: F.en, charSpacing: 1.2,
    });
  }
  sld.addText(title, {
    x, y: kicker ? y + 0.22 : y, w, h: 0.52,
    fontSize: 21, bold: true, color,
    fontFace: F.zh,
  });
}

function filledBox(sld, x, y, w, h, fillColor) {
  sld.addShape(prs.ShapeType.rect, {
    x, y, w, h,
    fill: { color: fillColor },
    line: { type: "none" },
  });
}

function slideNum(sld, n) {
  sld.addText(`№${n} / 11`, {
    x: W - 1.1, y: H - 0.28, w: 0.9, h: 0.22,
    fontSize: 8, color: C.muted, fontFace: F.en,
    align: "right", charSpacing: 0.5,
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 1 — Cover
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.block };

  // left accent stripe
  sld.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: 0.11, h: H,
    fill: { color: C.accent }, line: { type: "none" },
  });

  sld.addText("彬彬有礼", {
    x: 0.34, y: 0.62, w: 7.5, h: 1.1,
    fontSize: 56, bold: true, color: C.white, fontFace: F.zh,
  });
  sld.addText("酒店 AI 全链路客服系统  ·  开发迭代实录", {
    x: 0.34, y: 1.76, w: 8.5, h: 0.44,
    fontSize: 18, color: C.tint, fontFace: F.zh,
  });

  sld.addShape(prs.ShapeType.line, {
    x: 0.34, y: 2.32, w: 8.2, h: 0,
    line: { color: C.accentLt, width: 1 },
  });

  const badges = [
    { n: "74", label: "次 Git 提交" },
    { n: "3",  label: "个开发阶段" },
    { n: "14", label: "个 MCP 工具" },
    { n: "5",  label: "个知识库"    },
  ];
  badges.forEach((b, i) => {
    const bx = 0.34 + i * 2.44;
    sld.addText(b.n, {
      x: bx, y: 2.48, w: 1.8, h: 0.7,
      fontSize: 40, bold: true, color: C.accentLt, fontFace: F.en,
    });
    sld.addText(b.label, {
      x: bx, y: 3.16, w: 2.2, h: 0.28,
      fontSize: 11.5, color: C.tint, fontFace: F.zh,
    });
  });

  sld.addText("第五届“问途杯”高校酒店及旅游人工智能创新大赛  ·  决赛作品  ·  新会碧桂园凤凰酒店", {
    x: 0.34, y: H - 0.46, w: 9.3, h: 0.32,
    fontSize: 9.5, color: C.muted, fontFace: F.zh,
  });

  sld.addNotes("大家好。今天分享的是我们参加第五届问途杯竞赛过程中，从零到交付一套酒店 AI 全链路客服系统的工程迭代实录。这套系统叫「彬彬有礼」，部署在 Dify 平台上，服务场景是新会碧桂园凤凰酒店。我想重点分享的不是最终结果，而是整个开发过程中我们做了哪些关键决策，踩了哪些坑，以及每次迭代背后的技术逻辑。");
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 2 — 业务背景与系统目标
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.bg };
  accentBar(sld);
  slideTitle(sld, "酒店数字客服的三大结构性痛点驱动了这套系统的设计目标", { kicker: "业务背景 · Business Context" });

  const pains = [
    { title: "❶  响应断层",     body: "夜间人工缺位，高峰延迟，用户热度快速流失" },
    { title: "❷  口径不一致",   body: "信息散落各岗位，AI 回答须先统一事实来源" },
    { title: "❸  重复咨询低效", body: "80% 问题可由知识库直接回答，人工精力错配" },
  ];

  const goals = [
    { title: "一个入口",   body: "咨询→查房态→预订→小程序支付引导，全链路贯通" },
    { title: "一个知识源", body: "5 域结构化知识库 + Reranker，统一事实保质量" },
    { title: "一套 Agent", body: "MCP 工具链完成房态查询 + 预订提交，7×24 自主" },
  ];

  pains.forEach((p, i) => {
    const py = 1.04 + i * 1.3;
    filledBox(sld, 0.34, py, 4.24, 1.12, C.row1, 0.1);
    sld.addText(p.title, {
      x: 0.52, y: py + 0.1, w: 3.9, h: 0.32,
      fontSize: 12.5, bold: true, color: C.accent, fontFace: F.zh,
    });
    sld.addText(p.body, {
      x: 0.52, y: py + 0.44, w: 3.9, h: 0.56,
      fontSize: 11, color: C.ink, fontFace: F.zh, wrap: true,
    });
  });

  // arrow
  sld.addShape(prs.ShapeType.rightArrow, {
    x: 4.72, y: 2.28, w: 0.56, h: 0.56,
    fill: { color: C.accent }, line: { type: "none" },
  });

  goals.forEach((g, i) => {
    const gy = 1.04 + i * 1.3;
    filledBox(sld, 5.4, gy, 4.24, 1.12, C.accent, 0.1);
    sld.addText(g.title, {
      x: 5.58, y: gy + 0.1, w: 3.9, h: 0.32,
      fontSize: 12.5, bold: true, color: C.white, fontFace: F.zh,
    });
    sld.addText(g.body, {
      x: 5.58, y: gy + 0.44, w: 3.9, h: 0.56,
      fontSize: 11, color: C.tint, fontFace: F.zh, wrap: true,
    });
  });

  slideNum(sld, 2);
  sld.addNotes("我们先看这套系统要解决什么问题。酒店客服有三个结构性痛点：第一，全天候响应，夜间没有人工，用户热度快速流失；第二，口径一致性，酒店信息分散在不同人员那里，AI 回答要先解决事实统一；第三，重复咨询效率，前台精力被大量简单问题占用。因此我们的设计目标是一个入口打通完整服务链路，让用户不需要切换渠道就能完成从咨询到预订的全过程。");
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 3 — 最终系统架构
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.bg };
  accentBar(sld);
  slideTitle(sld, "最终架构由四层组成：意图路由 → 知识/工具 → 生成 → 支付引导", { kicker: "系统架构 · System Architecture" });

  const layers = [
    { label: "意图识别层", detail: "问题分类器（6类）+ ReAct Agent 自主路由", fill: C.accent,  tc: C.white, dtc: C.tint  },
    { label: "知识 / 工具层", detail: "5域 RAG + gte-rerank-v2  ·  14个 MCP 工具（hotel×5 · travel×4 · time×4 · weather×1）", fill: "3730A3", tc: C.white, dtc: C.tint  },
    { label: "响应生成层", detail: "DeepSeek-V3  temperature=0.1  ·  防幻觉规则  ·  max_iteration=5", fill: C.tint,   tc: C.ink,  dtc: C.muted },
    { label: "支付引导层", detail: "小途乐订（客房预订）· 小途乐游（景区票务）· Bot 引导，不声称支付成功", fill: C.row1,  tc: C.ink,  dtc: C.muted },
  ];

  layers.forEach((l, i) => {
    const ly = 1.06 + i * 0.98;
    filledBox(sld, 0.34, ly, 9.32, 0.82, l.fill, 0.08);
    sld.addText(l.label, {
      x: 0.56, y: ly + 0.18, w: 2.2, h: 0.44,
      fontSize: 12.5, bold: true, color: l.tc, fontFace: F.zh, valign: "middle",
    });
    sld.addShape(prs.ShapeType.line, {
      x: 2.94, y: ly + 0.16, w: 0, h: 0.5,
      line: { color: l.tc === C.white ? "AABBDD" : C.muted, width: 0.75, dashType: "dash" },
    });
    sld.addText(l.detail, {
      x: 3.1, y: ly + 0.14, w: 6.4, h: 0.54,
      fontSize: 11, color: l.dtc, fontFace: F.zh, valign: "middle", wrap: true,
    });
    if (i < layers.length - 1) {
      sld.addShape(prs.ShapeType.downArrow, {
        x: 4.72, y: ly + 0.82, w: 0.4, h: 0.16,
        fill: { color: C.accentLt }, line: { type: "none" },
      });
    }
  });

  sld.addText("平台：Dify 1.9 (问途AI Playground)  ·  模型：DeepSeek-V3  ·  工具协议：MCP SSE  ·  检索：gte-rerank-v2", {
    x: 0.34, y: H - 0.3, w: 9.32, h: 0.22,
    fontSize: 9, color: C.muted, fontFace: F.en, align: "center",
  });

  slideNum(sld, 3);
  sld.addNotes("这是最终系统的四层架构。最上层是意图路由，支持 Chatflow 6路分类和 Agent 自主判断两种模式。第二层是知识检索加工具执行，5个域的知识库加 Reranker 重排序，以及14个 MCP 工具覆盖预订、票务、时间、天气。第三层是响应生成，DeepSeek-V3 温度设 0.1 确保稳定，防幻觉规则约束输出。最底层是支付引导，通过小程序完成实际支付，AI 只负责引导，不声称支付成功。");
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 4 — Chatflow vs. Agent
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.bg };
  accentBar(sld);
  slideTitle(sld, "Chatflow 和 Agent 不是竞争关系，而是稳定性与智能化的互补双轨", { kicker: "核心决策 · Architecture Decision" });

  // header row
  const hdrs = [
    { x: 0.34, w: 1.9,  label: "维度",            fill: C.block  },
    { x: 2.34, w: 3.66, label: "Chatflow（导演制）", fill: C.accent },
    { x: 6.1,  w: 3.66, label: "Agent（主管制）",    fill: "3730A3" },
  ];
  hdrs.forEach((h) => {
    filledBox(sld, h.x, 1.06, h.w, 0.4, h.fill, 0.0);
    sld.addText(h.label, {
      x: h.x + 0.08, y: 1.08, w: h.w - 0.16, h: 0.36,
      fontSize: 12, bold: true, color: C.white, fontFace: F.zh, align: "center", valign: "middle",
    });
  });

  const rows = [
    ["控制模式",   "显式节点连线，硬路由",      "ReAct 自主推理，软约束 Prompt"],
    ["对话自然度", "一般，程式化跳转",          "高，可随时被打断和追问"],
    ["工具调用",   "固定节点顺序，预设所有分支", "模型自主决定调用时机与顺序"],
    ["异常处理",   "需预设所有异常分支",         "模型自主降级，优雅兜底"],
    ["适合场景",   "演示稳定性要求极高",         "追求「智能化」表现首选"],
  ];

  rows.forEach((r, i) => {
    const ry = 1.46 + i * 0.52;
    const bg = i % 2 === 0 ? C.row1 : C.bg;
    filledBox(sld, 0.34, ry, 9.42, 0.46, bg, 0);
    sld.addText(r[0], {
      x: 0.44, y: ry + 0.05, w: 1.72, h: 0.36,
      fontSize: 11, bold: true, color: C.ink, fontFace: F.zh, valign: "middle",
    });
    sld.addText(r[1], {
      x: 2.44, y: ry + 0.05, w: 3.52, h: 0.36,
      fontSize: 11, color: C.muted, fontFace: F.zh, valign: "middle",
    });
    sld.addText(r[2], {
      x: 6.2, y: ry + 0.05, w: 3.44, h: 0.36,
      fontSize: 11, color: C.ink, fontFace: F.zh, valign: "middle",
    });
  });

  filledBox(sld, 0.34, H - 0.58, 9.42, 0.42, C.accent, 0.08);
  sld.addText("最终决策：双轨并行 — Chatflow 稳控高频问答  ·  Agent 处理预订工具链", {
    x: 0.54, y: H - 0.56, w: 9.0, h: 0.38,
    fontSize: 12, bold: true, color: C.white, fontFace: F.zh, align: "center", valign: "middle",
  });

  slideNum(sld, 4);
  sld.addNotes("这是整个项目最关键的技术决策。Chatflow 和 Agent 在 Dify 里是两种完全不同的范式。Chatflow 像导演制，你事先写好每一步的剧本，逻辑清晰但死板；Agent 像主管制，你给它工具箱和 SOP，让模型自己判断先做什么。我们最终选择双轨并行：知识问答走 Chatflow，确保稳定；预订任务走 Agent，确保智能。这个决策贯穿了整个项目的架构演进。");
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 5 — 第一阶段：Chatflow v1.0→v1.12
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.bg };
  accentBar(sld);
  slideTitle(sld, "第一阶段用 13 个版本完成工具链构建，分类器从 6 路扩展到 13 路", { kicker: "阶段一 · 2026-05-08 → 05-11" });

  const railY = 2.08;
  sld.addShape(prs.ShapeType.line, {
    x: 0.6, y: railY, w: 8.9, h: 0,
    line: { color: C.accentLt, width: 2 },
  });

  const nodes = [
    { cx: 0.96, ver: "v1.0",  date: "05-08", color: C.accent,
      title: "两工具预订链路",
      items: ["GET rooms.json 查房态", "POST 提交预订申请", "6类问题分类器"] },
    { cx: 3.44, ver: "v1.7",  date: "05-09", color: C.accent,
      title: "四工具双业务",
      items: ["景区票务分支上线", "支付边界拆分：", "小途乐订 vs 小途乐游"] },
    { cx: 5.92, ver: "v1.9",  date: "05-09", color: "3730A3",
      title: "私有化迁移",
      items: ["主仓库转 Private", "Mock 迁移 public repo", "Amap Key 内嵌（临时）"] },
    { cx: 8.4,  ver: "v1.12", date: "05-11", color: C.block,
      title: "13 分类器完整版",
      items: ["新增支付确认分支", "新增取消退款分支", "接入酒店/景区知识库"] },
  ];

  nodes.forEach((n) => {
    sld.addShape(prs.ShapeType.ellipse, {
      x: n.cx - 0.14, y: railY - 0.14, w: 0.28, h: 0.28,
      fill: { color: n.color }, line: { type: "none" },
    });
    filledBox(sld, n.cx - 0.44, railY - 0.72, 0.88, 0.3, n.color, 0.06);
    sld.addText(n.ver, {
      x: n.cx - 0.44, y: railY - 0.72, w: 0.88, h: 0.3,
      fontSize: 10.5, bold: true, color: C.white, fontFace: F.en, align: "center", valign: "middle",
    });
    sld.addText(n.date, {
      x: n.cx - 0.5, y: railY - 0.38, w: 1.0, h: 0.2,
      fontSize: 9, color: C.muted, fontFace: F.en, align: "center",
    });
    filledBox(sld, n.cx - 1.1, railY + 0.26, 2.2, 1.7, C.row1, 0.08);
    sld.addText(n.title, {
      x: n.cx - 1.0, y: railY + 0.34, w: 2.0, h: 0.3,
      fontSize: 11, bold: true, color: n.color, fontFace: F.zh, align: "center",
    });
    n.items.forEach((item, ii) => {
      sld.addText("· " + item, {
        x: n.cx - 0.98, y: railY + 0.68 + ii * 0.38, w: 1.96, h: 0.34,
        fontSize: 10, color: C.ink, fontFace: F.zh,
      });
    });
  });

  slideNum(sld, 5);
  sld.addNotes("第一阶段从5月8号开始，4天13个版本。起点是 v1.0，实现了最基础的两工具预订链路：一个 GET 查房态，一个 POST 提交预订。v1.7 新增景区票务分支，同时拆分两个支付小程序的职责边界。v1.9 把主仓库转为私有，mock 数据迁移到公开 repo。v1.12 是第一阶段的终态，分类器从 6 路扩展到 13 路，同时接入了知识库。");
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 6 — 工程挑战攻坚
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.bg };
  accentBar(sld);
  slideTitle(sld, "四类工程挑战均在平台文档之外，只能靠运行时日志定位并逐版修复", { kicker: "工程挑战 · Engineering Challenges" });

  const cards = [
    { x: 0.26, y: 1.05,
      tag: "Dify UUID 兼容性",
      s: "症状：chat 预览无返回，PostgreSQL 报错",
      r: "根因：对话变量 id 必须是合法 UUID",
      f: "v1.1：全量替换为合规 UUID 格式" },
    { x: 5.14, y: 1.05,
      tag: "LLM Schema 强制字段",
      s: "症状：v1.1 导入后部分节点无输出",
      r: "根因：Dify 1.9 每个 LLM 节点必须含 context 字段",
      f: "v1.2：纯 LLM 节点补 context: {enabled: false}" },
    { x: 0.26, y: 3.14,
      tag: "预订确认幻觉",
      s: "症状：LLM 声称已发送确认短信、已生成电子凭证",
      r: "根因：Prompt 未约束禁止声明系统尚未实现的行为",
      f: "v1.11：显式枚举禁止声明操作列表" },
    { x: 5.14, y: 3.14,
      tag: "支付边界混淆",
      s: "症状：景区票务确认错误指向「小途乐订」",
      r: "根因：两个小程序职责在 Prompt 中未明确区分",
      f: "v1.8：各 LLM 硬编码对应小程序名称" },
  ];

  cards.forEach((c) => {
    filledBox(sld, c.x, c.y, 4.72, 1.88, C.row1, 0.1);
    filledBox(sld, c.x + 0.1, c.y + 0.1, 4.52, 0.34, C.accent, 0.06);
    sld.addText(c.tag, {
      x: c.x + 0.1, y: c.y + 0.1, w: 4.52, h: 0.34,
      fontSize: 11.5, bold: true, color: C.white, fontFace: F.zh, align: "center", valign: "middle",
    });
    sld.addText(c.s, {
      x: c.x + 0.18, y: c.y + 0.5, w: 4.36, h: 0.34,
      fontSize: 10.5, color: C.muted, fontFace: F.zh, wrap: true,
    });
    sld.addText(c.r, {
      x: c.x + 0.18, y: c.y + 0.86, w: 4.36, h: 0.42,
      fontSize: 10.5, color: C.ink, fontFace: F.zh, wrap: true,
    });
    sld.addText("✓  " + c.f, {
      x: c.x + 0.18, y: c.y + 1.38, w: 4.36, h: 0.34,
      fontSize: 10.5, bold: true, color: C.accent, fontFace: F.zh, wrap: true,
    });
  });

  slideNum(sld, 6);
  sld.addNotes("这一页讲的是第一阶段踩的四类坑，每一类都没有文档，只能从运行时日志里自己排查。第一个是 UUID 兼容性，Dify 对话变量 id 字段底层是 PostgreSQL UUID 类型，传字符串会直接报错，但报错信息非常隐晦。第二个是 LLM Schema，Dify 1.9 对 context 字段有强制要求，即使不用也要显式声明为 disabled。第三个是预订确认幻觉，解法是在 Prompt 里显式枚举禁止的输出。第四个是支付边界，两个小程序职责不同，Prompt 里必须明确区分。");
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 7 — 关键转折：放弃 Mock，MCP 优先
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.bg };
  accentBar(sld);
  slideTitle(sld, "GitHub jsDelivr 在竞赛网络有致命风险，必须切换至官方 MCP SSE 端点", { kicker: "关键决策 · 2026-05-11  commit 3d3f23b" });

  // before box
  filledBox(sld, 0.26, 1.05, 4.44, 4.1, C.row1, 0.1);
  sld.addText("之前 — HTTP Mock 方案", {
    x: 0.42, y: 1.12, w: 4.1, h: 0.32,
    fontSize: 12.5, bold: true, color: C.muted, fontFace: F.zh,
  });
  const befLines = [
    "Dify → cdn.jsdelivr.net",
    "  → rooms.json（静态 JSON）",
    "Dify → jsonplaceholder.typicode.com",
    "  → mock POST（公共测试 API）",
  ];
  befLines.forEach((b, i) => {
    sld.addText(b, {
      x: 0.46, y: 1.5 + i * 0.3, w: 4.1, h: 0.28,
      fontSize: 10.5, color: C.ink, fontFace: F.en,
    });
  });
  const risks = [
    "大陆网络可能 DNS 污染 / 封锁 jsDelivr",
    "「实时房态查询」评分要求真实 API 调用",
    "jsonplaceholder 不体现真实集成能力",
  ];
  sld.addText("⚠  风险", {
    x: 0.42, y: 2.8, w: 4.1, h: 0.3,
    fontSize: 11.5, bold: true, color: "DC2626", fontFace: F.zh,
  });
  risks.forEach((r, i) => {
    sld.addText("· " + r, {
      x: 0.46, y: 3.14 + i * 0.38, w: 4.06, h: 0.32,
      fontSize: 10.5, color: C.ink, fontFace: F.zh, wrap: true,
    });
  });

  sld.addShape(prs.ShapeType.rightArrow, {
    x: 4.82, y: 2.58, w: 0.56, h: 0.52,
    fill: { color: C.accent }, line: { type: "none" },
  });

  // after box
  filledBox(sld, 5.5, 1.05, 4.24, 4.1, C.accent, 0.1);
  sld.addText("之后 — 官方 MCP SSE 方案", {
    x: 5.66, y: 1.12, w: 3.9, h: 0.32,
    fontSize: 12.5, bold: true, color: C.white, fontFace: F.zh,
  });
  const mcpLines = [
    "mcp-server-booking.v4.test.dossm.cn",
    "  → 酒店预订 / 房态 / 取消",
    "mcp-server-travel.v4.test.dossm.cn",
    "  → 景区票务 / 购票提交",
  ];
  mcpLines.forEach((m, i) => {
    sld.addText(m, {
      x: 5.7, y: 1.5 + i * 0.3, w: 3.9, h: 0.28,
      fontSize: 10.5, color: C.tint, fontFace: F.en,
    });
  });
  const gains = [
    "同一平台内网，网络完全可控",
    "满足评分「实时工具调用」要求",
    "工具名语义清晰：getAvailableRoomsByDate",
  ];
  sld.addText("✓  优势", {
    x: 5.66, y: 2.8, w: 3.9, h: 0.3,
    fontSize: 11.5, bold: true, color: C.tint, fontFace: F.zh,
  });
  gains.forEach((g, i) => {
    sld.addText("· " + g, {
      x: 5.7, y: 3.14 + i * 0.38, w: 3.86, h: 0.32,
      fontSize: 10.5, color: C.white, fontFace: F.zh, wrap: true,
    });
  });

  slideNum(sld, 7);
  sld.addNotes("这是项目里最重要的架构决策之一。我们在 5 月 11 号意识到，用 GitHub CDN 和 jsonplaceholder 做工具端点，在竞赛现场有致命风险——大陆网络对 GitHub CDN 可能有 DNS 干扰，而且 jsonplaceholder 只是公共测试 API，根本体现不出真实的工具集成能力。评分标准里明确要求「实时房态查询」，静态 JSON 文件在评委眼里就是假的。所以我们做了清晰的决定：保留 mock 版本作为离线备份，所有生产路径切换至官方 MCP SSE 端点。");
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 8 — 第二阶段：Agent 自主推理（v2.0→v2.8）
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.bg };
  accentBar(sld);
  slideTitle(sld, "v2.0 引入 ReAct 策略和 14 工具 MCP 集成，Agent 可自主处理完整预订链路", { kicker: "阶段二 · Agent 模式  2026-05-12 → 05-15" });

  // left panel
  filledBox(sld, 0.26, 1.05, 4.72, 3.04, C.row1, 0.1);
  sld.addText("v2.0 核心架构", {
    x: 0.44, y: 1.12, w: 4.32, h: 0.3,
    fontSize: 12.5, bold: true, color: C.accent, fontFace: F.zh,
  });
  const arch = [
    ["策略",    "ReAct（Reasoning + Acting）"],
    ["模型",    "DeepSeek-V3  temperature=0.1"],
    ["迭代上限", "max_iteration = 5（防死循环）"],
    ["teamId",  "234556（平台业务路由标识）"],
  ];
  arch.forEach((a, i) => {
    const ay = 1.46 + i * 0.44;
    sld.addText(a[0], { x: 0.46, y: ay, w: 1.2, h: 0.36, fontSize: 10.5, bold: true, color: C.muted, fontFace: F.en });
    sld.addText(a[1], { x: 1.7,  y: ay, w: 3.1, h: 0.36, fontSize: 10.5, color: C.ink, fontFace: F.en });
  });
  sld.addText("工具集（共 14 个）", {
    x: 0.44, y: 3.26, w: 4.36, h: 0.28,
    fontSize: 11, bold: true, color: C.ink, fontFace: F.zh,
  });
  const tools = [
    ["酒店预订 ×5", "getAvailableRoomsByDate · submitBooking …"],
    ["景区票务 ×4", "getTravelMerchandiseViews · submitPurchase …"],
    ["时间工具 ×4", "current_time · localtime_to_timestamp …"],
    ["天气查询 ×1", "weather（OpenWeather plugin）"],
  ];
  tools.forEach((t, i) => {
    sld.addText("▸ " + t[0], { x: 0.46, y: 3.58 + i * 0.36, w: 1.64, h: 0.3, fontSize: 10, bold: true, color: C.accent, fontFace: F.zh });
    sld.addText(t[1],         { x: 2.14, y: 3.58 + i * 0.36, w: 2.7,  h: 0.3, fontSize: 9.5, color: C.muted, fontFace: F.en });
  });

  // right panel: iteration table
  filledBox(sld, 5.12, 1.05, 4.62, 4.14, C.block, 0.1);
  sld.addText("v2.x 迭代优化", {
    x: 5.28, y: 1.12, w: 4.24, h: 0.3,
    fontSize: 12.5, bold: true, color: C.tint, fontFace: F.zh,
  });
  const iters = [
    { v: "v2.1", d: "13种房型代码映射（001-013）+ 智能引导不存在房型" },
    { v: "v2.2", d: "修复工具调用输出变量 reasoning_content → text" },
    { v: "v2.5", d: "禁止思维链泄露 · 修复日期格式 · 间数收集逻辑" },
    { v: "v2.6", d: "支付二维码嵌入对话，减少用户操作步骤" },
    { v: "v2.7", d: "三路意图分类架构 + 独立天气分支" },
    { v: "v2.8", d: "agent-node 调用 MCP（发现 Chatflow 导入兼容性问题）" },
  ];
  iters.forEach((it, i) => {
    const iy = 1.52 + i * 0.58;
    filledBox(sld, 5.22, iy, 4.4, 0.5, i % 2 === 0 ? "253061" : C.block, 0);
    sld.addText(it.v, {
      x: 5.3, y: iy + 0.06, w: 0.74, h: 0.38,
      fontSize: 11.5, bold: true, color: C.accentLt, fontFace: F.en, valign: "middle",
    });
    sld.addText(it.d, {
      x: 6.08, y: iy + 0.05, w: 3.42, h: 0.42,
      fontSize: 10, color: C.tint, fontFace: F.zh, valign: "middle", wrap: true,
    });
  });

  slideNum(sld, 8);
  sld.addNotes("从5月12号开始，我们启动了第二阶段，核心是从 Chatflow 切换到 Agent 模式。v2.0 是质的飞跃：引入 ReAct 策略，模型可以自主决定调用哪个工具、什么时候调用。工具数量从之前的 4 个增加到 14 个。v2.1 解决了用户说「我要标准间」时 Agent 能优雅引导的问题。v2.5 解决了思维链泄露，之前模型会把推理过程打印出来，用户体验很差。v2.8 时发现 agent-node 在 Chatflow 模式下有导入兼容性问题，倒逼了第三阶段的架构调整。");
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 9 — 第三阶段：决赛双轨制（v3.0→v3.5）
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.bg };
  accentBar(sld);
  slideTitle(sld, "决赛版采用双轨并行：Chatflow 稳控问答，Agent 驱动预订，官方 MCP 正式接入", { kicker: "阶段三 · 决赛双轨  2026-05-15 → 05-17" });

  const tracks = [
    { x: 0.26, fill: C.accent, tc: C.white, tint: C.tint,
      label: "Chatflow  v3.x", role: "稳定控场",
      items: ["6路知识问答（概况/客房/餐饮/会议/投诉）", "第7路：预订 Agent 独立分支", "移除 agent-node → http-request+llm（导入稳定）"] },
    { x: 5.2, fill: C.block, tc: C.white, tint: C.accentLt,
      label: "Agent  v3.x", role: "智能推理",
      items: ["ReAct 14工具全量配置", "teamId=234556 + 13种房型代码对照表", "与 Chatflow 开场语/知识库完全一致"] },
  ];

  tracks.forEach((t) => {
    filledBox(sld, t.x, 1.05, 4.56, 2.48, t.fill, 0.1);
    sld.addText(t.label, {
      x: t.x + 0.18, y: 1.12, w: 4.2, h: 0.34,
      fontSize: 14, bold: true, color: t.tint, fontFace: F.en,
    });
    sld.addText(t.role, {
      x: t.x + 0.18, y: 1.44, w: 4.2, h: 0.24,
      fontSize: 11, color: t.tint, fontFace: F.zh,
    });
    sld.addShape(prs.ShapeType.line, {
      x: t.x + 0.18, y: 1.72, w: 4.14, h: 0,
      line: { color: t.tint, width: 0.5, dashType: "dash" },
    });
    t.items.forEach((item, i) => {
      sld.addText("· " + item, {
        x: t.x + 0.2, y: 1.8 + i * 0.48, w: 4.12, h: 0.42,
        fontSize: 10.5, color: t.tint, fontFace: F.zh, wrap: true,
      });
    });
  });

  // milestone table
  filledBox(sld, 0.26, 3.68, 9.48, 1.66, C.row1, 0.08);
  sld.addText("v3.x 关键里程碑", {
    x: 0.42, y: 3.74, w: 9, h: 0.3,
    fontSize: 11, bold: true, color: C.ink, fontFace: F.zh,
  });
  const ms = [
    { v: "v3.0", date: "05-15", desc: "决赛版；移除 agent-node 确保 Chatflow 稳定导入" },
    { v: "v3.1", date: "05-15", desc: "OpenWeather 替换 Amap HTTP，降低密钥泄露风险" },
    { v: "v3.2", date: "05-15", desc: "订房分支正式接入官方 MCP getAvailableRoomsByDate" },
    { v: "v3.5", date: "05-17", desc: "知识库绑定、支付引导、确认路由全面收紧——决赛定稿" },
  ];
  ms.forEach((m, i) => {
    const mx = 0.32 + i * 2.42;
    filledBox(sld, mx, 4.08, 0.52, 0.26, C.accent, 0.04);
    sld.addText(m.v, {
      x: mx, y: 4.08, w: 0.52, h: 0.26,
      fontSize: 9.5, bold: true, color: C.white, fontFace: F.en, align: "center", valign: "middle",
    });
    sld.addText(m.date, {
      x: mx + 0.56, y: 4.08, w: 0.68, h: 0.26,
      fontSize: 9.5, color: C.muted, fontFace: F.en,
    });
    sld.addText(m.desc, {
      x: mx, y: 4.38, w: 2.3, h: 0.88,
      fontSize: 9.5, color: C.ink, fontFace: F.zh, wrap: true,
    });
  });

  slideNum(sld, 9);
  sld.addNotes("第三阶段是5月15号到17号，最后冲刺。清晰的双轨策略：Chatflow 版负责稳定知识问答，Agent 版负责智能预订交互，两个版本并行维护。最关键的里程碑是 v3.2，正式接入官方 MCP 端点，用 getAvailableRoomsByDate 替换了 mock HTTP GET。v3.1 把高德地图 HTTP 节点换成 OpenWeather 插件，降低 API Key 泄露风险。v3.5 是最终定稿。");
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 10 — 迭代全景
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.bg };
  accentBar(sld);
  slideTitle(sld, "从 Initial Archive 到决赛定稿，74 次提交横跨三个工程阶段共 12 天", { kicker: "迭代全景 · 2026-05-08 → 05-19" });

  // phase bars
  const phases = [
    { x: 0.34, w: 3.14, fill: C.accent,  label: "阶段一  Chatflow 工具链",  sub: "05-08 → 05-11  ·  ~35 commits" },
    { x: 3.58, w: 2.82, fill: "3730A3",  label: "阶段二  Agent 模式",         sub: "05-12 → 05-14  ·  ~20 commits" },
    { x: 6.5,  w: 3.16, fill: C.block,   label: "阶段三  决赛双轨",           sub: "05-15 → 05-19  ·  ~19 commits" },
  ];
  phases.forEach((p) => {
    filledBox(sld, p.x, 1.06, p.w, 0.74, p.fill, 0.08);
    sld.addText(p.label, {
      x: p.x + 0.1, y: 1.1, w: p.w - 0.2, h: 0.34,
      fontSize: 11, bold: true, color: C.white, fontFace: F.zh, align: "center",
    });
    sld.addText(p.sub, {
      x: p.x + 0.1, y: 1.42, w: p.w - 0.2, h: 0.26,
      fontSize: 9, color: C.tint, fontFace: F.en, align: "center",
    });
  });

  // rail
  const railY = 2.22;
  sld.addShape(prs.ShapeType.line, {
    x: 0.34, y: railY, w: 9.32, h: 0,
    line: { color: C.accentLt, width: 1.5 },
  });

  const stars = [
    { cx: 0.7,  label: "v1.0\n两工具链路" },
    { cx: 2.4,  label: "v1.12\n13分类器" },
    { cx: 3.96, label: "MCP优先\n放弃 mock" },
    { cx: 5.54, label: "v2.0\nReAct Agent" },
    { cx: 8.08, label: "v3.2\n官方MCP接入" },
  ];
  stars.forEach((s) => {
    sld.addShape(prs.ShapeType.ellipse, {
      x: s.cx - 0.13, y: railY - 0.13, w: 0.26, h: 0.26,
      fill: { color: C.accent }, line: { color: C.white, width: 1.5 },
    });
    sld.addText(s.label, {
      x: s.cx - 0.72, y: railY + 0.18, w: 1.44, h: 0.54,
      fontSize: 9.5, color: C.ink, fontFace: F.zh, align: "center",
    });
  });

  // stats
  const stats = [
    { n: "21", label: "feat",     color: C.accent },
    { n: "32", label: "fix",      color: "3730A3" },
    { n: "12", label: "docs",     color: C.muted  },
    { n: "9",  label: "refactor", color: C.block  },
  ];
  stats.forEach((s, i) => {
    const sx = 0.34 + i * 2.4;
    sld.addText(s.n, {
      x: sx, y: 3.3, w: 1.5, h: 0.72,
      fontSize: 44, bold: true, color: s.color, fontFace: F.en,
    });
    sld.addText(s.label, {
      x: sx, y: 4.0, w: 1.5, h: 0.26,
      fontSize: 10.5, color: C.muted, fontFace: F.en,
    });
  });

  filledBox(sld, 5.9, 3.26, 3.76, 1.56, C.row1, 0.08);
  sld.addText("工程观察", {
    x: 6.06, y: 3.34, w: 3.42, h: 0.28,
    fontSize: 11, bold: true, color: C.ink, fontFace: F.zh,
  });
  ["fix 是 feat 的 1.5 倍 → 平台适配占主要工作量",
   "docs 12次 → 关键决策均有文档记录",
   "12天 74 commits → 平均每天 6 次迭代"].forEach((ins, i) => {
    sld.addText("· " + ins, {
      x: 6.06, y: 3.66 + i * 0.42, w: 3.42, h: 0.36,
      fontSize: 10.5, color: C.ink, fontFace: F.zh, wrap: true,
    });
  });

  slideNum(sld, 10);
  sld.addNotes("这张图是整个项目的全景视图。12天，74次提交，三个明确的工程阶段。从 commit 类型分布来看，fix 提交是 feat 的 1.5 倍，这说明平台适配和 Prompt 调优占了大量工作。五个架构里程碑是：v1.0 建立工具链基础，v1.12 完成 13 路分类器，MCP 优先决策是架构转型点，v2.0 完成 Agent 模式升级，v3.2 正式接入官方 MCP。每个里程碑背后都有明确的问题驱动。");
}

// ══════════════════════════════════════════════════════════════════════════════
// Slide 11 — 工程收益与展望
// ══════════════════════════════════════════════════════════════════════════════
{
  const sld = prs.addSlide();
  sld.background = { color: C.block };

  sld.addShape(prs.ShapeType.rect, {
    x: 0, y: 0, w: W, h: 0.055,
    fill: { color: C.accent }, line: { type: "none" },
  });

  sld.addText("工程收益与展望", {
    x: 0.46, y: 0.18, w: 9, h: 0.5,
    fontSize: 26, bold: true, color: C.white, fontFace: F.zh,
  });
  sld.addText("ENGINEERING TAKEAWAYS  ·  FORWARD LOOK", {
    x: 0.46, y: 0.66, w: 9, h: 0.24,
    fontSize: 9, color: C.accentLt, fontFace: F.en, charSpacing: 1.5,
  });

  const takeaways = [
    { n: "01", title: "平台适配没有捷径",
      body: "Schema 约束、变量类型、节点兼容性只有运行时验证才能发现。小步快跑、保留历史 YAML 可快速回滚是关键。" },
    { n: "02", title: "LLM 可靠性在设计层解决",
      body: "幻觉不能靠更好的模型，要在 Prompt 显式枚举禁止输出；支付场景必须设计「Bot 只引导，不声明」的边界原则。" },
    { n: "03", title: "工具端点选型考虑部署环境",
      body: "本地 mock 方案在生产/竞赛环境可能成为单点故障。优先使用平台内网 MCP 服务，避免外部网络依赖。" },
  ];

  takeaways.forEach((t, i) => {
    const tx = 0.26 + i * 3.3;
    filledBox(sld, tx, 1.02, 3.06, 2.68, C.dark2, 0.1);
    sld.addText(t.n, {
      x: tx + 0.16, y: 1.1, w: 0.56, h: 0.58,
      fontSize: 30, bold: true, color: C.accentLt, fontFace: F.en,
    });
    sld.addText(t.title, {
      x: tx + 0.16, y: 1.66, w: 2.76, h: 0.34,
      fontSize: 12, bold: true, color: C.white, fontFace: F.zh,
    });
    sld.addText(t.body, {
      x: tx + 0.16, y: 2.04, w: 2.76, h: 1.56,
      fontSize: 10.5, color: C.tint, fontFace: F.zh, wrap: true,
    });
  });

  // roadmap bar
  filledBox(sld, 0.26, 3.86, 9.48, 1.44, C.dark2, 0.08);
  sld.addText("下一步  Multi-Agent 协同规划", {
    x: 0.46, y: 3.94, w: 4.5, h: 0.28,
    fontSize: 11, bold: true, color: C.accentLt, fontFace: F.zh,
  });

  const roadItems = [
    { label: "当前\n单 Agent 全能型", x: 0.42 },
    { label: "v2.2\n情绪感知 + Upsell", x: 3.3 },
    { label: "v3.0 愿景\n四专业 Agent 协同", x: 6.4 },
  ];
  roadItems.forEach((r) => {
    sld.addText(r.label, {
      x: r.x, y: 4.24, w: 2.6, h: 0.86,
      fontSize: 10.5, color: C.tint, fontFace: F.zh, align: "center", valign: "middle",
    });
  });
  [2.96, 5.86].forEach((ax) => {
    sld.addShape(prs.ShapeType.rightArrow, {
      x: ax, y: 4.52, w: 0.56, h: 0.34,
      fill: { color: C.accentLt }, line: { type: "none" },
    });
  });

  sld.addNotes("最后总结三点工程收益。第一，平台适配没有捷径，只有运行时验证，保持快速迭代和历史版本可回滚是关键。第二，LLM 可靠性必须在设计层面解决，幻觉问题靠更好的模型解决不了，要在 Prompt 里明确约束。第三，工具链选型要考虑部署环境，开发时的 mock 方案在生产和竞赛环境可能成为单点故障。展望来看，我们下一步想做多 Agent 协同架构，把当前的单个全能 Agent 拆分为专业化的 Agent 集群，分别负责前台、销售、行程和售后。谢谢大家，有问题欢迎交流。");
}

// ── Write output ──────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, "outputs");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
const outPath = path.join(outDir, "彬彬有礼-开发迭代介绍.pptx");

prs.writeFile({ fileName: outPath }).then(() => {
  console.log("✓  PPTX saved:", outPath);
}).catch((err) => {
  console.error("✗  Error:", err);
  process.exit(1);
});
