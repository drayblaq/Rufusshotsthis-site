import { expect, test, type Page } from "@playwright/test";

/**
 * Responsive standards audit (see "Responsive standards" in CLAUDE.md).
 * Screenshots: responsive-shots/<width>/<page>.png (gitignored).
 */

const PAGES = [
  { name: "home", path: "/" },
  { name: "portfolio", path: "/portfolio" },
  { name: "book", path: "/book" },
];

// [width, height]; below 1024 is emulated as a touch phone/tablet.
const VIEWPORTS: [number, number][] = [
  [320, 568],
  [360, 740],
  [390, 844],
  [412, 915],
  [768, 1024],
  [1024, 768],
  [1440, 900],
];

const MD = 768; // Tailwind md: bottom nav below, header nav from here up

/* ------------------------------------------------------------------ */
/* In-page checks (run inside the browser)                             */
/* ------------------------------------------------------------------ */

/** Horizontal scroll, tap targets, tiny text, stretched images. */
async function staticChecks(page: Page) {
  const screenWidth = page.viewportSize()!.width;
  return page.evaluate((screenWidth) => {
    const issues: string[] = [];
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return (
        r.width > 0 &&
        r.height > 0 &&
        s.visibility !== "hidden" &&
        s.display !== "none"
      );
    };
    const name = (el: Element) =>
      `${el.tagName.toLowerCase()}"${((el as HTMLElement).innerText || el.getAttribute("aria-label") || el.id || "").trim().slice(0, 24)}"`;

    // 1. no horizontal scroll
    // Compare with the screen: a phone browser widens its layout viewport to fit
    // too-wide content (so clientWidth grows too) instead of showing a scrollbar.
    const over =
      Math.max(
        document.documentElement.scrollWidth,
        document.documentElement.clientWidth,
      ) - screenWidth;
    if (over > 0) issues.push(`horizontal scroll: ${over}px`);

    // 2. tap targets >= 44x44 (radio inputs are hidden; their <label> is the target)
    const targets = document.querySelectorAll(
      "a[href], button, select, textarea, input:not([type=radio]):not([type=hidden]), label:has(> input[type=radio])",
    );
    for (const el of targets) {
      if (
        !visible(el) ||
        el.closest("[aria-hidden=true], dialog:not([open]), .sr-only")
      )
        continue;
      const r = el.getBoundingClientRect();
      if (r.width < 44 || r.height < 44)
        issues.push(
          `small target ${name(el)} ${Math.round(r.width)}x${Math.round(r.height)}`,
        );
    }

    // 3. readable text: nothing under 12px
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    const tiny = new Set<string>();
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const parent = n.parentElement;
      if (!parent || !n.textContent?.trim() || !visible(parent)) continue;
      if (parent.closest(".sr-only, [aria-hidden=true], script, style"))
        continue;
      const size = parseFloat(getComputedStyle(parent).fontSize);
      if (size < 12)
        tiny.add(`${n.textContent.trim().slice(0, 20)} (${size}px)`);
    }
    for (const t of tiny) issues.push(`tiny text: ${t}`);

    // 4. images not stretched: with object-fit: fill the box must match the photo's shape
    for (const img of document.querySelectorAll("img")) {
      if (!visible(img) || !img.naturalWidth) continue;
      if (getComputedStyle(img).objectFit !== "fill") continue; // cover/contain keep proportions
      const r = img.getBoundingClientRect();
      const diff = Math.abs(
        r.width / r.height - img.naturalWidth / img.naturalHeight,
      );
      if (diff > 0.03) issues.push(`stretched image ${img.alt.slice(0, 24)}`);
    }
    return issues;
  }, screenWidth);
}

