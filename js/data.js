// ==========================================================================
// دار البراوني الفاخر | ChocoCraft Lounge - قاعدة البيانات والمنتجات
// ==========================================================================

const BROWNIE_DATA = {
  // قواعد البراوني الأساسية
  bases: [
    {
      id: 'base-fudge',
      name: 'كلاسيك فدج بلجيكي',
      nameEn: 'Classic Belgian Fudge',
      description: 'فدجي غني ومذاب من الداخل محضر من أجود أنواع الشوكولاتة البلجيكية 60%',
      price: 24,
      calories: 380,
      badge: 'الأكثر مبيعاً ⭐',
      color: '#3d1c06',
      texture: 'fudge',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'base-triple-dark',
      name: 'تريبل دارك تشوكليت 70%',
      nameEn: 'Triple Dark 70%',
      description: 'ثلاث طبقات شوكولاتة داكنة نقية لعشاق المذاق القوي والعميق مع قطع شوكولاتة ذائبة',
      price: 26,
      calories: 360,
      badge: 'لعشاق الداكن 🍫',
      color: '#210c02',
      texture: 'dark',
      image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'base-salted-caramel',
      name: 'كراميل مملح وبيكان محمص',
      nameEn: 'Salted Caramel Pecan',
      description: 'مزيج فاخر بين حلاوة الكراميل الفرنسي ورشة ملح مالدون البحري مع حبات البيكان',
      price: 28,
      calories: 420,
      badge: 'توقيع الشيف 👑',
      color: '#52290d',
      texture: 'caramel',
      image: 'https://images.unsplash.com/photo-1589218436045-ee320057f443?w=600&auto=format&fit=crop&q=80'
    }
  ],

  // الصلصات الدافئة المذابة
  sauces: [
    { id: 'sauce-milk-choco', name: 'شوكولاتة بلجيكية حليبية', price: 4, color: '#6a3818', icon: '🍫' },
    { id: 'sauce-dark-choco', name: 'شوكولاتة داكنة غنية 70%', price: 4, color: '#2b1204', icon: '🌑' },
    { id: 'sauce-salted-caramel', name: 'كراميل فرنسي مملح ساخن', price: 5, color: '#c67d26', icon: '🍯' },
    { id: 'sauce-lotus', name: 'زبدة اللوتس بيسكوف المذابة', price: 5, color: '#b96c2e', icon: '🍪' },
    { id: 'sauce-pistachio-cream', name: 'كريمة الفستق الحلبي الإيطالية', price: 7, color: '#7ba05b', icon: '✨' },
    { id: 'sauce-white-choco', name: 'شوكولاتة بيضاء سويسرية', price: 4, color: '#e8dcba', icon: '🥛' },
    { id: 'sauce-nutella', name: 'نوتيلا بندق دافئة', price: 5, color: '#4a2511', icon: '🌰' }
  ],

  // المقرمشات والتوبينجز
  toppings: [
    { id: 'top-pecan', name: 'بيكان محمص بالعسل', price: 6, icon: '🥜', category: 'nuts' },
    { id: 'top-pistachio-crushed', name: 'فستق حلبي مجروش ناعم', price: 6, icon: '💚', category: 'nuts' },
    { id: 'top-hazelnut', name: 'بندق إيطالي محمص', price: 5, icon: '🌰', category: 'nuts' },
    { id: 'top-kinder-chunks', name: 'قطع كندر بوينو مقرمشة', price: 6, icon: '🍫', category: 'chocolate' },
    { id: 'top-oreo-crumbs', name: 'فتات أوريو مقرمش', price: 4, icon: '🍪', category: 'crunch' },
    { id: 'top-lotus-crumbs', name: 'بسكويت لوتس مطحون', price: 4, icon: '🍘', category: 'crunch' },
    { id: 'top-fudge-cubes', name: 'مكعبات فدج طرية إضافية', price: 5, icon: '🟫', category: 'chocolate' },
    { id: 'top-marshmallow', name: 'مارشميلو محمص باللهب', price: 4, icon: '🔥', category: 'sweet' },
    { id: 'top-strawberries', name: 'قطع فراولة طازجة', price: 5, icon: '🍓', category: 'fruit' },
    { id: 'top-sea-salt', name: 'رشة رقائق ملح مالدون الفاخر', price: 2, icon: '🧂', category: 'gourmet' }
  ],

  // إضافات التميز والتقديم
  extras: [
    { id: 'ext-gelato', name: 'سكوب آيس كريم جيلاتو فانيلا مدغشقر', price: 8, icon: '🍨', visualType: 'icecream' },
    { id: 'ext-gold-leaf', name: 'لمسة ورق الذهب القابل للأكل 24K', price: 12, icon: '✨', visualType: 'gold' },
    { id: 'ext-molten-core', name: 'قلب مذاب مضاعف من الشوكولاتة البلجيكية', price: 6, icon: '🌋', visualType: 'core' }
  ],

  // أحجام التقديم والبوكسات
  boxSizes: [
    { id: 'box-single', name: 'قطعة فردية فاخرة', pieces: 1, multiplier: 1, discount: 0, tag: 'فردي' },
    { id: 'box-pack4', name: 'بوكس السعادة (4 قطع)', pieces: 4, multiplier: 3.6, discount: 10, tag: 'خصم 10%' },
    { id: 'box-pack9', name: 'بوكس الجمعات الفاخر (9 قطع)', pieces: 9, multiplier: 7.2, discount: 20, tag: 'خصم 20% 🔥' }
  ],

  // درجات الحرارة والتقديم
  heatOptions: [
    { id: 'heat-warm', name: 'دافئ ومذاب من الفرن (50°C)', desc: 'تذوب الشوكولاتة في فمك مع كل قضمة', icon: '🔥' },
    { id: 'heat-chilled', name: 'بارد فدجي غني ومكثف', desc: 'قوام كلاسيكي متماسك وشديد الغنى', icon: '❄️' }
  ],

  // درجات الحلاوة
  sweetnessLevels: [
    { id: 'sweet-50', name: 'متوازن وخفيف (50%)', desc: 'تركيز أعلى على كاكاو الشوكولاتة' },
    { id: 'sweet-75', name: 'كلاسيكي مضبوط (75%)', desc: 'الحلاوة المثالية المتوازنة' },
    { id: 'sweet-100', name: 'غني ومكثف (100%)', desc: 'حلاوة كاملة لعشاق الحلويات' }
  ],

  // كوبونات الخصم الفعالة
  promoCodes: {
    'BROWNIE10': { discountPercent: 10, minOrder: 30, desc: 'خصم 10% لعملاء المتجر' },
    'CHOCO20': { discountPercent: 20, minOrder: 60, desc: 'خصم 20% لطلبات البوكسات' },
    'SWEETVIP': { discountPercent: 25, minOrder: 100, desc: 'خصم 25% VIP لطلبات الحفلات' }
  },

  // عبوات صوصات التغميس الدافئة الجانبية (60 مل)
  dipJars: [
    { id: 'dip-caramel', name: 'عبوة كراميل فرنسي مملح دافئ', price: 6, icon: '🍯', size: '60ml' },
    { id: 'dip-dark', name: 'عبوة شوكولاتة بلجيكية داكنة 70%', price: 6, icon: '🍫', size: '60ml' },
    { id: 'dip-lotus', name: 'عبوة زبدة اللوتس بيسكوف المذابة', price: 6, icon: '🍪', size: '60ml' },
    { id: 'dip-pistachio', name: 'عبوة كريمة الفستق الإيطالية', price: 7, icon: '✨', size: '60ml' }
  ],

  // ألوان شريط الإهداء الفاخر
  giftingRibbons: [
    { id: 'ribbon-gold', name: 'شريط حريري ذهبي ملكي', color: '#d4af37', icon: '🎗️' },
    { id: 'ribbon-black', name: 'شريط أسود كلاسيكي فاخر', color: '#111111', icon: '🖤' },
    { id: 'ribbon-burgundy', name: 'شريط برغندي مخملي راقي', color: '#6b111b', icon: '🍷' }
  ],

  // تقييمات وتجارب عملاء الرياض الموثقة (براوني 100%)
  customerReviews: [
    {
      id: 'rev-1',
      name: 'عبدالعزيز القحطاني',
      district: 'الرياض - حي النرجس',
      rating: 5,
      comment: 'أفضل براوني أكلته بحياتي! وصلني ساخن ومذاب من الداخل والبيكان المحمص مع رشة ملح مالدون خيال 😍👏',
      avatar: '👨‍💼',
      time: 'منذ 3 ساعات'
    },
    {
      id: 'rev-2',
      name: 'ريم السديري',
      district: 'الرياض - حي حطين',
      rating: 5,
      comment: 'طلبنا بوكس الجمعات 9 قطع للدوام، التغليف والإهداء والشريط الذهبي يبيّض الوجه والشوكولاتة البلجيكية راهية وفاخرة!',
      avatar: '👩‍💻',
      time: 'منذ يوم'
    },
    {
      id: 'rev-3',
      name: 'سلطان الدوسري',
      district: 'الرياض - حي الملقا',
      rating: 5,
      comment: 'براوني التريبل دارك 70% مع سكوب الجيلاتو والقلب المذاب لا يُعلى عليه. التوصيل سريع بحافظات حرارية دافئة 👍',
      avatar: '🍫',
      time: 'منذ يومين'
    }
  ],

  // خلطات وتوليفات الشيف السرية (لميزة "أبهرني")
  chefMysteryMixes: [
    {
      name: 'توليفة الذهب & الكراميل الملكي',
      baseId: 'base-salted-caramel',
      sauces: ['sauce-salted-caramel', 'sauce-milk-choco'],
      toppings: ['top-pecan', 'top-sea-salt'],
      extras: ['ext-gelato', 'ext-gold-leaf'],
      heat: 'heat-warm',
      sweetness: 'sweet-75'
    },
    {
      name: 'انفجار التريبل دارك & البندق الإيطالي',
      baseId: 'base-triple-dark',
      sauces: ['sauce-dark-choco', 'sauce-white-choco'],
      toppings: ['top-hazelnut', 'top-fudge-cubes'],
      extras: ['ext-molten-core', 'ext-gelato'],
      heat: 'heat-warm',
      sweetness: 'sweet-50'
    },
    {
      name: 'سحر الفدج البلجيكي & اللوتس',
      baseId: 'base-fudge',
      sauces: ['sauce-milk-choco', 'sauce-lotus'],
      toppings: ['top-lotus-crumbs', 'top-marshmallow'],
      extras: ['ext-gelato'],
      heat: 'heat-warm',
      sweetness: 'sweet-75'
    }
  ],

  // طلبات أولية للعرض في لوحة تحكم المالك
  initialOrders: [
    {
      id: 'BRW-9012',
      customerName: 'سارة العتيبي',
      phone: '0551234567',
      address: 'الرياض - حي النرجس، شارع أنس بن مالك',
      paymentMethod: 'Apple Pay',
      paymentStatus: 'مدفوع إلكترونياً ✅',
      total: 82.50,
      timestamp: 'منذ 10 دقائق',
      status: 'baking', // received, baking, decorating, delivering, completed
      items: [
        {
          name: 'كراميل مملح وبيكان محمص',
          boxSizeName: 'بوكس السعادة (4 قطع)',
          saucesNames: ['كراميل فرنسي مملح ساخن', 'شوكولاتة بلجيكية حليبية'],
          toppingsNames: ['بيكان محمص بالعسل', 'رشة رقائق ملح مالدون الفاخر'],
          extrasNames: ['سكوب آيس كريم جيلاتو فانيلا مدغشقر'],
          heatName: 'دافئ ومذاب من الفرن (50°C)',
          quantity: 1,
          unitPrice: 82.50,
          price: 82.50
        }
      ]
    },
    {
      id: 'BRW-9011',
      customerName: 'محمد الشهري',
      phone: '0509876543',
      address: 'الرياض - حي الملقا، طريق الملك فهد',
      paymentMethod: 'مدى (Mada)',
      paymentStatus: 'مدفوع إلكترونياً ✅',
      total: 135.00,
      timestamp: 'منذ 25 دقيقة',
      status: 'decorating',
      items: [
        {
          name: 'تريبل دارك تشوكليت 70%',
          boxSizeName: 'بوكس الجمعات الفاخر (9 قطع)',
          saucesNames: ['شوكولاتة داكنة غنية 70%', 'شوكولاتة بيضاء سويسرية'],
          toppingsNames: ['بندق إيطالي محمص', 'مارشميلو محمص باللهب'],
          extrasNames: ['لمسة ورق الذهب القابل للأكل 24K'],
          heatName: 'دافئ ومذاب من الفرن (50°C)',
          quantity: 1,
          unitPrice: 135.00,
          price: 135.00
        }
      ]
    },
    {
      id: 'BRW-9010',
      customerName: 'نورة الدوسري',
      phone: '0543322114',
      address: 'الرياض - حي العليا، طريق الملك فهد',
      paymentMethod: 'الدفع عند الاستلام',
      paymentStatus: 'عند التوصيل',
      total: 58.00,
      timestamp: 'منذ 45 دقيقة',
      status: 'delivering',
      items: [
        {
          name: 'كلاسيك فدج بلجيكي',
          boxSizeName: 'قطعة فردية فاخرة',
          saucesNames: ['شوكولاتة بلجيكية حليبية'],
          toppingsNames: ['فتات أوريو مقرمش'],
          extrasNames: ['سكوب آيس كريم جيلاتو فانيلا مدغشقر'],
          heatName: 'بارد فدجي غني ومكثف',
          quantity: 2,
          unitPrice: 29.00,
          price: 29.00
        }
      ]
    }
  ]
};

// جعل المتغير متاحاً على نطاق التطبيق
window.BROWNIE_DATA = BROWNIE_DATA;
