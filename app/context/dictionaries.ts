export const dictionaries = {
  en: {
    nav: {
      features: "Features",
      docs: "Documentation",
      dashboard: "Go To Dashboard",
      get_key: "Get API Key",
      medicine: "Medicine",
    },
    hero: {
      tracking_badge: "Now tracking 25,132+ Medicines in Bangladesh",
      title_main: "The most powerful",
      title_sub: "Medicine Data API",
      description: "Access real-time pharmaceutical data, generic information, and dosages with our lightning-fast API. Built for pharmacies, healthcare apps, and researchers.",
      btn_explore: "Explore Database",
      btn_docs: "Read Documentation",
    },
    stats: {
      medicines: "Medicines",
      uptime: "Uptime",
      latency: "Latency",
      free_devs: "For Developers",
    },
    features: {
      section_title: "Built for scale.",
      section_subtitle: "Everything you need to build next-gen healthcare apps.",
      f1_title: "Lightning Fast",
      f1_desc: "Our edge-cached API ensures responses under 100ms globally, keeping your app snappy.",
      f2_title: "Verified Data",
      f2_desc: "Directly scraped and verified from official pharmaceutical records in Bangladesh.",
      f3_title: "Secure Access",
      f3_desc: "Robust API key management and encrypted endpoints for your production needs.",
    }
  },
  bn: {
    nav: {
      features: "ফিচারসমূহ",
      docs: "ডকুমেন্টেশন",
      dashboard: "ড্যাশবোর্ডে যান",
      get_key: "API কী নিন",
      medicine: "মেডিসিন",
    },
    hero: {
      tracking_badge: "বর্তমানে বাংলাদেশের ২৫,১৩২+ মেডিসিন ট্র্যাক করা হচ্ছে",
      title_main: "সবচেয়ে শক্তিশালী",
      title_sub: "মেডিসিন ডাটা API",
      description: "আমাদের দ্রুতগতির API-এর মাধ্যমে রিয়েল-টাইম ফার্মাসিউটিক্যাল ডাটা, জেনেরিক তথ্য এবং ডোজ অ্যাক্সেস করুন। ফার্মেসি, হেলথকেয়ার অ্যাপ এবং গবেষকদের জন্য তৈরি।",
      btn_explore: "ডাটাবেজ এক্সপ্লোর করুন",
      btn_docs: "ডকুমেন্টেশন পড়ুন",
    },
    stats: {
      medicines: "মেডিসিন রেকর্ড",
      uptime: "আপটাইম",
      latency: "ল্যাটেন্সি",
      free_devs: "ডেভেলপারদের জন্য ফ্রি",
    },
    features: {
      section_title: "স্কেলিংয়ের জন্য তৈরি।",
      section_subtitle: "পরবর্তী প্রজন্মের হেলথকেয়ার অ্যাপ তৈরি করার জন্য যা কিছু প্রয়োজন।",
      f1_title: "বিদ্যুৎ গতি",
      f1_desc: "আমাদের এজ-ক্যাশড API বিশ্বব্যাপী ১০০ms-এর নিচে রেসপন্স নিশ্চিত করে আপনার অ্যাপকে রাখে সুপারফাস্ট।",
      f2_title: "যাচাইকৃত ডাটা",
      f2_desc: "বাংলাদেশের অফিশিয়াল ফার্মাসিউটিক্যাল রেকর্ড থেকে সরাসরি স্ক্র্যাপ এবং যাচাইকৃত।",
      f3_title: "সুরক্ষিত অ্যাক্সেস",
      f3_desc: "আপনার প্রোডাকশন অ্যাপ্লিকেশনের জন্য শক্তিশালী API কী ম্যানেজমেন্ট এবং এনক্রিপ্ট করা এন্ডপয়েন্ট।",
    }
    
  }
};

export type Language = 'en' | 'bn';
export type DictionaryType = typeof dictionaries.en;