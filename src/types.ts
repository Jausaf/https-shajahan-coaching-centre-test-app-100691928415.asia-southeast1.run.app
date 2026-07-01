export interface Question {
  id: string;
  questionText: string;
  options: string[]; // typically 4 options: A, B, C, D
  correctOptionIndex: number; // 0, 1, 2, 3 representing A, B, C, D
  subject: string;
  explanationHindi: string;
}

export interface Test {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  durationMinutes: number;
  marksPerQuestion: number;
  negativeMarking: number; // e.g. 0.25 or 0.33
  questions: Question[];
  batchName: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: "Urgent" | "Exam" | "New Batch" | "Holiday" | "General";
}

export interface Student {
  mobile: string;
  name: string;
  batchName: string;
  rollNumber: string;
  createdAt: string;
  prepCategory?: "Bihar Board" | "Competitive";
  studentClass?: string; // "Class 8th" | "Class 9th" | "Class 10th" | "Class 11th" | "Class 12th"
  stream?: string; // "Science" | "Commerce" | "Arts"
  targetExam?: string; // e.g. "Railway", "Bihar Police", etc.
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  questionsCount: number;
}

export interface PDFNote {
  id: string;
  title: string;
  subject: string;
  fileSize: string;
  downloadCount: number;
}

export interface TestResult {
  id: string;
  testId: string;
  testTitle: string;
  studentMobile: string;
  studentName: string;
  rollNumber: string;
  batchName: string;
  correctAnswers: number;
  wrongAnswers: number;
  unattemptedQuestions: number;
  totalMarksObtained: number;
  maxMarks: number;
  percentage: number;
  timeTakenSeconds: number;
  submittedAt: string;
  answersMap: { [questionId: string]: number }; // questionId -> selectedOptionIndex (or -1 if skipped)
  subjectPerformance: { [subject: string]: { correct: number; total: number } };
}
