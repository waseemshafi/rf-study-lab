"""Generate PWA/app icons (brand gradient + WiFi/signal motif) with Pillow."""
from PIL import Image, ImageDraw
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "icons")
os.makedirs(OUT, exist_ok=True)

TOP = (61, 139, 230)     # blue  #3d8be6
BOT = (28, 176, 150)     # teal  #1cb096

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def make(size, name, pad=0.0):
    # supersample for smooth edges
    S = size * 4
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    px = img.load()
    for y in range(S):
        col = lerp(TOP, BOT, y / (S - 1)) + (255,)
        for x in range(S):
            px[x, y] = col
    d = ImageDraw.Draw(img)
    cx = S / 2
    dot_y = S * 0.68
    white = (255, 255, 255, 255)
    # WiFi-style signal arcs above the dot
    for r in (0.16, 0.28, 0.40):
        R = S * r
        bbox = [cx - R, dot_y - R, cx + R, dot_y + R]
        d.arc(bbox, start=212, end=328, fill=white, width=int(S * 0.045))
    # source dot
    dr = S * 0.05
    d.ellipse([cx - dr, dot_y - dr, cx + dr, dot_y + dr], fill=white)
    img = img.resize((size, size), Image.LANCZOS)
    img.save(os.path.join(OUT, name))
    print("wrote", name, size)

for s, n in [(512, "icon-512.png"), (192, "icon-192.png"),
             (180, "apple-touch-icon.png"), (32, "favicon-32.png"),
             (512, "icon-maskable-512.png")]:
    make(s, n)
print("done")
