import { photos } from "@/lib/photos";
import Gallery from "@/components/Gallery";

export default function Home() {
  return <Gallery photos={photos} />;
}
