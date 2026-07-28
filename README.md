# tai'kingdom

Web game chiến thuật thời gian thực 2D, xây bằng React + TypeScript + Canvas.
Đồ họa sử dụng Tiny Swords của Pixel Frog.

## Gameplay hiện có

- Bản đồ thế giới mở 3072×2048 với sông, hai cầu chiến lược, hồ, đồi/vách
  đá, đường đất, đồng cỏ, rừng và ba khu hang ổ địch.
- Camera bằng WASD/phím mũi tên, rê sát mép ngang hoặc click minimap.
- Pathfinding theo ô: quân bộ không đi xuống sông, nhưng biết tìm đường qua
  cầu; công trình và cây tự mờ khi che khuất giao tranh.
- Chế độ **Theo màn** có phase, quái đặc biệt và Troll boss cuối màn.
- Chế độ **Vĩnh viễn** có Pawn tự farm, tài nguyên hồi sinh, hang ổ tái tạo và
  wave tăng độ khó vô hạn.
- Điều chỉnh nhịp game 1x/2x/3x/4x, auto-save, tooltip và hướng dẫn song ngữ
  Việt/Anh.

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
- `GAME_ANYLYZE`: báo cáo phân tích và pack gốc do chủ dự án cung cấp. Game chỉ
  tải các file đã chọn trong `public/game-assets`, nên báo cáo không làm nặng
  bản deploy.
