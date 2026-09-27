/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Öğlen +3 °C, gece −5 °C', en: 'Noon +3 °C, night −5 °C',
      note: 'Öğlen hava 3 derece. Gece sıcaklık sıfırın altına düştü: sıfırın 5 derece altı. Bunu eksi 5 derece diye yazarız.' },
    { scene: 2, start: 10.8, end: 18.2, tr: 'Doğal sayılar, sonra negatif tam sayılar', en: 'Natural numbers, then negative integers',
      note: 'Termometreyi yatıralım: bir sayı doğrusu. Sıfırın sağında doğal sayılar: 1, 2, 3. Sıfırın solunda negatif tam sayılar: eksi 1, eksi 2, eksi 3. Hepsi birlikte tam sayılar.' },
    { scene: 2, start: 18.6, end: 27.8, tr: '3 ile −3 ters sayılar', en: '3 and −3 are opposites',
      note: '3 ile eksi 3, sıfırın iki yanında, sıfıra eşit uzaklıkta. Bunlara ters sayılar denir. Sıfır ne pozitif ne negatiftir.' },
    { scene: 3, start: 28.6, end: 38.0, tr: '−4 ile 4: sıfırdan 4 birim uzakta', en: '−4 and 4: 4 units from zero',
      note: 'Eksi 4 sıfırın 4 birim solunda, 4 sıfırın 4 birim sağında. İkisinin de sıfıra uzaklığı 4 birim.' },
    { scene: 3, start: 38.4, end: 45.8, tr: 'Mutlak değer: sıfıra uzaklık', en: 'Absolute value: distance to zero',
      note: 'Bir sayının sıfıra olan uzaklığına mutlak değer denir. Eksi 4’ün mutlak değeri 4, 4’ün mutlak değeri 4, sıfırın mutlak değeri 0. Uzaklık negatif olmaz.' },
    { scene: 4, start: 46.6, end: 56.0, tr: '−1 ile 0 arasında: −1/2, −3/4', en: 'Between −1 and 0: −1/2, −3/4',
      note: 'Sayı doğrusuna yakından bakalım. Eksi 1 ile 0 arasında da sayılar var: eksi 1 bölü 2, eksi 3 bölü 4. a bölü b biçiminde, b sıfır olmamak üzere, yazılabilen sayılara rasyonel sayı denir.' },
    { scene: 4, start: 56.4, end: 63.8, tr: 'Tam sayılar da rasyoneldir', en: 'Integers are rational too',
      note: '5, 5 bölü 1 diye yazılabilir; eksi 3, eksi 3 bölü 1. Tam sayılar da rasyonel sayıdır. Eksi 3 bölü 4’ün mutlak değeri 3 bölü 4: sıfıra 3 bölü 4 birim uzakta.' },
    { scene: 5, start: 64.6, end: 73.4, tr: '−2/3 ve 7/4 nerede?', en: 'Where are −2/3 and 7/4?',
      note: 'Eksi 2 bölü 3’ü bulalım: 0 ile eksi 1 arasını 3 eş parçaya böl, sıfırdan 2 parça sola git. 7 bölü 4 için 1 ile 2 arasını 4 eş parçaya böl, 1’den 3 parça sağa git.' },
    { scene: 5, start: 73.8, end: 79.8, tr: 'Her rasyonel sayıya bir nokta', en: 'A point for every rational number',
      note: 'Her rasyonel sayı sayı doğrusunda bir noktaya karşılık gelir.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Tam sayı, mutlak değer, rasyonel sayı', en: 'Integer, absolute value, rational number',
      note: 'Aklında kalsın: tam sayılar sıfırın iki yanına dizilir. Mutlak değer, sıfıra olan uzaklıktır. a bölü b biçiminde yazılabilen sayılar rasyonel sayılardır.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Her rasyonel sayının bir yeri var!', en: 'Every rational number has its place!',
      note: 'Her rasyonel sayının sayı doğrusunda bir yeri var!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
