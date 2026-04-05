import { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const suggestedPrompts = [
  "Generate a quiz on photosynthesis for Grade 9",
  "Explain the Pythagorean theorem in simple terms",
  "Create a discussion prompt about climate change",
  "Summarize Chapter 5 of 'To Kill a Mockingbird'",
  "Design a group activity for learning about fractions",
];

export default function AITutor() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Teaching Assistant. I can help you create lesson plans, generate quizzes, explain concepts, or brainstorm classroom activities. What would you like to work on today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    setMessages(prev => [...prev, { role: 'user', content: msgText }]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        `Great question! Here's what I'd suggest:\n\n**Key Points:**\n- Start with a warm-up activity to assess prior knowledge\n- Use visual aids and real-world examples\n- Include 2-3 formative assessment checkpoints\n- End with a reflection activity\n\nWould you like me to elaborate on any of these points?`,
        `I've drafted a quick outline:\n\n1. **Introduction** (5 min) — Hook question + learning objectives\n2. **Direct Instruction** (15 min) — Core concept with examples\n3. **Guided Practice** (10 min) — Worked examples together\n4. **Independent Practice** (10 min) — Student exercises\n5. **Wrap-up** (5 min) — Exit ticket\n\nShall I flesh out any section?`,
        `Here are some creative approaches:\n\n🎯 **Think-Pair-Share**: Students discuss in pairs first\n🎮 **Gamification**: Turn the review into a Kahoot-style quiz\n📊 **Data Analysis**: Use real-world datasets\n🎨 **Visual Learning**: Mind maps and concept diagrams\n\nWhich approach resonates with your class?`,
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          padding: '20px 32px',
          borderBottom: '1px solid #EAECF0',
          background: '#FFFFFF',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '14px',
              background: '#E8F5EE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(26, 92, 59, 0.15)',
            }}>
              <span className="material-symbols-outlined filled" style={{ color: '#1A5C3B', fontSize: '22px' }}>smart_toy</span>
            </div>
            <div>
              <h1 className="font-headline" style={{
                fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em',
                color: '#111827',
              }}>AI Teaching Assistant</h1>
              <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                Powered by AI • Helps you create, plan, and explain
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '20px 32px',
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', gap: '12px',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start',
            }}>
              {/* Avatar */}
              <div style={{
                width: '36px', height: '36px', minWidth: '36px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #1A5C3B, #2D7A52)'
                  : '#E8F5EE',
                boxShadow: msg.role === 'user'
                  ? '0 4px 12px rgba(26, 92, 59, 0.2)'
                  : 'none',
              }}>
                <span className="material-symbols-outlined filled" style={{ color: '#fff', fontSize: '18px' }}>
                  {msg.role === 'user' ? 'person' : 'smart_toy'}
                </span>
              </div>

              {/* Message Bubble */}
              <div style={{
                maxWidth: '70%', padding: '16px 20px',
                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, #1A5C3B, #2D7A52)'
                  : '#FFFFFF',
                border: msg.role === 'user'
                  ? 'none'
                  : '1px solid #EAECF0',
                boxShadow: msg.role === 'user' ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
                fontSize: '14px', lineHeight: 1.7,
                color: msg.role === 'user' ? '#FFFFFF' : '#111827',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping ? (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{
                width: '36px', height: '36px', minWidth: '36px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#E8F5EE',
              }}>
                <span className="material-symbols-outlined filled" style={{ color: '#1A5C3B', fontSize: '18px' }}>smart_toy</span>
              </div>
              <div style={{
                padding: '16px 24px', borderRadius: '20px 20px 20px 4px',
                background: '#FFFFFF',
                border: '1px solid #EAECF0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex', gap: '6px', alignItems: 'center',
              }}>
                <div className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1A5C3B', animation: 'typingBounce 1.4s infinite ease-in-out', animationDelay: '0s' }} />
                <div className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1A5C3B', animation: 'typingBounce 1.4s infinite ease-in-out', animationDelay: '0.2s' }} />
                <div className="typing-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1A5C3B', animation: 'typingBounce 1.4s infinite ease-in-out', animationDelay: '0.4s' }} />
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts (only before user sends first message) */}
        {messages.length <= 1 && (
          <div style={{ padding: '0 32px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {suggestedPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                style={{
                  padding: '8px 16px', borderRadius: '20px',
                  background: '#E8F5EE',
                  color: '#1A5C3B', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                  border: '1px solid rgba(26, 92, 59, 0.12)',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(26,92,59,0.12)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = '#E8F5EE'; }}
              >{prompt}</button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div style={{
          padding: '16px 32px 20px',
          borderTop: '1px solid #EAECF0',
          background: '#FFFFFF',
        }}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: '12px',
            backgroundColor: '#F9FAFB', borderRadius: '14px',
            padding: '12px 16px',
            border: '1px solid #EAECF0',
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about teaching, lesson planning, or activities..."
              rows={1}
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: '#111827', fontSize: '14px', resize: 'none',
                lineHeight: 1.5, fontFamily: "'Inter', sans-serif",
                minHeight: '24px', maxHeight: '120px',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                background: input.trim()
                  ? 'linear-gradient(135deg, #1A5C3B, #2D7A52)'
                  : '#EAECF0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: input.trim() ? '0 4px 12px rgba(26, 92, 59, 0.25)' : 'none',
              }}
            >
              <span className="material-symbols-outlined" style={{
                fontSize: '20px',
                color: input.trim() ? '#fff' : '#9CA3AF',
              }}>send</span>
            </button>
          </div>
          <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '8px', textAlign: 'center' }}>
            AI Tutor provides suggestions only. Always review content before using in class.
          </p>
        </div>
      </main>

      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
