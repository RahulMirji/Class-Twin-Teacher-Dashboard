// ClassTwin Backend Server — Express + Socket.io

require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const SessionManager = require('./sessionManager');
const { processRound } = require('./riskEngine');
const { getAIInsight } = require('./aiService');
const { supabase, createUserClient } = require('./supabaseClient');
const { generateToken, createRoom, deleteRoom, LIVEKIT_URL } = require('./livekitService');
const { handleTwinChat, getClassroomState } = require('./twinChatService');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_URL || '*'],
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const sessionManager = new SessionManager();

// ═══════════════════════════════════════════════
// Auth Middleware — verifies Supabase JWT
// ═══════════════════════════════════════════════

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  req.user = user;
  req.accessToken = token;
  next();
}

// Sample questions
const SAMPLE_QUESTIONS = [
  { text: "What is the base case in recursion?", options: ["The recursive call itself", "The condition where the function stops calling itself", "The return value of the function", "None of the above"], correct: 1, concept: "Recursion Base Case" },
  { text: "What happens if a recursive function has no base case?", options: ["It returns undefined", "It causes a stack overflow", "It runs once and stops", "It optimizes automatically"], correct: 1, concept: "Infinite Recursion" },
  { text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n²)", "O(1)"], correct: 1, concept: "Binary Search" },
  { text: "Which data structure uses FIFO?", options: ["Stack", "Queue", "Tree", "Graph"], correct: 1, concept: "Queue Data Structure" },
  { text: "What does 'DRY' stand for in programming?", options: ["Do Repeat Yourself", "Don't Repeat Yourself", "Data Retrieval Yield", "Dynamic Resource Yielding"], correct: 1, concept: "DRY Principle" },
  { text: "What is a closure in JavaScript?", options: ["A function that closes the browser", "A function with access to its outer scope", "A terminated function", "A private class method"], correct: 1, concept: "Closures" },
  { text: "What is memoization?", options: ["Memorizing code syntax", "Caching computed results for reuse", "A type of recursion", "Converting memory to disk"], correct: 1, concept: "Memoization" },
  { text: "Which sorting algorithm has the best average case?", options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"], correct: 2, concept: "Sorting Algorithms" }
];

// ═══════════════════════════════════════════════
// REST API Endpoints
// ═══════════════════════════════════════════════

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Get teacher profile
app.get('/api/me', authMiddleware, async (req, res) => {
  const userClient = createUserClient(req.accessToken);
  const { data, error } = await userClient
    .from('teachers')
    .select('*')
    .eq('id', req.user.id)
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get all sessions for authenticated teacher (from Supabase)
app.get('/api/sessions', authMiddleware, async (req, res) => {
  const userClient = createUserClient(req.accessToken);
  const { data, error } = await userClient
    .from('sessions')
    .select('*, session_students(count)')
    .eq('created_by', req.user.id)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching sessions:', error);
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// Dashboard: Get sessions with aggregated heatmap stats
app.get('/api/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const userClient = createUserClient(req.accessToken);
    const { data: sessions, error } = await userClient
      .from('sessions')
      .select('*, session_students(count)')
      .eq('created_by', req.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    if (!sessions || sessions.length === 0) return res.json([]);

    const sessionIds = sessions.map(s => s.id);
    const { data: logs, error: logsError } = await userClient
      .from('engagement_logs')
      .select('session_id, confidence, created_at')
      .in('session_id', sessionIds)
      .order('created_at', { ascending: true });

    if (logsError) throw logsError;

    const enrichedSessions = sessions.map(session => {
      const sessionLogs = logs.filter(l => l.session_id === session.id);
      let heatmapBars = null;
      let heatmapLabel = null;
      let rating = null;
      let highlighted = false;
      let avgConfidence = 0;

      if (sessionLogs.length > 0) {
        avgConfidence = sessionLogs.reduce((sum, l) => sum + (l.confidence || 0), 0) / sessionLogs.length;
        
        const bucketCount = 10;
        const bars = new Array(bucketCount).fill(0);
        const counts = new Array(bucketCount).fill(0);
        
        const startTime = new Date(sessionLogs[0].created_at).getTime();
        const endTime = new Date(sessionLogs[sessionLogs.length - 1].created_at).getTime();
        const duration = endTime - startTime;

        sessionLogs.forEach(log => {
          if (!log.confidence) return;
          const lTime = new Date(log.created_at).getTime();
          const bucketIndex = duration === 0 ? 0 : Math.min(Math.floor(((lTime - startTime) / duration) * bucketCount), bucketCount - 1);
          bars[bucketIndex] += log.confidence;
          counts[bucketIndex]++;
        });

        // Convert the 0.0-1.0 confidence score into 0-100 bars
        heatmapBars = bars.map((sum, i) => counts[i] > 0 ? Math.round((sum / counts[i]) * 100) : 0);
        
        heatmapLabel = 'Engagement Profile';
        rating = `${(avgConfidence * 5).toFixed(1)} Impact Score`;
        highlighted = avgConfidence > 0.7;
      }

      return {
        ...session,
        heatmapBars,
        heatmapLabel,
        rating,
        highlighted,
        avgConfidence
      };
    });

    res.json(enrichedSessions);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Dashboard: Oracle insight generator via Gemini
app.get('/api/dashboard/oracle', authMiddleware, async (req, res) => {
  try {
    const userClient = createUserClient(req.accessToken);
    const { data: sessions } = await userClient
      .from('sessions')
      .select('id, topic')
      .eq('created_by', req.user.id)
      .order('created_at', { ascending: false })
      .limit(3);

    if (!sessions || sessions.length === 0) {
        return res.json({ message: "No recent sessions to analyze. Start a class to get insights!", score: 0 });
    }

    const sessionIds = sessions.map(s => s.id);
    const { data: logs } = await userClient
      .from('engagement_logs')
      .select('session_id, engagement_state, confidence')
      .in('session_id', sessionIds);

    let totalConf = 0;
    let totalLogs = 0;

    const summaryStr = sessions.map(s => {
       const sLogs = logs.filter(l => l.session_id === s.id);
       const validConf = sLogs.filter(l => typeof l.confidence === 'number');
       totalLogs += validConf.length;
       totalConf += validConf.reduce((sum, l) => sum + l.confidence, 0);
       const avgConf = validConf.length ? (validConf.reduce((sum, l) => sum + l.confidence, 0) / validConf.length * 100).toFixed(0) : 0;
       return `Topic: ${s.topic}\nAvg Confidence: ${avgConf}%`;
    }).join('\n\n');

    let baseScore = totalLogs > 0 ? Math.round((totalConf / totalLogs) * 100) : 75;
    let insightMessage = "Students appear engaged. Performance is stable.";
    let score = baseScore;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: `Act as an expert teaching assistant. Based on this recent class data:\n${summaryStr}\nProvide a single insightful sentence (max 25 words) advising the teacher on their overall class performance or what missing concept they might need to revisit. Also provide an overall "Cognitive Sync" score out of 100 as an integer based on the average confidences, adjusting higher or lower by up to 10 points depending on recent trends. Return valid JSON only: { "message": "...", "score": 85 }.`
        });
        
        const textResp = response.text;
        const cleaned = textResp.replace(/```(json)?/g, '').trim();
        const parsed = JSON.parse(cleaned);
        insightMessage = parsed.message || insightMessage;
        score = parsed.score || score;
      } catch (e) {
         console.log("Error invoking gemini for oracle", e.message);
      }
    }

    res.json({ message: insightMessage, score });
  } catch (error) {
    console.error('Error fetching oracle insight:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new session (authenticated)
app.post('/api/sessions', authMiddleware, async (req, res) => {
  const { topic, totalRounds } = req.body;
  const session = await sessionManager.createSession({
    topic: topic || 'General',
    teacherId: req.user.id,
    totalRounds: totalRounds || 8,
    questions: SAMPLE_QUESTIONS
  });

  // Persist to Supabase
  try {
    const userClient = createUserClient(req.accessToken);
    const { data: insertedData, error: insertErr } = await userClient.from('sessions').insert({
      id: session.id,
      join_code: session.code,
      topic: session.topic,
      created_by: req.user.id,
      total_rounds: session.totalRounds,
      current_round: session.currentRound,
      status: session.status,
    }).select().single();

    if (insertErr) {
      console.error('❌ Supabase insert error:', insertErr.message, insertErr.details);
    } else {
      console.log(`✅ Session saved to Supabase: ${insertedData.id} (${insertedData.join_code})`);
    }
  } catch (err) {
    console.error('Error persisting session:', err);
  }

  res.json(session);
});

// List Live Sessions (for student app polling) — MUST be before /:code wildcard
app.get('/api/sessions/live', async (req, res) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('id, join_code, topic, livekit_room_name, stream_started_at, created_by')
    .eq('is_streaming', true)
    .eq('status', 'active');

  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// Get session by code (public — students use this to join)
app.get('/api/sessions/:code', (req, res) => {
  const session = sessionManager.getSession(req.params.code);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

// Resolve student names from UUIDs (used by teacher dashboard for LiveKit participants)
app.post('/api/students/resolve', async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.json({});
  }
  try {
    const { data, error } = await supabase
      .from('session_students')
      .select('id, student_name')
      .in('id', ids);
    if (error) {
      console.error('Student resolve error:', error.message);
      return res.json({});
    }
    // Return as { uuid: name } map
    const nameMap = {};
    for (const row of data) {
      nameMap[row.id] = row.student_name;
    }
    res.json(nameMap);
  } catch (err) {
    console.error('Student resolve error:', err);
    res.json({});
  }
});

// In-memory store for imported students (fallback when DB table not ready)
const importedStudentsStore = {};

// POST /api/students/import — Bulk import students from CSV
app.post('/api/students/import', authMiddleware, async (req, res) => {
  try {
    const { students } = req.body;
    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'No student data provided' });
    }
    if (students.length > 500) {
      return res.status(400).json({ error: 'Maximum 500 students per import' });
    }

    const teacherId = req.user.id;
    let imported = 0;
    let failed = 0;

    // Initialize store for this teacher
    if (!importedStudentsStore[teacherId]) {
      importedStudentsStore[teacherId] = [];
    }

    // Try Supabase first, fallback to in-memory
    const userClient = createUserClient(req.accessToken);
    let useMemory = false;

    for (const student of students) {
      const name = student.name || student.student_name || student.full_name || '';
      const email = student.email || '';
      const rollNumber = student.roll_number || student.roll || student.id_number || '';

      if (!name.trim()) {
        failed++;
        continue;
      }

      const record = {
        teacher_id: teacherId,
        student_name: name.trim(),
        email: email.trim() || null,
        roll_number: rollNumber.trim() || null,
        created_at: new Date().toISOString(),
      };

      if (!useMemory) {
        try {
          const { error: insertErr } = await userClient
            .from('imported_students')
            .insert(record);

          if (insertErr) {
            console.warn('DB insert failed, switching to in-memory:', insertErr.message);
            useMemory = true;
            // Still save this record in memory
            importedStudentsStore[teacherId].push(record);
            imported++;
          } else {
            imported++;
          }
        } catch (dbErr) {
          useMemory = true;
          importedStudentsStore[teacherId].push(record);
          imported++;
        }
      } else {
        importedStudentsStore[teacherId].push(record);
        imported++;
      }
    }

    console.log(`📥 Import complete: ${imported} imported, ${failed} failed (memory: ${useMemory})`);
    res.json({ imported, failed, total: students.length });
  } catch (err) {
    console.error('Import error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/students/imported — Get imported students for roster
app.get('/api/students/imported', authMiddleware, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const userClient = createUserClient(req.accessToken);

    // Try DB first
    const { data, error } = await userClient
      .from('imported_students')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      return res.json(data);
    }

    // Fallback to in-memory
    res.json(importedStudentsStore[teacherId] || []);
  } catch (err) {
    res.json(importedStudentsStore[req.user.id] || []);
  }
});

// ═══════════════════════════════════════════════
// Students Dashboard Endpoints
// ═══════════════════════════════════════════════

// Get all unique students with aggregated stats
app.get('/api/students', authMiddleware, async (req, res) => {
  try {
    const userClient = createUserClient(req.accessToken);

    // Get all session_students for sessions owned by this teacher
    const { data: sessions, error: sessErr } = await userClient
      .from('sessions')
      .select('id')
      .eq('created_by', req.user.id);
    if (sessErr) return res.status(500).json({ error: sessErr.message });

    const sessionIds = sessions.map(s => s.id);
    if (sessionIds.length === 0) return res.json([]);

    const { data: students, error: studErr } = await supabase
      .from('session_students')
      .select('id, student_name, device_id, session_id, joined_at, comprehension, risk, total_correct, total_answered, mode')
      .in('session_id', sessionIds)
      .order('joined_at', { ascending: false });

    if (studErr) return res.status(500).json({ error: studErr.message });

    // Group by device_id (or student_name as fallback) to get unique students
    const grouped = {};
    for (const s of students) {
      const key = s.device_id || s.student_name;
      if (!grouped[key]) {
        grouped[key] = {
          deviceId: s.device_id,
          name: s.student_name,
          totalSessions: 0,
          lastSeen: s.joined_at,
          totalCorrect: 0,
          totalAnswered: 0,
          comprehensionSum: 0,
          comprehensionCount: 0,
          riskLevels: [],
          sessionStudentIds: [],
        };
      }
      const g = grouped[key];
      g.totalSessions++;
      g.sessionStudentIds.push(s.id);
      if (s.joined_at && (!g.lastSeen || new Date(s.joined_at) > new Date(g.lastSeen))) {
        g.lastSeen = s.joined_at;
      }
      g.totalCorrect += s.total_correct || 0;
      g.totalAnswered += s.total_answered || 0;
      if (s.comprehension != null) {
        g.comprehensionSum += s.comprehension;
        g.comprehensionCount++;
      }
      if (s.risk) g.riskLevels.push(s.risk);
    }

    // Build response
    const result = Object.values(grouped).map(g => ({
      deviceId: g.deviceId,
      name: g.name,
      totalSessions: g.totalSessions,
      lastSeen: g.lastSeen,
      avgComprehension: g.comprehensionCount > 0 ? Math.round(g.comprehensionSum / g.comprehensionCount) : null,
      totalCorrect: g.totalCorrect,
      totalAnswered: g.totalAnswered,
      accuracy: g.totalAnswered > 0 ? Math.round((g.totalCorrect / g.totalAnswered) * 100) : null,
      latestRisk: g.riskLevels[0] || null,
      sessionStudentIds: g.sessionStudentIds,
    }));

    res.json(result);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get detailed stats for a specific student
app.get('/api/students/:studentName/stats', authMiddleware, async (req, res) => {
  try {
    const { studentName } = req.params;
    const userClient = createUserClient(req.accessToken);

    // Get teacher's sessions
    const { data: sessions } = await userClient
      .from('sessions')
      .select('id, topic, join_code, status, created_at')
      .eq('created_by', req.user.id)
      .order('created_at', { ascending: false });

    const sessionIds = (sessions || []).map(s => s.id);
    if (sessionIds.length === 0) return res.json({ sessions: [], engagementLogs: [], summary: {} });

    // Get all session_students rows for this student
    const { data: studentRows, error: studErr } = await supabase
      .from('session_students')
      .select('*')
      .eq('student_name', studentName)
      .in('session_id', sessionIds)
      .order('joined_at', { ascending: false });

    if (studErr) return res.status(500).json({ error: studErr.message });
    if (!studentRows || studentRows.length === 0) return res.status(404).json({ error: 'Student not found' });

    const studentIds = studentRows.map(s => s.id);

    // Get all engagement_logs for these student IDs
    const { data: logs, error: logErr } = await supabase
      .from('engagement_logs')
      .select('*')
      .in('student_id', studentIds)
      .order('created_at', { ascending: true });

    if (logErr) return res.status(500).json({ error: logErr.message });

    // Build session history with enriched data
    const sessionMap = {};
    for (const s of sessions) sessionMap[s.id] = s;

    const sessionHistory = studentRows.map(sr => ({
      sessionStudentId: sr.id,
      sessionId: sr.session_id,
      topic: sessionMap[sr.session_id]?.topic || 'Unknown',
      joinCode: sessionMap[sr.session_id]?.join_code || '',
      status: sessionMap[sr.session_id]?.status || '',
      joinedAt: sr.joined_at,
      comprehension: sr.comprehension,
      risk: sr.risk,
      totalCorrect: sr.total_correct,
      totalAnswered: sr.total_answered,
      mode: sr.mode,
      manualConfidence: sr.manual_confidence,
    }));

    // Aggregate engagement metrics
    const allLogs = logs || [];
    const emotions = {};
    const headPoses = {};
    const networkQualities = {};
    let gazeSum = 0, gazeCount = 0;
    let presenceTrue = 0, presenceTotal = 0;
    let tabActiveTrue = 0, tabActiveTotal = 0;
    const confidenceOverTime = [];

    for (const log of allLogs) {
      confidenceOverTime.push({ time: log.created_at, confidence: log.confidence, state: log.engagement_state });
      const m = log.metrics || {};
      if (m.emotion) emotions[m.emotion] = (emotions[m.emotion] || 0) + 1;
      if (m.head_pose) headPoses[m.head_pose] = (headPoses[m.head_pose] || 0) + 1;
      if (m.network_quality) networkQualities[m.network_quality] = (networkQualities[m.network_quality] || 0) + 1;
      if (m.gaze_on_screen != null) { gazeSum += m.gaze_on_screen; gazeCount++; }
      if (m.is_present != null) { presenceTotal++; if (m.is_present) presenceTrue++; }
      if (m.tab_active != null) { tabActiveTotal++; if (m.tab_active) tabActiveTrue++; }
    }

    const summary = {
      name: studentName,
      totalSessions: studentRows.length,
      totalEngagementLogs: allLogs.length,
      avgConfidence: allLogs.length > 0 ? Math.round((allLogs.reduce((s, l) => s + (l.confidence || 0), 0) / allLogs.length) * 100) : null,
      avgGazeOnScreen: gazeCount > 0 ? Math.round((gazeSum / gazeCount) * 100) : null,
      presenceRate: presenceTotal > 0 ? Math.round((presenceTrue / presenceTotal) * 100) : null,
      tabActiveRate: tabActiveTotal > 0 ? Math.round((tabActiveTrue / tabActiveTotal) * 100) : null,
      emotionDistribution: emotions,
      headPoseDistribution: headPoses,
      networkQualityDistribution: networkQualities,
      dominantEmotion: Object.entries(emotions).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
      dominantEngagementState: (() => {
        const states = {};
        allLogs.forEach(l => { if (l.engagement_state) states[l.engagement_state] = (states[l.engagement_state] || 0) + 1; });
        return Object.entries(states).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
      })(),
    };

    res.json({
      summary,
      sessionHistory,
      engagementLogs: allLogs,
      confidenceOverTime,
    });
  } catch (err) {
    console.error('Error fetching student stats:', err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
// LiveKit Token Endpoint (teacher = publisher, student = viewer)
// ═══════════════════════════════════════════════

app.post('/api/livekit/token', async (req, res) => {
  const { roomName, identity, isTeacher = false, name = '' } = req.body;
  if (!roomName || !identity) {
    return res.status(400).json({ error: 'roomName and identity are required' });
  }
  try {
    const token = await generateToken({ roomName, identity, isTeacher, name });
    res.json({ token, url: LIVEKIT_URL });
  } catch (err) {
    console.error('Token generation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
// Start Stream — creates LiveKit room + updates Supabase + broadcasts
// ═══════════════════════════════════════════════

app.post('/api/sessions/:id/start-stream', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userClient = createUserClient(req.accessToken);

  // Fetch session from Supabase to get join_code & topic
  const { data: sessionRow, error: fetchErr } = await userClient
    .from('sessions')
    .select('*')
    .eq('id', id)
    .eq('created_by', req.user.id)
    .single();

  if (fetchErr || !sessionRow) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const roomName = `classtwin-${sessionRow.join_code}`;

  try {
    // 1. Create LiveKit room
    await createRoom(roomName);

    // 2. Generate teacher token
    const teacherIdentity = `teacher-${req.user.id}`;
    const token = await generateToken({ roomName, identity: teacherIdentity, isTeacher: true });

    // 3. Update Supabase session
    await userClient.from('sessions').update({
      is_streaming: true,
      livekit_room_name: roomName,
      stream_started_at: new Date().toISOString(),
      status: 'active',
    }).eq('id', id);

    // 4. Also update in-memory session manager if it exists
    const inMemSession = sessionManager.getSession(sessionRow.join_code);
    if (inMemSession) {
      inMemSession.isStreaming = true;
      inMemSession.livekitRoomName = roomName;
      inMemSession.status = 'active';
      inMemSession.currentRound = 1;
    }

    // 5. Broadcast to all connected student sockets
    io.emit('session_live', {
      sessionId: id,
      joinCode: sessionRow.join_code,
      topic: sessionRow.topic,
      livekitRoomName: roomName,
      livekitUrl: LIVEKIT_URL,
      streamStartedAt: new Date().toISOString(),
    });

    console.log(`🎥 Stream started: ${roomName} for session ${sessionRow.join_code}`);
    res.json({ token, url: LIVEKIT_URL, roomName });
  } catch (err) {
    console.error('Start stream error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
// Stop Stream — deletes LiveKit room + updates Supabase
// ═══════════════════════════════════════════════

app.post('/api/sessions/:id/stop-stream', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userClient = createUserClient(req.accessToken);

  const { data: sessionRow, error: fetchErr } = await userClient
    .from('sessions')
    .select('join_code, livekit_room_name')
    .eq('id', id)
    .single();

  if (fetchErr || !sessionRow) {
    return res.status(404).json({ error: 'Session not found' });
  }

  try {
    if (sessionRow.livekit_room_name) {
      await deleteRoom(sessionRow.livekit_room_name);
    }

    await userClient.from('sessions').update({
      is_streaming: false,
      status: 'ended',
    }).eq('id', id);

    io.emit('session_ended_broadcast', { joinCode: sessionRow.join_code });
    res.json({ success: true });
  } catch (err) {
    console.error('Stop stream error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ═══════════════════════════════════════════════
// Quiz Generation & Results Endpoints
// ═══════════════════════════════════════════════

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Generate quiz via Supabase Edge Function (Gemini) and persist to DB
app.post('/api/sessions/:id/generate-quiz', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { topic } = req.body;

  if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const userClient = createUserClient(req.accessToken);

    // Verify session ownership
    const { data: sessionRow, error: fetchErr } = await userClient
      .from('sessions')
      .select('id, join_code, status')
      .eq('id', id)
      .eq('created_by', req.user.id)
      .single();

    if (fetchErr || !sessionRow) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Call Supabase Edge Function to generate questions via Gemini
    console.log(`📝 Generating quiz for topic: "${topic}" (session ${sessionRow.join_code})`);

    const edgeFnUrl = `${SUPABASE_URL}/functions/v1/generate-quiz`;
    const geminiRes = await fetch(edgeFnUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ topic: topic.trim() }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Edge Function error:', errText);
      return res.status(500).json({ error: 'Failed to generate quiz questions' });
    }

    const { questions, source } = await geminiRes.json();

    // Get the highest existing round_number for this session
    const { data: existingQs } = await supabase
      .from('questions')
      .select('round_number')
      .eq('session_id', id)
      .order('round_number', { ascending: false })
      .limit(1);

    const nextRound = (existingQs && existingQs.length > 0) ? existingQs[0].round_number + 1 : 1;

    // Persist questions to DB
    const questionRows = questions.map((q, i) => ({
      session_id: id,
      round_number: nextRound,
      question_text: q.question,
      options: q.options,
      correct_option: String(q.correctIndex),
    }));

    const { data: insertedQuestions, error: insertErr } = await supabase
      .from('questions')
      .insert(questionRows)
      .select();

    if (insertErr) {
      console.error('Failed to persist questions:', insertErr);
      return res.status(500).json({ error: 'Failed to save questions' });
    }

    console.log(`✅ Quiz generated (${source}): ${insertedQuestions.length} questions, round ${nextRound}`);

    // Build response with DB IDs
    const quizData = insertedQuestions.map((dbQ, i) => ({
      id: dbQ.id,
      question: dbQ.question_text,
      options: dbQ.options,
      correctIndex: parseInt(dbQ.correct_option, 10),
      concept: questions[i]?.concept || topic,
      roundNumber: nextRound,
      timeLimit: 30,
    }));

    // Emit quiz to all students in the session room
    const sessionCode = sessionRow.join_code;
    io.to(`session-${sessionCode}`).emit('quiz_questions', {
      sessionId: id,
      roundNumber: nextRound,
      questions: quizData.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        timeLimit: q.timeLimit,
      })),
    });

    console.log(`📤 Quiz pushed to students in session-${sessionCode}`);

    res.json({
      questions: quizData,
      roundNumber: nextRound,
      source,
    });
  } catch (err) {
    console.error('Generate quiz error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get quiz results for a session
app.get('/api/sessions/:id/quiz-results', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const roundFilter = req.query.round ? parseInt(req.query.round, 10) : null;

  try {
    const userClient = createUserClient(req.accessToken);

    // Verify ownership
    const { data: sessionRow, error: fetchErr } = await userClient
      .from('sessions')
      .select('id')
      .eq('id', id)
      .eq('created_by', req.user.id)
      .single();

    if (fetchErr || !sessionRow) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Fetch questions
    let questionsQuery = supabase
      .from('questions')
      .select('*')
      .eq('session_id', id)
      .order('round_number', { ascending: true })
      .order('created_at', { ascending: true });

    if (roundFilter) {
      questionsQuery = questionsQuery.eq('round_number', roundFilter);
    }

    const { data: questions, error: qErr } = await questionsQuery;
    if (qErr) return res.status(500).json({ error: qErr.message });
    if (!questions || questions.length === 0) return res.json({ rounds: [] });

    const questionIds = questions.map(q => q.id);

    // Fetch responses
    const { data: responses, error: rErr } = await supabase
      .from('student_responses')
      .select('*, session_students!student_responses_student_id_fkey(student_name)')
      .in('question_id', questionIds);

    if (rErr) return res.status(500).json({ error: rErr.message });

    // Get total students in session
    const { data: totalStudents } = await supabase
      .from('session_students')
      .select('id')
      .eq('session_id', id);

    const totalStudentCount = totalStudents?.length || 0;

    // Group by round
    const roundMap = {};
    for (const q of questions) {
      if (!roundMap[q.round_number]) {
        roundMap[q.round_number] = { roundNumber: q.round_number, questions: [] };
      }

      const qResponses = (responses || []).filter(r => r.question_id === q.id);
      const correctCount = qResponses.filter(r => r.response === q.correct_option).length;

      roundMap[q.round_number].questions.push({
        id: q.id,
        question: q.question_text,
        options: q.options,
        correctIndex: parseInt(q.correct_option, 10),
        totalResponses: qResponses.length,
        correctCount,
        incorrectCount: qResponses.length - correctCount,
        correctPercent: qResponses.length > 0 ? Math.round((correctCount / qResponses.length) * 100) : 0,
        answerDistribution: [0, 1, 2, 3].map(optIdx => ({
          option: optIdx,
          count: qResponses.filter(r => r.response === String(optIdx)).length,
          isCorrect: optIdx === parseInt(q.correct_option, 10),
        })),
        responses: qResponses.map(r => ({
          studentName: r.session_students?.student_name || 'Unknown',
          answer: parseInt(r.response, 10),
          isCorrect: r.response === q.correct_option,
          answeredAt: r.responded_at,
        })),
      });
    }

    res.json({
      rounds: Object.values(roundMap),
      totalStudents: totalStudentCount,
    });
  } catch (err) {
    console.error('Quiz results error:', err);
    res.status(500).json({ error: err.message });
  }
});


// ═══════════════════════════════════════════════
// WebSocket Events
// ═══════════════════════════════════════════════

io.on('connection', (socket) => {
  console.log(`📡 Connected: ${socket.id}`);

  // Teacher creates session
  socket.on('create_session', async (data, callback) => {
    const session = await sessionManager.createSession({
      topic: data.topic || 'General',
      teacherId: socket.id,
      totalRounds: data.totalRounds || 8,
      questions: SAMPLE_QUESTIONS
    });
    socket.join(`teacher-${session.code}`);
    socket.sessionCode = session.code;
    socket.role = 'teacher';
    if (callback) callback(session);
  });

  // Teacher joins an existing session room (without creating a new session)
  socket.on('join_teacher_room', (data, callback) => {
    const { code } = data;
    socket.join(`teacher-${code}`);
    socket.sessionCode = code;
    socket.role = 'teacher';
    console.log(`🏫 Teacher socket ${socket.id} joined room teacher-${code}`);
    if (callback) callback({ success: true });
  });

  // Student joins session
  socket.on('join', (data, callback) => {
    const { sessionCode, studentName } = data;
    const student = sessionManager.addStudent(sessionCode, {
      id: socket.id,
      name: studentName
    });

    if (!student) {
      if (callback) callback({ error: 'Session not found' });
      return;
    }

    socket.join(`session-${sessionCode}`);
    socket.sessionCode = sessionCode;
    socket.role = 'student';
    socket.studentId = socket.id;

    // Notify teacher
    io.to(`teacher-${sessionCode}`).emit('student_joined', {
      student,
      totalStudents: Object.keys(sessionManager.getSession(sessionCode).students).length
    });

    if (callback) callback({ success: true, student });
  });

  // Teacher starts session
  socket.on('start_session', (data, callback) => {
    const code = data.code || socket.sessionCode;
    const session = sessionManager.startSession(code);
    if (!session) return;

    // Send first question to students
    const question = session.questions[0];
    io.to(`session-${code}`).emit('question', {
      ...question,
      questionId: 0,
      round: session.currentRound,
      timeLimit: 30
    });

    io.to(`teacher-${code}`).emit('round_start', {
      round: session.currentRound,
      totalRounds: session.totalRounds,
      question
    });

    if (callback) callback(session);
  });

  // Student submits answer
  socket.on('answer', async (data) => {
    const { sessionCode, questionId, answer, timeTaken } = data;
    const session = sessionManager.getSession(sessionCode || socket.sessionCode);
    if (!session) return;

    const question = session.questions[questionId] || session.questions[0];
    const correct = answer === question.correct;

    // Record the answer
    sessionManager.recordAnswer(sessionCode || socket.sessionCode, {
      studentId: socket.id,
      questionId,
      answer,
      correct,
      timeTaken: timeTaken || 15,
      concept: question.concept
    });

    // Send feedback to student
    socket.emit('feedback', {
      correct,
      correctAnswer: question.correct,
      encouragement: correct
        ? "Great! You're on track."
        : `The correct answer was: ${question.options[question.correct]}`
    });

    // Process risk engine and send update to teacher
    const riskData = processRound(session.students);
    
    const twinUpdate = {
      students: Object.values(session.students).map(s => ({
        id: s.id,
        name: s.name,
        comprehension: s.comprehension,
        risk: s.risk,
        scoreHistory: s.scoreHistory,
        totalCorrect: s.totalCorrect,
        totalAnswered: s.totalAnswered
      })),
      classHealth: riskData.classAverage,
      heatmap: riskData.heatmap,
      onTrack: riskData.onTrack,
      atRisk: riskData.atRisk,
      highRisk: riskData.highRisk,
      round: session.currentRound,
      totalRounds: session.totalRounds,
      missedConcept: riskData.missedConcept
    };

    // Get AI insights every 2 rounds
    if (session.currentRound % 2 === 0) {
      const insight = await getAIInsight({
        topic: session.topic,
        round: session.currentRound,
        totalRounds: session.totalRounds,
        classAvg: riskData.classAverage,
        onTrack: riskData.onTrack,
        atRisk: riskData.atRisk,
        highRisk: riskData.highRisk,
        missedConcept: riskData.missedConcept,
        trend: riskData.trend
      });
      twinUpdate.aiInsight = insight;
      session.aiInsights[`round_${session.currentRound}`] = insight;
    }

    io.to(`teacher-${sessionCode || socket.sessionCode}`).emit('twin_update', twinUpdate);
  });

  // Teacher advances to next round
  socket.on('next_round', (data, callback) => {
    const code = data.code || socket.sessionCode;
    const session = sessionManager.nextRound(code);
    if (!session) return;

    if (session.status === 'ended') {
      io.to(`session-${code}`).emit('session_ended', { session });
      io.to(`teacher-${code}`).emit('session_ended', { session });
      if (callback) callback(session);
      return;
    }

    // Send next question
    const qIndex = Math.min(session.currentRound - 1, session.questions.length - 1);
    const question = session.questions[qIndex];

    io.to(`session-${code}`).emit('question', {
      ...question,
      questionId: qIndex,
      round: session.currentRound,
      timeLimit: 30
    });

    io.to(`teacher-${code}`).emit('round_start', {
      round: session.currentRound,
      totalRounds: session.totalRounds,
      question
    });

    if (callback) callback(session);
  });

  // Teacher ends session
  socket.on('end_session', (data, callback) => {
    const code = data.code || socket.sessionCode;
    const session = sessionManager.endSession(code);
    if (!session) return;

    io.to(`session-${code}`).emit('session_ended', { session });
    io.to(`teacher-${code}`).emit('session_ended', { session });
    if (callback) callback(session);
  });

  // Student submits quiz answer
  socket.on('quiz_answer', async (data) => {
    const { sessionId, questionId, answer, studentId: dbStudentId } = data;
    if (!sessionId || !questionId || answer == null) return;

    try {
      // The studentId here is the session_students UUID (from the mobile app)
      const { error: insertErr } = await supabase
        .from('student_responses')
        .insert({
          question_id: questionId,
          student_id: dbStudentId,
          session_id: sessionId,
          response: String(answer),
        });

      if (insertErr) {
        console.error('Failed to save quiz answer:', insertErr);
        return;
      }

      console.log(`📩 Quiz answer received: student ${dbStudentId}, question ${questionId}, answer ${answer}`);

      // Fetch updated results for this question and emit to teacher
      const { data: question } = await supabase
        .from('questions')
        .select('correct_option, session_id')
        .eq('id', questionId)
        .single();

      if (question) {
        const { data: allResponses } = await supabase
          .from('student_responses')
          .select('response, session_students!student_responses_student_id_fkey(student_name)')
          .eq('question_id', questionId);

        const totalResponses = allResponses?.length || 0;
        const correctCount = (allResponses || []).filter(r => r.response === question.correct_option).length;

        // Get session join_code to find teacher room
        const { data: sess } = await supabase
          .from('sessions')
          .select('join_code')
          .eq('id', sessionId)
          .single();

        if (sess) {
          io.to(`teacher-${sess.join_code}`).emit('quiz_results_update', {
            questionId,
            totalResponses,
            correctCount,
            incorrectCount: totalResponses - correctCount,
            correctPercent: totalResponses > 0 ? Math.round((correctCount / totalResponses) * 100) : 0,
            latestAnswer: {
              studentName: allResponses?.[allResponses.length - 1]?.session_students?.student_name || 'Unknown',
              answer: parseInt(String(answer), 10),
              isCorrect: String(answer) === question.correct_option,
            },
          });
        }
      }
    } catch (err) {
      console.error('Quiz answer processing error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`📡 Disconnected: ${socket.id}`);
  });
});

// ═══════════════════════════════════════════════
// Twin Insight Engine API
// ═══════════════════════════════════════════════

// POST /api/twin-chat — RAG-powered chat with Gemini
app.post('/api/twin-chat', authMiddleware, async (req, res) => {
  try {
    const { message, mode, conversationHistory } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const userClient = createUserClient(req.accessToken);
    const result = await handleTwinChat({
      message,
      mode: mode || 'chat',
      conversationHistory: conversationHistory || [],
      userClient,
      teacherId: req.user.id,
    });

    res.json(result);
  } catch (err) {
    console.error('Twin chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/twin-state — Live classroom state for metadata bar
app.get('/api/twin-state', authMiddleware, async (req, res) => {
  try {
    const userClient = createUserClient(req.accessToken);
    const state = await getClassroomState(userClient, req.user.id);
    res.json(state);
  } catch (err) {
    console.error('Twin state error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════
// Start Server
// ═══════════════════════════════════════════════

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 ClassTwin Server running on port ${PORT}`);
  console.log(`   REST API: http://localhost:${PORT}/api`);
  console.log(`   WebSocket: ws://localhost:${PORT}\n`);
});
