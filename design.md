# Smart Logistics System - Design System & UI Guidelines

## 1. Global Theme (Phong cách chung)

- **Vibe:** Modern, Clean, Data-focused, Eco-friendly (Green Tech). Giao diện cần tạo cảm giác minh bạch, giảm thiểu khí thải và tối ưu hóa luồng công việc.

- **Mode:** Light Mode (Ưu tiên cho việc đọc dữ liệu bảng biểu vào ban ngày). Có thể scale lên Dark Mode cho môi trường Control Center.

- **Border Radius Strategy:** `rounded-lg` (8px) cho các card và button. Không quá tròn để giữ vẻ nghiêm túc của ngành logistics, nhưng đủ mềm mại để trông hiện đại.

## 2. Color Palette (Bảng màu Green Tech)

_Hệ màu tập trung hoàn toàn vào các sắc thái của màu xanh lá, từ đậm đến nhạt, tạo cảm giác thân thiện với môi trường nhưng vẫn đậm chất công nghệ._

- **Primary Color:** `#10B981` (Emerald Tech Green - Màu xanh chủ đạo cho các nút bấm chính, thanh tiến trình, biểu đồ).

- **Secondary / Deep Accent:** `#064E3B` (Deep Forest Green - Xanh rêu rất đậm. Dùng thay cho màu đen/xám ở Sidebar hoặc Topbar để cả hệ thống vẫn giữ được nhịp "Green" mà không bị chói).

- **Background Color:**
  - Main BG: `#F0FDF4` (Green Mint cực nhạt - Nền tổng thể mang sắc xanh thoang thoảng, dịu mắt hơn màu xám/trắng thông thường).

  - Surface/Card BG: `#FFFFFF` (Trắng tinh - Dùng cho các thẻ Card chứa dữ liệu để tạo độ tương phản cao nhất).

- **Text Color:**
  - Heading: `#064E3B` (Xanh rêu đậm - Thay vì dùng chữ đen, chữ xanh đậm sẽ tone-sur-tone với hệ thống).

  - Body Text: `#334155` (Xám tro - Giữ màu xám cho chữ thường để đảm bảo tính dễ đọc (Readability) - yếu tố sống còn của UI).

- **Semantic Colors:**
  - Eco/Success: `#22C55E` (Xanh lá sáng - Dùng cho các tag "Tiết kiệm CO2", "Giao hàng xanh").

  - Warning/Delay: `#EAB308` (Vàng năng lượng mặt trời - Phù hợp với theme tự nhiên).

  - Error: `#EF4444` (Đỏ cảnh báo).

## 3. Typography (Nghệ thuật chữ)

_Cần một font chữ rõ ràng, dễ đọc số liệu và có các nét cắt dứt khoát._

- **Font Family:** `Inter` (Font quốc dân cho UI/Dashboard vì các con số hiển thị rất đẹp và thẳng hàng).

- **Heading Scale:** - H1 (Tên trang/Dashboard title): `28px`, Font-weight: `Bold`
  - H2 (Tiêu đề Card/Section): `20px`, Font-weight: `Semi-bold`

  - H3 (Tiêu đề nhỏ): `16px`, Font-weight: `Semi-bold`

- **Body Text:** `14px` (Kích thước chuẩn cho Dashboard), Font-weight: `Regular`, Line-height: `1.5`.

- **Small Text (Label/Data hint):** `12px`, Font-weight: `Medium`.

## 4. Spacing & Layout (Khoảng cách & Bố cục)

- **Container max-width:** `1440px` (Tối ưu cho màn hình Desktop hiển thị nhiều bảng biểu).

- **Layout Structure:** Sidebar cố định bên trái (260px), Topbar điều hướng, và Main Content Area.

- **Section Padding:** `24px` hoặc `32px` xung quanh Main Content.

- **Component Spacing:** `16px` (Khoảng cách giữa các row trong bảng hoặc các input form).

- **Grid System:** `12 columns`, Gap `24px`.

## 5. UI Components Rules (Luật cho các thành phần cốt lõi)

- **Buttons:**
  - Primary: Nền `#10B981`, chữ trắng `#FFFFFF`, padding `10px 20px`, hover: chuyển sang `#059669` (Xanh đậm hơn).

  - Outline: Viền 1px `#E2E8F0`, nền `#FFFFFF`, chữ `#475569`, hover: nền `#F1F5F9`.

- **Inputs & Forms:**
  - Chiều cao chuẩn: `40px` (Gọn gàng cho form nhập liệu nhiều trường).

  - Border: 1px solid `#CBD5E1`. Focus: Viền đổi sang `#10B981` và có ring shadow mỏng.

- **Cards (Chứa biểu đồ/Dữ liệu):**
  - Nền `#FFFFFF`, padding `24px`, Border 1px `#E2E8F0`, Shadow mỏng: `0 1px 3px rgba(0,0,0,0.1)`.

- **Badges/Tags (Trạng thái đơn hàng/CO2 emission):**
  - Padding `4px 8px`, Font size `12px`, Bo tròn `rounded-full`. (Ví dụ: "Eco Route": Nền xanh nhạt `#D1FAE5`, chữ xanh đậm `#065F46`).

## 6. Iconography & Imagery (Hình ảnh & Icon)

- **Icon Style:** Line icons, độ dày 1.5px hoặc 2px. Đơn giản, không rườm rà (gợi ý dùng bộ icon Lucide hoặc Heroicons). Trọng tâm vào các icon: xe tải, bản đồ, lá cây (chỉ số CO2), biểu đồ dữ liệu.

- **Imagery:** CO2 Hạn chế dùng ảnh thật. Tập trung vào Data Visualization (Biểu đồ cột, Line chart, Donut chart thể hiện lượng CO2 tiết kiệm được).
