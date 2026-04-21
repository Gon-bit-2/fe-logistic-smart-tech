/**
 * Trang Cài đặt Tài khoản (Settings) của Khách hàng
 * Tuân thủ Design System: bg-[#F0FDF4], typography Inter, border-slate-200.
 */
import React from 'react';
import Link from "next/link";
import { Bell, ShieldCheck } from "lucide-react";

export default function CustomerSettingsPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1440px] mx-auto min-h-[calc(100vh-4rem)] bg-[#F0FDF4]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[28px] font-bold mb-6 text-emerald-900">Cài đặt Tài khoản</h1>
        
        <div className="space-y-6">
          {/* Form Thông tin cá nhân */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-[20px] font-semibold text-emerald-900 mb-6">Thông tin Cá nhân</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fullName" className="block text-[14px] font-medium text-slate-700 mb-2">Họ và Tên / Tên Doanh nghiệp</label>
                <input id="fullName" type="text" className="w-full px-4 h-[40px] border border-slate-300 rounded-lg text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" defaultValue="Công ty Logistics Xanh" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-[14px] font-medium text-slate-700 mb-2">Số Điện thoại liên hệ</label>
                <input id="phone" type="tel" className="w-full px-4 h-[40px] border border-slate-300 rounded-lg text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow" defaultValue="0901234567" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-[14px] font-medium text-slate-700 mb-2">Email</label>
                <input id="email" type="email" className="w-full px-4 h-[40px] border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-[14px] cursor-not-allowed" defaultValue="contact@logisticsxanh.vn" disabled />
                <p className="text-[12px] font-medium text-slate-500 mt-2">Email dùng để đăng nhập không thể thay đổi trực tiếp.</p>
              </div>
            </form>
            <div className="mt-8 border-t border-slate-100 pt-6 flex justify-end">
              <button className="px-5 py-2.5 bg-emerald-500 text-white text-[14px] font-semibold rounded-lg hover:bg-emerald-600 transition-colors">
                Lưu thay đổi
              </button>
            </div>
          </section>

          {/* Quản lý danh bạ địa chỉ */}
          <section className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-[20px] font-semibold text-emerald-900">Danh bạ Địa chỉ (Address Book)</h2>
                <p className="text-[14px] text-slate-600 mt-1">Quản lý các địa chỉ lấy/nhận hàng thường xuyên để tạo đơn nhanh.</p>
              </div>
              <button className="px-5 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 text-[14px] font-semibold transition-colors">
                + Thêm địa chỉ mới
              </button>
            </div>
            
            <ul className="space-y-4">
              {/* Địa chỉ mẫu 1 */}
              <li className="p-4 border border-slate-200 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-300 hover:shadow-sm transition-all bg-[#F0FDF4]/30">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-semibold text-emerald-900 text-[16px]">Kho Chính - Hồ Chí Minh</p>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[12px] font-bold uppercase rounded-full">Mặc định</span>
                  </div>
                  <p className="text-[14px] text-slate-700">Người liên hệ: Anh Tuấn (0911223344)</p>
                  <p className="text-[14px] text-slate-500 mt-1">123 Nguyễn Văn Linh, Phường Tân Thuận Tây, Quận 7, TP.HCM</p>
                </div>
                <div className="flex gap-4">
                  <button className="text-emerald-600 text-[14px] font-semibold hover:underline">Sửa</button>
                  <button className="text-red-500 text-[14px] font-semibold hover:underline">Xóa</button>
                </div>
              </li>
            </ul>
          </section>

          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Bell className="size-5" />
                </div>
                <div>
                  <h2 className="text-[20px] font-semibold text-emerald-900">Notifications</h2>
                  <p className="text-[14px] text-slate-600 mt-1">Mở inbox để xem cập nhật phê duyệt và thông báo vận hành.</p>
                </div>
              </div>
              <Link
                href="/dashboard/customer/notifications"
                className="mt-5 inline-flex rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
              >
                Mở inbox
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h2 className="text-[20px] font-semibold text-emerald-900">Role Requests</h2>
                  <p className="text-[14px] text-slate-600 mt-1">Quản lý yêu cầu trở thành tài xế hoặc nhân viên kho.</p>
                </div>
              </div>
              <Link
                href="/dashboard/customer/roles"
                className="mt-5 inline-flex rounded-lg border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-700"
              >
                Mở role center
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
