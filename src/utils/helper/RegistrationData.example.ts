/**
 * HƯỚNG DẪN SỬ DỤNG REGISTRATION DATA SERVICE
 *
 * File này hướng dẫn cách lấy và sử dụng dữ liệu đăng ký đã được lưu
 * từ RegisterNew.vue và RegisterDetailNew.vue ở màn onboarding
 */

import { container } from 'tsyringe'
import {
  RegistrationDataService,
  type IRegistrationDataService,
  type IRegistrationData,
} from '@/utils/helper/RegistrationData'

/** Khởi tạo service */
const REGISTRATION_SERVICE: IRegistrationDataService = container.resolve(
  RegistrationDataService
)

/**
 * VÍ DỤ 1: Lấy dữ liệu đăng ký trong component Vue
 */
export function exampleGetRegistrationDataInVue() {
  /** Lấy dữ liệu đăng ký */
  const REGISTRATION_DATA = REGISTRATION_SERVICE.getRegistrationData()

  /** Kiểm tra có dữ liệu không */
  if (!REGISTRATION_DATA) {
    console.log('Không có dữ liệu đăng ký')
    return
  }

  /** Xử lý theo loại đăng ký */
  if (REGISTRATION_DATA.registration_type === 'email') {
    console.log('Đăng ký bằng email:')
    console.log('Email:', REGISTRATION_DATA.email)
    console.log('Tên:', REGISTRATION_DATA.first_name)
    console.log('Họ:', REGISTRATION_DATA.last_name)
    console.log('Mật khẩu:', REGISTRATION_DATA.password)
  } else if (REGISTRATION_DATA.registration_type === 'facebook') {
    console.log('Đăng ký bằng Facebook:')
    console.log('Access Token:', REGISTRATION_DATA.access_token)
  }

  /** Thời gian đăng ký */
  console.log('Đăng ký lúc:', new Date(REGISTRATION_DATA.registered_at))
}

/**
 * VÍ DỤ 2: Sử dụng trong onMounted của Vue component
 */
export function exampleOnboardingComponent() {
  // Trong <script setup>
  // import { onMounted } from 'vue'
  // import { container } from 'tsyringe'
  // import { RegistrationDataService } from '@/utils/helper/RegistrationData'
  // const REGISTRATION_SERVICE = container.resolve(RegistrationDataService)
  // onMounted(() => {
  //   /** Lấy dữ liệu đăng ký */
  //   const DATA = REGISTRATION_SERVICE.getRegistrationData()
  //
  //   if (!DATA) {
  //     // Chuyển hướng về trang đăng ký nếu không có dữ liệu
  //     router.push('/oauth/register-new')
  //     return
  //   }
  //
  //   /** Gọi API đăng ký với dữ liệu đã lưu */
  //   if (DATA.registration_type === 'email') {
  //     await API.register(
  //       DATA.email,
  //       DATA.password,
  //       DATA.first_name,
  //       DATA.last_name
  //     )
  //   } else if (DATA.registration_type === 'facebook') {
  //     await API.registerWithFacebook(DATA.access_token)
  //   }
  //
  //   /** Sau khi hoàn tất, xóa dữ liệu đăng ký */
  //   REGISTRATION_SERVICE.clearRegistrationData()
  // })
}

/**
 * VÍ DỤ 3: Sử dụng trong class
 */
class OnboardingService {
  /**
   * Constructor
   * @param SERVICE_REGISTRATION - Service quản lý dữ liệu đăng ký
   */
  constructor(
    private readonly SERVICE_REGISTRATION: IRegistrationDataService = container.resolve(
      RegistrationDataService
    )
  ) {}

  /**
   * Xử lý onboarding
   */
  async processOnboarding() {
    /** Lấy dữ liệu đăng ký */
    const DATA = this.SERVICE_REGISTRATION.getRegistrationData()

    /** Kiểm tra dữ liệu */
    if (!DATA) throw new Error('Không có dữ liệu đăng ký')

    /** Xử lý theo loại đăng ký */
    if (DATA.registration_type === 'email') {
      /** Gọi API đăng ký email */
      await this.registerWithEmail(DATA)
    } else {
      /** Gọi API đăng ký Facebook */
      await this.registerWithFacebook(DATA)
    }

    /** Xóa dữ liệu sau khi hoàn tất */
    this.SERVICE_REGISTRATION.clearRegistrationData()
  }

  /**
   * Đăng ký với email
   * @param data - Dữ liệu đăng ký
   */
  private async registerWithEmail(data: IRegistrationData) {
    console.log('Đăng ký với email:', data.email)
    // Gọi API đăng ký
  }

  /**
   * Đăng ký với Facebook
   * @param data - Dữ liệu đăng ký
   */
  private async registerWithFacebook(data: IRegistrationData) {
    console.log('Đăng ký với Facebook token:', data.access_token)
    // Gọi API đăng ký
  }
}

/**
 * LƯU Ý QUAN TRỌNG:
 *
 * 1. Luôn kiểm tra REGISTRATION_DATA có tồn tại không trước khi sử dụng
 * 2. Sau khi hoàn tất onboarding, nhớ gọi clearRegistrationData() để xóa dữ liệu
 * 3. Dữ liệu được lưu trong LocalStorage nên sẽ tồn tại ngay cả khi refresh trang
 * 4. Có thể kiểm tra registration_type để xử lý logic khác nhau cho email và Facebook
 */
