import React from 'react';
import { TrendingUp, Equal, AlertTriangle, Info } from 'lucide-react';
import type { ComparisonResult } from '../types';

interface ComparisonSummaryProps {
  result: ComparisonResult;
}

export const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({ result }) => {
  const { lighterPerson, percentageDifference, canCalculatePercentage, explanation, personA, personB } = result;

  const isEqual = lighterPerson === 'equal';

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50 rounded-2xl border border-indigo-100 p-6 sm:p-8">
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          isEqual
            ? 'bg-green-100'
            : canCalculatePercentage
              ? 'bg-indigo-100'
              : 'bg-amber-100'
        }`}>
          {isEqual ? (
            <Equal className="w-7 h-7 text-green-600" />
          ) : canCalculatePercentage ? (
            <TrendingUp className="w-7 h-7 text-indigo-600" />
          ) : (
            <AlertTriangle className="w-7 h-7 text-amber-600" />
          )}
        </div>
      </div>

      {/* Main percentage */}
      {canCalculatePercentage && !isEqual && (
        <div className="text-center mb-4">
          <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            {percentageDifference.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-500 mt-1">relative measured lightness difference</p>
        </div>
      )}

      {isEqual && (
        <div className="text-center mb-4">
          <div className="text-4xl sm:text-5xl font-bold text-green-600">0.0%</div>
          <p className="text-sm text-gray-500 mt-1">no measured lightness difference</p>
        </div>
      )}

      {/* Explanation */}
      <p className="text-center text-sm sm:text-base text-gray-700 font-medium mb-4">
        {explanation}
      </p>

      {/* L* values */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center bg-white rounded-xl p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Person A</div>
          <div className="text-lg font-bold text-indigo-600">L* {personA.medianLAB.L.toFixed(1)}</div>
        </div>
        <div className="text-center bg-white rounded-xl p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Person B</div>
          <div className="text-lg font-bold text-violet-600">L* {personB.medianLAB.L.toFixed(1)}</div>
        </div>
      </div>

      {/* Calculation explanation */}
      {canCalculatePercentage && !isEqual && (
        <div className="flex items-start gap-2 text-xs text-gray-500 bg-white/60 rounded-lg p-3">
          <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
          <span>
            Calculated as: (({Math.max(personA.medianLAB.L, personB.medianLAB.L).toFixed(1)} − {Math.min(personA.medianLAB.L, personB.medianLAB.L).toFixed(1)}) / {Math.min(personA.medianLAB.L, personB.medianLAB.L).toFixed(1)}) × 100 = {percentageDifference.toFixed(1)}%. This is a relative difference in measured L* values, not a percentage of fairness or beauty.
          </span>
        </div>
      )}
    </div>
  );
};
