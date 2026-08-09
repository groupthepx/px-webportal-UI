import type { Metadata } from "next";

import SharedLessonClient from "./SharedLessonClient";
import {
  createSharedLessonUrl,
  resolveSharedLessonMetadata,
  type SharedLessonSearchParams,
} from "./sharedLessonMetadata";

export const dynamic = "force-dynamic";

type SharedLessonPageProps = {
  searchParams?: Promise<SharedLessonSearchParams> | SharedLessonSearchParams;
};

export async function generateMetadata({
  searchParams,
}: SharedLessonPageProps): Promise<Metadata> {
  const params = await Promise.resolve(searchParams ?? {});
  const lessonMetadata = await resolveSharedLessonMetadata(params);
  const url = createSharedLessonUrl(params);

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

export default function SharedLessonPage() {
  return <SharedLessonClient />;
}
