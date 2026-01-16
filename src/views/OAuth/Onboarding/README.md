# Tài liệu Nghiệp vụ Module Onboarding

## 1. Tổng quan

Quy trình Onboarding là luồng người dùng mới trải qua sau khi đăng ký tài khoản, nhằm mục đích thu thập thông tin doanh nghiệp, thiết lập tổ chức, chọn gói dịch vụ và kết nối các nền tảng ban đầu.

Hệ thống quản lý trạng thái luồng thông qua biến `flow_step` (trong `Onboarding.vue`), bao gồm 7 trạng thái chính.

## 2. Luồng xử lý chi tiết (Flow Steps)

### Step 1: Thu thập thông tin doanh nghiệp

- **Giao diện**: Form wizard 5 bước nhỏ (Ngành nghề, Vai trò, Tên công ty, Quy mô, Chi tiết liên hệ).
- **Logic**:
  - Dữ liệu được lưu tạm thời vào `REGISTRATION_SERVICE`.
  - **Submit Form**:
    - Xóa `user_id`, `access_token` cũ để đảm bảo phiên mới.
    - Gọi API Đăng ký (`register`) hoặc Đăng nhập Facebook.
    - Lưu `user_id` và `access_token` mới vào `localStorage`.
    - Chuyển sang **Step 2**.

### Step 2: Loading & Routing

- Màn hình loading trung gian.
- **Điều hướng Logic**:
  - Nếu đăng ký bằng **Email**: Chuyển sang **Step 7** (Verify Email).
  - Nếu đăng ký bằng **Facebook** (đã verify): Chuyển thẳng sang **Step 4** (Upgrade Package).
  - _(Logic ẩn)_: Nếu đăng ký bằng Số điện thoại (tính năng chưa hỗ trợ ở Step 1) -> Chuyển sang **Step 3** (Verify Phone).

### Step 3: Xác thực số điện thoại (Verify Phone) - _Hiện đang ẩn/Chưa kích hoạt_

- **Component**: `OnboardingVerify.vue`.
- **Trạng thái**: Tạm thời chưa sử dụng do form đăng ký Step 1 chưa hỗ trợ `registration_type = 'phone'`.
- **Logic dự kiến**: Verify OTP gửi về SĐT -> Login -> Step 4.

### Step 7: Xác thực Email (Verify Email)

- **Giao diện**: Nhập mã OTP gửi về email.
- **Logic**:
  - Gọi API `verifyEmail`.
  - Sau khi verify thành công, gọi API `login` để lấy token chính thức.
  - Chuyển sang **Step 4**.

### Step 4: Chọn gói dịch vụ (Upgrade Package)

- **Component**: `UpgradeModalV2.vue`.
- **Logic**:
  - Hiển thị các gói dịch vụ (Trial, Pro, Business...).
  - **Xử lý đăng ký gói**:
    - Kiểm tra gói hiện tại của Tổ chức (Org) (API `readOrg`).
    - Lưu thông tin gói user chọn vào `REGISTRATION_SERVICE`.
    - **Note**: Logic kích hoạt gói (gọi API `purchase_package`) KHÔNG thực hiện ở bước này mà được dồn về **Step 6**.
  - Chuyển sang **Step 5**.

### Step 5: Khởi động nhanh (Quick Starter)

- **Component**: `OnboardingQuickStarter.vue`.
- **Chức năng**:
  - Hiển thị thông tin Tổ chức (Org) vừa tạo/chọn.
  - **Kết nối nền tảng**: Cho phép kết nối Facebook, Zalo, Instagram...
  - **Mời thành viên**: Copy link invite hoặc gửi email mời.
- **Logic**:
  - Lấy `user_id` từ `localStorage` để filter danh sách Org mà user làm Owner.
  - User có thể chọn "Next" hoặc "Skip for now" -> Chuyển sang **Step 6**.

### Step 6: Khởi tạo tài khoản (Finalizing)

- **Component**: `OnboardingCreatingAccount.vue`.
- **Giao diện**: Hiển thị quá trình giả lập (Mock loading) gồm 3 bước:
  1. Applying preference.
  2. Config AI.
  3. Finalizing Retion.
  - _Lưu ý_: Bước cuối cùng sẽ giữ trạng thái Loading (spinner) cho đến khi API hoàn tất.
- **Logic Xử lý ngầm (Backend)**:
  - Hàm `RunAdditionalSetup` được kích hoạt song song ngay khi vào Step 6.
  - **Update User Info**: Cập nhật thông tin chatbot user (custom_id, role, industry...).
  - **Activate Package**:
    - Lấy thông tin gói đã lưu ở Step 4.
    - Kiểm tra gói hiện tại của Org (nếu là FREE thì mới đăng ký).
    - Gọi API `purchase_package`.
- **Đồng bộ hóa UI**:
  - Khi mock loading đạt bước cuối VÀ API response success -> Redirect người dùng về trang Dashboard (`/`).

## 3. Các Component chính

| Component                       | Vai trò                                             | Ghi chú                        |
| ------------------------------- | --------------------------------------------------- | ------------------------------ |
| `Onboarding.vue`                | Container chính, quản lý `flow_step` và logic tổng. | Chứa hàm `RunAdditionalSetup`. |
| `UpgradeModalV2.vue`            | Modal chọn gói dịch vụ.                             | Emit event khi chọn gói.       |
| `OnboardingQuickStarter.vue`    | Màn hình kết nối & mời thành viên.                  | Xử lý logic hiển thị Org.      |
| `OnboardingCreatingAccount.vue` | Màn hình chờ cuối cùng.                             | UI Mock loading.               |
| `OnboardingVerify.vue`          | Verify Phone.                                       | _Currently unused_.            |

## 4. Lưu ý quan trọng

- **Quy tắc Code**: Tuân thủ naming convention (`SNAKE_CASE_UPPER` cho const, `PascalCase` cho function) và comment tiếng Việt chi tiết (// cho logic, /\*\* \*/ cho JSDoc).
- **Local Storage**: `user_id` và `selected_org_id` là key quan trọng để duy trì context giữa các bước và các component con.
- **Parallel Processing**: Tại Step 6, UI và API chạy song song để tối ưu trải nghiệm người dùng.
