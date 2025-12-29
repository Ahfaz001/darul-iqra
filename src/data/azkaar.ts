// Authentic Azkaar from Hisnul Muslim (Fortress of the Muslim)
// All duas are sourced from authentic hadith collections

export interface Dhikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string; // English
  translationUrdu?: string;
  translationRoman?: string;
  reference: string;
  repetition?: number;
  virtue?: string;
  virtueUrdu?: string;
  virtueRoman?: string;
}

// Helper function to get translation based on language
export const getDhikrTranslation = (dhikr: Dhikr, language: 'en' | 'ur' | 'roman'): string => {
  if (language === 'ur' && dhikr.translationUrdu) return dhikr.translationUrdu;
  if (language === 'roman' && dhikr.translationRoman) return dhikr.translationRoman;
  return dhikr.translation; // fallback to English
};

export const getDhikrVirtue = (dhikr: Dhikr, language: 'en' | 'ur' | 'roman'): string | undefined => {
  if (language === 'ur' && dhikr.virtueUrdu) return dhikr.virtueUrdu;
  if (language === 'roman' && dhikr.virtueRoman) return dhikr.virtueRoman;
  return dhikr.virtue; // fallback to English
};

export interface AzkaarCategory {
  id: string;
  title: string;
  titleUrdu: string;
  titleRoman: string;
  titleArabic: string;
  icon: string;
  description: string;
  descriptionUrdu: string;
  descriptionRoman: string;
  duas: Dhikr[];
}

// Helper to get category title based on language
export const getCategoryTitle = (category: AzkaarCategory, language: 'en' | 'ur' | 'roman'): string => {
  if (language === 'ur') return category.titleUrdu || category.title;
  if (language === 'roman') return category.titleRoman || category.title;
  return category.title;
};

export const getCategoryDescription = (category: AzkaarCategory, language: 'en' | 'ur' | 'roman'): string => {
  if (language === 'ur') return category.descriptionUrdu || category.description;
  if (language === 'roman') return category.descriptionRoman || category.description;
  return category.description;
};

export const morningAzkaar: Dhikr[] = [
  {
    id: 'morning-1',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul mulku walahul hamd, wahuwa 'ala kulli shay'in qadeer",
    translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    translationUrdu: "ہم نے صبح کی اور اللہ کی بادشاہی نے بھی صبح کی۔ تمام تعریفیں اللہ کے لیے ہیں۔ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں۔ اسی کی بادشاہی ہے اور اسی کے لیے تعریف ہے اور وہ ہر چیز پر قادر ہے۔",
    translationRoman: "Hum ne subah ki aur Allah ki badshahi ne bhi subah ki. Tamam tareefen Allah ke liye hain. Allah ke siwa koi mabood nahi, woh akela hai, uska koi shareek nahi. Usi ki badshahi hai aur usi ke liye tareef hai aur woh har cheez par qaadir hai.",
    reference: "Abu Dawud 4:317",
    repetition: 1
  },
  {
    id: 'morning-2',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: "Allahumma bika asbahna, wabika amsayna, wabika nahya, wabika namootu wa ilaikan nushoor",
    translation: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.",
    translationUrdu: "اے اللہ! تیرے ہی ذریعے ہم نے صبح کی اور تیرے ہی ذریعے ہم نے شام کی، تیرے ہی ذریعے ہم جیتے ہیں اور تیرے ہی ذریعے ہم مرتے ہیں اور تیری ہی طرف اٹھ کر آنا ہے۔",
    translationRoman: "Aye Allah! Tere hi zariye hum ne subah ki aur tere hi zariye hum ne shaam ki, tere hi zariye hum jeete hain aur tere hi zariye hum marte hain aur teri hi taraf uth kar aana hai.",
    reference: "At-Tirmidhi 5:466",
    repetition: 1
  },
  {
    id: 'morning-3',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَـٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wawa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya, wa abu'u laka bidhanbi faghfir li fa innahu la yaghfirudh dhunuba illa ant",
    translation: "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide to Your covenant and promise as best I can, I take refuge in You from the evil of which I have committed. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
    translationUrdu: "اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں، اور میں اپنی طاقت کے مطابق تیرے عہد اور وعدے پر قائم ہوں، میں اپنے کیے ہوئے گناہوں کے شر سے تیری پناہ چاہتا ہوں، میں تیری نعمتوں کا اقرار کرتا ہوں اور اپنے گناہ کا اعتراف کرتا ہوں، پس مجھے معاف فرما، بیشک تیرے سوا کوئی گناہ نہیں بخشتا۔",
    translationRoman: "Aye Allah! Tu mera Rab hai, tere siwa koi mabood nahi, tu ne mujhe paida kiya aur mein tera banda hoon, aur mein apni taaqat ke mutabiq tere ahd aur waade par qaim hoon, mein apne kiye huay gunahon ke shar se teri panah chahta hoon, mein teri nematon ka iqrar karta hoon aur apne gunah ka aitraaf karta hoon, pas mujhe maaf farma, beshak tere siwa koi gunah nahi bakhshta.",
    reference: "Al-Bukhari 7:150",
    repetition: 1,
    virtue: "This is Sayyidul Istighfar (The Master of Seeking Forgiveness). Whoever says it during the day with firm faith and dies that day, will enter Paradise.",
    virtueUrdu: "یہ سید الاستغفار ہے۔ جو شخص دن میں یقین کے ساتھ پڑھے اور اسی دن مر جائے تو وہ جنت میں داخل ہوگا۔",
    virtueRoman: "Yeh Sayyidul Istighfar hai. Jo shakhs din mein yaqeen ke saath parhe aur usi din mar jaye to woh jannat mein daakhil hoga."
  },
  {
    id: 'morning-4',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: "Subhanallahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him.",
    translationUrdu: "اللہ پاک ہے اور اس کی تعریف کے ساتھ۔",
    translationRoman: "Allah paak hai aur uski tareef ke saath.",
    reference: "Muslim 4:2071",
    repetition: 100,
    virtue: "Whoever says this 100 times in the morning and evening, none will come on the Day of Resurrection with anything better, except one who said the same or more.",
    virtueUrdu: "جو شخص صبح و شام سو بار پڑھے، قیامت کے دن کوئی اس سے بہتر عمل لے کر نہیں آئے گا سوائے اس کے جس نے اتنا ہی یا اس سے زیادہ پڑھا ہو۔",
    virtueRoman: "Jo shakhs subah o shaam 100 baar parhe, qayamat ke din koi is se behtar amal le kar nahi aayega siwaye us ke jis ne itna hi ya is se zyada parha ho."
  },
  {
    id: 'morning-5',
    arabic: 'لَا إِلَـٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul mulku walahul hamd, wahuwa 'ala kulli shay'in qadeer",
    translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    translationUrdu: "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کے لیے تعریف ہے اور وہ ہر چیز پر قادر ہے۔",
    translationRoman: "Allah ke siwa koi mabood nahi, woh akela hai, uska koi shareek nahi, usi ki badshahi hai aur usi ke liye tareef hai aur woh har cheez par qaadir hai.",
    reference: "Al-Bukhari 4:95, Muslim 4:2071",
    repetition: 10,
    virtue: "Whoever says this 10 times will have the reward of freeing four slaves from the children of Ismail.",
    virtueUrdu: "جو شخص دس بار پڑھے اسے اولاد اسماعیل میں سے چار غلام آزاد کرنے کا ثواب ملے گا۔",
    virtueRoman: "Jo shakhs 10 baar parhe use awlad-e-Ismail mein se chaar ghulam azaad karne ka sawab milega."
  },
  {
    id: 'morning-6',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bikalimatillahit tammati min sharri ma khalaq",
    translation: "I seek refuge in Allah's perfect words from the evil of what He has created.",
    translationUrdu: "میں اللہ کے مکمل کلمات کی پناہ لیتا ہوں اس کی مخلوق کے شر سے۔",
    translationRoman: "Mein Allah ke mukammal kalimaat ki panah leta hoon uski makhlooq ke shar se.",
    reference: "Muslim 4:2081",
    repetition: 3
  },
  {
    id: 'morning-7',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil ladhi la yadurru ma'asmihi shay'un fil ardi wa la fis sama'i wa huwas sami'ul 'aleem",
    translation: "In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is The All-Seeing, The All-Knowing.",
    translationUrdu: "اللہ کے نام سے جس کے نام کے ساتھ زمین اور آسمان میں کوئی چیز نقصان نہیں پہنچا سکتی اور وہ سننے والا جاننے والا ہے۔",
    translationRoman: "Allah ke naam se jis ke naam ke saath zameen aur aasmaan mein koi cheez nuqsaan nahi pohoncha sakti aur woh sunne wala jaanne wala hai.",
    reference: "Abu Dawud 4:323, At-Tirmidhi 5:465",
    repetition: 3,
    virtue: "Whoever says it 3 times in the morning and evening, nothing will harm him.",
    virtueUrdu: "جو شخص صبح و شام تین بار پڑھے اسے کوئی چیز نقصان نہیں پہنچائے گی۔",
    virtueRoman: "Jo shakhs subah o shaam 3 baar parhe use koi cheez nuqsaan nahi pohonchaegi."
  },
  {
    id: 'morning-8',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
    transliteration: "Allahumma inni as'alukal 'afiyata fid dunya wal akhirah. Allahumma inni as'alukal 'afwa wal 'afiyata fi dini wa dunyaya wa ahli wa mali",
    translation: "O Allah, I ask You for pardon and well-being in this life and the next. O Allah, I ask You for pardon and well-being in my religious and worldly affairs, and my family and my wealth.",
    translationUrdu: "اے اللہ! میں تجھ سے دنیا اور آخرت میں عافیت مانگتا ہوں۔ اے اللہ! میں تجھ سے اپنے دین، دنیا، اہل اور مال میں معافی اور عافیت مانگتا ہوں۔",
    translationRoman: "Aye Allah! Mein tujh se duniya aur aakhirat mein aafiyat mangta hoon. Aye Allah! Mein tujh se apne deen, duniya, ahl aur maal mein maafi aur aafiyat mangta hoon.",
    reference: "Ibn Majah 2:332, Abu Dawud",
    repetition: 1
  },
  {
    id: 'morning-9',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَـٰهَ إِلَّا أَنْتَ',
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa ant",
    translation: "O Allah, grant my body health. O Allah, grant my hearing health. O Allah, grant my sight health. None has the right to be worshipped except You.",
    translationUrdu: "اے اللہ! میرے جسم کو عافیت دے۔ اے اللہ! میری سماعت کو عافیت دے۔ اے اللہ! میری بصارت کو عافیت دے۔ تیرے سوا کوئی معبود نہیں۔",
    translationRoman: "Aye Allah! Mere jism ko aafiyat de. Aye Allah! Meri samaat ko aafiyat de. Aye Allah! Meri basarat ko aafiyat de. Tere siwa koi mabood nahi.",
    reference: "Abu Dawud 4:324",
    repetition: 3
  },
  {
    id: 'morning-10',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa rabbul 'arshil 'azeem",
    translation: "Allah is Sufficient for me, none has the right to be worshipped except Him, upon Him I rely and He is Lord of the exalted throne.",
    translationUrdu: "اللہ میرے لیے کافی ہے، اس کے سوا کوئی معبود نہیں، اسی پر میں نے بھروسہ کیا اور وہ عرش عظیم کا رب ہے۔",
    translationRoman: "Allah mere liye kaafi hai, uske siwa koi mabood nahi, usi par mein ne bharosa kiya aur woh arsh-e-azeem ka Rab hai.",
    reference: "Abu Dawud 4:321",
    repetition: 7,
    virtue: "Allah will be sufficient for him in whatever concerns him of matters of this world and the hereafter.",
    virtueUrdu: "اللہ اس کے لیے دنیا اور آخرت کے تمام معاملات میں کافی ہو جائے گا۔",
    virtueRoman: "Allah uske liye duniya aur aakhirat ke tamam muamlaat mein kaafi ho jayega."
  }
];

