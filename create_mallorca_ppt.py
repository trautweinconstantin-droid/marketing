from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt
import pptx.oxml.ns as nsmap
from lxml import etree

# Color palette - Mediterranean inspired
DEEP_BLUE = RGBColor(0x0A, 0x3D, 0x6B)      # deep ocean blue
MED_BLUE  = RGBColor(0x1A, 0x6F, 0xA8)      # mediterranean blue
LIGHT_BLUE= RGBColor(0xA8, 0xD8, 0xEA)      # sky/water light blue
SAND      = RGBColor(0xF5, 0xE6, 0xC8)      # sand color
ORANGE    = RGBColor(0xE8, 0x8A, 0x2E)      # warm orange accent
GREEN     = RGBColor(0x2E, 0x7D, 0x4F)      # olive green
RED_WARN  = RGBColor(0xC0, 0x39, 0x2B)      # warning red
WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
DARK_GRAY = RGBColor(0x2C, 0x3E, 0x50)
LIGHT_GRAY= RGBColor(0xEC, 0xF0, 0xF1)

prs = Presentation()
prs.slide_width  = Inches(13.33)
prs.slide_height = Inches(7.5)

BLANK = prs.slide_layouts[6]  # completely blank

def add_rect(slide, l, t, w, h, fill_color=None, line_color=None, line_width=None):
    shape = slide.shapes.add_shape(1, Inches(l), Inches(t), Inches(w), Inches(h))
    if fill_color:
        shape.fill.solid()
        shape.fill.fore_color.rgb = fill_color
    else:
        shape.fill.background()
    if line_color:
        shape.line.color.rgb = line_color
        if line_width:
            shape.line.width = line_width
    else:
        shape.line.fill.background()
    return shape

def add_text(slide, text, l, t, w, h, font_size=18, bold=False, color=WHITE,
             align=PP_ALIGN.LEFT, italic=False, wrap=True):
    txBox = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    txBox.word_wrap = wrap
    tf = txBox.text_frame
    tf.word_wrap = wrap
    p = tf.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.italic = italic
    run.font.color.rgb = color
    run.font.name = "Calibri"
    return txBox

def add_multiline(slide, lines, l, t, w, h, font_size=16, bold_first=False,
                  color=WHITE, line_spacing=None, bullet=False):
    txBox = slide.shapes.add_textbox(Inches(l), Inches(t), Inches(w), Inches(h))
    txBox.word_wrap = True
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.alignment = PP_ALIGN.LEFT
        run = p.add_run()
        prefix = "• " if bullet and i > 0 else ("• " if bullet and i == 0 else "")
        run.text = prefix + line
        run.font.size = Pt(font_size)
        run.font.bold = (bold_first and i == 0)
        run.font.color.rgb = color
        run.font.name = "Calibri"
    return txBox

# ─── helper: decorative wave bar ─────────────────────────────────────────────
def wave_bar(slide, y=6.9, color=MED_BLUE, alpha_bar=True):
    add_rect(slide, 0, y, 13.33, 0.6, fill_color=color)

# ─── SLIDE 1: TITLE ──────────────────────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)

# full gradient-like background: deep blue top, lighter at bottom
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=DEEP_BLUE)
add_rect(slide, 0, 4.5, 13.33, 3.0, fill_color=MED_BLUE)
add_rect(slide, 0, 6.3, 13.33, 1.2, fill_color=LIGHT_BLUE)

# decorative circles
add_rect(slide, -1.0, -1.0, 4, 4, fill_color=MED_BLUE)   # top-left circle feel
add_rect(slide, 10.5, 5.5, 4, 4, fill_color=DEEP_BLUE)

# orange accent line
add_rect(slide, 1.5, 3.15, 3.5, 0.08, fill_color=ORANGE)

# title
add_text(slide, "MALLORCA", 1.5, 0.8, 10, 1.5, font_size=60, bold=True,
         color=WHITE, align=PP_ALIGN.LEFT)
add_text(slide, "Tourismus als Raumprägendes Phänomen",
         1.5, 2.2, 9, 0.9, font_size=26, bold=False, color=LIGHT_BLUE, align=PP_ALIGN.LEFT)
add_text(slide, "Ein geographisches Fallbeispiel",
         1.5, 3.3, 8, 0.6, font_size=18, bold=False, color=SAND, align=PP_ALIGN.LEFT)

# bottom info
add_text(slide, "Erdkunde · Klasse · 2026",
         1.5, 6.6, 6, 0.5, font_size=13, color=DEEP_BLUE, align=PP_ALIGN.LEFT)

# palm tree icon replacement (text emoji-style)
add_text(slide, "🌊", 11.0, 0.3, 1.8, 1.5, font_size=60, color=WHITE, align=PP_ALIGN.CENTER)
add_text(slide, "🏖", 11.2, 1.8, 1.5, 1.5, font_size=50, color=WHITE, align=PP_ALIGN.CENTER)

