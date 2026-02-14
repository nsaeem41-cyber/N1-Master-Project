/**
 * ========================================================
 * N One Core Engine (v4.0) - The Diagnostic Inspector 🕵️‍♂️
 * وضع الفحص لكشف المسميات الحقيقية للعناصر في Client
 * ========================================================
 */

const N_ONE_CORE = {
    // 1. الرابط الملكي الموحد
    API_URL: "https://script.google.com/macros/s/AKfycbytYicEdE87FeQ5j9K9l3wrM9YB9uDDojNhjIKLGDDijBfOxwJPxFYDILkfIfBxJiKP/exec",

    // 2. نظام التحقق مع تفعيل المفتش
    checkSession: function(requiredRole = null) {
        const userStr = localStorage.getItem('currentUser');
        if (!userStr) { this.logout(); return null; }
        
        const user = JSON.parse(userStr);
        if (requiredRole && user.role !== requiredRole) {
            if (user.role === 'admin') return user; 
            this.logout();
            return null;
        }

        // تشغيل الفحص فوراً
        this.runInspector();
        
        return user;
    },

    logout: function() {
        localStorage.removeItem('currentUser');
        window.location.replace('index.html');
    },

    // دوال الاتصال (مؤقتة لغايات الفحص)
    fetchData: async function(action, params = {}) {
        let url = this.API_URL + "?action=" + action;
        for (const key in params) url += `&${key}=${encodeURIComponent(params[key])}`;
        const response = await fetch(url);
        return await response.json();
    },
    
    postData: async function(action, dataObj) {
        // ... (نفس الكود القديم)
    },

    // 🕵️‍♂️ كود المفتش الذكي (Sherlock Mode)
    runInspector: function() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                let report = "🕵️ تقرير المسميات الحقيقية (انسخي هذا النص):\n\n";

                // 1. فحص الجداول (Tables)
                const tables = document.querySelectorAll('table');
                report += `Found ${tables.length} Tables:\n`;
                
                tables.forEach((tbl, i) => {
                    const tbody = tbl.querySelector('tbody');
                    const thead = tbl.querySelector('thead');
                    const headers = Array.from(tbl.querySelectorAll('th')).map(th => th.innerText.trim()).join(' | ');
                    
                    report += `--- Table #${i+1} ---\n`;
                    report += `ID: ${tbl.id || 'No-ID'}\n`;
                    report += `Class: ${tbl.className || 'No-Class'}\n`;
                    report += `Tbody ID: ${tbody ? tbody.id : 'No-ID'} (Important!)\n`;
                    report += `Headers: [ ${headers} ]\n\n`;
                });

                // 2. فحص خانات الإدخال المهمة (للمطاعم والكباتن)
                const inputs = document.querySelectorAll('input, select');
                report += `Found ${inputs.length} Inputs. Key ones:\n`;
                
                inputs.forEach(inp => {
                    if(inp.id) {
                        report += `Input ID: ${inp.id} | Type: ${inp.type}\n`;
                    }
                });

                // عرض التقرير في صندوق عائم
                const box = document.createElement('div');
                box.style = "position:fixed; top:10%; left:10%; width:80%; height:70%; background:black; color:#0f0; padding:20px; z-index:10000; overflow:auto; font-family:monospace; border:5px solid #d4af37; border-radius:10px; direction:ltr; text-align:left;";
                box.innerHTML = `<h3 style="color:#d4af37; margin-top:0;">تقرير المفتش (Inspector Report)</h3><textarea style="width:100%; height:80%; background:#222; color:#fff;">${report}</textarea><button onclick="this.parentElement.remove()" style="padding:10px; width:100%; background:#c62828; color:white; border:none; margin-top:10px; cursor:pointer;">إغلاق x</button>`;
                
                document.body.appendChild(box);

            }, 2000); // تأخير 2 ثانية لضمان تحميل الصفحة
        });
    }
};
