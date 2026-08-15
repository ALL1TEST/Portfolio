import { publicRoute, withAuth } from '@/lib/api-helpers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const GET = publicRoute(async () => {
  const profile = await db.profile.findFirst();
  return NextResponse.json(profile || {});
});

export const PUT = withAuth(async (req: Request) => {
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
        ...(body.profileImage !== undefined && { profileImage: body.profileImage }),
        ...(body.cvFile !== undefined && { cvFile: body.cvFile }),
      },
    });
  } else {
    profile = await db.profile.create({ data: body });
  }
  return NextResponse.json(profile);
});
