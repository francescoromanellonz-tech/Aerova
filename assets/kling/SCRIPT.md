# Kling AI — AEROVA LT-AWG20G Product Reveal Video

A 25-second cinematic reveal of the LT-AWG20G atmospheric water generator,
animating six locked-frame stage stills into one continuous shot.

---

## Subject

Tall slim matte-black premium atmospheric water generator. Locked frontal
camera. Dark studio backdrop. The machine **never moves, never morphs**;
only the highlighted internal stage changes between frames.

## Source frames

All six frames live in `kling/frames/`. Each is 768×1376 (≈9:16 portrait).
The product silhouette, exposure, and white balance were intentionally
locked across the set so Kling's Start/End-Frame interpolator has clean
parity to work with.

| #  | File                              | What it shows                                              |
|----|-----------------------------------|------------------------------------------------------------|
| 01 | `01-air-intake.png`               | Humid air ribbons drawn into the front-mid air inlet; faint pleated HEPA reveal |
| 02 | `02-condensation.png`             | Cold stainless coils, droplets falling, cool blue mist     |
| 03 | `03-sediment-precarbon.png`       | Lower cabinet door translucent — sediment + pre-carbon glow gold |
| 04 | `04-membrane.png`                 | Same row — UF/RO spiral membrane glows blue-white          |
| 05 | `05-uvc-minerals.png`             | Two violet UV-C lamps in upper + lower tank; mineral cartridge gold |
| 06 | `06-dispense.png`                 | Hot pour into a glass, steam rising, cool blue mist on chilled side |

---

## Recommended workflow

**Model:** Kling 2.1 Pro (most "obedient" for design-locked product shots)
or Kling 2.5 Turbo as a cheaper pass. Avoid 3.0 — its bias toward dramatic
motion fights the locked-product brief, and 4K is unnecessary for an
embedded web reveal.

**Mode:** **Start & End Frame** (also called "first-and-last-frame").
Available on 2.1 Pro and 2.5 Turbo. Generates a continuous interpolated
clip between two stills — exactly what we need to make six designed
stage frames feel like one x-ray sweep instead of six jump-cuts.

**Five paired clips → concatenate** in your NLE. Each clip is 5s.
Total run-time **25s**.

**Resolution / aspect:** 9:16, 1080p output. (Kling will upscale our
768×1376 inputs internally — output quality is fine for web embed and
for an Instagram/TikTok story format. If you need a 4K master, render
at 1080p here then upscale with Topaz Video AI.)

**Per-clip duration:** 5s (not 10s). 5s is the sweet spot for clean
transitions; 10s lets the model invent in-between geometry that breaks
designed reveals.

**Settings:**
- **CFG / Relevance:** 0.8 (high faithfulness to the source frames)
- **Motion strength / Creativity:** 1–3 of 10 (low — we don't want the
  housing to animate, only the named element)

---

## Master prompt template

Same skeleton for every clip. Only the `[STAGE-SPECIFIC MOTION]` line
changes.

```
Static locked-off frontal shot. The matte black AEROVA water generator
remains perfectly rigid and still — silhouette, proportions, display,
chrome levers, drip tray, and finish identical throughout.

Only [STAGE-SPECIFIC MOTION].

Soft studio key light unchanged. Subtle, slow, cinematic. 9:16.
```

**Universal negative prompt** (paste into the negative-prompt field for
every clip):

```
morphing, deforming, warping, melting, shape change, geometry distortion,
silhouette change, label distortion, logo deformation, text morphing,
display text changing, levers moving, hands, fingers, people, extra
objects, background drift, camera shake, motion blur, color shift,
flickering, lens distortion, low quality
```

---

## Per-clip script

### Clip 1 — Air intake → condensation
- **Start frame:** `01-air-intake.png`
- **End frame:** `02-condensation.png`
- **Duration:** 5s
- **Stage-specific motion:** `warm gold humid-air ribbons swirl gently into the front air-inlet slot, then dissolve as cold stainless coils begin to glow softly inside the upper interior, with the first crystal-clear condensation droplets forming on the coils`
- **CFG:** 0.8 · **Motion:** 2/10

