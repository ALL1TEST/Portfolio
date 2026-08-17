import { SiteLayout } from '@/components/site-layout';
import { CertificatesSection } from '@/components/certificates-section';
import { EducationSection } from '@/components/education-section';

export default function CertificatesPage() {
  return (
    <SiteLayout>
      <CertificatesSection />
      <EducationSection />
    </SiteLayout>
  );
}
