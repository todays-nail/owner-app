import {OptionsScreen} from "@/features/options/screens/options-screen";
import {createPageMetadata} from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Options",
  description: "MVP placeholder."
});

export const dynamic = "force-dynamic";

export default function OptionsPage() {
  return <OptionsScreen />;
}
