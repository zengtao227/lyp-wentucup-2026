#!/usr/bin/env python3
"""
build_pptx.py — 从 Marp PDF 生成可用 PPTX 草稿

用法:
  python3 build_pptx.py dual      # 双模版
  python3 build_pptx.py chatflow  # Chatflow版
  python3 build_pptx.py all       # 两个都生成

依赖: python-pptx  pdf2image  Pillow  poppler(brew)
"""

import sys
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Emu
from pdf2image import convert_from_path

BASE = Path(__file__).parent

CONFIGS = {
    "dual": {
        "pdf":    BASE / "路演PPT-v2.pdf",
        "outdir": BASE / "pptx-export" / "dual-mode",
        "pptx":   BASE / "pptx-export" / "dual-mode" / "slides_dual_v3.pptx",
        "label":  "双模版",
    },
    "chatflow": {
        "pdf":    BASE / "路演PPT-v2-chatflow.pdf",
        "outdir": BASE / "pptx-export" / "chatflow",
        "pptx":   BASE / "pptx-export" / "chatflow" / "slides_chatflow_v3.pptx",
        "label":  "Chatflow版",
    },
}

SLIDE_W = Inches(13.33)   # 1920px @144dpi
SLIDE_H = Inches(7.5)     # 1080px @144dpi


def pdf_to_backgrounds(pdf_path: Path, bg_dir: Path, dpi: int = 150) -> list[Path]:
    bg_dir.mkdir(parents=True, exist_ok=True)
    print(f"  📄 提取背景图（{dpi} DPI）…")
    pages = convert_from_path(str(pdf_path), dpi=dpi)
    paths = []
    for i, page in enumerate(pages, 1):
        out = bg_dir / f"bg_{i:02d}.png"
        page.save(str(out), "PNG")
        paths.append(out)
    print(f"  ✅ 共 {len(paths)} 张背景图 → {bg_dir}")
    return paths


def build_pptx(bg_images: list[Path], pptx_path: Path) -> None:
    prs = Presentation()
    prs.slide_width  = SLIDE_W
    prs.slide_height = SLIDE_H
    blank = prs.slide_layouts[6]

    for i, bg in enumerate(bg_images, 1):
        slide = prs.slides.add_slide(blank)
        slide.shapes.add_picture(
            str(bg),
            Emu(0), Emu(0),
            prs.slide_width,
            prs.slide_height,
        )
        print(f"  幻灯片 {i:02d}/{len(bg_images)} ✓", end="\r")

    print()
    prs.save(str(pptx_path))
    print(f"  ✅ PPTX 已保存 → {pptx_path}")


def run(key: str) -> None:
    cfg = CONFIGS[key]
    print(f"\n{'='*50}")
    print(f"  生成{cfg['label']} PPTX")
    print(f"{'='*50}")

    if not cfg["pdf"].exists():
        print(f"  ❌ 找不到 PDF：{cfg['pdf']}")
        print("     请先运行：")
        pdf_name = cfg['pdf'].name.replace('.pdf', '.md')
        print(f"     npx @marp-team/marp-cli {pdf_name} --pdf --allow-local-files")
        return

    bg_dir = cfg["outdir"] / "backgrounds"
    # 如果背景图已存在且数量匹配则跳过重新提取（加 --force 强制重提取）
    existing = sorted(bg_dir.glob("bg_*.png"))
    if existing and "--force" not in sys.argv:
        print(f"  ⏩ 背景图已存在（{len(existing)} 张），跳过提取。加 --force 强制重提取")
        bg_images = existing
    else:
        bg_images = pdf_to_backgrounds(cfg["pdf"], bg_dir)

    build_pptx(bg_images, cfg["pptx"])


if __name__ == "__main__":
    targets = sys.argv[1:] if len(sys.argv) > 1 else []
    # 过滤掉 --force 标志
    keys = [t for t in targets if not t.startswith("--")]

    if not keys or keys[0] not in ("dual", "chatflow", "all"):
        print(__doc__)
        sys.exit(1)

    if keys[0] == "all":
        run("dual")
        run("chatflow")
    else:
        run(keys[0])
