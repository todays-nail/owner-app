export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
};

export const LEGAL_OPERATOR_NAME = "오늘네일 운영팀";
export const LEGAL_CONTACT_EMAIL = "galaxydh4110@gmail.com";

export const TERMS_EFFECTIVE_DATE = "2026년 2월 19일";
export const PRIVACY_EFFECTIVE_DATE = "2026년 2월 19일";
export const LEGAL_LAST_UPDATED_DATE = "2026년 2월 19일";

export const TERMS_SUMMARY =
  "본 이용약관은 오늘네일 운영팀이 제공하는 베타 서비스의 이용 조건과 권리·의무를 안내합니다.";

export const PRIVACY_SUMMARY =
  "본 개인정보처리방침은 오늘네일 운영팀이 서비스 제공 과정에서 개인정보를 어떻게 수집·이용·보관·파기하는지 설명합니다.";

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "terms-purpose",
    title: "제1조 (목적 및 적용 범위)",
    paragraphs: [
      "이 약관은 오늘네일 운영팀(이하 \"운영팀\")이 제공하는 오늘네일 서비스의 이용 조건, 절차, 권리·의무 및 책임사항을 규정함을 목적으로 합니다.",
      "본 약관은 오늘네일 iOS 앱과 웹사이트(https://todaysnail.app)에서 제공되는 관련 기능 전반에 적용됩니다."
    ]
  },
  {
    id: "terms-service",
    title: "제2조 (서비스의 성격)",
    paragraphs: [
      "오늘네일은 AI 네일 생성 기반의 베타 서비스로, 고객의 취향 탐색부터 네일 견적·예약·시술 경험으로 이어지는 흐름을 지원합니다.",
      "베타 운영 특성상 일부 기능은 변경, 중단 또는 제한될 수 있으며, 운영팀은 서비스 품질 개선을 위해 기능 구성을 조정할 수 있습니다."
    ]
  },
  {
    id: "terms-account",
    title: "제3조 (회원 계정 및 로그인)",
    paragraphs: [
      "회원은 Apple, Google, Kakao 등 소셜 로그인 수단을 통해 서비스를 이용할 수 있습니다.",
      "회원은 본인 계정의 안전한 관리 책임이 있으며, 계정 도용 또는 무단 사용이 의심되는 경우 즉시 운영팀에 알려야 합니다."
    ]
  },
  {
    id: "terms-use-policy",
    title: "제4조 (이용 정책 및 금지 행위)",
    paragraphs: [
      "회원은 관련 법령, 본 약관, 서비스 내 안내사항을 준수하여야 합니다."
    ],
    items: [
      "타인의 권리를 침해하거나 불법·유해한 콘텐츠를 업로드하는 행위",
      "서비스를 비정상적으로 이용하거나 운영을 방해하는 행위",
      "허위 정보 등록, 타인 사칭, 계정 부정 사용 행위"
    ]
  },
  {
    id: "terms-content",
    title: "제5조 (콘텐츠 및 입력 이미지 처리)",
    paragraphs: [
      "회원이 업로드하거나 입력한 정보(예: 손 사진, 레퍼런스 이미지, 스타일 정보)는 서비스 기능 제공과 품질 개선 목적 범위 내에서 처리됩니다.",
      "회원은 업로드 콘텐츠에 대해 적법한 권리를 보유하고 있어야 하며, 제3자의 권리를 침해하지 않아야 합니다."
    ]
  },
  {
    id: "terms-ai-limit",
    title: "제6조 (AI 결과물 특성 및 책임 제한)",
    paragraphs: [
      "AI 생성 결과는 참고용 이미지이며 실제 시술 결과와 차이가 발생할 수 있습니다.",
      "운영팀은 기술적 한계, 네트워크 장애, 외부 연동 서비스 이슈 등으로 인해 발생한 간접 손해에 대해 법령상 허용되는 범위에서 책임을 제한할 수 있습니다."
    ]
  },
  {
    id: "terms-change",
    title: "제7조 (서비스 변경·중단·점검)",
    paragraphs: [
      "운영팀은 시스템 점검, 기능 개선, 정책 변경 또는 운영상 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.",
      "중요 변경 사항은 서비스 내 공지 또는 문서 갱신을 통해 안내합니다."
    ]
  },
  {
    id: "terms-withdrawal",
    title: "제8조 (이용 해지 및 이용 제한)",
    paragraphs: [
      "회원은 언제든지 서비스 내 회원 탈퇴 절차를 통해 이용 계약을 해지할 수 있습니다.",
      "회원이 약관 또는 법령을 위반하는 경우 운영팀은 사전 또는 사후 통지 후 이용 제한 조치를 할 수 있습니다."
    ]
  },
  {
    id: "terms-dispute",
    title: "제9조 (준거법 및 분쟁 해결)",
    paragraphs: [
      "본 약관은 대한민국 법령에 따라 해석·적용됩니다.",
      "서비스 이용과 관련해 분쟁이 발생한 경우, 당사자 간 성실히 협의하며 협의가 어려운 경우 관련 법령에 따른 관할 법원에서 해결합니다."
    ]
  },
  {
    id: "terms-contact",
    title: "제10조 (문의처)",
    paragraphs: [
      "서비스 및 약관 관련 문의는 아래 채널로 접수할 수 있습니다.",
      `운영 주체: ${LEGAL_OPERATOR_NAME}`,
      `이메일: ${LEGAL_CONTACT_EMAIL}`
    ]
  }
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "privacy-items",
    title: "1. 수집하는 개인정보 항목",
    paragraphs: [
      "운영팀은 서비스 제공을 위해 아래 항목을 수집할 수 있습니다."
    ],
    items: [
      "소셜 로그인 식별 정보(Apple, Google, Kakao 연동 식별값)",
      "프로필 정보(닉네임, 프로필 이미지 URL)",
      "AI 기능 관련 정보(손/레퍼런스 이미지, 생성 결과 및 이용 이력)",
      "푸시 토큰(APNs), 기기 식별값(device id), 서비스 이용 로그"
    ]
  },
  {
    id: "privacy-method",
    title: "2. 개인정보 수집 방법",
    paragraphs: [
      "회원가입 및 로그인, 프로필 편집, AI 기능 사용, 푸시 알림 등록 과정에서 이용자가 직접 입력하거나 기기/시스템으로부터 자동 수집됩니다."
    ]
  },
  {
    id: "privacy-purpose",
    title: "3. 개인정보 이용 목적",
    paragraphs: [
      "수집된 개인정보는 다음 목적에 한해 이용됩니다."
    ],
    items: [
      "회원 식별, 로그인/인증, 계정 관리",
      "AI 네일 생성 기능 제공 및 결과 전달",
      "서비스 품질 개선, 안정성 확보, 오류 대응",
      "고객 문의 대응 및 중요 공지 전달",
      "푸시 알림 제공"
    ]
  },
  {
    id: "privacy-retention",
    title: "4. 개인정보 보유 및 이용 기간",
    paragraphs: [
      "개인정보는 수집·이용 목적 달성 시 또는 회원 탈퇴 시 지체 없이 파기하는 것을 원칙으로 합니다.",
      "단, 관련 법령에 따라 보존이 필요한 경우 법정 보관기간 동안 별도 보관 후 파기합니다."
    ]
  },
  {
    id: "privacy-sharing",
    title: "5. 제3자 제공 및 처리위탁",
    paragraphs: [
      "운영팀은 원칙적으로 이용자의 개인정보를 외부에 판매하거나 임의 제공하지 않습니다.",
      "서비스 운영을 위해 클라우드 인프라, 인증 연동, 알림 전송 등의 업무를 외부 서비스 사업자와 연계하여 처리할 수 있습니다."
    ]
  },
  {
    id: "privacy-rights",
    title: "6. 이용자 권리 및 행사 방법",
    paragraphs: [
      "이용자는 개인정보 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다.",
      `요청은 ${LEGAL_CONTACT_EMAIL}로 접수할 수 있으며, 운영팀은 관련 법령에 따라 지체 없이 처리합니다.`
    ]
  },
  {
    id: "privacy-security",
    title: "7. 개인정보 안전성 확보 조치",
    paragraphs: [
      "운영팀은 개인정보 보호를 위해 접근 통제, 전송 구간 보호, 권한 최소화, 로그 마스킹 등 합리적인 보안 조치를 수행합니다."
    ]
  },
  {
    id: "privacy-children",
    title: "8. 아동의 개인정보 보호",
    paragraphs: [
      "운영팀은 관련 법령이 요구하는 경우 법정대리인 동의 절차를 준수합니다.",
      "연령 제한 또는 추가 확인이 필요한 경우 서비스 이용이 제한될 수 있습니다."
    ]
  },
  {
    id: "privacy-change",
    title: "9. 방침 변경 및 고지",
    paragraphs: [
      "본 방침은 법령, 서비스 정책, 기능 변경에 따라 수정될 수 있습니다.",
      "중요 변경 시 서비스 내 공지 또는 본 페이지 개정을 통해 안내합니다."
    ]
  },
  {
    id: "privacy-contact",
    title: "10. 개인정보 보호 문의처",
    paragraphs: [
      `운영 주체: ${LEGAL_OPERATOR_NAME}`,
      `문의 이메일: ${LEGAL_CONTACT_EMAIL}`
    ]
  }
];