# ─── SLIDE 2: GLIEDERUNG ─────────────────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=LIGHT_GRAY)
add_rect(slide, 0, 0, 13.33, 1.4, fill_color=DEEP_BLUE)
add_rect(slide, 0, 1.4, 0.12, 6.1, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=MED_BLUE)

add_text(slide, "GLIEDERUNG", 0.5, 0.25, 8, 0.9, font_size=32, bold=True, color=WHITE)

items = [
    ("01", "Definition & Geographische Einordnung", MED_BLUE),
    ("02", "Entwicklung des Tourismus auf Mallorca", MED_BLUE),
    ("03", "Ursachen & Potenziale des Tourismus", ORANGE),
    ("04", "Auswirkungen des Tourismus", RED_WARN),
    ("05", "Lösungsansätze", GREEN),
    ("06", "Quellen & Handout", DARK_GRAY),
]

for i, (num, title, col) in enumerate(items):
    y = 1.6 + i * 0.82
    add_rect(slide, 0.6, y, 0.7, 0.55, fill_color=col)
    add_text(slide, num, 0.62, y+0.02, 0.65, 0.5, font_size=16, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
    add_text(slide, title, 1.5, y+0.04, 10, 0.5, font_size=18, bold=False, color=DARK_GRAY)

# ─── SLIDE 3: DEFINITION TOURISMUS ──────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=WHITE)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=DEEP_BLUE)
add_rect(slide, 0, 1.5, 4.5, 6.0, fill_color=MED_BLUE)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=DEEP_BLUE)

add_text(slide, "01 | DEFINITION & GEOGRAPHISCHE EINORDNUNG",
         0.5, 0.3, 12, 0.9, font_size=24, bold=True, color=WHITE)

# Left panel - definition
add_text(slide, "Was ist Tourismus?", 0.3, 1.7, 4.0, 0.6, font_size=18, bold=True, color=SAND)
defn = [
    "Tourismus bezeichnet das vorübergehende",
    "Verlassen des gewohnten Lebensumfelds zu",
    "Erholungs-, Freizeit- oder Geschäftszwecken",
    "für mindestens eine Übernachtung.",
    "",
    "🔑 UNWTO-Definition:",
    "Reisen zu Orten außerhalb des üblichen",
    "Umfelds für weniger als ein Jahr."
]
add_multiline(slide, defn, 0.3, 2.3, 4.0, 4.0, font_size=13.5, color=WHITE)

# Right panel - geographic overview
add_text(slide, "🗺  Geographische Einordnung – Mallorca",
         4.9, 1.6, 8.0, 0.6, font_size=18, bold=True, color=DEEP_BLUE)

geo_data = [
    ("Lage", "Westliches Mittelmeer, Balearen-Archipel"),
    ("Koordinaten", "39°N / 3°O"),
    ("Fläche", "3.640 km² (größte Baleareninsel)"),
    ("Einwohner", "ca. 923.000 (2023)"),
    ("Hauptstadt", "Palma de Mallorca"),
    ("Zugehörigkeit", "Spanien, Autonome Gemeinschaft Balearen"),
    ("Küstenlinie", "ca. 555 km"),
    ("Höchster Punkt", "Puig Major (1.445 m)"),
]

for i, (label, val) in enumerate(geo_data):
    y = 2.3 + i * 0.52
    add_rect(slide, 4.9, y, 2.5, 0.45, fill_color=LIGHT_BLUE)
    add_text(slide, label, 5.0, y+0.04, 2.3, 0.38, font_size=12, bold=True, color=DEEP_BLUE)
    add_text(slide, val, 7.5, y+0.04, 5.5, 0.38, font_size=12, color=DARK_GRAY)

# ─── SLIDE 4: ENTWICKLUNG HISTORISCH ─────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=LIGHT_GRAY)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=DEEP_BLUE)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=MED_BLUE)

add_text(slide, "02 | ENTWICKLUNG DES TOURISMUS AUF MALLORCA",
         0.5, 0.3, 12, 0.9, font_size=24, bold=True, color=WHITE)
add_text(slide, "Von den Anfängen bis heute", 0.5, 1.0, 10, 0.4, font_size=15,
         color=LIGHT_BLUE, align=PP_ALIGN.LEFT)

# Timeline
timeline = [
    ("1950er", "Erste Touristen · Nur ~100.000 Besucher/Jahr · Kaum Infrastruktur",    SAND,      DARK_GRAY),
    ("1960er", "Massentourismus beginnt · Charter-Flüge · Hotelbau-Boom",              LIGHT_BLUE, DARK_GRAY),
    ("1970er", "Flughafen Palma stark ausgebaut · >3 Mio. Besucher/Jahr",              MED_BLUE,  WHITE),
    ("1980er", "Pauschalreise-Boom · Infrastruktur explodiert · Umweltprobleme",        MED_BLUE,  WHITE),
    ("1990er", "Qualitätstourismus angestrebt · EU-Beitritt Spaniens wirkt nach",      DEEP_BLUE, WHITE),
    ("2000er", "Billigflüge (Ryanair etc.) · >10 Mio. Besucher · Overtourism spürbar", DEEP_BLUE, WHITE),
    ("2023",   "~13,4 Mio. Ankünfte · Flughafen Palma: 31 Mio. Passagiere/Jahr",      RED_WARN,  WHITE),
]

