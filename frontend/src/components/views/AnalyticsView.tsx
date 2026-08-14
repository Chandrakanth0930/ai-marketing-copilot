import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Calculator 
} from 'lucide-react';
import type { Campaign } from '../../App';

interface AnalyticsViewProps {
  campaigns: Campaign[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ campaigns }) => {
  // ROI Calculator states
  const [budget, setBudget] = useState(5000);
  const [cpc, setCpc] = useState(1.50);
  const [convRate, setConvRate] = useState(2.5); // percentage
  const [aov, setAov] = useState(120); // average order value in dollars

  // Channel breakdown calculation from campaigns
  const channelData = useMemo(() => {
    const data: Record<string, { spend: number; conversions: number; budget: number }> = {
      Google: { spend: 0, conversions: 0, budget: 0 },
      Meta: { spend: 0, conversions: 0, budget: 0 },
      LinkedIn: { spend: 0, conversions: 0, budget: 0 },
      Twitter: { spend: 0, conversions: 0, budget: 0 },
      Email: { spend: 0, conversions: 0, budget: 0 },
    };

    campaigns.forEach((c) => {
      if (data[c.channel]) {
        data[c.channel].spend += c.spend;
        data[c.channel].conversions += c.conversions;
        data[c.channel].budget += c.budget;
      }
    });

    const totalSpend = Object.values(data).reduce((acc, curr) => acc + curr.spend, 0) || 1;
    const totalBudget = Object.values(data).reduce((acc, curr) => acc + curr.budget, 0) || 1;

    return Object.entries(data).map(([name, stats]) => ({
      name,
      spend: stats.spend,
      conversions: stats.conversions,
      budget: stats.budget,
      spendPct: (stats.spend / totalSpend) * 100,
      budgetPct: (stats.budget / totalBudget) * 100
    })).sort((a, b) => b.spend - a.spend);
  }, [campaigns]);

  // ROI calculations
  const roiCalculations = useMemo(() => {
    const estClicks = Math.round(budget / (cpc || 0.01));
    const estConversions = Math.round(estClicks * (convRate / 100));
    const projectedRevenue = estConversions * aov;
    const projectedRoas = budget > 0 ? projectedRevenue / budget : 0;
    
    return {
      clicks: estClicks,
      conversions: estConversions,
      revenue: projectedRevenue,
      roas: projectedRoas
    };
  }, [budget, cpc, convRate, aov]);

  const getChannelColor = (name: string) => {
    switch (name) {
      case 'Google': return 'var(--accent-blue)';
      case 'Meta': return '#4092ff';
      case 'LinkedIn': return '#0077b5';
      case 'Twitter': return '#9ca3af';
      case 'Email': return 'var(--accent-green)';
      default: return 'var(--accent-purple)';
    }
  };

  return (
    <div className="analytics-view">
      <div className="analytics-grid">
        {/* Ad Spend & Allocation Share */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart3 size={20} color="var(--accent-purple)" />
            <h3>Spend Breakdown by Channel</h3>
          </div>

          <div className="channel-breakdown">
            {channelData.map((channel) => (
              <div key={channel.name} className="channel-bar-item">
                <div className="channel-info">
                  <span style={{ fontWeight: 600 }}>{channel.name} Ads</span>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    ${channel.spend.toLocaleString()} spent ({channel.spendPct.toFixed(1)}%)
                  </span>
                </div>
                <div className="channel-bar-bg">
                  <div 
                    className="channel-bar-fill" 
                    style={{ 
                      width: `${channel.spendPct}%`, 
                      backgroundColor: getChannelColor(channel.name),
                      boxShadow: `0 0 10px ${getChannelColor(channel.name)}40` 
                    }}
                  />
                </div>
                <div className="channel-info" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-2px' }}>
                  <span>Conversions: {channel.conversions.toLocaleString()}</span>
                  <span>Budget: ${channel.budget.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing ROI Simulator */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Calculator size={20} color="var(--accent-purple)" />
            <h3>AI Marketing ROI Calculator</h3>
          </div>

          {/* Slider for Budget */}
          <div className="calculator-slider">
            <div className="slider-header">
              <span>Monthly Ad Budget</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${budget.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="50000" 
              step="500"
              className="range-input"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </div>

          {/* Slider for CPC */}
          <div className="calculator-slider">
            <div className="slider-header">
              <span>Expected Cost Per Click (CPC)</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${cpc.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0.10" 
              max="15.00" 
              step="0.05"
              className="range-input"
              value={cpc}
              onChange={(e) => setCpc(Number(e.target.value))}
            />
          </div>

          {/* Slider for Conv Rate */}
          <div className="calculator-slider">
            <div className="slider-header">
              <span>Conversion Rate</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{convRate.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="20.0" 
              step="0.1"
              className="range-input"
              value={convRate}
              onChange={(e) => setConvRate(Number(e.target.value))}
            />
          </div>

          {/* Slider for AOV */}
          <div className="calculator-slider">
            <div className="slider-header">
              <span>Average Order Value (AOV)</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${aov}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="1000" 
              step="10"
              className="range-input"
              value={aov}
              onChange={(e) => setAov(Number(e.target.value))}
            />
          </div>

          {/* Projected Outcomes */}
          <div className="calculator-results">
            <div className="calc-stat">
              <span className="calc-stat-label">Proj. Clicks</span>
              <span className="calc-stat-val" style={{ color: 'var(--accent-blue)' }}>
                {roiCalculations.clicks.toLocaleString()}
              </span>
            </div>

            <div className="calc-stat">
              <span className="calc-stat-label">Proj. Revenue</span>
              <span className="calc-stat-val" style={{ color: 'var(--accent-green)' }}>
                ${roiCalculations.revenue.toLocaleString()}
              </span>
            </div>

            <div className="calc-stat">
              <span className="calc-stat-label">Proj. ROAS</span>
              <span className="calc-stat-val" style={{ color: 'var(--accent-purple)' }}>
                {roiCalculations.roas.toFixed(2)}x
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
