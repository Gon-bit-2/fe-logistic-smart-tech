export const inventoryScreenCopy = {
  activeInventoryLedger: "Sổ tồn kho đang hoạt động",
  centralHubDescription:
    "Xử lý chuỗi lạnh tự động cho hàng hoá nhạy cảm và dược phẩm trên toàn hành lang phía Bắc.",
  centralHubTitle: "Trung tâm phân phối A1",
  emptyDescription:
    "Hubs API chưa trả về hub nào để dựng khu vực kho nội bộ hoặc tài khoản hiện tại chưa có quyền xem dữ liệu hub.",
  emptyTitle: "Chưa có dữ liệu hub",
  filters: "Bộ lọc",
  headings: ["Mã hub", "Tên hub", "Địa chỉ", "Toạ độ", "Trạng thái"],
  hubSubtitle: "Giám sát thời gian thực cho mạng lưới logistics Precision.",
  hubTitle: "Trung tâm tồn kho",
  hubVehiclePending: "Chỉ số tồn kho chi tiết đang chờ endpoint inventory riêng.",
  integrationPendingDescription:
    "Các màn ledger, scan và cảnh báo tồn kho thấp sẽ được bật lại khi backend có endpoint inventory hoặc scan event thực tế.",
  integrationPendingTitle: "Dữ liệu tồn kho chi tiết đang chờ tích hợp",
  lowStockAlert: "Cảnh báo tồn kho thấp",
  lowStockDescription: "Lithium Cell Packs (Unit-82) đang xuống dưới ngưỡng cảnh báo.",
  loadingDescription:
    "Đang tải danh sách hub từ Hubs API để thay thế dữ liệu kho cứng trước đây.",
  loadingTitle: "Đang tải dữ liệu kho",
  manageFacility: "Quản lý cơ sở",
  metricPendingDispatch: "Chờ xuất kho",
  metricStorageCapacity: "Công suất lưu trữ",
  metricTotalStock: "Tổng tồn kho",
  recordsButton: "Xem toàn bộ hub",
  searchPlaceholder: "Tìm SKU...",
  solarEfficiency: "Hiệu suất lưới điện mặt trời",
  solarTitle: "Chỉ số bền vững",
  stockChips: ["Hubs API", "Realtime shell"],
  stockSupporting: "Tổng hợp theo dữ liệu hub đang khả dụng",
  used: "đã dùng",
} as const;

export const warehouseHubScreenCopy = {
  destinationHub: "Hub đích",
  flagged: "Bị đánh dấu",
  inbound: "Hàng vào (tiếp nhận)",
  itemType: "Loại hàng",
  logisticsMap: "Xem bản đồ logistics",
  nextFleetArrival: "Lượt xe tiếp theo đến",
  outbound: "Hàng ra (điều phối)",
  pageTitle: "Quản lý hub kho",
  processed: "Đã xử lý",
  readyForInput: "Sẵn sàng nhập liệu",
  route: "Tuyến",
  scanPlaceholder: "Quét mã theo dõi...",
  shiftEfficiency: "Hiệu suất ca làm việc: 94.2%",
  shiftText:
    "Hub của bạn đang vận hành ở công suất cao nhất. 450 kiện đã được quét trong 2 giờ gần nhất mà không phát sinh lỗi.",
  showing: "Hiển thị 4 / 128 lô hàng",
  status: "Trạng thái",
  submit: "Gửi",
  trackingId: "Mã theo dõi",
  weight: "Khối lượng",
  pendingDescription:
    "Workspace quét hub vẫn giữ layout sẵn sàng nhưng không còn dựng danh sách kiện hàng mô phỏng khi backend chưa cung cấp scan event thật.",
  pendingTitle: "Dữ liệu quét hub đang chờ tích hợp",
} as const;
