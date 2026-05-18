/**
 * build_slides.mjs — MD → PDF + PPTX
 *
 * 用法:
 *   node build_slides.mjs dual      # 双模版
 *   node build_slides.mjs chatflow  # Chatflow版
 *   node build_slides.mjs all       # 两个都生成
 *
 * 依赖: npm install puppeteer
 *       pip install python-pptx Pillow pdf2image
 *       系统需安装 poppler (brew install poppler)
 */

import { execSync } from 'child_process';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';

const __dir = dirname(fileURLToPath(import.meta.url));

const CONFIGS = {
  dual: {
    md:    '路演PPT-v3.0.md',
    html:  '路演PPT-v3.0.html',
    pdf:   '路演PPT-v3.0.pdf',
    pptx:  '路演PPT-v3.0.pptx',
    label: '双模版',
  },
  chatflow: {
    md:    '路演PPT-v3.0-chatflow.md',
    html:  '路演PPT-v3.0-chatflow.html',
    pdf:   '路演PPT-v3.0-chatflow.pdf',
    pptx:  '路演PPT-v3.0-chatflow.pptx',
    label: 'Chatflow版',
  },
};

// ── Step 1: HTML → PDF（decktape 截图模式）─────────────────────
function generatePDF(htmlPath, pdfPath) {
  // 注入 CSS 隐藏 Marp 导航栏，写入 /tmp（纯 ASCII 路径）避免 file:// 编码问题
  const html = readFileSync(htmlPath, 'utf8');
  const modified = html.replace(
    '</head>',
    '<style>.bespoke-marp-osc{display:none!important}</style></head>'
  );
  const tmpHtml = `/tmp/lyp_export_${Date.now()}.html`;
  writeFileSync(tmpHtml, modified, 'utf8');

  try {
    execSync(
      `npx decktape generic "file://${tmpHtml}" "${pdfPath}" -s 1920x1080`,
      { cwd: __dir, stdio: 'inherit' }
    );
  } finally {
    try { unlinkSync(tmpHtml); } catch {}
  }
}

// ── Step 2: PDF → PPTX（Python）────────────────────────────────
function buildPPTX(pdfPath, pptxPath) {
  const script = resolve(__dir, 'build_outputs.py');
  execSync(`python3 "${script}" "${pdfPath}" "${pptxPath}"`, { stdio: 'inherit' });
}

// ── 主流程 ───────────────────────────────────────────────────────
async function run(key) {
  const cfg = CONFIGS[key];
  console.log(`\n${'='.repeat(52)}\n  ${cfg.label}\n${'='.repeat(52)}`);

  // Step 0: MD → HTML
  console.log('  📝 生成 HTML…');
  execSync(
    `npx @marp-team/marp-cli "${cfg.md}" --html --output "${cfg.html}"`,
    { cwd: __dir, stdio: 'pipe' }
  );

  // Step 1: HTML → PDF (decktape)
  console.log('  📸 decktape 截图生成 PDF…');
  generatePDF(resolve(__dir, cfg.html), resolve(__dir, cfg.pdf));
  console.log(`  ✅ PDF → ${cfg.pdf}`);

  // Step 2: PDF → PPTX
  console.log('  📊 生成 PPTX…');
  buildPPTX(resolve(__dir, cfg.pdf), resolve(__dir, cfg.pptx));

  console.log(`\n  ✅ 完成: ${cfg.pdf}  /  ${cfg.pptx}`);
}

const key = process.argv[2];
if (!key || !['dual', 'chatflow', 'all'].includes(key)) {
  console.log('用法: node build_slides.mjs [dual|chatflow|all]');
  process.exit(1);
}

if (key === 'all') { await run('dual'); await run('chatflow'); }
else               { await run(key); }
