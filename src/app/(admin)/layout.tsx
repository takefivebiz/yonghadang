import AdminNav from "@/components/admin/admin-nav"

/**
 * 관리자 레이아웃 - 좌측 고정 사이드바 (w-52) + 우측 스크롤 가능 콘텐츠 영역
 * 적용 라우트: /admin, /admin/order-list, /admin/user-list, /admin/contents
 */
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminNav />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
