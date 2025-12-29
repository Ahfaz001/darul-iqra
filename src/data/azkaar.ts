// Authentic Azkaar from Hisnul Muslim (Fortress of the Muslim)
// All duas are sourced from authentic hadith collections

export interface Dhikr {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  repetition?: number;
  virtue?: string;
}

export interface AzkaarCategory {
  id: string;
  title: string;
  titleArabic: string;
  icon: string;
  description: string;
  duas: Dhikr[];
}

export const morningAzkaar: Dhikr[] = [
  {
    id: 'morning-1',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul mulku walahul hamd, wahuwa 'ala kulli shay'in qadeer",
    translation: "We have reached the morning and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    reference: "Abu Dawud 4:317",
    repetition: 1
  },
  {
    id: 'morning-2',
    arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    transliteration: "Allahumma bika asbahna, wabika amsayna, wabika nahya, wabika namootu wa ilaikan nushoor",
    translation: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die and unto You is our resurrection.",
    reference: "At-Tirmidhi 5:466",
    repetition: 1
  },
  {
    id: 'morning-3',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَـٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wawa'dika mastata't, a'udhu bika min sharri ma sana't, abu'u laka bini'matika 'alayya, wa abu'u laka bidhanbi faghfir li fa innahu la yaghfirudh dhunuba illa ant",
    translation: "O Allah, You are my Lord, none has the right to be worshipped except You, You created me and I am Your servant and I abide to Your covenant and promise as best I can, I take refuge in You from the evil of which I have committed. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for verily none can forgive sins except You.",
    reference: "Al-Bukhari 7:150",
    repetition: 1,
    virtue: "This is Sayyidul Istighfar (The Master of Seeking Forgiveness). Whoever says it during the day with firm faith and dies that day, will enter Paradise."
  },
  {
    id: 'morning-4',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: "Subhanallahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him.",
    reference: "Muslim 4:2071",
    repetition: 100,
    virtue: "Whoever says this 100 times in the morning and evening, none will come on the Day of Resurrection with anything better, except one who said the same or more."
  },
  {
    id: 'morning-5',
    arabic: 'لَا إِلَـٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul mulku walahul hamd, wahuwa 'ala kulli shay'in qadeer",
    translation: "None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    reference: "Al-Bukhari 4:95, Muslim 4:2071",
    repetition: 10,
    virtue: "Whoever says this 10 times will have the reward of freeing four slaves from the children of Ismail."
  },
  {
    id: 'morning-6',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bikalimatillahit tammati min sharri ma khalaq",
    translation: "I seek refuge in Allah's perfect words from the evil of what He has created.",
    reference: "Muslim 4:2081",
    repetition: 3
  },
  {
    id: 'morning-7',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil ladhi la yadurru ma'asmihi shay'un fil ardi wa la fis sama'i wa huwas sami'ul 'aleem",
    translation: "In the name of Allah with whose name nothing is harmed on earth nor in the heavens and He is The All-Seeing, The All-Knowing.",
    reference: "Abu Dawud 4:323, At-Tirmidhi 5:465",
    repetition: 3,
    virtue: "Whoever says it 3 times in the morning and evening, nothing will harm him."
  },
  {
    id: 'morning-8',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي',
    transliteration: "Allahumma inni as'alukal 'afiyata fid dunya wal akhirah. Allahumma inni as'alukal 'afwa wal 'afiyata fi dini wa dunyaya wa ahli wa mali",
    translation: "O Allah, I ask You for pardon and well-being in this life and the next. O Allah, I ask You for pardon and well-being in my religious and worldly affairs, and my family and my wealth.",
    reference: "Ibn Majah 2:332, Abu Dawud",
    repetition: 1
  },
  {
    id: 'morning-9',
    arabic: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَـٰهَ إِلَّا أَنْتَ',
    transliteration: "Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa ant",
    translation: "O Allah, grant my body health. O Allah, grant my hearing health. O Allah, grant my sight health. None has the right to be worshipped except You.",
    reference: "Abu Dawud 4:324",
    repetition: 3
  },
  {
    id: 'morning-10',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَـٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu wa huwa rabbul 'arshil 'azeem",
    translation: "Allah is Sufficient for me, none has the right to be worshipped except Him, upon Him I rely and He is Lord of the exalted throne.",
    reference: "Abu Dawud 4:321",
    repetition: 7,
    virtue: "Allah will be sufficient for him in whatever concerns him of matters of this world and the hereafter."
  }
];

