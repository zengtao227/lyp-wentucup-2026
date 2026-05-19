import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const COLORS = {
  bg: "#F8FAFC",
  bg2: "#F1F5F9",
  paper: "#FFFFFF",
  card: "#FFFFFF",
  cardAlt: "#F1F5F9",
  tableHead: "#E5EFF7",
  panel: "#0F172A",
  panel2: "#1E293B",
  ink: "#020617",
  muted: "#475569",
  faint: "#64748B",
  line: "#E2E8F0",
  lineStrong: "#CBD5E1",
  blue: "#0369A1",
  cyan: "#0891B2",
  green: "#047857",
  amber: "#B45309",
  rose: "#BE123C",
  purple: "#6D28D9",
  cream: "#EAF3F8",
  transparent: "#00000000",
};

const FOOTER = "问途杯决赛 · 酒店/旅游业智能客服应用功能整合优化与方案路演 · 彬彬有礼团队";
const BODY_FONT = "PingFang SC";

function pngDataUrl(fileName) {
  const filePath = fileURLToPath(new URL(`../assets/${fileName}`, import.meta.url));
  return `data:image/png;base64,${readFileSync(filePath).toString("base64")}`;
}

const SCHOOL_SEAL_DARK = pngDataUrl("school-seal-dark.png");
const SCHOOL_SEAL_WATERMARK = pngDataUrl("school-seal-watermark.png");
const SCHOOL_LOGO_DARK = pngDataUrl("school-logo-dark.png");
const BOOKING_FLOW_01 = pngDataUrl("booking-flow-light-01.png");
const BOOKING_FLOW_02 = pngDataUrl("booking-flow-light-02.png");
const BOOKING_FLOW_03 = pngDataUrl("booking-flow-light-03.png");

