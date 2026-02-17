import Image from "next/image";
import Link from "next/link";

import SentenceLines from "@/components/ui/sentence-lines";
import { createPageMetadata } from "@/lib/metadata";
import ExploreCategoriesCarousel from "@/app/(public)/user/_components/explore-categories-carousel";

function isExternalUrl(href: string) {
  return /^https?:\/\//.test(href);
}

function ActionLink({
  href,
  className,
  children
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  if (isExternalUrl(href)) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

const customerAppUrl = process.env.NEXT_PUBLIC_CUSTOMER_APP_URL?.trim() ?? "";
const bookingHref = customerAppUrl || "/login";
const defaultAppStoreHref = "https://apps.apple.com/kr/search?term=oneul%20nail";
const defaultPlayStoreHref = "https://play.google.com/store/search?q=oneul%20nail&c=apps";
const appStoreHref = process.env.NEXT_PUBLIC_APPSTORE_URL?.trim() || defaultAppStoreHref;
const playStoreHref = process.env.NEXT_PUBLIC_PLAYSTORE_URL?.trim() || defaultPlayStoreHref;
const exploreCategories = [
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
];
const buttonBase =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40";
const buttonText =
  "text-sm font-bold text-[#171211] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md";
const buttonPrimary = `${buttonBase} rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:brightness-[0.98]`;
const storeBadgeLink =
  "inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";
const appStoreBadgeImage = "h-14 w-auto";
const playStoreBadgeImage = "h-[5rem] w-auto";
const timeButtonBase =
  "cursor-default rounded-lg border py-3 text-sm focus-visible:outline-none";
const timeButtonDefault = `${timeButtonBase} border-[#f4f1f0] font-medium`;
const timeButtonSelected = `${timeButtonBase} border-primary bg-primary font-bold text-white`;
const timeButtonDisabled = `${timeButtonBase} border-[#f4f1f0] font-medium opacity-30`;

const discoverDesignImages = [
  {
    alt: "Nail art with pastel colors and flower design",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0aF0sAdWpo_g9sfqLyngee8b6bpKH1UF-yOLffTFQhuND-guD1MGXTxSU792tyRw2u22eC_EoXlUkHU2AcI8jEzWtdLJ17qS96uND1nGDTNHEDAAk8qaGPmUSMaosXBOqT1Ptem7K_hpFopEIrolG4OiCBl7sCXwOkUhe_sbU1yIGLE5BSDX9YWgo7ozuwWkQp_D8B-xu1T8kKCmbweD9Kuks9gmloeEsuzqavhptc2Ltb4zrFLYlxZkA5Ov9RtLBEXf2nLl1CSz5"
  },
  {
    alt: "Elegant beige nude nail polish",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUmaDrkSo0kjiFTBxcHJ1q58kCouvlWHWGDhHiAhq_4wC8UV5uncH4xPIRpBHUZkCeoLEUVvO6voIJpWCKCuqFS5EfexKFlYY6Oh0MC57VYerLxPtXuGpyCQoBJzxDmXcJP7IYr7Vocrut-CkWG-m0CXOYSpB9o_Ohjy5g8Ajs_XCWyU-XooUMr-HzA5-bxqq0nVw7u5gIsOapV1nlXcWafonICsrT3xFHl-J0VaNcpXdrDZVgmjSc1m7xerPcKgqbKU0-fhkarhoq"
  },
  {
    alt: "French manicure with minimalist white tips",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn43_H5HACNb6Q_TcYYM6v1TEdDFxm8-HQKJ9qDHA5T-BCIldVBwKja_Qx9VAvH8WhAx1ysWvv6EuV6SfLt59DDMpq-_SddJoMVeYSdvMmh9gOC-1adLrh0JxAmEM58EKzLQvKEXaDJ10Z1V7vwq1WhzZ4hK4l0SKR6iVKXVNORdescbI_JIHRN9PeFThywAtaMttCYy6QmLB8u3HnqUL7UA8121EnUnrx91gOwgStbY8aAL9AcvMEUVHW4JIFNMSCvgNtwiIBOtpq"
  },
  {
    alt: "Glossy pink gradient nail art",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI976Jp_0_Obq85eSzhqaWusfk6NsRTN0GHnA7Z3uFzsyAn2Y98gCo8mo_Mcii8eMRhEgPLZvQLOUstmZN5gRjKH2vm4XzQAJTByosJDc37pC891s1E-bl_lK3vuA9kyhtWiQsYFPSpcSLInDEcgbx3waPygbBkvjvRl-lSsP-UAOq8RD994dSwrCVTfSuC191rxCiIrGfsTlecJ_AjHo-ARtegJiLRlOuHRLs9sKiTr6FWby8MJmD5Ox2Ut-BW7nAxqZVYDhwWSXS"
  },
  {
    alt: "Glittery chrome finish nail design",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDX3zdJVzAcNZwwxPAY5yN1CC-d6HpJASTVvYYdkgc5WwzaSBt2gb146hfnq5a2qXO-1qAM1IL3Yc73ffF01t6bk8_aBoIcO82NbS5RpM4p6fDwaasGiote57dh1NbrdUGT15AEX7JdY2AV5a0yxtH-T_ZhtKHVQtoGIA3-5ZvuzTuHfGL6F8XNFSwAPF72LpW8Yrj5SnjYiIzMhpnQbs_z0sxjuqrysbx-USMT2YLAUL1FUHSCzp4nOIl4zPtebkxV8GPbwNfL43GE"
  },
  {
    alt: "Modern geometric nail patterns",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5V9zrh38DBRG51ot2CUutwmTXBbdsdt6AMkrKGXl-N631qCxBfQ-uN37BApPQHOYJiBd851zEp-6P-EO5Dupt42K-rwlgAhcKgMKcBwmCk1mT13sB6shXlBmS6GRgFwAu_rdmZBImQX79kriBqM-VKQr8bzNsVn4Mx3BwaV4Rsn9AXMqDTokhUhDgR5J-IgnExelu1bG_8ZlqKQwpEKrOC5NutWHv-KyM1dj_arvTOuAmUTEqu8u9Lc1zc764W2Y0TfQxDF0mIQ_d"
  }
];

export const metadata = createPageMetadata({
  title: "Oneul Nail - AI 피팅 서비스로 미리보고 원하는 시간에 바로 예약",
  description: "내 취향 탐색부터 AI 피팅, 투명한 가격 확인과 예약까지 한 번에.",
  noIndex: false
});

export default function UserMarketingPage() {
  return (
    <div className="landing-readable bg-background-light font-display text-[#171211] [scroll-behavior:smooth] dark:bg-background-dark">
      <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#f4f1f0] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link className="flex items-center gap-2" href="/user">
            <div className="size-6 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Oneul Nail</h2>
          </Link>
          <ActionLink
            className={buttonText}
            href="/login"
          >
            로그인하기
          </ActionLink>
        </div>
      </nav>

      <section className="px-6 pb-20 pt-32">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <h1 className="text-[clamp(1.7rem,6.7vw,4.5rem)] font-black leading-[1.1] tracking-tight text-[#171211]">
              <span className="block whitespace-nowrap">AI 피팅 서비스로 미리보고</span>
              <span className="block whitespace-nowrap text-primary">원하는 시간에 바로 예약</span>
            </h1>
            <p className="max-w-lg text-lg leading-relaxed text-[#171211]/70">
              <SentenceLines text="내 취향 탐색부터 AI 피팅, 투명한 가격 확인과 예약까지 한 번에. 이제 실패 없는 네일 라이프를 시작하세요." />
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <ActionLink
                className={storeBadgeLink}
                href={appStoreHref}
              >
                <Image
                  alt="Download on the App Store"
                  className={appStoreBadgeImage}
                  height={40}
                  priority
                  src="/store-badges/app-store-badge.svg"
                  width={120}
                />
              </ActionLink>
              <ActionLink
                className={storeBadgeLink}
                href={playStoreHref}
              >
                <Image
                  alt="Get it on Google Play"
                  className={playStoreBadgeImage}
                  height={250}
                  src="/store-badges/google-play-badge-en.png"
                  width={646}
                />
              </ActionLink>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative h-[600px] w-[300px] overflow-hidden rounded-[3rem] border-[8px] border-[#171211] bg-[#171211] shadow-2xl">
              <div className="absolute top-0 z-20 flex h-6 w-full justify-center bg-[#171211]">
                <div className="h-4 w-20 rounded-b-xl bg-black" />
              </div>
              <div className="relative h-full w-full bg-white">
                <Image
                  alt="Smartphone showing mobile app interface for nail design browsing"
                  className="object-cover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 300px"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmURnWySOZZqvv8yJVzf4tH4DgNoKJ2ukCncZsQzkaeILKcEEV8E3VLwjctl5A5MRcxZIwCbwvoieLg-E78sl2VVzPkNGUsdNfu5_9o4Qt6LC4GxxLdJLnCe9l6tvf2ILIOTB7yJCQG2Co3dNZl2NaXjKMBki3Z8w6evLJLlzkNDqSGITZLcgLUz-zHrgLInCfR9ulx2XvaVedQO0sC7TFaB2OzIrROh4AnzBYo0jiokeBVo67snAi8qCHyfzfA3Ebh7auhuH2z0GN"
                />
              </div>
            </div>
            <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
          </div>
        </div>
      </section>

      <section className="bg-white py-24" id="features">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="mb-12">
            <span className="text-lg font-bold text-primary">01 탐색</span>
            <h2 className="mt-2 text-4xl font-bold">내 취향을 찾는 가장 빠른 방법</h2>
          </div>

          <ExploreCategoriesCarousel categories={exploreCategories} />

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
            {discoverDesignImages.map((image) => (
              <div
                key={image.src}
                className="relative aspect-square cursor-pointer overflow-hidden rounded-xl transition-transform hover:scale-105"
              >
                <Image alt={image.alt} className="object-cover" fill sizes="(max-width: 1024px) 33vw, 16vw" src={image.src} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background-light py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-20 px-6 lg:grid-cols-2">
          <div className="order-2 flex justify-center lg:order-1">
            <div className="w-full max-w-sm rounded-3xl border border-[#f4f1f0] bg-white p-8 shadow-xl">
              <h3 className="mb-6 text-xl font-bold">견적서</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-background-light p-4">
                  <span className="text-sm font-medium">기본 케어 + 젤</span>
                  <span className="font-bold">45,000원</span>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-[#171211]/50">추가 옵션</label>
                  <div className="flex items-center justify-between border-b border-[#f4f1f0] py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                      아트 디자인 (2개)
                    </span>
                    <span className="font-semibold">+10,000원</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#f4f1f0] py-2 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm text-primary">check_circle</span>
                      자샵 제거
                    </span>
                    <span className="font-semibold">+5,000원</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-[#f4f1f0] py-2 text-sm text-[#171211]/40">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      타샵 제거
                    </span>
                    <span className="font-semibold">+10,000원</span>
                  </div>
                </div>
                <div className="mt-6 border-t border-dashed border-[#f4f1f0] pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">최종 예상 금액</span>
                    <span className="text-2xl font-black text-primary">60,000원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-lg font-bold text-primary">02 투명한 가격</span>
            <h2 className="mt-2 text-4xl font-bold leading-tight">
              추가금 걱정 없는
              <br />
              투명한 가격 확인
            </h2>
            <p className="mt-6 text-lg text-[#171211]/70">
              <SentenceLines text="시술 항목별 가격을 미리 확인하고 직접 옵션을 추가해보세요. 샵에 방문해서 당황하는 일 없이, 내가 생각한 예산 안에서 결제까지" />
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-24" id="ai-fitting">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-20 px-6 lg:grid-cols-2">
          <div>
            <span className="text-lg font-bold text-primary">03 AI 피팅</span>
            <h2 className="mt-2 text-4xl font-bold leading-tight">
              내 손에 미리 확인해보는
              <br />
              AI 피팅 서비스
            </h2>
            <p className="mt-6 text-lg text-[#171211]/70">
              <SentenceLines text="사진 한 장이면 끝. 내 손의 톤과 모양에 어울리는지 확인 가능합니다. 나에게 꼭 맞는 컬러와 디자인을 실패 없이 선택하세요." />
            </p>
          </div>

          <div className="group relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-center text-sm font-bold text-[#171211]/50">Before</p>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <Image
                    alt="A clean natural hand before nail art"
                    className="object-cover"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    src="/images/right_hand.png"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-center text-sm font-bold text-primary">AI Fitting After</p>
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                  <Image
                    alt="Hand with virtually applied colorful nail art"
                    className="object-cover"
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    src="/images/연장네일.png"
                  />
                  <div className="absolute inset-0 rounded-2xl border-4 border-primary/30 bg-primary/10" />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#171211] px-6 py-3 text-white shadow-lg">
              <span className="material-symbols-outlined animate-pulse text-sm text-primary">camera</span>
              <span className="text-sm font-bold">1.2초 만에 피팅 완료</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background-light py-24" id="booking">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 md:grid-cols-2">
          <div className="space-y-8 rounded-3xl border border-[#f4f1f0] bg-white p-10">
            <div>
              <span className="text-sm font-bold text-primary">04 실시간 예약</span>
              <h3 className="mt-1 text-2xl font-bold">원하는 시간에 바로 픽</h3>
            </div>

            <div className="space-y-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-bold">2026년 5월 24일 (일)</span>
                <span className="material-symbols-outlined text-[#171211]/30">calendar_month</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button className={timeButtonDefault} type="button">11:00</button>
                <button className={timeButtonSelected} type="button">13:30</button>
                <button className={timeButtonDisabled} disabled type="button">14:00</button>
                <button className={timeButtonDefault} type="button">15:00</button>
                <button className={timeButtonDefault} type="button">16:30</button>
                <button className={timeButtonDisabled} disabled type="button">18:00</button>
              </div>
            </div>
          </div>

          <div className="space-y-8 rounded-3xl border border-[#f4f1f0] bg-white p-10">
            <div>
              <span className="text-sm font-bold text-primary">05 상태 관리</span>
              <h3 className="mt-1 text-2xl font-bold">예약부터 완료까지 한눈에</h3>
            </div>

            <div className="relative space-y-8">
              <div className="absolute bottom-2 left-4 top-2 w-0.5 bg-background-light" />

              <div className="relative flex items-center gap-6">
                <div className="z-10 flex size-8 items-center justify-center rounded-full bg-primary text-white">
                  <span className="material-symbols-outlined text-sm">check</span>
                </div>
                <div>
                  <p className="font-bold">예약 완료</p>
                  <p className="text-xs text-[#171211]/50">5월 20일 14:20</p>
                </div>
              </div>

              <div className="relative flex items-center gap-6">
                <div className="z-10 flex size-8 items-center justify-center rounded-full bg-primary text-white ring-4 ring-primary/20">
                  <span className="material-symbols-outlined text-sm">hourglass_empty</span>
                </div>
                <div>
                  <p className="font-bold">방문 대기</p>
                  <p className="text-xs font-bold text-primary">D-DAY 14:00 예약</p>
                </div>
              </div>

              <div className="relative flex items-center gap-6 opacity-30">
                <div className="z-10 flex size-8 items-center justify-center rounded-full bg-gray-200 text-white">
                  <span className="material-symbols-outlined text-sm">star</span>
                </div>
                <div>
                  <p className="font-bold">시술 완료</p>
                  <p className="text-xs">리뷰 작성 대기</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white py-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-20 px-6 lg:grid-cols-2">
          <div className="order-2 relative lg:order-1">
            <div className="mx-auto max-w-[340px] space-y-4">
              <div className="flex gap-2">
                <div className="size-8 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-primary">store</span>
                </div>
                <div className="rounded-2xl rounded-tl-none bg-background-light p-4 text-sm">
                  안녕하세요! 요청하신 하트 파츠 디자인 시술 가능합니다. 총 견적 75,000원입니다.
                </div>
              </div>

              <div className="flex flex-row-reverse gap-2">
                <div className="size-8 shrink-0 rounded-full bg-[#171211]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs text-[#171211]">person</span>
                </div>
                <div className="rounded-2xl rounded-tr-none bg-primary p-4 text-sm text-white">
                  네, 확인했습니다! 예약 가능한가요?
                </div>
              </div>

              <div className="mt-6 space-y-4 rounded-3xl border border-[#f4f1f0] bg-white p-6 text-center shadow-lg">
                <p className="text-sm font-bold">나만의 커스텀 제안이 도착했어요</p>
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-3">
                  <span className="text-xl font-black text-primary">75,000원</span>
                </div>
                <ActionLink className={`${buttonPrimary} w-full py-3`} href={bookingHref}>
                  견적 수락 및 예약하기
                </ActionLink>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-lg font-bold text-primary">06 1:1 커스텀 견적</span>
            <h2 className="mt-2 text-4xl font-bold leading-tight">
              원하는 디자인,
              <br />
              맞춤형 가격 제안
            </h2>
            <p className="mt-6 text-lg text-[#171211]/70">
              <SentenceLines text="인스타에서 본 그 디자인, 얼마일지 궁금하시죠? 사진을 올리면 주변 샵에서 직접 견적을 제안합니다. 나에게 딱 맞는 가격과 실력을 갖춘 샵을 찾아보세요." />
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-32">
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[2.5rem] bg-primary p-12 text-center text-white lg:p-24">
          <div className="relative z-10 space-y-10">
            <h2 className="text-4xl font-black tracking-tight lg:text-6xl">고민말고, AI로 오늘 네일</h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <ActionLink
                className={storeBadgeLink}
                href={appStoreHref}
              >
                <Image
                  alt="Download on the App Store"
                  className={appStoreBadgeImage}
                  height={40}
                  src="/store-badges/app-store-badge.svg"
                  width={120}
                />
              </ActionLink>
              <ActionLink
                className={storeBadgeLink}
                href={playStoreHref}
              >
                <Image
                  alt="Get it on Google Play"
                  className={playStoreBadgeImage}
                  height={250}
                  src="/store-badges/google-play-badge-en.png"
                  width={646}
                />
              </ActionLink>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-black/10 blur-2xl" />
        </div>
      </section>

      <footer className="border-t border-[#f4f1f0] bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-primary">
              <svg className="size-6" fill="currentColor" viewBox="0 0 48 48">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" />
              </svg>
              <h2 className="text-xl font-bold tracking-tight text-[#171211]">Oneul Nail</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#171211]/50">
              네일 라이프의 새로운 기준, 오늘의 네일.
              <br />
              사용자 중심의 기술로 뷰티 경험을 혁신합니다.
            </p>
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-[1200px] flex-col justify-between gap-4 border-t border-[#f4f1f0] px-6 pt-8 md:flex-row">
          <p className="text-xs text-[#171211]/40">© 2024 Oneul Nail Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://oneulnail.com" rel="noreferrer" target="_blank">
              <span className="material-symbols-outlined cursor-pointer text-xl text-[#171211]/40 transition-colors hover:text-primary">
                language
              </span>
            </a>
            <a href="https://oneulnail.com" rel="noreferrer" target="_blank">
              <span className="material-symbols-outlined cursor-pointer text-xl text-[#171211]/40 transition-colors hover:text-primary">
                share
              </span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
