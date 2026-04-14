import React, { useState } from 'react';

export default function ShoppingDining() {
  const [mode, setMode] = useState<'discount' | 'tip'>('discount');

  // Discount State
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  // Tip State
  const [bill, setBill] = useState('');
  const [tip, setTip] = useState('15');
  const [people, setPeople] = useState('1');

  const calculateDiscount = () => {
    const p = parseFloat(price) || 0;
    const d = parseFloat(discount) || 0;
    const saved = p * (d / 100);
    const final = p - saved;
    return { saved, final };
  };

  const calculateTip = () => {
    const b = parseFloat(bill) || 0;
    const t = parseFloat(tip) || 0;
    const p = parseInt(people) || 1;
    
    const tipAmount = b * (t / 100);
    const total = b + tipAmount;
    const perPerson = total / p;
    
    return { tipAmount, total, perPerson };
  };

  const { saved, final } = calculateDiscount();
  const { tipAmount, total, perPerson } = calculateTip();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setMode('discount')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'discount' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Discount
        </button>
        <button
          onClick={() => setMode('tip')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'tip' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Split & Tip
        </button>
      </div>

      {mode === 'discount' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Original Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Discount %</label>
              <div className="relative">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0"
                  min="0"
                  max="100"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-blue-100">Final Price</span>
              <span className="text-3xl font-semibold">${final.toFixed(2)}</span>
            </div>
            <div className="h-px bg-blue-500/50 w-full"></div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-100">Amount Saved</span>
              <span className="font-medium bg-blue-500/50 px-2 py-1 rounded-md">${saved.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Total Bill</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={bill}
                  onChange={(e) => setBill(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Tip %</label>
                <div className="relative">
                  <input
                    type="number"
                    value={tip}
                    onChange={(e) => setTip(e.target.value)}
                    className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="15"
                    min="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">People</label>
                <input
                  type="number"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>
            
            {/* Quick Tip Buttons */}
            <div className="flex gap-2 pt-2">
              {[10, 15, 18, 20].map((t) => (
                <button
                  key={t}
                  onClick={() => setTip(t.toString())}
                  className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                    tip === t.toString() 
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {t}%
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Tip Amount</span>
              <span className="font-medium text-gray-800">${tipAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Total with Tip</span>
              <span className="font-medium text-gray-800">${total.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-100 w-full"></div>
            <div className="flex justify-between items-end pt-2">
              <span className="text-gray-600 font-medium">Per Person</span>
              <span className="text-3xl font-semibold text-blue-600">${perPerson.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
