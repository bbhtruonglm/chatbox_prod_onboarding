import { singleton } from 'tsyringe'
import { LocalStorage, type ILocalStorage } from './LocalStorage'
import { container } from 'tsyringe'

/** Loại đăng ký */
export type TRegistrationType = 'email' | 'facebook'

/** Dữ liệu đăng ký tập trung */
export interface IRegistrationData {
  /** Loại đăng ký: 'email' | 'facebook' */
  registration_type: TRegistrationType
  /** Email người dùng */
  email?: string
  /** Tên */
  first_name?: string
  /** Họ */
  last_name?: string
  /** Mật khẩu (chỉ cho email) */
  password?: string
  /** Access token (chỉ cho facebook) */
  access_token?: string
  /** Thời gian đăng ký */
  registered_at: number

  /** === Onboarding Data === */
  /** Ngành nghề */
  industry?: string
  /** Vai trò */
  role?: string
  /** Tên công ty */
  company_name?: string
  /** Sở thích/Quy mô */
  preferences?: string
  /** Chi tiết công ty */
  company_details?: {
    /** Website */
    website?: string
    /** Facebook */
    facebook?: string
    /** Instagram */
    instagram?: string
    /** TikTok */
    tiktok?: string
    /** Zalo */
    zalo?: string
  }

  /** === Package Selection Data === */
  /** Gói đã chọn */
  package_selected?: string
  /** Số lượng nhân viên (cho Enterprise) */
  employee_count?: string
  /** Số tháng đăng ký (cho Enterprise) */
  subscription_months?: string
  /** Ghi chú cho Enterprise */
  enterprise_notes?: string
}

/** Interface quản lý dữ liệu đăng ký */
export interface IRegistrationDataService {
  /**
   * Lưu dữ liệu đăng ký email
   * @param email - Email người dùng
   * @param first_name - Tên
   * @param last_name - Họ
   * @param password - Mật khẩu
   */
  saveEmailRegistration(
    email: string,
    first_name: string,
    last_name: string,
    password: string
  ): void

  /**
   * Lưu dữ liệu đăng ký facebook
   * @param access_token - Access token từ facebook
   */
  saveFacebookRegistration(access_token: string): void

  /**
   * Cập nhật dữ liệu onboarding
   * @param onboarding_data - Dữ liệu onboarding
   */
  updateOnboardingData(onboarding_data: {
    industry?: string
    role?: string
    company_name?: string
    preferences?: string
    company_details?: {
      website?: string
      facebook?: string
      instagram?: string
      tiktok?: string
      zalo?: string
    }
    package_info?: {
      package_selected?: string
      employee_count?: string
      subscription_months?: string
      enterprise_notes?: string
    }
  }): void

  /**
   * Lấy dữ liệu đăng ký
   * @returns Dữ liệu đăng ký hoặc null nếu không có
   */
  getRegistrationData(): IRegistrationData | null

  /**
   * Xóa dữ liệu đăng ký
   */
  clearRegistrationData(): void
}

/** Key lưu trữ trong LocalStorage */
const REGISTRATION_DATA_KEY = 'REGISTRATION_DATA'

/** Service quản lý dữ liệu đăng ký tập trung */
@singleton()
export class RegistrationDataService implements IRegistrationDataService {
  /**
   * Constructor
   * @param SERVICE_LOCAL_STORAGE - Service quản lý LocalStorage
   */
  constructor(
    private readonly SERVICE_LOCAL_STORAGE: ILocalStorage = container.resolve(
      LocalStorage
    )
  ) {}

  /**
   * Lưu dữ liệu đăng ký email
   * @param email - Email người dùng
   * @param first_name - Tên
   * @param last_name - Họ
   * @param password - Mật khẩu
   */
  saveEmailRegistration(
    email: string,
    first_name: string,
    last_name: string,
    password: string
  ): void {
    /** Dữ liệu đăng ký */
    const REGISTRATION_DATA: IRegistrationData = {
      registration_type: 'email',
      email,
      first_name,
      last_name,
      password,
      registered_at: Date.now(),
    }

    /** Lưu vào LocalStorage */
    this.SERVICE_LOCAL_STORAGE.setItem(REGISTRATION_DATA_KEY, REGISTRATION_DATA)
  }

