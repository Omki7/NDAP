/* ============================================================
   NDAP — PREMIUM CHAT INTERFACE
   Claude/Gemini-style with thread navigation sidebar
   ============================================================ */

const { useState, useEffect, useRef } = React;

/* Thread item in sidebar */
function ThreadItem({ thread, active, onSelect, onDelete }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={() => onSelect(thread.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "10px 12px",
        borderRadius: "var(--r)",
        border: "none",
        background: active ? "var(--surface-2)" : hover ? "var(--surface-3)" : "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 10,
        transition: "background .15s",
      }}
    >
      <Icon name="ask" size={16} style={{ color: active ? "var(--blue)" : "var(--muted-2)", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? "var(--ink)" : "var(--ink-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{thread.title}</div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{thread.date}</div>
      </div>
      {hover && (
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(thread.id); }}
          style={{
            background: "none",
            border: "none",
            color: "var(--muted-2)",
            cursor: "pointer",
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </button>
  );
}

/* Chat message with thread nav indicator on right */
function ChatMessage({ msg, msgIndex, totalMsgs, onJumpTo }) {
  const isUser = msg.role === "user";
  const showNav = !isUser && totalMsgs > 1;
  
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16, maxWidth: "100%" }}>
      {!isUser && <AgentAvatar />}
      <div style={{ flex: 1, minWidth: 0 }}>
        {!isUser && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--navy-800)" }}>NDAP Reasoning Engine</span>
            <Badge tone="saffron" style={{ fontSize: 10.5 }}>Retrieval Agent</Badge>
          </div>
        )}
        
        {/* Message bubble */}
        <div
          style={{
            background: isUser ? "var(--navy-800)" : "#fff",
            border: isUser ? "none" : "1px solid var(--border-2)",
            color: isUser ? "#fff" : "var(--ink)",
            borderRadius: isUser ? "12px 12px 3px 12px" : "4px 12px 12px 12px",
            padding: "12px 16px",
            lineHeight: 1.6,
            fontSize: 14.5,
            wordBreak: "break-word",
          }}
        >
          {msg.text}
        </div>

        {/* Thread navigation on right side (Claude/Gemini style) */}
        {showNav && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, color: "var(--muted)" }}>
            <span>{msgIndex + 1} / {totalMsgs}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {msgIndex > 0 && (
                <button
                  onClick={() => onJumpTo(msgIndex - 1)}
                  title="Previous message"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    border: "1px solid var(--border)",
                    background: "var(--surface-2)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--muted-2)",
                  }}
                >
                  <Icon name="chevL" size={13} />
                </button>
              )}
              {msgIndex < totalMsgs - 1 && (
                <button
                  onClick={() => onJumpTo(msgIndex + 1)}
                  title="Next message"
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    border: "1px solid var(--border)",
                    background: "var(--surface-2)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--muted-2)",
                  }}
                >
                  <Icon name="chevR" size={13} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* Premium Chat View */
