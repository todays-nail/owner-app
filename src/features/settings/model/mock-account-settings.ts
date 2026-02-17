import type { AccountSettingsDto } from "@/features/settings/model/types";

export const MOCK_ACCOUNT_SETTINGS: AccountSettingsDto = {
  name: "김지수",
  nickname: "지수원장",
  email: "jisoo.nail@example.com",
  profileImageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDocGJa4mildXBUIDru2u8mQ2TcwqPQmHe1x4HP-aSJz_FsJp3e4eUz5GRqsqF_m13LDQNzA_tUdoyLVVD66gNoozjrRp1oEJxJQ7KY_s9YBZgJZkMqO7NaIXZnay_bGXCOAinJZBkMfQK-B22a8xxvmOUT3O_e4t0pSIz1JshqfYTqJiGFyDTaCkhZTjGWEr-znFYd-YB5lp9NPd60qOXZk4NPIopQBXL7UbFLpCILqt_N1qMfqtoqAgWxzrPhWz4IsubI6QmYYfE",
  notifySystemNotice: true,
  notifySecurityNotice: true,
  notifyMarketing: false
};
