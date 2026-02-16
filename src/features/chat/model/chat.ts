export type ConversationStatus = "new" | "quoted" | "selected";
export type ChatMessageType = "request" | "system" | "quote" | "text";

export interface QuoteLineItem {
  label: string;
  price: number;
}

export interface QuotePayload {
  total: number;
  items: QuoteLineItem[];
  validUntil: string;
}

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  sender: "owner" | "customer" | "system";
  timeLabel?: string;
  text?: string;
  quote?: QuotePayload;
}

export interface ConversationPreview {
  id: string;
  customerName: string;
  avatarUrl: string;
  referenceImageUrl: string;
  tags: string[];
  lastMessage: string;
  timeLabel: string;
  status: ConversationStatus;
  isOnline?: boolean;
}

export interface ConversationDetail {
  styleMood: string;
  removalPolicy: string;
  lengthShape: string;
  artInfo: string;
  requestPriceRange: string;
  requestDate: string;
}

export interface Conversation {
  preview: ConversationPreview;
  detail: ConversationDetail;
  messages: ChatMessage[];
}

export const QUOTE_OPTION_PRICES = {
  selfRemoval: 5000,
  otherShopRemoval: 10000,
  extension: 50000,
  artPerUnit: 7000
} as const;

export const CONVERSATIONS: Conversation[] = [
  {
    preview: {
      id: "customer-kim-jisoo",
      customerName: "김지수 고객님",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC9wTdSa2lFpYPcpGb7LI7HsWsvByldtnby6AO3gSt9kyypT5z2lDuImp871_D6AQ-73XoVYyo0Rw4GFwepYioEkdUI-t1PQbd9yJXdRklBIP4nGKwtWTjDpCjDEq6uHr73vPKt9l3wuf0jv2DvswnbVPpiFt0UGMBS6dNk64nPGIrYSqV9bIs8Yu6ny13PZ2zrIjUV-x31vxZFdBgdxbeAnmWTGKddByjwPSGmaMkc5uKt96sl8XkDGq5PjJAk9krrDpAj8erGMM8",
      referenceImageUrl: "/images/chat/minimal-two-color-nails.svg",
      tags: ["#미니멀", "#시럽"],
      lastMessage: "견적 확인 부탁드립니다!",
      timeLabel: "14:30",
      status: "new",
      isOnline: true
    },
    detail: {
      styleMood: "심플/미니멀",
      removalPolicy: "자샵 제거 필요",
      lengthShape: "숏 / 라운드",
      artInfo: "컬러 2개 추가",
      requestPriceRange: "₩70,000 ~ ₩90,000",
      requestDate: "5/24(금) 오후"
    },
    messages: [
      {
        id: "request-card",
        type: "request",
        sender: "customer",
        timeLabel: "오후 2:15"
      },
      {
        id: "quote-sent-divider",
        type: "system",
        sender: "system",
        text: "견적이 전송되었습니다"
      },
      {
        id: "quote-card",
        type: "quote",
        sender: "owner",
        timeLabel: "오후 2:25",
        quote: {
          total: 74000,
          validUntil: "오늘 23:59",
          items: [
            { label: "기본 케어 + 시럽", price: 55000 },
            { label: "자샵 제거", price: 5000 },
            { label: "디자인 아트 추가 (2개)", price: 14000 }
          ]
        }
      }
    ]
  },
  {
    preview: {
      id: "customer-park-yeonwoo",
      customerName: "박연우 고객님",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCnvZc3wbbVpXZCvaYxO-5tTfmXj7y-AJrxLAM4zvI27Oq9vN5hskQqPR0AP_g3zCB1B5GhcFnMROvsBonzbpWS1KylBsPziyMIx67ha-zGyJMSaGZ7tSSJ2XO4aDJDG_KrmztDS82oVNFe1FpRoPpyJ-JBm3IQJItiMju2IRZAW2JSXNi9lHjqmCaYY_wH1hH5oILDeLuWPDy8RUG7PVSZw8rWM-VFl8vzfFJd27OScH6uW-nGt4J7IywhnIx0B5UzUnfHdx6_I-I",
      referenceImageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBvP9b1m2h9S_L73TiFyN-MyEpoEc7A8H3J98kaPzweGmXvzvCXJlfkv-u45f4VEfXvqKM_2pp6Eoi5dGM0zjzS1E-BhAG6oVaYiE_ub_nczmFP0YKysVvDkrdKZUA-onTLHFhcgXefQXTdUiz0bcaXbgvw1F8oeCpNy5CHXBlHFcaTCn83w3j9SJQfxvlLM2x6ZvHTjRtJikIin3OmONngZvMAqzwfk4uMPKhTQ_OI3H0q1bXAAnR9mRDL20bQsKS3jqC3-6wxOJo",
      tags: ["#화려함", "#파츠"],
      lastMessage: "예약 확정 부탁드려요.",
      timeLabel: "12:15",
      status: "quoted"
    },
    detail: {
      styleMood: "화려함/파츠",
      removalPolicy: "타샵 제거 필요",
      lengthShape: "미디움 / 오벌",
      artInfo: "파츠 아트",
      requestPriceRange: "₩90,000 ~ ₩120,000",
      requestDate: "5/25(토) 오전"
    },
    messages: [
      {
        id: "park-message-1",
        type: "text",
        sender: "customer",
        timeLabel: "오후 12:00",
        text: "화려한 파츠 디자인으로 견적 부탁드립니다."
      },
      {
        id: "park-message-2",
        type: "text",
        sender: "owner",
        timeLabel: "오후 12:10",
        text: "파츠 포함해서 10만원대 예상됩니다. 상세 견적서 보낼게요."
      }
    ]
  },
  {
    preview: {
      id: "customer-lee-seohyeon",
      customerName: "이서현 고객님",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC7v1xuhdeI7WycS5jOlAqbKfrVBXBuOLYQMJU5AxSMvwDqdNjumexv6LFAYlrQKt8AICiHB7Bl91vTsCzZ1uR9QyQy2SovIPBZMl_oaiIDEDNHgq7bc_KUM8_bkq9B46hRyXUZyf6fonrwHoRhWqdd58hz_eEHreEdBtW2wrmfY0wYI2BFGloKSRCOScTbfHXrWw-mrh_gw7RmW7wxOpVvpHrOojHrUqePmdioa71aoZYKXFaDe0xM5Z0OiTOqNjjnpXGbAHo6VSE",
      referenceImageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCnvZc3wbbVpXZCvaYxO-5tTfmXj7y-AJrxLAM4zvI27Oq9vN5hskQqPR0AP_g3zCB1B5GhcFnMROvsBonzbpWS1KylBsPziyMIx67ha-zGyJMSaGZ7tSSJ2XO4aDJDG_KrmztDS82oVNFe1FpRoPpyJ-JBm3IQJItiMju2IRZAW2JSXNi9lHjqmCaYY_wH1hH5oILDeLuWPDy8RUG7PVSZw8rWM-VFl8vzfFJd27OScH6uW-nGt4J7IywhnIx0B5UzUnfHdx6_I-I",
      tags: ["#웨딩", "#그라데이션"],
      lastMessage: "감사합니다! 금요일에 뵐게요.",
      timeLabel: "어제",
      status: "selected"
    },
    detail: {
      styleMood: "웨딩/그라데이션",
      removalPolicy: "제거 없음",
      lengthShape: "숏 / 스퀘어",
      artInfo: "진주 포인트",
      requestPriceRange: "₩80,000 ~ ₩100,000",
      requestDate: "5/23(목) 오후"
    },
    messages: [
      {
        id: "lee-message-1",
        type: "text",
        sender: "customer",
        timeLabel: "어제",
        text: "보내주신 견적으로 예약 확정하고 싶어요."
      },
      {
        id: "lee-message-2",
        type: "text",
        sender: "owner",
        timeLabel: "어제",
        text: "확인했습니다. 당일 10분 전에 방문 부탁드립니다."
      }
    ]
  }
];
