import type { ReactNode } from "react";

import Footer from "@/components/footer";
import Navigation from "@/components/navigation";

const MarketingLayout = ({ children }: { children: ReactNode }) => (
  <>
    <Navigation />
    <main className="bg-slate-50">{children}</main>
    <Footer />
  </>
);

export default MarketingLayout;