export const eveningAzkaar: Dhikr[] = [
  {
    id: 'evening-1',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul mulku walahul hamd, wahuwa 'ala kulli shay'in qadeer",
    translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    translationUrdu: "ہم نے شام کی اور اللہ کی بادشاہی نے بھی شام کی۔ تمام تعریفیں اللہ کے لیے ہیں۔ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں۔ اسی کی بادشاہی ہے اور اسی کے لیے تعریف ہے اور وہ ہر چیز پر قادر ہے۔",
    translationRoman: "Hum ne shaam ki aur Allah ki badshahi ne bhi shaam ki. Tamam tareefen Allah ke liye hain. Allah ke siwa koi mabood nahi, woh akela hai, uska koi shareek nahi. Usi ki badshahi hai aur usi ke liye tareef hai aur woh har cheez par qaadir hai.",
    reference: "Abu Dawud 4:317",
    repetition: 1
  },
  {
    id: 'evening-2',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    transliteration: "Allahumma bika amsayna, wabika asbahna, wabika nahya, wabika namootu wa ilaikal maseer",
    translation: "O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our final return.",
    translationUrdu: "اے اللہ! تیرے ہی ذریعے ہم نے شام کی اور تیرے ہی ذریعے ہم نے صبح کی، تیرے ہی ذریعے ہم جیتے ہیں اور تیرے ہی ذریعے ہم مرتے ہیں اور تیری ہی طرف لوٹنا ہے۔",
    translationRoman: "Aye Allah! Tere hi zariye hum ne shaam ki aur tere hi zariye hum ne subah ki, tere hi zariye hum jeete hain aur tere hi zariye hum marte hain aur teri hi taraf lautna hai.",
    reference: "At-Tirmidhi 5:466",
    repetition: 1
  },
  {
    id: 'evening-3',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bikalimatillahit tammati min sharri ma khalaq",
    translation: "I seek refuge in Allah's perfect words from the evil of what He has created.",
    translationUrdu: "میں اللہ کے مکمل کلمات کی پناہ لیتا ہوں اس کی مخلوق کے شر سے۔",
    translationRoman: "Mein Allah ke mukammal kalimaat ki panah leta hoon uski makhlooq ke shar se.",
    reference: "Muslim 4:2081",
    repetition: 3
  },
  {
    id: 'evening-4',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ، وَقَهْرِ الرِّجَالِ',
    transliteration: "Allahumma inni a'udhu bika minal hammi wal hazan, wa a'udhu bika minal 'ajzi wal kasal, wa a'udhu bika minal jubni wal bukhl, wa a'udhu bika min ghalabatid dayn wa qahrir rijal",
    translation: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
    translationUrdu: "اے اللہ! میں تیری پناہ چاہتا ہوں فکر اور غم سے، کمزوری اور سستی سے، بزدلی اور بخل سے، اور قرض کے بوجھ اور لوگوں کے غلبے سے۔",
    translationRoman: "Aye Allah! Mein teri panah chahta hoon fikr aur gham se, kamzori aur susti se, buzdili aur bukhl se, aur qarz ke bojh aur logon ke ghalbe se.",
    reference: "Al-Bukhari 7:158",
    repetition: 1
  },
  {
    id: 'evening-5',
    arabic: 'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَـٰهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ',
    transliteration: "Allahumma 'alimal ghaybi wash shahadati fatiris samawati wal ard, rabba kulli shay'in wa maleekah, ashhadu an la ilaha illa ant, a'udhu bika min sharri nafsi wa min sharrish shaytani wa shirkihi",
    translation: "O Allah, Knower of the unseen and the seen, Creator of the heavens and the Earth, Lord and Sovereign of all things, I bear witness that none has the right to be worshipped except You. I seek refuge in You from the evil of my soul and from the evil and shirk of the devil.",
    translationUrdu: "اے اللہ! غیب اور حاضر کے جاننے والے، آسمانوں اور زمین کو پیدا کرنے والے، ہر چیز کے رب اور مالک، میں گواہی دیتا ہوں کہ تیرے سوا کوئی معبود نہیں۔ میں اپنے نفس کے شر سے اور شیطان کے شر اور شرک سے تیری پناہ چاہتا ہوں۔",
    translationRoman: "Aye Allah! Ghaib aur haazir ke jaanne wale, aasmaanon aur zameen ko paida karne wale, har cheez ke Rab aur Maalik, mein gawahi deta hoon ke tere siwa koi mabood nahi. Mein apne nafs ke shar se aur shaitaan ke shar aur shirk se teri panah chahta hoon.",
    reference: "Abu Dawud 4:317",
    repetition: 1
  },
  {
    id: 'evening-6',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: "Subhanallahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him.",
    translationUrdu: "اللہ پاک ہے اور اس کی تعریف کے ساتھ۔",
    translationRoman: "Allah paak hai aur uski tareef ke saath.",
    reference: "Muslim 4:2071",
    repetition: 100,
    virtue: "Whoever says this 100 times in the morning and evening, none will come on the Day of Resurrection with anything better.",
    virtueUrdu: "جو شخص صبح و شام سو بار پڑھے، قیامت کے دن کوئی اس سے بہتر عمل لے کر نہیں آئے گا۔",
    virtueRoman: "Jo shakhs subah o shaam 100 baar parhe, qayamat ke din koi is se behtar amal le kar nahi aayega."
  },
  {
    id: 'evening-7',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullaha wa atubu ilayhi",
    translation: "I seek Allah's forgiveness and turn to Him in repentance.",
    translationUrdu: "میں اللہ سے مغفرت چاہتا ہوں اور اس کی طرف توبہ کرتا ہوں۔",
    translationRoman: "Mein Allah se maghfirat chahta hoon aur uski taraf tauba karta hoon.",
    reference: "Al-Bukhari, Muslim",
    repetition: 100
  }
];

