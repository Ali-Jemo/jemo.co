/**
 * Rafidain Calendar & Iraqi Seasonal Engine (RFC-2026)
 * Source: /home/jemo/tmp/rafidain-calendar/librafidain.js
 * Epoch: Nabonassar Era (747 BC = 1 RF) | 2026 AD = 2773 RF
 */

export interface RafidainMonth {
  num: number;
  name: string;
  en: string;
  days: number;
  quarter: 1 | 2 | 3 | 4;
  meaning: string;
  climateNote: string;
}

export const RAFIDAIN_MONTHS: RafidainMonth[] = [
  {
    num: 1,
    name: "السنبلة",
    en: "Al-Sonbola",
    days: 30,
    quarter: 1,
    meaning: "بداية الربيع واخضرار الحقول",
    climateNote: "اعتدال ربيعي، تفتح براعم النخيل والزهور، وبداية انطلاق موسم الزراعة والري في وادي الرافدين.",
  },
  {
    num: 2,
    name: "الجدول",
    en: "Al-Jadwal",
    days: 30,
    quarter: 1,
    meaning: "مياه الأنهار والري والفيض العذب",
    climateNote: "ذروة اعتدال الربيع (أم الربيعين)، انتعاش دجلة والفرات، وأجواء مثالية للرحلات والزراعة.",
  },
  {
    num: 3,
    name: "الشروق",
    en: "Al-Shorooq",
    days: 31,
    quarter: 1,
    meaning: "اعتدال الشمس واكتمال الضوء",
    climateNote: "نهاية الربيع وبداية الدفء، موسم حصاد الحنطة والشعير السنوي في عموم محافظات العراق.",
  },
  {
    num: 4,
    name: "الظهيرة",
    en: "Al-Dhaheera",
    days: 30,
    quarter: 2,
    meaning: "قمة الصيف واشتداد الحرارة",
    climateNote: "الانقلاب الصيفي وأطول أيام السنة، اشتداد الحرارة (طباخات التمر)، وساعات سطوع قصوى للشمس.",
  },
  {
    num: 5,
    name: "العطاء",
    en: "Al-Ataa",
    days: 30,
    quarter: 2,
    meaning: "نضج الثمار والتمور",
    climateNote: "ذروة الصيف وجني الرطب العراقي (البرحي، الخستاوي، الزهدي) في بساتين بغداد والفرات الأوسط والبصرة.",
  },
  {
    num: 6,
    name: "الحصيدة",
    en: "Al-Haseeda",
    days: 31,
    quarter: 2,
    meaning: "موسم الحصاد الزراعي وانكسار القيظ",
    climateNote: "نهاية الصيف وانكسار حدة القيظ، طلوع نجم سهيل واعتدال الأجواء ليلاً، واستعداد الأرض لدورة الخريف.",
  },
  {
    num: 7,
    name: "الفيضان",
    en: "Al-Fayadan",
    days: 30,
    quarter: 3,
    meaning: "ارتفاع دجلة والفرات واستقبال الخريف",
    climateNote: "الاعتدال الخريفي، تعادل ساعات الليل والنهار، تراجع درجات الحرارة نهاراً وبرودة منعشة في الصباح الباكر.",
  },
  {
    num: 8,
    name: "الرمال",
    en: "Al-Rimal",
    days: 30,
    quarter: 3,
    meaning: "هبوب الرياح الموسمية وتبدل الهواء",
    climateNote: "تقلبات فصل الخريف، نشاط الرياح الموسمية الشمالية الغربية، وانخفاض تدريجي ملحوظ في درجات الحرارة.",
  },
  {
    num: 9,
    name: "التوازن",
    en: "Al-Tawazon",
    days: 31,
    quarter: 3,
    meaning: "تعادل الليل والنهار وبدء برودة الجو",
    climateNote: "نهاية الخريف وبدء نسمات البرد، موسم زراعة المحاصيل الشتوية، واستعداد شبكات الصرف والري للأمطار.",
  },
  {
    num: 10,
    name: "الندى",
    en: "Al-Nada",
    days: 30,
    quarter: 4,
    meaning: "بداية البرد وتكاثف الضباب والرطوبة",
    climateNote: "الانقلاب الشتوي وأقصر نهار في السنة، بداية ليالي البرد القارس، وتكاثف الضباب الصباحي فوق الطرق والجسور.",
  },
  {
    num: 11,
    name: "الأمطار",
    en: "Al-Amtar",
    days: 30,
    quarter: 4,
    meaning: "موسم الأمطار الغزيرة والمربعانية",
    climateNote: "قمة برودة الشتاء العراقي (المربعانية)، هطول الأمطار الشتوية، وثلوج في قمم جبال كردستان وشمال العراق.",
  },
  {
    num: 12,
    name: "الكرامة",
    en: "Al-Karama",
    days: 31,
    quarter: 4,
    meaning: "شهر الإنجاز والسيادة ويسبق أسبوع الخلود",
    climateNote: "نهاية موسم البرد (الشبط وبداية الحسوم)، استيقاظ الأرض وتدفق مياه ذوبان الثلوج نحو الأهوار ودجلة والفرات.",
  },
];

