import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"

/**
 * 유저 UX 레이아웃 - Navbar (고정 h-14) + main 콘텐츠 + Footer
 * 적용 라우트: /, /content/[id], /analyze/[session_id], /result/[session_id], /my-page, /auth
 */
const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {/* pt-14: 고정 Navbar 높이만큼 상단 여백 */}
      <main className="min-h-screen pt-14">
        {children}
      </main>
      <Footer />
    </>
  )
}

export default UserLayout
