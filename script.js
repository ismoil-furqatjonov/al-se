// ==========================================
// NASRIY SAYT - INTERACTIVE JAVASCRIPT LOGIC
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCalculator();
    initFAQ();
});

/* 1. Navbar Scroll & Mobile Menu Toggle */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.querySelector('i').className = 'fa-solid fa-bars';
            });
        });
    }
}

/* 2. Interactive Price & Duration Calculator */
function initCalculator() {
    const radioInputs = document.querySelectorAll('input[name="projectType"]');
    const addonCheckboxes = document.querySelectorAll('.calc-addon');
    
    const basePriceEl = document.getElementById('basePrice');
    const addonPriceEl = document.getElementById('addonPrice');
    const totalDaysEl = document.getElementById('totalDays');
    const totalPriceEl = document.getElementById('totalPrice');

    function calculateTotal() {
        let basePrice = 0;
        let baseDays = 0;
        let addonsPrice = 0;
        let addonsDays = 0;

        // Base Type
        radioInputs.forEach(radio => {
            if (radio.checked) {
                basePrice = parseInt(radio.dataset.price, 10) || 0;
                baseDays = parseInt(radio.dataset.days, 10) || 0;
            }
        });

        // Addons
        addonCheckboxes.forEach(cb => {
            if (cb.checked) {
                addonsPrice += parseInt(cb.dataset.price, 10) || 0;
                addonsDays += parseInt(cb.dataset.days, 10) || 0;
            }
        });

        const totalPrice = basePrice + addonsPrice;
        const totalDays = baseDays + addonsDays;

        if (basePriceEl) basePriceEl.textContent = formatCurrency(basePrice);
        if (addonPriceEl) addonPriceEl.textContent = formatCurrency(addonsPrice);
        if (totalDaysEl) totalDaysEl.textContent = `${totalDays}-${totalDays + 2} kun`;
        if (totalPriceEl) totalPriceEl.textContent = formatCurrency(totalPrice);
    }

    radioInputs.forEach(input => input.addEventListener('change', calculateTotal));
    addonCheckboxes.forEach(input => input.addEventListener('change', calculateTotal));

    calculateTotal();
}

function formatCurrency(amount) {
    return amount.toLocaleString('uz-UZ') + " so'm";
}

/* 3. FAQ Accordion */
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

            // Toggle current
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });
}

/* 4. Modal Window Logic & Telegram Integration */
function openOrderModal(serviceName = '') {
    const modal = document.getElementById('orderModal');
    const serviceSelect = document.getElementById('serviceType');

    if (serviceName && serviceSelect) {
        for (let option of serviceSelect.options) {
            if (option.value.toLowerCase().includes(serviceName.toLowerCase())) {
                option.selected = true;
                break;
            }
        }
    }

    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function orderFromCalculator() {
    const selectedRadio = document.querySelector('input[name="projectType"]:checked');
    let typeName = "Loyiha";
    if (selectedRadio) {
        if (selectedRadio.value === 'landing') typeName = "Landing Page";
        if (selectedRadio.value === 'corporate') typeName = "Korporativ Sayt";
        if (selectedRadio.value === 'bot') typeName = "Telegram Bot";
        if (selectedRadio.value === 'custom') typeName = "Individual Loyiha";
    }

    const totalPriceText = document.getElementById('totalPrice').textContent;
    openOrderModal(typeName);

    const detailsField = document.getElementById('projectDetails');
    if (detailsField) {
        detailsField.value = `Kalkulyatordan hisoblangan taxminiy smeta: ${totalPriceText}.`;
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('clientName').value.trim();
    const phone = document.getElementById('clientPhone').value.trim();
    const service = document.getElementById('serviceType').value;
    const details = document.getElementById('projectDetails').value.trim();

    // Construct Telegram message text
    let message = `🚀 *Yangi Buyurtma! (Nasriy Sayt Veb-saytidan)*\n\n`;
    message += `👤 *Ism:* ${name}\n`;
    message += `📞 *Aloqa:* ${phone}\n`;
    message += `🛠 *Xizmat:* ${service}\n`;
    if (details) {
        message += `📝 *Tafsilotlar:* ${details}\n`;
    }
    message += `\n📩 Telegram Lichka: @Saytlaruzb | Kanal: @nasriy_sayt1`;

    const encodedMessage = encodeURIComponent(message);
    const telegramUrl = `https://t.me/Saytlaruzb?text=${encodedMessage}`;

    // Show toast notification
    showToast("Ma'lumotlar tayyorlandi! Telegram ochilmoqda...");

    setTimeout(() => {
        closeOrderModal();
        window.open(telegramUrl, '_blank');
    }, 800);
}

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if (toast && toastMsg) {
        toastMsg.textContent = msg;
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}
