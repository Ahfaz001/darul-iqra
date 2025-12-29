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
