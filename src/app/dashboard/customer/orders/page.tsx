/**
 * Trang quản lý Lịch sử Đơn hàng của Khách hàng
 * Chức năng: Hiển thị danh sách toàn bộ các đơn hàng đã đặt, bộ lọc theo thời gian, 
 * và cung cấp nút bấm xem hóa đơn/chứng từ giao hàng của từng đơn.
 * Áp dụng Design System từ .stitch/design.md
 */
'use client';

import React, { useState } from 'react';
import { useListOrders } from '@/features/orders/application/use-cases/use-list-orders';
import type { OrderStatus } from '@/features/orders/domain/types/order.types';

export default function CustomerOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');

  // Call API theo chuẩn cấu trúc (React Query + UseCase)
  const { data, isLoading, isError, error } = useListOrders({
    search: searchTerm || undefined,
    status: statusFilter ? statusFilter : undefined,
  });

  return (
    <div className="p-6 md:p-8 max-w-[1440px] mx-auto min-h-[calc(100vh-4rem)] bg-[#F0FDF4]">
      <h1 className="text-[28px] font-bold mb-6 text-emerald-900">Lịch sử Đơn hàng</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        {/* Bộ lọc đơn hàng */}
        <div className="p-6 border-b border-slate-200 flex flex-wrap gap-4 justify-between items-center bg-white">
          <input 
            type="text" 
            placeholder="Tìm kiếm mã đơn hàng..." 
            className="px-4 h-[40px] border border-slate-300 rounded-lg w-full md:w-64 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="px-4 h-[40px] border border-slate-300 rounded-lg text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Đang chờ</option>
            <option value="IN_TRANSIT">Đang vận chuyển</option>
            <option value="DELIVERED">Đã giao</option>
          </select>
        </div>
        
        {/* Bảng danh sách đơn hàng */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[#F0FDF4] border-b border-slate-200">
                <th className="p-4 text-[12px] font-medium text-emerald-900 uppercase tracking-wider">Mã Đơn</th>
                <th className="p-4 text-[12px] font-medium text-emerald-900 uppercase tracking-wider">Ngày Tạo</th>
                <th className="p-4 text-[12px] font-medium text-emerald-900 uppercase tracking-wider">Trạng Thái</th>
                <th className="p-4 text-[12px] font-medium text-emerald-900 uppercase tracking-wider">Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">Đang tải dữ liệu...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-red-500">
                    Lỗi tải dữ liệu: {error instanceof Error ? error.message : "Vui lòng kiểm tra lại cấu hình API."}
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">Không tìm thấy đơn hàng nào.</td>
                </tr>
              ) : (
                data?.data?.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-[14px] font-medium text-emerald-700">{order.reference || order.id}</td>
                    <td className="p-4 text-[14px] text-slate-700">
                      {order.estimatedArrival ? new Date(order.estimatedArrival).toLocaleDateString('vi-VN') : 'N/A'}
                    </td>
                    <td className="p-4 text-[14px]">
                      <span className={`px-2.5 py-1 rounded-full text-[12px] font-semibold ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-emerald-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-[14px]">
                      <button className="text-emerald-600 font-medium hover:text-emerald-800 hover:underline">Chi tiết</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
