import type { Metadata } from 'next';
import { ReportsClient } from './_components/reports-client';

export const metadata: Metadata = {
  title: '내 리포트',
  description: '코어로그에서 받은 분석 리포트를 모아볼 수 있습니다.',
};

const ReportsPage = () => <ReportsClient />;

export default ReportsPage;