export const RAFIDAIN_WEEKDAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export const SEASONS_INFO = {
  1: {
    name: "فصل الربيع والخصوبة",
    en: "Spring Quarter",
    icon: "🌱",
    nextQuarterName: "فصل الصيف (الظهيرة)",
  },
  2: {
    name: "فصل الصيف والحرارة",
    en: "Summer Quarter",
    icon: "☀️",
    nextQuarterName: "فصل الخريف والاعتدال (الفيضان)",
  },
  3: {
    name: "فصل الخريف والاعتدال",
    en: "Autumn Quarter",
    icon: "🍂",
    nextQuarterName: "فصل الشتاء والأمطار (الندى)",
  },
  4: {
    name: "فصل الشتاء والبرودة",
    en: "Winter Quarter",
    icon: "❄️",
    nextQuarterName: "فصل الربيع الجديد (السنبلة)",
  },
};

function getRafidainNewYearDate(gregYear: number): Date {
  const mar20 = new Date(Date.UTC(gregYear, 2, 20));
  const dayOfWeek = mar20.getUTCDay(); // 0 is Sun
  const daysToPrevSun = (dayOfWeek - 0 + 7) % 7;
  const prevSun = new Date(mar20.getTime() - daysToPrevSun * 86400000);
  const daysToNextSun = (7 - dayOfWeek) % 7;
  const nextSun = new Date(mar20.getTime() + daysToNextSun * 86400000);

  const distPrev = Math.abs(mar20.getTime() - prevSun.getTime());
  const distNext = Math.abs(nextSun.getTime() - mar20.getTime());
  return distPrev < distNext ? prevSun : nextSun;
}

export interface CurrentRafidainSeason {
  year: number;
  monthNum: number;
  monthName: string;
  day: number;
  weekday: string;
  quarter: 1 | 2 | 3 | 4;
  quarterName: string;
  seasonName: string;
  seasonIcon: string;
  meaning: string;
  climateNote: string;
  dayInQuarter: number;
  daysLeftInQuarter: number;
  nextQuarterName: string;
  phaseLabel: string;
  formattedDate: string;
}

export function getCurrentRafidainSeason(date = new Date()): CurrentRafidainSeason {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const target = new Date(Date.UTC(year, month - 1, day));
  const nyThisYear = getRafidainNewYearDate(year);
  let nyDate: Date;
  let rfYear: number;

  if (target >= nyThisYear) {
    rfYear = year + 747;
    nyDate = nyThisYear;
  } else {
    rfYear = year - 1 + 747;
    nyDate = getRafidainNewYearDate(year - 1);
  }

  const diffMs = target.getTime() - nyDate.getTime();
  const dayOfYear = Math.floor(diffMs / 86400000) + 1;

  let cum = 0;
  let monthObj = RAFIDAIN_MONTHS[0];
  let dayInMonth = 1;
  for (const m of RAFIDAIN_MONTHS) {
    if (dayOfYear > cum && dayOfYear <= cum + m.days) {
      monthObj = m;
      dayInMonth = dayOfYear - cum;
      break;
    }
    cum += m.days;
  }

  const wkIdx = (dayOfYear - 1) % 7;
  const dayInQuarter = ((dayOfYear - 1) % 91) + 1;
  const daysLeftInQuarter = Math.max(0, 91 - dayInQuarter);
  const season = SEASONS_INFO[monthObj.quarter];

  let phaseLabel = "بداية الفصل";
  if (dayInQuarter > 30 && dayInQuarter <= 60) {
    phaseLabel = "ذروة الفصل";
  } else if (dayInQuarter > 60) {
    phaseLabel = `نهاية الفصل (متبقي ${daysLeftInQuarter} يوماً للتحول)`;
  }

  return {
    year: rfYear,
    monthNum: monthObj.num,
    monthName: monthObj.name,
    day: dayInMonth,
    weekday: RAFIDAIN_WEEKDAYS[wkIdx],
    quarter: monthObj.quarter,
    quarterName: `الربع ${monthObj.quarter}`,
    seasonName: season.name,
    seasonIcon: season.icon,
    meaning: monthObj.meaning,
    climateNote: monthObj.climateNote,
    dayInQuarter,
    daysLeftInQuarter,
    nextQuarterName: season.nextQuarterName,
    phaseLabel,
    formattedDate: `${RAFIDAIN_WEEKDAYS[wkIdx]}، ${dayInMonth} ${monthObj.name} ${rfYear} RF`,
  };
}
