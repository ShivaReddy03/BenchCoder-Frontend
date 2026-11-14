import type { ApiSubmission } from '../submissionService';

const ago = (m: number) => new Date(Date.now() - m * 60000).toISOString();

export const MOCK_SUBMISSIONS: ApiSubmission[] = [
  { id: 105, problem: 1, problem_title: 'Two Sum', problem_difficulty: 'easy', user_username: 'you', language: 'python', verdict: 'Accepted', execution_time: 0.052, memory: 17.1, submitted_at: ago(12) },
  { id: 104, problem: 2, problem_title: 'Add Two Numbers', problem_difficulty: 'medium', user_username: 'you', language: 'cpp', verdict: 'Wrong Answer', execution_time: 0.011, memory: 71.2, submitted_at: ago(95) },
  { id: 103, problem: 5, problem_title: 'Valid Parentheses', problem_difficulty: 'easy', user_username: 'you', language: 'javascript', verdict: 'Accepted', execution_time: 0.061, memory: 42.0, submitted_at: ago(60 * 26) },
  { id: 102, problem: 7, problem_title: 'Trapping Rain Water', problem_difficulty: 'hard', user_username: 'you', language: 'java', verdict: 'Time Limit Exceeded', execution_time: null, memory: null, submitted_at: ago(60 * 50) },
  { id: 101, problem: 2, problem_title: 'Add Two Numbers', problem_difficulty: 'medium', user_username: 'you', language: 'python', verdict: 'Runtime Error', execution_time: null, memory: null, submitted_at: ago(60 * 72) },
];
