import type { Metadata } from 'next';
import { SettingsClient } from './_components/settings-client';

export const metadata: Metadata = {
  title: '설정',
  description: '프로필 수정, 계정 관리 등 개인 설정을 관리합니다.',
};

const SettingsPage = () => <SettingsClient />;

export default SettingsPage;
