// ==========================================================================
// دار البراوني الفاخر | ChocoCraft Lounge - إدارة السلة والعمليات (CRUD)
// ==========================================================================

class CartManager {
  constructor() {
    this.items = [];
    this.appliedPromo = null;
    this.deliveryFee = 15; // رسوم التوصيل الافتراضية
    this.freeDeliveryThreshold = 120; // توصيل مجاني للطلبات فوق 120 ر.س
    this.vatRate = 0.15; // ضريبة القيمة المضافة 15%

    this.loadFromStorage();
    this.initDOM();
  }

  initDOM() {
    this.cartDrawer = document.getElementById('cartDrawer');
    this.cartOverlay = document.getElementById('cartOverlay');
    this.cartItemsList = document.getElementById('cartItemsList');
    this.cartBadge = document.getElementById('cartBadgeCount');
    this.subtotalEl = document.getElementById('cartSubtotal');
    this.discountRow = document.getElementById('cartDiscountRow');
    this.discountEl = document.getElementById('cartDiscountAmount');
    this.deliveryEl = document.getElementById('cartDeliveryFee');
    this.vatEl = document.getElementById('cartVatAmount');
    this.totalEl = document.getElementById('cartGrandTotal');
    this.promoInput = document.getElementById('cartPromoInput');
    this.promoMsg = document.getElementById('cartPromoMsg');
    this.checkoutBtn = document.getElementById('cartCheckoutBtn');
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('choco_craft_cart');
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      this.items = [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('choco_craft_cart', JSON.stringify(this.items));
    } catch (e) {
      console.error(e);
    }
  }

  // ================= C R U D =================

  // 1. ADD (إضافة عنصر إلى السلة)
  addItem(item) {
    this.items.push(item);
    this.saveToStorage();
    this.render();
    this.openDrawer();
  }

