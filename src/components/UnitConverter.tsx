import React, { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';

type Category = 'temperature' | 'weight' | 'length';

const categories = {
  temperature: {
    label: 'Temperature',
    units: [
      { id: 'c', label: 'Celsius (°C)' },
      { id: 'f', label: 'Fahrenheit (°F)' }
    ]
  },
  weight: {
    label: 'Weight',
    units: [
      { id: 'kg', label: 'Kilograms (kg)' },
      { id: 'lb', label: 'Pounds (lb)' }
    ]
  },
  length: {
    label: 'Length',
    units: [
      { id: 'km', label: 'Kilometers (km)' },
      { id: 'mi', label: 'Miles (mi)' },
      { id: 'cm', label: 'Centimeters (cm)' },
      { id: 'in', label: 'Inches (in)' }
    ]
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('temperature');
  const [fromUnit, setFromUnit] = useState(categories.temperature.units[0].id);
  const [toUnit, setToUnit] = useState(categories.temperature.units[1].id);
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');

  // Reset units when category changes
  useEffect(() => {
    const units = categories[category].units;
    setFromUnit(units[0].id);
    setToUnit(units[1].id);
    setFromValue('');
    setToValue('');
  }, [category]);

  const convert = (val: string, from: string, to: string): string => {
    if (!val || isNaN(parseFloat(val))) return '';
    const v = parseFloat(val);

    if (from === to) return val;

    let result = 0;

    // Temperature
    if (from === 'c' && to === 'f') result = (v * 9/5) + 32;
    if (from === 'f' && to === 'c') result = (v - 32) * 5/9;

    // Weight
    if (from === 'kg' && to === 'lb') result = v * 2.20462;
    if (from === 'lb' && to === 'kg') result = v / 2.20462;

    // Length (convert to base unit meters first, then to target)
    const lengthInMeters: Record<string, number> = {
      'km': 1000,
      'mi': 1609.34,
      'cm': 0.01,
      'in': 0.0254
    };

    if (lengthInMeters[from] && lengthInMeters[to]) {
      const meters = v * lengthInMeters[from];
      result = meters / lengthInMeters[to];
    }

    // Format to avoid long decimals
    return String(Math.round(result * 100000) / 100000);
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFromValue(val);
    setToValue(convert(val, fromUnit, toUnit));
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setToValue(val);
    setFromValue(convert(val, toUnit, fromUnit));
  };

  const handleFromUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setFromUnit(newUnit);
    setToValue(convert(fromValue, newUnit, toUnit));
  };

  const handleToUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setToUnit(newUnit);
    setToValue(convert(fromValue, fromUnit, newUnit));
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Category Selector */}
      <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto hide-scrollbar">
        {(Object.keys(categories) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              category === cat ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {categories[cat].label}
          </button>
        ))}
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        {/* From */}
        <div className="space-y-2">
          <select
            value={fromUnit}
            onChange={handleFromUnitChange}
            className="w-full p-2 bg-transparent text-sm font-medium text-gray-600 outline-none cursor-pointer"
          >
            {categories[category].units.map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
          <input
            type="number"
            value={fromValue}
            onChange={handleFromChange}
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-2xl"
            placeholder="0"
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            onClick={swapUnits}
            className="bg-blue-50 text-blue-600 p-2 rounded-full hover:bg-blue-100 transition-colors border-4 border-white"
          >
            <ArrowRightLeft size={20} className="rotate-90" />
          </button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <select
            value={toUnit}
            onChange={handleToUnitChange}
            className="w-full p-2 bg-transparent text-sm font-medium text-gray-600 outline-none cursor-pointer"
          >
            {categories[category].units.map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
          <input
            type="number"
            value={toValue}
            onChange={handleToChange}
            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-2xl"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
