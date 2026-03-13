# Test Group Form Functionality

## Tổng quan
Form component đã được cập nhật để hỗ trợ group functionality với các tính năng mới, **giữ nguyên layout form cũ** và chỉ thêm logic group khi cần thiết.

### Các trường mới đã thêm:
- **Forms**: `is_allow_group`, `template_email`, `template_email_group`, `qr_code_field`
- **FormField**: `is_required`, `is_group_field`, `is_email_contact`, `event_id`, `tenant_id`
- **FormSubmissions**: `is_lead`, `date_started`, `date_sumitted`

### Flow hoạt động:

1. **Form không có group** (`is_allow_group = false`):
   - Hiển thị tất cả fields như bình thường (layout cũ)
   - Tạo 1 submission với `is_lead = true`

2. **Form có group** (`is_allow_group = true`):
   - **Hiển thị tất cả fields như bình thường** (layout cũ)
   - **Thêm Group Section** ở cuối form:
     - Hiển thị button "Thêm thành viên" nếu có fields với `is_group_field = true`
     - User có thể thêm/xóa các section thành viên
     - Mỗi section chứa các fields có `is_group_field = true`
   - **Submit**: Tạo multiple submissions:
     - 1 lead submission với `is_lead = true` (chứa tất cả fields gốc)
     - N submissions với `is_lead = false` (mỗi section thành viên)

### Cấu trúc dữ liệu:

#### Lead Submission:
```json
{
  "answers": [
    {"field": "name", "value": "John Doe"},
    {"field": "email", "value": "john@example.com"}
  ],
  "form": "form-id",
  "is_lead": true,
  "date_started": "2025-01-23T10:00:00Z",
  "date_sumitted": "2025-01-23T10:05:00Z"
}
```

#### Group Submission:
```json
{
  "answers": [
    {"field": "member_name", "value": "Jane Doe"},
    {"field": "member_phone", "value": "123-456-7890"}
  ],
  "form": "form-id",
  "is_lead": false,
  "date_started": "2025-01-23T10:00:00Z",
  "date_sumitted": "2025-01-23T10:05:00Z"
}
```

### UI Components:

1. **Form Fields** (layout cũ):
   - Hiển thị tất cả fields như bình thường
   - Required fields được đánh dấu với dấu *
   - Giữ nguyên grid layout và styling

2. **Group Section** (chỉ hiện khi `is_allow_group = true` và có group fields):
   - Hiển thị ở cuối form, sau tất cả fields gốc
   - Header với button "Thêm thành viên"
   - Mỗi member section có:
     - Title: "Thành viên 1", "Thành viên 2", etc.
     - Button "Xóa" để xóa section
     - Fields: Tất cả fields có `is_group_field = true`

3. **Submit Button**:
   - Disabled khi đang loading
   - Text từ form translations hoặc fallback

### Validation:
- Required fields được validate cho cả lead và group sections
- Form data được tách riêng cho lead và group submissions
- Error handling cho từng submission type

### API Endpoints:
- `POST /api/form-submissions` đã được cập nhật để hỗ trợ:
  - `is_lead` boolean
  - `date_started` timestamp
  - `date_sumitted` timestamp (auto-generated)

## Test Cases:

### Test Case 1: Form không có group
- Input: `is_allow_group = false`
- Expected: Chỉ hiển thị lead section, không có group section
- Submit: Tạo 1 submission KHÔNG có `is_lead` và KHÔNG có `group_id`

### Test Case 2: Form có group nhưng không có group fields
- Input: `is_allow_group = true`, không có fields với `is_group_field = true`
- Expected: Chỉ hiển thị lead section, không có group section
- Submit: Tạo 1 submission KHÔNG có `is_lead` và KHÔNG có `group_id`

### Test Case 3: Form có group nhưng không add thành viên
- Input: `is_allow_group = true`, có group fields nhưng user không click "Add Member"
- Expected: Hiển thị group section với button "Add Member" nhưng không có members
- Submit: Tạo 1 submission KHÔNG có `is_lead` và KHÔNG có `group_id`