export const SLIDES = [
  { type: "cover" },
  {
    type: "compare",
    kicker: "选题价值",
    title: "参赛项目的核心价值：\n让酒店客服从人力班表变成系统能力",
    leftTitle: "传统客服模式",
    rightTitle: "OPC × AI 模式",
    leftAccent: COLORS.rose,
    rightAccent: COLORS.green,
    leftItems: ["3-5 名客服，三班轮值", "夜间响应缺口，凌晨询问流失", "知识口径不一，差评风险高", "人力成本 ¥18,000+/月"],
    rightItems: ["1 人运营，系统 7×24 自动响应", "秒级答复，知识统一标准化", "从“智能问答”到“智能服务”", "运营成本降低 > 95%"],
    quote: "核心主张：用 AI 技术构建极简商业单元，让一人即可运营专业级酒店智能前台。",
  },
  { type: "toc" },
  { type: "chapter", chapter: "01", title: "需求分析\n与整体规划设计", subtitle: "从问题出发，定义 AI 客服的真实价值" },
  {
    type: "pain",
    kicker: "酒店服务痛点",
    title: "五类真实场景决定了 AI 前台\n必须同时解决速度、口径和成本",
    rows: [
      ["响应延迟", "高峰期等待 > 5 分钟"],
      ["夜间缺口", "23:00-8:00 无人接待"],
      ["知识分散", "5 类场景，5 人口径不同"],
      ["重复劳动", "80% 问题为高频重复"],
      ["成本高企", "3-5 名专职客服/月"],
    ],
    metrics: [
      ["80%", "问题可被知识库标准化处理"],
      ["¥18,000+", "传统模式月均人力成本"],
    ],
  },
  {
    type: "architecture",
    kicker: "技术方案总览",
    title: "单一 Chatflow 入口\n把 FAQ 咨询和智能预订合成一个服务系统",
    top: ["客户发起咨询", "Dify 平台", "Chatflow 工作流\n唯一客服入口"],
    lanes: [
      {
        title: "FAQ 问答分支",
        accent: COLORS.cyan,
        bullets: ["问题分类器 -> KB 强制检索 -> LLM 精准回答", "覆盖客房、餐饮、会议、周边 5 大场景", "准确率 100%，响应 < 3s"],
      },
      {
        title: "智能预订分支",
        accent: COLORS.green,
        bullets: ["意图识别 -> MCP 工具链 -> 全流程下单", "实时查询房态、提交订单、支付引导", "与问答同一入口，无缝切换"],
      },
    ],
    chips: ["5 大知识场景", "DeepSeek-V3", "5 个 MCP 工具"],
  },
  { type: "chapter", chapter: "02", title: "知识库资料\n整理与构建逻辑", subtitle: "结构化知识，是 AI 准确回答的地基" },
  {
    type: "knowledge",
    kicker: "酒店知识工程",
    title: "五大知识域\n把酒店咨询从碎片资料变成可检索事实系统",
    rows: [
      ["酒店概况", "地址、设施、服务、押金、宠物政策", "停车收费吗？前台 24 小时吗？"],
      ["客房产品", "374 间房、13 种房型、楼层、加床", "大床房几楼？可以带宠物吗？"],
      ["餐饮娱乐", "维也纳西餐厅、御品南豪中餐厅", "早餐几点？包间怎么预约？"],
      ["宴会会议", "凤凰国际会议中心、花涧里会议室", "容纳多少人？设备有投影仪吗？"],
      ["周边景点", "梁启超故居、小鸟天堂、圭峰山", "深度咨询引导致电前台"],
    ],
    metrics: [["900+", "结构化知识条目"], ["UTF-8", "统一编码格式"], ["1 个", "统一知识库 ID"]],
  },
  {
    type: "decisions",
    kicker: "技术决策",
    title: "三个技术决策\n直接处理乱码、碎片化和入口割裂这三个根因",
    decisions: [
      ["编码统一化", "GBK 文档上传后向量索引乱码，宠物政策检索失败。", "全部转为 UTF-8 Markdown 标准问答与事实条目。"],
      ["统一知识库", "5 个独立 KB 分散维护，跨场景问题口径不一致。", "合并为 1 个统一 KB，配合 gte-rerank-v2 与 top_k=4。"],
      ["问答与预订合流", "问答、订房分散会产生入口切换和重复说明。", "单一 Chatflow 承接全链路，分类器和 MCP 节点递进执行。"],
    ],
  },
  { type: "chapter", chapter: "03", title: "流程设计\n与功能模块规划", subtitle: "稳健驱动，覆盖咨询与预订全场景" },
  {
    type: "splitPath",
    kicker: "流程设计",
    title: "FAQ 和预订路径在同一工作流里分流\n但共同服从可控节点逻辑",
    lanes: [
      {
        title: "FAQ 问答路径",
        accent: COLORS.cyan,
        items: ["问题分类器 -> KB 强制检索 -> LLM 精准输出", "涵盖客房、餐饮、宴会、周边 5 大场景", "memory window = 10 多轮连贯", "准确率 100%，响应 < 3s，token 成本低"],
      },
      {
        title: "智能预订路径",
        accent: COLORS.green,
        items: ["预订意图识别 -> MCP 工具链依次调用", "查房态 -> 收集姓名/电话/日期 -> 提交订单", "推送流水编号 + 支付二维码，全程无人工", "与问答同一工作流，无缝跳转"],
      },
    ],
    bottom: [["KB 检索", "分类器强制，统一知识库命中"], ["预订能力", "节点内嵌 MCP，全流程自动化"], ["稳定性", "工作流可控，行为可预期"], ["OPC 价值", "1 人运营，7×24 全天候"]],
  },
  {
    type: "workflow",
    kicker: "预订闭环",
    title: "6 步预订节点把“能答”升级为“能订”\n并防止信息不全就提交",
    steps: [
      ["01", "理解意向", "房型 / 日期 / 间数"],
      ["02", "查询房态", "MCP 实时查询"],
      ["03", "展示详情", "房型图文介绍"],
      ["04", "收集信息", "姓名 / 电话 / 日期"],
      ["05", "提交订单", "submitBooking"],
      ["06", "支付引导", "小途乐订小程序"],
    ],
    note: "关键约束：Step 04 信息不完整时严禁跳到 Step 05；同一参数调用超过 2 次自动转人工。",
    required: [["宾客姓名", "必填"], ["手机号码", "必填"], ["入/离日期", "YYYY-MM-DD"]],
  },
  { type: "chapter", chapter: "04", title: "应用编排\n与关键节点配置", subtitle: "每个参数背后都是一次真实的踩坑" },
  {
    type: "parameters",
    kicker: "节点配置",
    title: "关键参数不是装饰项\n而是让答案稳定、工具可控的工程约束",
    rows: [
      ["temperature", "0.1", "极低随机性，答案稳定可复现"],
      ["top_k", "4", "精准召回，不浪费 context"],
      ["reranker", "启用", "复杂政策问题准确率关键"],
      ["max_iteration", "5", "防止 Agent 工具死循环"],
      ["memory_window", "10", "保留足够上下文不过量消耗"],
    ],
    principles: [["回复规范", "中文直接开始，禁止技术标签泄露"], ["日期格式", "工具传参强制 YYYY-MM-DD"], ["房型代码表", "13 种房型代码内嵌，工具调用零歧义"], ["知识库优先", "引用政策时完整转述，禁止省略细节"]],
  },
  {
    type: "guardrails",
    kicker: "风险控制",
    title: "异常止损机制让系统优先保持稳健\n而不是在客人面前冒险循环",
    rows: [
      ["工具调用失败", "最多重试 1 次，仍失败转人工"],
      ["同参数重复调用", "≤ 2 次限制，防 API 死循环"],
      ["日期格式错误", "Prompt 层强制转换，不依赖模型"],
      ["未知房型名称", "礼貌告知 + 推荐最近似房型"],
      ["提交订单报错", "调用专用兜底工具引导处理"],
      ["迭代上限到达", "优雅退出 + 转人工处理"],
    ],
    note: "teamId = 234556：首次调用必带；失败后无 teamId 重试一次，两次无果转人工。",
  },
  { type: "chapter", chapter: "05", title: "性能展示\n与成本优化策略", subtitle: "数字见证，让数据替我们说话" },
  {
    type: "accuracy",
    kicker: "测试验证",
    title: "20 题 × 3 轮内部测试显示：\n统一知识库和约束提示显著抬高准确率",
    rows: [
      ["可以带宠物入住吗？", "错误", "完整正确"],
      ["早餐几点开始？", "不完整", "双餐厅准确"],
      ["宠物押金退不退？", "未提及", "无损坏全额退"],
      ["有充电桩吗？", "不确定", "准确：暂无"],
      ["订两间大床房 5.21-5.22", "不支持", "完整预订流程"],
    ],
    before: "≈51%",
    after: "100%",
  },
  {
    type: "cost",
    kicker: "运营价值",
    title: "成本优化的价值不止省钱\n更是让服务覆盖变成全天候能力",
    cards: [
      ["传统客服 · 月均人力成本", "¥18,000", "3 人 × ¥6,000/月（含五险一金）", COLORS.rose],
      ["AI 客服 · 月均运营成本", "显著低于人力", "API 调用 + 平台费，按量弹性估算", COLORS.cyan],
      ["月均成本节省比例", "97%+", "OPC 核心价值量化", COLORS.green],
      ["全天候服务", "7 × 24", "无夜班缺口，响应不中断", COLORS.amber],
    ],
  },
  { type: "chapter", chapter: "06", title: "智能预订 Agent\n搭建与功能整合", subtitle: "从“能问”到“能订”，服务发生质变" },
  {
    type: "mcp",
    kicker: "工具链整合",
    title: "五个 MCP 工具\n把查房态、查详情、提交订单和异常兜底连成闭环",
    toolsTop: [
      ["getAvailableRoomsByDate", "按日期查全部可用房型"],
      ["getAvailableRoomsByRoomTypeAndDate", "指定房型查可用性"],
      ["getRoomDetailByRoomCode", "获取完整房型描述"],
    ],
    toolsBottom: [
      ["submitBooking", "提交预订订单"],
      ["getHotelHelpAfterSubmitBookingError", "提交失败兜底处理"],
      ["小途乐订", "小程序支付"],
    ],
    metrics: [["13", "种房型代码"], ["234556", "teamId 鉴权优先策略"], ["WCP-[ID]", "订单流水号格式"]],
  },
  {
    type: "dialogue",
    kicker: "用户体验演示",
    title: "用户体验呈现为一次连续对话：\n查询、确认、待支付申请都在同一入口完成",
    steps: [
      ["Step 1 · 查询与选房", "用户：6 月 2 日入住，两间豪华大床房。\nAI：已调用 MCP 查询房态，并展示可订房型与价格。"],
      ["Step 2 · 确认信息", "用户：确认，姓名符秀晶，手机号 138****8888。\nAI：复述入住日期、房型、间数、联系人，等待明确确认。"],
      ["Step 3 · 下单支付", "用户：确认预订。\nAI：预订申请已提交，流水编号 WCP-101；请前往小途乐订完成支付。"],
    ],
    caption: "从咨询到下单 · 全程无需人工介入 · 完成预订 < 5 min",
  },
  {
    type: "bookingProof",
    kicker: "真实界面验证",
    title: "预订流程截图证明：\n查房态、信息确认、待支付申请已在同一入口跑通",
    screenshots: [
      ["01 · 查询与选房", BOOKING_FLOW_01, "识别入住日期与房型，返回可订房型和补充信息要求"],
      ["02 · 信息确认", BOOKING_FLOW_02, "汇总姓名、手机号、日期、房型与预算，等待用户确认"],
      ["03 · 待支付申请", BOOKING_FLOW_03, "生成 WCP 流水编号，并引导前往小途乐订完成支付"],
    ],
    caption: "截图来自 Dify 预览流程，展示的是比赛现场可复现的真实操作链路。",
  },
  { type: "chapter", chapter: "07", title: "设计优化\n与性能迭代表现", subtitle: "持续迭代，每个版本解决一个真实问题" },
  {
    type: "timeline",
    kicker: "迭代记录",
    title: "版本里程碑显示：\n每次升级都对应一个真实稳定性或演示风险",
    rows: [
      ["v1.0", "初赛起点 · 多场景意图分类 · 基础问答框架搭建", "May 8"],
      ["v1.7", "景区购票分支上线 · 小程序支付二维码打通", "May 9"],
      ["v1.12", "酒店知识库整合 · 取消退款流程 · MCP 官方接入策略确立", "May 11"],
      ["v2.7", "意图三路路由架构 · 天气查询接入 · 导入稳定性修复", "May 14"],
      ["v3.2 ★", "预订分支接入组委会 MCP · getAvailableRoomsByDate 实时房态查询", "May 15"],
      ["v3.4 ★", "统一知识库 · 预订前置校验强化 · 开场语与建议问题最终收敛", "May 17"],
    ],
  },
  {
    type: "threeLayer",
    kicker: "系统优化",
    title: "三层系统性优化共同抬高稳定性：\n架构消根因，模型提稳定，提示词做约束",
    columns: [
      ["架构层", ["5 个独立 KB -> 1 个统一 KB", "GBK -> UTF-8 Markdown", "碎片检索 -> 跨文档重排序"], "消除根因", COLORS.cyan],
      ["模型层", ["启用 gte-rerank-v2", "temperature 0.3 -> 0.1", "top_k 精准控制 = 4"], "提升稳定性", COLORS.green],
      ["提示词层", ["知识库强制使用规则", "完整止损 + 死循环防护", "房型代码表嵌入 Prompt"], "精准约束", COLORS.amber],
    ],
    quote: "内部测试结果：知识库检索准确率 ≈ 51% -> 100%；知识库覆盖内容正确率 10% -> 100%（20 题 × 3 轮测试集）",
  },
  {
    type: "summary",
    kicker: "项目结论",
    title: "OPC × AI 的落地价值在于：\n每一项 AI 能力都对应一个运营结果",
    rows: [
      ["7×24 自动响应", "无夜班缺口，系统永不下线"],
      ["统一知识库", "1 人维护，全系统一致输出"],
      ["在线预订闭环", "客人自助完成订房无需人工"],
      ["多轮对话记忆", "AI 代替人脑记住上下文"],
      ["按量付费 API", "无固定人力，成本随业务弹性伸缩"],
    ],
    metrics: [["月均节省", "¥17,500+"], ["年化 ROI", "36× +"]],
    quote: "实践证明：参赛团队可以把业务理解、AI 编排和运营结果连接成一个可演示、可量化的真实应用。",
  },
  {
    type: "thanks",
    kicker: "致谢",
    title: "项目落地来自学校、酒店\n与竞赛平台的共同支持",
    cards: [
      ["学校领导与指导老师", "感谢学院领导关心与支持\n感谢指导老师颜燕、李延平悉心指导\n为方案设计与技术实现提供建议", COLORS.cyan],
      ["新会碧桂园凤凰酒店", "感谢酒店方提供真实业务场景\n支持知识资料整理与应用验证\n为项目落地提供实践基础", COLORS.green],
      ["问途竞赛平台技术支持", "感谢平台技术团队专业解答\n支持 MCP 工具接入与调试\n保障演示链路稳定运行", COLORS.amber],
    ],
  },
  { type: "ending" },
];

