/**
 * Trang Quản lý Kho (Warehouse Scanner Hub) dành cho nhân viên kho
 * Thiết kế cho Tablet/Mobile, nút lớn, font dễ nhìn. Tuân thủ Design System (design.md).
 */
'use client';
import React, { useState } from 'react';

export default function WarehouseScannerPage() {
  const [activeTab, setActiveTab] = useState<'inbound' | 'outbound'>('inbound');
  const [scannedCode, setScannedCode] = useState('');

  // Hàm xử lý giả lập submit mã quét
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedCode.trim()) return;
    
    // TODO: Gửi request lên server cập nhật trạng thái thông qua react-query mutation
    alert(`Đã ghi nhận ${activeTab === 'inbound' ? 'NHẬP KHO' : 'XUẤT KHO'} cho vận đơn: ${scannedCode}`);
    setScannedCode(''); // Reset sau khi xử lý
  };

  return (
    <div className="p-4 md:p-6 mx-auto min-h-[calc(100vh-4rem)] flex flex-col bg-[#F0FDF4]">
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
        <div className="text-center mb-6 pt-4">
          <h1 className="text-[28px] font-bold text-emerald-900">Trạm Quét Mã Kho</h1>
          <p className="text-[14px] text-slate-600 mt-1">Trung tâm phân phối miền Nam</p>
        </div>
        
        {/* Nút chuyển đổi (Tabs) giữa Nhập và Xuất kho */}
        <div className="flex bg-white p-1.5 rounded-xl mb-6 shadow-sm border border-slate-200">
          <button 
            className={`flex-1 py-3 text-center rounded-lg font-semibold text-[16px] transition-all ${
              activeTab === 'inbound' 
                ? 'bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('inbound')}
          >
            Nhập Kho (Inbound)
          </button>
          <button 
            className={`flex-1 py-3 text-center rounded-lg font-semibold text-[16px] transition-all ${
              activeTab === 'outbound' 
                ? 'bg-blue-50 text-blue-800 shadow-sm ring-1 ring-blue-200' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
            onClick={() => setActiveTab('outbound')}
          >
            Xuất Kho (Outbound)
          </button>
        </div>

        {/* Khu vực thao tác quét mã */}
        <div className="flex-1 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 shadow-sm">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-[#F0FDF4] rounded-2xl border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center mb-8 relative overflow-hidden">
            {/* Vạch quét giả lập */}
            <div className="absolute w-full h-0.5 bg-emerald-500 top-1/2 left-0 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"></div>
            <div className="w-16 h-16 border-4 border-emerald-100 rounded-lg flex items-center justify-center">
               <span className="text-4xl text-emerald-300 opacity-50" aria-hidden="true">📷</span>
            </div>
            <span className="text-[14px] text-emerald-800 mt-4 font-semibold">Hướng Camera Vào Mã</span>
          </div>
          
          <p className="text-slate-600 mb-6 text-center text-[14px] md:text-[16px] max-w-sm leading-relaxed">
            Hệ thống sẽ tự động nhận diện mã vạch vận đơn hoặc bạn có thể nhập thủ công bên dưới.
          </p>
          
          {/* Form nhập thủ công */}
          <form onSubmit={handleScanSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Nhập mã vận đơn (VD: ORD-123)..." 
              className="flex-1 px-4 h-[48px] border border-slate-300 rounded-lg text-[16px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
              value={scannedCode}
              onChange={(e) => setScannedCode(e.target.value)}
              autoFocus
            />
            <button 
              type="submit"
              className={`px-8 h-[48px] text-white rounded-lg font-bold text-[16px] shadow-sm transition-colors ${
                activeTab === 'inbound' 
                  ? 'bg-emerald-500 hover:bg-emerald-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              Xác nhận
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
