import Image from "next/image";
import { createPageMetadata } from "@/lib/metadata";
import { AppLaunchLogo } from "@/components/brand/app-launch-logo";
import { RecruitOwnerEmailForm } from "@/app/(public)/_components/recruit-owner-email-form";

import styles from "./root-landing.module.css";

const FEEDBACK_RECEIVER_EMAIL = "galaxydh4110@gmail.com";
const feedbackMailtoHref = `mailto:${FEEDBACK_RECEIVER_EMAIL}?subject=${encodeURIComponent("[오늘 네일] 베타 의견")}&body=${encodeURIComponent("의견 내용을 작성해 주세요.")}`;
const IOS_APPSTORE_DEFAULT_HREF = "https://apps.apple.com/kr/search?term=oneul%20nail";
const iosAppStoreHref = process.env.NEXT_PUBLIC_APPSTORE_URL?.trim() || IOS_APPSTORE_DEFAULT_HREF;
const appStoreBadgeSrc = "/store-badges/app-store-badge.svg";

type FeaturePreviewItem = {
  id: string;
  title: string;
  caption: string;
  imageSrc?: string;
};

const featurePreviewItems: FeaturePreviewItem[] = [
  {
    id: "screen-1",
    title: "AI 생성 결과",
    caption: "요청한 스타일 기반으로 생성된 네일 이미지를 바로 확인합니다."
  },
  {
    id: "screen-2",
    title: "스타일 입력",
    caption: "원하는 분위기와 키워드를 입력해 결과 방향을 지정합니다."
  },
  {
    id: "screen-3",
    title: "손 사진 업로드",
    caption: "손 사진을 업로드하면 형태를 반영해 결과를 만듭니다."
  },
  {
    id: "screen-4",
    title: "저장/관리",
    caption: "생성된 결과를 저장하고 다음 시도로 빠르게 이어집니다."
  }
];

export const metadata = createPageMetadata({
  title: "오늘 네일 | Beta",
  description: "AI 네일 생성 베타와 사장님 모집 안내",
  noIndex: false
});

export default function RootLandingPage() {
  return (
    <div className={`${styles.root} landing-readable`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logoWrap}>
            <AppLaunchLogo size="sidebar" />
          </div>
          <span className={styles.betaBadge}>Beta</span>
        </header>

        <main className={styles.main}>
          <section className={`${styles.hero} ${styles.fadeUp}`}>
            <p className={styles.heroEyebrow}>오늘 네일 베타</p>
            <h1 className={styles.heroTitle}>
              AI로 먼저 보고,
              <br />
              내 스타일을 찾는 네일 경험
            </h1>
            <p className={styles.heroLead}>
              AI 네일 생성으로 고객의 취향 탐색부터 네일 견적•예약•시술 까지 원스톱 경험을 제공합니다.
            </p>

            <div className={styles.heroActions}>
              <a className={`${styles.primaryButton} ${styles.recruitButton}`} href="#owner-recruit">
                사장님 모집 신청하기
              </a>
              <a className={styles.secondaryButton} href="#feedback">
                의견 보내기
              </a>
              <a
                className={styles.storeBadgeLink}
                href={iosAppStoreHref}
                aria-label="Download on the App Store"
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  src={appStoreBadgeSrc}
                  alt="Download on the App Store"
                  width={180}
                  height={60}
                  className={styles.storeBadgeImage}
                />
              </a>
            </div>
          </section>

          <section className={`${styles.section} ${styles.fadeUp} ${styles.delay1}`}>
            <p className={styles.sectionEyebrow}>핵심 기능</p>
            <h2 className={styles.sectionTitle}>AI 네일 생성</h2>
            <p className={styles.sectionLead}>
              이미지 3~4장을 제공해주시면 아래 슬롯이 실제 화면으로 교체됩니다.
            </p>

            <div className={styles.previewGrid}>
              {featurePreviewItems.map((item, index) => (
                <article key={item.id} className={styles.previewCard}>
                  <div className={styles.previewScreen}>
                    {item.imageSrc ? (
                      <Image
                        src={item.imageSrc}
                        alt={`${item.title} 화면 예시`}
                        fill
                        sizes="(min-width: 1024px) 23vw, (min-width: 768px) 46vw, 92vw"
                        className={styles.previewImage}
                      />
                    ) : (
                      <div className={styles.placeholder}>Slot {index + 1}</div>
                    )}
                  </div>
                  <div className={styles.previewMeta}>
                    <h3 className={styles.previewTitle}>{item.title}</h3>
                    <p className={styles.previewCaption}>{item.caption}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className={`${styles.ownerSection} ${styles.fadeUp} ${styles.delay2}`}>
            <div className={styles.ownerCopy}>
              <p className={styles.sectionEyebrow}>For Owners</p>
              <h2 className={styles.sectionTitle}>사장님을 위한 Beta 파트너 안내</h2>
              <p className={styles.sectionLead}>
                초기 파트너 사장님을 모집 중입니다. 운영에서 필요한 기능과 개선 포인트를 공유해주시면
                우선 반영해 베타 완성도를 높입니다.
              </p>
              <div className={styles.ownerTags}>
                <span className={styles.ownerTag}>초기 파트너 모집</span>
                <span className={styles.ownerTag}>피드백 우선 반영</span>
                <span className={styles.ownerTag}>온보딩 안내 제공</span>
              </div>
            </div>
            <div className={styles.ownerActions}>
              <a className={`${styles.primaryButton} ${styles.recruitButton}`} href="#owner-recruit">
                사장님 모집 신청하기
              </a>
              <a className={styles.secondaryButton} href="#feedback">
                의견 보내기
              </a>
            </div>
          </section>

          <section className={`${styles.contactGrid} ${styles.fadeUp} ${styles.delay3}`}>
            <article id="owner-recruit" className={styles.contactCard}>
              <p className={styles.sectionEyebrow}>Owner Recruiting</p>
              <h3 className={styles.cardTitle}>사장님을 모집합니다</h3>
              <p className={styles.cardLead}>이메일을 남겨주시면 모집 안내를 우선 전달해드립니다.</p>
              <div className={styles.formWrap}>
                <RecruitOwnerEmailForm />
              </div>
            </article>

            <article id="feedback" className={styles.contactCard}>
              <p className={styles.sectionEyebrow}>Feedback</p>
              <h3 className={styles.cardTitle}>의견을 보내주세요</h3>
              <p className={styles.cardLead}>불편한 점과 원하는 기능을 알려주세요.</p>
              <a className={styles.primaryButton} href={feedbackMailtoHref}>
                의견 보내기
              </a>
              <a className={styles.secondaryButton} href="/support">
                고객지원 안내
              </a>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
}
