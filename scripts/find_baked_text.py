"""Locate the baked sample text in the hero comp so the layout can hide it deterministically.

The hero mockup is a design comp: it carries a logo, a heading, a paragraph and a button
in its upper-left area. Rather than guess, this scans for the very light (near-white /
gold-highlight) and very dark (deep-green button) pixel clusters that the sample copy is
made of, and reports the bounding boxes.
"""
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
im = Image.open(ROOT / "ChatGPT Image Oct 5, 2026, 12_46_50 AM-1.png").convert("RGB")
W, H = im.size
px = im.load()


def scan(pred, label):
    xs, ys = [], []
    for y in range(H):
        for x in range(W):
            if pred(*px[x, y]):
                xs.append(x)
                ys.append(y)
    if not xs:
        print(f"{label}: none")
        return
    print(f"{label}: x {min(xs)}..{max(xs)}  y {min(ys)}..{max(ys)}  count={len(xs)}")


# Sample body copy is a light cream serif on a mid-tone backdrop.
scan(lambda r, g, b: r > 232 and g > 224 and b > 205 and abs(r - b) < 60, "light copy")
# The comp's CTA is a solid deep-green pill.
scan(lambda r, g, b: r < 60 and g < 85 and b < 70, "deep green (button/navbar)")
# The comp heading is saturated temple gold.
scan(lambda r, g, b: 150 < r < 215 and 105 < g < 175 and b < 120, "gold heading")

print("\ncolumn profile of light-copy pixels (x, count):")
for x in range(0, 900, 25):
    c = sum(1 for y in range(H) if (lambda p: p[0] > 232 and p[1] > 224 and p[2] > 205 and abs(p[0] - p[2]) < 60)(px[x, y]))
    print(f"  x={x:4d} {c}")
