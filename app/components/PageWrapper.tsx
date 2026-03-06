/**
 * PageWrapper
 * Wraps every page. Provides: Nav, Footer, page shell class.
 *
 * Usage — every page looks like this:
 *
 *   export default function MyPage() {
 *     return (
 *       <PageWrapper>
 *         <main>
 *           <div className="rws-container" style={{ paddingTop: "7rem", paddingBottom: "5rem" }}>
 *             ...page content...
 *           </div>
 *         </main>
 *       </PageWrapper>
 *     );
 *   }
 *
 * File lives at: app/components/PageWrapper.tsx
 */
import Nav from "./Nav";
import Footer from "./Footer";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="rws-page">
      <Nav />
      {children}
      <Footer />
    </div>
  );
}