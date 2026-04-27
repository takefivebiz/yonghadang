import type { Metadata } from 'next';
import { OrdersClient } from './_components/orders-client';

export const metadata: Metadata = {
  title: '구매 내역',
  description: '코어로그에서 구매한 분석 내역을 확인합니다.',
};

const OrdersPage = () => <OrdersClient />;

export default OrdersPage;