export const sleepingDuas: Dhikr[] = [
  {
    id: 'sleep-1',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: "Bismika Allahumma amutu wa ahya",
    translation: "In Your name O Allah, I die and I live.",
    translationUrdu: "اے اللہ! تیرے نام سے میں مرتا ہوں اور جیتا ہوں۔",
    translationRoman: "Aye Allah! Tere naam se mein marta hoon aur jeeta hoon.",
    reference: "Al-Bukhari 11:113",
    repetition: 1
  },
  {
    id: 'sleep-2',
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    translation: "O Allah, protect me from Your punishment on the day Your servants are resurrected.",
    translationUrdu: "اے اللہ! مجھے اپنے عذاب سے بچا اس دن جب تو اپنے بندوں کو اٹھائے گا۔",
    translationRoman: "Aye Allah! Mujhe apne azaab se bacha us din jab tu apne bandon ko uthayega.",
    reference: "Abu Dawud 4:311",
    repetition: 3
  },
  {
    id: 'sleep-3',
    arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    transliteration: "Bismika rabbi wada'tu janbi, wa bika arfa'uh, fa in amsakta nafsi farhamha, wa in arsaltaha fahfazha bima tahfazu bihi 'ibadakas saliheen",
    translation: "In Your name my Lord, I lie down and in Your name I rise, so if You should take my soul then have mercy upon it, and if You should return my soul then protect it in the manner You do so with Your righteous servants.",
    translationUrdu: "اے میرے رب! تیرے نام سے میں نے اپنا پہلو رکھا اور تیرے ہی نام سے اٹھاؤں گا۔ اگر تو میری جان قبض کر لے تو اس پر رحم فرما، اور اگر واپس کر دے تو اسے ایسے محفوظ رکھ جیسے تو اپنے نیک بندوں کو محفوظ رکھتا ہے۔",
    translationRoman: "Aye mere Rab! Tere naam se mein ne apna pehlu rakha aur tere hi naam se uthaunga. Agar tu meri jaan qabz kar le to us par reham farma, aur agar wapas kar de to use aise mehfooz rakh jaise tu apne nek bandon ko mehfooz rakhta hai.",
    reference: "Al-Bukhari 11:126, Muslim 4:2083",
    repetition: 1
  },
  {
    id: 'sleep-4',
    arabic: 'اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ',
    transliteration: "Allahumma innaka khalaqta nafsi wa anta tawaffaha, laka mamatuha wa mahyaha, in ahyaytaha fahfazha, wa in amattaha faghfir laha, Allahumma inni as'alukal 'afiyah",
    translation: "O Allah, verily You have created my soul and You shall take its life, to You belongs its life and death. If You should keep my soul alive then protect it, and if You should take its life then forgive it. O Allah, I ask You to grant me good health.",
    translationUrdu: "اے اللہ! تو نے میری جان پیدا کی اور تو ہی اسے وفات دے گا۔ اس کی موت اور زندگی تیرے لیے ہے۔ اگر تو اسے زندہ رکھے تو محفوظ رکھ، اور اگر موت دے تو بخش دے۔ اے اللہ! میں تجھ سے عافیت مانگتا ہوں۔",
    translationRoman: "Aye Allah! Tu ne meri jaan paida ki aur tu hi use wafat dega. Uski maut aur zindagi tere liye hai. Agar tu use zinda rakhe to mehfooz rakh, aur agar maut de to bakhsh de. Aye Allah! Mein tujh se aafiyat mangta hoon.",
    reference: "Muslim 4:2083",
    repetition: 1
  },
  {
    id: 'sleep-5',
    arabic: 'اللَّهُمَّ رَبَّ السَّمَاوَاتِ وَرَبَّ الْأَرْضِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَىٰ، وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ',
    transliteration: "Allahumma rabbas samawati wa rabbal ardi wa rabbal 'arshil 'azeem, rabbana wa rabba kulli shay', faliqal habbi wannawa, wa munzilat tawrati wal injeel wal furqan, a'udhu bika min sharri kulli shay'in anta akhidhun binasiyatih",
    translation: "O Allah, Lord of the heavens, Lord of the earth and Lord of the exalted throne, our Lord and Lord of all things, Splitter of the seed and the date stone, Revealer of the Torah, the Injeel and the Furqan (Quran), I seek refuge in You from the evil of all things You shall seize by the forelock.",
    translationUrdu: "اے اللہ! آسمانوں کے رب، زمین کے رب، عرش عظیم کے رب، ہمارے رب اور ہر چیز کے رب، دانے اور گٹھلی کو پھاڑنے والے، تورات، انجیل اور فرقان نازل کرنے والے، میں ہر اس چیز کے شر سے تیری پناہ چاہتا ہوں جس کی پیشانی تیرے قبضے میں ہے۔",
    translationRoman: "Aye Allah! Aasmaanon ke Rab, zameen ke Rab, arsh-e-azeem ke Rab, hamare Rab aur har cheez ke Rab, daane aur guthli ko phaadne wale, Taurah, Injeel aur Furqan nazil karne wale, mein har us cheez ke shar se teri panah chahta hoon jis ki peshani tere qabze mein hai.",
    reference: "Muslim 4:2084",
    repetition: 1
  },
  {
    id: 'sleep-6',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا، وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ',
    transliteration: "Alhamdu lillahil ladhi at'amana wa saqana, wa kafana, wa awana, fakam mimman la kafiya lahu wa la mu'wi",
    translation: "All praise is for Allah, Who fed us and gave us drink, and Who is sufficient for us and has sheltered us, for how many have none to suffice them or shelter them.",
    translationUrdu: "تمام تعریف اللہ کے لیے ہے جس نے ہمیں کھلایا اور پلایا، ہمارے لیے کافی ہوا اور ہمیں ٹھکانا دیا، کیونکہ کتنے ہی لوگ ہیں جن کا کوئی کافی نہیں اور نہ کوئی پناہ دینے والا۔",
    translationRoman: "Tamam tareef Allah ke liye hai jis ne hamein khilaya aur pilaya, hamare liye kaafi hua aur hamein thikana diya, kyunke kitne hi log hain jin ka koi kaafi nahi aur na koi panah dene wala.",
    reference: "Muslim 4:2085",
    repetition: 1
  },
  {
    id: 'sleep-7',
    arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ',
    transliteration: "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu zahri ilayk, raghbatan wa rahbatan ilayk, la malja'a wa la manja minka illa ilayk, amantu bikitabikal ladhi anzalt, wa binabiyyikal ladhi arsalt",
    translation: "O Allah, I submit my soul unto You, and I entrust my affair unto You, and I turn my face towards You, and I take refuge in You, out of desire and fear of You. There is no refuge from You and no sanctuary from You except with You. I believe in Your Book which You have revealed and in Your Prophet whom You have sent.",
    translationUrdu: "اے اللہ! میں نے اپنی جان تجھے سونپ دی، اپنا معاملہ تیرے سپرد کر دیا، اپنا چہرہ تیری طرف کر لیا، اپنی پشت تیری طرف لگا دی، تیری رغبت اور خوف میں۔ تیری طرف سے کوئی پناہ نہیں اور کوئی نجات نہیں سوائے تیرے۔ میں تیری کتاب پر ایمان لایا جو تو نے نازل کی اور تیرے نبی پر جنہیں تو نے بھیجا۔",
    translationRoman: "Aye Allah! Mein ne apni jaan tujhe sonp di, apna muamla tere supurd kar diya, apna chehra teri taraf kar liya, apni pusht teri taraf laga di, teri raghbat aur khauf mein. Teri taraf se koi panah nahi aur koi nijaat nahi siwaye tere. Mein teri kitab par imaan laya jo tu ne nazil ki aur tere Nabi par jinhein tu ne bheja.",
    reference: "Al-Bukhari 11:113, Muslim 4:2081",
    repetition: 1,
    virtue: "If you die that night, you die upon the fitrah (natural state of Islam).",
    virtueUrdu: "اگر اس رات مر جائے تو فطرت (اسلام کی فطری حالت) پر مرے گا۔",
    virtueRoman: "Agar us raat mar jaye to fitrat (Islam ki fitri halat) par marega."
  }
];