function addRect(slide, ctx, left, top, width, height, fill, line = ctx.line()) {
  return ctx.addShape(slide, { left, top, width, height, fill, line });
}

function addText(slide, ctx, text, left, top, width, height, opts = {}) {
  return ctx.addText(slide, {
    text,
    left,
    top,
    width,
    height,
    fontSize: opts.size ?? 20,
    color: opts.color ?? COLORS.ink,
    bold: opts.bold ?? false,
    typeface: opts.face ?? BODY_FONT,
    align: opts.align ?? "left",
    valign: opts.valign ?? "top",
    fill: opts.fill ?? COLORS.transparent,
    line: opts.line ?? ctx.line(),
    insets: opts.insets ?? { left: 0, right: 0, top: 0, bottom: 0 },
  });
}

function addRaster(slide, dataUrl, left, top, width, height, opts = {}) {
  const image = slide.images.add({
    dataUrl,
    fit: opts.fit ?? "contain",
    alt: opts.alt ?? "",
    name: opts.name,
  });
  image.position = { left, top, width, height };
  return image;
}

function rule(slide, ctx, left, top, width, color = COLORS.line, height = 1) {
  addRect(slide, ctx, left, top, width, height, color);
}

function cleanHeadline(text) {
  return String(text).replace(/[。.!！?？]+$/u, "");
}

