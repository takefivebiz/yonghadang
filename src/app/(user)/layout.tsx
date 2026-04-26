import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        className="flex-1"
        style={{
          background: "linear-gradient(to bottom, #1B003F 0%, #4B0082 25%, #191970 50%, #4B0082 75%, #6B2E8F 100%)",
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
