## Navigation Loading Flow

### Thành phần chính

- `src/app/[site]/[lang]/page.tsx`: trang server-side gọi dữ liệu điều hướng và render header/footer.
- `src/directus/queries/navigation.ts`: triển khai `fetchNavigationSafe` để đọc collection `navigation` trong Directus.
- `src/directus/queries/sites.ts`: cung cấp `getSite`, xác nhận site và danh sách navigation hợp lệ.
- `src/components/navigation/TheHeader.tsx` & `src/components/navigation/TheFooter.tsx`: client component thực thi render từ cấu trúc `Navigation`.

### Luồng tải header/footer

1. Khi route `/[site]/[lang]` được truy cập, `page.tsx` giải `params` và dựng `currentPathname`.
2. `Promise.all` gọi song song:
   - `fetchNavigationSafe(site, lang, 'header')`
   - `fetchNavigationSafe(site, lang, 'footer')`
   - `getSite(site)`
3. Kết quả điều hướng và thông tin site được truyền vào `<TheHeader />` và `<TheFooter />`.
4. Hai component client sử dụng `navigation.items` để tạo danh sách link, đồng thời dựng URL bằng `buildUrl` dựa trên ngôn ngữ hiện tại và `pathname`.

### Chi tiết `fetchNavigationSafe`

- Xác thực site: gọi `getSite(siteSlug)` để lấy record `sites` cùng trường `navigation`. Nếu site không tồn tại hoặc không khai báo loại điều hướng (`header`/`footer`), hàm trả về `null`.
- Nếu hợp lệ, gọi Directus:
  ```ts
  readItems('navigation', {
    filter: {
      site_id: { _eq: site.id },
      type: { _eq: type }, // 'header' hoặc 'footer'
      status: { _eq: 'published' }
    },
    fields: [
      '*',
      'items.*',
      'items.translations.*',
      'items.page.*',
      'items.page.translations.*'
    ],
    limit: 1
  })
  ```
- Dữ liệu được bọc bởi `safeApiCall` để ghi log và fallback sang mock (`getMockNavigation`) khi Directus không sẵn sàng.
- Sau khi lấy dữ liệu, hàm chuẩn hóa `navigation.items`:
  - Map mã ngôn ngữ `vi` → `vi-VN`, `en` → `en-US`.
  - Chỉ giữ bản dịch khớp `languages_code`; fallback bản dịch đầu tiên nếu không có.

### Cách dùng trong component khác

```ts
import { fetchNavigationSafe } from '@/directus/queries/navigation';

const headerNav = await fetchNavigationSafe(siteSlug, langCode, 'header');
const footerNav = await fetchNavigationSafe(siteSlug, langCode, 'footer');
```

- Hàm trả về `Navigation | null`. Khi null, component nên kiểm tra trước khi render.
- Nếu cần reuse trên API route hoặc server action khác, vẫn gọi async tương tự (hàm đã tự động log/xử lý lỗi).

### Lưu ý thêm

- Header/Footer chỉ hoạt động khi trường `navigation` của site chứa `'header'` và/hoặc `'footer'`.
- Các component client tự động lấy `pathname` qua `usePathname` nếu không truyền từ server, tránh lệch URL giữa SSR/CSR.
- Mock navigation hỗ trợ môi trường local/offline nhưng chỉ có một số item mẫu; để xuất bản thật phải cấu hình collection `navigation` trong Directus.


