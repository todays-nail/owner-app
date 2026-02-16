import {SlotsScreen} from "@/features/slots/screens/slots-screen";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Slots",
  description: "MVP placeholder."
});

export const dynamic = "force-dynamic";

export default function SlotsPage() {
  return <SlotsScreen />;
}
