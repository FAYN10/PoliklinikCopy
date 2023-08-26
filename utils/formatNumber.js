export const convertNumberToWords = (number) => {
  const units = [
    '',
    'satu',
    'dua',
    'tiga',
    'empat',
    'lima',
    'enam',
    'tujuh',
    'delapan',
    'sembilan',
  ];

  const teens = [
    'sepuluh',
    'sebelas',
    'dua belas',
    'tiga belas',
    'empat belas',
    'lima belas',
    'enam belas',
    'tujuh belas',
    'delapan belas',
    'sembilan belas',
  ];

  const tens = [
    '',
    '',
    'dua puluh',
    'tiga puluh',
    'empat puluh',
    'lima puluh',
    'enam puluh',
    'tujuh puluh',
    'delapan puluh',
    'sembilan puluh',
  ];

  if (number < 10) {
    return units[number];
  } else if (number < 20) {
    return teens[number - 10];
  } else if (number < 100) {
    const unit = units[number % 10];
    const ten = tens[Math.floor(number / 10)];
    return `${ten} ${unit}`.trim();
  } else if (number < 1000) {
    const hundred =
      Math.floor(number / 100) === 1 ? 'se' : units[Math.floor(number / 100)];
    const remainder = number % 100;
    const remainderText =
      remainder > 0 ? ` ${convertNumberToWords(remainder)}` : '';
    return hundred === 'se'
      ? `${hundred}ratus${remainderText}`
      : `${hundred} ratus${remainderText}`;
  } else {
    return 'Angka terlalu besar untuk diubah.';
  }
};