for i, (year, desc, bg, fg) in enumerate(timeline):
    y = 1.75 + i * 0.72
    add_rect(slide, 0.3, y, 1.4, 0.6, fill_color=bg)
    add_text(slide, year, 0.32, y+0.08, 1.35, 0.45, font_size=13, bold=True,
             color=fg if bg != SAND else DARK_GRAY, align=PP_ALIGN.CENTER)
    add_rect(slide, 1.7, y+0.28, 11.0, 0.04, fill_color=ORANGE)
    add_text(slide, desc, 1.85, y+0.08, 11.0, 0.5, font_size=13, color=DARK_GRAY)

# ─── SLIDE 5: VERGLEICH DAMALS VS HEUTE ──────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=WHITE)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=DEEP_BLUE)
add_rect(slide, 0, 1.5, 6.5, 6.0, fill_color=SAND)
add_rect(slide, 6.5, 1.5, 6.83, 6.0, fill_color=MED_BLUE)
add_rect(slide, 6.47, 1.5, 0.06, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=DEEP_BLUE)

add_text(slide, "02 | MALLORCA DAMALS vs. HEUTE",
         0.5, 0.3, 12, 0.9, font_size=24, bold=True, color=WHITE)

add_text(slide, "DAMALS (1960er/70er)", 0.5, 1.6, 5.8, 0.6, font_size=18,
         bold=True, color=DARK_GRAY, align=PP_ALIGN.CENTER)
add_text(slide, "HEUTE (2020er)", 6.8, 1.6, 6.0, 0.6, font_size=18,
         bold=True, color=WHITE, align=PP_ALIGN.CENTER)

old = [
    "🏨  ~200 Hotels (einfach, klein)",
    "✈️  Flughafen: <1 Mio. Passagiere",
    "🛣  Kaum Straßennetz / ÖPNV",
    "💰  Sehr günstige Preise",
    "👥  ~100.000–500.000 Besucher/Jahr",
    "🐟  Hauptwirtschaft: Fischerei & Landwirtschaft",
    "🌿  Intakte Natur, kaum Bebauung der Küste",
]
new = [
    "🏨  >2.000 Hotels & Ferienwohnungen",
    "✈️  Flughafen Palma: ~31 Mio. Passagiere",
    "🛣  Autobahnnetz, S-Bahn, Touristenbusse",
    "💰  Stark gestiegene Preise (Wohnungsnot)",
    "👥  ~13,4 Mio. Besucher/Jahr (2023)",
    "💼  80 % BIP durch Tourismus",
    "⚠️  Overtourism, Umweltbelastung, Protest",
]

for i, (o, n) in enumerate(zip(old, new)):
    y = 2.35 + i * 0.59
    add_text(slide, o, 0.4, y, 6.0, 0.55, font_size=13, color=DARK_GRAY)
    add_text(slide, n, 6.7, y, 6.3, 0.55, font_size=13, color=WHITE)

# ─── SLIDE 6: POTENZIALE – ÜBERBLICK ─────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=LIGHT_GRAY)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=DEEP_BLUE)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=MED_BLUE)

add_text(slide, "03 | URSACHEN & POTENZIALE DES TOURISMUS",
         0.5, 0.3, 12, 0.9, font_size=24, bold=True, color=WHITE)
add_text(slide, "Warum hat sich Mallorca so touristisch entwickelt?",
         0.5, 1.0, 12, 0.4, font_size=15, color=LIGHT_BLUE)

# Three columns
cols = [
    (DEEP_BLUE,  "🌿",  "NATURRÄUMLICHE\nPOTENZIALE",
     ["Mediterranes Klima\n(300+ Sonnentage)", "Sandstrände (>80)", "Kristallklares Wasser",
      "Tramuntana-Gebirge\n(UNESCO-Welterbe)", "Vielfältige Fauna & Flora"]),
    (MED_BLUE,   "🏛",  "SOZIOKULTURELLE\nPOTENZIALE",
     ["Spanisch-balearische\nKultur & Geschichte", "Kulinarik & Gastronomie",
      "Feste & Traditionen\n(Fiestas)", "Relativer Sicherheit", "Gastfreundschaft"]),
    (ORANGE,     "💶",  "WIRTSCHAFTLICHE\nPOTENZIALE",
     ["Günstige Preise\n(bis 1990er)", "Gute Erreichbarkeit\nper Flugzeug",
      "Pauschalreisen\n(All-Inclusive)", "EU-Subventionen\nfür Infrastruktur",
      "Starke Hotellerie-\nIndustrie"]),
]

