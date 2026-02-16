export type ReferenceBadge = "NEW" | "인기" | null;

export const REFERENCE_CATEGORIES = [
  "오피스/미니멀",
  "청순/내추럴",
  "러블리/귀여움",
  "힙/스트릿",
  "시크/모던",
  "키치/유니크",
  "글리터/펄",
  "프렌치",
  "그라데이션/옴브레",
  "웨딩",
  "시즌/홀리데이",
  "포인트아트"
] as const;

export type ReferenceCategory = (typeof REFERENCE_CATEGORIES)[number];
export type ReferenceViewMode = "grid" | "list";

export const REFERENCES_PAGE_SIZE = 8;

export interface DesignReference {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  imageUrls: string[];
  categories: ReferenceCategory[];
  isVisible: boolean;
  badge: ReferenceBadge;
  durationMinutes: number | null;
  description: string;
}

export const INITIAL_REFERENCES: DesignReference[] = [
  {
    id: "reference-1",
    name: "봄맞이 벚꽃 에디션",
    price: 65000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvlrkFG2HNU3dlHcpLOy9_jfd0Vm5k81Y0WtTrh_es7v6Yh2bJ9QsF19Fy0Ao65LPI_nkc1BmUsN0nNBPXv4UJoWuM3IWXXNqu3FDFjeULmkfA9gDr-1pqYrrr_sDJXwCyWHTgXnFDouMKy_2d5WPNroskJuc9dLIMbYZm7LfwCPLnMIztpI-bF4C2Fnq9MRQ-sMHo6HRuoVot9pji839vbUSbuqnKhFgvEJw7JUxtje9R59d2TEOgfIwVVpPWxHG4njUaaHVNYWo",
    imageUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAvlrkFG2HNU3dlHcpLOy9_jfd0Vm5k81Y0WtTrh_es7v6Yh2bJ9QsF19Fy0Ao65LPI_nkc1BmUsN0nNBPXv4UJoWuM3IWXXNqu3FDFjeULmkfA9gDr-1pqYrrr_sDJXwCyWHTgXnFDouMKy_2d5WPNroskJuc9dLIMbYZm7LfwCPLnMIztpI-bF4C2Fnq9MRQ-sMHo6HRuoVot9pji839vbUSbuqnKhFgvEJw7JUxtje9R59d2TEOgfIwVVpPWxHG4njUaaHVNYWo"
    ],
    categories: ["시즌/홀리데이", "청순/내추럴"],
    isVisible: true,
    badge: "인기",
    durationMinutes: 60,
    description: "봄 시즌용 파스텔톤 벚꽃 포인트를 더한 인기 디자인입니다."
  },
  {
    id: "reference-2",
    name: "골드 라인 프렌치",
    price: 55000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHJeV8pLdCH0frSzBeyxIDPt4cZn0vRRWJB9VxjvDaG-aFeNX-k-p5fbAF40Ye1S50fFjERwr7rK0FrlcfNixEp0DMatyvOlCUJw5hP0EeTJokZhumJyYUtly_QMwPD0UUKXxkEzqXhV6G2Qg7cUarvz0VIXXilY1CQKZ-2XLUrNMSenARnfRl0aKHNcrQsv1ujnwJy4-9C5mGHX-prqmyJsNSc_YUKS7EJFa0HhMKvohLjBBOoLODzQQ_OZOlbpinCdkXPJGr1rc",
    imageUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBHJeV8pLdCH0frSzBeyxIDPt4cZn0vRRWJB9VxjvDaG-aFeNX-k-p5fbAF40Ye1S50fFjERwr7rK0FrlcfNixEp0DMatyvOlCUJw5hP0EeTJokZhumJyYUtly_QMwPD0UUKXxkEzqXhV6G2Qg7cUarvz0VIXXilY1CQKZ-2XLUrNMSenARnfRl0aKHNcrQsv1ujnwJy4-9C5mGHX-prqmyJsNSc_YUKS7EJFa0HhMKvohLjBBOoLODzQQ_OZOlbpinCdkXPJGr1rc"
    ],
    categories: ["오피스/미니멀", "프렌치"],
    isVisible: true,
    badge: null,
    durationMinutes: 50,
    description: "골드 라인으로 마감한 깔끔한 프렌치 스타일입니다."
  },
  {
    id: "reference-3",
    name: "겨울 무드 체크",
    price: 70000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBs5EHBJtc2pgRTRaUpcNkzagffay43ufGvSobnLoci_tGAMaw740o8QRRNi6YHxjnmsKFBQDNbEndx389z5LzUR_hwzP7YA7DGnLEkfZVqr-Wyc8oww4-26GNBKusuhIs_eGdNZD25OBu4DjBMaqIBETy608J8KvojItvcv3LKV6K1QuqneD5Pkq8ylguHioau3IJeBvBZ_0VOB3_7d6cWA621YFyse4yLM15mpkJQWgr-Jg5Q2QbMj6D3XD7H8doCUQ1PYVYyXtE",
    imageUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBs5EHBJtc2pgRTRaUpcNkzagffay43ufGvSobnLoci_tGAMaw740o8QRRNi6YHxjnmsKFBQDNbEndx389z5LzUR_hwzP7YA7DGnLEkfZVqr-Wyc8oww4-26GNBKusuhIs_eGdNZD25OBu4DjBMaqIBETy608J8KvojItvcv3LKV6K1QuqneD5Pkq8ylguHioau3IJeBvBZ_0VOB3_7d6cWA621YFyse4yLM15mpkJQWgr-Jg5Q2QbMj6D3XD7H8doCUQ1PYVYyXtE"
    ],
    categories: ["포인트아트", "시크/모던"],
    isVisible: false,
    badge: null,
    durationMinutes: 70,
    description: "체크 패턴과 딥 톤 컬러를 조합한 겨울 무드 디자인입니다."
  },
  {
    id: "reference-4",
    name: "마블 스톤 아트",
    price: 85000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjVuMQBWTuP51j2DyEfgLN4wMCKhza2yPzmxQWOtNFly3ViYsrfiMWwtg9dg83MuTlaox91QQkJri2J0TRnbZE9NU2JK76x-3OMb1whPE1l040XdbCdp8QtUveddJ_Gi6EKmpEavexSVXIC64jTJo_7MOV19aiwD9r0Q0erIvjygr_CBDHpaXAYAbHB2HhUMIKqtBEobRpA0_6rvMm_Td9gb5c2nrufxURkUJxKHSmsTSL3TDl_Z1yLs7BG6Ld21y9tE7DX_M75r0",
    imageUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjVuMQBWTuP51j2DyEfgLN4wMCKhza2yPzmxQWOtNFly3ViYsrfiMWwtg9dg83MuTlaox91QQkJri2J0TRnbZE9NU2JK76x-3OMb1whPE1l040XdbCdp8QtUveddJ_Gi6EKmpEavexSVXIC64jTJo_7MOV19aiwD9r0Q0erIvjygr_CBDHpaXAYAbHB2HhUMIKqtBEobRpA0_6rvMm_Td9gb5c2nrufxURkUJxKHSmsTSL3TDl_Z1yLs7BG6Ld21y9tE7DX_M75r0"
    ],
    categories: ["포인트아트", "시크/모던"],
    isVisible: true,
    badge: null,
    durationMinutes: 80,
    description: "마블 텍스처를 중심으로 완성한 고급 무드 아트입니다."
  },
  {
    id: "reference-5",
    name: "큐트 베어 파츠",
    price: 79000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2MJB4mYKPvD68ZzBlTiG-1_8ES_THZ7Zc6kbjNT3u_YohAWSWkSCtHVDktQY9Sex8M5lrAo3f3mfzicnD5xW5gk8jFojS3MLOypuhuEGrIc28k9wIP_iuBaX414McLdYrczw-vloZgWWNrIyb3eHj8hRB5QT44riQ3_QfryltTODaPkSbibds6UiD2DSISw4R-Gy5Fp2MgZOThFrlLLwJu7fbEE0f9iTxrXv702lOvqDJxIPTuWTRT9tTquntwScW-8BfNU-e9RU",
    imageUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD2MJB4mYKPvD68ZzBlTiG-1_8ES_THZ7Zc6kbjNT3u_YohAWSWkSCtHVDktQY9Sex8M5lrAo3f3mfzicnD5xW5gk8jFojS3MLOypuhuEGrIc28k9wIP_iuBaX414McLdYrczw-vloZgWWNrIyb3eHj8hRB5QT44riQ3_QfryltTODaPkSbibds6UiD2DSISw4R-Gy5Fp2MgZOThFrlLLwJu7fbEE0f9iTxrXv702lOvqDJxIPTuWTRT9tTquntwScW-8BfNU-e9RU"
    ],
    categories: ["러블리/귀여움", "키치/유니크"],
    isVisible: true,
    badge: null,
    durationMinutes: 75,
    description: "베어 파츠를 포인트로 넣은 러블리 무드 디자인입니다."
  },
  {
    id: "reference-6",
    name: "딥 그린 글리터",
    price: 60000,
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjMZylWULudRxSDVPsmQkUXiOloENf-jKWv3scTRJCzHBQ8NwZ_8J-xNU6I1_6Y05M6Pr8Wm4zSE93jAL3BTypPEcrBMRu41Rj6h7bLCe5b8Y6SMlan7BUiOA36wbh_yhmMdPbcOy75hHaxGjBVKrVgZooJ9wH7sp-haATjIzw1bvvT4H65UgiwRym_oSdPk4Bn3JxsewvmRklFo5ZV2AHeRMi06001iJdbjrWQDhRyrd9zflCAOwA_CrShtFT888Y4sRxDsTAJy0",
    imageUrls: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAjMZylWULudRxSDVPsmQkUXiOloENf-jKWv3scTRJCzHBQ8NwZ_8J-xNU6I1_6Y05M6Pr8Wm4zSE93jAL3BTypPEcrBMRu41Rj6h7bLCe5b8Y6SMlan7BUiOA36wbh_yhmMdPbcOy75hHaxGjBVKrVgZooJ9wH7sp-haATjIzw1bvvT4H65UgiwRym_oSdPk4Bn3JxsewvmRklFo5ZV2AHeRMi06001iJdbjrWQDhRyrd9zflCAOwA_CrShtFT888Y4sRxDsTAJy0"
    ],
    categories: ["글리터/펄", "시크/모던"],
    isVisible: true,
    badge: "NEW",
    durationMinutes: 55,
    description: "딥 그린 베이스에 글리터를 더한 시크한 시즌 디자인입니다."
  }
];
