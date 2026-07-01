import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import StudentLogin from "./components/StudentLogin";
import StudentDashboard from "./components/StudentDashboard";
import TestTaking from "./components/TestTaking";
import ResultView from "./components/ResultView";
import SolutionView from "./components/SolutionView";
import AdminDashboard from "./components/AdminDashboard";
import RevisionMode from "./components/RevisionMode";

import { Test, Student, TestResult, Notice, Quiz, PDFNote, Question } from "./types";
import { INITIAL_TESTS, MOCK_STUDENTS, INITIAL_RESULTS, INITIAL_NOTICES, INITIAL_QUIZZES, INITIAL_PDF_NOTES } from "./mockData";

export default function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<
    "landing" | "student-login" | "student-dashboard" | "test-taking" | "result" | "solutions" | "admin-dashboard" | "revision-mode"
  >("landing");

  // Domain states
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [pdfNotes, setPdfNotes] = useState<PDFNote[]>(INITIAL_PDF_NOTES);

  // Active Context States
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedTests = localStorage.getItem("shajahan_tests");
      if (savedTests) {
        setTests(JSON.parse(savedTests));
      } else {
        setTests(INITIAL_TESTS);
        localStorage.setItem("shajahan_tests", JSON.stringify(INITIAL_TESTS));
      }

      const savedStudents = localStorage.getItem("shajahan_students");
      if (savedStudents) {
        setStudents(JSON.parse(savedStudents));
      } else {
        setStudents(MOCK_STUDENTS);
        localStorage.setItem("shajahan_students", JSON.stringify(MOCK_STUDENTS));
      }

      const savedResults = localStorage.getItem("shajahan_results");
      if (savedResults) {
        setResults(JSON.parse(savedResults));
      } else {
        setResults(INITIAL_RESULTS);
        localStorage.setItem("shajahan_results", JSON.stringify(INITIAL_RESULTS));
      }
    } catch (e) {
      console.error("Local storage parsing failed, falling back to initial data:", e);
      setTests(INITIAL_TESTS);
      setStudents(MOCK_STUDENTS);
      setResults(INITIAL_RESULTS);
    }
  }, []);

  // Save changes to localStorage helper functions
  const saveTests = (updatedTests: Test[]) => {
    setTests(updatedTests);
    localStorage.setItem("shajahan_tests", JSON.stringify(updatedTests));
  };

  const saveStudents = (updatedStudents: Student[]) => {
    setStudents(updatedStudents);
    localStorage.setItem("shajahan_students", JSON.stringify(updatedStudents));
  };

  const saveResults = (updatedResults: TestResult[]) => {
    setResults(updatedResults);
    localStorage.setItem("shajahan_results", JSON.stringify(updatedResults));
  };

  // Test Submission Handler
  const handleSubmitTest = (answersMap: { [questionId: string]: number }, timeTakenSeconds: number) => {
    if (!activeTest || !loggedInStudent) return;

    let correctAnswers = 0;
    let wrongAnswers = 0;
    let unattemptedQuestions = 0;

    const subjectPerformance: { [subject: string]: { correct: number; total: number } } = {};

    activeTest.questions.forEach((q) => {
      // Initialize subject analysis if not exists
      if (!subjectPerformance[q.subject]) {
        subjectPerformance[q.subject] = { correct: 0, total: 0 };
      }
      subjectPerformance[q.subject].total += 1;

      const studentAnsIdx = answersMap[q.id];

      if (studentAnsIdx === undefined || studentAnsIdx === -1) {
        unattemptedQuestions += 1;
      } else if (studentAnsIdx === q.correctOptionIndex) {
        correctAnswers += 1;
        subjectPerformance[q.subject].correct += 1;
      } else {
        wrongAnswers += 1;
      }
    });

    // Calculate final marks: correct * positive_marks - wrong * negative_marking
    const rawMarks = (correctAnswers * activeTest.marksPerQuestion) - (wrongAnswers * activeTest.negativeMarking);
    const totalMarksObtained = Math.max(0, parseFloat(rawMarks.toFixed(2))); // lower boundary at 0
    
    const maxMarks = activeTest.questions.length * activeTest.marksPerQuestion;
    const percentage = Math.round((totalMarksObtained / maxMarks) * 100);

    const newResult: TestResult = {
      id: `res-${Date.now()}`,
      testId: activeTest.id,
      testTitle: activeTest.title,
      studentMobile: loggedInStudent.mobile,
      studentName: loggedInStudent.name,
      rollNumber: loggedInStudent.rollNumber,
      batchName: loggedInStudent.batchName,
      correctAnswers,
      wrongAnswers,
      unattemptedQuestions,
      totalMarksObtained,
      maxMarks,
      percentage,
      timeTakenSeconds,
      submittedAt: new Date().toISOString(),
      answersMap,
      subjectPerformance
    };

    const updatedResults = [newResult, ...results];
    saveResults(updatedResults);

    setActiveResultId(newResult.id);
    setCurrentView("result");
  };

  // Action methods
  const handleAddTest = (newTest: Test) => {
    const updated = [newTest, ...tests];
    saveTests(updated);
  };

  const handleDeleteTest = (testId: string) => {
    const updated = tests.filter((t) => t.id !== testId);
    saveTests(updated);
  };

  const handleRegisterStudent = (newStudent: Student) => {
    const updated = [...students, newStudent];
    saveStudents(updated);
  };

  const handleLogout = () => {
    setLoggedInStudent(null);
    setActiveTest(null);
    setActiveResultId(null);
    setCurrentView("landing");
  };

  // Extract all questions for revision pool
  const allQuestions: Question[] = tests.flatMap((t) => t.questions);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      
      {/* View routing */}
      {currentView === "landing" && (
        <LandingPage
          onStartTest={() => {
            if (loggedInStudent) {
              setCurrentView("student-dashboard");
            } else {
              setCurrentView("student-login");
            }
          }}
          onNavigateToLogin={() => {
            if (loggedInStudent) {
              setCurrentView("student-dashboard");
            } else {
              setCurrentView("student-login");
            }
          }}
          onNavigateToAdmin={() => setCurrentView("admin-dashboard")}
        />
      )}

      {currentView === "student-login" && (
        <StudentLogin
          onLogin={(student) => {
            setLoggedInStudent(student);
            setCurrentView("student-dashboard");
          }}
          onNavigateBack={() => setCurrentView("landing")}
          existingStudents={students}
          onRegisterStudent={handleRegisterStudent}
        />
      )}

      {currentView === "student-dashboard" && loggedInStudent && (
        <StudentDashboard
          student={loggedInStudent}
          tests={tests}
          notices={notices}
          quizzes={quizzes}
          pdfNotes={pdfNotes}
          results={results}
          onStartTest={(test) => {
            setActiveTest(test);
            setCurrentView("test-taking");
          }}
          onViewResult={(resultId) => {
            setActiveResultId(resultId);
            // Locate the associated test for this result
            const resObj = results.find(r => r.id === resultId);
            const testObj = tests.find(t => t.id === resObj?.testId);
            if (testObj) {
              setActiveTest(testObj);
            }
            setCurrentView("result");
          }}
          onLogout={handleLogout}
          onNavigateToRevision={() => setCurrentView("revision-mode")}
        />
      )}

      {currentView === "test-taking" && activeTest && loggedInStudent && (
        <TestTaking
          test={activeTest}
          onSubmitTest={handleSubmitTest}
          onCancel={() => setCurrentView("student-dashboard")}
        />
      )}

      {currentView === "result" && activeResultId && activeTest && loggedInStudent && (
        <ResultView
          result={results.find((r) => r.id === activeResultId)!}
          test={activeTest}
          allResults={results}
          onViewSolutions={() => setCurrentView("solutions")}
          onBackToDashboard={() => setCurrentView("student-dashboard")}
        />
      )}

      {currentView === "solutions" && activeResultId && activeTest && loggedInStudent && (
        <SolutionView
          result={results.find((r) => r.id === activeResultId)!}
          test={activeTest}
          onBackToResult={() => setCurrentView("result")}
          onPracticeWrongs={() => setCurrentView("revision-mode")}
        />
      )}

      {currentView === "admin-dashboard" && (
        <AdminDashboard
          tests={tests}
          students={students}
          results={results}
          onAddTest={handleAddTest}
          onDeleteTest={handleDeleteTest}
          onNavigateBack={() => setCurrentView("landing")}
          onAddNotice={(notice) => {
            setNotices([notice, ...notices]);
          }}
          onAddPDF={(pdf) => {
            setPdfNotes([pdf, ...pdfNotes]);
          }}
        />
      )}

      {currentView === "revision-mode" && loggedInStudent && (
        <RevisionMode
          results={results.filter((r) => r.studentMobile === loggedInStudent.mobile)}
          allQuestions={allQuestions}
          onBackToDashboard={() => {
            if (loggedInStudent) {
              setCurrentView("student-dashboard");
            } else {
              setCurrentView("landing");
            }
          }}
        />
      )}

    </div>
  );
}
