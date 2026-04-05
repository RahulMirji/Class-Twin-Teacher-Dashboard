import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import useLiveKit from '../hooks/useLiveKit';
import LiveVideoRoom from '../components/LiveVideoRoom';
import { QRCodeSVG } from 'qrcode.react';
import Sidebar from '../components/Sidebar';
import { supabase } from '../lib/supabase';

export default function SessionLobby() {
  const { code } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('sessionId');

  const { students, qrCode, quizResults } = useSocket(code);
  const { token, livekitUrl, isStreaming, loading: lkLoading, error: lkError, startStream, stopStream } = useLiveKit();

  const [sessionCode] = useState(code || 'ABC123');
  const [copied, setCopied] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [liveViewers, setLiveViewers] = useState([]);

  // Quiz state
  const [quizTopic, setQuizTopic] = useState('');
  const [quizLoading, setQuizLoading] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [quizError, setQuizError] = useState(null);
  const [quizSent, setQuizSent] = useState(false);
  const [showQuizPanel, setShowQuizPanel] = useState(false);

  const joinUrl = `${window.location.origin.replace(':5173', ':5174')}/join?code=${sessionCode}`;

  // Merge LiveKit participants (real-time) with socket students
  // LiveKit viewers are the authoritative source for who's actually watching
  const joinedStudents = liveViewers.length > 0 ? liveViewers : (students || []);

  const handleParticipantsChange = useCallback((viewers) => {
    setLiveViewers(viewers);
  }, []);

  // Elapsed timer once streaming
  useEffect(() => {
    if (!isStreaming) return;
    const t = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [isStreaming]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoLive = async () => {
    if (!sessionId) {
      // Fallback: just navigate to dashboard
      navigate(`/dashboard?code=${sessionCode}`);
      return;
    }
    try {
      await startStream(sessionId);
    } catch (err) {
      console.error('Failed to start stream:', err);
    }
  };

  const handleEndStream = async () => {
    if (sessionId) await stopStream(sessionId);
    navigate(`/dashboard?code=${sessionCode}`);
  };

  // Quiz generation handler
  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim() || !sessionId) return;
    setQuizLoading(true);
    setQuizError(null);
    setGeneratedQuiz(null);
    setQuizSent(false);

    try {
      const { data: { session: authSession } } = await supabase.auth.getSession();
      if (!authSession?.access_token) {
        setQuizError('Not authenticated');
        return;
      }

      const res = await fetch(`http://localhost:3001/api/sessions/${sessionId}/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authSession.access_token}`,
        },
        body: JSON.stringify({ topic: quizTopic.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate quiz');
      }

      const data = await res.json();
      setGeneratedQuiz(data);
      setQuizSent(true); // Questions are already pushed to students by the backend
      console.log('Quiz generated:', data);
    } catch (err) {
      console.error('Quiz generation error:', err);
      setQuizError(err.message);
    } finally {
      setQuizLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{
        flex: 1, position: 'relative', overflowY: 'auto',
        backgroundColor: 'var(--background)', color: 'var(--on-surface)',
        fontFamily: "'Inter', sans-serif"
      }}>
      {/* Atmospheric Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '55%', height: '55%', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.08)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(74, 225, 118, 0.04)', filter: 'blur(100px)' }} />
      </div>

      {/* Top bar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px',
        backgroundColor: 'rgba(11, 15, 20, 0.7)',
        backdropFilter: 'blur(30px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="font-headline" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em' }}>ClassTwin</span>
          <div style={{ height: '16px', width: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: '13px', color: 'var(--on-surface-variant)' }}>Lobby</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isStreaming && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '999px',
              backgroundColor: 'rgba(220, 38, 38, 0.15)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', letterSpacing: '0.08em' }}>LIVE · {formatTime(elapsed)}</span>
            </div>
          )}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '6px 14px', borderRadius: '999px',
            backgroundColor: 'rgba(74, 225, 118, 0.1)',
            border: '1px solid rgba(74, 225, 118, 0.2)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--secondary)' }}>{joinedStudents.length} Students</span>
          </div>
        </div>
      </nav>

      {/* Title Header */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px 0px' }}>
        <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginBottom: '6px', fontWeight: 600 }}>
          Today's Topic
        </p>
        <h1 className="font-headline" style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
          {sessionCode}
        </h1>
      </div>

      {/* Main 2-column layout */}
      <main style={{
        position: 'relative', zIndex: 10,
        display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px',
        gap: '40px',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px 32px 48px',
        alignItems: 'stretch',
      }}>
        {/* LEFT — Video */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          {/* Video Room */}
          <div style={{
            flex: 1,
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundColor: 'rgba(11, 15, 20, 0.8)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            transition: 'all 0.4s ease',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {isStreaming ? (
              <div style={{ padding: '16px', height: '100%', width: '100%', boxSizing: 'border-box' }}>
                <LiveVideoRoom
                  token={token}
                  serverUrl={livekitUrl}
                  onDisconnect={handleEndStream}
                  onParticipantsChange={handleParticipantsChange}
                />
              </div>
            ) : (
              <div style={{
                height: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
                padding: '32px',
              }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '24px',
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 40px rgba(99, 102, 241, 0.2)',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '44px', color: 'var(--primary)' }}>videocam</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p className="font-headline" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Ready to go live?</p>
                  <p style={{ color: 'var(--on-surface-variant)', fontSize: '13px', lineHeight: 1.6 }}>
                    Students will be notified automatically via Supabase Realtime.<br />
                    They can join via the QR code or session code →
                  </p>
                </div>
                {lkError && (
                  <div style={{ padding: '10px 16px', borderRadius: '10px', backgroundColor: 'rgba(255, 80, 80, 0.1)', border: '1px solid rgba(255,80,80,0.2)', fontSize: '13px', color: '#ff5050', maxWidth: '320px', textAlign: 'center' }}>
                    {lkError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Students strip */}
          {joinedStudents.length > 0 && (
            <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--on-surface-variant)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {joinedStudents.length} joined
              </span>
              <div style={{ display: 'flex', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
                {joinedStudents.slice(0, 8).map((s, i) => (
                  <span key={s.id || i} style={{
                    padding: '4px 10px', borderRadius: '999px',
                    backgroundColor: 'rgba(74, 225, 118, 0.1)',
                    border: '1px solid rgba(74, 225, 118, 0.2)',
                    fontSize: '11px', fontWeight: 600, color: 'var(--secondary)',
                  }}>{s.name}</span>
                ))}
                {joinedStudents.length > 8 && (
                  <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)', alignSelf: 'center' }}>+{joinedStudents.length - 8} more</span>
                )}
              </div>
            </div>
          )}

          {/* ═══ Quiz Panel ═══ */}
          {isStreaming && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Quiz Toggle Button */}
              <button
                onClick={() => setShowQuizPanel(p => !p)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  padding: '14px', borderRadius: '16px', cursor: 'pointer', border: 'none',
                  background: showQuizPanel
                    ? 'linear-gradient(135deg, rgba(128, 131, 255, 0.15), rgba(108, 92, 231, 0.1))'
                    : 'rgba(128, 131, 255, 0.08)',
                  color: '#c0c1ff', fontWeight: 700, fontSize: '14px',
                  transition: 'all 0.3s',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>quiz</span>
                {showQuizPanel ? 'Hide Quiz Panel' : 'Send Quiz to Students'}
                <span className="material-symbols-outlined" style={{ fontSize: '18px', transition: 'transform 0.3s', transform: showQuizPanel ? 'rotate(180deg)' : 'none' }}>expand_more</span>
              </button>

              {/* Quiz Content */}
              {showQuizPanel && (
                <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Topic Input */}
                  <div>
                    <label style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: '8px', display: 'block' }}>
                      Quiz Topic
                    </label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="text"
                        placeholder="e.g. Binary Search Trees, Photosynthesis..."
                        value={quizTopic}
                        onChange={e => setQuizTopic(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !quizLoading && handleGenerateQuiz()}
                        disabled={quizLoading}
                        style={{
                          flex: 1, padding: '12px 16px', borderRadius: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: 'var(--on-surface)', fontSize: '14px', fontWeight: 500,
                          outline: 'none',
                        }}
                      />
                      <button
                        onClick={handleGenerateQuiz}
                        disabled={quizLoading || !quizTopic.trim()}
                        style={{
                          padding: '12px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                          background: quizLoading ? 'rgba(128, 131, 255, 0.3)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                          color: '#fff', fontWeight: 700, fontSize: '13px',
                          display: 'flex', alignItems: 'center', gap: '8px',
                          opacity: (!quizTopic.trim() || quizLoading) ? 0.5 : 1,
                          transition: 'all 0.2s', whiteSpace: 'nowrap',
                        }}
                      >
                        {quizLoading ? (
                          <>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                            Generating...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>auto_awesome</span>
                            Generate
                          </>
                        )}
                      </button>
                    </div>
                    <p style={{ fontSize: '11px', color: 'rgba(224, 226, 234, 0.3)', marginTop: '6px' }}>
                      Gemini AI will create 3 MCQ questions and send them to all students instantly
                    </p>
                  </div>

                  {/* Error */}
                  {quizError && (
                    <div style={{
                      padding: '10px 16px', borderRadius: '10px',
                      backgroundColor: 'rgba(255, 80, 80, 0.1)',
                      border: '1px solid rgba(255,80,80,0.2)',
                      fontSize: '13px', color: '#ff5050',
                    }}>
                      {quizError}
                    </div>
                  )}

                  {/* Generated Questions Preview + Results */}
                  {generatedQuiz && generatedQuiz.questions && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* Status badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
                          backgroundColor: 'rgba(74, 225, 118, 0.1)', color: '#4ae176',
                          border: '1px solid rgba(74, 225, 118, 0.15)',
                          display: 'flex', alignItems: 'center', gap: '6px',
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                          Sent to Students
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>
                          Round {generatedQuiz.roundNumber} • {generatedQuiz.source === 'gemini' ? 'Gemini AI' : 'Fallback'}
                        </span>
                      </div>

                      {/* Question Cards */}
                      {generatedQuiz.questions.map((q, qi) => {
                        const results = quizResults[q.id];
                        return (
                          <div key={q.id} style={{
                            padding: '16px', borderRadius: '14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                              <span style={{
                                width: '28px', height: '28px', minWidth: '28px', borderRadius: '8px',
                                background: 'linear-gradient(135deg, rgba(128, 131, 255, 0.2), rgba(108, 92, 231, 0.15))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '13px', fontWeight: 800, color: '#c0c1ff',
                              }}>{qi + 1}</span>
                              <p style={{ fontSize: '14px', fontWeight: 600, lineHeight: 1.5, flex: 1 }}>{q.question}</p>
                            </div>

                            {/* Options */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: '40px' }}>
                              {q.options.map((opt, oi) => {
                                const isCorrect = oi === q.correctIndex;
                                const responseCount = results
                                  ? (results.totalResponses > 0
                                    ? Math.round((results.correctCount / results.totalResponses) * (isCorrect ? 1 : 0))
                                    : 0)
                                  : null;
                                return (
                                  <div key={oi} style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    padding: '8px 12px', borderRadius: '10px',
                                    backgroundColor: isCorrect ? 'rgba(74, 225, 118, 0.06)' : 'rgba(255, 255, 255, 0.02)',
                                    border: isCorrect ? '1px solid rgba(74, 225, 118, 0.15)' : '1px solid rgba(255, 255, 255, 0.04)',
                                  }}>
                                    <span style={{
                                      width: '22px', height: '22px', borderRadius: '6px',
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      fontSize: '11px', fontWeight: 700,
                                      backgroundColor: isCorrect ? 'rgba(74, 225, 118, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                                      color: isCorrect ? '#4ae176' : 'var(--on-surface-variant)',
                                    }}>
                                      {String.fromCharCode(65 + oi)}
                                    </span>
                                    <span style={{ fontSize: '13px', color: isCorrect ? '#4ae176' : 'var(--on-surface-variant)', fontWeight: isCorrect ? 600 : 400, flex: 1 }}>
                                      {opt}
                                    </span>
                                    {isCorrect && (
                                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#4ae176' }}>check</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Live results bar */}
                            {results && (
                              <div style={{ marginTop: '12px', marginLeft: '40px', padding: '10px 12px', borderRadius: '10px', backgroundColor: 'rgba(128, 131, 255, 0.05)', border: '1px solid rgba(128, 131, 255, 0.1)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Responses</span>
                                  <span style={{ fontSize: '12px', fontWeight: 700, color: results.correctPercent >= 70 ? '#4ae176' : results.correctPercent >= 40 ? '#ffb95f' : '#ff7eb3' }}>
                                    {results.correctPercent}% correct • {results.totalResponses} answered
                                  </span>
                                </div>
                                <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'rgba(255, 255, 255, 0.06)', overflow: 'hidden' }}>
                                  <div style={{
                                    height: '100%', borderRadius: '3px',
                                    width: `${results.correctPercent}%`,
                                    background: results.correctPercent >= 70 ? 'linear-gradient(90deg, #4ae176, #34d399)' : results.correctPercent >= 40 ? 'linear-gradient(90deg, #ffb95f, #fbbf24)' : 'linear-gradient(90deg, #ff7eb3, #f43f5e)',
                                    transition: 'width 0.5s ease',
                                  }} />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* New Quiz button */}
                      <button
                        onClick={() => {
                          setGeneratedQuiz(null);
                          setQuizTopic('');
                          setQuizSent(false);
                        }}
                        style={{
                          padding: '10px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)',
                          backgroundColor: 'rgba(255, 255, 255, 0.04)', color: 'var(--on-surface-variant)',
                          cursor: 'pointer', fontWeight: 600, fontSize: '13px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
                        Generate New Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* RIGHT — QR + Code + Go Live */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          {!(isStreaming && joinedStudents.length > 0) ? (
            <>
              {/* QR Code Card */}
              <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div>
                  <p style={{ textAlign: 'center', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: '4px' }}>
                    Scan to Join
                  </p>
                  <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(224, 226, 234, 0.4)' }}>
                    Works on any phone, no app needed
                  </p>
                </div>

                {/* QR */}
                <div style={{
                  backgroundColor: 'white', padding: '16px', borderRadius: '16px',
                  boxShadow: '0 0 40px rgba(99, 102, 241, 0.15)',
                }}>
                  {qrCode ? (
                    <img src={qrCode} alt="Session QR Code" style={{ width: '200px', height: '200px', objectFit: 'contain', display: 'block' }} />
                  ) : (
                    <QRCodeSVG
                      value={joinUrl}
                      size={200}
                      bgColor="#ffffff"
                      fgColor="#0b0f14"
                      style={{ display: 'block' }}
                    />
                  )}
                </div>

                {/* Session Code */}
                <button onClick={handleCopy} style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 20px', borderRadius: '14px', cursor: 'pointer', border: 'none',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.15)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.08)'}
                >
                  <div>
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: '2px' }}>Session Code</p>
                    <p className="font-headline" style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '0.15em', color: 'var(--primary)' }}>{sessionCode}</p>
                  </div>
                  <span className="material-symbols-outlined" style={{ color: copied ? 'var(--secondary)' : 'var(--primary)', fontSize: '22px', transition: 'color 0.2s' }}>
                    {copied ? 'check_circle' : 'content_copy'}
                  </span>
                </button>

                <p style={{ fontSize: '11px', color: 'rgba(224, 226, 234, 0.3)', textAlign: 'center' }}>
                  Students go to → {joinUrl}
                </p>
              </div>

              {/* Notification status */}
              <div style={{
                padding: '14px 18px', borderRadius: '14px',
                backgroundColor: isStreaming ? 'rgba(74, 225, 118, 0.08)' : 'rgba(99, 102, 241, 0.06)',
                border: `1px solid ${isStreaming ? 'rgba(74, 225, 118, 0.2)' : 'rgba(99, 102, 241, 0.15)'}`,
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: isStreaming ? 'var(--secondary)' : 'var(--primary)' }}>
                  {isStreaming ? 'notifications_active' : 'notifications'}
                </span>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: isStreaming ? 'var(--secondary)' : 'var(--primary)' }}>
                    {isStreaming ? 'Students Notified!' : 'Notifications Ready'}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--on-surface-variant)' }}>
                    {isStreaming
                      ? 'Your student app shows the live class now'
                      : 'Students get notified when you go live'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p className="font-headline" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--on-surface)', margin: 0 }}>Students in Class</p>
                <div style={{ padding: '4px 10px', borderRadius: '8px', backgroundColor: 'rgba(74, 225, 118, 0.1)', color: 'var(--secondary)', fontSize: '11px', fontWeight: 700 }}>
                  {joinedStudents.length} Online
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {joinedStudents.map((student, i) => (
                  <div key={student.id || i} style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', 
                    borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.05)' 
                  }}>
                    <div style={{ 
                      width: '36px', height: '36px', borderRadius: '50%', 
                      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      color: 'var(--primary)', fontWeight: 700, fontSize: '14px' 
                    }}>
                      {student.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--on-surface)', margin: 0 }}>{student.name}</p>
                      <p style={{ fontSize: '11px', margin: 0, color: 'var(--secondary)' }}>Active now</p>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'rgba(224, 226, 234, 0.4)' }}>graphic_eq</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Go Live / End buttons */}
          {!isStreaming ? (
            <button
              onClick={handleGoLive}
              disabled={lkLoading}
              style={{
                width: '100%', padding: '18px',
                background: lkLoading ? 'rgba(99, 102, 241, 0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', borderRadius: '16px', cursor: lkLoading ? 'not-allowed' : 'pointer',
                fontWeight: 800, fontSize: '16px',
                boxShadow: lkLoading ? 'none' : '0 12px 32px rgba(99, 102, 241, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.3s',
              }}
            >
              {lkLoading ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                  Starting Stream...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>videocam</span>
                  Go Live
                </>
              )}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => navigate(`/dashboard?code=${sessionCode}`)}
                style={{
                  width: '100%', padding: '16px',
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  color: '#fff', border: 'none', borderRadius: '14px', cursor: 'pointer',
                  fontWeight: 700, fontSize: '14px',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>dashboard</span>
                Open Dashboard
              </button>
              <button
                onClick={handleEndStream}
                style={{
                  width: '100%', padding: '14px',
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  color: '#ef4444', border: '1px solid rgba(220,38,38,0.2)',
                  borderRadius: '14px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '13px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>call_end</span>
                End Stream
              </button>
            </div>
          )}
        </aside>
      </main>
      </div>
    </div>
  );
}