### Test Case 4: Form có group với group fields và add thành viên
- Input: `is_allow_group = true`, có fields với `is_group_field = true` và user add members
- Expected: Hiển thị cả lead section và group section với button "Add Member"
- Submit: 
  - Lead submission: chỉ chứa lead fields với `is_lead: true` và `group_id`
  - Group submissions: mỗi section chỉ chứa group fields với `is_lead: false` và `group_id`

### Test Case 5: Thêm/xóa group members
- Input: User click "Add Member" và "Remove"
- Expected: Group sections được thêm/xóa động
- Submit: Chỉ tạo submissions cho các sections còn lại

## Cách sử dụng:

1. **Trong Directus**:
   - Tạo form với `is_allow_group = true`
   - Tạo form fields:
     - Lead fields: `is_group_field = false` (hoặc null)
     - Group fields: `is_group_field = true`
   - Set `is_required = true` cho các fields bắt buộc

2. **Data Flow**:
   - **Directus Query**: Form được load qua `fetchPage` với deep query
   - **FormBlock Transform**: Data được transform trong `FormBlock.tsx` để include các trường mới
   - **VForm Processing**: VForm component xử lý logic group dựa trên data từ Directus

3. **Form sẽ tự động**:
   - Hiển thị tất cả fields như bình thường (layout cũ)
   - Hiển thị group section với button "Thêm thành viên" nếu `is_allow_group = true`
   - User có thể thêm/xóa members và submit form
   - Hệ thống sẽ tạo multiple submissions tương ứng

## Ví dụ Submit Logic:

**Form có:**
- Lead fields: `name`, `email`, `phone`
- Group fields: `member_name`, `member_email`

**User nhập:**
- Lead: `name="John"`, `email="john@email.com"`, `phone="123456"`
- Group Section 1: `member_name="Alice"`, `member_email="alice@email.com"`
- Group Section 2: `member_name="Bob"`, `member_email="bob@email.com"`

**Generated Group ID:** `550e8400-e29b-41d4-a716-446655440000`

**Kết quả Submit (Batch Create):**
1. **Lead Submission** (`is_lead: true`, `group_id: "550e8400-e29b-41d4-a716-446655440000"`):
   ```json
   {
     "answers": [
       {"field": "name", "value": "John"},
       {"field": "email", "value": "john@email.com"},
       {"field": "phone", "value": "123456"}
     ],
     "is_lead": true,
     "group_id": "550e8400-e29b-41d4-a716-446655440000"
   }
   ```

2. **Group Submission 1** (`is_lead: false`, `group_id: "550e8400-e29b-41d4-a716-446655440000"`):
   ```json
   {
     "answers": [
       {"field": "member_name", "value": "Alice"},
       {"field": "member_email", "value": "alice@email.com"}
     ],
     "is_lead": false,
     "group_id": "550e8400-e29b-41d4-a716-446655440000"
   }
   ```

3. **Group Submission 2** (`is_lead: false`, `group_id: "550e8400-e29b-41d4-a716-446655440000"`):
   ```json
   {
     "answers": [
       {"field": "member_name", "value": "Bob"},
       {"field": "member_email", "value": "bob@email.com"}
     ],
     "is_lead": false,
     "group_id": "550e8400-e29b-41d4-a716-446655440000"
   }
   ```

## Lưu ý quan trọng:

- **Single submission**: Khi không có group members, tạo 1 submission KHÔNG có `is_lead` và KHÔNG có `group_id`
- **Lead submission**: Chỉ chứa lead fields (form fields ban đầu) với `is_lead: true` và `group_id`
- **Group submissions**: Mỗi section chỉ chứa group fields với `is_lead: false` và `group_id`
- **Group ID**: Chỉ tạo `group_id` khi thực sự có group members được thêm
- **Batch Create**: Sử dụng Directus SDK `createItems` để tạo multiple submissions trong một lần
- **Field names**: Group submissions sử dụng tên field gốc (không có prefix `group_X_`)
