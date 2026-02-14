/**
 * ========================================================
 * N One Core Engine (v3.0) - The Silent Controller 💉💎
 * العقل المدبر الذي يفرض سيطرته على الواجهات دون لمسها
 * ========================================================
 */

const N_ONE_CORE = {
    // 1. الرابط الملكي الموحد
    API_URL: "https://script.google.com/macros/s/AKfycbytYicEdE87FeQ5j9K9l3wrM9YB9uDDojNhjIKLGDDijBfOxwJPxFYDILkfIfBxJiKP/exec",

    // 2. نظام التحقق والسيطرة (The Hook)
    // هذه الدالة هي بوابة الدخول التي يستدعيها Client
    checkSession: function(requiredRole = null) {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) { this.logout(); return null; }
        
        const user = JSON.parse(userStr);
        if (requiredRole && user.role !== requiredRole) {
            if (user.role === 'admin') return user; 
            this.logout();
            return null;
        }

        // هنا يكمن السر تفعيل السيطرة فور استدعاء الجلسة
        this.activateControl(); 
        
        localStorage.setItem('nOne_last_active', Date.now());
        return user;
    },

    logout: function() {
        localStorage.removeItem('currentUser');
        window.location.replace('index.html');
    },

    // 3. معالج البيانات الذكي (Data Interceptor)
    // العقل المدبر يعترض البيانات ويصلحها قبل أن يراها Client
    fetchData: async function(action, params = {}) {
        try {
            let url = this.API_URL + "?action=" + action;
            for (const key in params) url += `&${key}=${encodeURIComponent(params[key])}`;
            
            const response = await fetch(url);
            let rawData = await response.json();

            // إذا كانت البيانات مصفوفة نبدأ المعالجة
            if (Array.isArray(rawData)) {
                
                // خريطة لربط معرف المستخدم باسم المنشأة وموقعها
                const shopsMap = {};
                rawData.filter(i => i.type === 'shop').forEach(s => {
                    // استخراج الاسم الحقيقي من الرابط إذا لم يتوفر وصف
                    let locName = "غير محدد";
                    if (s.location_link && s.location_link.includes('=')) {
                        locName = decodeURIComponent(s.location_link.split('=')[1]);
                    }
                    shopsMap[s.user] = { 
                        name: s.name, 
                        // الموقع المسجل في إعدادات المنشأة
                        location: locName,
                        realStatus: s.status // الحالة الحقيقية من السيرفر
                    };
                });

                // تعديل كل سطر ببيانات "مزيفة" محسنة ليقبلها Client
                rawData.forEach(item => {
                    
                    // إصلاح حالة المنشآت في جدول الإدارة
                    if (item.type === 'shop' || item.role === 'shop') {
                        // إذا كانت الحالة مجمدة في السيرفر نفرضها على العرض
                        if (item.status === 'paused') {
                            // نتركها كما هي لأن Client يفهم paused
                        }
                    }

                    // إصلاح بيانات الطلبات في غرفة العمليات
                    if (item.type === 'order') {
                        // استبدال معرف المستخدم باسم المنشأة الحقيقي
                        if (shopsMap[item.client_user]) {
                            // نخدع Client ونضع الاسم مكان المعرف ليعرضه
                            item.client_user_original = item.client_user; // نحتفظ بالأصل
                            item.name = shopsMap[item.client_user].name; // للاستخدام العام
                            
                            // إصلاح الموقع ليظهر اسم المنطقة بدلاً من الرابط
                            if (item.pickup && item.pickup.includes('http')) {
                                // نحاول استخراج الاسم من الرابط القديم أو نستخدم موقع المنشأة
                                item.pickup = shopsMap[item.client_user].location; 
                            } else if (!item.pickup || item.pickup === 'undefined') {
                                item.pickup = shopsMap[item.client_user].location;
                            }
                        }

                        // إصلاح الأرقام المالية
                        item.val = Number(item.val) || 0;
                        item.fee = Number(item.fee) || 0;
                        
                        // دمج القيم للعرض إذا لزم الأمر
                        item.total_cash = item.val + item.fee;
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

    // 4. تفعيل السيطرة وحقن الواجهات (The Injector)
    activateControl: function() {
        // ننتظر قليلاً حتى يحمل Client دواله الأصلية
        setTimeout(() => {
            // السيطرة على دالة رسم الأرشيف في Client
            if (window.renderArchive) {
                const originalRender = window.renderArchive; // حفظ النسخة القديمة
                window.renderArchive = function() {
                    originalRender(); // تنفيذ القديمة أولاً لرسم الجدول
                    N_ONE_CORE.injectDiscounts(); // ثم حقن الخصومات فوراً
                };
            }

            // السيطرة على دالة رسم الطلبات في Client (لإظهار الأسماء الصحيحة)
            // تم حلها مسبقاً عبر fetchData لكن زيادة تأكيد
            if (window.renderOrders) {
                 const originalOrders = window.renderOrders;
                 window.renderOrders = function() {
                     originalOrders();
                     // يمكننا إضافة أي تعديلات إضافية هنا مستقبلاً
                 };
            }
        }, 500); // نصف ثانية مهلة للتأكد من تحميل الصفحة
    },

    // 5. نظام الخصومات وتراكم ذمم الكباتن
    injectDiscounts: function() {
        const tbody = document.getElementById('archive-table-body');
        if (!tbody) return;

        // إضافة ترويسة للجدول إذا لم تكن موجودة
        const table = tbody.parentElement;
        const theadRow = table.querySelector('thead tr');
        if (theadRow && !theadRow.querySelector('.n1-discount-header')) {
            const th = document.createElement('th');
            th.className = 'n1-discount-header';
            th.innerText = 'الخصم %';
            th.style.color = '#c62828'; 
            theadRow.appendChild(th);
        }

        // المرور على كل صف وإضافة خانة الحساب
        const rows = tbody.querySelectorAll('tr');
        
        // مصفوفة لتجميع حسابات الكباتن
        let captainDebts = {};

        rows.forEach(row => {
            // تخطي الصفوف الفارغة أو المحقونة مسبقاً
            if (row.querySelector('.n1-discount-cell') || row.innerText.includes('لم يتم')) return;

            const tds = row.querySelectorAll('td');
            // نفترض أن اسم الكابتن في العمود الأول (index 0)
            const capName = tds[0]?.innerText || "Unknown";
            // نفترض أن أجرة التوصيل في العمود الثالث (index 2)
            const feeText = tds[2]?.innerText || "0";
            const deliveryFee = parseFloat(feeText.replace(/[^\d.-]/g, '')) || 0;

            // إنشاء خلية الخصم
            const td = document.createElement('td');
            td.className = 'n1-discount-cell';
            
            // حاوية المدخلات
            const container = document.createElement('div');
            container.style.display = 'flex'; container.style.alignItems = 'center'; container.style.gap = '5px';

            // حقل إدخال النسبة
            const input = document.createElement('input');
            input.type = 'number';
            input.placeholder = '%';
            input.style = "width:40px; padding:2px; border:1px solid #ccc; text-align:center; border-radius:4px;";
            
            // استرجاع النسبة المحفوظة لهذا الكابتن سابقاً
            const savedRate = localStorage.getItem(`n1_rate_${capName}`) || 0;
            input.value = savedRate;

            // عرض القيمة المخصومة
            const display = document.createElement('span');
            display.style = "font-size:11px; font-weight:bold; color:#c62828;";
            
            // دالة الحساب الفوري
            const calc = () => {
                const rate = parseFloat(input.value) || 0;
                const discountVal = deliveryFee * (rate / 100);
                display.innerText = `-${discountVal.toFixed(2)}`;
                
                // حفظ النسبة
                localStorage.setItem(`n1_rate_${capName}`, rate);
                
                // تحديث التجميع الكلي
                N_ONE_CORE.recalculateTotals();
            };

            input.oninput = calc;
            // تنفيذ الحساب فور الإنشاء
            calc();

            container.appendChild(input);
            container.appendChild(display);
            td.appendChild(container);
            row.appendChild(td);
        });

        // تشغيل حساب التراكمي في النهاية
        this.recalculateTotals();
    },

    // إعادة حساب وعرض الصندوق العائم لذمم الكباتن
    recalculateTotals: function() {
        const totals = {};
        
        // نجمع من الواجهة الحالية (ما يراه المستخدم)
        document.querySelectorAll('.n1-discount-cell').forEach(cell => {
            const row = cell.parentElement;
            const capName = row.querySelectorAll('td')[0].innerText;
            const valText = cell.querySelector('span').innerText;
            const val = parseFloat(valText.replace('-', '')) || 0;

            if (!totals[capName]) totals[capName] = 0;
            totals[capName] += val;
        });

        // رسم الصندوق العائم
        let box = document.getElementById('n1-debt-box');
        if (!box) {
            box = document.createElement('div');
            box.id = 'n1-debt-box';
            box.style = "position:fixed; bottom:20px; left:20px; background:white; border:2px solid #c62828; padding:15px; border-radius:10px; z-index:9999; box-shadow:0 5px 15px rgba(0,0,0,0.2); min-width:180px;";
            box.innerHTML = '<h4 style="margin:0 0 10px 0; color:#c62828; font-size:14px; text-align:center;">📉 ذمم الخصومات المتراكمة</h4><div id="n1-debt-list"></div>';
            document.body.appendChild(box);
        }

        const list = document.getElementById('n1-debt-list');
        list.innerHTML = '';
        
        if (Object.keys(totals).length === 0) {
            list.innerHTML = '<div style="text-align:center; font-size:12px; color:#aaa;">لا يوجد خصومات</div>';
        } else {
            for (let [cap, amount] of Object.entries(totals)) {
                if (amount > 0) {
                    list.innerHTML += `
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px; font-size:13px; border-bottom:1px dashed #eee; padding-bottom:2px;">
                            <span>${cap}</span>
                            <span style="font-weight:bold; color:#c62828;">-${amount.toFixed(2)}</span>
                        </div>
                    `;
                }
            }
        }
    }
};
