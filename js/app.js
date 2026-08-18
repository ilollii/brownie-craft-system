// ==========================================================================
// دار البراوني الفاخر | ChocoCraft Lounge - التطبيق الرئيسي وتهيئة الواجهات
// ==========================================================================

class App {
  constructor() {
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.renderMenuGrid();
      this.renderDipsGrid();
      this.renderReviews();
      this.setupEventListeners();
      this.registerServiceWorker();
      this.setupPWAInstallPrompt();
      this.setupMobileNav();
      window.cartManager.render();
    });
  }

  // تسجيل مشغل PWA Service Worker
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => console.log('Chunk & Cacao PWA Service Worker Registered ✅', reg))
          .catch((err) => console.log('SW Registration Failed ❌', err));
      });
    }
  }

  // إعداد وتفعيل نافذة تثبيت التطبيق على الجوال
  setupPWAInstallPrompt() {
    let deferredPrompt = null;
    const banner = document.getElementById('pwaInstallBanner');
    const installBtn = document.getElementById('pwaInstallBtn');
    const closeBtn = document.getElementById('pwaCloseBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (banner) banner.style.display = 'block';
    });

    if (installBtn) {
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            this.showToast('تم تثبيت تطبيق Chunk & Cacao بنجاح! 📱🍫', 'success');
          }
          deferredPrompt = null;
          if (banner) banner.style.display = 'none';
        }
      });
    }

    if (closeBtn && banner) {
      closeBtn.addEventListener('click', () => {
        banner.style.display = 'none';
      });
    }
  }

  // شريط التنقل السفلي في تطبيق الجوال
  setupMobileNav() {
    const navItems = document.querySelectorAll('.mobile-nav-item[href]');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');
      });
    });
  }

  // بناء شبكة عرض البراونيز في المتجر
  renderMenuGrid() {
    const grid = document.getElementById('brownieMenuGrid');
    if (!grid) return;

    let bases = BROWNIE_DATA.bases;
    if (this.currentFilter !== 'all') {
      if (this.currentFilter === 'dark') {
        bases = bases.filter(b => b.id.includes('dark'));
      } else if (this.currentFilter === 'gourmet') {
        bases = bases.filter(b => b.id.includes('caramel'));
      } else if (this.currentFilter === 'fudge') {
        bases = bases.filter(b => b.id.includes('fudge'));
      }
    }

    grid.innerHTML = bases.map(base => `
      <div class="menu-card" data-id="${base.id}">
        <div class="menu-card-image-wrap">
          <img src="${base.image}" alt="${base.name}" loading="lazy" />
          <span class="card-badge">${base.badge}</span>
          <div class="card-overlay-actions">
            <button class="btn-customize-quick" onclick="window.customizer.open('${base.id}')">
              <i class="fa-solid fa-wand-magic-sparkles"></i> تخصيص الصوصات والإضافات
            </button>
          </div>
        </div>

        <div class="menu-card-body">
          <div class="card-title-row">
            <h3 class="card-title">${base.name}</h3>
            <span class="card-price">${base.price} ر.س</span>
          </div>
          <span class="card-title-en">${base.nameEn}</span>
          <p class="card-desc">${base.description}</p>

          <div class="card-footer">
            <span class="card-cal"><i class="fa-solid fa-fire-flame-curved"></i> ${base.calories} سعرة</span>
            <div class="card-btn-group">
              <button class="btn-custom-trigger" onclick="window.customizer.open('${base.id}')">
                <i class="fa-solid fa-sliders"></i> تخصيص
              </button>
              <button class="btn-quick-add" title="إضافة سريعة بالسعر الأساسي" onclick="window.cartManager.quickAddBase('${base.id}')">
                <i class="fa-solid fa-cart-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // فلترة قائمة المتجر
  setFilter(filterName) {
    this.currentFilter = filterName;
    window.soundManager.playClick();

    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.filter === filterName);
    });

    this.renderMenuGrid();
  }

  // بناء قسم عبوات صوصات التغميس الدافئة
  renderDipsGrid() {
    const grid = document.getElementById('dipsMenuGrid');
    if (!grid || !BROWNIE_DATA.dipJars) return;

    grid.innerHTML = BROWNIE_DATA.dipJars.map(dip => `
      <div class="dip-card" onclick="window.cartManager.addDipJar('${dip.id}')">
        <span class="dip-icon">${dip.icon}</span>
        <div class="dip-info">
          <strong>${dip.name}</strong>
          <small>${dip.size} - عبوة دافئة</small>
        </div>
        <div class="dip-price-btn">
          <span>+${dip.price} ر.س</span>
          <i class="fa-solid fa-circle-plus"></i>
        </div>
      </div>
    `).join('');
  }

  // بناء قسم تقييمات العملاء
  renderReviews() {
    const container = document.getElementById('customerReviewsGrid');
    if (!container || !BROWNIE_DATA.customerReviews) return;

    container.innerHTML = BROWNIE_DATA.customerReviews.map(rev => `
      <div class="review-card">
        <div class="review-header">
          <div class="rev-user">
            <span class="rev-avatar">${rev.avatar}</span>
            <div>
              <strong>${rev.name}</strong>
              <small>${rev.district}</small>
            </div>
          </div>
          <div class="rev-stars">
            ${'★'.repeat(rev.rating)}
          </div>
        </div>
        <p class="rev-comment">"${rev.comment}"</p>
        <span class="rev-time"><i class="fa-solid fa-clock"></i> ${rev.time}</span>
      </div>
    `).join('');
  }

  // إعداد مستمعي الأحداث
  setupEventListeners() {
    // تبديل الصوت
    const soundToggle = document.getElementById('soundToggleBtn');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        const enabled = window.soundManager.toggleSound();
        soundToggle.innerHTML = enabled 
          ? `<i class="fa-solid fa-volume-high"></i>`
          : `<i class="fa-solid fa-volume-xmark"></i>`;
        this.showToast(enabled ? 'تم تفعيل المؤثرات الصوتية 🔊' : 'تم كتم الصوت 🔇', 'info');
      });
    }

    // زر خلطة الشيف السري (أبهرني)
    const mysteryBtnHero = document.getElementById('heroMysteryBtn');
    if (mysteryBtnHero) {
      mysteryBtnHero.addEventListener('click', () => {
        window.customizer.open('base-salted-caramel');
        setTimeout(() => window.customizer.triggerMysteryMix(), 200);
      });
    }

    const customizerMysteryBtn = document.getElementById('customizerMysteryBtn');
    if (customizerMysteryBtn) {
      customizerMysteryBtn.addEventListener('click', () => {
        window.customizer.triggerMysteryMix();
      });
    }

    // تفعيل خيارات الإهداء
    const isGiftCheckbox = document.getElementById('isGiftCheckbox');
    if (isGiftCheckbox) {
      isGiftCheckbox.addEventListener('change', (e) => {
        const giftFields = document.getElementById('giftingOptionsFields');
        if (giftFields) giftFields.style.display = e.target.checked ? 'block' : 'none';
      });
    }

    // تفعيل خيارات التوقيت والجدولة
    document.querySelectorAll('input[name="timingType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const schedBlock = document.getElementById('scheduledPickerBlock');
        if (schedBlock) schedBlock.style.display = e.target.value === 'scheduled' ? 'grid' : 'none';
      });
    });

    // زر السلة
    const cartToggle = document.getElementById('cartToggleBtn');
    if (cartToggle) {
      cartToggle.addEventListener('click', () => window.cartManager.openDrawer());
    }

    const cartClose = document.getElementById('cartCloseBtn');
    if (cartClose) {
      cartClose.addEventListener('click', () => window.cartManager.closeDrawer());
    }

    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => window.cartManager.closeDrawer());
    }

    // زر إفراغ السلة
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
      clearCartBtn.addEventListener('click', () => window.cartManager.clearCart());
    }

    // زر تطبيق الكوبون
    const applyPromoBtn = document.getElementById('applyPromoBtn');
    if (applyPromoBtn) {
      applyPromoBtn.addEventListener('click', () => {
        const input = document.getElementById('cartPromoInput');
        if (input) window.cartManager.applyPromo(input.value);
      });
    }

    // زر إتمام الطلب من السلة
    const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
    if (cartCheckoutBtn) {
      cartCheckoutBtn.addEventListener('click', () => window.checkoutManager.openCheckout());
    }

    // زر لوحة تحكم مالك المشروع (يظهر فقط إذا كان الرابط يحتوي على ?admin أو ?owner أو #admin)
    const urlParams = new URLSearchParams(window.location.search);
    const isOwnerMode = urlParams.has('admin') || urlParams.has('owner') || window.location.hash === '#admin';
    const adminToggleBtn = document.getElementById('adminToggleBtn');
    
    if (adminToggleBtn && isOwnerMode) {
      adminToggleBtn.style.display = 'inline-flex';
      adminToggleBtn.addEventListener('click', () => window.adminDashboard.open());
    }

    // زر إغلاق نافذة التخصيص
    const customizerCloseBtn = document.getElementById('customizerCloseBtn');
    if (customizerCloseBtn) {
      customizerCloseBtn.addEventListener('click', () => window.customizer.close());
    }

    // حفظ التخصيص
    const customizerSubmitBtn = document.getElementById('customizerSubmitBtn');
    if (customizerSubmitBtn) {
      customizerSubmitBtn.addEventListener('click', () => window.customizer.submitCustomization());
    }

    // أزرار الدفع
    const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
    if (checkoutCloseBtn) {
      checkoutCloseBtn.addEventListener('click', () => window.checkoutManager.closeCheckout());
    }

    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => window.checkoutManager.processPayment(e));
    }

    // تبديل طريقة التوصيل (استلام أو توصيل)
    document.querySelectorAll('input[name="orderType"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const isDelivery = e.target.value === 'delivery';
        const addressBlock = document.getElementById('deliveryAddressBlock');
        const branchBlock = document.getElementById('storePickupBlock');
        if (addressBlock) addressBlock.style.display = isDelivery ? 'block' : 'none';
        if (branchBlock) branchBlock.style.display = isDelivery ? 'none' : 'block';
      });
    });

    // تنسيق حقل رقم البطاقة الائتمانية تلقائياً
    const cardInput = document.getElementById('cardNumInput');
    if (cardInput) {
      cardInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = val;
      });
    }

    const cardExpInput = document.getElementById('cardExpInput');
    if (cardExpInput) {
      cardExpInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '').substring(0, 4);
        if (val.length >= 2) {
          val = val.substring(0, 2) + '/' + val.substring(2);
        }
        e.target.value = val;
      });
    }

    // تتبع الطلب
    const trackingCloseBtn = document.getElementById('trackingCloseBtn');
    if (trackingCloseBtn) {
      trackingCloseBtn.addEventListener('click', () => window.checkoutManager.closeTracking());
    }

    const printInvoiceBtn = document.getElementById('printInvoiceBtn');
    if (printInvoiceBtn) {
      printInvoiceBtn.addEventListener('click', () => window.checkoutManager.printInvoice());
    }
  }

  // عرض إشعارات Toast عصرية وأنيقة
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'warning') icon = 'fa-triangle-exclamation';
    if (type === 'error') icon = 'fa-circle-xmark';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
}

window.app = new App();
