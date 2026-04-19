/**
 * Trang tổng quan dành cho khách hàng (Customer Portal)
 * Chức năng: Hiển thị số lượng đơn hàng đang vận chuyển và tổng lượng CO2 đã tiết kiệm.
 * Tuân thủ Design System (design.md): Green Tech, Inter Font, Rounded-lg.
 */
import React from 'react';

export default function CustomerDashboardPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1440px] mx-auto min-h-[calc(100vh-4rem)] bg-[#F0FDF4]">
      <h1 className="text-[28px] font-bold mb-8 text-emerald-900">Tổng quan Khách hàng</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card hiển thị đơn hàng đang hoạt động */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <h2 className="text-[20px] font-semibold text-emerald-900 mb-2">Đơn hàng đang vận chuyển</h2>
          <p className="text-4xl font-bold text-slate-700">12</p>
          <p className="text-[12px] text-slate-500 mt-2 font-medium">Cập nhật lúc: {new Date().toLocaleDateString('vi-VN')}</p>
        </div>

        {/* Card hiển thị tác động môi trường (Green Tech) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-emerald-200 ring-1 ring-emerald-50 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-100 rounded-full opacity-50 blur-2xl"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <h2 className="text-[20px] font-semibold text-emerald-900">Tác động Môi trường</h2>
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-xl" aria-hidden="true">🌱</span>
            </div>
          </div>
          <p className="text-4xl font-bold text-emerald-500 mt-3 relative z-10">1,250 <span className="text-lg font-semibold text-emerald-600">kg</span></p>
          
          <div className="mt-4 inline-flex items-center px-2.5 py-1 bg-green-100 text-emerald-800 rounded-full text-[12px] font-semibold relative z-10">
            Eco Route Active
          </div>
          <p className="text-[14px] text-slate-600 mt-3 relative z-10 leading-relaxed">
            Lượng CO₂ bạn đã tiết kiệm được nhờ sử dụng giải pháp vận chuyển tuyến đường xanh của Green Tech.
          </p>
        </div>
      </div>
    </div>
  );
}
