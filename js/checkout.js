// ==========================================================================
// دار البراوني الفاخر | ChocoCraft Lounge - نظام الدفع وإتمام الطلبات وتتبعها
// ==========================================================================

class CheckoutManager {
  constructor() {
    this.selectedPaymentMethod = 'mada';
    this.currentTrackingOrder = null;
    this.trackingInterval = null;

    this.initDOM();
  }

  initDOM() {
    this.checkoutModal = document.getElementById('checkoutModal');
    this.trackingModal = document.getElementById('trackingModal');
    this.checkoutForm = document.getElementById('checkoutForm');
  }

  // فتح نافذة الدفع
  openCheckout() {
    if (window.cartManager.items.length === 0) {
      window.app.showToast('سلتك فارغة! أضف بعض البراونيز أولاً 🍫', 'warning');
      return;
    }

    window.soundManager.playClick();
    window.cartManager.closeDrawer();

    const totals = window.cartManager.calculateTotals();

    // تحديث ملخص الدفع
    const summaryItems = document.getElementById('checkoutSummaryItems');
    if (summaryItems) {
      summaryItems.innerHTML = window.cartManager.items.map(item => `
        <div class="checkout-sum-row">
          <span>${item.name} (${item.boxSizeName}) × ${item.quantity}</span>
          <strong>${(item.unitPrice * item.quantity).toFixed(2)} ر.س</strong>
        </div>
      `).join('');
    }

    const payTotalEl = document.getElementById('checkoutPayTotal');
    if (payTotalEl) {
      payTotalEl.innerText = `${totals.grandTotal.toFixed(2)} ر.س`;
    }

    this.selectPaymentMethod(this.selectedPaymentMethod);

    if (this.checkoutModal) {
      this.checkoutModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCheckout() {
    window.soundManager.playClick();
    if (this.checkoutModal) {
      this.checkoutModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  // اختيار طريقة الدفع
  selectPaymentMethod(method) {
    this.selectedPaymentMethod = method;
    window.soundManager.playClick();

    // تحديث أزرار الطرق
    document.querySelectorAll('.pay-method-chip').forEach(chip => {
      if (chip.dataset.method === method) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    // إظهار وإخفاء الحقول حسب الطريقة
    const cardFields = document.getElementById('cardPaymentFields');
    const applePayBtn = document.getElementById('applePayContainer');
    const stcPayFields = document.getElementById('stcPayFields');
    const codMsg = document.getElementById('codMessage');

    if (cardFields) cardFields.style.display = (method === 'mada' || method === 'visa') ? 'block' : 'none';
    if (applePayBtn) applePayBtn.style.display = (method === 'applepay') ? 'block' : 'none';
    if (stcPayFields) stcPayFields.style.display = (method === 'stcpay') ? 'block' : 'none';
    if (codMsg) codMsg.style.display = (method === 'cod') ? 'block' : 'none';
  }

  // تنفيذ الدفع وإتمام الطلب
  async processPayment(e) {
    if (e) e.preventDefault();

    const name = document.getElementById('custName')?.value.trim();
    const phone = document.getElementById('custPhone')?.value.trim();
    const address = document.getElementById('custAddress')?.value.trim();
    const branch = document.getElementById('custBranch')?.value;
    const orderType = document.querySelector('input[name="orderType"]:checked')?.value || 'delivery';

    if (!name || !phone) {
      window.app.showToast('يرجى إدخال الاسم ورقم الجوال للتواصل 📱', 'error');
      return;
    }

    if (orderType === 'delivery' && !address) {
      window.app.showToast('يرجى كتابة عنوان التوصيل بالتفصيل 📍', 'error');
      return;
    }

    const payBtn = document.getElementById('submitPaymentBtn');
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> جاري معالجة الدفع بأمان...`;
    }

    // محاكاة الاتصال ببوابة الدفع
    await new Promise(res => setTimeout(res, 1400));

    const isGift = document.getElementById('isGiftCheckbox')?.checked || false;
    const giftRibbon = isGift ? (document.querySelector('input[name="giftRibbon"]:checked')?.value || 'ribbon-gold') : null;
    const giftRecipient = isGift ? document.getElementById('giftRecipientName')?.value.trim() : '';
    const giftMessage = isGift ? document.getElementById('giftCardMessage')?.value.trim() : '';

    const timingType = document.querySelector('input[name="timingType"]:checked')?.value || 'now';
    const scheduledDateTime = timingType === 'scheduled' 
      ? `${document.getElementById('schedDate')?.value} ${document.getElementById('schedTime')?.value}`
      : 'توصيل فوري (35-45 دقيقة)';

    const totals = window.cartManager.calculateTotals();
    const orderId = `BRW-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      customerName: name,
      phone: phone,
      address: orderType === 'delivery' ? address : `استلام من فرع: ${branch}`,
      orderType: orderType,
      timing: scheduledDateTime,
      isGift: isGift,
      giftRibbon: giftRibbon ? BROWNIE_DATA.giftingRibbons.find(r => r.id === giftRibbon)?.name : null,
      giftRecipient: giftRecipient,
      giftMessage: giftMessage,
      paymentMethod: this.getPaymentMethodLabel(this.selectedPaymentMethod),
      paymentStatus: this.selectedPaymentMethod === 'cod' ? 'عند الاستلام' : 'مدفوع إلكترونياً ✅',
      total: totals.grandTotal,
      subtotal: totals.subtotal,
      discount: totals.discountAmount,
      vat: totals.vatAmount,
      deliveryFee: totals.deliveryFee,
      appliedPromo: window.cartManager.appliedPromo?.code || null,
      timestamp: 'الآن',
      createdAt: new Date().toISOString(),
      status: 'received', // received -> baking -> decorating -> delivering -> completed
      items: JSON.parse(JSON.stringify(window.cartManager.items))
    };

    // إرسال الطلب إلى لوحة تحكم المالك
    if (window.adminDashboard) {
      window.adminDashboard.addIncomingOrder(newOrder);
    }

    // حفظ الطلب في الذاكرة لتتبعه
    this.saveOrderHistory(newOrder);

    // إفراغ السلة
    window.cartManager.items = [];
    window.cartManager.appliedPromo = null;
    window.cartManager.saveToStorage();
    window.cartManager.render();

    if (payBtn) {
      payBtn.disabled = false;
      payBtn.innerHTML = `<i class="fa-solid fa-shield-halved"></i> تأكيد الدفع وإتمام الطلب`;
    }

    this.closeCheckout();
    window.soundManager.playSuccess();
    window.app.showToast(`تم تأكيد طلبك بنجاح! رقم الطلب #${orderId} 🎉🍫`, 'success');

    // فتح شاشة التتبع والفاتورة
    this.openTracking(newOrder);
  }

  getPaymentMethodLabel(method) {
    switch (method) {
      case 'mada': return 'مدى (Mada)';
      case 'visa': return 'بطاقة ائتمانية (Visa / MC)';
      case 'applepay': return 'Apple Pay';
      case 'stcpay': return 'STC Pay';
      case 'cod': return 'الدفع عند الاستلام';
      default: return 'دفع إلكتروني';
    }
  }

  saveOrderHistory(order) {
    try {
      const history = JSON.parse(localStorage.getItem('choco_orders_history') || '[]');
      history.unshift(order);
      localStorage.setItem('choco_orders_history', JSON.stringify(history));
    } catch (e) {}
  }

  // ================= تتبع الطلب والفاتورة =================

  openTracking(order) {
    this.currentTrackingOrder = order;
    this.renderTrackingModal();

    if (this.trackingModal) {
      this.trackingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // بدء محاكي تقدم حالة الطلب تلقائياً
    this.startLiveSimulation();
  }

  closeTracking() {
    window.soundManager.playClick();
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
    if (this.trackingModal) {
      this.trackingModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  renderTrackingModal() {
    const order = this.currentTrackingOrder;
    if (!order) return;

    // 1. شارة ومراحل التتبع
    const statuses = [
      { id: 'received', title: 'تم استلام الطلب', icon: '📥', desc: 'تم تأكيد طلبك وإرساله للمطبخ بالرياض' },
      { id: 'baking', title: 'قيد الخبز في الفرن', icon: '👨‍🍳🔥', desc: 'يُخبز بحرارة 50°C وقوام فدجي رائع' },
      { id: 'decorating', title: 'إضافة الصلصات والتزيين', icon: '🍫✨', desc: 'صب الشوكولاتة البلجيكية والتوبينجز الفاخرة' },
      { id: 'delivering', title: 'في الطريق إليك', icon: '🛵💨', desc: 'المندوب في أحياء الرياض بحافظة حرارية دافئة' },
      { id: 'completed', title: 'تم التوصيل بنجاح', icon: '🎉🎁', desc: 'بالعافية عليك! نتمنى لك تجربة ممتعة مع Chunk & Cacao' }
    ];

    const currentIdx = statuses.findIndex(s => s.id === order.status);

    const stepsHtml = statuses.map((st, idx) => {
      let stateClass = 'pending';
      if (idx < currentIdx) stateClass = 'completed';
      if (idx === currentIdx) stateClass = 'active';

      return `
        <div class="tracker-step ${stateClass}">
          <div class="step-marker">
            <span class="step-icon">${st.icon}</span>
            <span class="step-num">${idx + 1}</span>
          </div>
          <div class="step-info">
            <h5>${st.title}</h5>
            <p>${st.desc}</p>
          </div>
        </div>
      `;
    }).join('');

    const trackerContainer = document.getElementById('liveOrderSteps');
    if (trackerContainer) {
      trackerContainer.innerHTML = stepsHtml;
    }

    // 2. تعبئة الفاتورة الرسمية
    const invoiceEl = document.getElementById('orderInvoiceDetails');
    if (invoiceEl) {
      invoiceEl.innerHTML = `
        <div class="invoice-box">
          <div class="invoice-header">
            <div>
              <h3>فاتورة Chunk & Cacao | تشانك & كاكاو</h3>
              <span class="invoice-num">رقم الطلب: <strong>${order.id}</strong></span>
              <span class="invoice-date">التاريخ: ${new Date().toLocaleDateString('ar-SA')} | الرياض</span>
            </div>
            <div class="invoice-qr">
              <div class="mock-qr">
                <i class="fa-solid fa-qrcode"></i>
                <small>فاتورة إلكترونية ضريبية</small>
              </div>
            </div>
          </div>

          <div class="invoice-customer-info">
            <div><strong>العميل:</strong> ${order.customerName} (${order.phone})</div>
            <div><strong>العنوان / الاستلام:</strong> ${order.address}</div>
            <div><strong>موعد التوصيل:</strong> ${order.timing || 'فوري'}</div>
            <div><strong>طريقة الدفع:</strong> ${order.paymentMethod} (${order.paymentStatus})</div>
          </div>

          ${order.isGift ? `
            <div class="invoice-gift-banner">
              <div class="gift-banner-header">
                <span>🎁 طلب إهداء فاخر</span>
                <span class="gift-ribbon-tag">${order.giftRibbon || 'شريط ذهبي'}</span>
              </div>
              ${order.giftRecipient ? `<p><strong>إلى:</strong> ${order.giftRecipient}</p>` : ''}
              ${order.giftMessage ? `<p class="gift-msg-quote">"${order.giftMessage}"</p>` : ''}
            </div>
          ` : ''}

          <table class="invoice-table">
            <thead>
              <tr>
                <th>الصنف وتفاصيل التخصيص</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>
                    <strong>${item.name}</strong> <small>(${item.boxSizeName || 'صنف فردي'})</small>
                    <div class="invoice-item-sub">
                      ${item.saucesNames?.length ? `<span>الصلصات: ${item.saucesNames.join(', ')}</span>` : ''}
                      ${item.toppingsNames?.length ? `<span>التوبينج: ${item.toppingsNames.join(', ')}</span>` : ''}
                      ${item.extrasNames?.length ? `<span>الإضافات: ${item.extrasNames.join(', ')}</span>` : ''}
                    </div>
                  </td>
                  <td>${item.quantity}</td>
                  <td>${(item.unitPrice || item.price || 0).toFixed(2)} ر.س</td>
                  <td><strong>${((item.unitPrice || item.price || 0) * item.quantity).toFixed(2)} ر.س</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="invoice-totals-breakdown">
            <div class="inv-row"><span>المجموع الفرعي:</span> <strong>${(order.subtotal || order.total).toFixed(2)} ر.س</strong></div>
            ${order.discount ? `<div class="inv-row discount"><span>الخصم:</span> <strong>-${order.discount.toFixed(2)} ر.س</strong></div>` : ''}
            <div class="inv-row"><span>رسوم التوصيل (الرياض):</span> <strong>${order.deliveryFee === 0 ? 'مجاني' : (order.deliveryFee?.toFixed(2) || '0.00') + ' ر.س'}</strong></div>
            <div class="inv-row"><span>ضريبة القيمة المضافة (15%):</span> <strong>${(order.vat || 0).toFixed(2)} ر.س</strong></div>
            <div class="inv-row grand-total"><span>الإجمالي النهائي المطلوب:</span> <strong>${order.total.toFixed(2)} ر.س</strong></div>
          </div>

          <!-- زر الواتساب والطباعة -->
          <div class="invoice-action-buttons">
            <button class="btn-whatsapp" onclick="window.checkoutManager.shareOnWhatsApp()">
              <i class="fa-brands fa-whatsapp"></i> تأكيد ومتابعة الطلب عبر WhatsApp
            </button>
            <button class="btn-secondary" onclick="window.checkoutManager.printInvoice()">
              <i class="fa-solid fa-print"></i> طباعة الفاتورة
            </button>
          </div>
        </div>
      `;
    }
  }

  // مشاركة وتأكيد الطلب عبر WhatsApp
  shareOnWhatsApp() {
    const order = this.currentTrackingOrder;
    if (!order) return;

    let itemsText = order.items.map(it => `• ${it.name} (${it.quantity}x) - ${(it.unitPrice * it.quantity).toFixed(2)} ر.س`).join('%0A');
    
    let text = `*طلب جديد من Chunk %26 Cacao 🍫✨*%0A%0A` +
      `*رقم الطلب:* ${order.id}%0A` +
      `*اسم العميل:* ${order.customerName}%0A` +
      `*رقم الجوال:* ${order.phone}%0A` +
      `*العنوان:* ${order.address}%0A` +
      `*موعد التوصيل:* ${order.timing}%0A%0A` +
      `*الأصناف:*%0A${itemsText}%0A%0A` +
      `*طريقة الدفع:* ${order.paymentMethod}%0A` +
      `*المبلغ الإجمالي:* ${order.total.toFixed(2)} ر.س%0A%0A` +
      (order.isGift ? `🎁 *طلب إهداء:* ${order.giftMessage || 'بدون نص'}%0A%0A` : '') +
      `شكراً لكم!`;

    const url = `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
  }

  // محاكي تقدّم حالة الطلب التلقائي
  startLiveSimulation() {
    if (this.trackingInterval) clearInterval(this.trackingInterval);

    const stages = ['received', 'baking', 'decorating', 'delivering', 'completed'];

    this.trackingInterval = setInterval(() => {
      if (!this.currentTrackingOrder) return;
      const curIdx = stages.indexOf(this.currentTrackingOrder.status);
      if (curIdx < stages.length - 1) {
        this.currentTrackingOrder.status = stages[curIdx + 1];
        this.renderTrackingModal();

        // تحديث في لوحة الإدارة أيضاً
        if (window.adminDashboard) {
          window.adminDashboard.updateOrderStatus(this.currentTrackingOrder.id, this.currentTrackingOrder.status, false);
        }
      } else {
        clearInterval(this.trackingInterval);
      }
    }, 7000); // ينتقل لمرحلة جديدة كل 7 ثوانٍ لمحاكاة ممتعة وحية
  }

  // طباعة الفاتورة
  printInvoice() {
    window.print();
  }
}

window.checkoutManager = new CheckoutManager();
