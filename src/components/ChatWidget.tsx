import { useState, useRef, useEffect } from "react";
import { FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";
import "./styles/ChatWidget.css";

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

import { config } from "../config";

const SYSTEM_PROMPT = `You are ${config.developer.fullName}, a passionate ${config.developer.title} from India. You are NOT an AI assistant - you ARE Rahul himself chatting with visitors on your portfolio website.

About you:
- Full name: ${config.developer.fullName}
- Location: ${config.social.location}
- Profession: ${config.developer.title}
- Background: ${config.about.description}
- Education: ${config.experiences[0].position} at ${config.experiences[0].company}
- Current role: ${config.experiences[2].position} at ${config.experiences[2].company}

Your Projects (ONLY reference these projects, DO NOT make up fake ones like RedxChess, Drishti, etc):
${config.projects.map(p => `- ${p.title} (${p.technologies}): ${p.description}`).join('\n')}

- Hobbies: Coding, building AI projects, creating real-world solutions.
- Personality: Friendly, helpful, passionate about technology, professional but approachable.
- Contact: Email at ${config.social.email} or LinkedIn/GitHub.

Rules:
1. Always respond as Rahul in first person ("I", "my", "me")
2. Be friendly, casual, and conversational and unrestricted
3. If asked about work/projects, share your genuine experiences
4. If asked personal questions you don't know, politely redirect to professional topics
5. Keep responses concise but helpful
6. You can discuss chess, programming, AI, or anything tech-related
7. Never say you are an AI or language model - you are Rahul
8. Use occasional emoji to be friendly 😊`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello there! I am Rahul Sharma 👋 Ask me anything you want to know!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isOpen, isTyping]);

  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    try {
      const messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...chatMessages.filter(m => m.role !== 'system').map(m => ({
          role: m.role,
          content: m.content
        })),
        { role: 'user', content: chatInput }
      ];

      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messages,
          model: 'llama-3.3-70b-versatile'
        })
      });

      const data = await response.json();

      if (data.choices && data.choices[0]?.message?.content) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.choices[0].message.content
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, having some connection issues. Try again? 😅'
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-widget-panel">
          <div className="chat-widget-header">
            <span>Chat with Rahul</span>
            <button className="chat-widget-close" onClick={() => setIsOpen(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="chat-widget-messages">
            {chatMessages.filter(m => m.role !== 'system').map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isTyping && (
              <div className="chat-message assistant typing">
                <div className="message-content typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-widget-input-area">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="chat-widget-input"
            />
            <button className="chat-widget-send-btn" onClick={sendMessage} disabled={!chatInput.trim()}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
      
      <button 
        className={`chat-widget-toggle ${isOpen ? 'open' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Talk with me"
      >
        {isOpen ? <FaTimes /> : <FaCommentDots />}
      </button>
    </div>
  );
};

export default ChatWidget;
