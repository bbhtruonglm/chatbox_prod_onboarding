---
description: Luồng Onboarding - Quy trình đăng ký và thiết lập tài khoản
---

# LUỒNG ONBOARDING - RETION CHAT

## TỔNG QUAN

Luồng onboarding là quy trình đăng ký và thiết lập tài khoản cho người dùng mới. Luồng này bao gồm **7 bước chính** (flow_step), mỗi bước có mục đích và chức năng riêng.

---

## CẤU TRÚC FLOW

### **flow_step = 1: Thu thập thông tin cơ bản (5 bước con)**

**Mục đích:** Thu thập thông tin về doanh nghiệp và người dùng

**Component:** `Onboarding.vue` (Main form)

**Các bước con (current_step):**

#### **Step 0: Chọn ngành nghề (Industry)**

- Hiển thị grid 3 cột với 9 lựa chọn ngành nghề
- Khi click chọn → tự động chuyển sang step tiếp theo
- Lưu vào: `SELECTED_INDUSTRY`

#### **Step 1: Chọn vai trò (Role)**

- Hiển thị grid 3 cột với 8 lựa chọn vai trò
- Khi click chọn → tự động chuyển sang step tiếp theo
- Lưu vào: `SELECTED_ROLE`

#### **Step 2: Nhập tên công ty (Company Name)**

- Input field bắt buộc (required)
- Auto-focus khi vào step
- Validation: không được để trống
- Có nút "Next" để chuyển step (không tự động)
- Lưu vào: `COMPANY_DETAILS.name`

#### **Step 3: Chọn quy mô (Preferences)**

- Hiển thị grid 3 cột với 8 lựa chọn quy mô công ty
- Khi click chọn → tự động chuyển sang step tiếp theo
- Lưu vào: `SELECTED_PREFERENCES`

#### **Step 4: Thông tin chi tiết công ty (Company Details)**

- Các trường thông tin:
  - Website (có validation regex)
  - Facebook page
  - Instagram page
  - TikTok page
  - Zalo page
- Validation: Phải có ít nhất 1 trong các trường (website hợp lệ HOẶC ít nhất 1 social media)
- Nút "Create Account" để submit form
- Lưu vào: `COMPANY_DETAILS` (website, facebook, instagram, tiktok, zalo)

**Xử lý khi submit:**

1. Lưu dữ liệu onboarding vào `RegistrationDataService`
2. Kiểm tra loại đăng ký:
   - **Email:** Gọi API `register()` → chuyển sang flow_step = 2
   - **Facebook:** Gọi API `login()` với token → lưu access_token, user_id → chuyển sang flow_step = 3

---

### **flow_step = 2: Loading tạo tài khoản**

**Mục đích:** Hiển thị màn hình loading trong khi xử lý đăng ký

**Component:** `OnboardingLoading.vue`

**Hoạt động:**

- Hiển thị animation loading
- Tự động chuyển sang bước tiếp theo sau 1 giây
- Emit event `complete` → gọi hàm `completeLoading()`

**Logic chuyển tiếp:**

- Nếu đăng ký bằng **email** → flow_step = 7 (Verify Email)
- Nếu đăng ký bằng **Facebook** → flow_step = 3 (Verify Phone)

---

### **flow_step = 3: Xác thực số điện thoại**

**Mục đích:** Xác thực số điện thoại qua SMS OTP

**Component:** `OnboardingVerify.vue`

**Hoạt động:**

1. Nhập số điện thoại (validation: 8-15 chữ số)
2. Chọn phương thức verify:
   - SMS
   - Zalo
3. Nhập mã OTP 6 số (3-3 format)
4. Countdown 60 giây để gửi lại mã
5. Có thể đổi số điện thoại

**Khi verify thành công:**

- Emit event `verify` → gọi hàm `verifyPhone()`
- Chuyển sang flow_step = 4 (Upgrade Modal)

---

### **flow_step = 4: Chọn gói dịch vụ**

**Mục đích:** Cho phép người dùng chọn gói dịch vụ phù hợp

**Component:** `UpgradeModalV2.vue`

**Hoạt động:**

1. Hiển thị các gói dịch vụ với bảng so sánh tính năng
2. Có thể toggle để xem chi tiết so sánh
3. Chọn gói dịch vụ
4. Submit gói đã chọn

**Khi submit:**

- Emit event `submit` → gọi hàm `submitPackage()`
- Gọi API lấy danh sách tổ chức
- Tìm tổ chức của user và lưu `selected_org_id`
- Chuyển sang flow_step = 5 (Quick Start)

---

### **flow_step = 5: Thiết lập nhanh (Quick Start)**

**Mục đích:** Kết nối các nền tảng và mời thành viên

**Component:** `OnboardingQuickStarter.vue`

**2 bước con (current_step_quick_start):**

#### **Step 0: Kết nối nền tảng**

- Danh sách các nền tảng có thể kết nối:
  - Zalo
  - Facebook
  - Instagram
  - TikTok
  - Shopee
  - Lazada
  - Haravan
- Hiển thị trạng thái: "Connected" hoặc "Connect"
- Có thể bỏ qua (Skip for now)

#### **Step 1: Mời thành viên**

- Copy link mời
- Nhập email để gửi lời mời
- Có thể thêm nhiều email
- Gửi lời mời qua email
- Có thể bỏ qua (Skip for now)