### Clip 2 — Condensation → sediment + pre-carbon
- **Start frame:** `02-condensation.png`
- **End frame:** `03-sediment-precarbon.png`
- **Duration:** 5s
- **Stage-specific motion:** `condensation droplets continue trickling down the coils, the lower cabinet front door fades smoothly from solid black to dark smoked translucent, revealing the row of filter cartridges as the first two cartridges build a soft warm gold glow from within`
- **CFG:** 0.8 · **Motion:** 2/10

### Clip 3 — Sediment + pre-carbon → membrane
- **Start frame:** `03-sediment-precarbon.png`
- **End frame:** `04-membrane.png`
- **Duration:** 5s
- **Stage-specific motion:** `the gold glow on the first two cartridges gently dims, while the third cartridge ignites with a cool blue-white shimmer revealing its spiral-wound membrane core, with micro water droplets passing through it in slow motion`
- **CFG:** 0.8 · **Motion:** 2/10

### Clip 4 — Membrane → UV-C + minerals
- **Start frame:** `04-membrane.png`
- **End frame:** `05-uvc-minerals.png`
- **Duration:** 5s
- **Stage-specific motion:** `the blue membrane shimmer fades, then two violet LED UV-C lamps softly ignite from within — one inside the upper tank, one inside the lower tank — and the mineral cartridge glows warm gold with pale stone pellets visible inside`
- **CFG:** 0.8 · **Motion:** 3/10 *(slight bump for the lamp ignite)*

### Clip 5 — UV-C + minerals → dispense
- **Start frame:** `05-uvc-minerals.png`
- **End frame:** `06-dispense.png`
- **Duration:** 5s
- **Stage-specific motion:** `the violet UV glow softly recedes as a clear glass slides into place on the drip tray, then a thin warm water stream begins to pour from the left chrome lever with delicate steam rising, and a cool blue mist halo forms around the right lever`
- **CFG:** 0.8 · **Motion:** 3/10

---

## Concatenation notes

1. Generate each clip **2–3 times** and pick the cleanest take. Start/End
   Frame mode has higher seed variance than text-to-video.
2. In your NLE (Premiere, DaVinci, Final Cut), trim **2–3 frames** off
   the outgoing edge of each clip and the incoming edge of the next, so
   the join lands on the moment of maximum frame-to-frame match. The
   result reads as one continuous 25-second shot rather than five
   stitched 5-second clips.
3. Optional: add a short **24fps → 30fps** time-remap with smooth
   interpolation in your NLE if the video feels mechanical. Kling
   outputs at 24fps natively on 2.1.
4. **Audio:** add an ambient hum + soft water-drop foley + a single
   sustained pad. Kling 3.0 generates synced audio natively; 2.1 does
   not, so you'll add this in post.

---

## Single-clip alternative (faster, less control)

If you want to test before committing to the five-clip workflow, drop
just `01-air-intake.png` into Kling 2.1 Pro single-image-to-video with
the master prompt and the air-intake stage motion at 10s. Use that as a
sanity check for prompt phrasing and motion strength before generating
all five paired clips.

---

## Why Start/End Frame beats the alternatives for this subject

- **vs. 6 single-image i2v clips with hard cuts:** the product is identical
  across frames; a hard cut reads as a jump-cut bug, not a reveal.
  Start/End Frame produces a continuous morph that feels like an x-ray
  sweep through the machine.
- **vs. one 15s Kling 3.0 multi-shot:** loses precise control over each
  stage's framing and risks the model inventing in-between geometry that
  breaks the designed reveals.
- **vs. Kling 3.0 native 4K:** for a web-embedded product reveal, 1080p
  is enough; 3.0's motion bias actively works against the locked-product
  brief.