function formatHeadline(text) {
  const cleaned = cleanHeadline(text);
  if (cleaned.includes("\n") || cleaned.length <= 24) return cleaned;
  const colonIndex = cleaned.indexOf("：");
  if (colonIndex > 4 && colonIndex < 20) {
    return `${cleaned.slice(0, colonIndex + 1)}\n${cleaned.slice(colonIndex + 1)}`;
  }
  const commaIndex = cleaned.indexOf("，");
  if (commaIndex > 12 && commaIndex < 28) {
    return `${cleaned.slice(0, commaIndex + 1)}\n${cleaned.slice(commaIndex + 1)}`;
  }
  return cleaned;
}

function background(slide, ctx, variant = "standard", opts = {}) {
  addRect(slide, ctx, 0, 0, ctx.W, ctx.H, variant === "chapter" ? COLORS.bg2 : COLORS.bg);
  addRect(slide, ctx, 0, 0, ctx.W, 8, variant === "chapter" ? COLORS.panel : COLORS.blue);
  addRect(slide, ctx, 0, 8, ctx.W, 2, COLORS.green);
  if (opts.watermark !== false) {
    addRaster(slide, SCHOOL_SEAL_WATERMARK, 1134, 42, 72, 72, { alt: "海南职业技术学院校徽水印", name: "school-seal-watermark" });
  }
}

function footer(slide, ctx, page) {
  rule(slide, ctx, 64, 660, 1048, COLORS.line);
  addText(slide, ctx, FOOTER, 64, 674, 850, 20, { size: 9.5, color: COLORS.faint });
  addRect(slide, ctx, 1146, 666, 52, 30, COLORS.card, ctx.line(COLORS.line, 1));
  addText(slide, ctx, String(page).padStart(2, "0"), 1156, 672, 32, 15, { size: 12.5, color: COLORS.blue, bold: true, align: "center" });
}

function kicker(slide, ctx, label, accent = COLORS.blue) {
  addRect(slide, ctx, 64, 42, 30, 4, accent);
  addText(slide, ctx, label, 64, 54, 420, 20, { size: 10.5, color: COLORS.muted, bold: true });
}

function title(slide, ctx, text, y = 78, size = 30) {
  addText(slide, ctx, formatHeadline(text), 64, y, 980, 86, { size, color: COLORS.ink, bold: true, face: BODY_FONT });
}

function chip(slide, ctx, text, left, top, width, accent = COLORS.blue) {
  addRect(slide, ctx, left, top, width, 34, COLORS.cream, ctx.line(COLORS.line, 1));
  addRect(slide, ctx, left, top, 4, 34, accent);
  addText(slide, ctx, text, left + 14, top + 7, width - 22, 18, { size: 12, color: accent, bold: true });
}

function bulletList(slide, ctx, items, left, top, width, opts = {}) {
  const gap = opts.gap ?? 34;
  items.forEach((item, index) => {
    const y = top + index * gap;
    addRect(slide, ctx, left, y + 8, 7, 7, opts.accent ?? COLORS.blue);
    addText(slide, ctx, item, left + 18, y, width - 20, gap - 2, { size: opts.size ?? 17, color: opts.color ?? COLORS.ink });
  });
}

function drawTable(slide, ctx, rows, left, top, width, rowHeight, headers, colWidths, opts = {}) {
  const headerH = opts.headerHeight ?? 46;
  addRect(slide, ctx, left, top, width, headerH, opts.headerFill ?? COLORS.tableHead);
  let x = left;
  headers.forEach((header, index) => {
    addText(slide, ctx, header, x + 12, top + 10, colWidths[index] - 18, 22, { size: opts.headerSize ?? 14, color: opts.headerColor ?? COLORS.ink, bold: true });
    if (index > 0) rule(slide, ctx, x, top, 1, COLORS.lineStrong, headerH + rows.length * rowHeight);
    x += colWidths[index];
  });
  rows.forEach((row, rowIndex) => {
    const y = top + headerH + rowIndex * rowHeight;
    addRect(slide, ctx, left, y, width, rowHeight, rowIndex % 2 ? COLORS.cardAlt : COLORS.paper);
    rule(slide, ctx, left, y, width, COLORS.line);
    x = left;
    row.forEach((cell, colIndex) => {
      const color = opts.cellColors?.[colIndex]?.(cell) ?? COLORS.ink;
      addText(slide, ctx, cell, x + 12, y + 10, colWidths[colIndex] - 18, rowHeight - 24, { size: opts.cellSize ?? 13, color, bold: colIndex === 0 });
      x += colWidths[colIndex];
    });
  });
  rule(slide, ctx, left, top + headerH + rows.length * rowHeight, width, COLORS.line);
}

function metric(slide, ctx, value, label, left, top, width, accent = COLORS.cyan) {
  const valueSize = width < 180 ? 30 : String(value).length > 7 ? 28 : 34;
  addRect(slide, ctx, left, top, width, 118, COLORS.card, ctx.line(COLORS.line, 1));
  addRect(slide, ctx, left, top, width, 5, accent);
  addText(slide, ctx, value, left + 22, top + 22, width - 44, 40, { size: valueSize, color: accent, bold: true });
  addText(slide, ctx, label, left + 22, top + 72, width - 44, 28, { size: 14, color: COLORS.muted });
}

