import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { OfflineBanner } from '@/components/ui/offline-banner';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background: "linear-gradient(135deg, #1B003F 0%, #4B0082 25%, #191970 50%, #4B0082 75%, #6B2E8F 100%)",
      }}
    >
      <OfflineBanner />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