function PremiumChatView({ lang }) {
  const [threads, setThreads] = useState([
    { id: "t1", title: "Bihar Health Metrics Analysis", date: "Today, 2:34 PM" },
    { id: "t2", title: "MGNREGA Employment Trends", date: "Yesterday" },
    { id: "t3", title: "Census 2011 Literacy Comparison", date: "3 days ago" },
  ]);
  
  const [activeThread, setActiveThread] = useState("t1");
  const [messages, setMessages] = useState([
    { role: "user", text: "What was Bihar's full immunization coverage for children in NFHS-5?" },
    { role: "assistant", text: "In Bihar, 71.0% of children aged 12–23 months were fully immunized in NFHS-5 (2019–21), up from 61.7% in NFHS-4. This includes BCG, measles, 3 DPT, and 3 polio vaccinations. The urban-rural gap is minimal: 70.1% (urban) vs 71.1% (rural)." },
    { role: "user", text: "And institutional births?" },
    { role: "assistant", text: "Institutional births in Bihar reached 76.2% in NFHS-5, a significant improvement from 55.6% in NFHS-4. This reflects better healthcare infrastructure access and maternal health awareness in the state." },
  ]);
  
  const [input, setInput] = useState("");
  const [scrollPos, setScrollPos] = useState(0);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
    // Simulate assistant response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", text: "I've processed your question. Here's what I found based on the data..." }]);
    }, 800);
  };

  const handleNewThread = () => {
    const newThread = {
      id: "t" + Math.random().toString(36).substr(2, 9),
      title: "New conversation",
      date: "Now",
    };
    setThreads([newThread, ...threads]);
    setActiveThread(newThread.id);
    setMessages([]);
  };

  const handleDeleteThread = (id) => {
    setThreads(threads.filter(t => t.id !== id));
    if (activeThread === id && threads.length > 1) {
      setActiveThread(threads[0].id);
    }
  };

  const handleJumpToMessage = (index) => {
    // Scroll to specific message or highlight it
    const el = document.getElementById(`msg-${index}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div style={{ display: "flex", height: "100%", background: "#fff", overflow: "hidden" }}>
      {/* Left sidebar: threads */}
      <div style={{
        width: 280,
        borderRight: "1px solid var(--border)",
        background: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
          <button
            onClick={handleNewThread}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 9,
              background: "var(--navy-800)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--r)",
              padding: "10px 14px",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Icon name="plus" size={16} />
            New conversation
          </button>
        </div>

        {/* Threads list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px" }}>
          {threads.map(thread => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              active={activeThread === thread.id}
              onSelect={setActiveThread}
              onDelete={handleDeleteThread}
            />
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--border)",
          fontSize: 11,
          color: "var(--muted)",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 8 }}>
            <Dot color="#1fb98a" pulse />
            <span>Operational</span>
          </div>
          <div className="mono" style={{ fontSize: 10.5 }}>India-only storage</div>
        </div>
      </div>

      {/* Right main chat area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#fff" }}>
        {/* Chat header */}
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          background: "#fff",
          boxShadow: "0 1px 3px rgba(0,0,0,.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>
                {threads.find(t => t.id === activeThread)?.title || "Conversation"}
              </h2>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{messages.length} messages in this thread</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{
                padding: "8px 14px",
                border: "1px solid var(--border)",
                borderRadius: "var(--r)",
                background: "#fff",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--ink-2)",
                cursor: "pointer",
              }}>
                <Icon name="download" size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Export
              </button>
              <button style={{
                padding: "8px 14px",
                border: "1px solid var(--border)",
                borderRadius: "var(--r)",
                background: "#fff",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--ink-2)",
                cursor: "pointer",
              }}>
                <Icon name="share" size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 40px",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          {messages.length === 0 ? (
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "var(--muted)",
              textAlign: "center",
            }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--ink)" }}>Start a conversation</div>
                <div style={{ fontSize: 14 }}>Ask NDAP anything about India's public data</div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <div key={i} id={`msg-${i}`}>
                  <ChatMessage
                    msg={msg}
                    msgIndex={i}
                    totalMsgs={messages.length}
                    onJumpTo={handleJumpToMessage}
                  />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div style={{
          padding: "20px 24px",
          borderTop: "1px solid var(--border)",
          background: "#fff",
          boxShadow: "0 -2px 8px rgba(0,0,0,.02)",
        }}>
          <div style={{ display: "flex", gap: 12, maxWidth: 900, margin: "0 auto" }}>
            <div style={{ flex: 1, display: "flex", gap: 10 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question about India's data…"
                style={{
                  flex: 1,
                  border: "1px solid var(--border-2)",
                  borderRadius: "var(--r)",
                  padding: "12px 16px",
                  fontSize: 15,
                  fontFamily: "var(--font)",
                  outline: "none",
                  background: "var(--surface)",
                }}
              />
              <button
                onClick={handleSend}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "var(--r)",
                  border: "none",
                  background: input.trim() ? "var(--navy-800)" : "var(--border-strong)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  flexShrink: 0,
                }}
              >
                <Icon name="send" size={17} />
              </button>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 10 }}>
            All queries are audited and logged. Data stays within India.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PremiumChatView });