export const wakingDuas: Dhikr[] = [
  {
    id: 'wake-1',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdu lillahil ladhi ahyana ba'da ma amatana wa ilayhin nushoor",
    translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    translationUrdu: "تمام تعریف اللہ کے لیے ہے جس نے ہمیں زندگی دی ہماری موت کے بعد اور اسی کی طرف اٹھنا ہے۔",
    translationRoman: "Tamam tareef Allah ke liye hai jis ne hamein zindagi di hamari maut ke baad aur usi ki taraf uthna hai.",
    reference: "Al-Bukhari 11:113",
    repetition: 1
  },
  {
    id: 'wake-2',
    arabic: 'لَا إِلَـٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَـٰهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul mulku wa lahul hamd, wa huwa 'ala kulli shay'in qadeer. Subhanallah, walhamdu lillah, wa la ilaha illallah, wallahu akbar, wa la hawla wa la quwwata illa billahil 'aliyyil 'azeem",
    translation: "None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent. Glory is to Allah, and praise is to Allah, and none has the right to be worshipped except Allah, and Allah is the greatest, and there is no might nor power except with Allah, the Most High, the Most Great.",
    translationUrdu: "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کے لیے تعریف ہے، اور وہ ہر چیز پر قادر ہے۔ سبحان اللہ، الحمد للہ، اللہ کے سوا کوئی معبود نہیں، اللہ سب سے بڑا ہے، اور اللہ بلند و بالا کے بغیر کوئی طاقت اور قوت نہیں۔",
    translationRoman: "Allah ke siwa koi mabood nahi, woh akela hai, uska koi shareek nahi, usi ki badshahi hai aur usi ke liye tareef hai, aur woh har cheez par qaadir hai. Subhanallah, Alhamdulillah, Allah ke siwa koi mabood nahi, Allah sab se bara hai, aur Allah buland o bala ke baghair koi taaqat aur quwwat nahi.",
    reference: "Al-Bukhari, Ibn Majah",
    repetition: 1,
    virtue: "Whoever wakes at night and says this, then supplicates, his supplication will be answered. If he makes wudu and prays, his prayer will be accepted.",
    virtueUrdu: "جو رات کو جاگ کر یہ پڑھے پھر دعا کرے، اس کی دعا قبول ہوگی۔ اگر وضو کر کے نماز پڑھے تو اس کی نماز قبول ہوگی۔",
    virtueRoman: "Jo raat ko jaag kar yeh parhe phir dua kare, uski dua qabool hogi. Agar wuzu kar ke namaz parhe to uski namaz qabool hogi."
  },
  {
    id: 'wake-3',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ',
    transliteration: "Alhamdu lillahil ladhi 'afani fi jasadi, wa radda 'alayya ruhi, wa adhina li bidhikrihi",
    translation: "All praise is for Allah who restored to me my health, returned my soul and permitted me to remember Him.",
    translationUrdu: "تمام تعریف اللہ کے لیے ہے جس نے میرے جسم کو عافیت دی، میری روح واپس کی اور مجھے اپنا ذکر کرنے کی اجازت دی۔",
    translationRoman: "Tamam tareef Allah ke liye hai jis ne mere jism ko aafiyat di, meri rooh wapas ki aur mujhe apna zikr karne ki ijazat di.",
    reference: "At-Tirmidhi 5:473",
    repetition: 1
  }
];

