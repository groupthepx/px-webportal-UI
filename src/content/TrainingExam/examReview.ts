export type ExamAnswer = string | string[] | undefined;

export type ExamReviewQuestion = {
  id: string;
  title: string;
  type: 'single' | 'multiple' | 'true_false';
  options: string[];
  answer: string | string[];
};

export type ExamAnswerReview = {
  questionId: string;
  questionTitle: string;
  type: ExamReviewQuestion['type'];
  selected: ExamAnswer;
  correctAnswer: string | string[];
  correct: boolean;
};

function sameAnswers(expected: string[], actual: string[]) {
  return expected.length === actual.length && expected.every((value) => actual.includes(value));
}

export function isExamAnswerCorrect(expected: string | string[], actual: ExamAnswer) {
  if (Array.isArray(expected)) {
    return Array.isArray(actual) && sameAnswers(expected, actual);
  }

  return actual === expected;
}

export function buildExamAnswerReview(
  questions: ExamReviewQuestion[],
  answers: Record<string, ExamAnswer>,
): ExamAnswerReview[] {
  return questions.map((question) => ({
    questionId: question.id,
    questionTitle: question.title,
    type: question.type,
    selected: answers[question.id],
    correctAnswer: question.answer,
    correct: isExamAnswerCorrect(question.answer, answers[question.id]),
  }));
}

export function formatExamAnswer(answer: ExamAnswer) {
  if (Array.isArray(answer)) return answer.length ? answer.join(' · ') : 'ยังไม่ได้เลือกคำตอบ';
  return answer || 'ยังไม่ได้เลือกคำตอบ';
}
