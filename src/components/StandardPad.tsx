import React, { useState } from 'react';
import { Delete } from 'lucide-react';

export default function StandardPad() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setIsNewNumber(true);
  };

  const calculate = () => {
    try {
      // Using Function instead of eval for slightly better safety
      const result = new Function('return ' + equation + display)();
      if (!isFinite(result)) {
        setDisplay('Error');
      } else {
        // Format to avoid long decimals
        setDisplay(String(Math.round(result * 100000000) / 100000000));
      }
      setEquation('');
      setIsNewNumber(true);
    } catch (e) {
      setDisplay('Error');
      setEquation('');
      setIsNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
    if (isNewNumber) return;
    if (display.length === 1) {
      setDisplay('0');
      setIsNewNumber(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleDecimal = () => {
    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    { label: 'C', onClick: handleClear, className: 'bg-red-50 text-red-600 hover:bg-red-100' },
    { label: '÷', onClick: () => handleOperator('/'), className: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { label: '×', onClick: () => handleOperator('*'), className: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { label: <Delete size={20} />, onClick: handleBackspace, className: 'bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center' },
    { label: '7', onClick: () => handleNumber('7') },
    { label: '8', onClick: () => handleNumber('8') },
    { label: '9', onClick: () => handleNumber('9') },
    { label: '−', onClick: () => handleOperator('-'), className: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { label: '4', onClick: () => handleNumber('4') },
    { label: '5', onClick: () => handleNumber('5') },
    { label: '6', onClick: () => handleNumber('6') },
    { label: '+', onClick: () => handleOperator('+'), className: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { label: '1', onClick: () => handleNumber('1') },
    { label: '2', onClick: () => handleNumber('2') },
    { label: '3', onClick: () => handleNumber('3') },
    { label: '=', onClick: calculate, className: 'bg-blue-600 text-white hover:bg-blue-700 row-span-2' },
    { label: '0', onClick: () => handleNumber('0'), className: 'col-span-2' },
    { label: '.', onClick: handleDecimal },
  ];

  return (
    <div className="flex flex-col h-full max-w-sm mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex-1 flex flex-col justify-end items-end min-h-[120px]">
        <div className="text-gray-400 text-sm h-5 mb-1 tracking-wider">{equation}</div>
        <div className="text-5xl font-light text-gray-800 tracking-tight overflow-hidden text-ellipsis w-full text-right" style={{ wordBreak: 'break-all' }}>
          {display}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={btn.onClick}
            className={`h-16 rounded-2xl text-xl font-medium transition-all active:scale-95 ${
              btn.className || 'bg-white text-gray-800 shadow-sm border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