for ci, (col, icon, title, items) in enumerate(cols):
    x = 0.3 + ci * 4.33
    add_rect(slide, x, 1.7, 4.0, 5.0, fill_color=col)
    add_text(slide, icon, x+0.1, 1.8, 3.8, 0.7, font_size=28, align=PP_ALIGN.CENTER)
    add_text(slide, title, x+0.1, 2.4, 3.8, 0.9, font_size=14, bold=True,
             color=WHITE, align=PP_ALIGN.CENTER)
    add_rect(slide, x+0.3, 3.25, 3.4, 0.05, fill_color=WHITE)
    for ii, item in enumerate(items):
        add_text(slide, "• " + item, x+0.2, 3.35 + ii*0.64, 3.7, 0.6,
                 font_size=12, color=WHITE)

# ─── SLIDE 7: PREISVERGLEICH ──────────────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=WHITE)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=DEEP_BLUE)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=MED_BLUE)

add_text(slide, "03 | PREISE IM VERGLEICH – DAMALS vs. HEUTE",
         0.5, 0.3, 12, 0.9, font_size=24, bold=True, color=WHITE)

add_text(slide, "Mallorca war für Nordeuropäer extrem günstig – ein zentraler Anziehungsfaktor",
         0.5, 1.0, 12, 0.4, font_size=14, color=LIGHT_BLUE)

headers = ["Kategorie", "1960er/70er (real)", "Heute (2024)", "Veränderung"]
col_w = [3.2, 2.8, 2.8, 2.8]
x_pos = [0.3, 3.5, 6.3, 9.1]

for ci, h in enumerate(headers):
    add_rect(slide, x_pos[ci], 1.7, col_w[ci]-0.1, 0.55, fill_color=DEEP_BLUE)
    add_text(slide, h, x_pos[ci]+0.1, 1.73, col_w[ci]-0.2, 0.48,
             font_size=13, bold=True, color=WHITE, align=PP_ALIGN.CENTER)

rows = [
    ("Hotelübernachtung", "5–15 DM / Nacht", "80–250 €/Nacht", "▲ ~1.500 %"),
    ("Pauschalreise", "200–400 DM", "400–1.200 €", "▲ ~400 %"),
    ("Restaurantessen", "2–5 DM", "12–35 €", "▲ ~600 %"),
    ("Wohnungsmiete (lokal)", "50–150 DM/Monat", "1.000–2.500 €/Monat", "▲ Extreme Steigerung"),
    ("Flugticket (DE→PMI)", "300–600 DM", "30–250 € (Billigflug)", "▼ Deutlich günstiger"),
    ("Bier (lokal)", "0,50 DM", "3–6 €", "▲ ~800 %"),
]

for ri, row in enumerate(rows):
    bg = LIGHT_GRAY if ri % 2 == 0 else WHITE
    fg_last = RED_WARN if "▲" in row[3] else GREEN
    for ci, val in enumerate(row):
        add_rect(slide, x_pos[ci], 2.3 + ri*0.72, col_w[ci]-0.1, 0.65, fill_color=bg)
        fc = fg_last if ci == 3 else DARK_GRAY
        add_text(slide, val, x_pos[ci]+0.1, 2.33 + ri*0.72, col_w[ci]-0.2, 0.58,
                 font_size=12, color=fc, align=PP_ALIGN.CENTER)

add_text(slide,
         "💡 Hinweis: Während Übernachtungen & Mieten explodiert sind, wurden Flüge durch Billiganbieter günstiger → mehr Touristen",
         0.3, 6.65, 12.7, 0.4, font_size=11, color=DARK_GRAY)

# ─── SLIDE 8: AUSWIRKUNGEN ÜBERBLICK ─────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=LIGHT_GRAY)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=RED_WARN)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=RED_WARN)

add_text(slide, "04 | AUSWIRKUNGEN DES TOURISMUS",
         0.5, 0.3, 12, 0.9, font_size=24, bold=True, color=WHITE)
add_text(slide, "Aus den Potenzialen entstehen massive Folgeprobleme",
         0.5, 1.0, 12, 0.4, font_size=15, color=SAND)

sectors = [
    (GREEN,    "🌿 NATURRÄUMLICH",
     ["Wasserknappheit\n(Grundwasser überbeansprucht)", "Meeresverschmutzung\n(Müll, Abwässer)",
      "Abholzung & Flächenversiegelung", "Lärm- & Lichtverschmutzung",
      "Schädigung von\nPosidonia-Seegräsern"]),
    (MED_BLUE, "💼 WIRTSCHAFTLICH",
     ["Monostruktur (80 % BIP\ndurch Tourismus)", "Abhängigkeit von\nSaisongeschäft",
      "Immobilienpreise\nexplodieren", "Verdrängen lokaler\nBetriebe",
      "Kapitalabfluss zu\ninternat. Konzernen"]),
    (ORANGE,   "👥 SOZIAL",
     ["Verdrängung der\nBevölkerung (Gentrifizierung)", "Verlust von Traditionen\n& Sprache (Mallorquín)",
      "Überlastung lokaler\nInfrastruktur", "Protests der\nEinheimischen",
      "Saisonale Arbeits-\nlosigkeit"]),
]

