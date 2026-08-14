import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Brain, 
  Lightbulb
} from 'lucide-react';
import type { Campaign, BrandAsset } from '../../App';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface AICopilotViewProps {
  campaigns: Campaign[];
  assets: BrandAsset[];
  brandTone: string;
  targetAudience: string;
  miniChatQuery: string;
  setMiniChatQuery: (query: string) => void;
}

export const AICopilotView: React.FC<AICopilotViewProps> = ({
  campaigns,
  assets,
  brandTone,
  targetAudience,
  miniChatQuery,
  setMiniChatQuery
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! I'm your AI Marketing Copilot. I can draft high-converting ad copy, evaluate your ROI metrics, or suggest budget reallocations. How can I help you optimize your marketing stack today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // If a query was passed from the mini-chat on the dashboard, auto-submit it
  useEffect(() => {
    if (miniChatQuery.trim()) {
      handleSend(miniChatQuery);
      setMiniChatQuery(''); // clear it
    }
  }, [miniChatQuery]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const presetPrompts = [
    { title: "Optimize Google Ads CTR", prompt: "How can I improve the CTR on my Google Ads campaigns?" },
    { title: "Generate ad headlines", prompt: "Write 3 ad headlines for my brand targeting our customer persona" },
    { title: "Draft product launch email", prompt: "Create a promotional email newsletter script for our product launch" },
    { title: "Redistribute budget", prompt: "Review my current campaign spending and propose budget optimizations" }
  ];

  // AI responses generator that leverages active campaigns and brand tone states
  const generateSmartResponse = (query: string): string => {
    const qLower = query.toLowerCase();
    
    // Find active campaigns list to cite
    const activeCamps = campaigns.filter(c => c.status === 'active');
    const campNames = activeCamps.map(c => `'${c.name}'`).join(', ');

    if (qLower.includes('ctr') || qLower.includes('click') || qLower.includes('google')) {
      const targetCamp = activeCamps.find(c => c.channel === 'Google') || campaigns[0];
      return `### CTR Optimization Plan for ${targetCamp ? `'${targetCamp.name}'` : 'your campaigns'}\n\n` +
        `Currently, your average CTR is standing at **${targetCamp ? targetCamp.ctr.toFixed(2) : '2.3'}%**. ` +
        `Since your target audience profile is **"${targetAudience}"** and your brand voice is set to **"${brandTone}"**, here are actionable strategies:\n\n` +
        `1. **Refine Ad copy headlines**: Incorporate direct problem-solving verbs. Instead of generic headlines, use:\n` +
        `   * *"Struggling with SaaS overhead? Automate today."*\n` +
        `   * *"Scale your marketing with 1 Click."*\n` +
        `2. **Negative Keywords**: Add broad exclusions to eliminate non-buying search intents.\n` +
        `3. **Extension Optimization**: Deploy callout extensions emphasizing your core offer value immediately.`;
    }

    if (qLower.includes('headline') || qLower.includes('copy') || qLower.includes('write') || qLower.includes('generate')) {
      return `### Custom Ad Copies Generated\n\n` +
        `Here are tailored marketing copies written in your active **"${brandTone}"** tone targeting **"${targetAudience}"**:\n\n` +
        `#### Option 1: Headline Hook (High CTR variant)\n` +
        `* **Headline 1**: Solve your marketing bottleneck\n` +
        `* **Headline 2**: Meet your AI Copilot\n` +
        `* **Description**: Get automated daily insights, create campaigns, and compute marketing ROAS instantly. Free trial.\n\n` +
        `#### Option 2: Benefit Driven (Direct Conversion variant)\n` +
        `* **Headline 1**: Grow Ad conversions by 18%\n` +
        `* **Headline 2**: Built for ${brandTone.includes('Professional') ? 'Enterprise Teams' : 'Modern Sellers'}\n` +
        `* **Description**: Skip manual Excel calculations. Try the smart marketing interface trusted by over 10,000+ marketing directors.`;
    }

    if (qLower.includes('email') || qLower.includes('newsletter')) {
      return `### Email Promotional Script\n\n` +
        `* **Subject**: The smartest way to automate marketing analytics 🚀\n` +
        `* **Preheader**: Get your AI-generated campaigns live in minutes.\n\n` +
        `Hello {{Contact Name}},\n\n` +
        `As someone managing complex ad operations, you know how quickly budget waste adds up. That's why we created a tool built for **${targetAudience}**.\n\n` +
        `With our AI Marketing Copilot, you can:\n` +
        `• **Track ROAS** across Google, Meta, and LinkedIn in real time.\n` +
        `• **Simulate conversions** with our embedded ROI Calculator.\n` +
        `• **Automate assets generation** matching your exact **"${brandTone}"** brand tone.\n\n` +
        `👉 [Activate Your Free Ad Diagnostic Today]\n\n` +
        `Best regards,\n` +
        `Marcus K. & the Copilot Team`;
    }

    if (qLower.includes('budget') || qLower.includes('spending') || qLower.includes('optimize') || qLower.includes('reallocate')) {
      if (activeCamps.length === 0) {
        return `I don't detect any active campaigns right now. Go to the **Campaigns** tab and activate a campaign so I can analyze budget distributions.`;
      }
      
      const totalBudget = activeCamps.reduce((a, c) => a + c.budget, 0);
      const suggestions = activeCamps.map(c => {
        const optimal = c.ctr > 2.5 ? 'Increase +15%' : c.ctr < 1.5 ? 'Decrease -10%' : 'Maintain';
        return `* **${c.name}** (Channel: ${c.channel}, CTR: ${c.ctr.toFixed(2)}%): **${optimal}**`;
      }).join('\n');

      return `### Budget Allocation Diagnostics\n\n` +
        `Analyzing ${activeCamps.length} active campaigns (Total current active budget: **$${totalBudget.toLocaleString()}**):\n\n` +
        `${suggestions}\n\n` +
        `**Recommendation**: Reallocate budget towards high-converting channels showing a higher click rate. Your Brand profile persona is highly receptive to social ad distribution, making Meta/LinkedIn ads more valuable for lead generation.`;
    }

    // Default response
    return `I've noted your question: "${query}".\n\n` +
      `Here is a summary of our active workspace parameters:\n` +
      `• **Brand Tone**: ${brandTone}\n` +
      `• **Target Persona**: ${targetAudience}\n` +
      `• **Active Campaigns**: ${activeCamps.length > 0 ? campNames : 'None registered'}\n` +
      `• **Knowledge Assets**: ${assets.length} documents ingested\n\n` +
      `Let me know if you would like me to draft specific ad headlines, review campaign ROAS, or simulate ROI outcomes with this data!`;
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Append user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setIsTyping(false);
      const aiResponseText = generateSmartResponse(textToSend);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="copilot-layout">
      {/* Left Column: Chat Conversation Screen */}
      <div className="chat-panel">
        <div className="chat-messages-container">
          {messages.map((m) => (
            <div key={m.id} className={`message-bubble ${m.sender}`}>
              <div className="msg-avatar">
                {m.sender === 'user' ? 'U' : <Bot size={16} />}
              </div>
              <div className="msg-text-wrapper">
                <div 
                  className="msg-text"
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {/* Clean styling for simple markdown titles in responses */}
                  {m.text.split('\n').map((line, lIdx) => {
                    if (line.startsWith('### ')) {
                      return <h3 key={lIdx} style={{ fontSize: '15px', margin: '12px 0 6px', color: 'var(--text-primary)' }}>{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('#### ')) {
                      return <h4 key={lIdx} style={{ fontSize: '13px', margin: '10px 0 4px', color: 'var(--accent-purple)' }}>{line.replace('#### ', '')}</h4>;
                    }
                    return <p key={lIdx} style={{ margin: '2px 0', fontSize: '13.5px' }}>{line}</p>;
                  })}
                </div>
                <span className="msg-meta">{m.timestamp}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-bubble assistant">
              <div className="msg-avatar">
                <Bot size={16} />
              </div>
              <div className="msg-text-wrapper">
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input box */}
        <div className="chat-input-wrapper">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }} 
            className="input-group"
          >
            <input 
              type="text" 
              placeholder="Message your AI Marketing Copilot (e.g. 'Generate ad copy for Facebook' or 'Optimize budgets')..." 
              className="app-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
            />
            <button 
              type="submit" 
              className="btn-send"
              disabled={isTyping}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Presets Suggestions & Help Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Brain size={18} color="var(--accent-purple)" />
            <h4 style={{ fontSize: '13px' }}>Copilot Quick Actions</h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {presetPrompts.map((p, idx) => (
              <button 
                key={idx}
                className="preset-btn"
                style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px', padding: '10px' }}
                onClick={() => handleSend(p.prompt)}
                disabled={isTyping}
              >
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{p.prompt.substring(0, 45)}...</span>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lightbulb size={18} color="var(--accent-purple)" />
            <h4 style={{ fontSize: '13px' }}>Contextual Targeting</h4>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            The AI Copilot synthesizes inputs from your active settings to align ad copy output:
          </p>
          <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Brand Voice:</span>
              <span style={{ fontWeight: 600 }}>{brandTone}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Target Persona:</span>
              <span style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{targetAudience}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
