/**
 * ========================================================
 * N One Core Engine (v2.0 Pro) - The Smart Fixer 💉💎
 * العقل المدبر والمصلح المركزي لإمبراطورية N One
 * يقوم بمعالجة البيانات وحقن التعديلات في الواجهات عن بعد
 * ========================================================
 */

const N_ONE_CORE = {
    // 1. الرابط الملكي الموحد
    API_URL: "https://script.google.com/macros/s/AKfycbytYicEdE87FeQ5j9K9l3wrM9YB9uDDojNhjIKLGDDijBfOxwJPxFYDILkfIfBxJiKP/exec",

    // 2. ألوان الهوية البصرية
    THEME: {
        primary: "#1a237e", gold: "#d4af37", success: "#2e7d32",
        danger: "#c62828", warning: "#f57f17", bg: "#f4f7f6"
    },

    // 3. نظام "إبرة العنبر" لإصلاح الجلسات والتحقق
    checkSession: function(requiredRole = null) {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) { this.logout(); return null; }
        
        const user = JSON.parse(userStr);
        if (requiredRole && user.role !== requiredRole) {
            if (user.role === 'admin') return user; 
            this.logout();
            return null;
        }

        // تشغيل نظام الإصلاح التلقائي للصفحات
        this.initAutoFixer(); 
        
        localStorage.setItem('nOne_last_active', Date.now());
        return user;
    },

    logout: function() {
        localStorage.removeItem('currentUser');
        window.location.replace('index.html');
    },

    // 4. دوال الاتصال بالسيرفر مع "فلتر المعالجة الذكي"
    fetchData: async function(action, params = {}) {
        try {
            let url = this.API_URL + "?action=" + action;
            for (const key in params) url += `&${key}=${encodeURIComponent(params[key])}`;
            
            const response = await fetch(url);
            let rawData = await response.json();

            // 🧠 المعالج الذكي: إصلاح البيانات قبل وصولها للواجهات
            if (Array.isArray(rawData)) {
                // تجميع المنشآت لربط الأسماء
                const shopsMap = {};
                rawData.filter(i => i.type === 'shop').forEach(s => {
                    shopsMap[s.user] = { 
                        name: s.name, 
                        loc: s.location_link || s.name, // استخدام اسم المنشأة كموقع إذا لم يوجد رابط
                        comm: s.commission || 0
                    };
                });

                // تعديل كل طلب ليعرض الاسم الحقيقي والموقع والأرقام الصحيحة
                rawData.forEach(item => {
                    if (item.type === 'order') {
                        // حل مشكلة اسم المصدر والموقع
                        if (shopsMap[item.client_user]) {
                            item.cl_name = shopsMap[item.client_user].name; // استبدال المعرف بالاسم التجاري
                            
                            // إذا كان الموقع عبارة عن رابط فقط، نحاول استخراج الاسم أو نعتمد موقع المنشأة
                            if (!item.pickup || item.pickup.length < 5) {
                                item.pickup = shopsMap[item.client_user].loc;
                            }
                        }
                        
                        // حل مشكلة الأصفار (تحويل النصوص لأرقام)
                        item.val = Number(item.val) || 0;
                        item.fee = Number(item.fee) || 0;

                        // حل مشكلة الحالة (تجميد المنشآت)
                        // نتأكد أن الحالة تعكس الواقع
                        if (item.type === 'shop' && item.status === 'paused') {
                            item.displayStatus = 'مجمد ❄️'; // خاصية للعرض
                        }
                    }
                });
            }
            return rawData;

        } catch (error) {
            console.error("Core Error:", error);
            throw error;
        }
    },

    postData: async function(action, dataObj) {
        try {
            await fetch(this.API_URL, {
                method: 'POST', mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: action, data: dataObj })
            });
            return true;
        } catch (error) { return false; }
    },

    // 5. 🛠️ نظام الحقن البرمجي (Auto Fixer & Injector)
    // هذه الدالة السحرية تعمل في الخلفية وتعدل صفحة Client دون لمس ملفها
    initAutoFixer: function() {
        if (window.location.href.includes('client.html')) {
            console.log("💉 N One Core: Injecting Client Fixes...");

            window.addEventListener('load', () => {
                // أ) التجسس على دالة رسم الأرشيف لتعديلها بعد التنفيذ
                if (typeof renderArchive === 'function') {
                    const originalRender = renderArchive; // حفظ الدالة الأصلية
                    window.renderArchive = function() {
                        originalRender(); // تشغيل الأصلية
                        N_ONE_CORE.injectFinancialColumn(); // تشغيل التعديلات فوراً بعدها
                    };
                }
            });
        }
    },

    // 6. 💰 الآلة الحاسبة المالية للكباتن (تُحقن في جدول الأرشيف)
    injectFinancialColumn: function() {
        const table = document.querySelector('#archive-table-body')?.parentElement;
        if (!table) return;

        // 1. إضافة ترويسة الجدول (الخصم)
        const theadRow = table.querySelector('thead tr');
        if (theadRow && !theadRow.querySelector('.n1-finance-head')) {
            const th = document.createElement('th');
            th.className = 'n1-finance-head';
            th.innerText = 'الخصم والذمم 📉';
            th.style.color = '#c62828';
            theadRow.appendChild(th);
        }

        // 2. معالجة الصفوف وحساب التراكمي
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        
        // ذاكرة مؤقتة لحساب تراكمي الكباتن في هذا العرض
        let captainTotals = {}; 

        rows.forEach(row => {
            if (row.querySelector('.n1-finance-cell') || row.innerText.includes('لم يتم')) return;

            // استخراج البيانات من الصف الحالي (يعتمد على ترتيب الأعمدة في Client)
            const tds = row.querySelectorAll('td');
            const capName = tds[0]?.innerText || "Unknown";
            const feeText = tds[2]?.innerText || "0";
            const fee = parseFloat(feeText.replace('د.أ', '')) || 0;

            // الخلية الجديدة
            const td = document.createElement('td');
            td.className = 'n1-finance-cell';
            
            // حساب الخصم (افتراضي 0، ويمكن تغييره يدوياً)
            // بما أننا لا نستطيع الحفظ في الداتا بيس حاليا، سنحسبها محلياً للعرض
            const inputContainer = document.createElement('div');
            inputContainer.style.display = 'flex';
            inputContainer.style.alignItems = 'center';
            inputContainer.style.gap = '5px';

            const percentInput = document.createElement('input');
            percentInput.type = 'number';
            percentInput.placeholder = '%';
            percentInput.style = "width:40px; padding:2px; border:1px solid #ccc; font-size:11px; text-align:center;";
            percentInput.value = localStorage.getItem(`n1_rate_${capName}`) || 0; // استرجاع آخر نسبة للكابتن

            const resultSpan = document.createElement('span');
            resultSpan.style = "font-size:11px; font-weight:bold; color:#c62828;";
            resultSpan.innerText = "0.00";

            // دالة الحساب الفوري
            const calculate = () => {
                const pct = parseFloat(percentInput.value) || 0;
                const discount = fee * (pct / 100);
                resultSpan.innerText = `-${discount.toFixed(2)}`;
                
                // حفظ النسبة للكابتن للمستقبل
                localStorage.setItem(`n1_rate_${capName}`, pct);
                
                // تحديث التراكمي للكابتن
                N_ONE_CORE.updateCaptainTotal(capName, discount);
            };

            percentInput.oninput = calculate;
            
            // تشغيل الحساب عند التحميل
            setTimeout(calculate, 100);

            inputContainer.appendChild(percentInput);
            inputContainer.appendChild(resultSpan);
            td.appendChild(inputContainer);
            row.appendChild(td);
        });

        // إنشاء لوحة عائمة لملخص ذمم الكباتن
        this.renderFloatingTotals();
    },

    captainDebts: {}, // تخزين الذمم

    updateCaptainTotal: function(capName, amount) {
        // إعادة تصفير وحساب من الجدول الحالي المعروض فقط
        // (لأن هذا عرض "يومي" في الأرشيف)
        this.renderFloatingTotals();
    },

    renderFloatingTotals: function() {
        // جمع البيانات من المدخلات الحالية في الجدول
        const totals = {};
        document.querySelectorAll('.n1-finance-cell').forEach(cell => {
            const row = cell.parentElement;
            const capName = row.querySelectorAll('td')[0].innerText;
            const valSpan = cell.querySelector('span').innerText;
            const val = parseFloat(valSpan.replace('-', '')) || 0;

            if (!totals[capName]) totals[capName] = 0;
            totals[capName] += val;
        });

        // عرض اللوحة العائمة
        let panel = document.getElementById('n1-cap-totals');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'n1-cap-totals';
            panel.style = "position:fixed; bottom:20px; left:20px; background:white; padding:15px; border-radius:10px; border:2px solid #d4af37; box-shadow:0 5px 20px rgba(0,0,0,0.2); z-index:9999; max-height:300px; overflow-y:auto; width:200px;";
            panel.innerHTML = `<h4 style="margin:0 0 10px 0; color:#1a237e; border-bottom:1px solid #eee;">💰 ذمم الكباتن (اليوم)</h4><div id="n1-totals-list"></div>`;
            document.body.appendChild(panel);
        }

        const list = document.getElementById('n1-totals-list');
        list.innerHTML = '';
        
        if (Object.keys(totals).length === 0) {
            list.innerHTML = '<small>لا توجد خصومات</small>';
        } else {
            for (let [cap, amount] of Object.entries(totals)) {
                if (amount > 0) {
                    list.innerHTML += `
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:12px;">
                            <span>${cap}</span>
                            <span style="color:#c62828; font-weight:bold;">${amount.toFixed(2)} د.أ</span>
                        </div>
                    `;
                }
            }
        }
    }
};

console.log("%c N One Core V2 Loaded 🚀 | Smart Fixer Active", "color: #d4af37; background: #1a237e; padding: 5px;");