for ci, (col, title, items) in enumerate(sectors):
    x = 0.3 + ci * 4.33
    add_rect(slide, x, 1.7, 4.0, 0.65, fill_color=col)
    add_text(slide, title, x+0.1, 1.73, 3.8, 0.58, font_size=15, bold=True,
             color=WHITE, align=PP_ALIGN.CENTER)
    for ii, item in enumerate(items):
        yy = 2.42 + ii * 0.84
        add_rect(slide, x+0.1, yy, 3.8, 0.75, fill_color=WHITE)
        add_rect(slide, x+0.1, yy, 0.08, 0.75, fill_color=col)
        add_text(slide, item, x+0.3, yy+0.06, 3.5, 0.65, font_size=12, color=DARK_GRAY)

# ─── SLIDE 9: NATURRÄUMLICHE AUSWIRKUNGEN (DETAIL) ───────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=WHITE)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=GREEN)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=GREEN)

add_text(slide, "04a | NATURRÄUMLICHE AUSWIRKUNGEN – WASSER & MÜLL",
         0.5, 0.3, 12, 0.9, font_size=22, bold=True, color=WHITE)

# Water section
add_rect(slide, 0.3, 1.6, 6.0, 2.7, fill_color=LIGHT_BLUE)
add_text(slide, "💧 WASSERPROBLEMATIK", 0.5, 1.65, 5.7, 0.55, font_size=16, bold=True, color=DEEP_BLUE)
water_facts = [
    "Mallorca ist eine wasserarme Insel (Mittelmeerklima)",
    "Pro Tourist: ~300 L Wasserverbrauch/Tag (5× lokaler Bedarf)",
    "Grundwasser wird massiv überpumpt → Salzwasserintrusion",
    "Entsalzungsanlagen decken ~40 % des Bedarfs (energieintensiv)",
    "In Hochsaison: lokale Wasserknappheit für Bevölkerung",
]
for i, f in enumerate(water_facts):
    add_text(slide, "▸ " + f, 0.4, 2.25 + i*0.4, 5.8, 0.38, font_size=12, color=DARK_GRAY)

# Waste section
add_rect(slide, 0.3, 4.4, 6.0, 2.3, fill_color=RGBColor(0xFF, 0xF0, 0xE0))
add_text(slide, "🗑 ABFALL & ABHOLZUNG", 0.5, 4.45, 5.7, 0.55, font_size=16, bold=True, color=ORANGE)
waste_facts = [
    "Müllaufkommen steigt in Hochsaison um 300–400 %",
    "Strandbereiche täglich durch Maschinen gereinigt",
    "Abwässer belasten Posidonia-Seegraswiesen (Ökosystem!)",
    "Küstenentwicklung: Verlust von Dünen & Naturgebiet",
    "Pinien-Wälder durch Bebauung stark reduziert",
]
for i, f in enumerate(waste_facts):
    add_text(slide, "▸ " + f, 0.4, 5.0 + i*0.38, 5.8, 0.36, font_size=12, color=DARK_GRAY)

# Right: stats box
add_rect(slide, 6.6, 1.6, 6.4, 5.1, fill_color=DEEP_BLUE)
add_text(slide, "📊 ZAHLEN & FAKTEN", 6.8, 1.65, 6.0, 0.55, font_size=16, bold=True, color=SAND)
stats = [
    ("13,4 Mio.", "Touristen pro Jahr (2023)"),
    ("1,2 Mio.", "Einwohner (+ Saisonarbeiter)"),
    ("3.640 km²", "Fläche Mallorcas"),
    (">3.600 T", "Müll täglich in Hochsaison"),
    ("40 %", "Küste verbaut/erschlossen"),
    ("300 L", "Wasserverbrauch/Tourist/Tag"),
    ("90 %", "Strandparkplätze belegt\nim Sommer"),
]
for i, (val, label) in enumerate(stats):
    y = 2.3 + i * 0.63
    add_rect(slide, 6.7, y, 6.1, 0.56, fill_color=MED_BLUE)
    add_text(slide, val, 6.75, y+0.04, 1.6, 0.48, font_size=15, bold=True, color=ORANGE, align=PP_ALIGN.CENTER)
    add_text(slide, label, 8.4, y+0.08, 4.2, 0.4, font_size=12, color=WHITE)

# ─── SLIDE 10: WIRTSCHAFTLICHE AUSWIRKUNGEN ──────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=LIGHT_GRAY)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=MED_BLUE)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=MED_BLUE)

add_text(slide, "04b | WIRTSCHAFTLICHE AUSWIRKUNGEN – MONOSTRUKTUR",
         0.5, 0.3, 12, 0.9, font_size=22, bold=True, color=WHITE)

# Monostruktur explanation
add_rect(slide, 0.3, 1.6, 8.0, 1.2, fill_color=WHITE)
add_rect(slide, 0.3, 1.6, 0.1, 1.2, fill_color=RED_WARN)
add_text(slide, "⚠️  Was ist Monostruktur?",
         0.55, 1.65, 7.6, 0.45, font_size=15, bold=True, color=RED_WARN)
