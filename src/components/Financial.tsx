import React, { useState } from 'react';

export default function Financial() {
  const [mode, setMode] = useState<'loan' | 'savings'>('loan');

  // Loan State
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [months, setMonths] = useState('');

  // Savings State
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [contribution, setContribution] = useState('');

  const calculateEMI = () => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const n = parseInt(months) || 0;

    if (p === 0 || n === 0) return { emi: 0, totalPayment: 0, totalInterest: 0 };

    if (r === 0) {
      return { emi: p / n, totalPayment: p, totalInterest: 0 };
    }

    const monthlyRate = r / 12 / 100;
    const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    return { emi, totalPayment, totalInterest };
  };

  const calculateSavings = () => {
    const t = parseFloat(target) || 0;
    const c = parseFloat(current) || 0;
    const m = parseFloat(contribution) || 0;

    if (t <= c) return { monthsNeeded: 0, achievable: true };
    if (m <= 0) return { monthsNeeded: 0, achievable: false };

    const remaining = t - c;
    const monthsNeeded = Math.ceil(remaining / m);

    return { monthsNeeded, achievable: true };
  };

  const { emi, totalPayment, totalInterest } = calculateEMI();
  const { monthsNeeded, achievable } = calculateSavings();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="flex p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setMode('loan')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'loan' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          EMI / Loan
        </button>
        <button
          onClick={() => setMode('savings')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'savings' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Savings Goal
        </button>
      </div>

      {mode === 'loan' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Principal Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="0"
                    min="0"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Time (Months)</label>
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-gray-600 font-medium">Monthly EMI</span>
              <span className="text-3xl font-semibold text-blue-600">${emi.toFixed(2)}</span>
            </div>
            <div className="h-px bg-gray-100 w-full"></div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Total Interest</span>
              <span className="font-medium text-gray-800">${totalInterest.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Total Payment</span>
              <span className="font-medium text-gray-800">${totalPayment.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Target Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Current Savings</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Contribution</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md space-y-4 text-center">
            {!achievable && parseFloat(target) > parseFloat(current) ? (
              <div className="text-blue-100">Please enter a monthly contribution to calculate.</div>
            ) : monthsNeeded === 0 && parseFloat(target) > 0 ? (
              <div className="text-xl font-medium">Goal Reached! 🎉</div>
            ) : (
              <>
                <div className="text-blue-100 text-sm mb-1">Time to reach goal</div>
                <div className="flex justify-center items-baseline gap-2">
                  <span className="text-4xl font-semibold">{monthsNeeded}</span>
                  <span className="text-blue-200">months</span>
                </div>
                {monthsNeeded > 12 && (
                  <div className="text-sm text-blue-200 mt-2">
                    (approx. {(monthsNeeded / 12).toFixed(1)} years)
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
