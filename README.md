# Website Kỷ Niệm – Ba Đào Huy Việt (1934 – 2010)

Trang web tưởng nhớ và lưu giữ ký ức về Ông nội **Đào Huy Việt** qua 5 giai đoạn cuộc đời và hơn nửa thế kỷ lịch sử gia đình.

---

## 🌟 Tính Năng Chính

1. **Giới thiệu & Mục đích ý nghĩa**: Phần mở đầu trang trọng, giải thích mục đích lưu giữ ký ức gia đình, kèm thanh mốc thời gian nhanh.
2. **Biểu diễn 5 giai đoạn cuộc đời & Mốc sự kiện theo năm**:
   - **Giai đoạn 1 (1934 – 1988)**: Thời tuổi trẻ, học nghề đúc, thử thách phân ly 1954 & 34 năm công tác kỹ thuật quân sự.
   - **Giai đoạn 2 (1955 – 2001)**: Mái ấm gia đình cùng Bà Hợp, đám cưới phố cổ 1957, sinh 3 con & ngày đại đoàn tụ 1976.
   - **Giai đoạn 3 (2002 – 2007)**: Vui vầy bên con cháu phần 1 (cháu ngoại, cháu nội về nước, sinh nhật, du xuân).
   - **Giai đoạn 4 (2008 – 2010)**: Bên cháu yêu thương phần 2 (Thủ Lệ, Cọ Xanh, sinh nhật các cháu).
   - **Giai đoạn 5 (1966 – 2020)**: Ký ức họ hàng, trận bom dội phố Nguyễn Thiếp 1966, thoát chết gang tấc & những lần dời tổ ấm.
3. **Trọn vẹn 238 bức ảnh kỷ niệm**: Toàn bộ ảnh từ 5 cuốn Photobook PowerPoint đã được trích xuất trực tiếp từ các gói OpenXML chất lượng gốc cao nhất vào `assets/images/`. Đã loại bỏ các ảnh lặp tiêu đề để từng năm hiển thị ảnh sự kiện chân thực, sinh động.
4. **Trình phóng to ảnh (Lightbox)**: Phóng to toàn màn hình, hiển thị chú thích chi tiết, đếm số ảnh (`Ảnh X / 277`), phím mũi tên `←` / `→`, `ESC`, và vuốt chạm (swipe) trên điện thoại.
5. **Bản nhạc tưởng nhớ**: Tích hợp nhạc YouTube [SgUHZ_G9uCA](https://www.youtube.com/watch?v=SgUHZ_G9uCA) với nút bật/tắt và dải sóng visualizer nổi ở góc màn hình.
6. **Thiết kế Monolithic & Giao diện trung tính**: Tông màu ấm áp, trang nghiêm (nâu trầm, be kem, vàng đồng cổ điển), chuẩn Responsive 100% trên cả máy tính và điện thoại.

---

## 🚀 Cách Xem Trang Web

### Cách 1: Mở trực tiếp (Không cần cài đặt bất kỳ phần mềm nào)
Nhấp đúp chuột trực tiếp vào file **`index.html`** trên máy tính của bạn (mở bằng Chrome, Microsoft Edge, Firefox, Cốc Cốc, Safari...).
Dữ liệu đã được đóng gói sẵn trong `js/data.js`, hoạt động ngay tức thì và không bị chặn CORS.

---

## 🌐 Hướng Dẫn Đưa Lên Môi Trường Thực Tế (Deployment)

Vì đây là kiến trúc tĩnh Monolithic (HTML/CSS/JS thuần), bạn có thể đưa website lên internet hoàn toàn **miễn phí, tốc độ cao và bảo mật tuyệt đối (HTTPS)**:

### 1. Đưa lên Vercel (Khuyên dùng - Nhanh nhất)
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập.
2. Kéo thả trực tiếp toàn bộ thư mục `DaoHuyViet` vào trang Vercel (hoặc kết nối qua GitHub).
3. Nhấn **Deploy** -> Sau 10 giây bạn sẽ có ngay đường link thực tế (ví dụ: `https://daohuyviet.vercel.app`).

### 2. Đưa lên Netlify
1. Truy cập [app.netlify.com/drop](https://app.netlify.com/drop).
2. Kéo và thả thư mục `DaoHuyViet` vào khung tải lên.
3. Website sẽ hoạt động trực tiếp ngay lập tức với chứng chỉ SSL/HTTPS bảo mật.

### 3. Đưa lên GitHub Pages
1. Đẩy mã nguồn lên một repository trên GitHub.
2. Vào tab **Settings** -> **Pages** -> chọn nhánh `main` và thư mục `/root` -> bấm **Save**.
3. Link trang web sẽ có dạng: `https://<ten-tai-khoan>.github.io/<ten-repo>`.

---

## 🔒 Bảo Mật & Kiểm Thử
- **Không có backend hay cơ sở dữ liệu động**: Miễn nhiễm 100% với các lỗ hổng SQL Injection, Server-Side Tampering hay rò rỉ dữ liệu máy chủ.
- **XSS Protection**: Toàn bộ chuỗi văn bản được lọc và escape qua hàm `escHtml` trước khi hiển thị.
- **Tối ưu hiệu năng**: Tích hợp `loading="lazy"` cho toàn bộ 277 ảnh giúp tải trang mượt mà ngay cả trên mạng di động.

