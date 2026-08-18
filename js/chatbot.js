// ==========================================================================
// Chunk & Cacao | تشانك & كاكاو - المساعد الذكي التفاعلي (Cacao AI Chatbot)
// ==========================================================================

class CacaoChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.initDOM();
  }

  initDOM() {
    this.widgetBtn = document.getElementById('chatWidgetBtn');
    this.chatWindow = document.getElementById('chatWindow');
    this.chatCloseBtn = document.getElementById('chatCloseBtn');
    this.chatMessagesContainer = document.getElementById('chatMessagesContainer');
    this.chatInput = document.getElementById('chatInput');
    this.chatSendBtn = document.getElementById('chatSendBtn');
    this.quickPillsContainer = document.getElementById('chatQuickPills');

    this.setupEventListeners();
    this.initWelcomeMessage();
  }

  setupEventListeners() {
    if (this.widgetBtn) {
      this.widgetBtn.addEventListener('click', () => this.toggle());
    }

    if (this.chatCloseBtn) {
      this.chatCloseBtn.addEventListener('click', () => this.close());
    }

    if (this.chatSendBtn && this.chatInput) {
      this.chatSendBtn.addEventListener('click', () => this.handleUserSend());
      this.chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleUserSend();
        }
      });
    }
  }

  initWelcomeMessage() {
    this.addBotMessage(
      `هلا والله! 🍫 يسعدني خدمتك في **Chunk & Cacao**. أنا **مساعد كاكاو الذكي**، موجود لمساعدتك في اختيار أشهى براوني، اقتراح التوليفات، أو متابعة طلبك في الرياض ✨\n\nكيف أقدر أساعدك اليوم؟`,
      [
        { text: '⭐ وش الأكثر مبيعاً؟', action: 'best_sellers' },
        { text: '🎁 أبي بوكس للجمعات والدوام', action: 'party_box' },
        { text: '✨ صمم لي براوني على ذوقك', action: 'custom_suggest' },
        { text: '📍 فروعكم والتوصيل بالرياض', action: 'delivery_info' },
        { text: '🎟️ عندكم كود خصم؟', action: 'promo_codes' }
      ]
    );
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    window.soundManager.playClick();
    if (this.chatWindow) {
      this.chatWindow.classList.add('active');
      if (this.chatInput) this.chatInput.focus();
    }
    const badge = document.getElementById('chatUnreadBadge');
    if (badge) badge.style.display = 'none';
  }

  close() {
    this.isOpen = false;
    window.soundManager.playClick();
    if (this.chatWindow) {
      this.chatWindow.classList.remove('active');
    }
  }

  handleUserSend() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    this.addUserMessage(text);
    this.chatInput.value = '';

    // معالجة الرد الذكي
    this.showTypingIndicator();
    setTimeout(() => {
      this.hideTypingIndicator();
      this.processQuery(text);
    }, 700 + Math.random() * 400);
  }

  triggerAction(actionKey) {
    window.soundManager.playClick();
    switch (actionKey) {
      case 'best_sellers':
        this.addUserMessage('وش أكثر نوع يطلبه الناس عندكم؟ ⭐');
        this.showTypingIndicator();
        setTimeout(() => {
          this.hideTypingIndicator();
          this.addBotMessage(
            `الأكثر طلباً ومبيعاً عندنا بلا منازع هو **كلاسيك فدج بلجيكي (24 ر.س)** 🍫! قوام فدجي غني ومذاب من الداخل.\n\nويليه مباشرة **كراميل مملح وبيكان محمص (28 ر.س)** لعشاق التوازن المالح والحالي 👑`,
            [
              { text: '🛒 أضف كلاسيك فدج للسلة', action: 'add_classic_fudge' },
              { text: '✨ تخصيص كلاسيك فدج', action: 'open_customizer_fudge' }
            ]
          );
        }, 600);
        break;

      case 'party_box':
        this.addUserMessage('أبي بوكس مميز لجمعاتنا أو للدوام 🎁');
        this.showTypingIndicator();
        setTimeout(() => {
          this.hideTypingIndicator();
          this.addBotMessage(
            `أفضل خيار يبيّض الوجه هو **بوكس الجمعات الفاخر (9 قطع)** وفيه **خصم 20%** 🔥!\n\nأو **بوكس السعادة (4 قطع)** مع **خصم 10%**.\n\nتقدر تختار تغليف الإهداء الفاخر وتختار لون الشريط الحريري (ذهبي 🎗️، أسود 🖤، برغندي 🍷) مع كرت إهداء مطبوع 🎁✨`,
            [
              { text: '🎨 افتح مختبر تخصيص البوكس', action: 'open_customizer_box' },
              { text: '🛒 أضف بوكس 4 قطع جاهز', action: 'quick_box4' }
            ]
          );
        }, 600);
        break;

      case 'custom_suggest':
        this.addUserMessage('اقترح لي توليفة براوني فخمة على ذوقك ✨');
        this.showTypingIndicator();
        setTimeout(() => {
          this.hideTypingIndicator();
          this.addBotMessage(
            `أرشح لك خلطة الشيف السرية:\n\n🍫 **القاعدة:** كراميل مملح وبيكان\n🍯 **الصلصة:** كراميل فرنسي دافئ + شوكولاتة بلجيكية\n🍨 **الإضافة:** سكوب جيلاتو فانيلا مدغشقر البارد + رشة ملح مالدون البحري 🧂✨\n\nتبي أجربها لك مباشرة في مختبر التخصيص؟`,
            [
              { text: '🎲 طبق الخلطة وافتح لي التخصيص', action: 'apply_mystery_mix' }
            ]
          );
        }, 600);
        break;

      case 'delivery_info':
        this.addUserMessage('وين فروعكم وتوصيلكم داخل الرياض؟ 📍');
        this.showTypingIndicator();
        setTimeout(() => {
          this.hideTypingIndicator();
          this.addBotMessage(
            `🛵 **التوصيل الفوري بالرياض:** نغطي جميع أحياء مدينة الرياض (النرجس، حطين، الملقا، الياسمين، العليا، وغيرها) خلال 35-45 دقيقة بحافظات حرارية دافئة 50°C.\n\n📍 **فروع الاستلام:** فروعنا متاحة في النرجس، الملقا، والتحلية.\n\n🎉 **التوصيل مجاني** للطلبات فوق 120 ر.س!`
          );
        }, 600);
        break;

      case 'promo_codes':
        this.addUserMessage('عندكم كود خصم أقدر استخدمه؟ 🎟️');
        this.showTypingIndicator();
        setTimeout(() => {
          this.hideTypingIndicator();
          this.addBotMessage(
            `أكيد وتستاهل 🍫👏 تفضل هذه الأكواد الفعالة:\n\n• **BROWNIE10** 👈 خصم 10% على كل طلبات المتجر.\n• **CHOCO20** 👈 خصم 20% لطلبات البوكسات فوق 60 ر.س.\n• **SWEETVIP** 👈 خصم 25% VIP للطلبات الكبيرة فوق 100 ر.س.\n\nتقدر تكتب الكود مباشرة في السلة ويخصم لك فوراً!`
          );
        }, 600);
        break;

      case 'add_classic_fudge':
        window.cartManager.quickAddBase('base-fudge');
        this.addBotMessage(`تمت إضافة **كلاسيك فدج بلجيكي** إلى سلتك بنجاح! 🍫🎉 تبي نتمم الطلب أو تختار أصناف ثانية؟`, [
          { text: '🛍️ افتح السلة لإتمام الطلب', action: 'open_cart' }
        ]);
        break;

      case 'open_customizer_fudge':
        this.close();
        window.customizer.open('base-fudge');
        break;

      case 'open_customizer_box':
        this.close();
        window.customizer.open('base-salted-caramel');
        window.customizer.state.boxSize = 'box-pack9';
        window.customizer.renderTabsAndOptions();
        window.customizer.updatePrice();
        break;

      case 'quick_box4':
        this.close();
        window.customizer.open('base-fudge');
        window.customizer.state.boxSize = 'box-pack4';
        window.customizer.submitCustomization();
        break;

      case 'apply_mystery_mix':
        this.close();
        window.customizer.open('base-salted-caramel');
        window.customizer.triggerMysteryMix();
        break;

      case 'open_cart':
        this.close();
        window.cartManager.openDrawer();
        break;

      default:
        break;
    }
  }

  processQuery(input) {
    const q = input.toLowerCase();

    if (q.includes('خصم') || q.includes('كود') || q.includes('كوبون') || q.includes('promo') || q.includes('تخفيض')) {
      this.addBotMessage(
        `تفضل أقوى كود خصم فعال الآن:\n\n🎟️ كود: **BROWNIE10** (خصم 10%)\n🎟️ كود: **CHOCO20** (خصم 20% للبوكسات)\n\nانسخ الكود وطبقه عند فتح السلة!`,
        [{ text: '🛍️ افتح السلة وطبق الكود', action: 'open_cart' }]
      );
    } else if (q.includes('توصيل') || q.includes('الرياض') || q.includes('موقع') || q.includes('فرع') || q.includes('وقت') || q.includes('ساعة')) {
      this.addBotMessage(
        `🚗 **التوصيل بالرياض:** نغطي كافة أحياء الرياض بالتوصيل الساخن الفوري (35-45 دقيقة)، أو تقدر تختار جدولة مسبقة لموعد جمعتكم.\n\n✨ التوصيل مجاني إذا طلبك فوق 120 ر.س.`
      );
    } else if (q.includes('أنواع') || q.includes('منيو') || q.includes('اصناف') || q.includes('نكهات') || q.includes('قائمة')) {
      this.addBotMessage(
        `قائمتنا الحصرية تحتوي على 3 قواعد شوكولاتة بلجيكية فاخرة:\n\n1️⃣ **كلاسيك فدج بلجيكي (24 ر.س)** 🍫\n2️⃣ **تريبل دارك 70% (26 ر.س)** 🌑\n3️⃣ **كراميل مملح وبيكان (28 ر.س)** 🍯🥜\n\nوكل قاعدة تقدر تضيف عليها صوصات ساخنة وتوبينجز وجيلاتو!`,
        [
          { text: '✨ صمم براوني الآن', action: 'open_customizer_fudge' },
          { text: '⭐ الأكثر مبيعاً', action: 'best_sellers' }
        ]
      );
    } else if (q.includes('بوكس') || q.includes('جمعات') || q.includes('دوام') || q.includes('حفلة') || q.includes('اهداء') || q.includes('هدية')) {
      this.addBotMessage(
        `عندنا خيارات بوكسات فاخرة مخصصة للمناسبات:\n\n🎁 **بوكس السعادة (4 قطع):** خصم 10%\n👑 **بوكس الجمعات (9 قطع):** خصم 20%\n\nمع إمكانية اختيار أشرطة الإهداء الحريرية وبطاقة إهداء خاصة 🎗️`,
        [{ text: '🎁 صمم بوكس الجمعات', action: 'open_customizer_box' }]
      );
    } else if (q.includes('حار') || q.includes('ساخن') || q.includes('حرارة') || q.includes('فرن') || q.includes('دافئ')) {
      this.addBotMessage(
        `نعم بكل تأكيد! ♨️ جميع طلبات البراوني تُخبز وتُسلم ساخنة بحرارة 50°C في حافظات حرارية محكمة لتصلك الشوكولاتة ذائبة ومترفة!`
      );
    } else if (q.includes('سلة') || q.includes('طلبي') || q.includes('شراء') || q.includes('دفع') || q.includes('حساب')) {
      this.addBotMessage(
        `تقدر تفتح السلة وتكمل طلبك بسهولة من هنا:`,
        [{ text: '🛍️ الانتقال للسلة والدفع', action: 'open_cart' }]
      );
    } else {
      this.addBotMessage(
        `أنا هنا لمساعدتك! يسعدني إرشادك لأفضل تشكيلة براوني بلجيكي أو اقتراح صوصات وتوبينجز لذيذة على ذوقك 🍫✨`,
        [
          { text: '⭐ وش أفضل نوع عندكم؟', action: 'best_sellers' },
          { text: '🎁 أبي بوكس للجمعات', action: 'party_box' },
          { text: '✨ اقترح لي توليفة', action: 'custom_suggest' },
          { text: '🎟️ كود خصم', action: 'promo_codes' }
        ]
      );
    }
  }

  addUserMessage(text) {
    this.messages.push({ sender: 'user', text });
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-bubble user-bubble';
    msgEl.innerHTML = `<div class="bubble-text">${this.escapeHtml(text)}</div>`;
    this.chatMessagesContainer.appendChild(msgEl);
    this.scrollToBottom();
  }

  addBotMessage(markdownText, actionButtons = []) {
    this.messages.push({ sender: 'bot', text: markdownText, actionButtons });
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-bubble bot-bubble';

    let html = this.formatMarkdown(markdownText);

    if (actionButtons && actionButtons.length > 0) {
      html += `
        <div class="bot-actions-row">
          ${actionButtons.map(b => `
            <button class="chat-action-chip" onclick="window.chatBot.triggerAction('${b.action}')">
              ${b.text}
            </button>
          `).join('')}
        </div>
      `;
    }

    msgEl.innerHTML = `
      <div class="bot-avatar-mini">🍫</div>
      <div class="bubble-text">${html}</div>
    `;

    this.chatMessagesContainer.appendChild(msgEl);
    this.scrollToBottom();
    window.soundManager.playClick();
  }

  showTypingIndicator() {
    const el = document.createElement('div');
    el.id = 'chatTypingIndicator';
    el.className = 'chat-bubble bot-bubble typing';
    el.innerHTML = `
      <div class="bot-avatar-mini">🍫</div>
      <div class="typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    this.chatMessagesContainer.appendChild(el);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const el = document.getElementById('chatTypingIndicator');
    if (el) el.remove();
  }

  scrollToBottom() {
    if (this.chatMessagesContainer) {
      this.chatMessagesContainer.scrollTop = this.chatMessagesContainer.scrollHeight;
    }
  }

  formatMarkdown(text) {
    let res = this.escapeHtml(text);
    res = res.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    res = res.replace(/_(.*?)_/g, '<em>$1</em>');
    res = res.replace(/\n/g, '<br>');
    return res;
  }

  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.chatBot = new CacaoChatbot();
});
