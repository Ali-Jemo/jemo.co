"use client";

import React, { useState } from 'react';
import { Phone, Copy, Check, Search, X, AlertCircle } from 'lucide-react';

type Hotline = {
  name: string;
  number: string;
};

const HOTLINES: Hotline[] = [
  { name: 'شرطة النجدة', number: '104' },
  { name: 'الإسعاف الفوري', number: '122' },
  { name: 'الدفاع المدني والإطفاء', number: '115' },
  { name: 'جهاز الأمن الوطني (خط الشكاوى)', number: '131' },
  { name: 'مكافحة الابتزاز الإلكتروني', number: '533' },
  { name: 'طوارئ الكهرباء والشبكة', number: '159' },
  { name: 'الرقابة التجارية وحماية المستهلك', number: '199' },
];

export default function EmergencyHotlines() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const filtered = HOTLINES.filter(h =>
    h.name.includes(search) || h.number.includes(search)
  );

  const handleCopy = async (num: string) => {
    try {
      await navigator.clipboard.writeText(num);
      setCopiedText(num);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e4e3e3] rounded-lg text-[#222f30] shadow-xs hover:bg-[#f7f7f5] transition-colors font-medium"
        dir="rtl"
      >
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span>أرقام الطوارئ</span>
      </button>

      {/* ponytail: skipped full Modal portal/ref setup, conditional rendering is enough */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#222f30]/20 backdrop-blur-sm" dir="rtl">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg border border-[#e4e3e3] overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="p-4 border-b border-[#e4e3e3] flex items-center justify-between bg-[#f7f7f5]">
              <h2 className="text-lg font-bold text-[#222f30] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                دليل الطوارئ والخدمات
              </h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-[#55696a] hover:text-[#222f30] transition-colors p-1"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-[#e4e3e3]">
              <div className="relative">
                <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-[#55696a]" />
                <input
                  type="text"
                  placeholder="ابحث عن خدمة أو رقم..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-[#e4e3e3] rounded-lg focus:outline-none focus:border-[#a7e26e] focus:ring-1 focus:ring-[#a7e26e] text-[#222f30]"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto p-4 space-y-3">
              {filtered.length === 0 ? (
                <div className="text-center text-[#55696a] py-8">لا توجد نتائج</div>
              ) : (
                filtered.map(hotline => (
                  <div key={hotline.number} className="flex items-center justify-between p-3 rounded-lg border border-[#e4e3e3] bg-[#f7f7f5]/50 hover:bg-white transition-colors">
                    <div>
                      <div className="font-semibold text-[#222f30]">{hotline.name}</div>
                      <div className="text-lg font-bold tracking-wider text-[#55696a] mt-1" dir="ltr">
                        {hotline.number}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0" dir="ltr">
                      <button
                        onClick={() => handleCopy(hotline.number)}
                        className="flex items-center justify-center p-2 text-[#55696a] hover:text-[#222f30] hover:bg-[#e4e3e3] rounded-md transition-colors"
                        title="نسخ الرقم"
                        aria-label="نسخ الرقم"
                      >
                        {copiedText === hotline.number ? (
                          <Check className="w-5 h-5 text-[#a7e26e]" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                      <a
                        href={`tel:${hotline.number}`}
                        className="flex items-center gap-2 px-3 py-2 bg-[#cef79e] hover:bg-[#a7e26e] text-[#222f30] rounded-md font-medium transition-colors"
                      >
                        <Phone className="w-4 h-4 fill-current" />
                        <span>اتصال</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
