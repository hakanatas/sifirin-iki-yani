/* SAHNE 1 — SIFIRIN ALTI (0–10 s)  Bir termometre: öğlen +3 °C, gece −5 °C.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /** a thermometer from −10 to +10 °C; level v */
  function thermo(ctx, TH, v, a, t) {
    if (a <= 0) return;
    const f = F(), Y = (u) => lerp(TH.y0, TH.y1, (10 - u) / 20), x = TH.x, s = 30;
    Ink.path(ctx, [[x - 16, TH.y0 - 20], [x - 16, TH.y1 + 12]], { w: 4, alpha: a, seed: 4001, taper: [0, 0] });
    Ink.path(ctx, [[x + 16, TH.y0 - 20], [x + 16, TH.y1 + 12]], { w: 4, alpha: a, seed: 4002, taper: [0, 0] });
    Ink.path(ctx, [[x - 16, TH.y0 - 20], [x, TH.y0 - 34], [x + 16, TH.y0 - 20]], { w: 4, alpha: a, seed: 4003, taper: [0, 0] });
    ctx.fillStyle = amber(0.85 * a); ctx.beginPath(); ctx.arc(x, TH.y1 + 38, 30, 0, Math.PI * 2); ctx.fill();
    ctx.fillRect(x - 8, Y(v), 16, TH.y1 + 20 - Y(v));
    for (let u = -10; u <= 10; u += 2) {
      const y = Y(u), big = u % 10 === 0 || u === 0;
      Ink.path(ctx, [[x - 16, y], [x - 16 - (big ? 26 : 14), y]], { w: 3, alpha: a, seed: 4010 + u, taper: [0, 0] });
      if (u % 5 === 0) f.T(ctx, label(u), x - 80, y, { size: s, alpha: a, align: 'right', color: u === 0 ? A.amber : undefined });
    }
    Ink.path(ctx, [[x + 24, Y(0)], [x + 330, Y(0)]], { w: 2.5, alpha: 0.5 * a * seg(t, 6.6, 7.2), seed: 4040, taper: [0, 0] });
  }

  /** the number line from lo to hi; ticks [value, labelItems, small]; points [value, items, k] */
  function line(ctx, N, lo, hi, ticks, pts, a, s, seed) {
    if (a <= 0) return null;
    const f = F(), X = (v) => lerp(N.x0, N.x1, (v - lo) / (hi - lo));
    Ink.path(ctx, [[N.x0 - 40, N.y], [N.x1 + 40, N.y]], { w: 4, alpha: a, seed, taper: [0, 0] });
    Ink.path(ctx, [[N.x1 + 22, N.y - 12], [N.x1 + 42, N.y], [N.x1 + 22, N.y + 12]], { w: 4, alpha: a, seed: seed + 90, taper: [0, 0] });
    Ink.path(ctx, [[N.x0 - 22, N.y - 12], [N.x0 - 42, N.y], [N.x0 - 22, N.y + 12]], { w: 4, alpha: a, seed: seed + 91, taper: [0, 0] });
    ticks.forEach(([v, lab, small, k = 1, hot], i) => {
      const x = X(v); if (x < N.x0 - 1 || x > N.x1 + 1 || k <= 0) return;
      const h = small ? 8 : 13;
      Ink.path(ctx, [[x, N.y - h], [x, N.y + h]], { w: small ? 2.5 : 3, alpha: a * k, seed: seed + 1 + i, taper: [0, 0], color: hot ? LI.AMBER_RGB : undefined });
      if (lab) f.expr(ctx, lab, x, N.y + 44, s * 0.62, { alpha: a * k, color: hot ? A.amber : undefined });
    });
    pts.forEach(([v, lab, k], i) => {
      if (k <= 0) return; const x = X(v);
      ctx.fillStyle = amber(a * k); ctx.beginPath(); ctx.arc(x, N.y, 10, 0, Math.PI * 2); ctx.fill();
      if (lab) f.expr(ctx, lab, x, N.y - (i % 2 ? 118 : 60), s * 0.9, { alpha: a * k, halo: true, color: A.amber });
    });
    return X;
  }
  /** an arc over the line from xa to xb */
  function hop(ctx, N, xa, xb, hgt, p, a, seed, color) {
    if (p <= 0 || a <= 0) return;
    const P = []; for (let i = 0; i <= 16; i++) { const u = i / 16; P.push([lerp(xa, xb, u), N.y - 16 - hgt * Math.sin(Math.PI * u)]); }
    Ink.path(ctx, P, { w: 3.5, p, alpha: a, seed, taper: [0.1, 0.2], color });
  }
  /** a bracket from xa to xb above the line, with a label */
  function bracket(ctx, N, xa, xb, dy, p, a, seed, lab, s) {
    if (p <= 0 || a <= 0) return;
    const y = N.y - dy;
    Ink.path(ctx, [[xa, y + 14], [xa, y], [xb, y], [xb, y + 14]], { w: 4, p, alpha: a, seed, taper: [0, 0], color: LI.AMBER_RGB });
    if (p >= 1 && lab) F().T(ctx, lab, (xa + xb) / 2, y - 30, { size: s * 0.66, alpha: a, halo: true, color: A.amber });
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Sıcaklık sıfırın altına düşünce nasıl yazarız?'],
      [10.6, 27.8, 'Tam sayıları sayı doğrusunda inceleyelim'],
      [28.4, 45.8, 'Sıfıra olan uzaklık: mutlak değer'],
      [46.4, 63.8, 'Tam sayıların arasında başka sayılar var mı?'],
      [64.4, 79.8, 'Her rasyonel sayının sayı doğrusunda bir yeri var'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), f = F(), a = END(t), s = L.G.s, N = L.NL;
    // 0–10: thermometer
    const th = win(t, 4.6, 10.2) * a;
    if (th > 0) {
      const v = lerp(3, -5, inOut(seg(t, 7.0, 8.6))) * seg(t, 5.0, 5.8) + 0 * (1 - seg(t, 5.0, 5.8));
      thermo(ctx, L.TH, v, th, t);
      const Y = (u) => lerp(L.TH.y0, L.TH.y1, (10 - u) / 20);
      f.T(ctx, 'Öğlen: +3 °C', L.TH.x + 60, Y(3), { size: s * 0.8, alpha: th * seg(t, 5.8, 6.3), align: 'left', halo: true });
      f.T(ctx, 'Gece: −5 °C', L.TH.x + 60, Y(-5), { size: s * 0.8, alpha: th * seg(t, 8.6, 9.1), align: 'left', halo: true, color: A.amber });
    }

    // 10–80: one number line; −6…6, then zoomed to −2…2
    const nl = win(t, 10.8, 79.8) * a;
    if (nl <= 0) return;
    const z = inOut(seg(t, 47.0, 49.0)), lo = lerp(-6, -2, z), hi = lerp(6, 2, z);
    const ticks = [];
    for (let v = -6; v <= 6; v++) {
      const pos = v > 0 ? seg(t, 12.0 + v * 0.2, 12.4 + v * 0.2) : v === 0 ? seg(t, 11.6, 12.0) : seg(t, 14.8 - v * 0.2 - 0.2, 15.2 - v * 0.2 - 0.2);
      ticks.push([v, [label(v)], false, Math.max(pos, t > 47 ? 1 : 0), v >= 0 && t < 14.6 && t > 11.6]);
    }
    const half = seg(t, 49.2, 49.8); if (half > 0) for (let v = -1.5; v <= 1.5; v += 1) ticks.push([v, null, true, half]);
    const third = seg(t, 65.4, 66.6); if (third > 0 && t < 79.8) for (let k = 1; k <= 2; k++) ticks.push([-k / 3, null, true, seg(t, 65.4 + k * 0.3, 65.8 + k * 0.3), true]);
    const quarter = seg(t, 70.4, 71.6); if (quarter > 0) for (let k = 1; k <= 3; k++) ticks.push([1 + k / 4, null, true, seg(t, 70.4 + k * 0.3, 70.8 + k * 0.3), true]);

    const pts = [];
    // 10–28: natural numbers glow, then negatives; 3 and −3 mirror each other
    const mir = win(t, 18.6, 27.8);
    if (mir > 0) { pts.push([-3, [label(-3)], mir * seg(t, 18.8, 19.2)]); pts.push([3, ['3'], mir * seg(t, 18.8, 19.2)]); }
    // 28–46: −4 and 4
    const av = win(t, 28.8, 45.8);
    if (av > 0) { pts.push([-4, [label(-4)], av * seg(t, 29.2, 29.6)]); pts.push([4, ['4'], av * seg(t, 29.8, 30.2)]); }
    // 46–64: fractions between the integers
    const fq = win(t, 49.6, 63.8);
    if (fq > 0) {
      pts.push([-0.75, ['−', fr(3, 4)], fq * seg(t, 50.6, 51.0)]);
      pts.push([-0.5, ['−', fr(1, 2)], fq * seg(t, 49.8, 50.2)]);
      pts.push([1.5, [fr(3, 2)], fq * seg(t, 51.4, 51.8)]);
    }
    // 64–80: −2/3 and 7/4
    const r5 = win(t, 64.8, 79.8);
    if (r5 > 0) { pts.push([-2 / 3, ['−', fr(2, 3)], r5 * seg(t, 68.2, 68.6)]); pts.push([7 / 4, [fr(7, 4)], r5 * seg(t, 73.6, 74.0)]); }

    const X = line(ctx, N, lo, hi, ticks, pts, nl, s, 4100);
    if (!X) return;
    // mirror arc 3 ↔ −3
    if (mir > 0) hop(ctx, N, X(3), X(-3), (X(3) - X(0)) * 0.55, seg(t, 19.4, 20.8), mir * a, 4200, LI.AMBER_RGB);
    // brackets for |−4| and |4|
    if (av > 0) {
      bracket(ctx, N, X(-4), X(0), 150, seg(t, 30.4, 31.6), av * a, 4210, '4 birim', s);
      bracket(ctx, N, X(0), X(4), 150, seg(t, 32.0, 33.2), av * a, 4211, '4 birim', s);
      const E = L.EX.y, cx = (N.x0 + N.x1) / 2, d = env.V ? 270 : 300;
      f.expr(ctx, ['|−4| = 4'], cx - d, E, s * 0.95, { alpha: av * a * seg(t, 34.4, 34.8), halo: true });
      f.expr(ctx, ['|4| = 4'], cx, E, s * 0.95, { alpha: av * a * seg(t, 35.4, 35.8), halo: true });
      f.expr(ctx, ['|0| = 0'], cx + d, E, s * 0.95, { alpha: av * a * seg(t, 36.4, 36.8), halo: true });
    }
    // rational numbers as a/b
    const cx = (N.x0 + N.x1) / 2, E = L.EX.y;
    const e1 = win(t, 52.4, 58.4) * a;
    if (e1 > 0) f.expr(ctx, ['5 = ', fr(5, 1), '     −3 = −', fr(3, 1), '     0,5 = ', fr(1, 2)], cx, E, s * 0.95, { alpha: e1, halo: true, w: env.V ? 820 : 900 });
    const e2 = win(t, 58.8, 63.8) * a;
    if (e2 > 0) f.expr(ctx, ['|−', fr(3, 4), '| = ', fr(3, 4), ' : sıfıra ', fr(3, 4), ' birim uzakta'], cx, E, s * 0.95, { alpha: e2, halo: true, w: env.V ? 820 : 900 });
    // hops: 2 thirds to the left of 0, 3 quarters to the right of 1
    if (r5 > 0) {
      for (let k = 0; k < 2; k++) hop(ctx, N, X(-k / 3), X(-(k + 1) / 3), 34, seg(t, 66.8 + k * 0.6, 67.3 + k * 0.6), r5 * a, 4300 + k, LI.AMBER_RGB);
      for (let k = 0; k < 3; k++) hop(ctx, N, X(1 + k / 4), X(1 + (k + 1) / 4), 30, seg(t, 71.8 + k * 0.5, 72.2 + k * 0.5), r5 * a, 4310 + k, LI.AMBER_RGB);
    }
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[6.4, 10.2, 'Sıfırın altındaki sıcaklıkları eksi işaretiyle yazarız'], [11.8, 27.8, 'Doğal sayılar: 0, 1, 2, 3, …'],
      [29.4, 45.8, '−4 ile 4, sıfırdan 4 birim uzakta'], [49.8, 63.8, '−1 ile 0 arasında da sayılar var: −1/2, −3/4, …'],
      [65.0, 79.8, '0 ile −1 arasını 3 eş parçaya böl, 2 parça sola: −2/3']]);
    exprs(ctx, t, at(W, 1), [[15.0, 27.8, 'Tam sayılar: …, −3, −2, −1, 0, 1, 2, 3, …'], [34.4, 45.8, 'Uzaklık negatif olmaz: |−4| = |4| = 4'],
      [52.8, 63.8, 'a/b (b ≠ 0) biçiminde yazılabilen sayılar: rasyonel sayılar'], [70.4, 79.8, '1 ile 2 arasını 4 eş parçaya böl, 3 parça sağa: 7/4']]);
    exprs(ctx, t, at(W, 2), [[8.8, 10.2, '−5 °C: sıfırın 5 derece altı', true], [21.0, 27.8, '3 ile −3 ters sayılardır: sıfıra eşit uzaklıktalar', true],
      [39.6, 45.8, 'Mutlak değer: bir sayının sıfıra olan uzaklığı', true], [56.4, 63.8, 'Tam sayılar da rasyoneldir: 5 = 5/1, −3 = −3/1', true],
      [75.0, 79.8, 'Her rasyonel sayı sayı doğrusunda bir noktaya karşılık gelir', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Tam sayılar: …, −2, −1, 0, 1, 2, …', 80.6], ['Mutlak değer: sıfıra olan uzaklık', 81.6], ['Rasyonel sayılar: a/b (b ≠ 0)', 82.6], ['Her rasyonel sayının sayı doğrusunda bir yeri var!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'Below zero', nameTr: 'Sıfırın altı', concept: '+3 °C and −5 °C', conceptTr: '+3 °C ve −5 °C', render });
})(window.LI = window.LI || {});
