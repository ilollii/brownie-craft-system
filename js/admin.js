// ==========================================================================
// دار البراوني الفاخر | ChocoCraft Lounge - لوحة تحكم مالك المشروع والمطبخ
// ==========================================================================

class AdminDashboard {
  constructor() {
    this.orders = [];
    this.activeTab = 'orders';
    this.loadOrders();
    this.initDOM();
  }

  initDOM() {
    this.adminModal = document.getElementById('adminModal');
  }

  loadOrders() {
    try {
      const stored = localStorage.getItem('choco_admin_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        // التحقق مما إذا كانت الطلبات المحفوظة تحتوي على بيانات أو مدن أو أصناف قديمة تم إلغاؤها
        const hasOutdatedData = parsed.some(order => {
          const str = JSON.stringify(order);
          return str.includes('جدة') || str.includes('الخبر') || str.includes('كندر') || str.includes('فستق') ||
            order.items?.some(it => isNaN(parseFloat(it.unitPrice || it.price)));
        });

        if (hasOutdatedData) {
          this.orders = JSON.parse(JSON.stringify(BROWNIE_DATA.initialOrders));
          this.saveOrders();
        } else {
          this.orders = parsed;
        }
      } else {
        this.orders = JSON.parse(JSON.stringify(BROWNIE_DATA.initialOrders));
        this.saveOrders();
      }
    } catch (e) {
      this.orders = JSON.parse(JSON.stringify(BROWNIE_DATA.initialOrders));
    }
  }

  resetOrders() {
    this.orders = JSON.parse(JSON.stringify(BROWNIE_DATA.initialOrders));
    this.saveOrders();
    this.renderKPIs();
    this.renderOrders();
    window.app.showToast('تمت إعادة ضبط الطلبات وتحديثها بنجاح 🔄', 'info');
  }

  saveOrders() {
    try {
      localStorage.setItem('choco_admin_orders', JSON.stringify(this.orders));
    } catch (e) {}
  }

  // إضافة طلب جديد قادم من المتجر
  addIncomingOrder(newOrder) {
    this.orders.unshift(newOrder);
    this.saveOrders();
    this.renderKPIs();
    this.renderOrders();
  }

  // تحديث حالة الطلب من قبل المالك أو المطبخ
  updateOrderStatus(orderId, newStatus, notify = true) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      this.saveOrders();
      this.renderKPIs();
      this.renderOrders();

