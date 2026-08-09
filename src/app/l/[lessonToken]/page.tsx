import type { Metadata } from "next";

import SharedLessonClient from "../../shared-lesson/SharedLessonClient";
import {
  resolveSharedLessonMetadata,
  type SharedLessonSearchParams,
} from "../../shared-lesson/sharedLessonMetadata";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://thepxgroup.co.th"
).replace(/\/$/, "");

type ShortLessonPageProps = {
  params: Promise<{ lessonToken: string }> | { lessonToken: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ShortLessonPageProps): Promise<Metadata> {
  const { lessonToken } = await Promise.resolve(params);
  const searchParams: SharedLessonSearchParams = { lesson_token: lessonToken };
  const lessonMetadata = await resolveSharedLessonMetadata(searchParams);
  const url = `${siteUrl}/l/${encodeURIComponent(lessonToken)}`;

  return {
    title: lessonMetadata.title,
    description: lessonMetadata.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "th_TH",
      siteName: "The PX Group",
      url,
      title: lessonMetadata.title,
      description: lessonMetadata.description,
      images: [
        {
          url: lessonMetadata.image,
          width: 1200,
          height: 675,
          alt: lessonMetadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: lessonMetadata.title,
      description: lessonMetadata.description,
      images: [lessonMetadata.image],
    },
  };
}

export default function ShortLessonPage() {
  return <SharedLessonClient />;
}
