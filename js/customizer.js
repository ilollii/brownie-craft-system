// ==========================================================================
// دار البراوني الفاخر | ChocoCraft Lounge - محرك التخصيص المرئي المباشر
// ==========================================================================

class BrownieCustomizer {
  constructor() {
    this.state = {
      editingCartItemId: null,
      base: BROWNIE_DATA.bases[0],
      sauces: [],
      toppings: [],
      extras: [],
      heat: 'heat-warm',
      sweetness: 'sweet-75',
      boxSize: 'box-single',
      notes: '',
      quantity: 1
    };

    this.initDOM();
  }

  initDOM() {
    this.modal = document.getElementById('customizerModal');
    this.previewContainer = document.getElementById('brownieVisualPreview');
    this.priceBadge = document.getElementById('customizerPrice');
    this.titleBadge = document.getElementById('customizerBaseTitle');
    this.submitBtn = document.getElementById('customizerSubmitBtn');
  }

  // فتح نافذة التخصيص لنوع محدد أو لتعديل عنصر موجود في السلة
  open(baseIdOrItem, isEditing = false) {
    window.soundManager.playClick();
    
    if (isEditing && typeof baseIdOrItem === 'object') {
      // وضع التعديل (Edit Mode)
      const item = baseIdOrItem;
      this.state.editingCartItemId = item.id;
      this.state.base = BROWNIE_DATA.bases.find(b => b.id === item.baseId) || BROWNIE_DATA.bases[0];
      this.state.sauces = [...(item.sauces || [])];
      this.state.toppings = [...(item.toppings || [])];
      this.state.extras = [...(item.extras || [])];
      this.state.heat = item.heat || 'heat-warm';
      this.state.sweetness = item.sweetness || 'sweet-75';
      this.state.boxSize = item.boxSize || 'box-single';
      this.state.notes = item.notes || '';
      this.state.quantity = item.quantity || 1;
    } else {
      // وضع إضافة جديد (New Item Mode)
      const baseId = typeof baseIdOrItem === 'string' ? baseIdOrItem : 'base-fudge';
      const base = BROWNIE_DATA.bases.find(b => b.id === baseId) || BROWNIE_DATA.bases[0];
      this.state = {
        editingCartItemId: null,
        base: base,
        sauces: [BROWNIE_DATA.sauces[0].id], // اختيار افتراضي لأول صوص
        toppings: [],
        extras: [],
        heat: 'heat-warm',
        sweetness: 'sweet-75',
        boxSize: 'box-single',
        notes: '',
        quantity: 1
      };
    }

    this.renderTabsAndOptions();
    this.updateVisualPreview();
    this.updatePrice();

    if (this.submitBtn) {
      this.submitBtn.innerHTML = this.state.editingCartItemId
        ? `<i class="fa-solid fa-check-double"></i> حفظ وتحديث التعديلات`
        : `<i class="fa-solid fa-cart-plus"></i> إضافة البراوني المخصص إلى السلة`;
    }

    if (this.modal) {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  // ميزة اقتراح الشيف السري / أبهرني (Mystery Chef Mix)
  triggerMysteryMix() {
    const mixes = BROWNIE_DATA.chefMysteryMixes;
    const randomMix = mixes[Math.floor(Math.random() * mixes.length)];
    const base = BROWNIE_DATA.bases.find(b => b.id === randomMix.baseId) || BROWNIE_DATA.bases[0];

    this.state.base = base;
    this.state.sauces = [...randomMix.sauces];
    this.state.toppings = [...randomMix.toppings];
    this.state.extras = [...randomMix.extras];
    this.state.heat = randomMix.heat || 'heat-warm';
    this.state.sweetness = randomMix.sweetness || 'sweet-75';

    window.soundManager.playSuccess();
    this.renderTabsAndOptions();
    this.updateVisualPreview();
    this.updatePrice();
    window.app.showToast(`✨ تم اختيار: "${randomMix.name}"!`, 'success');
  }

  close() {
    window.soundManager.playClick();
    if (this.modal) {
      this.modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  // بناء واجهة خيارات التخصيص
  renderTabsAndOptions() {
    // 1. القواعد
    const basesContainer = document.getElementById('optBasesList');
    if (basesContainer) {
      basesContainer.innerHTML = BROWNIE_DATA.bases.map(b => `
        <div class="custom-card-opt ${this.state.base.id === b.id ? 'selected' : ''}" onclick="window.customizer.selectBase('${b.id}')">
          <div class="opt-indicator"></div>
          <div class="opt-content">
            <div class="opt-header">
              <span class="opt-name">${b.name}</span>
              <span class="opt-price">${b.price} ر.س</span>
            </div>
            <p class="opt-desc">${b.description}</p>
            <span class="opt-badge">${b.badge}</span>
          </div>
        </div>
      `).join('');
    }

    // 2. الصلصات
    const saucesContainer = document.getElementById('optSaucesList');
    if (saucesContainer) {
      saucesContainer.innerHTML = BROWNIE_DATA.sauces.map(s => {
        const isSelected = this.state.sauces.includes(s.id);
        return `
          <div class="pill-chip ${isSelected ? 'active' : ''}" onclick="window.customizer.toggleSauce('${s.id}')">
            <span class="pill-icon">${s.icon}</span>
            <div class="pill-info">
              <span class="pill-title">${s.name}</span>
              <span class="pill-cost">+${s.price} ر.س</span>
            </div>
            <span class="pill-check"><i class="fa-solid fa-${isSelected ? 'check' : 'plus'}"></i></span>
          </div>
        `;
      }).join('');
    }

    // 3. المقرمشات والتوبينجز
    const toppingsContainer = document.getElementById('optToppingsList');
    if (toppingsContainer) {
      toppingsContainer.innerHTML = BROWNIE_DATA.toppings.map(t => {
        const isSelected = this.state.toppings.includes(t.id);
        return `
          <div class="pill-chip ${isSelected ? 'active' : ''}" onclick="window.customizer.toggleTopping('${t.id}')">
            <span class="pill-icon">${t.icon}</span>
            <div class="pill-info">
              <span class="pill-title">${t.name}</span>
              <span class="pill-cost">+${t.price} ر.س</span>
            </div>
            <span class="pill-check"><i class="fa-solid fa-${isSelected ? 'check' : 'plus'}"></i></span>
          </div>
        `;
      }).join('');
    }

    // 4. إضافات التميز
    const extrasContainer = document.getElementById('optExtrasList');
    if (extrasContainer) {
      extrasContainer.innerHTML = BROWNIE_DATA.extras.map(e => {
        const isSelected = this.state.extras.includes(e.id);
        return `
          <div class="luxury-extra-card ${isSelected ? 'active' : ''}" onclick="window.customizer.toggleExtra('${e.id}')">
            <div class="luxury-extra-icon">${e.icon}</div>
            <div class="luxury-extra-text">
              <h4>${e.name}</h4>
              <span class="cost-tag">+${e.price} ر.س</span>
            </div>
            <div class="luxury-check">
              <i class="fa-solid fa-${isSelected ? 'circle-check' : 'circle-plus'}"></i>
            </div>
          </div>
        `;
      }).join('');
    }

    // 5. حجم التقديم والبوكس
    const sizesContainer = document.getElementById('optSizesList');
    if (sizesContainer) {
      sizesContainer.innerHTML = BROWNIE_DATA.boxSizes.map(s => `
        <div class="size-select-card ${this.state.boxSize === s.id ? 'active' : ''}" onclick="window.customizer.selectBoxSize('${s.id}')">
          <div class="size-header">
            <span class="size-tag">${s.tag}</span>
            <span class="size-pieces">${s.pieces} ${s.pieces > 1 ? 'قطع' : 'قطعة'}</span>
          </div>
          <h4>${s.name}</h4>
        </div>
      `).join('');
    }

    // 6. درجات الحرارة
    const heatContainer = document.getElementById('optHeatList');
    if (heatContainer) {
      heatContainer.innerHTML = BROWNIE_DATA.heatOptions.map(h => `
        <div class="heat-chip ${this.state.heat === h.id ? 'active' : ''}" onclick="window.customizer.selectHeat('${h.id}')">
          <span class="heat-icon">${h.icon}</span>
          <div>
            <strong>${h.name}</strong>
            <p>${h.desc}</p>
          </div>
        </div>
      `).join('');
    }

    // 7. درجات الحلاوة
    const sweetContainer = document.getElementById('optSweetList');
    if (sweetContainer) {
      sweetContainer.innerHTML = BROWNIE_DATA.sweetnessLevels.map(sw => `
        <div class="sweet-chip ${this.state.sweetness === sw.id ? 'active' : ''}" onclick="window.customizer.selectSweetness('${sw.id}')">
          <strong>${sw.name}</strong>
          <small>${sw.desc}</small>
        </div>
      `).join('');
    }

    // 8. الملاحظات
    const notesInput = document.getElementById('optSpecialNotes');
    if (notesInput) {
      notesInput.value = this.state.notes || '';
    }
  }

  // تحديد نوع القاعدة
  selectBase(baseId) {
    const base = BROWNIE_DATA.bases.find(b => b.id === baseId);
    if (base) {
      this.state.base = base;
      window.soundManager.playToppingDrop();
      this.renderTabsAndOptions();
      this.updateVisualPreview();
      this.updatePrice();
    }
  }

  // تفعيل/إلغاء الصلصات
  toggleSauce(sauceId) {
    window.soundManager.playToppingDrop();
    const index = this.state.sauces.indexOf(sauceId);
    if (index > -1) {
      this.state.sauces.splice(index, 1);
    } else {
      this.state.sauces.push(sauceId);
    }
    this.renderTabsAndOptions();
    this.updateVisualPreview();
    this.updatePrice();
  }

  // تفعيل/إلغاء التوبينجز
  toggleTopping(toppingId) {
    window.soundManager.playToppingDrop();
    const index = this.state.toppings.indexOf(toppingId);
    if (index > -1) {
      this.state.toppings.splice(index, 1);
    } else {
      this.state.toppings.push(toppingId);
    }
    this.renderTabsAndOptions();
    this.updateVisualPreview();
    this.updatePrice();
  }

  // تفعيل/إلغاء الإضافات المميزة
  toggleExtra(extraId) {
    window.soundManager.playToppingDrop();
    const index = this.state.extras.indexOf(extraId);
    if (index > -1) {
      this.state.extras.splice(index, 1);
    } else {
      this.state.extras.push(extraId);
    }
    this.renderTabsAndOptions();
    this.updateVisualPreview();
    this.updatePrice();
  }

  selectBoxSize(sizeId) {
    window.soundManager.playClick();
    this.state.boxSize = sizeId;
    this.renderTabsAndOptions();
    this.updateVisualPreview();
    this.updatePrice();
  }

  selectHeat(heatId) {
    window.soundManager.playClick();
    this.state.heat = heatId;
    this.renderTabsAndOptions();
    this.updateVisualPreview();
  }

  selectSweetness(sweetId) {
    window.soundManager.playClick();
    this.state.sweetness = sweetId;
    this.renderTabsAndOptions();
  }

  // تحديث المعاينة البصرية المباشرة للبراوني المخصص
  updateVisualPreview() {
    if (!this.previewContainer) return;

    const base = this.state.base;
    const isWarm = this.state.heat === 'heat-warm';
    const hasGelato = this.state.extras.includes('ext-gelato');
    const hasGold = this.state.extras.includes('ext-gold-leaf');
    const hasMoltenCore = this.state.extras.includes('ext-molten-core');

    // مسارات الصلصات الديناميكية
    let saucesSvg = '';
    this.state.sauces.forEach((sauceId, idx) => {
      const sauce = BROWNIE_DATA.sauces.find(s => s.id === sauceId);
      if (!sauce) return;
      const color = sauce.color;
      const offset = (idx * 28) - 30;
      saucesSvg += `
        <path d="M ${40 + offset} 20 Q ${120 + offset} 80, ${260 + offset} 120 T ${380 + offset} 240" 
              stroke="${color}" stroke-width="14" fill="none" stroke-linecap="round" 
              filter="url(#sauceGlow)" opacity="0.92" class="animate-drizzle" />
        <path d="M ${280 - offset} 20 Q ${180 - offset} 130, ${100 - offset} 250" 
              stroke="${color}" stroke-width="10" fill="none" stroke-linecap="round" 
              filter="url(#sauceGlow)" opacity="0.88" class="animate-drizzle" />
        <circle cx="${180 + offset}" cy="${150 + offset}" r="7" fill="${color}" opacity="0.9" />
        <circle cx="${240 - offset}" cy="${190}" r="9" fill="${color}" opacity="0.9" />
      `;
    });

    // عناصر المقرمشات والتوبينجز في المعاينة
    let toppingsHtml = '';
    this.state.toppings.forEach((topId) => {
      const topping = BROWNIE_DATA.toppings.find(t => t.id === topId);
      if (!topping) return;

      // توليد قطع عشوائية متناسقة للتوبينج
      const positions = [
        { top: '35%', left: '30%', deg: '15deg' },
        { top: '55%', left: '60%', deg: '-20deg' },
        { top: '40%', left: '70%', deg: '45deg' },
        { top: '65%', left: '40%', deg: '-10deg' },
        { top: '28%', left: '50%', deg: '30deg' }
      ];

      positions.forEach((pos, pIdx) => {
        toppingsHtml += `
          <div class="visual-topping-piece pop-anim" style="top:${pos.top}; left:${pos.left}; transform: rotate(${pos.deg});">
            ${topping.icon}
          </div>
        `;
      });
    });

    // آيس كريم الجيلاتو
    let gelatoHtml = '';
    if (hasGelato) {
      gelatoHtml = `
        <div class="visual-gelato-scoop bounce-anim">
          <div class="gelato-body">
            <div class="gelato-vanilla-specks"></div>
            <div class="gelato-drip"></div>
          </div>
          <span class="gelato-tag">🍨 جيلاتو فانيلا</span>
        </div>
      `;
    }

    // ورق الذهب
    let goldHtml = '';
    if (hasGold) {
      goldHtml = `
        <div class="visual-gold-flakes shimmer-gold">
          <div class="gold-flake f1">✨</div>
          <div class="gold-flake f2">✨</div>
          <div class="gold-flake f3">✨</div>
        </div>
      `;
    }

    // بخار الحرارة
    let steamHtml = '';
    if (isWarm) {
      steamHtml = `
        <div class="steam-container">
          <div class="steam s1"></div>
          <div class="steam s2"></div>
          <div class="steam s3"></div>
        </div>
      `;
    }

    // بناء الهيكل التفاعلي داخل الحاوية
    this.previewContainer.innerHTML = `
      <div class="live-cake-scene ${this.state.heat}">
        ${steamHtml}
        
        <!-- قالب البراوني الثلاثي الأبعاد -->
        <div class="brownie-3d-block" style="--base-color: ${base.color};">
          <div class="brownie-top-surface">
            <!-- نسيج الشوكولاتة والتشققات -->
            <div class="crust-texture texture-${base.texture}"></div>
            ${hasMoltenCore ? '<div class="molten-core-lava"></div>' : ''}
            
            <!-- طبقة الصوصات SVG -->
            <svg class="sauces-svg-layer" viewBox="0 0 400 300">
              <defs>
                <filter id="sauceGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              ${saucesSvg}
            </svg>

            <!-- طبقة التوبينجز والمقرمشات -->
            <div class="toppings-dom-layer">
              ${toppingsHtml}
            </div>

            <!-- ورق الذهب -->
            ${goldHtml}

            <!-- سكوب الآيس كريم في المنتصف -->
            ${gelatoHtml}
          </div>
          
          <!-- جوانب البراوني ثلاثية الأبعاد الفدجية -->
          <div class="brownie-front-edge"></div>
          <div class="brownie-side-edge"></div>
        </div>

        <!-- معلومات وحجم البوكس المختار -->
        <div class="preview-badge-layer">
          <span class="badge-size-pill"><i class="fa-solid fa-box-open"></i> ${BROWNIE_DATA.boxSizes.find(s => s.id === this.state.boxSize).name}</span>
          <span class="badge-heat-pill">${isWarm ? '🔥 دافئ (50°C)' : '❄️ فدجي بارد'}</span>
        </div>
      </div>
    `;
  }

  // حساب السعر الإجمالي للبند المخصص
  calculateItemPrice() {
    let unitPrice = this.state.base.price;

    // إضافة أسعار الصلصات
    this.state.sauces.forEach(sId => {
      const sauce = BROWNIE_DATA.sauces.find(s => s.id === sId);
      if (sauce) unitPrice += sauce.price;
    });

    // إضافة أسعار المقرمشات
    this.state.toppings.forEach(tId => {
      const top = BROWNIE_DATA.toppings.find(t => t.id === tId);
      if (top) unitPrice += top.price;
    });

    // إضافة أسعار إضافات التميز
    this.state.extras.forEach(eId => {
      const ext = BROWNIE_DATA.extras.find(e => e.id === eId);
      if (ext) unitPrice += ext.price;
    });

    // تطبيق معامل البوكس والخصم
    const box = BROWNIE_DATA.boxSizes.find(b => b.id === this.state.boxSize);
    const boxPrice = unitPrice * (box ? box.multiplier : 1);

    return {
      unitSinglePiecePrice: unitPrice,
      totalBoxPrice: parseFloat(boxPrice.toFixed(2))
    };
  }

  // تحديث شارة السعر وعنوان القاعدة
  updatePrice() {
    const { totalBoxPrice } = this.calculateItemPrice();
    if (this.priceBadge) {
      this.priceBadge.innerText = `${totalBoxPrice.toFixed(2)} ر.س`;
    }
    if (this.titleBadge) {
      this.titleBadge.innerText = this.state.base.name;
    }
  }

  // حفظ البراوني وإرساله إلى السلة (إضافة أو تعديل)
  submitCustomization() {
    const notesInput = document.getElementById('optSpecialNotes');
    if (notesInput) {
      this.state.notes = notesInput.value.trim();
    }

    const { totalBoxPrice } = this.calculateItemPrice();

    const sauceObjects = this.state.sauces.map(sId => BROWNIE_DATA.sauces.find(s => s.id === sId)?.name).filter(Boolean);
    const toppingObjects = this.state.toppings.map(tId => BROWNIE_DATA.toppings.find(t => t.id === tId)?.name).filter(Boolean);
    const extraObjects = this.state.extras.map(eId => BROWNIE_DATA.extras.find(e => e.id === eId)?.name).filter(Boolean);
    const boxObj = BROWNIE_DATA.boxSizes.find(b => b.id === this.state.boxSize);
    const heatObj = BROWNIE_DATA.heatOptions.find(h => h.id === this.state.heat);
    const sweetObj = BROWNIE_DATA.sweetnessLevels.find(s => s.id === this.state.sweetness);

    const customizedItem = {
      id: this.state.editingCartItemId || `item-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      baseId: this.state.base.id,
      name: this.state.base.name,
      baseImage: this.state.base.image,
      sauces: this.state.sauces,
      saucesNames: sauceObjects,
      toppings: this.state.toppings,
      toppingsNames: toppingObjects,
      extras: this.state.extras,
      extrasNames: extraObjects,
      boxSize: this.state.boxSize,
      boxSizeName: boxObj?.name || 'قطعة فردية',
      boxPieces: boxObj?.pieces || 1,
      heat: this.state.heat,
      heatName: heatObj?.name || 'دافئ',
      sweetness: this.state.sweetness,
      sweetnessName: sweetObj?.name || 'متوازن',
      notes: this.state.notes,
      unitPrice: totalBoxPrice,
      quantity: this.state.quantity || 1
    };

    if (this.state.editingCartItemId) {
      // تعديل صنف موجود
      window.cartManager.updateItem(this.state.editingCartItemId, customizedItem);
      window.app.showToast('تم تحديث خيارات وتفاصيل البراوني بنجاح! 🍫✨', 'success');
    } else {
      // إضافة صنف جديد
      window.cartManager.addItem(customizedItem);
      window.app.showToast('تمت إضافة البراوني المخصص إلى سلتك الشهية! 🛒🍫', 'success');
    }

    window.soundManager.playAddToCart();
    this.close();
  }
}

window.customizer = new BrownieCustomizer();