**Khi next hoặc skip:**

- Emit event `next` hoặc `skip_for_now` → gọi hàm `onNextQuickStart()` hoặc `skipForNow()`
- Chuyển sang flow_step = 6 (Creating Account)

---

### **flow_step = 6: Hoàn tất thiết lập**

**Mục đích:** Hiển thị tiến trình hoàn tất thiết lập tài khoản

**Component:** `OnboardingCreatingAccount.vue`

**Hoạt động:**

- Hiển thị 3 bước xử lý:
  1. Applying preference (Áp dụng tùy chọn)
  2. Config AI (Cấu hình AI)
  3. Finalizing Retion (Hoàn tất Retion)
- Mỗi bước tự động hoàn thành sau 1 giây
- Hiển thị icon loading → check khi hoàn thành

**Khi hoàn tất:**

- Emit event `complete` → gọi hàm `completeCreatingAccount()`
- Xóa dữ liệu đăng ký trong storage
- Redirect về trang chủ `/`

---

### **flow_step = 7: Xác thực email**

**Mục đích:** Xác thực email qua OTP (chỉ cho đăng ký bằng email)

**Component:** `OnboardingVerifyEmail.vue`

**Hoạt động:**

1. Hiển thị email đã đăng ký
2. Nhập mã OTP 4 số (2-2 format)
3. Countdown 60 giây để gửi lại mã
4. Auto-focus và auto-submit khi nhập đủ 4 số

**Khi verify thành công:**

- Emit event `verify` → gọi hàm `verifyEmail()`
- Gọi API xác thực email
- Tự động đăng nhập với email và password
- Lưu access_token và user_id
- Chuyển sang flow_step = 3 (Verify Phone)

**Nếu muốn quay lại:**

- Emit event `back` → gọi hàm `backToOnboarding()`
- Quay lại flow_step = 1

---

## LUỒNG DỮ LIỆU

### **RegistrationDataService**

Service quản lý dữ liệu đăng ký trong localStorage:

```typescript
{
  registration_type: 'email' | 'facebook',
  email?: string,
  password?: string,
  first_name?: string,
  last_name?: string,
  access_token?: string,
  industry?: string,
  role?: string,
  company_name?: string,
  preferences?: string,
  company_details?: {
    website?: string,
    facebook?: string,
    instagram?: string,
    tiktok?: string,
    zalo?: string
  }
}
```

### **localStorage Keys**

- `access_token`: Token xác thực
- `user_id`: ID người dùng
- `selected_org_id`: ID tổ chức được chọn

---

## VALIDATION

### **Step 2 - Company Name**

- Không được để trống
- Trim whitespace

### **Step 4 - Company Details**

- Website: Regex validation `^(https?://)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(/.*)?$`
- Phải có ít nhất 1 trong các trường:
  - Website hợp lệ VÀ có giá trị
  - HOẶC ít nhất 1 social media có giá trị

### **Step 3 - Phone Number**

- Chỉ nhập số
- Độ dài: 8-15 chữ số

### **Step 7 - Email OTP**

- 4 chữ số
- Auto-submit khi đủ

---

## XỬ LÝ LỖI

### **Facebook Token Expired**

- Hiển thị modal yêu cầu đăng nhập lại Facebook
- Component: `Modal` với ref `relogin_modal_ref`
- Khi đăng nhập lại thành công → retry submit form

### **API Errors**

- Hiển thị toast notification với thông báo lỗi
- Service: `Toast` (IAlert)

---

## ĐIỀU HƯỚNG

### **Nút Back**

- Step 0: Disabled
- Step 1-4: Quay lại step trước đó

### **Nút Next/Submit**

- Step 0, 1, 3: Tự động next khi chọn
- Step 2, 4: Hiển thị nút Next/Create Account (disabled khi không valid)

---

## ANIMATION & UX

### **Transition Effects**

- Fade-slide animation khi chuyển step
- Duration: 0.4s ease
- Enter: opacity 0 → 1, translateX(20px) → 0
- Leave: opacity 1 → 0, translateX(0) → (-20px)

### **Auto-focus**

- Step 2: Auto-focus vào input tên công ty
- Step 4: Auto-focus vào input website

### **Progress Indicator**

- Hiển thị "X of Y" ở mỗi step
- Sticky header với title và description động

---

## API ENDPOINTS

### **OAuth Basic**

- `register(email, password, name, first_name, last_name)`: Đăng ký tài khoản
- `login(email, password)`: Đăng nhập
- `verifyEmail(email, otp)`: Xác thực email
- `resendVerifyEmail(email)`: Gửi lại mã xác thực email

### **OAuth Facebook**

- `login(token)`: Đăng nhập với Facebook token

### **Billing**

- `readOrg()`: Lấy danh sách tổ chức

---

## NOTES

1. **Onboarding chỉ chạy 1 lần** khi user đăng ký mới
2. **Dữ liệu được lưu trong localStorage** để tránh mất dữ liệu khi refresh
3. **Có 2 luồng chính:**
   - Email: 1 → 2 → 7 → 3 → 4 → 5 → 6 → Dashboard
   - Facebook: 1 → 3 → 4 → 5 → 6 → Dashboard
4. **Có thể skip** một số bước trong Quick Start
5. **Validation chặt chẽ** ở mỗi step để đảm bảo dữ liệu đầy đủ
