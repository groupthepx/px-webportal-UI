import type { Metadata } from 'next';
import PrivacyPolicyPage from '@/content/privacy-policy';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy สำหรับการใช้งานเว็บไซต์ The PX Group',
};

export default function PrivacyPolicy() {
  return <PrivacyPolicyPage />;
}