function drawCover(slide, ctx) {
  background(slide, ctx, "standard", { watermark: false });
  addText(slide, ctx, '2026 · 第五届"问途杯"高校酒店及旅游人工智能创新应用大赛决赛', 120, 78, 1040, 24, { size: 14, color: COLORS.muted, bold: true, align: "center" });
  addText(slide, ctx, "酒店/旅游业智能客服应用\n功能整合优化方案路演", 150, 172, 980, 126, { size: 44, color: COLORS.ink, bold: true, align: "center" });
  addText(slide, ctx, "新会碧桂园凤凰酒店真实场景 · Dify × DeepSeek-V3 × MCP", 220, 326, 840, 28, { size: 18, color: COLORS.muted, align: "center" });
  addRaster(slide, SCHOOL_LOGO_DARK, 470, 378, 340, 86, { alt: "海南职业技术学院完整标识", name: "school-logo-cover" });
  addRect(slide, ctx, 204, 504, 872, 50, COLORS.card, ctx.line(COLORS.line, 1));
  addText(slide, ctx, "核心主张：用 AI 技术构建极简商业单元，让一人即可运营专业级酒店智能前台", 230, 519, 820, 20, { size: 15, color: COLORS.ink, bold: true, align: "center" });
  [["自主预订闭环", COLORS.blue], ["咨询预订一体化", COLORS.green], ["OPC 极简运营", COLORS.amber]].forEach((item, index) => {
    const x = 310 + index * 226;
    addRect(slide, ctx, x, 584, 190, 38, COLORS.card, ctx.line(COLORS.line, 1));
    addText(slide, ctx, item[0], x + 16, 593, 158, 20, { size: 12.5, color: item[1], bold: true, align: "center", valign: "middle" });
  });
  addText(slide, ctx, "符秀晶 · 温媛 · 李秋慧 · 符志鹏 | 指导教师：颜燕、李延平", 290, 646, 700, 22, { size: 14, color: COLORS.muted, align: "center" });
}

function drawCompare(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.green);
  title(slide, ctx, data.title, 78, 30);
  const panels = [
    [74, data.leftTitle, data.leftItems, data.leftAccent],
    [658, data.rightTitle, data.rightItems, data.rightAccent],
  ];
  panels.forEach(([x, heading, items, accent]) => {
    addRect(slide, ctx, x, 202, 500, 314, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, 202, 500, 7, accent);
    addText(slide, ctx, heading, x + 28, 234, 420, 32, { size: 24, color: accent, bold: true });
    bulletList(slide, ctx, items, x + 30, 298, 420, { accent, gap: 43, size: 18 });
  });
  addRect(slide, ctx, 118, 560, 1030, 54, COLORS.card, ctx.line(COLORS.line, 1));
  addText(slide, ctx, data.quote, 148, 575, 970, 22, { size: 17, color: COLORS.ink, bold: true, align: "center" });
  footer(slide, ctx, page);
}

function drawToc(slide, ctx, page) {
  background(slide, ctx);
  kicker(slide, ctx, "ROADSHOW MAP", COLORS.amber);
  title(slide, ctx, "答辩目录", 80, 36);
  const items = [
    ["01", "需求分析与整体规划"],
    ["02", "知识库资料整理与构建"],
    ["03", "流程设计与功能模块规划"],
    ["04", "应用编排与关键节点配置"],
    ["05", "性能展示与成本优化"],
    ["06", "智能预订 Agent 整合"],
    ["07", "设计优化与迭代表现"],
    ["OPC", "总结与展望"],
  ];
  items.forEach((item, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col ? 670 : 90;
    const y = 190 + row * 92;
    addText(slide, ctx, item[0], x, y, 74, 38, { size: 26, color: col ? COLORS.green : COLORS.cyan, bold: true });
    rule(slide, ctx, x + 82, y + 19, 355, COLORS.line);
    addText(slide, ctx, item[1], x + 100, y + 4, 360, 32, { size: 20, color: COLORS.ink, bold: true });
  });
  footer(slide, ctx, page);
}

function drawChapter(slide, ctx, data, page) {
  background(slide, ctx, "chapter");
  addText(slide, ctx, `CHAPTER ${data.chapter}`, 72, 142, 300, 24, { size: 14, color: COLORS.green, bold: true });
  addText(slide, ctx, data.chapter, 808, 184, 360, 170, { size: 128, color: COLORS.lineStrong, bold: true, align: "right" });
  addRect(slide, ctx, 72, 222, 8, 188, COLORS.blue);
  addText(slide, ctx, data.title, 108, 210, 660, 150, { size: 48, color: COLORS.ink, bold: true });
  addText(slide, ctx, data.subtitle, 110, 412, 760, 34, { size: 22, color: COLORS.muted });
  footer(slide, ctx, page);
}

function drawPain(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.rose);
  title(slide, ctx, data.title, 78, 29);
  drawTable(slide, ctx, data.rows, 72, 190, 690, 58, ["痛点", "量化影响"], [260, 430], { cellSize: 17, headerSize: 16 });
  metric(slide, ctx, data.metrics[0][0], data.metrics[0][1], 830, 238, 300, COLORS.cyan);
  metric(slide, ctx, data.metrics[1][0], data.metrics[1][1], 830, 390, 300, COLORS.amber);
  footer(slide, ctx, page);
}

function drawArchitecture(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.cyan);
  title(slide, ctx, data.title, 78, 29);
  data.top.forEach((item, index) => {
    const x = 90 + index * 360;
    const nextX = 90 + (index + 1) * 360;
    addRect(slide, ctx, x, 172, 260, 70, COLORS.card, ctx.line(COLORS.line, 1));
    addText(slide, ctx, item, x + 18, 184, 224, 42, { size: 18, color: COLORS.ink, bold: true, align: "center", valign: "middle" });
    if (index < 2) {
      rule(slide, ctx, x + 276, 207, nextX - x - 322, COLORS.blue, 2);
      addText(slide, ctx, "→", nextX - 46, 193, 30, 28, { size: 21, color: COLORS.blue, bold: true, align: "center" });
    }
  });
  data.lanes.forEach((lane, index) => {
    const x = index ? 660 : 86;
    addRect(slide, ctx, x, 306, 500, 214, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, 306, 500, 6, lane.accent);
    addText(slide, ctx, lane.title, x + 24, 332, 430, 28, { size: 23, color: lane.accent, bold: true });
    bulletList(slide, ctx, lane.bullets, x + 28, 382, 420, { accent: lane.accent, gap: 38, size: 15 });
  });
  data.chips.forEach((item, index) => chip(slide, ctx, item, 118 + index * 330, 562, 245, [COLORS.cyan, COLORS.green, COLORS.amber][index]));
  footer(slide, ctx, page);
}