  // إضافة سريعة لنوع براوني محدد من القائمة مباشرة مع الإعدادات الافتراضية
  quickAddBase(baseId) {
    const base = BROWNIE_DATA.bases.find(b => b.id === baseId);
    if (!base) return;

    const quickItem = {
      id: `item-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      baseId: base.id,
      name: base.name,
      baseImage: base.image,
      sauces: [BROWNIE_DATA.sauces[0].id],
      saucesNames: [BROWNIE_DATA.sauces[0].name],
      toppings: [],
      toppingsNames: [],
      extras: [],
      extrasNames: [],
      boxSize: 'box-single',
      boxSizeName: 'قطعة فردية فاخرة',
      boxPieces: 1,
      heat: 'heat-warm',
      heatName: 'دافئ ومذاب من الفرن (50°C)',
      sweetness: 'sweet-75',
      sweetnessName: 'كلاسيكي مضبوط (75%)',
      notes: '',
      unitPrice: base.price + BROWNIE_DATA.sauces[0].price,
      quantity: 1
    };

    window.soundManager.playAddToCart();
    this.addItem(quickItem);
    window.app.showToast(`تمت إضافة ${base.name} إلى السلة! 🍫`, 'success');
  }

  // إضافة عبوة تغميس دافئة إلى السلة
  addDipJar(dipId) {
    const dip = BROWNIE_DATA.dipJars.find(d => d.id === dipId);
    if (!dip) return;

    const existing = this.items.find(i => i.dipId === dip.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        id: `dip-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        type: 'dip',
        dipId: dip.id,
        name: dip.name,
        baseImage: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80',
        boxSizeName: `عبوة تغميس ${dip.size} 🫙`,
        unitPrice: dip.price,
        quantity: 1
      });
    }

    this.saveToStorage();
    this.render();
    this.openDrawer();
    window.soundManager.playAddToCart();
    window.app.showToast(`تمت إضافة ${dip.name} إلى السلة! 🫙`, 'success');
  }

  // 2. EDIT (تعديل عنصر موجود في السلة)
  editItem(itemId) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    this.closeDrawer();
    window.customizer.open(item, true); // فتح نافذة التخصيص في وضع التعديل
  }

  // تحديث الصنف بعد التعديل
  updateItem(itemId, updatedData) {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updatedData };
      this.saveToStorage();
      this.render();
    }
  }

  // 3. DELETE (حذف عنصر محدد من السلة)
  deleteItem(itemId) {
    window.soundManager.playDelete();
    const item = this.items.find(i => i.id === itemId);
    this.items = this.items.filter(i => i.id !== itemId);
    this.saveToStorage();
    this.render();
    window.app.showToast(`تم حذف ${item ? item.name : 'الصنف'} من السلة`, 'info');
  }

  // إفراغ السلة بالكامل
  clearCart() {
    if (this.items.length === 0) return;
    if (confirm('هل أنت متأكد من رغبتك في إفراغ السلة بالكامل؟')) {
      window.soundManager.playDelete();
      this.items = [];
      this.appliedPromo = null;
      this.saveToStorage();
      this.render();
      window.app.showToast('تم إفراغ السلة بنجاح', 'info');
    }
  }

  // 4. UPDATE QUANTITY (تعديل كمية العنصر)
  updateQuantity(itemId, delta) {
    const item = this.items.find(i => i.id === itemId);
    if (!item) return;

    window.soundManager.playClick();
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      this.deleteItem(itemId);
    } else {
      item.quantity = newQty;
      this.saveToStorage();
      this.render();
    }
  }

  // تطبيق كوبون الخصم
  applyPromo(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    const promo = BROWNIE_DATA.promoCodes[cleanCode];

    if (!promo) {
      window.app.showToast('كوبون الخصم غير صالح أو منتهي الصلاحية ❌', 'error');
      if (this.promoMsg) {
        this.promoMsg.innerText = 'الكوبون غير صالح';
        this.promoMsg.className = 'promo-feedback error';
      }
      return false;
    }

    const subtotal = this.calculateSubtotal();
    if (subtotal < promo.minOrder) {
      window.app.showToast(`الحد الأدنى لتطبيق هذا الكوبون هو ${promo.minOrder} ر.س ⚠️`, 'warning');
      if (this.promoMsg) {
        this.promoMsg.innerText = `الحد الأدنى للطلب ${promo.minOrder} ر.س`;
        this.promoMsg.className = 'promo-feedback warning';
      }
      return false;
    }

    this.appliedPromo = { code: cleanCode, ...promo };
    window.soundManager.playSuccess();
    window.app.showToast(`تم تطبيق الكوبون! خصم ${promo.discountPercent}% 🎉`, 'success');
    if (this.promoMsg) {
      this.promoMsg.innerText = `تم الخصم (${promo.discountPercent}%) بنجاح!`;
      this.promoMsg.className = 'promo-feedback success';
    }
    this.render();
    return true;
  }

  removePromo() {
    this.appliedPromo = null;
    if (this.promoInput) this.promoInput.value = '';
    if (this.promoMsg) {
      this.promoMsg.innerText = '';
      this.promoMsg.className = 'promo-feedback';
    }
    this.render();
  }

  // ================= الحسابات المالية =================

  calculateSubtotal() {
    return this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  calculateTotals() {
    const subtotal = this.calculateSubtotal();
    let discountAmount = 0;

    if (this.appliedPromo) {
      discountAmount = (subtotal * this.appliedPromo.discountPercent) / 100;
    }

    const effectiveSubtotal = Math.max(0, subtotal - discountAmount);
    
    // توصيل مجاني إذا تجاوز الحد الأدنى
    const currentDelivery = subtotal === 0 ? 0 : (effectiveSubtotal >= this.freeDeliveryThreshold ? 0 : this.deliveryFee);
    
    // احتساب الضريبة من القيمة الصافية
    const taxableAmount = effectiveSubtotal + currentDelivery;
    const vatAmount = taxableAmount * this.vatRate;
    const grandTotal = taxableAmount + vatAmount;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      deliveryFee: parseFloat(currentDelivery.toFixed(2)),
      vatAmount: parseFloat(vatAmount.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      itemsCount: this.items.reduce((cnt, item) => cnt + item.quantity, 0)
    };
  }

  // ================= عرض وتحديث الواجهة =================

  render() {
    const totals = this.calculateTotals();

    // تحديث شارة العداد في الهيدر وشريط تطبيق الجوال السفلي
    const mobileBadge = document.getElementById('mobileCartBadge');
    if (this.cartBadge) {
      this.cartBadge.innerText = totals.itemsCount;
      this.cartBadge.style.display = totals.itemsCount > 0 ? 'inline-flex' : 'none';
    }
    if (mobileBadge) {
      mobileBadge.innerText = totals.itemsCount;
      mobileBadge.style.display = totals.itemsCount > 0 ? 'inline-flex' : 'none';
    }

    // بناء قائمة العناصر
    if (this.cartItemsList) {
      if (this.items.length === 0) {
        this.cartItemsList.innerHTML = `
          <div class="empty-cart-state">
            <div class="empty-icon">🍫</div>
            <h3>سلتك فارغة حالياً</h3>
            <p>اختر نوع البراوني المفضل لديك وابدأ بإضافة الصوصات والمقرمشات الفاخرة!</p>
            <button class="btn-primary" onclick="window.cartManager.closeDrawer(); window.location.hash = '#menu';">
              <i class="fa-solid fa-cookie-bite"></i> تصفح قائمة البراوني
            </button>
          </div>
        `;
      } else {
        this.cartItemsList.innerHTML = this.items.map(item => {
          const isBrownie = !item.type || item.type === 'brownie';
          const heatBadge = item.heat ? `<span class="cart-item-heat-badge">${item.heat.includes('warm') ? '🔥 ساخن' : '❄️ بارد'}</span>` : '';

          return `
          <div class="cart-item-card" data-id="${item.id}">
            <div class="cart-item-img">
              <img src="${item.baseImage}" alt="${item.name}" />
              ${heatBadge}
            </div>

            <div class="cart-item-details">
              <div class="cart-item-header">
                <h4>${item.name}</h4>
                <div class="cart-item-actions">
                  ${isBrownie ? `
                    <button class="btn-item-action edit" title="تعديل الإضافات والخيارات" onclick="window.cartManager.editItem('${item.id}')">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                  ` : ''}
                  <button class="btn-item-action delete" title="حذف من السلة" onclick="window.cartManager.deleteItem('${item.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>

              <div class="cart-item-meta">
                <span class="meta-tag"><i class="fa-solid fa-box"></i> ${item.boxSizeName || 'صنف مفرد'}</span>
                ${item.sweetnessName ? `<span class="meta-tag"><i class="fa-solid fa-cubes-stacked"></i> ${item.sweetnessName}</span>` : ''}
              </div>

              <!-- تفاصيل الإضافات والصلصات -->
              <div class="cart-customizations-tags">
                ${item.saucesNames && item.saucesNames.length ? `
                  <div class="custom-row"><small class="custom-label">الصلصات:</small> ${item.saucesNames.map(s => `<span class="custom-bubble sauce">${s}</span>`).join('')}</div>
                ` : ''}
                ${item.toppingsNames && item.toppingsNames.length ? `
                  <div class="custom-row"><small class="custom-label">المقرمشات:</small> ${item.toppingsNames.map(t => `<span class="custom-bubble topping">${t}</span>`).join('')}</div>
                ` : ''}
                ${item.extrasNames && item.extrasNames.length ? `
                  <div class="custom-row"><small class="custom-label">المميزات:</small> ${item.extrasNames.map(e => `<span class="custom-bubble extra">${e}</span>`).join('')}</div>
                ` : ''}
                ${item.notes ? `
                  <div class="custom-row notes"><small class="custom-label">ملاحظة:</small> <em>"${item.notes}"</em></div>
                ` : ''}
              </div>

              <div class="cart-item-bottom">
                <div class="cart-qty-controller">
                  <button class="qty-btn" onclick="window.cartManager.updateQuantity('${item.id}', -1)"><i class="fa-solid fa-minus"></i></button>
                  <span class="qty-num">${item.quantity}</span>
                  <button class="qty-btn" onclick="window.cartManager.updateQuantity('${item.id}', 1)"><i class="fa-solid fa-plus"></i></button>
                </div>
                <div class="cart-item-price">
                  <strong>${(item.unitPrice * item.quantity).toFixed(2)} ر.س</strong>
                  ${item.quantity > 1 ? `<small>(${item.unitPrice.toFixed(2)} ر.س للوحدة)</small>` : ''}
                </div>
              </div>
            </div>
          </div>
        `;
        }).join('');
      }
    }

    // تحديث أرقام ملخص الفاتورة
    if (this.subtotalEl) this.subtotalEl.innerText = `${totals.subtotal.toFixed(2)} ر.س`;
    
    if (this.discountRow && this.discountEl) {
      if (totals.discountAmount > 0) {
        this.discountRow.style.display = 'flex';
        this.discountEl.innerText = `-${totals.discountAmount.toFixed(2)} ر.س (${this.appliedPromo.code})`;
      } else {
        this.discountRow.style.display = 'none';
      }
    }

    if (this.deliveryEl) {
      this.deliveryEl.innerText = totals.deliveryFee === 0 ? 'مجاني 🎉' : `${totals.deliveryFee.toFixed(2)} ر.س`;
    }

    if (this.vatEl) this.vatEl.innerText = `${totals.vatAmount.toFixed(2)} ر.س`;
    if (this.totalEl) this.totalEl.innerText = `${totals.grandTotal.toFixed(2)} ر.س`;

    // تعطيل/تفعيل زر الدفع
    if (this.checkoutBtn) {
      this.checkoutBtn.disabled = this.items.length === 0;
    }
  }

  openDrawer() {
    window.soundManager.playClick();
    if (this.cartDrawer && this.cartOverlay) {
      this.cartDrawer.classList.add('active');
      this.cartOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDrawer() {
    window.soundManager.playClick();
    if (this.cartDrawer && this.cartOverlay) {
      this.cartDrawer.classList.remove('active');
      this.cartOverlay.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }
}

window.cartManager = new CartManager();
