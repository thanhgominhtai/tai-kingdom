# tai'kingdom

Web game chiến thuật thời gian thực 2D, xây bằng React + TypeScript + Canvas.
Đồ họa sử dụng Tiny Swords của Pixel Frog.

## Gameplay hiện có

- Bốn bản đồ thế giới mở 3072×2048 có layout riêng: sông, hồ, cầu chiến
  lược, cao địa, cầu thang, đường đất, đồng cỏ, rừng và các khu hang ổ địch.
- Camera bằng WASD/phím mũi tên, rê sát mọi cạnh, nút điều hướng hoặc click
  minimap; lăn chuột hoặc dùng nút để zoom từ 25% đến 150%.
- Pathfinding theo ô: quân bộ không đi xuống sông, nhưng biết tìm đường qua
  cầu; công trình và cây tự mờ khi che khuất giao tranh.
- Chế độ **Theo màn** có bốn chiến trường mở khóa tuần tự, hai boss phase
  mỗi bản đồ và Troll boss cuối màn.
- Chế độ **Vĩnh viễn** bắt đầu ở vùng 1; phá sạch hang sẽ ghép ngẫu nhiên vùng kế
  tiếp vào bên phải cho đến khi thành một thế giới bốn vùng. Mỗi lần mở đất có
  thêm tài nguyên, quân tiếp viện, dân số và địch mạnh dần.
- Cây cạn để lại gốc, Sheep biến mất 25–30 giây rồi xuất hiện ở vị trí an toàn
  mới; Monk tự tìm đồng minh bị thương và quân phòng thủ ưu tiên kẻ đang đánh Castle.
- Điều chỉnh nhịp game 1x/2x/3x/4x, auto-save, tooltip và hướng dẫn song ngữ
  Việt/Anh.
- Dev Mode tùy chọn trong Cài đặt: bất tử, hồi máu, chỉnh tài nguyên, gọi quái,
  chuyển wave và thắng nhanh bản đồ để backtest.

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