function drawKnowledge(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.green);
  title(slide, ctx, data.title, 78, 29);
  drawTable(slide, ctx, data.rows, 58, 175, 990, 59, ["知识文档", "核心内容", "典型问题"], [170, 415, 405], { cellSize: 12.5, headerSize: 14 });
  data.metrics.forEach((item, index) => metric(slide, ctx, item[0], item[1], 1080, 175 + index * 126, 145, [COLORS.cyan, COLORS.green, COLORS.amber][index]));
  footer(slide, ctx, page);
}

function drawDecisions(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.amber);
  title(slide, ctx, data.title, 78, 29);
  data.decisions.forEach((decision, index) => {
    const y = 184 + index * 132;
    addText(slide, ctx, `0${index + 1}`, 66, y + 8, 58, 42, { size: 30, color: [COLORS.cyan, COLORS.green, COLORS.amber][index], bold: true });
    addText(slide, ctx, decision[0], 140, y, 280, 30, { size: 24, color: COLORS.ink, bold: true });
    addText(slide, ctx, `根因：${decision[1]}`, 140, y + 42, 910, 24, { size: 16, color: COLORS.rose });
    addText(slide, ctx, `方案：${decision[2]}`, 140, y + 76, 960, 26, { size: 16, color: COLORS.green });
    rule(slide, ctx, 140, y + 116, 940, COLORS.line);
  });
  footer(slide, ctx, page);
}

function drawSplitPath(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.blue);
  title(slide, ctx, data.title, 78, 29);
  data.lanes.forEach((lane, index) => {
    const x = index ? 656 : 72;
    addRect(slide, ctx, x, 176, 515, 260, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, 176, 515, 7, lane.accent);
    addText(slide, ctx, lane.title, x + 26, 206, 420, 30, { size: 23, color: lane.accent, bold: true });
    bulletList(slide, ctx, lane.items, x + 28, 260, 440, { accent: lane.accent, gap: 38, size: 14.5 });
  });
  data.bottom.forEach((item, index) => {
    const x = 92 + index * 270;
    const accent = [COLORS.cyan, COLORS.green, COLORS.blue, COLORS.amber][index];
    addRect(slide, ctx, x, 482, 230, 86, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, 482, 230, 5, accent);
    addText(slide, ctx, item[0], x + 18, 502, 194, 18, { size: 14, color: accent, bold: true, align: "center" });
    addText(slide, ctx, item[1], x + 18, 530, 194, 24, { size: 12, color: COLORS.ink, align: "center" });
  });
  addText(slide, ctx, "单一 Chatflow 工作流即可覆盖咨询与预订全场景，真正实现 OPC 极简运营。", 112, 590, 990, 26, { size: 18, color: COLORS.ink, bold: true, align: "center" });
  footer(slide, ctx, page);
}

function drawWorkflow(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.green);
  title(slide, ctx, data.title, 78, 29);
  data.steps.forEach((step, index) => {
    const x = 64 + index * 197;
    addRect(slide, ctx, x, 190, 166, 148, COLORS.card, ctx.line(COLORS.line, 1));
    addText(slide, ctx, step[0], x + 14, 206, 50, 26, { size: 22, color: COLORS.cyan, bold: true });
    addText(slide, ctx, step[1], x + 14, 248, 136, 26, { size: 20, color: COLORS.ink, bold: true });
    addText(slide, ctx, step[2], x + 14, 288, 136, 28, { size: 13, color: COLORS.muted });
    if (index < data.steps.length - 1) addText(slide, ctx, "→", x + 166, 244, 30, 34, { size: 28, color: COLORS.blue, bold: true });
  });
  addRect(slide, ctx, 110, 374, 1060, 62, COLORS.card, ctx.line(COLORS.amber, 1));
  addText(slide, ctx, data.note, 136, 394, 1008, 22, { size: 15.5, color: COLORS.ink, bold: true, align: "center" });
  data.required.forEach((item, index) => {
    const accent = [COLORS.cyan, COLORS.green, COLORS.amber][index];
    const x = 190 + index * 310;
    addRect(slide, ctx, x, 462, 280, 78, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, 462, 280, 5, accent);
    addText(slide, ctx, item[0], x + 20, 484, 240, 24, { size: 19, color: accent, bold: true, align: "center" });
    addText(slide, ctx, item[1], x + 20, 512, 240, 16, { size: 10.5, color: COLORS.muted, align: "center" });
  });
  footer(slide, ctx, page);
}

function drawParameters(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.purple);
  title(slide, ctx, data.title, 78, 29);
  drawTable(slide, ctx, data.rows, 62, 176, 645, 54, ["参数", "值", "原因"], [180, 120, 345], { cellSize: 13.5, headerSize: 14 });
  addText(slide, ctx, "System Prompt 四大原则", 770, 176, 360, 32, { size: 22, color: COLORS.ink, bold: true });
  data.principles.forEach((item, index) => {
    const y = 220 + index * 69;
    addRect(slide, ctx, 770, y, 395, 54, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, 770, y, 5, 54, [COLORS.cyan, COLORS.green, COLORS.amber, COLORS.purple][index]);
    addText(slide, ctx, item[0], 790, y + 11, 96, 20, { size: 15, color: COLORS.ink, bold: true });
    addText(slide, ctx, item[1], 902, y + 8, 240, 28, { size: 12.5, color: COLORS.muted });
  });
  footer(slide, ctx, page);
}