      if (notify) {
        window.soundManager.playClick();
        window.app.showToast(`تم تحديث حالة الطلب #${orderId} إلى "${this.getStatusLabel(newStatus)}"`, 'info');
      }
    }
  }

  getStatusLabel(status) {
    switch (status) {
      case 'received': return 'تم الاستلام 📥';
      case 'baking': return 'قيد الخبز 👨‍🍳🔥';
      case 'decorating': return 'التزيين والصلصات 🍫✨';
      case 'delivering': return 'مع السائق 🛵';
      case 'completed': return 'مكتمل ✅';
      default: return status;
    }
  }

  open() {
    window.soundManager.playClick();
    this.renderKPIs();
    this.renderOrders();
    this.renderMenuManager();

    if (this.adminModal) {
      this.adminModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  close() {
    window.soundManager.playClick();
    if (this.adminModal) {
      this.adminModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  }

  switchTab(tabName) {
    this.activeTab = tabName;
    window.soundManager.playClick();

    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    const ordersSec = document.getElementById('adminOrdersTab');
    const menuSec = document.getElementById('adminMenuTab');
    const kpiSec = document.getElementById('adminKpiTab');

    if (ordersSec) ordersSec.style.display = tabName === 'orders' ? 'block' : 'none';
    if (menuSec) menuSec.style.display = tabName === 'menu' ? 'block' : 'none';
    if (kpiSec) kpiSec.style.display = tabName === 'kpi' ? 'block' : 'none';
  }

  // حساب وعرض مؤشرات الأداء الحية (KPIs)
  renderKPIs() {
    const totalSales = this.orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
    const activeOrders = this.orders.filter(o => o.status !== 'completed').length;
    const completedOrders = this.orders.filter(o => o.status === 'completed').length;
    const avgOrderVal = this.orders.length > 0 ? totalSales / this.orders.length : 0;

    const kpiSalesEl = document.getElementById('kpiTotalSales');
    const kpiActiveEl = document.getElementById('kpiActiveOrders');
    const kpiCompletedEl = document.getElementById('kpiCompletedOrders');
    const kpiAvgEl = document.getElementById('kpiAvgOrder');

    if (kpiSalesEl) kpiSalesEl.innerText = `${totalSales.toFixed(2)} ر.س`;
    if (kpiActiveEl) kpiActiveEl.innerText = activeOrders;
    if (kpiCompletedEl) kpiCompletedEl.innerText = completedOrders;
    if (kpiAvgEl) kpiAvgEl.innerText = `${avgOrderVal.toFixed(2)} ر.س`;
  }

  // بناء جدول وقائمة الطلبات الحية
  renderOrders() {
    const container = document.getElementById('adminOrdersList');
    if (!container) return;

    if (this.orders.length === 0) {
      container.innerHTML = `<div class="empty-state">لا توجد طلبات مسجلة حتى الآن</div>`;
      return;
    }

    container.innerHTML = this.orders.map(order => `
      <div class="admin-order-card status-${order.status}">
        <div class="a-card-header">
          <div class="a-order-id">
            <strong>${order.id}</strong>
            <span class="a-time">${order.timestamp || 'اليوم'}</span>
          </div>
          <span class="a-status-badge ${order.status}">${this.getStatusLabel(order.status)}</span>
        </div>

        <div class="a-customer-info">
          <div><i class="fa-solid fa-user"></i> ${order.customerName} (${order.phone})</div>
          <div><i class="fa-solid fa-location-dot"></i> ${order.address}</div>
          <div><i class="fa-solid fa-credit-card"></i> ${order.paymentMethod} - <span class="badge-pay">${order.paymentStatus}</span></div>
        </div>

        <div class="a-order-items">
          ${order.items.map(it => {
            const qty = parseInt(it.quantity) || 1;
            const unitP = parseFloat(it.unitPrice || it.price || 0);
            const lineTotal = unitP * qty;
            const boxName = it.boxSizeName || it.size || 'قطعة فردية';

            return `
              <div class="a-item-line">
                <span class="a-qty">${qty}x</span>
                <div class="a-it-desc">
                  <strong>${it.name}</strong> <small>(${boxName})</small>
                  ${it.saucesNames?.length ? `<div class="a-sub"><small>صلصات:</small> ${it.saucesNames.join(', ')}</div>` : ''}
                  ${it.toppingsNames?.length ? `<div class="a-sub"><small>توبينج:</small> ${it.toppingsNames.join(', ')}</div>` : ''}
                  ${it.extrasNames?.length ? `<div class="a-sub"><small>مميزات:</small> ${it.extrasNames.join(', ')}</div>` : ''}
                </div>
                <span class="a-price">${lineTotal.toFixed(2)} ر.س</span>
              </div>
            `;
          }).join('')}
        </div>

        <div class="a-card-footer">
          <div class="a-total">
            <span>الإجمالي:</span>
            <strong>${(parseFloat(order.total) || 0).toFixed(2)} ر.س</strong>
          </div>

          <div class="a-status-actions">
            ${order.status === 'received' ? `
              <button class="btn-action start-bake" onclick="window.adminDashboard.updateOrderStatus('${order.id}', 'baking')">
                <i class="fa-solid fa-fire"></i> بدء الخبز
              </button>
            ` : ''}
            ${order.status === 'baking' ? `
              <button class="btn-action start-deco" onclick="window.adminDashboard.updateOrderStatus('${order.id}', 'decorating')">
                <i class="fa-solid fa-wand-magic-sparkles"></i> تزيين وصلصات
              </button>
            ` : ''}
            ${order.status === 'decorating' ? `
              <button class="btn-action send-deliver" onclick="window.adminDashboard.updateOrderStatus('${order.id}', 'delivering')">
                <i class="fa-solid fa-motorcycle"></i> تسليم للمندوب
              </button>
            ` : ''}
            ${order.status === 'delivering' ? `
              <button class="btn-action complete-order" onclick="window.adminDashboard.updateOrderStatus('${order.id}', 'completed')">
                <i class="fa-solid fa-check"></i> تأكيد التسليم
              </button>
            ` : ''}
            ${order.status === 'completed' ? `
              <span class="badge-done"><i class="fa-solid fa-circle-check"></i> تم تسليم الطلب بنجاح</span>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');
  }

  // إدارة المنتجات وتعديل الأسعار
  renderMenuManager() {
    const menuList = document.getElementById('adminMenuList');
    if (!menuList) return;

    menuList.innerHTML = BROWNIE_DATA.bases.map(b => `
      <div class="menu-item-row">
        <div class="menu-item-info">
          <img src="${b.image}" alt="${b.name}" class="menu-thumb" />
          <div>
            <strong>${b.name}</strong>
            <p>${b.description}</p>
          </div>
        </div>
        <div class="menu-item-actions">
          <div class="price-edit-box">
            <span>السعر (ر.س):</span>
            <input type="number" value="${b.price}" onchange="window.adminDashboard.updateBasePrice('${b.id}', this.value)" />
          </div>
          <span class="in-stock-badge">متوفر بالمخزون ✅</span>
        </div>
      </div>
    `).join('');
  }

  updateBasePrice(baseId, newPrice) {
    const base = BROWNIE_DATA.bases.find(b => b.id === baseId);
    if (base) {
      base.price = parseFloat(newPrice) || base.price;
      window.app.showToast(`تم تحديث سعر ${base.name} إلى ${base.price} ر.س`, 'success');
      window.app.renderMenuGrid();
    }
  }
}

window.adminDashboard = new AdminDashboard();