/** Every interactive element can be scrolled into view and is not covered by anything. */
async function coverageCheck(page: Page) {
  return page.evaluate(async () => {
    const issues: string[] = [];
    const els = [
      ...document.querySelectorAll(
        "main a[href], main button, footer a[href], main label:has(> input[type=radio]), main input:not([type=radio]), main textarea",
      ),
    ].filter((el) => {
      const r = el.getBoundingClientRect();
      return (
        r.width > 0 && r.height > 0 && !el.closest("[aria-hidden=true], dialog")
      );
    });
    for (const el of els) {
      el.scrollIntoView({ block: "center", inline: "center" });
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      const r = el.getBoundingClientRect();
      const hit = document.elementFromPoint(
        r.x + r.width / 2,
        r.y + r.height / 2,
      );
      if (!hit || !(el === hit || el.contains(hit) || hit.contains(el))) {
        issues.push(
          `covered: ${(el as HTMLElement).innerText?.trim().slice(0, 24) || el.getAttribute("aria-label")} by ${hit?.tagName}.${String(hit?.className).slice(0, 40)}`,
        );
      }
    }
    // Footer bottom must end above the mobile bar
    window.scrollTo(0, document.documentElement.scrollHeight);
    await new Promise((r) => setTimeout(r, 50));
    const nav = document.querySelector("[data-mobile-nav]");
    const foot = document.querySelector("footer");
    if (nav && foot && getComputedStyle(nav).display !== "none") {
      const gap =
        nav.getBoundingClientRect().top - foot.getBoundingClientRect().bottom;
      if (gap < -1) issues.push(`footer hidden behind bottom nav by ${-gap}px`);
    }
    return issues;
  });
}

