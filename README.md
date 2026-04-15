This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

smart-logistics-frontend/
├── public/ # Chứa ảnh tĩnh, icon, font, 3d models (.gltf, .glb)
│
├── src/
│ ├── app/ # 🚀 LỚP ROUTING (Next.js App Router)
│ │ ├── (auth)/ # Route group: /login, /register
│ │ ├── (dashboard)/ # Route group: /admin, /driver (Dùng chung Layout Dashboard)
│ │ ├── tracking/ # Route: /tracking/[id]
│ │ ├── layout.tsx # Root layout (Chứa Providers)
│ │ └── page.tsx # Landing page (Gọi các component từ features/landing)
│ │
│ ├── components/ # 🧱 LỚP SHARED UI (Dùng chung toàn hệ thống)
│ │ ├── ui/ # Shadcn UI (button.tsx, badge.tsx, dialog.tsx...)
│ │ ├── layout/ # Global Layouts (Navbar.tsx, Footer.tsx, Sidebar.tsx)
│ │ └── 3d/ # Các component React Three Fiber dùng chung
│ │
│ ├── features/ # 🌟 TRÁI TIM CỦA CLEAN ARCHITECTURE (Chia theo Domain)
│ │ ├── landing/ # Chứa các section của trang chủ (HeroSection, StatBar...)
│ │ ├── auth/ # Domain Xác thực (Login Form, UseAuth hook)
│ │ ├── orders/ # Domain Đơn hàng
│ │ │ ├── api/ # Hàm gọi API: createOrder.ts, getOrderById.ts
│ │ │ ├── components/ # UI riêng: OrderForm.tsx, OrderTimeline.tsx
│ │ │ ├── hooks/ # Logic: useCreateOrder.ts (React Query)
│ │ │ ├── store/ # Local state: orderStore.ts
│ │ │ └── types/ # DTOs: order.dto.ts
│ │ ├── fleet/ # Domain Xe & Kho bãi (VehicleList, HubMap)
│ │ ├── tracking/ # Domain Theo dõi & POD
│ │ └── green-tech/ # Domain Thống kê CO2 (CO2Dashboard)
│ │
│ ├── lib/ # 🛠 LỚP INFRASTRUCTURE (Cấu hình Third-party)
│ │ ├── api-client.ts # Config Axios (gắn JWT token vào header)
│ │ ├── query-client.ts # Config React Query / SWR
│ │ ├── gsap-config.ts # Khởi tạo GSAP & ScrollTrigger global
│ │ └── utils.ts # cn() function của Shadcn
│ │
│ ├── store/ # 📦 GLOBAL STATE (Zustand / Redux)
│ │ └── useAuthStore.ts # Lưu thông tin User & Token dùng toàn app
│ │
│ ├── types/ # 🏷 GLOBAL TYPES
│ │ └── common.type.ts # Response type chung (VD: PaginationResponse)
│ │
│ └── utils/ # 🧮 GLOBAL UTILS (Hàm helper thuần)
│ ├── formatters.ts # formatCurrency, formatDate
│ └── geo.ts # calculateDistance (FE cũng có thể cần tính toán tạm)

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