function drawGuardrails(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.rose);
  title(slide, ctx, data.title, 78, 29);
  drawTable(slide, ctx, data.rows, 96, 176, 1040, 54, ["异常场景", "处置策略"], [320, 720], { cellSize: 15, headerSize: 15 });
  addRect(slide, ctx, 150, 552, 980, 46, COLORS.card, ctx.line(COLORS.amber, 1));
  addText(slide, ctx, `稳健原则：宁可转人工，也不在客人面前死循环；${data.note}`, 176, 566, 928, 18, { size: 14.2, color: COLORS.ink, bold: true, align: "center" });
  footer(slide, ctx, page);
}

function drawAccuracy(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.green);
  title(slide, ctx, data.title, 78, 28);
  drawTable(slide, ctx, data.rows, 56, 176, 760, 56, ["测试问题", "优化前", "优化后"], [390, 170, 200], {
    cellSize: 13,
    headerSize: 14,
    cellColors: {
      1: () => COLORS.rose,
      2: () => COLORS.green,
    },
  });
  addText(slide, ctx, "知识库检索准确率", 902, 170, 230, 30, { size: 20, color: COLORS.ink, bold: true, align: "center" });
  addRect(slide, ctx, 918, 390, 60, 118, COLORS.rose);
  addRect(slide, ctx, 1040, 274, 60, 234, COLORS.green);
  addText(slide, ctx, data.before, 886, 330, 120, 38, { size: 30, color: COLORS.rose, bold: true, align: "center" });
  addText(slide, ctx, data.after, 1010, 214, 120, 38, { size: 32, color: COLORS.green, bold: true, align: "center" });
  addText(slide, ctx, "优化前                         优化后", 888, 520, 244, 22, { size: 14, color: COLORS.muted, align: "center" });
  footer(slide, ctx, page);
}

function drawCost(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.amber);
  title(slide, ctx, data.title, 78, 29);
  data.cards.forEach((card, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = col ? 668 : 86;
    const y = 192 + row * 178;
    addRect(slide, ctx, x, y, 500, 132, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, y, 6, 132, card[3]);
    addText(slide, ctx, card[0], x + 24, y + 22, 420, 22, { size: 15, color: COLORS.muted, bold: true });
    addText(slide, ctx, card[1], x + 24, y + 52, 410, 42, { size: 34, color: card[3], bold: true });
    addText(slide, ctx, card[2], x + 24, y + 100, 420, 20, { size: 12.5, color: COLORS.ink });
  });
  footer(slide, ctx, page);
}

function drawMcp(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.cyan);
  title(slide, ctx, data.title, 78, 28);
  const drawTool = (tool, x, y, accent) => {
    addRect(slide, ctx, x, y, 300, 78, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, y, 5, 78, accent);
    addText(slide, ctx, tool[0], x + 16, y + 16, 260, 20, { size: 13, color: COLORS.ink, bold: true });
    addText(slide, ctx, tool[1], x + 16, y + 46, 260, 18, { size: 12, color: COLORS.muted });
  };
  data.toolsTop.forEach((tool, index) => {
    const x = 70 + index * 370;
    drawTool(tool, x, 184, COLORS.cyan);
    if (index < 2) addText(slide, ctx, "→", x + 316, 202, 34, 34, { size: 28, color: COLORS.blue, bold: true, align: "center" });
  });
  data.toolsBottom.forEach((tool, index) => {
    const x = 70 + index * 370;
    drawTool(tool, x, 330, index === 2 ? COLORS.amber : COLORS.green);
    if (index < 2) addText(slide, ctx, "+", x + 318, 348, 34, 34, { size: 28, color: COLORS.green, bold: true, align: "center" });
  });
  data.metrics.forEach((item, index) => metric(slide, ctx, item[0], item[1], 160 + index * 330, 500, 255, [COLORS.cyan, COLORS.green, COLORS.amber][index]));
  footer(slide, ctx, page);
}

function drawDialogue(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.green);
  title(slide, ctx, data.title, 78, 28);
  data.steps.forEach((step, index) => {
    const x = 92 + index * 370;
    addRect(slide, ctx, x, 188, 312, 300, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, 188, 312, 7, [COLORS.cyan, COLORS.green, COLORS.amber][index]);
    addText(slide, ctx, step[0], x + 22, 218, 258, 24, { size: 18, color: [COLORS.cyan, COLORS.green, COLORS.amber][index], bold: true });
    addText(slide, ctx, step[1], x + 24, 278, 252, 150, { size: 15, color: COLORS.ink });
  });
  addText(slide, ctx, data.caption, 156, 548, 920, 28, { size: 20, color: COLORS.ink, bold: true, align: "center" });
  footer(slide, ctx, page);
}

function drawBookingProof(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.green);
  title(slide, ctx, data.title, 78, 28);
  data.screenshots.forEach((item, index) => {
    const x = 44 + index * 412;
    const accent = [COLORS.cyan, COLORS.green, COLORS.amber][index];
    addRect(slide, ctx, x, 184, 364, 402, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, 184, 364, 6, accent);
    addText(slide, ctx, item[0], x + 18, 204, 312, 22, { size: 15, color: accent, bold: true });
    addRect(slide, ctx, x + 18, 236, 328, 276, COLORS.bg, ctx.line(COLORS.line, 1));
    addRaster(slide, item[1], x + 24, 242, 316, 264, { alt: item[0], name: `booking-proof-${index + 1}` });
    addText(slide, ctx, item[2], x + 22, 528, 320, 34, { size: 12.5, color: COLORS.ink, align: "center" });
  });
  addRect(slide, ctx, 160, 600, 960, 42, COLORS.card, ctx.line(COLORS.line, 1));
  addText(slide, ctx, data.caption, 186, 612, 908, 18, { size: 14, color: COLORS.muted, align: "center" });
  footer(slide, ctx, page);
}

