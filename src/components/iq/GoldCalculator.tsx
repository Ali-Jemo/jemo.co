"use client";

import React, { useState } from 'react';
import { Calculator, AlertTriangle, Coins } from 'lucide-react';

export default function GoldCalculator() {
  const [weightValue, setWeightValue] = useState<string>('1');
  const [weightMode, setWeightMode] = useState<'mithqal' | 'gram'>('mithqal');
  const [karat, setKarat] = useState<21 | 18>(21);
  const [workmanshipPerGram, setWorkmanshipPerGram] = useState<string>('10000');

  const weight = parseFloat(weightValue) || 0;
  const workmanship = parseFloat(workmanshipPerGram) || 0;

  // 1 Mithqal = 5 grams
  const grams = weightMode === 'mithqal' ? weight * 5 : weight;
  const mithqals = weightMode === 'gram' ? weight / 5 : weight;

  // Default raw prices per Mithqal
  const RAW_PRICE_21K_MITHQAL = 575000;
  const RAW_PRICE_18K_MITHQAL = 492000;

  const rawPricePerMithqal = karat === 21 ? RAW_PRICE_21K_MITHQAL : RAW_PRICE_18K_MITHQAL;
  const rawPricePerGram = rawPricePerMithqal / 5;

  const totalRawPrice = grams * rawPricePerGram;
  const totalWorkmanship = grams * workmanship;
  const totalPrice = totalRawPrice + totalWorkmanship;

  const formatIQD = (num: number) =>
    new Intl.NumberFormat('ar-IQ', { style: 'currency', currency: 'IQD', maximumFractionDigits: 0 }).format(num);

  return (
    <div className="bg-white border border-[#e4e3e3] shadow-xs rounded-xl p-6 text-[#222f30] w-full max-w-md mx-auto" dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
          <Coins className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">حاسبة الذهب والمثقال</h2>
      </div>

      <div className="space-y-5">
        {/* Karat Selection */}
        <div className="flex bg-[#f7f7f5] rounded-lg p-1">
          <button
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
              karat === 21 ? 'bg-white shadow-xs text-amber-600' : 'text-[#55696a]'
            }`}
            onClick={() => setKarat(21)}
          >
            عيار 21
          </button>
          <button
            className={`flex-1 py-2 rounded-md font-medium text-sm transition-colors ${
              karat === 18 ? 'bg-white shadow-xs text-amber-600' : 'text-[#55696a]'
            }`}
            onClick={() => setKarat(18)}
          >
            عيار 18
          </button>
        </div>

        {/* Weight Input */}
        <div>
          <label className="block text-sm font-medium text-[#55696a] mb-1">الوزن</label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              step="0.01"
              value={weightValue}
              onChange={(e) => setWeightValue(e.target.value)}
              className="flex-1 w-full bg-white border border-[#e4e3e3] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <select
              value={weightMode}
              onChange={(e) => setWeightMode(e.target.value as 'mithqal' | 'gram')}
              className="w-28 bg-[#f7f7f5] border border-[#e4e3e3] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            >
              <option value="mithqal">مثقال</option>
              <option value="gram">غرام</option>
            </select>
          </div>
          <div className="text-xs text-[#55696a] mt-1.5 flex justify-between">
            <span>يعادل: {weightMode === 'mithqal' ? `${grams.toFixed(2)} غرام` : `${mithqals.toFixed(2)} مثقال`}</span>
            <span>(المثقال = 5 غرام)</span>
          </div>
        </div>

        {/* Workmanship Input */}
        <div>
          <label className="block text-sm font-medium text-[#55696a] mb-1">أجور المصنعية (للغرام الواحد)</label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="1000"
              value={workmanshipPerGram}
              onChange={(e) => setWorkmanshipPerGram(e.target.value)}
              className="w-full bg-white border border-[#e4e3e3] rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 pr-12"
              dir="ltr"
            />
            <span className="absolute right-3 top-2.5 text-sm text-[#55696a]">د.ع</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-[#f7f7f5] rounded-xl p-4 space-y-3 mt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#55696a]">سعر الذهب الخام</span>
            <span className="font-medium">{formatIQD(totalRawPrice)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#55696a]">إجمالي المصنعية</span>
            <span className="font-medium">{formatIQD(totalWorkmanship)}</span>
          </div>
          <div className="h-px bg-[#e4e3e3] my-2"></div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span>السعر الكلي</span>
            <span className="text-amber-600">{formatIQD(totalPrice)}</span>
          </div>
        </div>

        {/* Anti-fraud Tip */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2.5 items-start mt-2">
          <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            تنبيه الصاغة: اطلب وصل شراء يوضح وزن الذهب وأجور المصنعية منفصلة.
          </p>
        </div>
      </div>
    </div>
  );
}