export const generalDuas: Dhikr[] = [
  {
    id: 'general-1',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: "La hawla wa la quwwata illa billah",
    translation: "There is no might nor power except with Allah.",
    translationUrdu: "اللہ کے سوا کوئی طاقت اور قوت نہیں۔",
    translationRoman: "Allah ke siwa koi taaqat aur quwwat nahi.",
    reference: "Al-Bukhari 7:158, Muslim 4:2076",
    virtue: "A treasure from the treasures of Paradise.",
    virtueUrdu: "جنت کے خزانوں میں سے ایک خزانہ ہے۔",
    virtueRoman: "Jannat ke khazanon mein se aik khazana hai."
  },
  {
    id: 'general-2',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: "Subhanallahi wa bihamdihi, Subhanallahil 'azeem",
    translation: "Glory be to Allah and praise Him, Glory be to Allah the Almighty.",
    translationUrdu: "اللہ پاک ہے اور اس کی تعریف کے ساتھ، اللہ عظیم پاک ہے۔",
    translationRoman: "Allah paak hai aur uski tareef ke saath, Allah Azeem paak hai.",
    reference: "Al-Bukhari 7:168, Muslim 4:2072",
    virtue: "Two phrases which are light on the tongue, heavy on the scales and beloved to the Most Merciful.",
    virtueUrdu: "دو کلمے جو زبان پر ہلکے، میزان میں بھاری اور رحمان کو بہت پیارے ہیں۔",
    virtueRoman: "Do kalmay jo zuban par halke, meezan mein bhari aur Rahman ko bohat pyare hain."
  },
  {
    id: 'general-3',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbana atina fid dunya hasanatan wa fil akhirati hasanatan wa qina 'adhaaban naar",
    translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
    translationUrdu: "اے ہمارے رب! ہمیں دنیا میں بھلائی دے اور آخرت میں بھی بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔",
    translationRoman: "Aye hamare Rab! Hamein duniya mein bhalai de aur aakhirat mein bhi bhalai de aur hamein aag ke azaab se bacha.",
    reference: "Al-Baqarah 2:201"
  },
  {
    id: 'general-4',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَىٰ وَالتُّقَىٰ وَالْعَفَافَ وَالْغِنَىٰ',
    transliteration: "Allahumma inni as'alukal huda wat tuqa wal 'afafa wal ghina",
    translation: "O Allah, I ask You for guidance, piety, chastity and self-sufficiency.",
    translationUrdu: "اے اللہ! میں تجھ سے ہدایت، تقویٰ، پاکدامنی اور بے نیازی مانگتا ہوں۔",
    translationRoman: "Aye Allah! Mein tujh se hidayat, taqwa, pakdamni aur be-niyazi mangta hoon.",
    reference: "Muslim 4:2087"
  },
  {
    id: 'general-5',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ',
    transliteration: "Allahumma a'inni 'ala dhikrika, wa shukrika, wa husni 'ibadatik",
    translation: "O Allah, help me to remember You, to thank You, and to worship You in the best of manners.",
    translationUrdu: "اے اللہ! میری مدد فرما تیرا ذکر کرنے میں، تیرا شکر ادا کرنے میں اور اچھی عبادت کرنے میں۔",
    translationRoman: "Aye Allah! Meri madad farma tera zikr karne mein, tera shukar ada karne mein aur achhi ibadat karne mein.",
    reference: "Abu Dawud 2:86, An-Nasa'i"
  },
  {
    id: 'general-6',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    transliteration: "Rabbighfir li wa tub 'alayya innaka antat tawwabur raheem",
    translation: "My Lord, forgive me and accept my repentance, You are the Ever-Returning, Ever-Merciful.",
    translationUrdu: "اے میرے رب! مجھے بخش دے اور میری توبہ قبول فرما، بیشک تو بہت توبہ قبول کرنے والا رحم کرنے والا ہے۔",
    translationRoman: "Aye mere Rab! Mujhe bakhsh de aur meri tauba qabool farma, beshak tu bohat tauba qabool karne wala reham karne wala hai.",
    reference: "Abu Dawud, At-Tirmidhi",
    repetition: 100
  },
  {
    id: 'general-7',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad, kama sallayta 'ala Ibrahim wa 'ala ali Ibrahim, innaka hameedun majeed",
    translation: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy, Glorious.",
    translationUrdu: "اے اللہ! محمد ﷺ پر اور آل محمد پر رحمت نازل فرما جیسے تو نے ابراہیم اور آل ابراہیم پر رحمت نازل فرمائی۔ بیشک تو قابل تعریف اور بزرگی والا ہے۔",
    translationRoman: "Aye Allah! Muhammad ﷺ par aur aal-e-Muhammad par rehmat nazil farma jaise tu ne Ibrahim aur aal-e-Ibrahim par rehmat nazil farmai. Beshak tu qabil-e-tareef aur buzurgi wala hai.",
    reference: "Al-Bukhari 3:1233"
  },
  {
    id: 'general-8',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَـٰهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullaha al-'azeema alladhi la ilaha illa huwal hayyul qayyum wa atubu ilayh",
    translation: "I seek forgiveness from Allah, the Mighty, whom there is no god but He, the Living, the Sustainer, and I repent to Him.",
    translationUrdu: "میں اللہ عظیم سے مغفرت چاہتا ہوں جس کے سوا کوئی معبود نہیں، زندہ، قائم رکھنے والا اور میں اس کی طرف توبہ کرتا ہوں۔",
    translationRoman: "Mein Allah Azeem se maghfirat chahta hoon jis ke siwa koi mabood nahi, zinda, qaim rakhne wala aur mein uski taraf tauba karta hoon.",
    reference: "Abu Dawud 2:85, At-Tirmidhi 5:569"
  },
  {
    id: 'general-9',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ',
    transliteration: "Ya hayyu ya qayyum birahmatika astaghith, aslih li sha'ni kullahu, wa la takilni ila nafsi tarfata 'ayn",
    translation: "O Ever-Living, O Self-Sustaining, by Your mercy I seek assistance. Rectify for me all of my affairs and do not leave me to myself, even for the blink of an eye.",
    translationUrdu: "اے زندہ، اے قائم رکھنے والے، تیری رحمت سے میں فریاد کرتا ہوں۔ میرے تمام معاملات درست فرما دے اور مجھے پلک جھپکنے کے لیے بھی میرے نفس کے سپرد نہ کر۔",
    translationRoman: "Aye Zinda, Aye Qaim rakhne wale, teri rehmat se mein faryad karta hoon. Mere tamam muamlaat durust farma de aur mujhe palak jhapakne ke liye bhi mere nafs ke supurd na kar.",
    reference: "Al-Hakim",
    virtue: "The Prophet ﷺ taught Fatimah (RA) to say this morning and evening.",
    virtueUrdu: "نبی ﷺ نے فاطمہ رضی اللہ عنہا کو صبح و شام یہ پڑھنا سکھایا۔",
    virtueRoman: "Nabi ﷺ ne Fatimah Razi Allah anha ko subah o shaam yeh parhna sikhaya."
  },
  {
    id: 'general-10',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَـٰهَ إِلَّا أَنْتَ',
    transliteration: "Allahumma inni a'udhu bika minal kufri wal faqr, wa a'udhu bika min 'adhabil qabr, la ilaha illa ant",
    translation: "O Allah, I seek refuge in You from disbelief and poverty, and I seek refuge in You from the punishment of the grave. None has the right to be worshipped except You.",
    translationUrdu: "اے اللہ! میں کفر اور فقر سے تیری پناہ چاہتا ہوں، اور عذاب قبر سے تیری پناہ چاہتا ہوں۔ تیرے سوا کوئی معبود نہیں۔",
    translationRoman: "Aye Allah! Mein kufr aur faqr se teri panah chahta hoon, aur azaab-e-qabr se teri panah chahta hoon. Tere siwa koi mabood nahi.",
    reference: "Abu Dawud 4:324",
    repetition: 3
  }
];