export const eveningAzkaar: Dhikr[] = [
  {
    id: 'evening-1',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَـهَ إِلاَّ اللهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: "Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul mulku walahul hamd, wahuwa 'ala kulli shay'in qadeer",
    translation: "We have reached the evening and at this very time all sovereignty belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah, alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    reference: "Abu Dawud 4:317",
    repetition: 1
  },
  {
    id: 'evening-2',
    arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
    transliteration: "Allahumma bika amsayna, wabika asbahna, wabika nahya, wabika namootu wa ilaikal maseer",
    translation: "O Allah, by Your leave we have reached the evening and by Your leave we have reached the morning, by Your leave we live and die and unto You is our final return.",
    reference: "At-Tirmidhi 5:466",
    repetition: 1
  },
  {
    id: 'evening-3',
    arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    transliteration: "A'udhu bikalimatillahit tammati min sharri ma khalaq",
    translation: "I seek refuge in Allah's perfect words from the evil of what He has created.",
    reference: "Muslim 4:2081",
    repetition: 3
  },
  {
    id: 'evening-4',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ، وَقَهْرِ الرِّجَالِ',
    transliteration: "Allahumma inni a'udhu bika minal hammi wal hazan, wa a'udhu bika minal 'ajzi wal kasal, wa a'udhu bika minal jubni wal bukhl, wa a'udhu bika min ghalabatid dayn wa qahrir rijal",
    translation: "O Allah, I seek refuge in You from anxiety and sorrow, weakness and laziness, miserliness and cowardice, the burden of debts and from being overpowered by men.",
    reference: "Al-Bukhari 7:158",
    repetition: 1
  },
  {
    id: 'evening-5',
    arabic: 'اللَّهُمَّ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، رَبَّ كُلِّ شَيْءٍ وَمَلِيكَهُ، أَشْهَدُ أَنْ لَا إِلَـٰهَ إِلَّا أَنْتَ، أَعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكِهِ',
    transliteration: "Allahumma 'alimal ghaybi wash shahadati fatiris samawati wal ard, rabba kulli shay'in wa maleekah, ashhadu an la ilaha illa ant, a'udhu bika min sharri nafsi wa min sharrish shaytani wa shirkihi",
    translation: "O Allah, Knower of the unseen and the seen, Creator of the heavens and the Earth, Lord and Sovereign of all things, I bear witness that none has the right to be worshipped except You. I seek refuge in You from the evil of my soul and from the evil and shirk of the devil.",
    reference: "Abu Dawud 4:317",
    repetition: 1
  },
  {
    id: 'evening-6',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: "Subhanallahi wa bihamdihi",
    translation: "Glory is to Allah and praise is to Him.",
    reference: "Muslim 4:2071",
    repetition: 100,
    virtue: "Whoever says this 100 times in the morning and evening, none will come on the Day of Resurrection with anything better."
  },
  {
    id: 'evening-7',
    arabic: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullaha wa atubu ilayhi",
    translation: "I seek Allah's forgiveness and turn to Him in repentance.",
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
    reference: "Al-Bukhari 11:113",
    repetition: 1
  },
  {
    id: 'sleep-2',
    arabic: 'اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ',
    transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
    translation: "O Allah, protect me from Your punishment on the day Your servants are resurrected.",
    reference: "Abu Dawud 4:311",
    repetition: 3
  },
  {
    id: 'sleep-3',
    arabic: 'بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ',
    transliteration: "Bismika rabbi wada'tu janbi, wa bika arfa'uh, fa in amsakta nafsi farhamha, wa in arsaltaha fahfazha bima tahfazu bihi 'ibadakas saliheen",
    translation: "In Your name my Lord, I lie down and in Your name I rise, so if You should take my soul then have mercy upon it, and if You should return my soul then protect it in the manner You do so with Your righteous servants.",
    reference: "Al-Bukhari 11:126, Muslim 4:2083",
    repetition: 1
  },
  {
    id: 'sleep-4',
    arabic: 'اللَّهُمَّ إِنَّكَ خَلَقْتَ نَفْسِي وَأَنْتَ تَوَفَّاهَا، لَكَ مَمَاتُهَا وَمَحْيَاهَا، إِنْ أَحْيَيْتَهَا فَاحْفَظْهَا، وَإِنْ أَمَتَّهَا فَاغْفِرْ لَهَا، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ',
    transliteration: "Allahumma innaka khalaqta nafsi wa anta tawaffaha, laka mamatuha wa mahyaha, in ahyaytaha fahfazha, wa in amattaha faghfir laha, Allahumma inni as'alukal 'afiyah",
    translation: "O Allah, verily You have created my soul and You shall take its life, to You belongs its life and death. If You should keep my soul alive then protect it, and if You should take its life then forgive it. O Allah, I ask You to grant me good health.",
    reference: "Muslim 4:2083",
    repetition: 1
  },
  {
    id: 'sleep-5',
    arabic: 'اللَّهُمَّ رَبَّ السَّمَاوَاتِ وَرَبَّ الْأَرْضِ وَرَبَّ الْعَرْشِ الْعَظِيمِ، رَبَّنَا وَرَبَّ كُلِّ شَيْءٍ، فَالِقَ الْحَبِّ وَالنَّوَىٰ، وَمُنْزِلَ التَّوْرَاةِ وَالْإِنْجِيلِ وَالْفُرْقَانِ، أَعُوذُ بِكَ مِنْ شَرِّ كُلِّ شَيْءٍ أَنْتَ آخِذٌ بِنَاصِيَتِهِ',
    transliteration: "Allahumma rabbas samawati wa rabbal ardi wa rabbal 'arshil 'azeem, rabbana wa rabba kulli shay', faliqal habbi wannawa, wa munzilat tawrati wal injeel wal furqan, a'udhu bika min sharri kulli shay'in anta akhidhun binasiyatih",
    translation: "O Allah, Lord of the heavens, Lord of the earth and Lord of the exalted throne, our Lord and Lord of all things, Splitter of the seed and the date stone, Revealer of the Torah, the Injeel and the Furqan (Quran), I seek refuge in You from the evil of all things You shall seize by the forelock.",
    reference: "Muslim 4:2084",
    repetition: 1
  },
  {
    id: 'sleep-6',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا، وَكَفَانَا، وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ',
    transliteration: "Alhamdu lillahil ladhi at'amana wa saqana, wa kafana, wa awana, fakam mimman la kafiya lahu wa la mu'wi",
    translation: "All praise is for Allah, Who fed us and gave us drink, and Who is sufficient for us and has sheltered us, for how many have none to suffice them or shelter them.",
    reference: "Muslim 4:2085",
    repetition: 1
  },
  {
    id: 'sleep-7',
    arabic: 'اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ',
    transliteration: "Allahumma aslamtu nafsi ilayk, wa fawwadtu amri ilayk, wa wajjahtu wajhi ilayk, wa alja'tu zahri ilayk, raghbatan wa rahbatan ilayk, la malja'a wa la manja minka illa ilayk, amantu bikitabikal ladhi anzalt, wa binabiyyikal ladhi arsalt",
    translation: "O Allah, I submit my soul unto You, and I entrust my affair unto You, and I turn my face towards You, and I take refuge in You, out of desire and fear of You. There is no refuge from You and no sanctuary from You except with You. I believe in Your Book which You have revealed and in Your Prophet whom You have sent.",
    reference: "Al-Bukhari 11:113, Muslim 4:2081",
    repetition: 1,
    virtue: "If you die that night, you die upon the fitrah (natural state of Islam)."
  }
];

