# Registration Data Service - Tài liệu

## 📋 Tổng quan

Service này giải quyết vấn đề **phân tán dữ liệu đăng ký** bằng cách tập trung tất cả thông tin vào **một object duy nhất** trong LocalStorage.

### Vấn đề trước đây:

- Dữ liệu đăng ký bị phân tán ở nhiều field khác nhau
- Khó tổng hợp khi chuyển sang màn onboarding
- Code rối và khó maintain

### Giải pháp hiện tại:

- ✅ Tất cả dữ liệu đăng ký được lưu vào **1 key duy nhất**: `REGISTRATION_DATA`
- ✅ Hỗ trợ cả đăng ký qua **Email** và **Facebook**
- ✅ Dễ dàng lấy và xử lý ở màn onboarding
- ✅ Code gọn gàng, dễ maintain

---

## 🏗️ Cấu trúc dữ liệu

```typescript
interface IRegistrationData {
  /** Loại đăng ký: 'email' | 'facebook' */
  registration_type: 'email' | 'facebook'

  // Dành cho đăng ký Email
  email?: string
  first_name?: string
  last_name?: string
  password?: string

  // Dành cho đăng ký Facebook
  access_token?: string

  /** Thời gian đăng ký (timestamp) */
  registered_at: number

  // === Onboarding Data ===
  industry?: string // Ngành nghề
  role?: string // Vai trò
  company_name?: string // Tên công ty
  preferences?: string // Sở thích/Quy mô
  company_details?: {
    website?: string
    facebook?: string
    instagram?: string
    tiktok?: string
    zalo?: string
  }
}
```

---

## 📁 Files đã thay đổi

### 1. **RegistrationData.ts** (MỚI)

- Service chính để quản lý dữ liệu đăng ký
- Vị trí: `/src/utils/helper/RegistrationData.ts`

### 2. **RegisterNew.vue** (CẬP NHẬT)

- Thêm method `registerWithFacebook()` để lưu access_token
- Sử dụng `RegistrationDataService.saveFacebookRegistration()`

### 3. **RegisterDetailNew.vue** (CẬP NHẬT)

- Cập nhật method `register()` để lưu thông tin email
- Sử dụng `RegistrationDataService.saveEmailRegistration()`

### 4. **RegistrationData.example.ts** (MỚI)

- File hướng dẫn sử dụng với nhiều ví dụ cụ thể
- Vị trí: `/src/utils/helper/RegistrationData.example.ts`

---

## 🚀 Cách sử dụng

### Tại màn Onboarding

```typescript
import { container } from 'tsyringe'
import { RegistrationDataService } from '@/utils/helper/RegistrationData'

// Trong component Vue
const REGISTRATION_SERVICE = container.resolve(RegistrationDataService)

onMounted(async () => {
  /** Lấy dữ liệu đăng ký */
  const DATA = REGISTRATION_SERVICE.getRegistrationData()

  /** Kiểm tra có dữ liệu không */
  if (!DATA) {
    // Chuyển về trang đăng ký nếu không có dữ liệu
    router.push('/oauth/register-new')
    return
  }

  /** Xử lý theo loại đăng ký */
  if (DATA.registration_type === 'email') {
    // Gọi API đăng ký với email
    await API_OAUTH.register(
      DATA.email,
      DATA.password,
      DATA.first_name,
      DATA.last_name
    )
  } else if (DATA.registration_type === 'facebook') {
    // Gọi API đăng ký với Facebook
    await API_OAUTH.registerWithFacebook(DATA.access_token)
  }

  /** Xóa dữ liệu sau khi hoàn tất */
  REGISTRATION_SERVICE.clearRegistrationData()
})
```

---

## 🎯 Onboarding Flow

### Cập nhật dữ liệu Onboarding

Sau khi user hoàn thành 5 bước onboarding, cập nhật thông tin vào storage:

```typescript
// Trong Onboarding.vue
REGISTRATION_SERVICE.updateOnboardingData({
  industry: SELECTED_INDUSTRY.value,
  role: SELECTED_ROLE.value,
  company_name: COMPANY_DETAILS.value.name,
  preferences: SELECTED_PREFERENCES.value,
  company_details: {
    website: COMPANY_DETAILS.value.website,
    facebook: COMPANY_DETAILS.value.facebook,
    instagram: COMPANY_DETAILS.value.instagram,
    tiktok: COMPANY_DETAILS.value.tiktok,
    zalo: COMPANY_DETAILS.value.zalo,
  },
})
```

