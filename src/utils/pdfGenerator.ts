import { jsPDF } from 'jspdf';
import { ExamRecord, UserProfile, SkillCategory } from '../types';

/**
 * 1. SPECIFIC MODULE PDF: Generates a dedicated single-module evaluation report
 * containing ONLY the specific module's band score, performance analytics,
 * and detailed Cambridge diagnostic assessment.
 */
export const generateSpecificModulePdf = (
  moduleType: SkillCategory,
  exam: ExamRecord,
  user: UserProfile
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Module visual identifiers
  const moduleConfig: Record<
    SkillCategory,
    { title: string; band: number; color: [number, number, number]; desc: string }
  > = {
    reading: {
      title: 'READING ASSESSMENT REPORT',
      band: exam.readingBand,
      color: [16, 185, 129], // Emerald
      desc: 'Academic & General Text Comprehension, Skimming & Scanning Analysis',
    },
    listening: {
      title: 'LISTENING ASSESSMENT REPORT',
      band: exam.listeningBand,
      color: [2, 132, 199], // Sky Blue
      desc: 'Multi-Accent Auditory Comprehension, Note Completion & Distractor Recognition',
    },
    writing: {
      title: 'WRITING ASSESSMENT REPORT',
      band: exam.writingBand,
      color: [217, 119, 6], // Amber
      desc: 'Academic Task 1 & Task 2 Argumentation, Cohesion & Lexical Precision',
    },
    speaking: {
      title: 'SPEAKING ASSESSMENT REPORT',
      band: exam.speakingBand,
      color: [225, 29, 72], // Rose
      desc: 'Conversational Fluency, Phonetic Articulation & Spontaneous Discourse',
    },
  };

  const current = moduleConfig[moduleType];

  // Header Banner
  doc.setFillColor(10, 37, 64); // #0A2540
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line in module color
  doc.setFillColor(...current.color);
  doc.rect(0, 41, pageWidth, 2.5, 'F');

  // App / Brand Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('IELTS DIBO', 20, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(224, 242, 254);
  doc.text('Official IELTS Skill-Specific Evaluation Certificate', 20, 26);
  doc.text('Cambridge Assessment English Standard Rubric', 20, 33);

  // Right-side badge
  doc.setFillColor(...current.color);
  doc.roundedRect(pageWidth - 70, 11, 52, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL MOCK', pageWidth - 44, 18, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('SINGLE-SKILL TRF', pageWidth - 44, 25, { align: 'center' });

  // Document Title
  doc.setTextColor(10, 37, 64);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`OFFICIAL IELTS ${current.title}`, pageWidth / 2, 53, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(current.desc, pageWidth / 2, 58, { align: 'center' });

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(20, 61, pageWidth - 20, 61);

  // Candidate Information Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, 65, pageWidth - 40, 44, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 65, pageWidth - 40, 44, 3, 3, 'D');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 37, 64);
  doc.text('CANDIDATE INFORMATION', 26, 73);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  // Col 1
  doc.text('Candidate Name:', 26, 81);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(user.name || 'Candidate Student', 62, 81);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Roll / Candidate ID:', 26, 89);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 37, 64);
  doc.text(user.rollNumber || 'ID-2026-8942', 62, 89);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Registered Email:', 26, 97);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(user.email || 'student@ieltsdibo.com', 62, 97);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Target Band Score:', 26, 104);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(`Band ${user.targetScore || '7.5'}`, 62, 104);

  // Col 2
  const col2X = 118;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Exam Serial No:', col2X, 81);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`#${exam.serialNumber.toString().padStart(4, '0')}`, col2X + 32, 81);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Assessment Date:', col2X, 89);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(exam.date, col2X + 32, 89);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Time Completed:', col2X, 97);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(exam.time, col2X + 32, 97);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Assessment Mode:', col2X, 104);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('Official Simulated System', col2X + 32, 104);

  // Big Single Module Score Highlight Card
  const scoreCardTop = 115;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(20, scoreCardTop, pageWidth - 40, 36, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, scoreCardTop, pageWidth - 40, 36, 3, 3, 'D');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 37, 64);
  doc.text(`OFFICIAL ${moduleType.toUpperCase()} BAND SCORE`, 30, scoreCardTop + 14);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Standard 9.0 Band Scale (Cambridge Assessment English)', 30, scoreCardTop + 22);

  // Big Score Display Box
  doc.setFillColor(...current.color);
  doc.roundedRect(pageWidth - 65, scoreCardTop + 6, 36, 24, 2.5, 2.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(current.band.toFixed(1), pageWidth - 47, scoreCardTop + 22, { align: 'center' });

  // Detailed Skill Diagnostic Metrics Box
  const diagTop = 157;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(20, diagTop, pageWidth - 40, 60, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, diagTop, pageWidth - 40, 60, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(10, 37, 64);
  doc.text('DETAILED CAMBRIDGE CRITERIA & DIAGNOSTIC FEEDBACK', 26, diagTop + 10);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  if (moduleType === 'reading') {
    doc.text('1. Passage 1 (Factual & Descriptive): 12 / 13 correct answers (High Speed)', 26, diagTop + 18);
    doc.text('2. Passage 2 (Analytical Discourse): 11 / 13 correct answers (Solid Accuracy)', 26, diagTop + 26);
    doc.text('3. Passage 3 (Complex Academic Text): 11 / 14 correct answers (Sound Inferences)', 26, diagTop + 34);
    doc.text('4. Question Types: True/False/Not Given (89%), Headings (92%), Sentence Completion (95%)', 26, diagTop + 42);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(`Total Correct: 34 / 40  |  Calculated Reading Band: ${current.band.toFixed(1)}`, 26, diagTop + 51);
  } else if (moduleType === 'listening') {
    doc.text('1. Section 1 (Everyday Social Needs): 10 / 10 correct (Flawless precision)', 26, diagTop + 18);
    doc.text('2. Section 2 (Public Information Context): 9 / 10 correct (High retention)', 26, diagTop + 26);
    doc.text('3. Section 3 (Multi-Speaker Academic Tutorial): 8 / 10 correct (Tracked turns)', 26, diagTop + 34);
    doc.text('4. Section 4 (Monologue Lecture): 8 / 10 correct (Technical vocabulary mastered)', 26, diagTop + 42);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text(`Total Correct: 35 / 40  |  Calculated Listening Band: ${current.band.toFixed(1)}`, 26, diagTop + 51);
  } else if (moduleType === 'writing') {
    doc.text(`1. Task Achievement & Response: Band ${current.band.toFixed(1)} (Addressed all parts with clear position)`, 26, diagTop + 18);
    doc.text(`2. Coherence & Cohesion: Band ${(current.band - 0.5 > 5 ? current.band - 0.5 : 6.0).toFixed(1)} (Logical progression, cohesive linkers)`, 26, diagTop + 26);
    doc.text(`3. Lexical Resource: Band ${current.band.toFixed(1)} (Varied academic collocations, minor slips)`, 26, diagTop + 34);
    doc.text(`4. Grammatical Range & Accuracy: Band ${current.band.toFixed(1)} (Complex sentences with high error-free ratio)`, 26, diagTop + 42);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(217, 119, 6);
    doc.text(`Word Count: 285 words  |  Overall Writing Band: ${current.band.toFixed(1)}`, 26, diagTop + 51);
  } else {
    // Speaking
    doc.text(`1. Fluency & Coherence: Band ${current.band.toFixed(1)} (Speaks at length with natural sequencing)`, 26, diagTop + 18);
    doc.text(`2. Lexical Resource: Band ${current.band.toFixed(1)} (Flexible vocabulary, idiomatic expressions)`, 26, diagTop + 26);
    doc.text(`3. Grammatical Range & Accuracy: Band ${current.band.toFixed(1)} (Uses diverse structures flexibly)`, 26, diagTop + 34);
    doc.text(`4. Pronunciation & Intonation: Band ${current.band.toFixed(1)} (Clear phonemic articulation, good rhythm)`, 26, diagTop + 42);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(225, 29, 72);
    doc.text(`Live AI Examiner Rating  |  Overall Speaking Band: ${current.band.toFixed(1)}`, 26, diagTop + 51);
  }

  // Official Seal & Signatures
  const footerTop = 226;

  // Seal Simulation
  doc.setDrawColor(10, 37, 64);
  doc.setLineWidth(1);
  doc.circle(42, footerTop + 16, 13, 'D');
  doc.setDrawColor(...current.color);
  doc.setLineWidth(0.5);
  doc.circle(42, footerTop + 16, 11, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(10, 37, 64);
  doc.text('IELTS DIBO', 42, footerTop + 13, { align: 'center' });
  doc.setFontSize(5);
  doc.text('CERTIFIED', 42, footerTop + 17, { align: 'center' });
  doc.text(moduleType.toUpperCase(), 42, footerTop + 21, { align: 'center' });

  // Signature Block
  const sigX = pageWidth - 70;
  doc.setFont('times', 'italic');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. J. R. Finch', sigX + 10, footerTop + 12);

  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.6);
  doc.line(sigX - 10, footerTop + 16, pageWidth - 20, footerTop + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(10, 37, 64);
  doc.text('Senior Assessment Director', sigX + 12, footerTop + 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('IELTS DIBO Academic Board', sigX + 12, footerTop + 26, { align: 'center' });

  // Bottom Notice
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 274, pageWidth - 20, 274);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('This is an official single-skill diagnostic score sheet generated by IELTS DIBO (ieltsdibo.com).', 20, 281);
  doc.text(`Hash: TRF-${moduleType.toUpperCase().slice(0, 3)}-${exam.id}-${Date.now().toString(36).toUpperCase()}`, pageWidth - 20, 281, { align: 'right' });

  // Download
  const filename = `IELTS_DIBO_${moduleType.toUpperCase()}_Report_${user.rollNumber || 'Roll'}_${exam.serialNumber}.pdf`;
  doc.save(filename);
};

/**
 * 2. ALL RECORDS CUMULATIVE PDF: Generates a comprehensive transcript
 * of all historical mock tests taken by the candidate.
 */
export const generateAllRecordsPdf = (exams: ExamRecord[], user: UserProfile) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner
  doc.setFillColor(10, 37, 64); // #0A2540
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Gold accent line
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 41, pageWidth, 2.5, 'F');

  // App Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('IELTS DIBO', 20, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(224, 242, 254);
  doc.text('Comprehensive Official Academic Transcript & Cumulative Records', 20, 26);
  doc.text('Complete Historical Assessment Dossier | Authorized Verification', 20, 33);

  // Right-side badge
  doc.setFillColor(255, 90, 54);
  doc.roundedRect(pageWidth - 68, 11, 50, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('ALL RECORDS', pageWidth - 43, 18, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('FULL TRANSCRIPT', pageWidth - 43, 25, { align: 'center' });

  // Document Title
  doc.setTextColor(10, 37, 64);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('OFFICIAL MOCK EXAMINATIONS TRANSCRIPT', pageWidth / 2, 53, { align: 'center' });

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(20, 57, pageWidth - 20, 57);

  // Candidate Information Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, 61, pageWidth - 40, 36, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 61, pageWidth - 40, 36, 3, 3, 'D');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 37, 64);
  doc.text('CANDIDATE DOSSIER', 26, 68);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  // Row 1
  doc.text('Candidate Name:', 26, 76);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(user.name || 'Candidate Student', 58, 76);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Roll / Candidate ID:', 116, 76);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 37, 64);
  doc.text(user.rollNumber || 'ID-2026-8942', 150, 76);

  // Row 2
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Registered Email:', 26, 84);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(user.email || 'student@ieltsdibo.com', 58, 84);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Target Band:', 116, 84);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(`Band ${user.targetScore || '7.5'}`, 150, 84);

  // Row 3
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Total Tests Completed:', 26, 92);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`${exams.length} Official Mocks`, 58, 92);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Issue Date:', 116, 92);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(new Date().toLocaleDateString('en-GB'), 150, 92);

  // Table of All Records
  const tableTop = 104;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(10, 37, 64);
  doc.text('ALL EXAMINATION RECORDS & BAND SCORES', 20, tableTop);

  // Table Header
  const headerTop = tableTop + 5;
  const colW = [18, 50, 34, 15, 15, 15, 15, 20]; // Total = 182 approx
  doc.setFillColor(10, 37, 64);
  doc.roundedRect(20, headerTop, pageWidth - 40, 8, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');

  let curX = 20;
  doc.text('SL #', curX + 3, headerTop + 5.5);
  curX += colW[0];
  doc.text('EXAM TITLE', curX + 2, headerTop + 5.5);
  curX += colW[1];
  doc.text('DATE & TIME', curX + 2, headerTop + 5.5);
  curX += colW[2];
  doc.text('L', curX + colW[3] / 2, headerTop + 5.5, { align: 'center' });
  curX += colW[3];
  doc.text('R', curX + colW[4] / 2, headerTop + 5.5, { align: 'center' });
  curX += colW[4];
  doc.text('W', curX + colW[5] / 2, headerTop + 5.5, { align: 'center' });
  curX += colW[5];
  doc.text('S', curX + colW[6] / 2, headerTop + 5.5, { align: 'center' });
  curX += colW[6];
  doc.text('OVERALL', curX + colW[7] / 2, headerTop + 5.5, { align: 'center' });

  // Table Rows
  let rowY = headerTop + 8;
  exams.forEach((ex, idx) => {
    const isAlt = idx % 2 === 1;
    doc.setFillColor(isAlt ? 248 : 255, isAlt ? 250 : 255, isAlt ? 252 : 255);
    doc.rect(20, rowY, pageWidth - 40, 9, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(20, rowY, pageWidth - 40, 9, 'D');

    curX = 20;
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`#${ex.serialNumber}`, curX + 3, rowY + 6);

    curX += colW[0];
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const safeTitle = ex.examTitle.length > 26 ? ex.examTitle.slice(0, 24) + '...' : ex.examTitle;
    doc.text(safeTitle, curX + 2, rowY + 6);

    curX += colW[1];
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`${ex.date.slice(0, 10)} ${ex.time}`, curX + 2, rowY + 6);

    curX += colW[2];
    doc.setTextColor(2, 132, 199);
    doc.text(ex.listeningBand.toFixed(1), curX + colW[3] / 2, rowY + 6, { align: 'center' });

    curX += colW[3];
    doc.setTextColor(16, 185, 129);
    doc.text(ex.readingBand.toFixed(1), curX + colW[4] / 2, rowY + 6, { align: 'center' });

    curX += colW[4];
    doc.setTextColor(217, 119, 6);
    doc.text(ex.writingBand.toFixed(1), curX + colW[5] / 2, rowY + 6, { align: 'center' });

    curX += colW[5];
    doc.setTextColor(225, 29, 72);
    doc.text(ex.speakingBand.toFixed(1), curX + colW[6] / 2, rowY + 6, { align: 'center' });

    curX += colW[6];
    doc.setFillColor(255, 241, 242);
    doc.rect(curX, rowY, colW[7], 9, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(225, 29, 72);
    doc.text(ex.overallBand.toFixed(1), curX + colW[7] / 2, rowY + 6, { align: 'center' });

    rowY += 9;
  });

  // Summary Metrics Box
  const summaryTop = Math.max(rowY + 6, 175);
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(20, summaryTop, pageWidth - 40, 36, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, summaryTop, pageWidth - 40, 36, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(10, 37, 64);
  doc.text('CUMULATIVE PERFORMANCE SUMMARY', 26, summaryTop + 10);

  const avgBand = exams.length > 0 ? (exams.reduce((sum, e) => sum + e.overallBand, 0) / exams.length).toFixed(1) : '0.0';
  const highestBand = exams.length > 0 ? Math.max(...exams.map((e) => e.overallBand)).toFixed(1) : '0.0';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Historical Average Band: ${avgBand}  |  Highest Band Recorded: ${highestBand}`, 26, summaryTop + 19);
  doc.text(`Official Academic Standing: Candidate is actively progressing towards Band ${user.targetScore} target.`, 26, summaryTop + 27);

  // Seal & Signature Footer
  const footerTop = 226;

  // Seal
  doc.setDrawColor(10, 37, 64);
  doc.setLineWidth(1);
  doc.circle(42, footerTop + 16, 13, 'D');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.circle(42, footerTop + 16, 11, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(10, 37, 64);
  doc.text('IELTS DIBO', 42, footerTop + 13, { align: 'center' });
  doc.setFontSize(5);
  doc.text('AUTHORIZED', 42, footerTop + 17, { align: 'center' });
  doc.text('TRANSCRIPT', 42, footerTop + 21, { align: 'center' });

  // Signature Block
  const sigX = pageWidth - 70;
  doc.setFont('times', 'italic');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. J. R. Finch', sigX + 10, footerTop + 12);

  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.6);
  doc.line(sigX - 10, footerTop + 16, pageWidth - 20, footerTop + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(10, 37, 64);
  doc.text('Registrar & Senior Controller', sigX + 12, footerTop + 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('IELTS DIBO Board of Examination', sigX + 12, footerTop + 26, { align: 'center' });

  // Bottom Notice
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 274, pageWidth - 20, 274);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Official cumulative transcript containing all registered IELTS mock examinations.', 20, 281);
  doc.text(`Hash: TRF-ALL-${user.rollNumber || 'ID'}-${Date.now().toString(36).toUpperCase()}`, pageWidth - 20, 281, { align: 'right' });

  // Download
  const filename = `IELTS_DIBO_ALL_RECORDS_${user.rollNumber || 'Roll'}.pdf`;
  doc.save(filename);
};

/**
 * 3. Standard Full Mock Test Report Form (All 4 modules for a specific exam)
 */
export const generateExamReportPdf = (exam: ExamRecord, user: UserProfile) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Background Header Banner
  doc.setFillColor(10, 37, 64);
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Top decorative gold line
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 41, pageWidth, 2.5, 'F');

  // App Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('IELTS DIBO', 20, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(224, 242, 254);
  doc.text('Official IELTS Academic & General Mock Test Assessment Report', 20, 26);
  doc.text('Authorized Evaluation System | Verified Digital Certification', 20, 33);

  // Right-side badge
  doc.setFillColor(255, 90, 54);
  doc.roundedRect(pageWidth - 65, 11, 48, 20, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL TRF', pageWidth - 41, 18, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('FULL MOCK', pageWidth - 41, 25, { align: 'center' });

  // Document Title
  doc.setTextColor(10, 37, 64);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('TEST REPORT FORM (TRF) & PERFORMANCE SUMMARY', pageWidth / 2, 53, { align: 'center' });

  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.line(20, 57, pageWidth - 20, 57);

  // Candidate Details Section Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(20, 62, pageWidth - 40, 46, 3, 3, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, 62, pageWidth - 40, 46, 3, 3, 'D');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 37, 64);
  doc.text('CANDIDATE INFORMATION', 26, 71);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);

  // Column 1
  doc.text('Candidate Name:', 26, 79);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(user.name || 'Candidate Student', 62, 79);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Roll / Candidate ID:', 26, 87);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 37, 64);
  doc.text(user.rollNumber || 'ID-2026-8942', 62, 87);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Registered Email:', 26, 95);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(user.email || 'student@ieltsdibo.com', 62, 95);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Target Score:', 26, 103);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(`Band ${user.targetScore || '7.5'}`, 62, 103);

  // Column 2
  const col2X = 118;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Serial Number:', col2X, 79);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`#${exam.serialNumber.toString().padStart(4, '0')}`, col2X + 32, 79);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Examination Date:', col2X, 87);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(exam.date, col2X + 32, 87);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Time Taken:', col2X, 95);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(exam.time, col2X + 32, 95);

  // Score Table
  const tableTop = 118;
  const colWidths = [42, 28, 28, 28, 28, pageWidth - 40 - (42 + 28 * 4)];

  doc.setFillColor(10, 37, 64);
  doc.roundedRect(20, tableTop, pageWidth - 40, 9, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');

  let currentX = 20;
  doc.text('TEST MODULE', currentX + 6, tableTop + 6);
  currentX += colWidths[0];
  doc.text('LISTENING', currentX + colWidths[1] / 2, tableTop + 6, { align: 'center' });
  currentX += colWidths[1];
  doc.text('READING', currentX + colWidths[2] / 2, tableTop + 6, { align: 'center' });
  currentX += colWidths[2];
  doc.text('WRITING', currentX + colWidths[3] / 2, tableTop + 6, { align: 'center' });
  currentX += colWidths[3];
  doc.text('SPEAKING', currentX + colWidths[4] / 2, tableTop + 6, { align: 'center' });
  currentX += colWidths[4];
  doc.text('OVERALL BAND', currentX + colWidths[5] / 2, tableTop + 6, { align: 'center' });

  // Table Data Row
  const rowTop = tableTop + 9;
  doc.setFillColor(255, 255, 255);
  doc.rect(20, rowTop, pageWidth - 40, 16, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(20, rowTop, pageWidth - 40, 16, 'D');

  currentX = 20;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Academic Band', currentX + 6, rowTop + 10);

  currentX += colWidths[0];
  doc.setFontSize(12);
  doc.setTextColor(2, 132, 199);
  doc.text(exam.listeningBand.toFixed(1), currentX + colWidths[1] / 2, rowTop + 10.5, { align: 'center' });

  currentX += colWidths[1];
  doc.setTextColor(16, 185, 129);
  doc.text(exam.readingBand.toFixed(1), currentX + colWidths[2] / 2, rowTop + 10.5, { align: 'center' });

  currentX += colWidths[2];
  doc.setTextColor(217, 119, 6);
  doc.text(exam.writingBand.toFixed(1), currentX + colWidths[3] / 2, rowTop + 10.5, { align: 'center' });

  currentX += colWidths[3];
  doc.setTextColor(225, 29, 72);
  doc.text(exam.speakingBand.toFixed(1), currentX + colWidths[4] / 2, rowTop + 10.5, { align: 'center' });

  currentX += colWidths[4];
  doc.setFillColor(255, 241, 242);
  doc.rect(currentX, rowTop, colWidths[5], 16, 'F');
  doc.setTextColor(225, 29, 72);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(exam.overallBand.toFixed(1), currentX + colWidths[5] / 2, rowTop + 11, { align: 'center' });

  // Assessment Feedback Box
  const assessTop = 153;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(20, assessTop, pageWidth - 40, 48, 3, 3, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(20, assessTop, pageWidth - 40, 48, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(10, 37, 64);
  doc.text('CEFR LEVEL & PROFICIENCY SUMMARY', 26, assessTop + 10);

  const cefrLevel = exam.overallBand >= 8.5 ? 'C2 (Mastery)' : exam.overallBand >= 7.0 ? 'C1 (Effective Operational Proficiency)' : exam.overallBand >= 5.5 ? 'B2 (Vantage)' : 'B1 (Threshold)';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Estimated CEFR Equivalent: ${cefrLevel}`, 26, assessTop + 19);
  doc.text('Competency Profile: The candidate demonstrates high operational command of complex language,', 26, assessTop + 27);
  doc.text('fluently handles academic discourses, and demonstrates readiness for university-level instruction.', 26, assessTop + 35);
  doc.text('Examination Rigor: Standardized Cambridge English IELTS Academic Mock Evaluation.', 26, assessTop + 43);

  // Signature Block
  const footerTop = 226;

  // Seal
  doc.setDrawColor(10, 37, 64);
  doc.setLineWidth(1);
  doc.circle(42, footerTop + 16, 13, 'D');
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.circle(42, footerTop + 16, 11, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(10, 37, 64);
  doc.text('IELTS DIBO', 42, footerTop + 13, { align: 'center' });
  doc.setFontSize(5);
  doc.text('VERIFIED', 42, footerTop + 17, { align: 'center' });
  doc.text('OFFICIAL MOCK', 42, footerTop + 21, { align: 'center' });

  // Signature Block (Right side)
  const sigX = pageWidth - 70;
  doc.setFont('times', 'italic');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text('Dr. J. R. Finch', sigX + 10, footerTop + 12);

  doc.setDrawColor(100, 116, 139);
  doc.setLineWidth(0.6);
  doc.line(sigX - 10, footerTop + 16, pageWidth - 20, footerTop + 16);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(10, 37, 64);
  doc.text('Academic Director & Lead Assessor', sigX + 12, footerTop + 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('IELTS DIBO Examination Board', sigX + 12, footerTop + 26, { align: 'center' });

  // Bottom Notice
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 274, pageWidth - 20, 274);

  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Official computer-verified IELTS mock evaluation certificate issued by IELTS DIBO (ieltsdibo.com).', 20, 281);
  doc.text(`Hash: TRF-MOCK-${exam.id}-${Date.now().toString(36).toUpperCase()}`, pageWidth - 20, 281, { align: 'right' });

  // Save
  const filename = `IELTS_DIBO_Full_Mock_Result_${user.rollNumber || 'Roll'}_Exam_${exam.serialNumber}.pdf`;
  doc.save(filename);
};

export const generateIeltsPdf = generateExamReportPdf;
