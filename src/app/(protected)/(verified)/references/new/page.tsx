import {redirect} from "next/navigation";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "디자인 등록",
  description: "새로운 네일 디자인을 라이브러리에 추가합니다."
});

export const dynamic = "force-dynamic";

export default function ReferenceCreatePage() {
  redirect("/references?modal=create");
}
