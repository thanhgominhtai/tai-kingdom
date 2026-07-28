# tai'kingdom

Web game chiến thuật thời gian thực 2D, xây bằng React + TypeScript + Canvas.
Đồ họa sử dụng Tiny Swords của Pixel Frog.

## Chạy trong VS Code

Yêu cầu Node.js 20.19 trở lên.

```bash
npm install
npm run dev
```

Mở địa chỉ Vite in ra trong Terminal, mặc định là
`http://localhost:5173`.

## Kiểm tra bản production

```bash
npm run build
npm run preview
```

Thư mục `dist/` là bản web tĩnh sau khi build. Nếu muốn dùng extension Live
Server, hãy mở riêng thư mục `dist` làm workspace rồi chạy Live Server từ
`dist/index.html`.

## Deploy Vercel

Import repository vào Vercel. Dự án đã có `vercel.json`, Vercel sẽ chạy
`npm run build` và publish thư mục `dist`.

## Cấu trúc chính

- `src/GameApp.tsx`: menu, HUD, song ngữ và luồng màn hình.
- `src/game/engine.ts`: mô phỏng RTS, xử lý input và vẽ Canvas.
- `src/game/assets.ts`: danh sách asset tải vào game.
- `src/game/i18n.ts`: nội dung Việt/Anh.
- `src/styles.css`: giao diện parchment, ribbon và wood table.
- `public/game-assets`: asset runtime đã chuẩn hóa tên.
- `assets`: ba pack gốc để tiếp tục phát triển; thư mục này không đưa lên Git.
