/**
 * ========================================================
 * N One Core Engine (v1.0) - The Amber Needle 💉💎
 * العقل المدبر والمصلح المركزي لإمبراطورية N One
 * ========================================================
 */

const N_ONE_CORE = {
    // 1. الرابط الملكي الموحد (يتعدل هنا ويتطبق في كل الإمبراطورية)
    API_URL: "https://script.google.com/macros/s/AKfycbybaX1dgu-rVIkUAz2w6H2NdYIuv3zKkmPbHON8NTRclD3H6cVgyW5SAzFfAPNcMt6g/exec",

    // 2. ألوان الهوية البصرية (Theme)
    THEME: {
        primary: "#1a237e",   // كحلي ملكي
        gold: "#d4af37",      // ذهبي
        success: "#2e7d32",   // أخضر
        danger: "#c62828",    // أحمر
        warning: "#f57f17",   // برتقالي
        bg: "#f4f7f6"         // خلفية
    },

    // 3. نظام "إبرة العنبر" لإصلاح الجلسات والتحقق (Auth Guard)
    // هذه الدالة ستعمل في كل صفحة للتأكد من هوية المستخدم بصمت
    checkSession: function(requiredRole = null) {
        const userStr = localStorage.getItem('currentUser');
        
        // إذا لم يجد مستخدم، يطرد فوراً للصفحة الرئيسية
        if (!userStr) {
            console.warn("⛔ No session found. Redirecting...");
            this.logout();
            return null;
        }

        const user = JSON.parse(userStr);

        // إذا كان هناك دور مطلوب (مثلا admin) والمستخدم ليس كذلك، يطرده
        if (requiredRole && user.role !== requiredRole) {
            console.warn(`⛔ Role Mismatch. Required: ${requiredRole}, Found: ${user.role}`);
            // استثناء: إذا كان الأدمن بيحاول يدخل صفحات عامة نسمح له
            if (user.role === 'admin') return user; 
            
            this.logout();
            return null;
        }

        // إبرة العنبر: تحديث وقت آخر ظهور لضمان أن الحساب حي
        localStorage.setItem('nOne_last_active', Date.now());
        return user;
    },

    // 4. الخروج الآمن وتنظيف الذاكرة
    logout: function() {
        localStorage.removeItem('currentUser');
        sessionStorage.clear();
        // التوجيه لصفحة الدخول (يفترض أنها في نفس المجلد)
        window.location.replace('index.html');
    },

    // 5. نظام التوصيات الذكي (Brain 555) 🧠
    // هذه الدالة تحلل أداء الكابتن وتقرر هل يستحق التوصية بالمكافأة
    analyzeCaptainPerformance: function(captainData) {
        // معايير الفكرة 555
        const MIN_ORDERS = 50; // أقل عدد طلبات للمكافأة
        const MIN_RATING = 4.8; // أقل تقييم

        if (captainData.totalOrders >= MIN_ORDERS && captainData.rating >= MIN_RATING) {
            return {
                status: true,
                message: `🌟 توصية ذكية: الكابتن ${captainData.name} حقق أداءً استثنائياً! نقترح منحه "يوم الإجازة المُهدى" (Idea 555). القرار لك يا مدير.`
            };
        }
        return { status: false, message: "" };
    },

    // 6. دوال مساعدة للاتصال بالسيرفر (Fetch Helper)
    fetchData: async function(action, params = {}) {
        try {
            let url = this.API_URL + "?action=" + action;
            // دمج الباراميترات في الرابط
            for (const key in params) {
                url += `&${key}=${encodeURIComponent(params[key])}`;
            }
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error("N One Core Error:", error);
            throw error;
        }
    },

    postData: async function(action, dataObj) {
        try {
            await fetch(this.API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: action, data: dataObj })
            });
            return true;
        } catch (error) {
            console.error("N One Core Post Error:", error);
            return false;
        }
    }
};

// تفعيل فوري: طباعة رسالة في الكونسول للتأكد أن النواة تعمل

console.log("%c N One Core Loaded 🚀 | V1.0 Amber Needle", "color: #d4af37; background: #1a237e; font-size: 14px; padding: 5px;");