/** Cumulative layout shift while loading and scrolling through the page. */
async function measureCls(page: Page) {
  return page.evaluate(async () => {
    let cls = 0;
    new PerformanceObserver((list) => {
      for (const e of list.getEntries() as (PerformanceEntry & {
        value: number;
        hadRecentInput: boolean;
      })[]) {
        if (!e.hadRecentInput) cls += e.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    for (
      let y = 0;
      y < document.documentElement.scrollHeight;
      y += innerHeight / 2
    ) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    await new Promise((r) => setTimeout(r, 300));
    return cls;
  });
}

async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
}

/* ------------------------------------------------------------------ */
/* Every page at every width                                           */
/* ------------------------------------------------------------------ */

for (const [width, height] of VIEWPORTS) {
  test.describe(`${width}x${height}`, () => {
    const touch = width < 1024;
    test.use({
      viewport: { width, height },
      isMobile: touch,
      hasTouch: touch,
      deviceScaleFactor: 1,
    });

    for (const p of PAGES) {
      test(`${p.name}`, async ({ page }) => {
        await open(page, p.path);

        // Bottom nav: phones only, never on /book (the sticky confirm bar owns the bottom)
        const navShown = await page
          .locator("[data-mobile-nav]")
          .isVisible()
          .catch(() => false);
        expect(navShown, "bottom nav visibility").toBe(
          width < MD && p.path !== "/book",
        );
        // Floating WhatsApp button: desktop/tablet only, never on /book
        const fabShown = await page.locator("[data-whatsapp-fab]").isVisible();
        expect(fabShown, "floating WhatsApp visibility").toBe(
          width >= MD && p.path !== "/book",
        );
        // Header is solid (nothing shows through)
        const headerBg = await page
          .locator("header")
          .first()
          .evaluate((h) => getComputedStyle(h).backgroundColor);
        expect(headerBg, "solid header").not.toMatch(/rgba\(.*,\s*0?\.\d+\)/);

        expect(await staticChecks(page)).toEqual([]);
        expect(await coverageCheck(page)).toEqual([]);
        expect(await measureCls(page), "layout shift").toBeLessThan(0.05);
        // Screenshot last: a full-page screenshot temporarily resizes the viewport.
        await page.screenshot({
          path: `responsive-shots/${width}/${p.name}.png`,
          fullPage: true,
        });
      });
    }
  });
}

/* ------------------------------------------------------------------ */
/* Hero fits short phones: arrows + "Book a shoot" above the bottom nav */
/* ------------------------------------------------------------------ */

for (const [width, height] of [
  [320, 568],
  [360, 740],
  [375, 667],
  [390, 844],
  [412, 915],
] as [number, number][]) {
  test(`hero fits ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await open(page, "/");
    const r = await page.evaluate(() => {
      const navTop = document
        .querySelector("[data-mobile-nav]")!
        .getBoundingClientRect().top;
      const bottom = (sel: string) =>
        document.querySelector(sel)!.getBoundingClientRect().bottom;
      const h1 = document.querySelector("h1")!.getBoundingClientRect();
      const header = document
        .querySelector("header")!
        .getBoundingClientRect().bottom;
      const card = document
        .querySelector('[data-card="0"]')!
        .getBoundingClientRect();
      return {
        navTop,
        arrows: bottom('button[aria-label="Next photo"]'),
        book: bottom('main a[href="/book"]'),
        headlineVisible: h1.top >= header - 1 && h1.bottom <= navTop,
        photoWidth: Math.round(card.width),
        photoVisible:
          card.width > 80 && card.top >= header && card.bottom <= navTop,
      };
    });
    await page.screenshot({
      path: `responsive-shots/hero-fit/${width}x${height}.png`,
    });
    expect(r.arrows, "arrows above bottom nav").toBeLessThanOrEqual(r.navTop);
    expect(r.book, '"Book a shoot" above bottom nav').toBeLessThanOrEqual(
      r.navTop,
    );
    expect(r.photoVisible, "current photo fully visible").toBe(true);
    // Reported, not required on the smallest screens:
    test
      .info()
      .annotations.push({ type: "fit", description: JSON.stringify(r) });
  });
}

/* ------------------------------------------------------------------ */
/* Interaction checks on a phone                                       */
/* ------------------------------------------------------------------ */

test.describe("phone interactions", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });

  test("hero ring drags sideways and keeps vertical scroll", async ({
    page,
  }) => {
    await open(page, "/");
    const stage = page.locator(".touch-pan-y").first();
    expect(await stage.evaluate((el) => getComputedStyle(el).touchAction)).toBe(
      "pan-y",
    );
    const box = (await stage.boundingBox())!;
    const caption = page.locator("[aria-live=polite]").first();
    const before = await caption.innerText();
    const cdp = await page.context().newCDPSession(page);
    const y = box.y + box.height / 2;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: 300, y }],
    });
    for (let i = 1; i <= 12; i++) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: 300 - i * 18, y }],
      });
    }
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(caption).not.toHaveText(before);
  });

  test("lightbox works one-handed", async ({ page }) => {
    await open(page, "/portfolio");
    await page.locator("main ul.grid > li button").first().click();
    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    // Thumb zone: the controls a one-handed user needs sit in the lower half
    for (const label of ["Close", "Next photo", "Previous photo"]) {
      const b = (await dialog
        .getByRole("button", { name: label })
        .last()
        .boundingBox())!;
      expect(b.y + b.height / 2, `${label} reachable by thumb`).toBeGreaterThan(
        844 / 2,
      );
      expect(Math.min(b.width, b.height)).toBeGreaterThanOrEqual(44);
    }
    await dialog.getByRole("button", { name: "Next photo" }).last().click();
    await expect(dialog.locator("p").first()).toContainText("2 /");
    await dialog.getByRole("button", { name: "Close" }).last().click();
    await expect(dialog).toBeHidden();
  });

  test("safe areas are respected (notch + home bar)", async ({ page }) => {
    const cdp = await page.context().newCDPSession(page);
    try {
      await cdp.send(
        "Emulation.setSafeAreaInsetsOverride" as never,
        {
          insets: { top: 47, bottom: 34, left: 0, right: 0 },
        } as never,
      );
    } catch {
      test.skip(true, "This Chrome cannot emulate safe-area insets");
    }
    await open(page, "/");
    const header = await page
      .locator("header")
      .first()
      .evaluate((h) => getComputedStyle(h).paddingTop);
    expect(header).toBe("47px");
    const nav = await page
      .locator("[data-mobile-nav] ul")
      .evaluate((u) => getComputedStyle(u).paddingBottom);
    expect(nav).toBe("34px");
    await open(page, "/book");
    const bar = await page
      .locator("[data-booking-bar]")
      .evaluate((b) => parseFloat(getComputedStyle(b).paddingBottom));
    expect(bar).toBeGreaterThanOrEqual(34);
  });
});

test.describe("landscape phone 844x390", () => {
  test.use({
    viewport: { width: 844, height: 390 },
    isMobile: true,
    hasTouch: true,
  });
  for (const p of PAGES) {
    test(p.name, async ({ page }) => {
      await open(page, p.path);
      const issues = await staticChecks(page);
      const covered = await coverageCheck(page);
      await page.screenshot({
        path: `responsive-shots/landscape/${p.name}.png`,
        fullPage: true,
      });
      expect(issues).toEqual([]);
      expect(covered).toEqual([]);
    });
  }
});

test.describe("200% text size (390 wide)", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  for (const p of PAGES) {
    test(p.name, async ({ page }) => {
      // Same as raising the browser's default font size to 32px (accessibility setting)
      const cdp = await page.context().newCDPSession(page);
      await cdp.send("Page.enable");
      await cdp.send("Page.setFontSizes", {
        fontSizes: { standard: 32, fixed: 26 },
      });
      await open(page, p.path);
      const issues = (await staticChecks(page)).filter(
        (i) => !i.startsWith("tiny text"),
      );
      await page.screenshot({
        path: `responsive-shots/text-200/${p.name}.png`,
        fullPage: true,
      });
      expect(issues).toEqual([]);
    });
  }
});

/* ------------------------------------------------------------------ */
/* Fonts                                                               */
/* ------------------------------------------------------------------ */

test("fonts: display swap, used weights only", async ({ page }) => {
  const fontFiles = new Set<string>();
  page.on("request", (r) => {
    if (r.resourceType() === "font") fontFiles.add(r.url());
  });
  await open(page, "/");
  const faces = await page.evaluate(() =>
    [...document.styleSheets].flatMap((s) => {
      try {
        return [...s.cssRules]
          .filter((r): r is CSSFontFaceRule => r instanceof CSSFontFaceRule)
          .map((r) => ({
            family: r.style.fontFamily,
            display: r.style.getPropertyValue("font-display"),
            weight: r.style.fontWeight,
          }));
      } catch {
        return [];
      }
    }),
  );
  const real = faces.filter((f) => !/Fallback/.test(f.family));
  for (const f of real) expect(f.display, f.family).toBe("swap");
  // Exactly two families, each a single variable font (one file covers all weights used)
  expect(new Set(real.map((f) => f.family.replace(/"/g, "")))).toEqual(
    new Set(["Cormorant Garamond", "Jost"]),
  );
  test.info().annotations.push({
    type: "fonts",
    description: `${fontFiles.size} files`,
  });
  // latin + latin-ext per family: latin-ext is needed for the Naira sign (U+20A6) in prices
  expect(fontFiles.size).toBeLessThanOrEqual(4);
});

/* Self-test: the overflow check must catch a too-wide element on a phone. */
test.describe("audit self-test", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  test("overflow check detects a 600px-wide element", async ({ page }) => {
    await open(page, "/portfolio");
    await page.evaluate(() => {
      const d = document.createElement("div");
      d.style.cssText = "width:600px;height:10px";
      document.querySelector("main")!.append(d);
    });
    const issues = await staticChecks(page);
    expect(issues.some((i) => i.startsWith("horizontal scroll"))).toBe(true);
  });
});