// Salah (Prayer) Duas - Before, During, and After Prayer
export const salahDuas: Dhikr[] = [
  {
    id: 'salah-1',
    arabic: 'اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ',
    transliteration: "Allahumma ba'id bayni wa bayna khatayaya kama ba'adta baynal mashriqi wal maghrib. Allahumma naqqini min khatayaya kama yunaqqath thawbul abyadu minad danas. Allahummaghsilni min khatayaya bil ma'i wath thalji wal barad",
    translation: "O Allah, distance me from my sins as You have distanced the East from the West. O Allah, purify me from my sins as a white garment is purified from filth. O Allah, wash away my sins with water, snow and ice.",
    reference: "Al-Bukhari 1:181, Muslim 1:419",
    virtue: "Dua at the opening of prayer"
  },
  {
    id: 'salah-2',
    arabic: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَىٰ جَدُّكَ، وَلَا إِلَـٰهَ غَيْرُكَ',
    transliteration: "Subhanakallahumma wa bihamdika, wa tabarakasmuka, wa ta'ala jadduka, wa la ilaha ghayruk",
    translation: "Glory is to You, O Allah, and praise. Blessed is Your Name and exalted is Your majesty. There is none worthy of worship but You.",
    reference: "Abu Dawud 1:775, At-Tirmidhi 2:243",
    virtue: "Opening supplication in prayer"
  },
  {
    id: 'salah-3',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
    transliteration: "Subhana rabbiyal 'azeem",
    translation: "Glory is to my Lord, the Almighty.",
    reference: "Muslim 1:772",
    repetition: 3,
    virtue: "Said during ruku (bowing)"
  },
  {
    id: 'salah-4',
    arabic: 'سَمِعَ اللهُ لِمَنْ حَمِدَهُ',
    transliteration: "Sami'allahu liman hamidah",
    translation: "Allah hears whoever praises Him.",
    reference: "Al-Bukhari 1:689",
    virtue: "Said when rising from ruku"
  },
  {
    id: 'salah-5',
    arabic: 'رَبَّنَا وَلَكَ الْحَمْدُ، حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ',
    transliteration: "Rabbana wa lakal hamd, hamdan katheeran tayyiban mubarakan feeh",
    translation: "Our Lord, and to You is all praise, much good and blessed praise.",
    reference: "Al-Bukhari 1:799",
    virtue: "Said after rising from ruku"
  },
  {
    id: 'salah-6',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ',
    transliteration: "Subhana rabbiyal a'la",
    translation: "Glory is to my Lord, the Most High.",
    reference: "Muslim 1:772",
    repetition: 3,
    virtue: "Said during sujood (prostration)"
  },
  {
    id: 'salah-7',
    arabic: 'رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي',
    transliteration: "Rabbighfir li, Rabbighfir li",
    translation: "My Lord, forgive me. My Lord, forgive me.",
    reference: "Abu Dawud 1:874",
    virtue: "Said while sitting between the two prostrations"
  },
  {
    id: 'salah-8',
    arabic: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَـٰهَ إِلَّا اللهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: "Attahiyyatu lillahi wassalawatu wattayyibat, assalamu 'alayka ayyuhan nabiyyu wa rahmatullahi wa barakatuh, assalamu 'alayna wa 'ala 'ibadillahis saliheen, ashhadu an la ilaha illallah, wa ashhadu anna Muhammadan 'abduhu wa rasooluh",
    translation: "All greetings, prayers and pure words are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings. Peace be upon us and upon the righteous servants of Allah. I bear witness that there is none worthy of worship except Allah, and I bear witness that Muhammad is His servant and Messenger.",
    reference: "Al-Bukhari 1:831, Muslim 1:402",
    virtue: "At-Tashahhud - recited in sitting position"
  },
  {
    id: 'salah-9',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ جَهَنَّمَ، وَمِنْ عَذَابِ الْقَبْرِ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ',
    transliteration: "Allahumma inni a'udhu bika min 'adhabi jahannama, wa min 'adhabil qabri, wa min fitnatil mahya wal mamati, wa min sharri fitnatil maseehid dajjal",
    translation: "O Allah, I seek refuge in You from the punishment of Hell, from the punishment of the grave, from the trials of life and death, and from the evil of the trial of the False Messiah.",
    reference: "Al-Bukhari 2:102, Muslim 1:588",
    virtue: "Recited before tasleem (ending the prayer)"
  },
  {
    id: 'salah-10',
    arabic: 'أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ، أَسْتَغْفِرُ اللَّهَ',
    transliteration: "Astaghfirullah, Astaghfirullah, Astaghfirullah",
    translation: "I seek Allah's forgiveness. I seek Allah's forgiveness. I seek Allah's forgiveness.",
    reference: "Muslim 1:591",
    repetition: 3,
    virtue: "Said immediately after completing the prayer"
  },
  {
    id: 'salah-11',
    arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
    transliteration: "Allahumma antas salam wa minkas salam, tabarakta ya dhal jalali wal ikram",
    translation: "O Allah, You are Peace and from You is peace. Blessed are You, O Owner of majesty and honor.",
    reference: "Muslim 1:592",
    virtue: "Said after completing the prayer"
  },
  {
    id: 'salah-12',
    arabic: 'سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَاللهُ أَكْبَرُ',
    transliteration: "Subhanallah, Alhamdulillah, Allahu Akbar",
    translation: "Glory is to Allah. Praise is to Allah. Allah is the Greatest.",
    reference: "Muslim 1:596",
    repetition: 33,
    virtue: "Said 33 times each after every obligatory prayer"
  },
  {
    id: 'salah-13',
    arabic: 'آيَةُ الْكُرْسِيِّ: اللهُ لَا إِلَـٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا، وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: "Ayatul Kursi: Allahu la ilaha illa huwal hayyul qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis samawati wa ma fil ard, man dhal ladhi yashfa'u 'indahu illa bi idhnih, ya'lamu ma bayna aydeehim wa ma khalfahum, wa la yuheetuna bi shay'im min 'ilmihi illa bima sha', wasi'a kursiyyuhus samawati wal ard, wa la ya'uduhu hifzuhuma, wa huwal 'aliyyul 'azeem",
    translation: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of [all] existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is [presently] before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
    reference: "An-Nasa'i, Al-Hakim",
    virtue: "Whoever recites this after every obligatory prayer, nothing prevents him from entering Paradise except death."
  }
];

// Eating and Drinking Duas
export const eatingDuas: Dhikr[] = [
  {
    id: 'eating-1',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: "Bismillah",
    translation: "In the name of Allah.",
    reference: "At-Tirmidhi 4:288, Abu Dawud 3:347",
    virtue: "Said before eating"
  },
  {
    id: 'eating-2',
    arabic: 'بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ',
    transliteration: "Bismillahi fi awwalihi wa akhirih",
    translation: "In the name of Allah at its beginning and at its end.",
    reference: "Abu Dawud 3:347, At-Tirmidhi 4:288",
    virtue: "Said if you forgot to say Bismillah at the beginning"
  },
  {
    id: 'eating-3',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَـٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: "Alhamdu lillahil ladhi at'amani hadha wa razaqaneehi min ghayri hawlin minni wa la quwwah",
    translation: "Praise is to Allah Who has given me this food and sustained me with it though I was unable to do it and powerless.",
    reference: "At-Tirmidhi 5:507, Abu Dawud 4:42",
    virtue: "All previous sins are forgiven for the one who says this after eating"
  },
  {
    id: 'eating-4',
    arabic: 'الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ، غَيْرَ مَكْفِيٍّ وَلَا مُوَدَّعٍ، وَلَا مُسْتَغْنًى عَنْهُ رَبَّنَا',
    transliteration: "Alhamdu lillahi hamdan katheeran tayyiban mubarakan feeh, ghayra makfiyyin wa la muwadda'in wa la mustaghnan 'anhu rabbana",
    translation: "Praise is to Allah, much good and blessed praise, not [praise that is] insufficient, or unattainable, or that we can dispense with, O our Lord.",
    reference: "Al-Bukhari 6:214",
    virtue: "Said after eating"
  },
  {
    id: 'eating-5',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَأَطْعِمْنَا خَيْرًا مِنْهُ',
    transliteration: "Allahumma barik lana feehi wa at'imna khayran minhu",
    translation: "O Allah, bless us in it and feed us with something better than it.",
    reference: "Abu Dawud 3:358, At-Tirmidhi 5:506",
    virtue: "Said after drinking milk"
  },
  {
    id: 'eating-6',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيهِ وَزِدْنَا مِنْهُ',
    transliteration: "Allahumma barik lana feehi wa zidna minhu",
    translation: "O Allah, bless us in it and give us more of it.",
    reference: "At-Tirmidhi 5:506",
    virtue: "Said after drinking milk (alternative dua)"
  },
  {
    id: 'eating-7',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: "Alhamdu lillahil ladhi at'amana wa saqana wa ja'alana muslimeen",
    translation: "Praise is to Allah Who has fed us and given us drink and made us Muslims.",
    reference: "Abu Dawud 3:385, At-Tirmidhi 5:516",
    virtue: "General dua after eating and drinking"
  },
  {
    id: 'eating-8',
    arabic: 'اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي، وَاسْقِ مَنْ سَقَانِي',
    transliteration: "Allahumma at'im man at'amani, wasqi man saqani",
    translation: "O Allah, feed the one who has fed me and give drink to the one who has given me drink.",
    reference: "Muslim 3:1626",
    virtue: "Dua for the host"
  }
];

