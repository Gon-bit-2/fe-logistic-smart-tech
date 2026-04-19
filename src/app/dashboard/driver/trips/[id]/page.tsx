/**
 * Trang Chi tiết Chuyến đi dành cho Tài xế (Driver Trip Detail & POD)
 * Tuân thủ Design System (design.md).
 */
import React from 'react';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DriverTripDetailPage({ params }: Props) {
  // Giải nén Promise params cho Next.js 15
  const { id } = await params;

  return (
    <div className="p-4 md:p-6 max-w-md mx-auto bg-[#F0FDF4] min-h-screen">
      {/* Header Chuyến đi */}
      <div className="mb-8 pt-2">
        <Link href="/dashboard/driver" className="text-emerald-600 text-[14px] font-semibold mb-4 inline-flex items-center hover:text-emerald-700 hover:underline">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Quay lại danh sách
        </Link>
        <h1 className="text-[28px] font-bold text-emerald-900 tracking-tight leading-tight">Chuyến xe: {id}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-md text-[12px] font-bold shadow-sm">51C-123.45</span>
          <span className="text-slate-500 text-[14px] font-medium">• 3 điểm dừng</span>
        </div>
      </div>

      {/* Danh sách các Điểm dừng (Stops) */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-200 before:via-slate-200 before:to-transparent">
        
        {/* Điểm dừng 1: Lấy hàng (Đã hoàn thành) */}
        <div className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#F0FDF4] bg-emerald-500 text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mt-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl shadow-sm border border-slate-200 opacity-75">
            <div className="mb-3">
              <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded mb-2">Điểm Lấy Hàng</span>
              <h3 className="font-semibold text-emerald-900 text-[16px]">Kho Trung Tâm A</h3>
              <p className="text-[14px] text-slate-500 mt-1">KCN Tân Bình, Tân Phú, TP.HCM</p>
            </div>
            <div className="w-full py-2 bg-slate-50 border border-slate-100 text-slate-500 rounded-lg text-[14px] font-medium text-center">
              Đã hoàn thành lúc 08:30
            </div>
          </div>
        </div>

        {/* Điểm dừng 2: Giao hàng (Đang thực hiện) */}
        <div className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#F0FDF4] bg-emerald-600 text-white font-bold text-[14px] shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mt-1 ring-4 ring-emerald-100 animate-pulse">
            2
          </div>
          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl shadow-md border-2 border-emerald-500">
            <div className="mb-4">
              <span className="inline-block px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-wider rounded mb-2 border border-yellow-200">Điểm Giao Hàng</span>
              <h3 className="font-semibold text-emerald-900 text-[18px]">Cửa hàng B</h3>
              <p className="text-[14px] text-slate-600 mt-1 mb-3 leading-relaxed">123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM</p>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-[12px] text-slate-500 font-medium">Mã đơn</span>
                <span className="text-[14px] font-mono text-emerald-900 font-bold">ORD-2026-001</span>
              </div>
            </div>
            
            {/* Khu vực Upload Bằng chứng giao hàng (POD) */}
            <div className="border-t border-slate-100 pt-5">
              <p className="text-[14px] font-semibold text-emerald-900 mb-3">Bằng chứng giao hàng (POD)</p>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-emerald-200 rounded-xl text-emerald-700 hover:bg-emerald-50 transition-colors bg-[#F0FDF4]">
                  <svg className="w-6 h-6 mb-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span className="text-[12px] font-semibold">Chụp ảnh</span>
                </button>
                <button className="flex flex-col items-center justify-center py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors bg-white">
                  <svg className="w-6 h-6 mb-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <span className="text-[12px] font-semibold">Chữ ký</span>
                </button>
              </div>
              <button className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-[16px] shadow-sm transition-all active:scale-[0.98]">
                Xác nhận Đã giao
              </button>
            </div>
          </div>
        </div>

        {/* Điểm dừng 3: Giao hàng (Chưa đến) */}
        <div className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group">
          <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-[#F0FDF4] bg-slate-200 text-slate-500 font-bold text-[14px] shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 mt-1">
            3
          </div>
          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-xl shadow-sm border border-slate-200 opacity-60">
            <div>
              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded mb-2 border border-slate-200">Điểm Giao Hàng</span>
              <h3 className="font-semibold text-slate-700 text-[16px]">Đại lý C</h3>
              <p className="text-[14px] text-slate-500 mt-1">456 Nguyễn Huệ, Quận 1, TP.HCM</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
