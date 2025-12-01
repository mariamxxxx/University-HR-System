import React from 'react';

interface LeaveBalanceCardProps {
  annual_balance: number;
  accidental_balance: number;
}

export function LeaveBalanceCard({ annual_balance, accidental_balance }: LeaveBalanceCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-gray-900 mb-4">Leave Balance</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Annual Leave</p>
          <p className="text-3xl text-green-700">{annual_balance}</p>
          <p className="text-xs text-gray-500 mt-1">days remaining</p>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
          <p className="text-sm text-gray-600 mb-1">Accidental Leave</p>
          <p className="text-3xl text-yellow-700">{accidental_balance}</p>
          <p className="text-xs text-gray-500 mt-1">days remaining</p>
        </div>
      </div>
    </div>
  );
}