// Travel Duas
export const travelDuas: Dhikr[] = [
  {
    id: 'travel-1',
    arabic: 'اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَـٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: "Allahu Akbar, Allahu Akbar, Allahu Akbar. Subhanal ladhi sakhkhara lana hadha wa ma kunna lahu muqrineen, wa inna ila rabbina lamunqaliboon",
    translation: "Allah is the Greatest, Allah is the Greatest, Allah is the Greatest. Glory is to Him Who has subjected this to us, and we could never have it (by our efforts), and to our Lord we shall return.",
    reference: "Muslim 2:978, At-Tirmidhi 5:501",
    virtue: "Said when riding a vehicle or mount for travel"
  },
  {
    id: 'travel-2',
    arabic: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَـٰذَا الْبِرَّ وَالتَّقْوَىٰ، وَمِنَ الْعَمَلِ مَا تَرْضَىٰ، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَـٰذَا، وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ',
    transliteration: "Allahumma inna nas'aluka fi safarina hadhal birra wat taqwa, wa minal 'amali ma tarda. Allahumma hawwin 'alayna safarana hadha, watwi 'anna bu'dahu. Allahumma antas sahibu fis safar, wal khaleefatu fil ahl",
    translation: "O Allah, we ask You on this our journey for goodness and piety, and for works that are pleasing to You. O Allah, lighten this journey for us and make its distance easy for us. O Allah, You are our Companion on the road and the One in Whose care we leave our family.",
    reference: "Muslim 2:978",
    virtue: "Complete travel supplication"
  },
  {
    id: 'travel-3',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ وَعْثَاءِ السَّفَرِ، وَكَآبَةِ الْمَنْظَرِ، وَسُوءِ الْمُنْقَلَبِ فِي الْمَالِ وَالْأَهْلِ',
    transliteration: "Allahumma inni a'udhu bika min wa'tha'is safar, wa ka'abatil manzar, wa su'il munqalabi fil mali wal ahl",
    translation: "O Allah, I seek refuge in You from the difficulties of travel, from having a change of heart and being in a bad situation, and from a bad return in wealth and family.",
    reference: "Muslim 2:978",
    virtue: "Part of the travel supplication"
  },
  {
    id: 'travel-4',
    arabic: 'آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ',
    transliteration: "Ayibuna, ta'ibuna, 'abiduna, lirabbina hamidoon",
    translation: "We return, repentant, worshipping and praising our Lord.",
    reference: "Muslim 2:978",
    virtue: "Said when returning from travel"
  },
  {
    id: 'travel-5',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bikalimatillahit tammati min sharri ma khalaq",
    translation: "I seek refuge in Allah's perfect words from the evil of what He has created.",
    reference: "Muslim 4:2081",
    virtue: "Said when stopping at a place during travel for protection"
  },
  {
    id: 'travel-6',
    arabic: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: "Bismillah, tawakkaltu 'alallah, wa la hawla wa la quwwata illa billah",
    translation: "In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.",
    reference: "Abu Dawud 4:325, At-Tirmidhi 5:490",
    virtue: "Said when leaving the house for any travel or trip"
  },
  {
    id: 'travel-7',
    arabic: 'اللَّهُمَّ إِنِّي أَسْتَوْدِعُكَ أَهْلِي وَمَالِي وَدِينِي وَخَوَاتِيمَ عَمَلِي',
    transliteration: "Allahumma inni astawdi'uka ahli wa mali wa deeni wa khawatima 'amali",
    translation: "O Allah, I entrust to You my family, my wealth, my religion and the outcome of my deeds.",
    reference: "Ibn Majah 2:943",
    virtue: "Said when leaving family behind for travel"
  },
  {
    id: 'travel-8',
    arabic: 'أَسْتَوْدِعُكَ اللَّهَ الَّذِي لَا تَضِيعُ وَدَائِعُهُ',
    transliteration: "Astawdi'ukallaha alladhi la tadee'u wada'i'uh",
    translation: "I entrust you to Allah, with Whom no trust is ever lost.",
    reference: "Ibn Majah 2:943",
    virtue: "Said to someone you're leaving behind"
  }
];

// Toilet/Restroom Duas
export const toiletDuas: Dhikr[] = [
  {
    id: 'toilet-1',
    arabic: 'بِسْمِ اللَّهِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration: "Bismillah. Allahumma inni a'udhu bika minal khubuthi wal khaba'ith",
    translation: "In the name of Allah. O Allah, I seek refuge in You from the male and female evil beings (devils).",
    reference: "Al-Bukhari 1:142, Muslim 1:375",
    virtue: "Said before entering the toilet"
  },
  {
    id: 'toilet-2',
    arabic: 'غُفْرَانَكَ',
    transliteration: "Ghufranaka",
    translation: "(I seek) Your forgiveness.",
    reference: "Abu Dawud 1:30, At-Tirmidhi 1:7",
    virtue: "Said after leaving the toilet"
  },
  {
    id: 'toilet-3',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَذْهَبَ عَنِّي الْأَذَىٰ وَعَافَانِي',
    transliteration: "Alhamdu lillahil ladhi adhhaba 'annil adha wa 'afani",
    translation: "Praise is to Allah Who removed the harm from me and gave me health.",
    reference: "Ibn Majah 1:301",
    virtue: "Said after leaving the toilet (alternative)"
  }
];

// Visiting the Sick Duas
export const visitingSickDuas: Dhikr[] = [
  {
    id: 'sick-1',
    arabic: 'لَا بَأْسَ، طَهُورٌ إِنْ شَاءَ اللَّهُ',
    transliteration: "La ba'sa, tahoorun in sha Allah",
    translation: "No worry, it is a purification, if Allah wills.",
    reference: "Al-Bukhari 7:375",
    virtue: "Said when visiting a sick person"
  },
  {
    id: 'sick-2',
    arabic: 'أَسْأَلُ اللَّهَ الْعَظِيمَ، رَبَّ الْعَرْشِ الْعَظِيمِ، أَنْ يَشْفِيَكَ',
    transliteration: "As'alullaha al-'azeema rabbal 'arshil 'azeemi an yashfiyak",
    translation: "I ask Allah the Almighty, the Lord of the Magnificent Throne, to cure you.",
    reference: "At-Tirmidhi 2:410, Abu Dawud 3:187",
    repetition: 7,
    virtue: "If said 7 times, Allah will cure the sick person unless death is decreed for him"
  },
  {
    id: 'sick-3',
    arabic: 'اللَّهُمَّ اشْفِ عَبْدَكَ يَنْكَأُ لَكَ عَدُوًّا، أَوْ يَمْشِي لَكَ إِلَىٰ صَلَاةٍ',
    transliteration: "Allahumma ishfi 'abdaka yanka'u laka 'aduwwan, aw yamshi laka ila salah",
    translation: "O Allah, cure Your servant who may then fight for Your sake or walk to prayer for Your sake.",
    reference: "Abu Dawud 3:187",
    virtue: "Dua for healing"
  },
  {
    id: 'sick-4',
    arabic: 'بِسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ، اللهُ يَشْفِيكَ، بِسْمِ اللهِ أَرْقِيكَ',
    transliteration: "Bismillahi arqeeka, min kulli shay'in yu'theeka, min sharri kulli nafsin aw 'ayni hasidin, Allahu yashfeeka, bismillahi arqeeka",
    translation: "In the name of Allah I perform ruqyah on you, from everything that harms you, from the evil of every soul or envious eye, may Allah cure you, in the name of Allah I perform ruqyah on you.",
    reference: "Muslim 4:1718",
    virtue: "The Prophet's ruqyah for the sick"
  },
  {
    id: 'sick-5',
    arabic: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، وَاشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    transliteration: "Allahumma rabban nas, adh-hibil ba's, washfi antas shafee, la shifa'a illa shifa'uk, shifa'an la yughadiru saqama",
    translation: "O Allah, Lord of mankind, remove the harm. Cure, for You are the Healer. There is no cure except Your cure, a cure that leaves no illness behind.",
    reference: "Al-Bukhari 7:579, Muslim 4:1721",
    virtue: "The Prophet's dua for healing"
  },
  {
    id: 'sick-6',
    arabic: 'أَعُوذُ بِعِزَّةِ اللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
    transliteration: "A'udhu bi'izzatillahi wa qudratihi min sharri ma ajidu wa uhadhir",
    translation: "I seek refuge in the glory and power of Allah from the evil of what I feel and fear.",
    reference: "Muslim 4:1728",
    repetition: 7,
    virtue: "To be said by the sick person while placing hand on the area of pain"
  }
];

