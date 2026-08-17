import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = publicRoute(async () => {
  const profile = await db.profile.findFirst();
  return NextResponse.json(profile || {});
});

export const PUT = withAuth(async (req: Request) => {
  try {
    const body = await req.json();
    const existing = await db.profile.findFirst();
    let profile;
    if (existing) {
      profile = await db.profile.update({
        where: { id: existing.id },
        data: {
          ...(body.fullName !== undefined && { fullName: body.fullName }),
          ...(body.brandName !== undefined && { brandName: body.brandName }),
          ...(body.professionalTitle !== undefined && { professionalTitle: body.professionalTitle }),
          ...(body.shortBio !== undefined && { shortBio: body.shortBio }),
          ...(body.aboutText !== undefined && { aboutText: body.aboutText }),
          ...(body.footerBio !== undefined && { footerBio: body.footerBio }),
          ...(body.email !== undefined && { email: body.email }),
          ...(body.phone !== undefined && { phone: body.phone }),
          ...(body.location !== undefined && { location: body.location }),
          ...(body.githubUrl !== undefined && { githubUrl: body.githubUrl }),
          ...(body.linkedinUrl !== undefined && { linkedinUrl: body.linkedinUrl }),
          ...(body.instagramUrl !== undefined && { instagramUrl: body.instagramUrl }),
          ...(body.twitterUrl !== undefined && { twitterUrl: body.twitterUrl }),
          ...(body.featuredProjectsTitle !== undefined && { featuredProjectsTitle: body.featuredProjectsTitle }),
          ...(body.featuredProjectsDescription !== undefined && { featuredProjectsDescription: body.featuredProjectsDescription }),
          ...(body.aboutCard1Title !== undefined && { aboutCard1Title: body.aboutCard1Title }),
          ...(body.aboutCard1Description !== undefined && { aboutCard1Description: body.aboutCard1Description }),
          ...(body.aboutCard2Title !== undefined && { aboutCard2Title: body.aboutCard2Title }),
          ...(body.aboutCard2Description !== undefined && { aboutCard2Description: body.aboutCard2Description }),
          ...(body.aboutCard3Title !== undefined && { aboutCard3Title: body.aboutCard3Title }),
          ...(body.aboutCard3Description !== undefined && { aboutCard3Description: body.aboutCard3Description }),
          ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
          ...(body.profileImage !== undefined && { profileImage: body.profileImage }),
          ...(body.cvFile !== undefined && { cvFile: body.cvFile }),
          ...(body.stat1Value !== undefined && { stat1Value: body.stat1Value }),
          ...(body.stat1Label !== undefined && { stat1Label: body.stat1Label }),
          ...(body.stat2Value !== undefined && { stat2Value: body.stat2Value }),
          ...(body.stat2Label !== undefined && { stat2Label: body.stat2Label }),
          ...(body.stat3Value !== undefined && { stat3Value: body.stat3Value }),
          ...(body.stat3Label !== undefined && { stat3Label: body.stat3Label }),
          ...(body.projectsPageTitle !== undefined && { projectsPageTitle: body.projectsPageTitle }),
          ...(body.projectsPageDescription !== undefined && { projectsPageDescription: body.projectsPageDescription }),
          ...(body.certificatesPageTitle !== undefined && { certificatesPageTitle: body.certificatesPageTitle }),
          ...(body.certificatesPageDescription !== undefined && { certificatesPageDescription: body.certificatesPageDescription }),
          ...(body.educationPageTitle !== undefined && { educationPageTitle: body.educationPageTitle }),
          ...(body.educationPageDescription !== undefined && { educationPageDescription: body.educationPageDescription }),
          ...(body.resumeIntro !== undefined && { resumeIntro: body.resumeIntro }),
          ...(body.resumeTechTitle !== undefined && { resumeTechTitle: body.resumeTechTitle }),
          ...(body.resumeExpTitle !== undefined && { resumeExpTitle: body.resumeExpTitle }),
          ...(body.contactPageTitle !== undefined && { contactPageTitle: body.contactPageTitle }),
          ...(body.contactPageDescription !== undefined && { contactPageDescription: body.contactPageDescription }),
          ...(body.footerCopyright !== undefined && { footerCopyright: body.footerCopyright }),
          ...(body.footerCredit !== undefined && { footerCredit: body.footerCredit }),
        },
      });
    } else {
      profile = await db.profile.create({ data: body });
    }

    // Force Next.js to regenerate the root layout metadata so favicon changes take effect immediately
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
});
