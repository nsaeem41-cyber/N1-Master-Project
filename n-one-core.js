/**
 * ========================================================
 * N ONE CORE (Diamond Edition 💎)
 * العقل المدبر المطور - يتولى الذكاء، الذاكرة، والتنسيق الرسمي
 * Developed for: Habbat al-Sukar
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("N One Diamond Logic Loaded 🚀");

    // 1. تفعيل مراقبة خانة الهاتف لتشغيل الذاكرة
    const phoneInput = document.getElementById('man_phone');
    if(phoneInput) {
        phoneInput.addEventListener('input', checkCaptainMemory);
    }
    
    // 2. حقن خانة نسبة الكابتن ديناميكياً (إذا لم تكن موجودة)
    injectCommissionInput();

    // 3. محاولة استرجاع اسم الشركة الحالي لترويسة الواتساب
    if(typeof N_ONE_CORE !== 'undefined') {
        window.currentCompanyName = N_ONE_CORE.checkSession('client')?.name || "N One";
    }
});

// ============================================================
// 1. حقن خانة نسبة الكابتن (Dynamic Injection) 💉
// ============================================================
function injectCommissionInput() {
    const feeInput = document.getElementById('man_fee');
    if (feeInput && !document.getElementById('man_cap_comm')) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = '10px';
        wrapper.style.marginTop = '10px';
        
        wrapper.innerHTML = `
            <div style="position:relative; flex:1;">
                <input type="number" id="man_cap_comm" placeholder="نسبة الكابتن" style="width:100%; border:1px solid #d4af37; padding:12px; border-radius:8px; outline:none;">
                <span style="position:absolute; left:10px; top:12px; color:#aaa; font-size:12px;">%</span>
            </div>
            <div style="flex:1; display:flex; align-items:center; font-size:11px; color:#555;">
                سيتم حفظ النسبة للكابتن تلقائياً
            </div>
        `;
        // إدراجها قبل زر الإرسال
        const btn = document.querySelector('.btn-whatsapp');
        if(btn) btn.parentNode.insertBefore(wrapper, btn);
    }
}

// ============================================================
// 2. ذاكرة الكباتن والنسب الدائمة 🧠
// ============================================================
function checkCaptainMemory() {
    let phone = document.getElementById('man_phone').value;
    const hint = document.getElementById('cap_memory_hint');
    const nameInput = document.getElementById('man_cap_name');
    const commInput = document.getElementById('man_cap_comm');
    
    // تنظيف الرقم للمقارنة
    let cleanPhone = phone.replace(/\D/g, ''); 
    if (cleanPhone.startsWith('962')) cleanPhone = cleanPhone.substring(3);
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    
    const memory = JSON.parse(localStorage.getItem('n1_captains_db_plus') || '{}');
    const captainData = memory[cleanPhone];

    if (captainData) {
        if(hint) {
            hint.style.display = 'block';
            document.getElementById('mem_cap_name').innerText = captainData.name + ` (النسبة: ${captainData.comm}%)`;
        }
        if(nameInput && !nameInput.value) nameInput.value = captainData.name;
        if(commInput) commInput.value = captainData.comm;
    } else {
        if(hint) hint.style.display = 'none';
    }
}

function saveCaptainData(phone, name, comm) {
    let cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.startsWith('962')) cleanPhone = cleanPhone.substring(3);
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);

    const memory = JSON.parse(localStorage.getItem('n1_captains_db_plus') || '{}');
    
    // حفظ أو تحديث البيانات
    memory[cleanPhone] = { name: name, comm: comm || 0 };
    localStorage.setItem('n1_captains_db_plus', JSON.stringify(memory));
}

// ============================================================
// 3. الإرسال اليدوي وتنسيق الواتساب الرسمي (سحب اسم الشركة) 📲
// ============================================================
function sendManualOrderExternal() {
    const capName = document.getElementById('man_cap_name').value;
    let phoneInput = document.getElementById('man_phone').value;
    const locName = document.getElementById('man_loc').value; // المصدر
    const fee = document.getElementById('man_fee').value;
    const price = document.getElementById('man_price').value;
    const comm = document.getElementById('man_cap_comm') ? document.getElementById('man_cap_comm').value : 0;

    // التحقق من البيانات
    if(!capName || !phoneInput || !locName) { 
        alert("يرجى تعبئة بيانات الكابتن، الرقم، والموقع ☺️"); 
        return; 
    }

    // حفظ البيانات في الذاكرة الدائمة
    saveCaptainData(phoneInput, capName, comm);

    // معالجة الرقم (+962)
    let finalPhone = phoneInput.replace(/\D/g, '');
    if (finalPhone.startsWith('0')) finalPhone = finalPhone.substring(1);
    if (!finalPhone.startsWith('962')) finalPhone = "962" + finalPhone;

    // 📍 محرك البحث الجغرافي الدقيق (Google Maps Search API)
    const smartLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(locName);
    
    // حساب النشاط اليومي من الأرشيف
    const dailyArchive = JSON.parse(localStorage.getItem('n1_daily_archive_' + new Date().toLocaleDateString()) || '[]');
    const dailyCount = dailyArchive.filter(x => x.capName === capName).length + 1;

    // جلب اسم الشركة من الجلسة الحالية (سحب تلقائي)
    let companyName = "N One";
    if(typeof N_ONE_CORE !== 'undefined') {
        const session = N_ONE_CORE.checkSession('client');
        if(session && session.name) companyName = session.name;
    }

    // 📝 تنسيق الرسالة الرسمي
    let msg = `*إشعار طلب جديد - ${companyName}* 📦%0a`; // هنا يظهر اسم الشركة
    msg += `المرسل إليه: ${capName}%0a`;
    msg += `يرجى استلام الطلب التالي:%0a%0a`;
    msg += `🏢 *المصدر:* ${locName}%0a`;
    msg += `🗺️ *الموقع الجغرافي:* ${smartLink}%0a%0a`;
    msg += `📋 *بيانات التوصيل:*%0a`;
    msg += `🔸 أجرة المندوب: ${fee || 0} د.أ%0a`;
    msg += `🔹 قيمة الشحنة: ${price || 0} د.أ%0a%0a`;
    msg += `📊 *ملخص النشاط اليومي:*%0a`;
    msg += `إجمالي الطلبات: ${dailyCount}%0a%0a`;
    msg += `⚠️ نرجو الالتزام بمعايير الجودة والوقت.`;

    // فتح واتساب
    window.open(`https://wa.me/${finalPhone}?text=${msg}`, '_blank');

    // الأرشفة المحلية الفورية مع حساب صافي الربح
    addToArchiveExternal(capName, locName, fee, comm);
}

// ============================================================
// 4. الأرشفة والحسابات المالية (صافي الربح التلقائي) 🗂️
// ============================================================
function addToArchiveExternal(capName, locName, fee, commRate) {
    const dailyArchive = JSON.parse(localStorage.getItem('n1_daily_archive_' + new Date().toLocaleDateString()) || '[]');
    
    // حساب صافي الربح (النسبة)
    const netProfit = (Number(fee) * (Number(commRate) / 100)).toFixed(2);

    const order = { 
        capName, 
        locName, 
        fee, 
        netProfit, // خانة الربح المحسوبة
        time: new Date().toLocaleTimeString('ar-JO', {hour: '2-digit', minute:'2-digit'}) 
    };
    
    dailyArchive.unshift(order);
    localStorage.setItem('n1_daily_archive_' + new Date().toLocaleDateString(), JSON.stringify(dailyArchive));
    
    // تحديث الجدول فوراً إذا كانت الصفحة مفتوحة
    if(typeof window.renderArchiveExternal === 'function') {
        window.renderArchiveExternal();
    } else {
        renderArchiveOverride();
    }
}

// دالة لعرض الأرشيف (تستبدل الدالة الموجودة في HTML)
window.renderArchiveOverride = function() {
    const tbody = document.getElementById('archive-table-body');
    if(!tbody) return;

    const dailyArchive = JSON.parse(localStorage.getItem('n1_daily_archive_' + new Date().toLocaleDateString()) || '[]');
    
    tbody.innerHTML = '';
    if(dailyArchive.length === 0) { 
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">لم يتم إرسال طلبات يدوية اليوم</td></tr>'; 
        return; 
    }
    
    dailyArchive.forEach(o => {
        tbody.innerHTML += `
            <tr>
                <td><b>${o.capName}</b></td>
                <td>${o.locName}</td>
                <td>${o.fee}</td>
                <td><span class="badge" style="background:#e8f5e9; color:#1b5e20;">${o.netProfit} د.أ</span></td>
                <td><span class="badge" style="background:#e3f2fd; color:#1565c0;">تم ✅</span></td>
            </tr>
        `;
    });
    
    // إضافة ترويسة "صافي الربح" للجدول إذا لم تكن موجودة
    const thead = document.querySelector('#archive-table-body').parentNode.querySelector('thead tr');
    if(thead && thead.children.length === 4) {
        const th = document.createElement('th');
        th.innerText = "صافي الربح";
        thead.insertBefore(th, thead.children[3]);
    }
}
// تشغيل عرض الأرشيف عند التحميل
document.addEventListener('DOMContentLoaded', window.renderArchiveOverride);


// ============================================================
// 5. تعديل عرض سجل الطلبات الواردة (Live Log) 📡
// ============================================================
window.overrideRenderOrders = function(allData, currentUser) {
    const tbody = document.getElementById('orders-table-body');
    if(!tbody) return;

    const myShopsUsers = allData.filter(i => i.type === 'shop' && i.client_user === currentUser.user).map(s => s.user);
    const orders = allData.filter(i => i.type === 'order' && myShopsUsers.includes(i.client_user)).reverse();

    // تشغيل الصوت إذا زاد العدد (نبضة القلب)
    if (window.lastOrderCount && orders.length > window.lastOrderCount) {
        const audio = document.getElementById('notif-sound');
        if(audio) audio.play().catch(e => {});
    }
    window.lastOrderCount = orders.length;

    let totalProfit = 0;
    tbody.innerHTML = '';

    if (orders.length === 0) { 
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">لا توجد طلبات واردة</td></tr>'; 
        return; 
    }

    orders.forEach(ord => {
        const shop = allData.find(s => s.user === ord.client_user);
        const commRate = shop ? Number(shop.commission || 0) : 0;
        const deliveryFee = Number(ord.fee || 0);
        const profit = deliveryFee * (commRate / 100);
        totalProfit += profit;

        // رابط الموقع الذكي
        const mapUrl = ord.pickup || (shop ? shop.location_link : '#');
        // اسم المصدر (المنشأة)
        const sourceName = shop ? shop.name : 'مطعم خارجي';
        // الموقع الاحتياطي (النصي)
        const backupLoc = ord.pickup_text || sourceName;

        tbody.innerHTML += `
            <tr>
                <td style="font-size:12px;">${ord.date.split('T')[1]?.substring(0,5) || 'Now'}</td>
                <td><b>${sourceName}</b></td> <td>
                    <a href="${mapUrl}" target="_blank" style="text-decoration:none; color:#00695c; font-weight:bold;">📍 الموقع الرئيسي</a>
                    <br><span style="font-size:10px; color:#777;">(${backupLoc})</span> </td>
                <td>${deliveryFee.toFixed(2)}</td>
                <td><span class="badge" style="background:#e8f5e9; color:#1b5e20;">+${profit.toFixed(2)}</span></td>
            </tr>
        `;
    });

    const profitEl = document.getElementById('total-profit');
    if(profitEl) profitEl.innerText = totalProfit.toFixed(1) + " د.أ";
}

// Polling ذكي لتحديث الجدول تلقائياً بدون تعديل HTML
setInterval(() => {
    if(window.allData && window.currentUser && window.allData.length > 0) {
        window.overrideRenderOrders(window.allData, window.currentUser);
    }
}, 2000);

// ============================================================
// 6. إصلاح التجميد (Freeze Fix - Active Control) ❄️
// ============================================================
window.toggleStatus = async function(u, currentS) {
    const newS = currentS === 'active' ? 'paused' : 'active';
    const action = newS === 'paused' ? "تجميد" : "تفعيل";
    
    if(!confirm(`هل أنت متأكد من ${action} حساب المنشأة؟\n(عند التجميد لن تظهر في قائمة الطلبات)`)) return;
    
    document.getElementById('loader-overlay').style.display = 'flex';
    
    // استخدام Core لتحديث الحالة في السيرفر
    if(typeof N_ONE_CORE !== 'undefined') {
        await N_ONE_CORE.postData('update', { user: u, data: { status: newS } });
        // فرض تحديث البيانات في الصفحة
        if(typeof fetchData === 'function') await fetchData();
    }
    
    document.getElementById('loader-overlay').style.display = 'none';
}

