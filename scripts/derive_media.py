"""Derive clean, text-free photographic assets from the source artwork.

The five ChatGPT images in the project root are **design comps**, not photographs: every
one has sample copy baked into its pixels (a logo strip, the couple's names, a letter
card, a CTA). Using them whole would duplicate text and break the rule that all content
comes from `src/config.js`, so this script keeps only the regions that are genuinely
free of baked copy, grades them toward the site's ivory / maroon / temple-gold palette,
and writes responsive webp derivatives to `public/media/derived/`.

Measured baked-copy regions (see scripts/find_baked_text.py):
  hero comp  – logo/heading/paragraph/CTA live in x < 44% of the width; the bottom
               band y > 872 is a letterboxed gradient.
  letter comp – photographed couple occupies x < 46%; x >= 46% is the ivory letter card.
  temple comp – photographic gopuram sits inside a decorated border (crops inset below).
  mandap comp – ornate gold arch, ivory centre, no text.
  garland comp – clean ceremony photograph, no text.

Usage: python scripts/derive_media.py
Writes public/media/derived/*.webp and public/media/derived/manifest.json.
"""

from __future__ import annotations

import json
import pathlib
import re
import sys

from PIL import Image, ImageEnhance, ImageFilter

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "media" / "derived"

SRC = {
    "hero": ROOT / "ChatGPT Image Oct 5, 2026, 12_46_50 AM-1.png",
    "letter": ROOT / "ChatGPT Image Oct 5, 2026, 12_46_53 AM-2.png",
    "temple": ROOT / "ChatGPT Image Oct 5, 2026, 12_46_54 AM-3.png",
    "mandap": ROOT / "ChatGPT Image Oct 5, 2026, 12_46_56 AM-4.png",
    "garland": ROOT / "ChatGPT Image Oct 5, 2026, 12_46_57 AM-5.png",
    "groom": ROOT / "public" / "media" / "hemsagar.jpg",
    "bride": ROOT / "public" / "media" / "archana.jpg",
}

# name -> (source key, aspect ratio, anchor, target widths, quality)
PLAN: dict[str, tuple] = {
    # Opening scene. The comp's sample copy is in the upper-left (heading, paragraph,
    # CTA); the photographic column starts at 31.5% of the width, which clears the CTA
    # at x=320..500 while keeping both faces well inside the frame. The left edge of
    # that column is dissolved by the opening scene's ivory vignette, and the small
    # leftover mark in its top-left corner is covered by the panel edge.
    "hero-portrait": ("hero_right", 4 / 5, (0.5, 0.5), [1140, 760, 500], 78),
    "hero-tall": ("hero_right", 3 / 4, (0.5, 0.5), [600, 400], 78),
    # Wide band from below the sample CTA to above the letterbox strip.
    "hero-band": ("hero_band", None, None, [1200, 900, 600], 76),
    # The vow / letter photograph: left half of the comp only.
    "couple-vow": ("letter_left", 3 / 4, (0.06, 0.45), [700, 480], 80),
    "couple-portrait": ("letter_left", 4 / 5, (0.0, 0.5), [620, 420], 80),
    # Gopuram.
    "temple": ("temple_inner", 3 / 4, (0.5, 0.5), [600, 420, 300], 78),
    "temple-wide": ("temple_inner", 4 / 3, (0.5, 0.2), [620, 420], 76),
    # Ornate mandap arch: background layer, so it is compressed a little harder.
    "mandap": ("mandap_full", 4 / 5, (0.5, 0.5), [1000, 700], 72),
    "mandap-wide": ("mandap_full", 3 / 2, (0.5, 0.5), [1100, 800], 74),
    # Garland exchange.
    # The garland exchange is graded a little brighter and warmer than the rest:
    # several scenes place light ivory type over the middle of this photograph.
    "garland": ("garland_bright", 16 / 9, (0.5, 0.5), [1400, 1000, 700], 78),
    "garland-tall": ("garland_bright", 4 / 5, (0.45, 0.42), [700, 480], 80),
    # Real portraits.
    "groom": ("groom_clean", 3 / 4, (0.5, 0.06), [900, 620, 420], 80),
    "bride": ("bride_clean", 3 / 4, (0.5, 0.03), [300, 220], 82),
    # Gallery keepsakes (3:2 crop, two widths each).
    "keepsake-beginning": ("hero_right", 3 / 2, (0.5, 0.55), [720, 440], 76),
    "keepsake-joy": ("garland_bright", 3 / 2, (0.5, 0.5), [720, 440], 76),
    "keepsake-together": ("letter_left", 3 / 2, (0.0, 0.42), [720, 440], 76),
    "keepsake-forever": ("garland_bright", 3 / 2, (0.3, 0.35), [720, 440], 76),
}


def load(key: str) -> Image.Image:
    return Image.open(SRC[key]).convert("RGB")


