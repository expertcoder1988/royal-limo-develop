import AppFooter from "@/components/common/AppFooter";
import AppHeader from "@/components/common/AppHeader";
import FooterStrip from "@/components/common/FooterStrip";
import HeaderStrip from "@/components/common/HeaderStrip";
import { META_CONTENT } from "@/constants/metaContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: META_CONTENT.root.title,
  description: META_CONTENT.root.description,
};

export default function LandingPageRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <header className="sticky top-0 z-[100]">
          <HeaderStrip />
          <AppHeader />
        </header>
        <main className="bg-white">
          <div id="root">{children}</div>
        </main>
        <footer>
          <AppFooter />
          <FooterStrip />
        </footer>
      </div>
    </>
  );
}
