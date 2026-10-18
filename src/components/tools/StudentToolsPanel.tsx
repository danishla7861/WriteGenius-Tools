import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Calculator,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Play,
  Pause,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Target,
  ListTodo,
  TrendingUp,
} from 'lucide-react';
import { ToolDefinition } from '../../types/tools';
import {
  CourseGrade,
  GRADE_SCALE_4,
  GRADE_SCALE_5,
  calculateGpa,
  SemesterRecord,
  calculateCgpa,
  calculateMarksPercentage,
  calculateStatistics,
  calculateExamCountdown,
  evaluateScientificExpression,
} from '../../utils/studentUtils';
import { downloadAsTxt } from '../../utils/downloadUtils';
import { recordToolUsage } from '../../utils/usageHistoryUtils';

interface StudentToolsPanelProps {
  tool: ToolDefinition;
  onShowToast: (message: string, type?: 'success' | 'error') => void;
}

export const StudentToolsPanel: React.FC<StudentToolsPanelProps> = ({ tool, onShowToast }) => {
  // -------------------------------------------------------------------------
  // 1. GPA Calculator State
  // -------------------------------------------------------------------------
  const [courses, setCourses] = useState<CourseGrade[]>([
    { id: '1', courseName: 'Computer Science 101', grade: 'A', creditHours: 3 },
    { id: '2', courseName: 'Calculus & Linear Algebra', grade: 'A-', creditHours: 4 },
    { id: '3', courseName: 'Academic Writing & Research', grade: 'B+', creditHours: 3 },
    { id: '4', courseName: 'Physics Lab', grade: 'A', creditHours: 2 },
  ]);
  const [gpaScale, setGpaScale] = useState<'4.0' | '5.0'>('4.0');

  // -------------------------------------------------------------------------
  // 2. CGPA Calculator State
  // -------------------------------------------------------------------------
  const [semesters, setSemesters] = useState<SemesterRecord[]>([
    { id: '1', semesterName: 'Semester 1 (Fall)', gpa: 3.75, creditHours: 15 },
    { id: '2', semesterName: 'Semester 2 (Spring)', gpa: 3.82, creditHours: 16 },
    { id: '3', semesterName: 'Semester 3 (Fall)', gpa: 3.68, creditHours: 15 },
  ]);

  // -------------------------------------------------------------------------
  // 3. Percentage Calculator State
  // -------------------------------------------------------------------------
  const [pctMode, setPctMode] = useState<'whatIs' | 'isWhat' | 'change'>('whatIs');
  const [pctValA, setPctValA] = useState<number>(20);
  const [pctValB, setPctValB] = useState<number>(150);

  // -------------------------------------------------------------------------
  // 4. Marks to Percentage State
  // -------------------------------------------------------------------------
  const [obtainedMarks, setObtainedMarks] = useState<number>(440);
  const [totalMarks, setTotalMarks] = useState<number>(500);

  // -------------------------------------------------------------------------
  // 5. Average & Statistics Calculator State
  // -------------------------------------------------------------------------
  const [statsInput, setStatsInput] = useState<string>('88, 92, 79, 95, 84, 91, 88, 76, 98');

  // -------------------------------------------------------------------------
  // 6. Study Timetable Planner State
  // -------------------------------------------------------------------------
  interface TimetableEntry {
    id: string;
    day: string;
    slot: string;
    subject: string;
    topic: string;
  }
  const [timetable, setTimetable] = useState<TimetableEntry[]>([
    { id: '1', day: 'Monday', slot: 'Morning (09:00 - 12:00)', subject: 'Algorithms', topic: 'Dynamic Programming & Graphs' },
    { id: '2', day: 'Tuesday', slot: 'Afternoon (14:00 - 17:00)', subject: 'Calculus', topic: 'Integration by Parts practice' },
    { id: '3', day: 'Wednesday', slot: 'Evening (18:00 - 21:00)', subject: 'Database Systems', topic: 'SQL Joins & Indexing' },
    { id: '4', day: 'Thursday', slot: 'Morning (09:00 - 12:00)', subject: 'Writing', topic: 'Literature Review Drafting' },
    { id: '5', day: 'Friday', slot: 'Evening (18:00 - 21:00)', subject: 'Physics', topic: 'Thermodynamics Problem Sets' },
  ]);
  const [newDay, setNewDay] = useState('Monday');
  const [newSlot, setNewSlot] = useState('Morning (09:00 - 12:00)');
  const [newSubject, setNewSubject] = useState('');
  const [newTopic, setNewTopic] = useState('');

  // -------------------------------------------------------------------------
  // 7. Exam Countdown State
  // -------------------------------------------------------------------------
  const [examName, setExamName] = useState<string>('Final Semester Examinations');
  const [examDate, setExamDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 18);
    d.setHours(9, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [countdown, setCountdown] = useState(calculateExamCountdown(examDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateExamCountdown(examDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [examDate]);

  // -------------------------------------------------------------------------
  // 8. Study Session Planner (Pomodoro Timer) State
  // -------------------------------------------------------------------------
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak' | 'deepWork'>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(2);
  const [sessionTasks, setSessionTasks] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Review Chapter 4 lecture slides', done: true },
    { id: '2', text: 'Solve 5 calculus practice problems', done: false },
    { id: '3', text: 'Summarize key formulas on flashcard', done: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setCompletedSessions((prev) => prev + 1);
      onShowToast('Focus session complete! Take a break.', 'success');
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, onShowToast]);

  const setTimerDuration = (mode: 'pomodoro' | 'shortBreak' | 'longBreak' | 'deepWork') => {
    setTimerMode(mode);
    setIsRunning(false);
    if (mode === 'pomodoro') setSecondsLeft(25 * 60);
    if (mode === 'shortBreak') setSecondsLeft(5 * 60);
    if (mode === 'longBreak') setSecondsLeft(15 * 60);
    if (mode === 'deepWork') setSecondsLeft(50 * 60);
  };

  // -------------------------------------------------------------------------
  // 9. Scientific Calculator State
  // -------------------------------------------------------------------------
  const [calcDisplay, setCalcDisplay] = useState<string>('');
  const [calcResult, setCalcResult] = useState<string>('0');
  const [calcHistory, setCalcHistory] = useState<{ expr: string; result: string }[]>([
    { expr: 'sin(30) + cos(60)', result: '0.40798' },
    { expr: 'sqrt(144) * 2^3', result: '96' },
  ]);

  const handleCalcButton = (token: string) => {
    if (token === 'AC') {
      setCalcDisplay('');
      setCalcResult('0');
    } else if (token === 'DEL') {
      setCalcDisplay((prev) => prev.slice(0, -1));
    } else if (token === '=') {
      try {
        const res = evaluateScientificExpression(calcDisplay);
        setCalcResult(String(res));
        setCalcHistory((prev) => [{ expr: calcDisplay, result: String(res) }, ...prev.slice(0, 9)]);
      } catch (e) {
        setCalcResult('Error');
      }
    } else {
      setCalcDisplay((prev) => prev + token);
    }
  };

  // -------------------------------------------------------------------------
  // GPA Helpers
  // -------------------------------------------------------------------------
  const gpaResult = calculateGpa(courses, gpaScale);
  const addCourseRow = () => {
    const newId = String(Date.now());
    setCourses([...courses, { id: newId, courseName: `New Course ${courses.length + 1}`, grade: 'A', creditHours: 3 }]);
  };
  const removeCourseRow = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };
  const updateCourse = (id: string, field: keyof CourseGrade, value: any) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  // -------------------------------------------------------------------------
  // CGPA Helpers
  // -------------------------------------------------------------------------
  const cgpaResult = calculateCgpa(semesters);
  const addSemesterRow = () => {
    const newId = String(Date.now());
    setSemesters([...semesters, { id: newId, semesterName: `Semester ${semesters.length + 1}`, gpa: 3.5, creditHours: 15 }]);
  };
  const removeSemesterRow = (id: string) => {
    setSemesters(semesters.filter((s) => s.id !== id));
  };
  const updateSemester = (id: string, field: keyof SemesterRecord, value: any) => {
    setSemesters(semesters.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // -------------------------------------------------------------------------
  // Statistics Result
  // -------------------------------------------------------------------------
  const parsedStatsNumbers = statsInput
    .split(/[\s,;\n]+/)
    .map((n) => parseFloat(n.trim()))
    .filter((n) => !isNaN(n));
  const statsResult = calculateStatistics(parsedStatsNumbers);

  // -------------------------------------------------------------------------
  // Percentage Output
  // -------------------------------------------------------------------------
  let computedPercentageAnswer = '';
  if (pctMode === 'whatIs') {
    const ans = (pctValA / 100) * pctValB;
    computedPercentageAnswer = `${pctValA}% of ${pctValB} is ${Math.round(ans * 100) / 100}`;
  } else if (pctMode === 'isWhat') {
    const ans = pctValB !== 0 ? (pctValA / pctValB) * 100 : 0;
    computedPercentageAnswer = `${pctValA} is ${Math.round(ans * 100) / 100}% of ${pctValB}`;
  } else {
    const diff = pctValB - pctValA;
    const pct = pctValA !== 0 ? (diff / pctValA) * 100 : 0;
    const type = diff >= 0 ? 'increase' : 'decrease';
    computedPercentageAnswer = `${Math.abs(Math.round(pct * 100) / 100)}% ${type} from ${pctValA} to ${pctValB}`;
  }

  // -------------------------------------------------------------------------
  // Marks to Percentage Output
  // -------------------------------------------------------------------------
  const marksResult = calculateMarksPercentage(obtainedMarks, totalMarks);

  return (
    <div className="space-y-8">
      {/* =================================================================== */}
      {/* 1. GPA Calculator */}
      {/* =================================================================== */}
      {tool.slug === 'gpa-calculator' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#263653]">
            <div>
              <h2 className="text-base font-bold text-[#F8FAFF] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#4776FF]" />
                <span>Semester GPA Calculator</span>
              </h2>
              <p className="text-xs text-[#AAB8D0] mt-0.5">
                Calculate your term grade point average across courses and credit hours.
              </p>
            </div>

            {/* Scale Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-[#111A2E] rounded-lg">
              <button
                type="button"
                onClick={() => setGpaScale('4.0')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  gpaScale === '4.0'
                    ? 'bg-[#0D1424] text-[#F8FAFF] shadow-xs'
                    : 'text-[#AAB8D0]'
                }`}
              >
                4.0 Scale
              </button>
              <button
                type="button"
                onClick={() => setGpaScale('5.0')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  gpaScale === '5.0'
                    ? 'bg-[#0D1424] text-[#F8FAFF] shadow-xs'
                    : 'text-[#AAB8D0]'
                }`}
              >
                5.0 Scale
              </button>
            </div>
          </div>

          {/* Results Showcase Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-center">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                Your Cumulative Term GPA
              </span>
              <p className="text-3xl font-extrabold font-mono text-[#4776FF] mt-1">
                {gpaResult.gpa.toFixed(2)}
              </p>
              <span className="text-[11px] text-[#4776FF] mt-1 block">
                out of {gpaScale === '5.0' ? '5.00' : '4.00'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] text-center">
              <span className="text-xs font-semibold text-slate-600 dark:text-[#AAB8D0]">
                Total Credit Hours
              </span>
              <p className="text-3xl font-extrabold font-mono text-[#F8FAFF] mt-1">
                {gpaResult.totalCredits}
              </p>
              <span className="text-[11px] text-[#AAB8D0] mt-1 block">Credits Attempted</span>
            </div>

            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] text-center">
              <span className="text-xs font-semibold text-slate-600 dark:text-[#AAB8D0]">
                Honors Standing
              </span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                {gpaResult.gpa >= 3.8
                  ? 'High Distinction (Dean\'s List)'
                  : gpaResult.gpa >= 3.5
                  ? 'Distinction / First Class'
                  : gpaResult.gpa >= 3.0
                  ? 'Upper Second (Good)'
                  : 'Satisfactory Standing'}
              </p>
            </div>
          </div>

          {/* Course Rows Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F8FAFF]">
                Courses & Grade Units
              </span>
              <button
                type="button"
                onClick={addCourseRow}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4776FF] bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Course</span>
              </button>
            </div>

            <div className="space-y-2">
              {courses.map((course, idx) => (
                <div
                  key={course.id}
                  className="grid grid-cols-12 gap-2 sm:gap-3 items-center p-2.5 rounded-xl bg-[#090F1D] border border-[#263653]"
                >
                  <div className="col-span-6 sm:col-span-5">
                    <input
                      type="text"
                      value={course.courseName}
                      onChange={(e) => updateCourse(course.id, 'courseName', e.target.value)}
                      placeholder="Course Title"
                      className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653] text-[#F8FAFF]"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-3">
                    <select
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                      className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653] text-[#F8FAFF] font-semibold"
                    >
                      {Object.keys(gpaScale === '5.0' ? GRADE_SCALE_5 : GRADE_SCALE_4).map((g) => (
                        <option key={g} value={g}>
                          {g} ({(gpaScale === '5.0' ? GRADE_SCALE_5 : GRADE_SCALE_4)[g].toFixed(1)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-3">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={course.creditHours}
                      onChange={(e) => updateCourse(course.id, 'creditHours', parseInt(e.target.value, 10) || 1)}
                      className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653] text-[#F8FAFF] font-mono"
                    />
                  </div>

                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      disabled={courses.length <= 1}
                      onClick={() => removeCourseRow(course.id)}
                      className="p-1.5 text-[#AAB8D0] hover:text-rose-500 rounded-md transition-colors disabled:opacity-30"
                      title="Remove Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => {
                const report = `GPA Report - WriteGenius Tools\nTerm GPA: ${gpaResult.gpa.toFixed(2)} (${gpaScale} scale)\nTotal Credits: ${gpaResult.totalCredits}\n\nCourses:\n${courses
                  .map((c) => `- ${c.courseName}: Grade ${c.grade} (${c.creditHours} credits)`)
                  .join('\n')}`;
                downloadAsTxt(report, 'gpa-report.txt');
                onShowToast('GPA report exported as TXT!', 'success');
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#F8FAFF] bg-[#111A2E] hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export GPA Report</span>
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. CGPA Calculator */}
      {/* =================================================================== */}
      {tool.slug === 'cgpa-calculator' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#263653]">
            <div>
              <h2 className="text-base font-bold text-[#F8FAFF] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#4776FF]" />
                <span>Cumulative Grade Point Average (CGPA)</span>
              </h2>
              <p className="text-xs text-[#AAB8D0] mt-0.5">
                Aggregate multiple terms to compute overall degree standing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-center">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                Your Overall CGPA
              </span>
              <p className="text-4xl font-extrabold font-mono text-[#4776FF] mt-1">
                {cgpaResult.cgpa.toFixed(2)}
              </p>
              <span className="text-xs text-[#4776FF] mt-1 block">
                Cumulative across {semesters.length} semesters
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#090F1D] border border-[#263653] text-center">
              <span className="text-xs font-semibold text-slate-600 dark:text-[#AAB8D0]">
                Total Degree Credits Completed
              </span>
              <p className="text-4xl font-extrabold font-mono text-[#F8FAFF] mt-1">
                {cgpaResult.totalCredits}
              </p>
              <span className="text-xs text-[#AAB8D0] mt-1 block">Total Credit Hours</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F8FAFF]">
                Semester Breakdown
              </span>
              <button
                type="button"
                onClick={addSemesterRow}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#4776FF] bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Semester</span>
              </button>
            </div>

            <div className="space-y-2">
              {semesters.map((sem) => (
                <div
                  key={sem.id}
                  className="grid grid-cols-12 gap-2 sm:gap-3 items-center p-2.5 rounded-xl bg-[#090F1D] border border-[#263653]"
                >
                  <div className="col-span-6 sm:col-span-6">
                    <input
                      type="text"
                      value={sem.semesterName}
                      onChange={(e) => updateSemester(sem.id, 'semesterName', e.target.value)}
                      className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653]"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={sem.gpa}
                      onChange={(e) => updateSemester(sem.id, 'gpa', parseFloat(e.target.value) || 0)}
                      placeholder="GPA"
                      className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653] font-mono"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={sem.creditHours}
                      onChange={(e) => updateSemester(sem.id, 'creditHours', parseInt(e.target.value, 10) || 1)}
                      placeholder="Credits"
                      className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653] font-mono"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      disabled={semesters.length <= 1}
                      onClick={() => removeSemesterRow(sem.id)}
                      className="p-1.5 text-[#AAB8D0] hover:text-rose-500 rounded-md transition-colors disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. Percentage Calculator */}
      {/* =================================================================== */}
      {tool.slug === 'percentage-calculator' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-6">
          <div className="flex gap-2 border-b border-[#263653] pb-3">
            {[
              { id: 'whatIs', label: 'What is X% of Y?' },
              { id: 'isWhat', label: 'X is what % of Y?' },
              { id: 'change', label: '% Increase / Decrease' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPctMode(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  pctMode === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#111A2E] text-slate-600 dark:text-[#AAB8D0] hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#F8FAFF]">
                  {pctMode === 'whatIs' ? 'Percentage (X %)' : pctMode === 'isWhat' ? 'Number (X)' : 'Initial Value (A)'}
                </label>
                <input
                  type="number"
                  value={pctValA}
                  onChange={(e) => setPctValA(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 text-sm rounded-lg bg-[#090F1D] border border-[#263653] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#F8FAFF]">
                  {pctMode === 'whatIs' ? 'Of Total Number (Y)' : pctMode === 'isWhat' ? 'Total (Y)' : 'New Value (B)'}
                </label>
                <input
                  type="number"
                  value={pctValB}
                  onChange={(e) => setPctValB(parseFloat(e.target.value) || 0)}
                  className="w-full p-2.5 text-sm rounded-lg bg-[#090F1D] border border-[#263653] font-mono"
                />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-center space-y-1">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                Calculated Result
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-[#4776FF]">
                {computedPercentageAnswer}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4. Marks to Percentage Calculator */}
      {/* =================================================================== */}
      {tool.slug === 'marks-to-percentage-calculator' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F8FAFF]">
                Obtained / Scored Marks
              </label>
              <input
                type="number"
                value={obtainedMarks}
                onChange={(e) => setObtainedMarks(parseFloat(e.target.value) || 0)}
                className="w-full p-3 text-sm rounded-lg bg-[#090F1D] border border-[#263653] font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F8FAFF]">
                Maximum / Total Exam Marks
              </label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(parseFloat(e.target.value) || 1)}
                className="w-full p-3 text-sm rounded-lg bg-[#090F1D] border border-[#263653] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-center">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                Percentage Score
              </span>
              <p className="text-4xl font-extrabold font-mono text-[#4776FF] mt-1">
                {marksResult.percentage}%
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] text-center">
              <span className="text-xs font-semibold text-slate-600 dark:text-[#AAB8D0]">
                Letter Grade
              </span>
              <p className="text-4xl font-extrabold font-mono text-[#F8FAFF] mt-1">
                {marksResult.grade}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] text-center">
              <span className="text-xs font-semibold text-slate-600 dark:text-[#AAB8D0]">
                Status / Division
              </span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-3">
                {marksResult.remarks}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5. Average & Statistics Calculator */}
      {tool.slug === 'average-calculator' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F8FAFF]">
              Numbers Data Set (Separated by commas, spaces, or newlines)
            </label>
            <textarea
              rows={3}
              value={statsInput}
              onChange={(e) => setStatsInput(e.target.value)}
              className="w-full p-3 text-xs rounded-lg bg-[#090F1D] border border-[#263653] font-mono"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
              <span className="text-[#4776FF] block text-[11px] font-semibold">Mean (Average)</span>
              <p className="text-xl font-bold font-mono text-indigo-700 dark:text-indigo-300 mt-1">
                {statsResult.mean}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-[#AAB8D0] block text-[11px]">Median</span>
              <p className="text-xl font-bold font-mono text-[#F8FAFF] mt-1">
                {statsResult.median}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-[#AAB8D0] block text-[11px]">Mode</span>
              <p className="text-base font-bold font-mono text-[#F8FAFF] mt-1 truncate">
                {statsResult.mode.length > 0 ? statsResult.mode.join(', ') : 'None'}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-[#AAB8D0] block text-[11px]">Standard Dev</span>
              <p className="text-xl font-bold font-mono text-[#F8FAFF] mt-1">
                {statsResult.stdDev}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-[#AAB8D0] block text-[11px]">Count</span>
              <p className="text-lg font-bold font-mono text-[#F8FAFF] mt-1">
                {statsResult.count} values
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-[#AAB8D0] block text-[11px]">Sum Total</span>
              <p className="text-lg font-bold font-mono text-[#F8FAFF] mt-1">
                {statsResult.sum}
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-[#090F1D] border border-[#263653]">
              <span className="text-[#AAB8D0] block text-[11px]">Range (Max - Min)</span>
              <p className="text-lg font-bold font-mono text-[#F8FAFF] mt-1">
                {statsResult.range} ({statsResult.min} - {statsResult.max})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 6. Study Timetable Planner */}
      {tool.slug === 'study-timetable-planner' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#263653]">
            <div>
              <h2 className="text-base font-bold text-[#F8FAFF] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#4776FF]" />
                <span>Weekly Revision & Study Timetable</span>
              </h2>
              <p className="text-xs text-[#AAB8D0]">Plan and balance subject hours throughout the week.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                const text = `Weekly Study Schedule\n\n${timetable
                  .map((t) => `${t.day} | ${t.slot}\n  Subject: ${t.subject}\n  Focus: ${t.topic}\n`)
                  .join('\n')}`;
                downloadAsTxt(text, 'study-timetable.txt');
                onShowToast('Schedule exported as TXT!', 'success');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F8FAFF] bg-[#111A2E] rounded-lg hover:bg-slate-200"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Schedule</span>
            </button>
          </div>

          {/* Add Study Block Form */}
          <div className="p-4 rounded-xl bg-[#090F1D] border border-[#263653] grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-[#AAB8D0] block mb-1">Day</label>
              <select
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653]"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-[#AAB8D0] block mb-1">Time Block</label>
              <select
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653]"
              >
                <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                <option value="Afternoon (14:00 - 17:00)">Afternoon (14:00 - 17:00)</option>
                <option value="Evening (18:00 - 21:00)">Evening (18:00 - 21:00)</option>
                <option value="Night (21:30 - 23:30)">Night (21:30 - 23:30)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-[#AAB8D0] block mb-1">Subject</label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Physics"
                className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-[#AAB8D0] block mb-1">Topic / Goal</label>
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="e.g. Chapter 3 Problems"
                className="w-full p-2 text-xs rounded-lg bg-[#0D1424] border border-[#263653]"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => {
                  if (!newSubject.trim()) {
                    onShowToast('Please enter subject title', 'error');
                    return;
                  }
                  setTimetable([
                    ...timetable,
                    {
                      id: String(Date.now()),
                      day: newDay,
                      slot: newSlot,
                      subject: newSubject,
                      topic: newTopic || 'General review',
                    },
                  ]);
                  setNewSubject('');
                  setNewTopic('');
                  onShowToast('Added study session to timetable', 'success');
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Session</span>
              </button>
            </div>
          </div>

          {/* Timetable List by Day */}
          <div className="space-y-3">
            {timetable.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#090F1D] border border-[#263653] text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-bold text-[#4776FF] min-w-20">
                    {item.day}
                  </span>
                  <span className="text-[#AAB8D0] font-mono text-[11px]">
                    {item.slot}
                  </span>
                  <span className="font-semibold text-[#F8FAFF]">
                    {item.subject}
                  </span>
                  <span className="text-[#AAB8D0]">
                    · {item.topic}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setTimetable(timetable.filter((t) => t.id !== item.id))}
                  className="p-1 text-[#AAB8D0] hover:text-rose-500 rounded-md"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 7. Exam Countdown Calculator */}
      {tool.slug === 'exam-countdown-calculator' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#F8FAFF]">
                Exam Subject / Milestone
              </label>
              <input
                type="text"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg bg-[#090F1D] border border-[#263653]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#F8FAFF]">
                Exam Date & Time
              </label>
              <input
                type="datetime-local"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-2.5 text-xs rounded-lg bg-[#090F1D] border border-[#263653] font-mono"
              />
            </div>
          </div>

          {/* Countdown Clock Tiles */}
          <div className="p-8 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-center space-y-4">
            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 tracking-wide uppercase">
              Countdown to {examName}
            </h3>

            {countdown.isPast ? (
              <p className="text-lg font-bold text-rose-500">
                The target exam date has already passed.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto">
                <div className="p-3 sm:p-4 rounded-xl bg-[#0D1424] shadow-xs border border-[#263653]">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#4776FF]">
                    {countdown.days}
                  </span>
                  <span className="text-[11px] text-[#AAB8D0] block mt-1 uppercase font-semibold">Days</span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-[#0D1424] shadow-xs border border-[#263653]">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#4776FF]">
                    {countdown.hours}
                  </span>
                  <span className="text-[11px] text-[#AAB8D0] block mt-1 uppercase font-semibold">Hours</span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-[#0D1424] shadow-xs border border-[#263653]">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#4776FF]">
                    {countdown.minutes}
                  </span>
                  <span className="text-[11px] text-[#AAB8D0] block mt-1 uppercase font-semibold">Mins</span>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-[#0D1424] shadow-xs border border-[#263653]">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                    {countdown.seconds}
                  </span>
                  <span className="text-[11px] text-[#AAB8D0] block mt-1 uppercase font-semibold">Secs</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 8. Study Session Planner / Pomodoro Timer */}
      {tool.slug === 'study-session-planner' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-6">
          <div className="flex flex-wrap gap-2 justify-center pb-2 border-b border-[#263653]">
            {[
              { id: 'pomodoro', label: '25m Pomodoro' },
              { id: 'deepWork', label: '50m Deep Work' },
              { id: 'shortBreak', label: '5m Short Break' },
              { id: 'longBreak', label: '15m Long Break' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setTimerDuration(m.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  timerMode === m.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#111A2E] text-slate-600 dark:text-[#AAB8D0] hover:bg-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Giant Timer Display */}
          <div className="p-8 rounded-2xl bg-[#090F1D] border border-[#263653] text-center space-y-4">
            <span className="text-6xl sm:text-7xl font-extrabold font-mono tracking-wider text-[#F8FAFF]">
              {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:
              {String(secondsLeft % 60).padStart(2, '0')}
            </span>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#4776FF] to-[#8957FF] hover:opacity-90 rounded-lg transition-colors shadow-xs"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isRunning ? 'Pause' : 'Start Focus Session'}</span>
              </button>
              <button
                type="button"
                onClick={() => setTimerDuration(timerMode)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-[#F8FAFF] bg-slate-200 dark:bg-slate-800 rounded-lg hover:bg-slate-300"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            <div className="text-xs text-[#AAB8D0] pt-2">
              Completed Today: <strong className="text-indigo-600 font-mono">{completedSessions} sessions</strong>
            </div>
          </div>

          {/* Session Checklist */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-[#F8FAFF] flex items-center gap-1.5">
              <ListTodo className="w-4 h-4 text-[#4776FF]" />
              <span>Target Objectives for this Study Block</span>
            </span>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Add focus task..."
                className="flex-1 p-2 text-xs rounded-lg bg-[#090F1D] border border-[#263653]"
              />
              <button
                type="button"
                onClick={() => {
                  if (newTaskText.trim()) {
                    setSessionTasks([
                      ...sessionTasks,
                      { id: String(Date.now()), text: newTaskText.trim(), done: false },
                    ]);
                    setNewTaskText('');
                  }
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5">
              {sessionTasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() =>
                    setSessionTasks(
                      sessionTasks.map((item) => (item.id === t.id ? { ...item, done: !item.done } : item))
                    )
                  }
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-[#263653] cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => {}}
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span className={t.done ? 'line-through text-[#AAB8D0]' : 'text-[#F8FAFF]'}>
                    {t.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 9. Scientific Calculator */}
      {tool.slug === 'scientific-calculator' && (
        <div className="p-6 rounded-2xl bg-[#0D1424] border border-[#263653] shadow-xs space-y-5">
          <div className="max-w-md mx-auto space-y-4">
            {/* Display screen */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-right space-y-1">
              <div className="text-xs text-[#AAB8D0] font-mono min-h-5 overflow-x-auto">
                {calcDisplay || '0'}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-wider overflow-x-auto">
                {calcResult}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-5 gap-2 text-xs font-mono">
              {['sin(', 'cos(', 'tan(', 'log(', 'ln('].map((fn) => (
                <button
                  key={fn}
                  type="button"
                  onClick={() => handleCalcButton(fn)}
                  className="p-2.5 rounded-lg bg-[#111A2E] text-[#4776FF] font-bold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  {fn.replace('(', '')}
                </button>
              ))}

              {['(', ')', '^', 'sqrt(', 'AC'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleCalcButton(b)}
                  className={`p-2.5 rounded-lg font-bold transition-colors ${
                    b === 'AC'
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-[#111A2E] text-[#F8FAFF] hover:bg-slate-200'
                  }`}
                >
                  {b === 'sqrt(' ? '√' : b}
                </button>
              ))}

              {['7', '8', '9', '÷', 'DEL'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleCalcButton(b)}
                  className={`p-2.5 rounded-lg font-bold transition-colors ${
                    b === 'DEL'
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : b === '÷'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-50 dark:bg-slate-950/80 text-[#F8FAFF] border border-[#263653]'
                  }`}
                >
                  {b}
                </button>
              ))}

              {['4', '5', '6', '×', 'π'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleCalcButton(b)}
                  className={`p-2.5 rounded-lg font-bold transition-colors ${
                    b === '×' || b === 'π'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-50 dark:bg-slate-950/80 text-[#F8FAFF] border border-[#263653]'
                  }`}
                >
                  {b}
                </button>
              ))}

              {['1', '2', '3', '-', 'e'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleCalcButton(b)}
                  className={`p-2.5 rounded-lg font-bold transition-colors ${
                    b === '-' || b === 'e'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-50 dark:bg-slate-950/80 text-[#F8FAFF] border border-[#263653]'
                  }`}
                >
                  {b}
                </button>
              ))}

              {['0', '.', '+', '=', '%'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleCalcButton(b)}
                  className={`p-2.5 rounded-lg font-bold transition-colors ${
                    b === '='
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700 font-extrabold'
                      : 'bg-[#111A2E] text-[#F8FAFF]'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* History Tape */}
            {calcHistory.length > 0 && (
              <div className="pt-2 border-t border-[#263653] space-y-1.5">
                <span className="text-[11px] text-[#AAB8D0] font-semibold uppercase">Recent Calculations</span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {calcHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-[11px] font-mono text-slate-600 dark:text-[#AAB8D0] bg-slate-50 dark:bg-slate-950/40 p-1.5 rounded"
                    >
                      <span>{item.expr}</span>
                      <strong className="text-[#F8FAFF]">{item.result}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