### Xử lý Submit theo loại đăng ký

```typescript
const REGISTRATION_DATA = REGISTRATION_SERVICE.getRegistrationData()

if (REGISTRATION_DATA.registration_type === 'email') {
  // Đăng ký với email
  await API_OAUTH_BASIC.register(
    REGISTRATION_DATA.email,
    REGISTRATION_DATA.password,
    full_name,
    REGISTRATION_DATA.first_name,
    REGISTRATION_DATA.last_name
  )
  // → Chuyển sang màn xác thực email
} else if (REGISTRATION_DATA.registration_type === 'facebook') {
  // Đăng ký với Facebook
  await API_OAUTH_FB.login(REGISTRATION_DATA.access_token)

  // Cập nhật thông tin onboarding
  await API_OAUTH_BASIC.updateOnboardingInfo({
    industry: REGISTRATION_DATA.industry,
    role: REGISTRATION_DATA.role,
    company_name: REGISTRATION_DATA.company_name,
    // ... các field khác
  })
  // → Chuyển sang màn xác thực SĐT
}
```

---

## 🔄 Luồng hoạt động

### Đăng ký qua Email:

```
RegisterNew.vue (nhập email)
    ↓
RegisterDetailNew.vue (nhập thông tin chi tiết)
    ↓
saveEmailRegistration() → Lưu vào LocalStorage
    ↓
Chuyển sang /onboarding
    ↓
Onboarding.vue → getRegistrationData() → Lấy dữ liệu
    ↓
Gọi API đăng ký
    ↓
clearRegistrationData() → Xóa dữ liệu
```

### Đăng ký qua Facebook:

```
RegisterNew.vue (click nút Facebook)
    ↓
saveFacebookRegistration() → Lưu access_token
    ↓
Chuyển sang /onboarding
    ↓
Onboarding.vue → getRegistrationData() → Lấy dữ liệu
    ↓
Gọi API đăng ký
    ↓
clearRegistrationData() → Xóa dữ liệu
```

---

## 📝 API Reference

### `saveEmailRegistration(email, first_name, last_name, password)`

Lưu thông tin đăng ký qua email

### `saveFacebookRegistration(access_token)`

Lưu access token từ Facebook

### `updateOnboardingData(onboarding_data)`

Cập nhật dữ liệu onboarding vào registration data hiện có

- **Parameters**:
  - `industry`: Ngành nghề
  - `role`: Vai trò
  - `company_name`: Tên công ty
  - `preferences`: Sở thích/Quy mô
  - `company_details`: Object chứa website, facebook, instagram, tiktok, zalo

### `getRegistrationData()`

Lấy dữ liệu đăng ký đã lưu

- **Returns**: `IRegistrationData | null`

### `clearRegistrationData()`

Xóa dữ liệu đăng ký khỏi LocalStorage

---

## ⚠️ Lưu ý quan trọng

1. **Luôn kiểm tra null**: Trước khi sử dụng, luôn kiểm tra `getRegistrationData()` có trả về null không
2. **Xóa sau khi dùng**: Sau khi hoàn tất onboarding, nhớ gọi `clearRegistrationData()`
3. **Dữ liệu tồn tại**: Dữ liệu được lưu trong LocalStorage nên sẽ tồn tại ngay cả khi refresh trang
4. **Type safety**: Sử dụng `registration_type` để xác định loại đăng ký và xử lý logic phù hợp

---

## 🎯 Lợi ích

- ✅ **Tập trung hóa**: Tất cả dữ liệu ở 1 nơi duy nhất
- ✅ **Dễ maintain**: Code gọn gàng, dễ đọc, dễ sửa
- ✅ **Type-safe**: Có TypeScript interface rõ ràng
- ✅ **Linh hoạt**: Dễ dàng mở rộng thêm loại đăng ký khác (Google, Apple...)
- ✅ **Singleton**: Sử dụng dependency injection, đảm bảo chỉ có 1 instance

---

## 📞 Hỗ trợ

Nếu có thắc mắc, tham khảo file `RegistrationData.example.ts` để xem các ví dụ chi tiết.
