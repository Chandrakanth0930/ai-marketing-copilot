import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Percent, 
  AlertCircle, 
  ArrowRight,
  Bot
} from 'lucide-react';
import type { Campaign } from '../../App';

interface DashboardViewProps {
  campaigns: Campaign[];
  onViewChange: (view: 'dashboard' | 'campaigns' | 'analytics' | 'knowledge' | 'copilot') => void;
  setMiniChatQuery: (query: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  campaigns, 
  onViewChange,
  setMiniChatQuery
}) => {
  const [chartFilter, setChartFilter] = useState<'impressions' | 'clicks' | 'conversions'>('clicks');
  const [miniChatText, setMiniChatText] = useState('');
  const [miniChatResponse, setMiniChatResponse] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Compute metrics dynamically from campaigns state
  const metrics = useMemo(() => {
    let totalBudget = 0;
    let totalSpend = 0;
    let totalClicks = 0;
    let totalImpressions = 0;
    let totalConversions = 0;
    let activeCount = 0;

    campaigns.forEach(c => {
      totalBudget += c.budget;
      totalSpend += c.spend;
      if (c.status === 'active') {
        totalClicks += c.clicks;
        totalImpressions += c.impressions;
        totalConversions += c.conversions;
        activeCount++;
      } else {
        // Paused campaigns still add to total historic conversions/spend
        totalClicks += c.clicks * 0.8; // simulated paused weight
        totalImpressions += c.impressions * 0.8;
        totalConversions += c.conversions * 0.8;
      }
    });

    const averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    // Mock ROAS based on conversions
    const roas = totalSpend > 0 ? ((totalConversions * 145) / totalSpend) : 0;

    return {
      totalBudget,
      totalSpend,
      totalClicks: Math.round(totalClicks),
      totalImpressions: Math.round(totalImpressions),
      totalConversions: Math.round(totalConversions),
      averageCtr,
      roas,
      activeCount
    };
  }, [campaigns]);

  // Handle preset clicks in the mini copilot section
  const handlePresetClick = (prompt: string) => {
    setIsTyping(true);
    setMiniChatResponse(null);
    setTimeout(() => {
      setIsTyping(false);
      if (prompt.toLowerCase().includes('budget')) {
        setMiniChatResponse(`Based on your active campaigns, Meta Ads is converting at a 25% lower cost per acquisition than Google Ads. I recommend reallocating $1,500 of remaining budget from your Google Campaign to Meta Campaign for 18% estimated conversion lift.`);
      } else if (prompt.toLowerCase().includes('health')) {
        setMiniChatResponse(`Campaign Health is optimal! Overall ROAS is standing at ${metrics.roas.toFixed(2)}x (up 12% week-on-week). 1 alert detected: Google Ads CTR is showing minor latency. Adjusting targeting keywords is recommended.`);
      } else {
        setMiniChatResponse(`I've analyzed your current dashboard. CTR is stable at ${metrics.averageCtr.toFixed(2)}% with ${metrics.totalConversions} total conversions. Let's head over to the full AI Copilot panel to draft customized ad variations!`);
      }
    }, 1200);
  };

  // Handle mini copilot form submission
  const handleMiniSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!miniChatText.trim()) return;
    
    // Pass query and transition to full Copilot tab
    setMiniChatQuery(miniChatText);
    onViewChange('copilot');
  };

  // Mock Alerts Feed
  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'High CPA Alert',
      desc: 'Google Ads Search (SaaS Launch) CPC surged by 18% in the last 24h.',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'Optimization Recommendation',
      desc: 'AI recommends generating 3 new ad creatives for Meta Summer Sale to counter ad fatigue.',
      time: '5 hours ago'
    },
    {
      id: 3,
      type: 'critical',
      title: 'Budget Threshold Reached',
      desc: 'LinkedIn Retargeting campaign is at 95% of daily budget limits.',
      time: '1 day ago'
    }
  ];

  // Custom SVG Chart points calculations
  const chartDataPoints = useMemo(() => {
    // Generate data depending on filter
    const base = chartFilter === 'clicks' 
      ? [120, 210, 180, 280, 240, 390, 420] 
      : chartFilter === 'conversions'
      ? [15, 30, 25, 45, 38, 55, 68]
      : [1200, 1800, 1500, 2400, 2100, 3100, 3800];

    const max = Math.max(...base);
    const min = Math.min(...base);
    const range = max - min || 1;

    // Map to SVG coordinates: width=600, height=220
    const points = base.map((val, idx) => {
      const x = 50 + (idx * 80);
      const y = 200 - ((val - min) / range * 140);
      return { x, y, value: val };
    });

    // Make SVG Path definition
    let pathD = '';
    points.forEach((p, idx) => {
      if (idx === 0) {
        pathD += `M ${p.x} ${p.y}`;
      } else {
        // Curve calculation (simple Bezier anchor approximation)
        const prev = points[idx - 1];
        const cpX1 = prev.x + 30;
        const cpY1 = prev.y;
        const cpX2 = p.x - 30;
        const cpY2 = p.y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p.x} ${p.y}`;
      }
    });

    // Area path closing
    const areaD = `${pathD} L ${points[points.length - 1].x} 200 L ${points[0].x} 200 Z`;

    return { points, pathD, areaD };
  }, [chartFilter]);

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="dashboard-view">
      {/* Dynamic Overview Cards Grid */}
      <div className="dashboard-grid">
        <div className="glass-card metric-card purple">
          <div className="metric-header">
            <span className="metric-title">Return on Ad Spend (ROAS)</span>
            <div className="metric-icon-wrapper">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value">{metrics.roas.toFixed(2)}x</span>
            <span className="metric-change positive">
              <TrendingUp size={12} /> +14.2%
            </span>
          </div>
        </div>

        <div className="glass-card metric-card blue">
          <div className="metric-header">
            <span className="metric-title">Total Conversions</span>
            <div className="metric-icon-wrapper">
              <Users size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value">{metrics.totalConversions.toLocaleString()}</span>
            <span className="metric-change positive">
              <TrendingUp size={12} /> +8.6%
            </span>
          </div>
        </div>

        <div className="glass-card metric-card green">
          <div className="metric-header">
            <span className="metric-title">Average CTR</span>
            <div className="metric-icon-wrapper">
              <Percent size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value">{metrics.averageCtr.toFixed(2)}%</span>
            <span className="metric-change positive">
              <TrendingUp size={12} /> +0.4%
            </span>
          </div>
        </div>

        <div className="glass-card metric-card rose">
          <div className="metric-header">
            <span className="metric-title">Total Ad Budget Spent</span>
            <div className="metric-icon-wrapper">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="metric-body">
            <span className="metric-value">${metrics.totalSpend.toLocaleString()}</span>
            <span className="metric-change negative">
              <TrendingDown size={12} /> -5.1%
            </span>
          </div>
        </div>
      </div>

      {/* Main Charts & Mini-Assistant Grid */}
      <div className="dashboard-details-grid">
        {/* Performance Chart Card */}
        <div className="glass-card">
          <div className="chart-header">
            <div>
              <h3>Performance Chart</h3>
              <p style={{ fontSize: '12px' }}>Interactive campaign traffic metrics overview</p>
            </div>
            <div className="chart-actions">
              <button 
                className={`btn btn-outline btn-sm ${chartFilter === 'clicks' ? 'active' : ''}`}
                onClick={() => setChartFilter('clicks')}
              >
                Clicks
              </button>
              <button 
                className={`btn btn-outline btn-sm ${chartFilter === 'impressions' ? 'active' : ''}`}
                onClick={() => setChartFilter('impressions')}
              >
                Impressions
              </button>
              <button 
                className={`btn btn-outline btn-sm ${chartFilter === 'conversions' ? 'active' : ''}`}
                onClick={() => setChartFilter('conversions')}
              >
                Conversions
              </button>
            </div>
          </div>

          <div className="chart-container">
            <svg className="chart-svg" viewBox="0 0 600 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="50" y1="60" x2="570" y2="60" className="chart-grid-line" />
              <line x1="50" y1="130" x2="570" y2="130" className="chart-grid-line" />
              <line x1="50" y1="200" x2="570" y2="200" className="chart-grid-line" />

              {/* Chart Line Path */}
              <path d={chartDataPoints.pathD} className="chart-line" />
              <path d={chartDataPoints.areaD} className="chart-area" />

              {/* Data points markers */}
              {chartDataPoints.points.map((p, idx) => (
                <g key={idx} className="chart-point-group" style={{ cursor: 'pointer' }}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="5" 
                    fill="#a78bfa" 
                    stroke="#fff" 
                    strokeWidth="2"
                  />
                  {/* Interactive simple tooltip on point label */}
                  <text 
                    x={p.x} 
                    y={p.y - 12} 
                    textAnchor="middle" 
                    className="chart-axis-text" 
                    style={{ fill: '#fff', fontWeight: 600, fontSize: '10px' }}
                  >
                    {p.value.toLocaleString()}
                  </text>
                </g>
              ))}

              {/* X Axis Labels */}
              {weekdays.map((day, idx) => (
                <text 
                  key={idx}
                  x={50 + (idx * 80)} 
                  y="218" 
                  textAnchor="middle" 
                  className="chart-axis-text"
                >
                  {day}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Marketing Recommendations & Alerts */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '16px' }}>Marketing Alerts</h3>
          <div className="alerts-list" style={{ flex: 1 }}>
            {alerts.map((a) => (
              <div key={a.id} className={`alert-item ${a.type}`}>
                <AlertCircle className="alert-icon" />
                <div className="alert-content">
                  <span className="alert-title">{a.title}</span>
                  <span className="alert-description">{a.desc}</span>
                  <span className="alert-time">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embedded AI Copilot Quick Actions Box */}
      <div className="glass-card dashboard-copilot-card">
        <div className="copilot-section-header">
          <div className="copilot-avatar">
            <Bot size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '16px' }}>AI Marketing Copilot</h3>
              <span className="copilot-badge">Online</span>
            </div>
            <p style={{ fontSize: '12px' }}>Quick actions & marketing insight generation</p>
          </div>
        </div>

        {miniChatResponse ? (
          <div className="msg-text-wrapper" style={{ marginBottom: '16px', maxWidth: '100%' }}>
            <div className="msg-text" style={{ background: 'rgba(139, 92, 246, 0.1)', borderColor: 'var(--border-active)' }}>
              {miniChatResponse}
            </div>
            <button 
              className="btn btn-outline btn-sm" 
              style={{ marginTop: '8px', alignSelf: 'flex-start' }}
              onClick={() => setMiniChatResponse(null)}
            >
              Clear Insight
            </button>
          </div>
        ) : isTyping ? (
          <div className="typing-dots" style={{ marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginRight: '8px' }}>AI is analyzing data</span>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        ) : (
          <div className="copilot-presets">
            <button 
              className="preset-btn"
              onClick={() => handlePresetClick("Check active campaign health")}
            >
              Check active campaign health
            </button>
            <button 
              className="preset-btn"
              onClick={() => handlePresetClick("Optimize meta vs google ads budgets")}
            >
              Optimize ad spend distribution
            </button>
            <button 
              className="preset-btn"
              onClick={() => handlePresetClick("Analyze conversion rates")}
            >
              Analyze conversion rates
            </button>
          </div>
        )}

        <form onSubmit={handleMiniSubmit} className="input-group">
          <input 
            type="text" 
            placeholder="Ask AI Copilot to write copy, optimize budgets, or analyze data..." 
            className="app-input"
            value={miniChatText}
            onChange={(e) => setMiniChatText(e.target.value)}
          />
          <button type="submit" className="btn-send">
            <span>Consult AI</span>
            <ArrowRight size={14} style={{ marginLeft: '6px' }} />
          </button>
        </form>
      </div>
    </div>
  );
};