  /**
   * Lưu dữ liệu đăng ký facebook
   * @param access_token - Access token từ facebook
   */
  saveFacebookRegistration(access_token: string): void {
    /** Dữ liệu đăng ký */
    const REGISTRATION_DATA: IRegistrationData = {
      registration_type: 'facebook',
      access_token,
      registered_at: Date.now(),
    }

    /** Lưu vào LocalStorage */
    this.SERVICE_LOCAL_STORAGE.setItem(REGISTRATION_DATA_KEY, REGISTRATION_DATA)
  }

  /**
   * Cập nhật dữ liệu onboarding
   * @param onboarding_data - Dữ liệu onboarding
   */
  updateOnboardingData(onboarding_data: {
    industry?: string
    role?: string
    company_name?: string
    preferences?: string
    company_details?: {
      website?: string
      facebook?: string
      instagram?: string
      tiktok?: string
      zalo?: string
    }
    package_info?: {
      package_selected?: string
      employee_count?: string
      subscription_months?: string
      enterprise_notes?: string
    }
  }): void {
    /** Lấy dữ liệu hiện tại */
    const CURRENT_DATA = this.getRegistrationData()

    /** Nếu không có dữ liệu hiện tại thì không làm gì */
    if (!CURRENT_DATA) {
      console.warn('Không có dữ liệu đăng ký để cập nhật onboarding')
      return
    }

    /** Merge dữ liệu mới vào dữ liệu cũ */
    const UPDATED_DATA: IRegistrationData = { ...CURRENT_DATA }

    /** Cập nhật industry */
    if (onboarding_data.industry !== undefined)
      UPDATED_DATA.industry = onboarding_data.industry
    /** Cập nhật role */
    if (onboarding_data.role !== undefined)
      UPDATED_DATA.role = onboarding_data.role
    /** Cập nhật company_name */
    if (onboarding_data.company_name !== undefined)
      UPDATED_DATA.company_name = onboarding_data.company_name
    /** Cập nhật preferences */
    if (onboarding_data.preferences !== undefined)
      UPDATED_DATA.preferences = onboarding_data.preferences

    /** Cập nhật company_details */
    if (onboarding_data.company_details) {
      UPDATED_DATA.company_details = {
        ...(UPDATED_DATA.company_details || {}),
        ...onboarding_data.company_details,
      }
    }

    /** Cập nhật package_info */
    if (onboarding_data.package_info) {
      /** Cập nhật package_selected */
      if (onboarding_data.package_info.package_selected !== undefined)
        UPDATED_DATA.package_selected =
          onboarding_data.package_info.package_selected
      /** Cập nhật employee_count */
      if (onboarding_data.package_info.employee_count !== undefined)
        UPDATED_DATA.employee_count =
          onboarding_data.package_info.employee_count
      /** Cập nhật subscription_months */
      if (onboarding_data.package_info.subscription_months !== undefined)
        UPDATED_DATA.subscription_months =
          onboarding_data.package_info.subscription_months
      /** Cập nhật enterprise_notes */
      if (onboarding_data.package_info.enterprise_notes !== undefined)
        UPDATED_DATA.enterprise_notes =
          onboarding_data.package_info.enterprise_notes
    }

    /** Lưu lại vào LocalStorage */
    this.SERVICE_LOCAL_STORAGE.setItem(REGISTRATION_DATA_KEY, UPDATED_DATA)
  }

  /**
   * Lấy dữ liệu đăng ký
   * @returns Dữ liệu đăng ký hoặc null nếu không có
   */
  getRegistrationData(): IRegistrationData | null {
    /** Lấy dữ liệu từ LocalStorage */
    const DATA = this.SERVICE_LOCAL_STORAGE.getItem<IRegistrationData>(
      REGISTRATION_DATA_KEY
    )

    /** Trả về dữ liệu hoặc null */
    return DATA ?? null
  }

  /**
   * Xóa dữ liệu đăng ký
   */
  clearRegistrationData(): void {
    /** Xóa dữ liệu khỏi LocalStorage */
    this.SERVICE_LOCAL_STORAGE.setItem(REGISTRATION_DATA_KEY, undefined)
  }
}