add_text(slide, "Wenn eine Wirtschaft fast vollständig von einem einzigen Sektor (hier: Tourismus) abhängt, entsteht eine extrem verletzliche Monostruktur.",
         0.55, 2.1, 7.6, 0.6, font_size=13, color=DARK_GRAY)

# GDP chart (bar-style)
add_text(slide, "BIP-Anteil der Wirtschaftssektoren auf Mallorca:",
         0.3, 2.95, 8, 0.4, font_size=14, bold=True, color=DEEP_BLUE)

sectors_econ = [
    ("Tourismus & Dienstleistungen", 0.80, MED_BLUE),
    ("Handel & Logistik",            0.09, DEEP_BLUE),
    ("Bauwirtschaft",                0.05, ORANGE),
    ("Landwirtschaft",               0.03, GREEN),
    ("Industrie",                    0.03, DARK_GRAY),
]
bar_max_w = 7.5
for i, (name, pct, col) in enumerate(sectors_econ):
    y = 3.4 + i * 0.58
    add_text(slide, name, 0.3, y, 3.0, 0.5, font_size=12, color=DARK_GRAY)
    add_rect(slide, 3.4, y+0.08, bar_max_w * pct, 0.35, fill_color=col)
    add_text(slide, f"{int(pct*100)} %", 3.4 + bar_max_w * pct + 0.1, y+0.08,
             0.8, 0.35, font_size=12, bold=True, color=DARK_GRAY)

# Right: Konsequenzen
add_rect(slide, 9.1, 1.6, 3.9, 5.1, fill_color=RED_WARN)
add_text(slide, "KONSEQUENZEN", 9.2, 1.65, 3.7, 0.5, font_size=14, bold=True,
         color=WHITE, align=PP_ALIGN.CENTER)
konseq = [
    "COVID-19 (2020): Tourismuseinbruch\n→ 80 % Wirtschaftsverlust",
    "Immobilienspekulation:\nEinheimische verdrängt",
    "Saisonale Arbeitslosigkeit\nim Winter (20–30 %)",
    "Kaum alternative Branchen\nbei Krisenzeiten",
    "Internationale Konzerne\nschöpfen Gewinne ab",
    "Forderung: Touristen\n'loswerden' → diversifizieren",
]
for i, k in enumerate(konseq):
    add_text(slide, "• " + k, 9.2, 2.2 + i*0.72, 3.6, 0.65, font_size=11, color=WHITE)

# ─── SLIDE 11: SOZIALE AUSWIRKUNGEN ──────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=WHITE)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=ORANGE)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=MED_BLUE)
wave_bar(slide, y=6.85, color=ORANGE)

add_text(slide, "04c | SOZIALE AUSWIRKUNGEN – SPRACHE & TRADITIONEN",
         0.5, 0.3, 12, 0.9, font_size=22, bold=True, color=WHITE)

# Language threat
add_rect(slide, 0.3, 1.6, 5.9, 3.5, fill_color=LIGHT_GRAY)
add_text(slide, "🗣 SPRACHE IN GEFAHR: MALLORQUÍN", 0.4, 1.65, 5.7, 0.55,
         font_size=15, bold=True, color=DEEP_BLUE)
lang = [
    "Mallorquín = balearischer Dialekt des Katalanischen",
    "Offizielle Sprachen: Spanisch & Katalanisch",
    "Durch Massentourismus: Englisch & Deutsch dominant",
    "Jüngere Generation wechselt zu Spanisch/Englisch",
    "Gastronomie, Werbung, Schilder: mehrheitlich Spanisch",
    "Risiko: Sprach- und Identitätsverlust der Mallorquiner",
    "Gegenmaßnahme: Sprachgesetze der Balearenregierung",
]
for i, l in enumerate(lang):
    add_text(slide, "▸ " + l, 0.4, 2.25 + i*0.38, 5.7, 0.35, font_size=12, color=DARK_GRAY)

# Traditions
add_rect(slide, 0.3, 5.2, 5.9, 1.55, fill_color=LIGHT_GRAY)
add_text(slide, "🎭 TRADITIONEN UNTER DRUCK", 0.4, 5.25, 5.7, 0.5,
         font_size=15, bold=True, color=ORANGE)
add_text(slide,
         "Authentische Feste folklorisiert · Lokale Märkte durch Souvenir-Shops ersetzt ·\n"
         "Traditionelle Berufe (Fischer, Olivenbauern) nicht mehr rentabel · Kultur als 'Tourismusprodukt'",
         0.4, 5.75, 5.7, 0.9, font_size=12, color=DARK_GRAY)

# Protest box
add_rect(slide, 6.5, 1.6, 6.5, 5.15, fill_color=DEEP_BLUE)
add_text(slide, "😡 PROTEST DER BEVÖLKERUNG", 6.6, 1.65, 6.3, 0.55,
         font_size=15, bold=True, color=WHITE, align=PP_ALIGN.CENTER)