export const wakingDuas: Dhikr[] = [
  {
    id: 'wake-1',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: "Alhamdu lillahil ladhi ahyana ba'da ma amatana wa ilayhin nushoor",
    translation: "All praise is for Allah who gave us life after having taken it from us and unto Him is the resurrection.",
    reference: "Al-Bukhari 11:113",
    repetition: 1
  },
  {
    id: 'wake-2',
    arabic: 'لَا إِلَـٰهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ، سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَـٰهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul mulku wa lahul hamd, wa huwa 'ala kulli shay'in qadeer. Subhanallah, walhamdu lillah, wa la ilaha illallah, wallahu akbar, wa la hawla wa la quwwata illa billahil 'aliyyil 'azeem",
    translation: "None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent. Glory is to Allah, and praise is to Allah, and none has the right to be worshipped except Allah, and Allah is the greatest, and there is no might nor power except with Allah, the Most High, the Most Great.",
    reference: "Al-Bukhari, Ibn Majah",
    repetition: 1,
    virtue: "Whoever wakes at night and says this, then supplicates, his supplication will be answered. If he makes wudu and prays, his prayer will be accepted."
  },
  {
    id: 'wake-3',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي فِي جَسَدِي، وَرَدَّ عَلَيَّ رُوحِي، وَأَذِنَ لِي بِذِكْرِهِ',
    transliteration: "Alhamdu lillahil ladhi 'afani fi jasadi, wa radda 'alayya ruhi, wa adhina li bidhikrihi",
    translation: "All praise is for Allah who restored to me my health, returned my soul and permitted me to remember Him.",
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
    reference: "Al-Bukhari 7:158, Muslim 4:2076",
    virtue: "A treasure from the treasures of Paradise."
  },
  {
    id: 'general-2',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: "Subhanallahi wa bihamdihi, Subhanallahil 'azeem",
    translation: "Glory be to Allah and praise Him, Glory be to Allah the Almighty.",
    reference: "Al-Bukhari 7:168, Muslim 4:2072",
    virtue: "Two phrases which are light on the tongue, heavy on the scales and beloved to the Most Merciful."
  },
  {
    id: 'general-3',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    transliteration: "Rabbana atina fid dunya hasanatan wa fil akhirati hasanatan wa qina 'adhaaban naar",
    translation: "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
    reference: "Al-Baqarah 2:201"
  },
  {
    id: 'general-4',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَىٰ وَالتُّقَىٰ وَالْعَفَافَ وَالْغِنَىٰ',
    transliteration: "Allahumma inni as'alukal huda wat tuqa wal 'afafa wal ghina",
    translation: "O Allah, I ask You for guidance, piety, chastity and self-sufficiency.",
    reference: "Muslim 4:2087"
  },
  {
    id: 'general-5',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَىٰ ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ',
    transliteration: "Allahumma a'inni 'ala dhikrika, wa shukrika, wa husni 'ibadatik",
    translation: "O Allah, help me to remember You, to thank You, and to worship You in the best of manners.",
    reference: "Abu Dawud 2:86, An-Nasa'i"
  },
  {
    id: 'general-6',
    arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    transliteration: "Rabbighfir li wa tub 'alayya innaka antat tawwabur raheem",
    translation: "My Lord, forgive me and accept my repentance, You are the Ever-Returning, Ever-Merciful.",
    reference: "Abu Dawud, At-Tirmidhi",
    repetition: 100
  },
  {
    id: 'general-7',
    arabic: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad, kama sallayta 'ala Ibrahim wa 'ala ali Ibrahim, innaka hameedun majeed",
    translation: "O Allah, send prayers upon Muhammad and upon the family of Muhammad, as You sent prayers upon Ibrahim and upon the family of Ibrahim. Indeed, You are Praiseworthy, Glorious.",
    reference: "Al-Bukhari 3:1233"
  },
  {
    id: 'general-8',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَـٰهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullaha al-'azeema alladhi la ilaha illa huwal hayyul qayyum wa atubu ilayh",
    translation: "I seek forgiveness from Allah, the Mighty, whom there is no god but He, the Living, the Sustainer, and I repent to Him.",
    reference: "Abu Dawud 2:85, At-Tirmidhi 5:569"
  },
  {
    id: 'general-9',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَىٰ نَفْسِي طَرْفَةَ عَيْنٍ',
    transliteration: "Ya hayyu ya qayyum birahmatika astaghith, aslih li sha'ni kullahu, wa la takilni ila nafsi tarfata 'ayn",
    translation: "O Ever-Living, O Self-Sustaining, by Your mercy I seek assistance. Rectify for me all of my affairs and do not leave me to myself, even for the blink of an eye.",
    reference: "Al-Hakim",
    virtue: "The Prophet ﷺ taught Fatimah (RA) to say this morning and evening."
  },
  {
    id: 'general-10',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَـٰهَ إِلَّا أَنْتَ',
    transliteration: "Allahumma inni a'udhu bika minal kufri wal faqr, wa a'udhu bika min 'adhabil qabr, la ilaha illa ant",
    translation: "O Allah, I seek refuge in You from disbelief and poverty, and I seek refuge in You from the punishment of the grave. None has the right to be worshipped except You.",
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
    titleArabic: 'أذكار الصباح',
    icon: '🌅',
    description: 'Supplications to be recited after Fajr prayer until sunrise',
    duas: morningAzkaar
  },
  {
    id: 'evening',
    title: 'Evening Azkaar',
    titleArabic: 'أذكار المساء',
    icon: '🌙',
    description: 'Supplications to be recited after Asr prayer until Maghrib',
    duas: eveningAzkaar
  },
  {
    id: 'sleeping',
    title: 'Before Sleeping',
    titleArabic: 'أذكار النوم',
    icon: '😴',
    description: 'Supplications to be recited before going to sleep',
    duas: sleepingDuas
  },
  {
    id: 'waking',
    title: 'Upon Waking Up',
    titleArabic: 'أذكار الاستيقاظ',
    icon: '⏰',
    description: 'Supplications to be recited upon waking from sleep',
    duas: wakingDuas
  },
  {
    id: 'salah',
    title: 'Salah (Prayer)',
    titleArabic: 'أذكار الصلاة',
    icon: '🕌',
    description: 'Supplications for before, during, and after prayer',
    duas: salahDuas
  },
  {
    id: 'eating',
    title: 'Eating & Drinking',
    titleArabic: 'أذكار الطعام والشراب',
    icon: '🍽️',
    description: 'Supplications for eating and drinking',
    duas: eatingDuas
  },
  {
    id: 'travel',
    title: 'Travel',
    titleArabic: 'أذكار السفر',
    icon: '✈️',
    description: 'Supplications for traveling and journeys',
    duas: travelDuas
  },
  {
    id: 'toilet',
    title: 'Restroom',
    titleArabic: 'أذكار الخلاء',
    icon: '🚿',
    description: 'Supplications for entering and leaving the restroom',
    duas: toiletDuas
  },
  {
    id: 'visiting-sick',
    title: 'Visiting the Sick',
    titleArabic: 'عيادة المريض',
    icon: '💚',
    description: 'Supplications for visiting and praying for the sick',
    duas: visitingSickDuas
  },
  {
    id: 'general',
    title: 'General Duas',
    titleArabic: 'أدعية عامة',
    icon: '🤲',
    description: 'Daily supplications and remembrances',
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
