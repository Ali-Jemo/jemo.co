"use client";

import React, { useState } from 'react';
import { CalendarClock, CheckCircle2, Clock, Wallet } from 'lucide-react';

type FilterGroup = 'الكل' | 'متقاعدين ورعاية' | 'وزارات مدنية' | 'أمنية وعسكرية';
type Status = 'paid' | 'funding' | 'scheduled';

interface Payday {
  id: string;
  name: string;
  date: string;
  status: Status;
  statusText: string;
  group: FilterGroup;
}

const PAYDAYS: Payday[] = [
  { id: '1', name: 'المتقاعدين', date: 'تم الصرف', status: 'paid', statusText: 'تم الصرف ✓', group: 'متقاعدين ورعاية' },
  { id: '2', name: 'الرعاية الاجتماعية', date: 'تم الصرف', status: 'paid', statusText: 'تم الصرف ✓', group: 'متقاعدين ورعاية' },
  { id: '3', name: 'وزارة التربية والتعليم', date: 'خلال 48 ساعة', status: 'funding', statusText: 'قيد التمويل', group: 'وزارات مدنية' },
  { id: '4', name: 'وزارة الصحة والبيئة', date: '15 آذار', status: 'scheduled', statusText: 'مجدول', group: 'وزارات مدنية' },
  { id: '5', name: 'وزارة الداخلية والدفاع', date: '18 آذار', status: 'scheduled', statusText: 'مجدول', group: 'أمنية وعسكرية' },
  { id: '6', name: 'وزارة التعليم العالي', date: '20 آذار', status: 'scheduled', statusText: 'مجدول', group: 'وزارات مدنية' },
];

const FILTERS: FilterGroup[] = ['الكل', 'متقاعدين ورعاية', 'وزارات مدنية', 'أمنية وعسكرية'];

export default function PaydayTracker() {
  const [activeFilter, setActiveFilter] = useState<FilterGroup>('الكل');

  const filteredPaydays = PAYDAYS.filter(
    (payday) => activeFilter === 'الكل' || payday.group === activeFilter
  );

  return (
    <div dir="rtl" className="w-full max-w-2xl mx-auto bg-white border border-[#e4e3e3] shadow-xs rounded-xl overflow-hidden font-sans text-[#222f30]">
      {/* Header */}
      <div className="bg-[#f7f7f5] p-5 border-b border-[#e4e3e3]">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white p-2 rounded-lg border border-[#e4e3e3] shadow-xs">
            <Wallet className="w-6 h-6 text-[#222f30]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#222f30]">جدول مواعيد صرف الرواتب</h2>
            <p className="text-sm text-[#55696a]">آذار 2026 - تحديث تلقائي</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-[#e4e3e3] overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                activeFilter === filter
                  ? 'bg-[#222f30] text-white border-[#222f30]'
                  : 'bg-[#f7f7f5] text-[#55696a] border-[#e4e3e3] hover:bg-[#e4e3e3]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="p-4 divide-y divide-[#e4e3e3]">
        {filteredPaydays.map((payday) => (
          <div key={payday.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full flex-shrink-0 ${
                payday.status === 'paid' ? 'bg-[#cef79e]/20 text-[#222f30]' : 
                payday.status === 'funding' ? 'bg-amber-100 text-amber-800' : 
                'bg-slate-100 text-slate-600'
              }`}>
                {payday.status === 'paid' ? <CheckCircle2 className="w-5 h-5" /> : 
                 payday.status === 'funding' ? <Clock className="w-5 h-5" /> :
                 <CalendarClock className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-semibold text-[#222f30]">{payday.name}</h3>
                <p className="text-sm text-[#55696a] mt-0.5">
                  {payday.status === 'paid' ? 'تم تحويل المبالغ' : `موعد الصرف: ${payday.date}`}
                </p>
              </div>
            </div>
            
            <div className={`px-3 py-1 text-xs font-semibold rounded-full border flex-shrink-0 ${
              payday.status === 'paid' ? 'bg-[#cef79e] text-[#222f30] border-[#a7e26e]' : 
              payday.status === 'funding' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
              'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              {payday.statusText}
            </div>
          </div>
        ))}
        {filteredPaydays.length === 0 && (
          <div className="py-8 text-center text-[#55696a]">
            لا توجد بيانات لهذه الفئة حالياً.
          </div>
        )}
      </div>
    </div>
  );
}