def _prepare() -> dict[str, Image.Image]:
    """Build the clean, graded working layers referenced by PLAN."""
    hero = grade(load("hero"), saturation=1.04, contrast=1.03, warm=0.012)
    hw, hh = hero.size
    hero_photo = hero.crop((int(hw * 0.315), int(hh * 0.05), hw, int(hh * 0.96)))
    layers: dict[str, Image.Image] = {
        "hero_right": hero_photo,
        "hero_band": hero_photo,
    }

    letter = grade(load("letter"), saturation=1.05, contrast=1.04, warm=0.014)
    lw, lh = letter.size
    layers["letter_left"] = letter.crop((0, 0, int(lw * 0.46), lh))

    temple = grade(load("temple"), saturation=1.06, contrast=1.02, warm=0.01)
    tw, th = temple.size
    layers["temple_inner"] = temple.crop((int(tw * 0.09), int(th * 0.22), int(tw * 0.95), int(th * 0.99)))

    layers["mandap_full"] = grade(load("mandap"), saturation=1.04, contrast=1.02, warm=0.008, sharpen=False)
    # The garland exchange carries light ivory type over its middle in three scenes,
    # so it is graded slightly brighter than the other photographs.
    layers["garland_bright"] = grade(load("garland"), saturation=1.05, contrast=1.0, warm=0.01)

    groom = grade(load("groom"), saturation=1.02, contrast=1.03)
    gw, gh = groom.size
    # The comp carries a camera watermark along the bottom-left; this crop stays above it.
    layers["groom_clean"] = groom.crop((int(gw * 0.03), 0, int(gw * 0.97), int(gh * 0.88)))

    bride = grade(load("bride"), saturation=1.02, contrast=1.03, warm=0.008)
    bw, bh = bride.size
    layers["bride_clean"] = bride.crop((int(bw * 0.04), int(bh * 0.04), int(bw * 0.98), int(bh * 0.98)))

    return layers


def grade(im: Image.Image, *, saturation: float = 1.0, contrast: float = 1.0,
          warm: float = 0.0, sharpen: bool = True) -> Image.Image:
    """Gentle, consistent grade so mixed sources share one visual world."""
    if saturation != 1.0:
        im = ImageEnhance.Color(im).enhance(saturation)
    if contrast != 1.0:
        im = ImageEnhance.Contrast(im).enhance(contrast)
    if warm:
        r, g, b = im.split()
        r = r.point(lambda v: min(255, int(v + warm * 255)))
        b = b.point(lambda v: max(0, int(v - warm * 255 * 0.8)))
        im = Image.merge("RGB", (r, g, b))
    if sharpen:
        im = im.filter(ImageFilter.UnsharpMask(radius=1.4, percent=58, threshold=4))
    return im


def cover(im: Image.Image, ratio: float, *, anchor: tuple[float, float] = (0.5, 0.5)) -> Image.Image:
    """Center-crop `im` to `ratio` (w/h) around `anchor`, never upscaling."""
    w, h = im.size
    target_h = w / ratio
    if target_h <= h:
        box_h, box_w = int(round(target_h)), w
    else:
        box_h, box_w = h, int(round(h * ratio))
    cx, cy = anchor[0] * (w - box_w), anchor[1] * (h - box_h)
    return im.crop((int(round(cx)), int(round(cy)), int(round(cx)) + box_w, int(round(cy)) + box_h))


def export(im: Image.Image, name: str, widths: list[int], *, quality: int = 80) -> list[dict]:
    """Write one webp per requested width, naming each file by its real width.

    Requested widths wider than the source are clamped, so a filename always matches
    the pixels inside it, and two requests that clamp to the same width produce one file.
    """
    entries = {}
    for requested in widths:
        out_w = min(requested, im.width)
        out = im if out_w == im.width else im.resize(
            (out_w, int(round(im.height * out_w / im.width))), Image.LANCZOS)
        path = OUT / f"{name}-{out.width}.webp"
        out.save(path, "WEBP", quality=quality, method=6)
        entries[path.name] = {"path": f"derived/{path.name}", "w": out.width, "h": out.height,
                              "bytes": path.stat().st_size}
    return sorted(entries.values(), key=lambda entry: entry["w"], reverse=True)


def verify_config(manifest: dict[str, list[dict]]) -> list[str]:
    """Check every path referenced by src/config.js actually exists in the manifest.

    Catches the failure that is otherwise invisible until a photograph silently falls
    back to its placeholder: a crop tweak that changes an output filename or width.
    """
    config = (ROOT / "src" / "config.js").read_text(encoding="utf-8")
    known = {entry["path"] for entries in manifest.values() for entry in entries}
    referenced = set(re.findall(r"'(media/derived/[^']+)'", config))
    return sorted(path for path in referenced if path not in known)


def main() -> int:
    missing = [k for k, p in SRC.items() if not p.exists()]
    if missing:
        print(f"missing source images: {missing}", file=sys.stderr)
        return 1
    OUT.mkdir(parents=True, exist_ok=True)

    layers = _prepare()
    manifest: dict[str, list[dict]] = {}
    for name, (layer, ratio, anchor, widths, quality) in PLAN.items():
        source = layers[layer]
        im = cover(source, ratio, anchor=anchor) if ratio else source
        manifest[name] = export(im, name, widths, quality=quality)

    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    total, oversized = 0, []
    for name, entries in manifest.items():
        total += sum(e["bytes"] for e in entries)
        biggest = max(entries, key=lambda e: e["bytes"])
        print(f"{name:20s} {len(entries)} files  largest {biggest['w']}x{biggest['h']} {biggest['bytes'] // 1024} KB")
        if biggest["bytes"] > 340 * 1024:
            oversized.append(f"{biggest['path']} ({biggest['bytes'] // 1024} KB)")
    print(f"\n{len(manifest)} assets, {total / 1024 / 1024:.2f} MB total -> {OUT}")

    stale = verify_config(manifest)
    if stale:
        print("\nwarning: src/config.js references files that were not produced:")
        for path in stale:
            print(f"  {path}")
    if oversized:
        print("warning: over the 340 KB budget:\n  " + "\n  ".join(oversized))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