function drawTimeline(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.amber);
  title(slide, ctx, data.title, 78, 28);
  rule(slide, ctx, 140, 335, 960, COLORS.line, 3);
  data.rows.forEach((row, index) => {
    const x = 118 + index * 186;
    const y = index % 2 ? 380 : 200;
    const accent = index >= 4 ? COLORS.green : COLORS.cyan;
    addRect(slide, ctx, x, 327, 18, 18, accent);
    addRect(slide, ctx, x - 32, y, 160, 124, COLORS.card, ctx.line(COLORS.line, 1));
    addText(slide, ctx, row[0], x - 14, y + 14, 118, 20, { size: 16, color: accent, bold: true });
    addText(slide, ctx, row[1], x - 14, y + 42, 128, 48, { size: 9.5, color: COLORS.ink });
    addText(slide, ctx, row[2], x - 14, y + 96, 118, 14, { size: 9.5, color: COLORS.muted });
  });
  footer(slide, ctx, page);
}

function drawThreeLayer(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.green);
  title(slide, ctx, data.title, 78, 27);
  data.columns.forEach((col, index) => {
    const x = 86 + index * 374;
    addRect(slide, ctx, x, 198, 310, 270, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, 198, 6, 270, col[3]);
    addText(slide, ctx, col[0], x + 26, 230, 240, 28, { size: 24, color: col[3], bold: true });
    bulletList(slide, ctx, col[1], x + 28, 292, 250, { accent: col[3], gap: 42, size: 14 });
    chip(slide, ctx, col[2], x + 68, 414, 170, col[3]);
  });
  addRect(slide, ctx, 128, 520, 1010, 56, COLORS.card, ctx.line(COLORS.line, 1));
  addText(slide, ctx, data.quote, 154, 537, 960, 22, { size: 16, color: COLORS.ink, bold: true, align: "center" });
  footer(slide, ctx, page);
}

function drawSummary(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.green);
  title(slide, ctx, data.title, 78, 28);
  drawTable(slide, ctx, data.rows, 72, 178, 680, 58, ["AI 能力", "OPC 实现"], [260, 420], { cellSize: 15, headerSize: 15 });
  data.metrics.forEach((item, index) => metric(slide, ctx, item[1], item[0], 840, 220 + index * 150, 270, index ? COLORS.amber : COLORS.green));
  addText(slide, ctx, data.quote, 118, 570, 1000, 28, { size: 17, color: COLORS.ink, bold: true, align: "center" });
  footer(slide, ctx, page);
}

function drawThanks(slide, ctx, data, page) {
  background(slide, ctx);
  kicker(slide, ctx, data.kicker, COLORS.amber);
  title(slide, ctx, data.title, 78, 29);
  data.cards.forEach((card, index) => {
    const x = 84 + index * 374;
    addRect(slide, ctx, x, 210, 330, 250, COLORS.card, ctx.line(COLORS.line, 1));
    addRect(slide, ctx, x, 210, 330, 7, card[2]);
    addText(slide, ctx, card[0], x + 26, 248, 278, 28, { size: 20, color: card[2], bold: true, align: "center" });
    String(card[1]).split("\n").forEach((line, lineIndex) => {
      addText(slide, ctx, line, x + 34, 312 + lineIndex * 34, 262, 20, { size: 14.5, color: COLORS.ink, align: "center" });
    });
  });
  footer(slide, ctx, page);
}

function drawEnding(slide, ctx) {
  background(slide, ctx, "chapter");
  addText(slide, ctx, "感谢各位评委聆听", 200, 214, 880, 64, { size: 52, color: COLORS.ink, bold: true, align: "center" });
  addText(slide, ctx, "欢迎提问与指导", 340, 310, 600, 36, { size: 28, color: COLORS.cyan, bold: true, align: "center" });
  addText(slide, ctx, "酒店/旅游业智能客服应用功能整合优化方案路演", 300, 390, 680, 26, { size: 17, color: COLORS.green, bold: true, align: "center" });
  addRaster(slide, SCHOOL_LOGO_DARK, 480, 430, 320, 81, { alt: "海南职业技术学院完整标识", name: "school-logo-ending" });
  addText(slide, ctx, "彬彬有礼团队：符秀晶、温媛、李秋慧、符志鹏", 340, 562, 600, 24, { size: 15, color: COLORS.muted, align: "center" });
  addText(slide, ctx, "2026.05", 540, 616, 200, 22, { size: 15, color: COLORS.faint, align: "center" });
}

export async function buildSlide(presentation, ctx, page) {
  const data = SLIDES[page - 1];
  const slide = presentation.slides.add();
  switch (data.type) {
    case "cover":
      drawCover(slide, ctx);
      break;
    case "compare":
      drawCompare(slide, ctx, data, page);
      break;
    case "toc":
      drawToc(slide, ctx, page);
      break;
    case "chapter":
      drawChapter(slide, ctx, data, page);
      break;
    case "pain":
      drawPain(slide, ctx, data, page);
      break;
    case "architecture":
      drawArchitecture(slide, ctx, data, page);
      break;
    case "knowledge":
      drawKnowledge(slide, ctx, data, page);
      break;
    case "decisions":
      drawDecisions(slide, ctx, data, page);
      break;
    case "splitPath":
      drawSplitPath(slide, ctx, data, page);
      break;
    case "workflow":
      drawWorkflow(slide, ctx, data, page);
      break;
    case "parameters":
      drawParameters(slide, ctx, data, page);
      break;
    case "guardrails":
      drawGuardrails(slide, ctx, data, page);
      break;
    case "accuracy":
      drawAccuracy(slide, ctx, data, page);
      break;
    case "cost":
      drawCost(slide, ctx, data, page);
      break;
    case "mcp":
      drawMcp(slide, ctx, data, page);
      break;
    case "dialogue":
      drawDialogue(slide, ctx, data, page);
      break;
    case "bookingProof":
      drawBookingProof(slide, ctx, data, page);
      break;
    case "timeline":
      drawTimeline(slide, ctx, data, page);
      break;
    case "threeLayer":
      drawThreeLayer(slide, ctx, data, page);
      break;
    case "summary":
      drawSummary(slide, ctx, data, page);
      break;
    case "thanks":
      drawThanks(slide, ctx, data, page);
      break;
    case "ending":
      drawEnding(slide, ctx);
      break;
    default:
      throw new Error(`Unsupported slide type: ${data.type}`);
  }
  return slide;
}