add_rect(slide, 6.7, 2.25, 6.1, 0.05, fill_color=ORANGE)
protests = [
    ("2024", "Großdemo Palma:\n~50.000 Teilnehmer\n'Mallorca kein Ausverkauf!'"),
    ("2023", "Proteste gegen Airbnb:\nMietpreise für Locals\nunbezahlbar"),
    ("Dauer.", "Aufkleber & Graffiti:\n'Tourists go home'\n& 'Touristenschrott'"),
    ("2022+", "Forderungen nach\nTourismusobergrenze\n& Einreisesteuern"),
]
for i, (year, text) in enumerate(protests):
    yy = 2.4 + i*1.12
    add_rect(slide, 6.7, yy, 1.0, 0.9, fill_color=RED_WARN)
    add_text(slide, year, 6.72, yy+0.15, 0.96, 0.6, font_size=12, bold=True,
             color=WHITE, align=PP_ALIGN.CENTER)
    add_text(slide, text, 7.8, yy+0.04, 5.0, 0.84, font_size=12, color=WHITE)

# ─── SLIDE 12: LÖSUNGSANSÄTZE ─────────────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=LIGHT_GRAY)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=GREEN)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=GREEN)

add_text(slide, "05 | LÖSUNGSANSÄTZE – NACHHALTIGER TOURISMUS",
         0.5, 0.3, 12, 0.9, font_size=24, bold=True, color=WHITE)
add_text(slide, "Wie können die Auswirkungen eingedämmt werden?",
         0.5, 1.0, 12, 0.4, font_size=15, color=SAND)

solutions = [
    (DEEP_BLUE, "💶 MALLORCA-STEUER\n(Tourismussteuer)",
     ["Eingeführt 2016, angehoben 2024\n(bis 4 €/Nacht)", "Einnahmen für Umweltschutz\n& Infrastruktur",
      "Abschreckung von Billigtourismus", "Ziel: Qualität statt Quantität",
      "Kritik: zu niedrig, wird kaum\nkontrolliert"]),
    (MED_BLUE,  "🏖 BESUCHERMANAGEMENT",
     ["Reservierungspflicht für\nPopulärstrände (Sa Calobra etc.)", "Ticketsystem für Naturparks",
      "Maximale Besucherzahlen\n(Cala Mondragó etc.)", "Ausweisungssystem\nfür Überbuchung"]),
    (ORANGE,    "🏘 STRUKTURWANDEL",
     ["Wirtschaftliche Diversifikation\n(Tech, Forschung, Landwirtschaft)", "Ferienwohnungs-\nObergrenze (Airbnb-Verbot)",
      "Sozialer Wohnungsbau\nfür Einheimische", "Förderung lokaler\nUnternehmen"]),
    (GREEN,     "🌿 ÖKOTOURISMUS\n& BILDUNG",
     ["Wandertourismus &\nnachhaltige Angebote", "Klimafreundliche Mobilität\n(E-Bikes, ÖPNV stärken)",
      "Umweltbildung für Touristen", "Zertifikate für\nnachhaltige Hotels"]),
]

for ci, (col, title, items) in enumerate(solutions):
    x = 0.25 + ci * 3.27
    add_rect(slide, x, 1.7, 3.1, 0.8, fill_color=col)
    add_text(slide, title, x+0.1, 1.72, 2.9, 0.76, font_size=12, bold=True,
             color=WHITE, align=PP_ALIGN.CENTER)
    for ii, item in enumerate(items):
        yy = 2.55 + ii * 0.82
        add_rect(slide, x+0.05, yy, 3.0, 0.75, fill_color=WHITE)
        add_rect(slide, x+0.05, yy, 0.07, 0.75, fill_color=col)
        add_text(slide, item, x+0.2, yy+0.06, 2.8, 0.65, font_size=11, color=DARK_GRAY)

# ─── SLIDE 13: HANDOUT ───────────────────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=WHITE)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=DEEP_BLUE)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=DEEP_BLUE)

add_text(slide, "HANDOUT – MALLORCA ALS TOURISTISCHES FALLBEISPIEL",
         0.5, 0.25, 12, 0.65, font_size=20, bold=True, color=WHITE)
add_text(slide, "Zusammenfassung der wichtigsten Inhalte",
         0.5, 0.92, 12, 0.45, font_size=13, color=LIGHT_BLUE)

