import TrainingExam from '@/content/TrainingExam';

export default async function MemberTrainingExamPage({
  params,
}: {
  params: Promise<{ appId: string; lessonId: string }>;
}) {
  const resolvedParams = await params;
  return <TrainingExam appId={resolvedParams.appId} lessonId={resolvedParams.lessonId} />;
}
