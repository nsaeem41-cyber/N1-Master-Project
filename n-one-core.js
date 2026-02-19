/**
 * ========================================================
 * N One Core Engine (v1.0) - The Amber Needle 💉💎
 * العقل المدبر والمصلح المركزي لإمبراطورية N One
 * ========================================================
 */

const Core_N_ONE_CORE = {
    // 1. الرابط الملكي الموحد (يتعدل هنا ويتطبق في كل الإمبراطورية)
    Core_API_URL: "https://script.google.com/macros/s/AKfycbxFVz0QTi_7TgWQEMImtMGYRBzlD1CwM5X4DbprUvVJkURs_75aD5n5IcpbS87d8Q5j/exec",

    // 2. ألوان الهوية البصرية (Theme)
    Core_THEME: {
        primary: "#1a237e",   // كحلي ملكي
        gold: "#d4af37",      // ذهبي
        success: "#2e7d32",   // أخضر
        danger: "#c62828",    // أحمر
        warning: "#f57f17",   // برتقالي
        bg: "#f4f7f6"         // خلفية
    },

    // 3. نظام "إبرة العنبر" لإصلاح الجلسات والتحقق (Auth Guard)
    Core_checkSession: function(Core_requiredRole = null) {
        // قراءة الجلسة المشفرة من بوابة الدخول
        const Core_userStr = localStorage.getItem('Auth_CurrentUser');
        
        // إذا لم يجد مستخدم يطرد فوراً للصفحة الرئيسية
        if (!Core_userStr) {
            console.warn("⛔ No session found Redirecting...");
            this.Core_logout();
            return null;
        }

        const Core_user = JSON.parse(Core_userStr);

        // التحقق من الدور المطلوب بناء على التشفير الجديد
        if (Core_requiredRole && Core_user.Auth_Role !== Core_requiredRole) {
            console.warn(`⛔ Role Mismatch Required: ${Core_requiredRole}, Found: ${Core_user.Auth_Role}`);
            // استثناء إذا كان الأدمن بيحاول يدخل صفحات عامة نسمح له
            if (Core_user.Auth_Role === 'admin') return Core_user; 
            
            this.Core_logout();
            return null;
        }

        // إبرة العنبر المشفرة تحديث وقت آخر ظهور لضمان أن الحساب حي
        localStorage.setItem('Core_LastActive', Date.now());
        return Core_user;
    },

    // 4. الخروج الآمن وتنظيف الذاكرة
    Core_logout: function() {
        localStorage.removeItem('Auth_CurrentUser');
        sessionStorage.clear();
        // التوجيه لصفحة الدخول
        window.location.replace('index.html');
    },

    // 5. نظام التوصيات الذكي (Brain 555) 🧠
    Core_analyzeCaptainPerformance: function(Core_captainData) {
        // معايير المكافأة
        const Core_MIN_ORDERS = 50; 
        const Core_MIN_RATING = 4.8; 

        if (Core_captainData.totalOrders >= Core_MIN_ORDERS && Core_captainData.rating >= Core_MIN_RATING) {
            return {
                status: true,
                message: `🌟 توصية ذكية: الكابتن ${Core_captainData.name} حقق أداءً استثنائياً نقترح منحه المكافأة الخاصة بالفكرة 555 القرار لك يا مدير`
            };
        }
        return { status: false, message: "" };
    },

    // 6. دوال مساعدة للاتصال بالسيرفر (Fetch Helper)
    Core_fetchData: async function(Core_action, Core_params = {}) {
        try {
            let Core_url = this.Core_API_URL + "?action=" + Core_action;
            // دمج الباراميترات المشفرة في الرابط
            for (const Core_key in Core_params) {
                Core_url += `&${Core_key}=${encodeURIComponent(Core_params[Core_key])}`;
            }
            const Core_response = await fetch(Core_url);
            return await Core_response.json();
        } catch (Core_error) {
            console.error("N One Core Error:", Core_error);
            throw Core_error;
        }
    },

    Core_postData: async function(Core_action, Core_dataObj) {
        try {
            await fetch(this.Core_API_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: Core_action, data: Core_dataObj })
            });
            return true;
        } catch (Core_error) {
            console.error("N One Core Post Error:", Core_error);
            return false;
        }
    }
};

// تفعيل فوري طباعة رسالة في الكونسول للتأكد أن النواة تعمل
console.log("%c N One Core Loaded 🚀 | V1.0 Amber Needle", "color: #d4af37; background: #1a237e; font-size: 14px; padding: 5px;");