sections = [
    (MED_BLUE, "DEFINITION", "Tourismus = vorübergehendes Verlassen des Heimatorts für ≥1 Nacht (UNWTO). Unterschied: Ausflügler vs. Tourist."),
    (DEEP_BLUE, "GEOGRAPHIE", "Mallorca: 3.640 km², Westliches Mittelmeer, Balearen. ~923.000 Einwohner, 13,4 Mio. Touristen/Jahr."),
    (MED_BLUE, "ENTWICKLUNG", "1950er: <100.000 Besucher → 1970er: Massentourismus → Heute: 31 Mio. Passagiere Flughafen Palma, >2.000 Hotels."),
    (DEEP_BLUE, "POTENZIALE", "Naturräumlich: Klima, Strände, Gebirge. Soziokulturell: Kultur, Gastronomie. Wirtschaftlich: früher günstige Preise, Pauschalreisen."),
    (GREEN, "AUSWIRKUNGEN", "Natur: Wasserknappheit, Müll, Abholzung. Wirtschaft: Monostruktur, Gentrifizierung. Sozial: Sprachverlust, Proteste, Verdrängung."),
    (ORANGE, "LÖSUNGEN", "Mallorca-Steuer (bis 4 €/Nacht), Besucherobergrenzen, Airbnb-Verbote, Wirtschaftsdiversifikation, Ökotourismus."),
]

for i, (col, title, text) in enumerate(sections):
    row = i // 2
    col_i = i % 2
    x = 0.25 + col_i * 6.55
    y = 1.65 + row * 1.68
    add_rect(slide, x, y, 6.3, 1.55, fill_color=LIGHT_GRAY)
    add_rect(slide, x, y, 1.6, 0.45, fill_color=col)
    add_text(slide, title, x+0.05, y+0.04, 1.5, 0.38, font_size=12, bold=True,
             color=WHITE, align=PP_ALIGN.CENTER)
    add_text(slide, text, x+0.1, y+0.5, 6.1, 1.0, font_size=11.5, color=DARK_GRAY)

# ─── SLIDE 14: QUELLEN ────────────────────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=DARK_GRAY)
add_rect(slide, 0, 0, 13.33, 1.5, fill_color=DEEP_BLUE)
add_rect(slide, 0, 1.5, 0.12, 6.0, fill_color=ORANGE)
wave_bar(slide, y=6.85, color=MED_BLUE)

add_text(slide, "QUELLEN & LITERATURVERZEICHNIS",
         0.5, 0.3, 12, 0.9, font_size=26, bold=True, color=WHITE)

quellen = [
    "UNWTO (World Tourism Organization): www.unwto.org – Definition und Statistiken zum internationalen Tourismus",
    "Statistisches Amt der Balearen (IBESTAT): www.ibestat.cat – Tourismus- und Wirtschaftsdaten Mallorca",
    "Aena (Spanische Flughafenbehörde): www.aena.es – Passagierdaten Flughafen Palma de Mallorca",
    "Umweltbundesamt: Tourismus und Umwelt – Wasserverbrauch, Abfallaufkommen im Tourismus",
    "Diario de Mallorca: www.diariodemallorca.es – Lokale Berichte, Proteste, Tourismuspolitik",
    "Govern Illes Balears: www.caib.es – Offizielle Daten, Tourismussteuer, Gesetzgebung",
    "Bundesagentur für Außenwirtschaft (GTAI): Wirtschaftsstruktur Balearen",
    "Tourismus-Analyse 2023, Stiftung für Zukunftsfragen – Reiseverhalten der Deutschen",
    "El País / The Guardian: Berichterstattung Overtourism Mallorca 2024",
    "Eigene Darstellungen und Zusammenfassungen nach o.g. Quellen",
]

for i, q in enumerate(quellen):
    y = 1.7 + i * 0.5
    add_rect(slide, 0.3, y, 0.4, 0.38, fill_color=MED_BLUE)
    add_text(slide, str(i+1), 0.3, y+0.03, 0.38, 0.32, font_size=11, bold=True,
             color=WHITE, align=PP_ALIGN.CENTER)
    add_text(slide, q, 0.8, y+0.03, 12.2, 0.42, font_size=11, color=LIGHT_GRAY)

# ─── SLIDE 15: DANKE / ENDE ───────────────────────────────────────────────────
slide = prs.slides.add_slide(BLANK)
add_rect(slide, 0, 0, 13.33, 7.5, fill_color=DEEP_BLUE)
add_rect(slide, 0, 3.5, 13.33, 4.0, fill_color=MED_BLUE)
add_rect(slide, 0, 6.5, 13.33, 1.0, fill_color=LIGHT_BLUE)
add_rect(slide, 4.5, 3.45, 4.33, 0.1, fill_color=ORANGE)

add_text(slide, "Vielen Dank", 1.5, 1.5, 10, 1.4, font_size=54, bold=True,
         color=WHITE, align=PP_ALIGN.CENTER)
add_text(slide, "für eure Aufmerksamkeit!", 1.5, 2.9, 10, 0.7, font_size=26,
         color=LIGHT_BLUE, align=PP_ALIGN.CENTER)
add_text(slide, "🌊  Mallorca – Ein touristisches Fallbeispiel  🏖",
         1.5, 3.8, 10, 0.7, font_size=20, color=WHITE, align=PP_ALIGN.CENTER)
add_text(slide, "Fragen & Diskussion", 1.5, 4.7, 10, 0.6, font_size=22,
         bold=True, color=SAND, align=PP_ALIGN.CENTER)

prs.save("/home/user/marketing/Mallorca_Tourismus_Praesentation.pptx")
print("Präsentation erstellt!")