export const allAzkaarCategories: AzkaarCategory[] = [
  {
    id: 'morning',
    title: 'Morning Azkaar',
    titleUrdu: 'صبح کے اذکار',
    titleRoman: 'Subah ke Azkaar',
    titleArabic: 'أذكار الصباح',
    icon: '🌅',
    description: 'Supplications to be recited after Fajr prayer until sunrise',
    descriptionUrdu: 'نماز فجر کے بعد طلوع آفتاب تک پڑھی جانے والی دعائیں',
    descriptionRoman: 'Namaz-e-Fajr ke baad tulu-e-aftab tak parhne wali duain',
    duas: morningAzkaar
  },
  {
    id: 'evening',
    title: 'Evening Azkaar',
    titleUrdu: 'شام کے اذکار',
    titleRoman: 'Shaam ke Azkaar',
    titleArabic: 'أذكار المساء',
    icon: '🌙',
    description: 'Supplications to be recited after Asr prayer until Maghrib',
    descriptionUrdu: 'نماز عصر کے بعد مغرب تک پڑھی جانے والی دعائیں',
    descriptionRoman: 'Namaz-e-Asr ke baad Maghrib tak parhne wali duain',
    duas: eveningAzkaar
  },
  {
    id: 'sleeping',
    title: 'Before Sleeping',
    titleUrdu: 'سونے سے پہلے',
    titleRoman: 'Sone se Pehle',
    titleArabic: 'أذكار النوم',
    icon: '😴',
    description: 'Supplications to be recited before going to sleep',
    descriptionUrdu: 'سونے سے پہلے پڑھی جانے والی دعائیں',
    descriptionRoman: 'Sone se pehle parhne wali duain',
    duas: sleepingDuas
  },
  {
    id: 'waking',
    title: 'Upon Waking Up',
    titleUrdu: 'جاگنے پر',
    titleRoman: 'Jaagne Par',
    titleArabic: 'أذكار الاستيقاظ',
    icon: '⏰',
    description: 'Supplications to be recited upon waking from sleep',
    descriptionUrdu: 'نیند سے جاگنے پر پڑھی جانے والی دعائیں',
    descriptionRoman: 'Neend se jaagne par parhne wali duain',
    duas: wakingDuas
  },
  {
    id: 'salah',
    title: 'Salah (Prayer)',
    titleUrdu: 'نماز کی دعائیں',
    titleRoman: 'Namaz ki Duain',
    titleArabic: 'أذكار الصلاة',
    icon: '🕌',
    description: 'Supplications for before, during, and after prayer',
    descriptionUrdu: 'نماز سے پہلے، دوران اور بعد میں پڑھی جانے والی دعائیں',
    descriptionRoman: 'Namaz se pehle, dauran aur baad mein parhne wali duain',
    duas: salahDuas
  },
  {
    id: 'eating',
    title: 'Eating & Drinking',
    titleUrdu: 'کھانے پینے کی دعائیں',
    titleRoman: 'Khane Peene ki Duain',
    titleArabic: 'أذكار الطعام والشراب',
    icon: '🍽️',
    description: 'Supplications for eating and drinking',
    descriptionUrdu: 'کھانے اور پینے کی دعائیں',
    descriptionRoman: 'Khane aur peene ki duain',
    duas: eatingDuas
  },
  {
    id: 'travel',
    title: 'Travel',
    titleUrdu: 'سفر کی دعائیں',
    titleRoman: 'Safar ki Duain',
    titleArabic: 'أذكار السفر',
    icon: '✈️',
    description: 'Supplications for traveling and journeys',
    descriptionUrdu: 'سفر اور راستے کی دعائیں',
    descriptionRoman: 'Safar aur raste ki duain',
    duas: travelDuas
  },
  {
    id: 'toilet',
    title: 'Restroom',
    titleUrdu: 'بیت الخلاء کی دعائیں',
    titleRoman: 'Bait-ul-Khala ki Duain',
    titleArabic: 'أذكار الخلاء',
    icon: '🚿',
    description: 'Supplications for entering and leaving the restroom',
    descriptionUrdu: 'بیت الخلاء میں داخل ہونے اور نکلنے کی دعائیں',
    descriptionRoman: 'Bait-ul-khala mein dakhil hone aur nikalne ki duain',
    duas: toiletDuas
  },
  {
    id: 'visiting-sick',
    title: 'Visiting the Sick',
    titleUrdu: 'بیمار کی عیادت',
    titleRoman: 'Beemar ki Iyadat',
    titleArabic: 'عيادة المريض',
    icon: '💚',
    description: 'Supplications for visiting and praying for the sick',
    descriptionUrdu: 'بیمار کی عیادت اور دعا کے لیے',
    descriptionRoman: 'Beemar ki iyadat aur dua ke liye',
    duas: visitingSickDuas
  },
  {
    id: 'general',
    title: 'General Duas',
    titleUrdu: 'عام دعائیں',
    titleRoman: 'Aam Duain',
    titleArabic: 'أدعية عامة',
    icon: '🤲',
    description: 'Daily supplications and remembrances',
    descriptionUrdu: 'روزمرہ کی دعائیں اور اذکار',
    descriptionRoman: 'Rozmarrah ki duain aur azkaar',
    duas: generalDuas
  }
];

// Get all duas combined for notifications
export const getAllDuas = (): Dhikr[] => {
  return [
    ...morningAzkaar,
    ...eveningAzkaar,
    ...sleepingDuas,
    ...wakingDuas,
    ...salahDuas,
    ...eatingDuas,
    ...travelDuas,
    ...toiletDuas,
    ...visitingSickDuas,
    ...generalDuas
  ];
};

// Get a random dua for notifications
export const getRandomDua = (): Dhikr => {
  const allDuas = getAllDuas();
  return allDuas[Math.floor(Math.random() * allDuas.length)];
};

// Get time-appropriate duas
export const getTimeAppropriateDuas = (): Dhikr[] => {
  const hour = new Date().getHours();
  
  if (hour >= 4 && hour < 12) {
    // Morning: 4 AM - 12 PM
    return morningAzkaar;
  } else if (hour >= 15 && hour < 20) {
    // Evening: 3 PM - 8 PM
    return eveningAzkaar;
  } else if (hour >= 20 || hour < 4) {
    // Night: 8 PM - 4 AM
    return sleepingDuas;
  } else {
    // Afternoon or other times
    return generalDuas;
  }
};
