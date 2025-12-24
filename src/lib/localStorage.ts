export interface Test {
  id: string;
  user_id: string;
  title: string;
  type: 'mcq' | 'coding';
  difficulty: string;
  total_questions: number;
  max_score: number;
  score: number;
  status: 'in_progress' | 'completed' | 'pending_result';
  created_at: string;
  completed_at: string | null;
}

export interface Question {
  id: string;
  test_id: string;
  question: string;
  options: any;
  correct_answer: string;
  user_answer?: string;
  is_correct?: boolean;
  points: number;
}

const TESTS_KEY = 'coding_hustlers_tests';
const QUESTIONS_KEY = 'coding_hustlers_questions';

export function getTests(userId?: string): Test[] {
  const tests = localStorage.getItem(TESTS_KEY);
  if (!tests) return [];

  const allTests = JSON.parse(tests) as Test[];
  if (userId) {
    return allTests.filter(test => test.user_id === userId);
  }
  return allTests;
}

export function saveTest(test: Omit<Test, 'id' | 'created_at'>): Test {
  const tests = getTests();
  const newTest: Test = {
    ...test,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  };

  tests.push(newTest);
  localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
  return newTest;
}

export function updateTest(testId: string, updates: Partial<Test>): void {
  const tests = getTests();
  const index = tests.findIndex(t => t.id === testId);

  if (index !== -1) {
    tests[index] = { ...tests[index], ...updates };
    localStorage.setItem(TESTS_KEY, JSON.stringify(tests));
  }
}

export function getQuestions(testId?: string): Question[] {
  const questions = localStorage.getItem(QUESTIONS_KEY);
  if (!questions) return [];

  const allQuestions = JSON.parse(questions) as Question[];
  if (testId) {
    return allQuestions.filter(q => q.test_id === testId);
  }
  return allQuestions;
}

export function saveQuestions(questions: Omit<Question, 'id'>[]): void {
  const existingQuestions = getQuestions();

  const newQuestions = questions.map(q => ({
    ...q,
    id: Date.now().toString() + Math.random()
  }));

  existingQuestions.push(...newQuestions);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(existingQuestions));
}

export function updateQuestion(testId: string, questionText: string, updates: Partial<Question>): void {
  const questions = getQuestions();
  const index = questions.findIndex(q => q.test_id === testId && q.question === questionText);

  if (index !== -1) {
    questions[index] = { ...questions[index], ...updates };
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
  }
}
