/**
 * Mathematical calculations and planning algorithms for Student Utility Tools.
 */

export interface CourseGrade {
  id: string;
  courseName: string;
  grade: string;
  creditHours: number;
}

export const GRADE_SCALE_4: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  F: 0.0,
};

export const GRADE_SCALE_5: Record<string, number> = {
  'A+': 5.0,
  A: 4.75,
  'A-': 4.5,
  'B+': 4.0,
  B: 3.5,
  'B-': 3.0,
  'C+': 2.5,
  C: 2.0,
  'C-': 1.5,
  'D+': 1.0,
  D: 0.5,
  F: 0.0,
};

export function calculateGpa(
  courses: CourseGrade[],
  scaleType: '4.0' | '5.0' = '4.0'
): { gpa: number; totalCredits: number; totalPoints: number } {
  const scale = scaleType === '5.0' ? GRADE_SCALE_5 : GRADE_SCALE_4;
  let totalCredits = 0;
  let totalPoints = 0;

  for (const c of courses) {
    if (c.creditHours > 0) {
      const gradePoint = scale[c.grade] ?? 0;
      totalCredits += c.creditHours;
      totalPoints += gradePoint * c.creditHours;
    }
  }

  const gpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
  return { gpa, totalCredits, totalPoints: Math.round(totalPoints * 100) / 100 };
}

export interface SemesterRecord {
  id: string;
  semesterName: string;
  gpa: number;
  creditHours: number;
}

export function calculateCgpa(
  semesters: SemesterRecord[]
): { cgpa: number; totalCredits: number } {
  let totalCredits = 0;
  let weightedPoints = 0;

  for (const s of semesters) {
    if (s.creditHours > 0 && s.gpa >= 0) {
      totalCredits += s.creditHours;
      weightedPoints += s.gpa * s.creditHours;
    }
  }

  const cgpa = totalCredits > 0 ? Math.round((weightedPoints / totalCredits) * 100) / 100 : 0;
  return { cgpa, totalCredits };
}

export function calculateMarksPercentage(
  obtained: number,
  total: number
): { percentage: number; grade: string; remarks: string } {
  if (total <= 0) return { percentage: 0, grade: 'N/A', remarks: 'Invalid total' };
  const percentage = Math.round((obtained / total) * 10000) / 100;

  let grade = 'F';
  let remarks = 'Needs improvement';
  if (percentage >= 90) {
    grade = 'A+';
    remarks = 'Outstanding';
  } else if (percentage >= 80) {
    grade = 'A';
    remarks = 'Excellent';
  } else if (percentage >= 70) {
    grade = 'B';
    remarks = 'Very Good';
  } else if (percentage >= 60) {
    grade = 'C';
    remarks = 'Good / Satisfactory';
  } else if (percentage >= 50) {
    grade = 'D';
    remarks = 'Pass';
  }

  return { percentage, grade, remarks };
}

export function calculateStatistics(numbers: number[]): {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number[];
  min: number;
  max: number;
  range: number;
  stdDev: number;
} {
  if (numbers.length === 0) {
    return { count: 0, sum: 0, mean: 0, median: 0, mode: [], min: 0, max: 0, range: 0, stdDev: 0 };
  }

  const sorted = [...numbers].sort((a, b) => a - b);
  const count = sorted.length;
  const sum = sorted.reduce((acc, n) => acc + n, 0);
  const mean = Math.round((sum / count) * 100) / 100;

  // Median
  const mid = Math.floor(count / 2);
  const median =
    count % 2 === 0
      ? Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 100) / 100
      : sorted[mid];

  // Mode
  const freqs: Record<number, number> = {};
  let maxFreq = 0;
  for (const n of sorted) {
    freqs[n] = (freqs[n] || 0) + 1;
    if (freqs[n] > maxFreq) maxFreq = freqs[n];
  }
  const mode = maxFreq > 1 ? Object.keys(freqs).filter((k) => freqs[Number(k)] === maxFreq).map(Number) : [];

  const min = sorted[0];
  const max = sorted[count - 1];
  const range = max - min;

  // Standard Deviation
  const variance = sorted.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count;
  const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;

  return { count, sum, mean, median, mode, min, max, range, stdDev };
}

export function calculateExamCountdown(
  targetDate: string
): { days: number; hours: number; minutes: number; seconds: number; isPast: boolean } {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = target - now;

  if (diff <= 0 || isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}

/**
 * Safe Mathematical Expression Evaluator for Scientific Calculator
 */
export function evaluateScientificExpression(expr: string): number {
  const sanitized = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'Math.PI')
    .replace(/e(?![a-z])/g, 'Math.E')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/\^/g, '**');

  // Verify only allowed math tokens exist
  if (!/^[0-9+\-*/().\s,MathPIEsincolgsqrt*]+$/.test(sanitized)) {
    throw new Error('Invalid mathematical characters');
  }

  // Safe Function evaluation
  // eslint-disable-next-line no-new-func
  const result = new Function(`return (${sanitized});`)();
  if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
    throw new Error('Calculation error');
  }
  return Math.round(result * 100000000) / 100000000;
}
