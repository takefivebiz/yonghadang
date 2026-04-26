import { type Metadata } from 'next';
import { GuestLookupClient } from './_components/guest-lookup-client';

export const metadata: Metadata = {
  title: '비회원 기록 조회 | Corelog',
  description: '결제 시 입력한 전화번호와 비밀번호로 리포트를 다시 확인하세요.',
};

const GuestLookupPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)]" style={{ backgroundColor: '#FAF8F5' }}>
      <GuestLookupClient />
    </div>
  );
};

export default GuestLookupPage;
