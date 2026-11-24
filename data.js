/* CINEVERSE — data.js — Mikey 2026 */
window.CV = (function () {
'use strict';

const config = {
  brand:'CINEVERSE', taglineEn:'The Art of Movie Night', taglineAr:'فن ليلة السينما',
  owner:'Mikey', year:2026, currency:'EGP', defaultLang:'en', researchDate:'2026-11-24'
};

const sources = {
  elcinema:{name:'ElCinema.com',url:'https://www.elcinema.com',accessed:'2026-11-24'},
  vox:{name:'VOX Cinemas Egypt',url:'https://egy.voxcinemas.com',accessed:'2026-11-24'},
  renaissance:{name:'Renaissance Cinemas',url:'https://rnscinemas.com',accessed:'2026-11-24'},
  youm7:{name:'Youm7',url:'https://www.youm7.com',accessed:'2026-11-24'},
  elwatan:{name:'ElWatan News',url:'https://www.elwatannews.com',accessed:'2026-11-24'}
};

const shoofAflam = {
  baseUrl: 'https://shoofaflam.tv/api',
  posterBase: 'https://image.tmdb.org/t/p/w500',
  titlesUrl: 'https://shoofaflam.tv/api/titles.json',
  attribution: 'shoofaflam.tv',
  attributionUrl: 'https://shoofaflam.tv',
  lastKnownUpdate: '2026-03-08'
};

const genres = [
  {id:'action',en:'Action',ar:'أكشن'},{id:'adventure',en:'Adventure',ar:'مغامرة'},
  {id:'comedy',en:'Comedy',ar:'كوميدي'},{id:'drama',en:'Drama',ar:'دراما'},
  {id:'horror',en:'Horror',ar:'رعب'},{id:'thriller',en:'Thriller',ar:'إثارة'},
  {id:'romance',en:'Romance',ar:'رومانسي'},{id:'scifi',en:'Sci-Fi',ar:'خيال علمي'},
  {id:'animation',en:'Animation',ar:'رسوم متحركة'},{id:'fantasy',en:'Fantasy',ar:'فانتازيا'},
  {id:'mystery',en:'Mystery',ar:'غموض'}
];

const formats = [
  {id:'standard',en:'Standard 2D',ar:'عادي',priceMod:1.0},
  {id:'3d',en:'3D',ar:'ثلاثي الأبعاد',priceMod:1.25},
  {id:'imax',en:'IMAX',ar:'آيماكس',priceMod:1.85},
  {id:'4dx',en:'4DX',ar:'فور دي إكس',priceMod:2.10},
  {id:'vip',en:'VIP',ar:'VIP',priceMod:1.70},
  {id:'max',en:'MAX',ar:'ماكس',priceMod:1.55}
];

const operators = [
  {id:'vox',name:'VOX Cinemas',website:'https://egy.voxcinemas.com'},
  {id:'premiere',name:'Premiere Cinemas',website:'https://premiere-cinemas.com'},
  {id:'scene',name:'Scene Cinemas',website:'https://scenecinemas.com'},
  {id:'renaissance',name:'Renaissance Cinemas',website:'https://rnscinemas.com'},
  {id:'galaxy',name:'Galaxy Cineplex',website:'https://www.galaxycineplex.com'}
];

const venues = [
  {id:'vox-almaza',operatorId:'vox',name:'VOX — City Centre Almaza',city:'Cairo',area:'Sheraton Al Matar, El Nozha',formats:['standard','3d','imax','4dx','vip','max'],facilities:['Parking','Wheelchair Access'],verified:true},
  {id:'vox-mall-egypt',operatorId:'vox',name:'VOX — Mall of Egypt',city:'Giza',area:'6th of October',formats:['standard','3d','imax','4dx','vip','max'],facilities:['Parking','Wheelchair Access'],verified:true},
  {id:'vox-alex',operatorId:'vox',name:'VOX — City Centre Alexandria',city:'Alexandria',area:'Alexandria',formats:['standard','3d','imax','4dx','vip','max'],facilities:['Parking','Wheelchair Access'],verified:true},
  {id:'renaissance-madinaty',operatorId:'renaissance',name:'Renaissance — Madinaty',city:'Cairo',area:'Madinaty, New Cairo',formats:['standard','vip'],facilities:['Parking'],verified:true},
  {id:'renaissance-san-stefano',operatorId:'renaissance',name:'Renaissance — San Stefano',city:'Alexandria',area:'San Stefano Mall',formats:['standard','vip'],facilities:['Parking'],verified:true},
  {id:'renaissance-smouha',operatorId:'renaissance',name:'Renaissance — Smouha',city:'Alexandria',area:'Smouha',formats:['standard','vip'],facilities:['Parking'],verified:true},
  {id:'galaxy-corniche',operatorId:'galaxy',name:'Galaxy Cineplex — Corniche',city:'Cairo',area:'Corniche El Nil',formats:['standard'],facilities:['Parking'],verified:true},
  {id:'metropolis',operatorId:'premiere',name:'Metropolis Cinema',city:'Alexandria',area:'Alexandria',formats:['standard'],facilities:['Parking'],verified:true},
  {id:'arkan',operatorId:'premiere',name:'Arkan Cinema',city:'Giza',area:'26th of July Corridor',formats:['standard'],facilities:['Parking'],verified:true}
];

const auditoriums = {
  'hall-standard':{id:'hall-standard',name:'Hall A',screenWidth:14,screenHeight:7.9,rows:10,seatsPerRow:16,rowSpacing:1.1,seatSpacing:0.65,frontRowDistance:6.5,screenElevation:1.0,eyeHeight:1.2,premiumRows:['H','I','J'],accessibleRow:'A',aisles:[4,8,12]},
  'hall-imax':{id:'hall-imax',name:'IMAX Hall',screenWidth:22,screenHeight:12.4,rows:12,seatsPerRow:18,rowSpacing:1.2,seatSpacing:0.7,frontRowDistance:8.0,screenElevation:1.2,eyeHeight:1.2,premiumRows:['J','K','L'],accessibleRow:'A',aisles:[6,12]},
  'hall-vip':{id:'hall-vip',name:'VIP Hall',screenWidth:11,screenHeight:6.2,rows:7,seatsPerRow:10,rowSpacing:1.4,seatSpacing:0.9,frontRowDistance:5.5,screenElevation:1.0,eyeHeight:1.2,premiumRows:['A','B','C','D','E','F','G'],accessibleRow:null,aisles:[5]}
};

const movies = [
  {
    id:'hadoota', titleEn:'Hadoota', titleAr:'حدوتة', year:2026,
    genres:['comedy','drama'], runtime:115, language:'Arabic', subtitles:['English'],
    releaseDate:'2026-11-11', status:'now_showing',
    cast:['Ahmed Helmy', 'Amina Khalil', 'Maged El Masry', 'Khaled El Sawy'],
    country:'Egypt', classification:'+12', rating:null,
    synopsisEn:'A story about "Hadoota", a thug who forgets where he hid a kidnapped witness, so he seeks help from a hypnotherapist to restore his memory and complete his mission, only to face his past and himself.',
    synopsisAr:'تدور أحداث العمل حول «حدوتة» البلطجي الذي ينسى مكان إخفاء شاهد اختطفه، فيستعين بأخصائية علاج بالتنويم المغناطيسي لاستعادة ذاكرته وإتمام مهمته، لكنه يجد نفسه مضطرًا لمواجهة أعداء الماضي.',
    poster:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRgytP_JnZntDXlPzfhMWwHdTwfLivl9INPA-I9r_grg&s=10',
    backdrop:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRgytP_JnZntDXlPzfhMWwHdTwfLivl9INPA-I9r_grg&s=10',
    featured:true
  },
  {
    id:'wala-kan', titleEn:'Wala Kan Alal Bal', titleAr:'ولا كان على البال', year:2026,
    genres:['romance','comedy'], runtime:105, language:'Arabic', subtitles:['English'],
    releaseDate:'2026-10-21', status:'now_showing',
    cast:['Nour El Nabawy', 'Yasmina El Abd', 'Ashraf Abdel Baqi'],
    country:'Egypt', classification:'+12', rating:null,
    synopsisEn:'Younis finds himself responsible for a tourist group of different nationalities in Luxor. He falls in love with a girl he meets among the temples, leading to romantic and comedic situations.',
    synopsisAr:'يجد "يونس" نفسه مسؤولاً عن فوج سياحي يضم أشخاصًا من جنسيات مختلفة في الأقصر، وتتغير الأمور عندما يقع في حب فتاة يلتقي بها وسط المعابد، لتنشأ مواقف تجمع بين الرومانسية والكوميديا.',
    poster:'https://media0110.elcinema.com/uploads/_315x420_c2259345b6e390e156fad302be44c8ed805265cd00474c3d17f0fbb603652c6c.jpg',
    backdrop:'https://media0110.elcinema.com/uploads/_315x420_c2259345b6e390e156fad302be44c8ed805265cd00474c3d17f0fbb603652c6c.jpg',
    featured:false
  },
  {
    id:'matlob', titleEn:'Family Wanted', titleAr:'مطلوب عائلياً', year:2026,
    genres:['comedy','action','thriller'], runtime:120, language:'Arabic', subtitles:['English'],
    releaseDate:'2026-10-07', status:'now_showing',
    cast:['Karim Abdel Aziz', 'Yasmine Sabri', 'Mostafa Khater', 'Sami Maghawry'],
    country:'Egypt', classification:'+12', rating:'4.2',
    synopsisEn:'Farouk (Karim Abdel Aziz), a supermarket manager too busy for his family, has his life turned upside down when his unemployed brother-in-law moves in, leading to a series of comedic and action-packed predicaments.',
    synopsisAr:'في إطار كوميدي تشويقي، تدور الأحداث حول "فاروق" مدير سوبرماركت مشغول عن بيته وزوجته وأولاده، تتغير حياته رأساً على عقب عندما ينتقل شقيق زوجته العاطل للعيش معهم، مما يورطه في مواقف وأزمات طريفة لا حصر لها.',
    poster:'https://media0110.elcinema.com/uploads/_315x420_ee4bc4c0eb9fadf422be6a8aeb9f85808bac76797d1aba6b86eed76af4ae848f.jpg',
    backdrop:'https://media0110.elcinema.com/uploads/_315x420_ee4bc4c0eb9fadf422be6a8aeb9f85808bac76797d1aba6b86eed76af4ae848f.jpg',
    featured:true
  },
  {
    id:'naseeb', titleEn:'Naseeb', titleAr:'نصيب', year:2026,
    genres:['drama','romance'], runtime:110, language:'Arabic', subtitles:['English'],
    releaseDate:'2026-10-28', status:'now_showing',
    cast:['Yasmine Sabri', "Mo'tasem El Nahar", 'Khaled El Sarhan', 'Donia Maher'],
    country:'Egypt', classification:'+12', rating:null,
    synopsisEn:'A wealthy widow inherits a luxury tourist resort in Hurghada after her billionaire husband\'s death. As she manages the resort, she enters several romantic relationships before finding true love.',
    synopsisAr:'تدور الأحداث حول أرملة ثرية ترث منتجعًا سياحيًا فخمًا في الغردقة بعد وفاة زوجها الملياردير، لتجد نفسها أمام مسؤولية إدارته، وتدخل في عدة علاقات عاطفية قبل أن تلتقي برجل تنشأ بينهما قصة حب قوية.',
    poster:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7l4pb5Ar8pKylhcsuaJvqeoo294IfYUQk1MXS-rP69w&s=10',
    backdrop:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7l4pb5Ar8pKylhcsuaJvqeoo294IfYUQk1MXS-rP69w&s=10',
    featured:false
  },
  {
    id:'leila', titleEn:'A Totally Ruined Night', titleAr:'ليلة باظت خالص', year:2026,
    genres:['comedy'], runtime:100, language:'Arabic', subtitles:['English'],
    releaseDate:'2026-11-25', status:'coming_soon',
    cast:['Ahmed Malek', 'Michel Melad'],
    country:'Egypt', classification:null, rating:null,
    synopsisEn:'An Egyptian comedy about a chaotic night full of paradoxes and comedic situations.',
    synopsisAr:'كوميديا مصرية تعكس أجواء الفوضى والمفارقات غير التقليدية في ليلة مليئة بالأحداث غير المتوقعة.',
    poster:'https://cdn.vetogate.com/UploadCache/libfiles/602/3/0x0o/286.webp',
    backdrop:'https://cdn.vetogate.com/UploadCache/libfiles/602/3/0x0o/286.webp',
    featured:false
  },
  {
    id:'asad', titleEn:'Asad', titleAr:'أسد', year:2026,
    genres:['thriller','action'], runtime:130, language:'Arabic', subtitles:['English'],
    releaseDate:'2026-05-14', status:'coming_soon',
    cast:['Mohamed Ramadan'],
    country:'Egypt', classification:null, rating:null,
    synopsisEn:'An Egyptian action-thriller starring Mohamed Ramadan, featuring an epic love story that turns into an irreversible war.',
    synopsisAr:'فيلم أكشن وإثارة مصري بطولة محمد رمضان، يكشف عن قصة حب أسطورية تتحول إلى حرب لا رجعة فيها.',
    poster:'https://upload.wikimedia.org/wikipedia/en/6/6b/Asad_2026_film.png',
    backdrop:'https://upload.wikimedia.org/wikipedia/en/6/6b/Asad_2026_film.png',
    featured:true
  },
  {
    id:'clayface', titleEn:'Clayface', titleAr:'كلايفيس', year:2026,
    genres:['action','thriller','horror'], runtime:128, language:'English', subtitles:['Arabic'],
    releaseDate:'2026-11-14', status:'now_showing',
    cast:[], country:'USA', classification:'R', rating:null,
    synopsisEn:'A dark DC thriller centred on the tragic villain Clayface.',
    synopsisAr:'فيلم إثارة داكن من عالم DC يدور حول الشرير المأساوي كلايفيس.',
    poster:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs8yyvk_IM0xf2DBxYDjrWl4qpGWjZVOGXncz0uKpFFcKLofir_kBJjLkSQBc5Tq53rddwxg&s=10',
    backdrop:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs8yyvk_IM0xf2DBxYDjrWl4qpGWjZVOGXncz0uKpFFcKLofir_kBJjLkSQBc5Tq53rddwxg&s=10',
    featured:false
  },
  {
    id:'cat-hat', titleEn:'The Cat in the Hat', titleAr:'القط ذو القبعة', year:2026,
    genres:['animation','comedy','fantasy'], runtime:92, language:'English', subtitles:['Arabic'],
    releaseDate:'2026-11-01', status:'now_showing',
    cast:[], country:'USA', classification:'G', rating:null,
    synopsisEn:"A new animated adaptation of Dr. Seuss's beloved story.",
    synopsisAr:'تحفة أنيميشن جديدة مقتبسة من قصة دكتور سوس الشهيرة.',
    poster:'https://image.tmdb.org/t/p/w500/uKHm41DzzC4VoDwLZDU9PBYj6ue.jpg',
    backdrop:'https://image.tmdb.org/t/p/w1280/uKHm41DzzC4VoDwLZDU9PBYj6ue.jpg',
    featured:false
  },
  {
    id:'godzilla', titleEn:'Godzilla Minus Zero', titleAr:'جودزيلا مينوس زيرو', year:2026,
    genres:['action','scifi','thriller'], runtime:125, language:'Japanese', subtitles:['Arabic','English'],
    releaseDate:'2026-11-07', status:'now_showing',
    cast:[], country:'Japan', classification:'PG-13', rating:null,
    synopsisEn:'The next chapter in the Godzilla saga — post-war Japan faces a monster beyond imagination.',
    synopsisAr:'الفصل التالي في ملحمة جودزيلا — اليابان بعد الحرب تواجه وحشاً يفوق الخيال.',
    poster:'https://image.tmdb.org/t/p/w500/hkxxMIGaiCTmrEArK7J56JTKUlB.jpg',
    backdrop:'https://image.tmdb.org/t/p/w1280/hkxxMIGaiCTmrEArK7J56JTKUlB.jpg',
    featured:false
  },
  {
    id:'toy-story-5', titleEn:'Toy Story 5', titleAr:'حكاية لعبة 5', year:2026,
    genres:['animation','comedy','adventure'], runtime:100, language:'English', subtitles:['Arabic'],
    releaseDate:'2026-06-18', status:'coming_soon',
    cast:[], country:'USA', classification:'G', rating:null,
    synopsisEn:'Woody, Buzz and the gang return for a new adventure.',
    synopsisAr:'وودي وباز والشلة يعودون في مغامرة جديدة.',
    poster:'https://image.tmdb.org/t/p/w500/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg',
    backdrop:'https://image.tmdb.org/t/p/w1280/w9kR8qbmQ01HwnvK4alvnQ2ca0L.jpg',
    featured:false
  }
];

// Helper to generate a date string for today or future days
function getDateStr(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const showtimes = [
  // Hadoota - Arkan Cinema
  { id:'st-hadoota-arkan-1', movieId:'hadoota', venueId:'arkan', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'11:00', format:'standard', price:300 },
  { id:'st-hadoota-arkan-2', movieId:'hadoota', venueId:'arkan', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'13:30', format:'standard', price:300 },
  { id:'st-hadoota-arkan-3', movieId:'hadoota', venueId:'arkan', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'16:00', format:'standard', price:300 },
  { id:'st-hadoota-arkan-4', movieId:'hadoota', venueId:'arkan', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'18:45', format:'standard', price:300 },
  { id:'st-hadoota-arkan-5', movieId:'hadoota', venueId:'arkan', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'21:30', format:'standard', price:300 },
  // Hadoota - Galaxy
  { id:'st-hadoota-galaxy-1', movieId:'hadoota', venueId:'galaxy-corniche', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'11:00', format:'standard', price:200 },
  { id:'st-hadoota-galaxy-2', movieId:'hadoota', venueId:'galaxy-corniche', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'13:20', format:'standard', price:200 },
  { id:'st-hadoota-galaxy-3', movieId:'hadoota', venueId:'galaxy-corniche', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'15:40', format:'standard', price:200 },
  { id:'st-hadoota-galaxy-4', movieId:'hadoota', venueId:'galaxy-corniche', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'18:00', format:'standard', price:200 },
  { id:'st-hadoota-galaxy-5', movieId:'hadoota', venueId:'galaxy-corniche', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'20:20', format:'standard', price:200 },
  
  // Matlob Aeliyan - VOX Mall of Egypt
  { id:'st-matlob-vox-1', movieId:'matlob', venueId:'vox-mall-egypt', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'13:00', format:'standard', price:220 },
  { id:'st-matlob-vox-2', movieId:'matlob', venueId:'vox-mall-egypt', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'15:30', format:'standard', price:220 },
  { id:'st-matlob-vox-3', movieId:'matlob', venueId:'vox-mall-egypt', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'18:00', format:'standard', price:220 },
  { id:'st-matlob-vox-4', movieId:'matlob', venueId:'vox-mall-egypt', auditoriumId:'hall-imax', date:getDateStr(0), startTime:'20:30', format:'imax', price:350 },
  { id:'st-matlob-vox-5', movieId:'matlob', venueId:'vox-mall-egypt', auditoriumId:'hall-vip', date:getDateStr(0), startTime:'22:00', format:'vip', price:400 },
  // Matlob Aeliyan - Renaissance Madinaty
  { id:'st-matlob-ren-1', movieId:'matlob', venueId:'renaissance-madinaty', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'10:30', format:'standard', price:150 },
  { id:'st-matlob-ren-2', movieId:'matlob', venueId:'renaissance-madinaty', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'13:00', format:'standard', price:150 },
  { id:'st-matlob-ren-3', movieId:'matlob', venueId:'renaissance-madinaty', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'15:30', format:'standard', price:150 },
  { id:'st-matlob-ren-4', movieId:'matlob', venueId:'renaissance-madinaty', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'18:15', format:'standard', price:180 },
  { id:'st-matlob-ren-5', movieId:'matlob', venueId:'renaissance-madinaty', auditoriumId:'hall-vip', date:getDateStr(0), startTime:'20:30', format:'vip', price:250 },
  
  // Matlob Aeliyan - VOX City Centre Alexandria
  { id:'st-matlob-alex-1', movieId:'matlob', venueId:'vox-alex', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'13:15', format:'standard', price:180 },
  { id:'st-matlob-alex-2', movieId:'matlob', venueId:'vox-alex', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'15:45', format:'standard', price:180 },
  { id:'st-matlob-alex-3', movieId:'matlob', venueId:'vox-alex', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'18:15', format:'standard', price:180 },
  { id:'st-matlob-alex-4', movieId:'matlob', venueId:'vox-alex', auditoriumId:'hall-imax', date:getDateStr(0), startTime:'20:45', format:'imax', price:300 },
  { id:'st-matlob-alex-5', movieId:'matlob', venueId:'vox-alex', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'23:15', format:'standard', price:180 },

  // Wala Kan Alal Bal - VOX Almaza
  { id:'st-wala-vox-1', movieId:'wala-kan', venueId:'vox-almaza', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'14:00', format:'standard', price:220 },
  { id:'st-wala-vox-2', movieId:'wala-kan', venueId:'vox-almaza', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'16:30', format:'standard', price:220 },
  { id:'st-wala-vox-3', movieId:'wala-kan', venueId:'vox-almaza', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'19:00', format:'standard', price:220 },
  { id:'st-wala-vox-4', movieId:'wala-kan', venueId:'vox-almaza', auditoriumId:'hall-vip', date:getDateStr(0), startTime:'21:30', format:'vip', price:320 },

  // Naseeb - Renaissance San Stefano
  { id:'st-naseeb-ren-1', movieId:'naseeb', venueId:'renaissance-san-stefano', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'13:30', format:'standard', price:160 },
  { id:'st-naseeb-ren-2', movieId:'naseeb', venueId:'renaissance-san-stefano', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'16:00', format:'standard', price:160 },
  { id:'st-naseeb-ren-3', movieId:'naseeb', venueId:'renaissance-san-stefano', auditoriumId:'hall-standard', date:getDateStr(0), startTime:'18:30', format:'standard', price:160 },
  { id:'st-naseeb-ren-4', movieId:'naseeb', venueId:'renaissance-san-stefano', auditoriumId:'hall-vip', date:getDateStr(0), startTime:'21:00', format:'vip', price:250 },
];

const foodCategories = [ {id:'popcorn',en:'Popcorn',ar:'فشار'}, {id:'drinks',en:'Drinks',ar:'مشروبات'}, {id:'combos',en:'Combos',ar:'كومبو'} ];
const foodItems = [
  {id:'pop-l',category:'popcorn',en:'Popcorn — Large',ar:'فشار — كبير',price:70,demo:true},
  {id:'cola-l',category:'drinks',en:'Cola — Large',ar:'كولا — كبير',price:50,demo:true},
  {id:'combo-couple',category:'combos',en:'Couple Combo',ar:'كومبو للاثنين',price:140,demo:true}
];

const offers = [
  {id:'offer-friends',titleEn:'Friends Night',titleAr:'ليلة الأصحاب',descEn:'4 tickets + free popcorn.',descAr:'4 تذاكر + فشار مجاني.',status:'demo'}
];

const translations = {
  en:{
    nav_home:'Home',nav_movies:'Movies',nav_now:'Now Showing',nav_coming:'Coming Soon',
    nav_cinemas:'Cinemas',nav_experiences:'Experiences',nav_search:'Search',nav_lang:'Language',
    nav_watchlist:'Watchlist',nav_profile:'Profile',nav_tickets:'My Tickets',nav_cart:'Cart',skip_intro:'Skip Intro',
    hero_book:'Book Tickets',hero_watch_trailer:'Watch Trailer',hero_explore:'Explore Film',
    section_now_showing:'Now Showing',section_coming_soon:'Coming Soon',section_featured:'Featured',section_genres:'Browse by Genre',
    section_experiences:'Cinema Experiences',section_seatvision:'SeatVision',section_planner:'Smart Night Planner',section_cinemas:'Cinemas',
    section_food:'Food & Drinks',section_offers:'Offers',section_latest:'Latest in Database',
    loading_movies:'Fetching latest titles…',api_error:'Could not load latest titles.',api_attribution:'Data via shoofaflam.tv',
    seatvision_headline:"Don't Just Choose a Seat. Experience the View.",seatvision_cta:'Explore SeatVision',
    moodmatch_headline:'Find the Right Movie for Your Mood',moodmatch_cta:'Find My Movie',
    planner_headline:'Plan My Movie Night',planner_cta:'Plan My Movie Night',final_cta:'Your Next Movie Night Starts Here.',
    explore_movies:'Explore Movies',plan_night:'Plan My Night',view_details:'View Details',book_tickets:'Book Tickets',
    add_watchlist:'Add to Watchlist',remove_watchlist:'Remove from Watchlist',
    status_now:'Now Showing',status_soon:'Coming Soon',status_ended:'No Longer Showing',
    price_demo:'DEMO PRICE',price_published:'PUBLISHED PRICE',showtimes_demo_note:'DEMO SHOWTIMES — Not live availability',
    seatvision_demo_note:'Illustrative SeatVision Simulation.',select_seats:'Select Seats',screen_this_way:'SCREEN THIS WAY',
    seat_available:'Available',seat_selected:'Selected',seat_occupied:'Occupied',seat_premium:'Premium',seat_accessible:'Accessible',seat_companion:'Companion',
    total:'Total',subtotal:'Subtotal',checkout:'Checkout',confirm_pay_demo:'CONFIRM & PAY — DEMO',
    demo_no_payment:'DEMO TRANSACTION — NO REAL PAYMENT WAS PROCESSED.',demo_ticket_warning:'DEMO TICKET — NOT VALID FOR CINEMA ENTRY.',
    back:'Back',next:'Next',close:'Close',continue:'Continue',clear_cart:'Clear Cart',remove:'Remove',booking_reference:'Booking Reference',
    download_ticket:'Download Ticket',print_ticket:'Print Ticket',empty_cart:'Your cart is empty.',empty_results:'No results found.',loading:'Loading…',
    footer_legal:'CINEVERSE is an independent portfolio concept by Mikey. Not affiliated with any cinema operator.'
  },
  ar:{
    nav_home:'الرئيسية',nav_movies:'أفلام',nav_now:'يُعرض الآن',nav_coming:'قريباً',nav_cinemas:'سينمات',nav_experiences:'تجارب',nav_search:'بحث',nav_lang:'اللغة',
    nav_watchlist:'قائمة المشاهدة',nav_profile:'الملف الشخصي',nav_tickets:'تذاكري',nav_cart:'السلة',skip_intro:'تخطي المقدمة',
    hero_book:'احجز تذاكر',hero_watch_trailer:'مشاهدة الإعلان',hero_explore:'استكشف الفيلم',
    section_now_showing:'يُعرض الآن',section_coming_soon:'قريباً',section_featured:'أفلام مختارة',section_genres:'تصفح حسب النوع',
    section_experiences:'تجارب سينمائية',section_seatvision:'SeatVision',section_planner:'مخطط الليلة الذكي',section_cinemas:'السينمات',
    section_food:'المأكولات والمشروبات',section_offers:'العروض',section_latest:'أحدث الأفلام في القاعدة',
    loading_movies:'جاري جلب أحدث الأفلام…',api_error:'تعذر جلب أحدث الأفلام. يتم عرض البيانات المحلية.',api_attribution:'البيانات من shoofaflam.tv',
    seatvision_headline:'متختارش كرسي بس. عيش الرؤية.',seatvision_cta:'اكتشف SeatVision',
    moodmatch_headline:'لاقي الفيلم اللي على مزاجك',moodmatch_cta:'لاقي فيلمي',
    planner_headline:'خطّط لليلتك السينمائية',planner_cta:'خطّط لليلتي',final_cta:'ليلتك السينمائية الجاية تبدأ من هنا.',
    explore_movies:'استكشف الأفلام',plan_night:'خطّط لليلتي',view_details:'التفاصيل',book_tickets:'احجز تذاكر',
    add_watchlist:'أضف لقائمة المشاهدة',remove_watchlist:'إزالة من قائمة المشاهدة',
    status_now:'يُعرض الآن',status_soon:'قريباً',status_ended:'لم يعد يُعرض',price_demo:'سعر تجريبي',price_published:'سعر مُعلن',
    showtimes_demo_note:'مواعيد توضيحية — ليست حجزاً حقيقياً',seatvision_demo_note:'محاكاة SeatVision توضيحية.',
    select_seats:'اختر الكراسي',screen_this_way:'الشاشة في هذا الاتجاه',seat_available:'متاح',seat_selected:'مختار',seat_occupied:'محجوز',
    seat_premium:'مميز',seat_accessible:'ذوي احتياجات',seat_companion:'مرافق',total:'الإجمالي',subtotal:'المجموع',checkout:'إتمام الشراء',
    confirm_pay_demo:'تأكيد ودفع — تجريبي',demo_no_payment:'عملية تجريبية — لم يتم خصم أي أموال حقيقية.',demo_ticket_warning:'تذكرة تجريبية — غير صالحة للدخول.',
    back:'رجوع',next:'التالي',close:'إغلاق',continue:'متابعة',clear_cart:'تفريغ السلة',remove:'إزالة',booking_reference:'رقم الحجز',
    download_ticket:'تحميل التذكرة',print_ticket:'طباعة التذكرة',empty_cart:'سلتك فاضية.',empty_results:'لا توجد نتائج.',loading:'جاري التحميل…',
    footer_legal:'CINEVERSE مشروع مستقل من مايكي. غير تابع لأي جهة سينمائية.'
  }
};

return { config, sources, genres, formats, operators, venues, auditoriums, movies, showtimes, foodCategories, foodItems, offers, translations, shoofAflam };
})();