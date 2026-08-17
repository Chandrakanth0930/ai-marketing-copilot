import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import type { ViewType } from './components/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { CampaignsView } from './components/views/CampaignsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { KnowledgeBaseView } from './components/views/KnowledgeBaseView';
import { AICopilotView } from './components/views/AICopilotView';

export interface Campaign {
  id: string;
  name: string;
  channel: 'Google' | 'Meta' | 'LinkedIn' | 'Twitter' | 'Email';
  budget: number;
  spend: number;
  status: 'active' | 'paused';
  ctr: number;
  conversions: number;
  clicks: number;
  impressions: number;
  goal?: string;
}

export interface BrandAsset {
  id: string;
  name: string;
  type: string;
  dateAdded: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [miniChatQuery, setMiniChatQuery] = useState<string>('');
  const [backendStatus, setBackendStatus] = useState<string>('');
  useEffect(() => {
    fetch('http://127.0.0.1:8000/health')
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(data.status);
      })
      .catch(() => {
        setBackendStatus('Backend unavailable');
      });
  }, []);


  // Brand Context states
  const [brandTone, setBrandTone] = useState('Professional');
  const [targetAudience, setTargetAudience] = useState(
    'Mid-to-large business owners and marketing directors looking for SaaS automation platforms.'
  );

  // Pre-populated assets inside Knowledge Base
  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([
    { id: '1', name: 'corporate_brand_guide_2026.pdf', type: 'document', dateAdded: '2026-06-12' },
    { id: '2', name: 'product_catalog_overview.xlsx', type: 'document', dateAdded: '2026-07-04' },
    { id: '3', name: 'https://mysaasplatform.com/features', type: 'website', dateAdded: '2026-08-01' }
  ]);

  // Realistic mock campaigns so metrics are immediately interactive and beautiful
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'c1',
      name: 'Google Ads Search (SaaS Launch)',
      channel: 'Google',
      budget: 5000,
      spend: 3200,
      status: 'active',
      ctr: 2.15,
      conversions: 185,
      clicks: 1488,
      impressions: 69209,
      goal: 'Conversions'
    },
    {
      id: 'c2',
      name: 'Meta Ads Retargeting (Summer Sale)',
      channel: 'Meta',
      budget: 3500,
      spend: 2100,
      status: 'active',
      ctr: 3.42,
      conversions: 242,
      clicks: 1954,
      impressions: 57134,
      goal: 'Conversions'
    },
    {
      id: 'c3',
      name: 'LinkedIn Lead Gen (Enterprise SaaS)',
      channel: 'LinkedIn',
      budget: 8000,
      spend: 7100,
      status: 'active',
      ctr: 1.88,
      conversions: 92,
      clicks: 814,
      impressions: 43297,
      goal: 'Lead Generation'
    },
    {
      id: 'c4',
      name: 'Email Newsletter (Weekly Feature Update)',
      channel: 'Email',
      budget: 500,
      spend: 120,
      status: 'paused',
      ctr: 12.50,
      conversions: 62,
      clicks: 1240,
      impressions: 9920,
      goal: 'Website Traffic'
    }
  ]);

  // Campaign callbacks
  const handleToggleCampaignStatus = (id: string) => {
    setCampaigns(prev => prev.map(c =>
      c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
    ));
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const handleCreateCampaign = (newCamp: Omit<Campaign, 'id' | 'spend' | 'ctr' | 'conversions' | 'clicks' | 'impressions'>) => {
    // Generate realistic starting stats for new campaigns
    const randCtr = Number((Math.random() * 2 + 1.5).toFixed(2)); // random CTR 1.5% - 3.5%
    const initialClicks = Math.round(newCamp.budget * 0.15); // simulate clicks based on budget
    const initialImpressions = Math.round(initialClicks / (randCtr / 100));
    const initialConversions = Math.round(initialClicks * 0.08); // 8% conversion rate

    const campaign: Campaign = {
      ...newCamp,
      id: `c-${Date.now()}`,
      spend: 0,
      ctr: randCtr,
      clicks: initialClicks,
      impressions: initialImpressions,
      conversions: initialConversions
    };

    setCampaigns(prev => [campaign, ...prev]);
  };

  // Knowledge base callbacks
  const handleAddAsset = (name: string, type: string) => {
    const asset: BrandAsset = {
      id: `asset-${Date.now()}`,
      name,
      type,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setBrandAssets(prev => [...prev, asset]);
  };

  const handleDeleteAsset = (id: string) => {
    setBrandAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleUpdateBrandDetails = (tone: string, audience: string) => {
    setBrandTone(tone);
    setTargetAudience(audience);
  };

  // Page Header Titles Helper
  const getHeaderTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'campaigns': return 'Campaign Inventory Manager';
      case 'analytics': return 'Marketing Performance & ROI Analytics';
      case 'knowledge': return 'AI Brand Guidelines & Persona Directory';
      case 'copilot': return 'AI Conversational Marketing Copilot';
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="main-layout">
        {/* Top Navbar */}
        <nav className="top-nav">
          <div className="top-nav-title">
            <h1>{getHeaderTitle()}</h1>
          </div>
          <div className="top-nav-actions">
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Brand Tone: <strong>{brandTone}</strong>
            </span>
            <div style={{ width: '1px', height: '16px', background: 'var(--border-light)' }}></div>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Active Campaigns: <strong>{campaigns.filter(c => c.status === 'active').length}</strong>
            </span>
          </div>
        </nav>

        {/* Dynamic Inner Views */}
        <div className="workspace-content">
          {currentView === 'dashboard' && (
            <DashboardView
              campaigns={campaigns}
              onViewChange={setCurrentView}
              setMiniChatQuery={setMiniChatQuery}
            />
          )}

          {currentView === 'campaigns' && (
            <CampaignsView
              campaigns={campaigns}
              onToggleStatus={handleToggleCampaignStatus}
              onCreateCampaign={handleCreateCampaign}
              onDeleteCampaign={handleDeleteCampaign}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView campaigns={campaigns} />
          )}

          {currentView === 'knowledge' && (
            <KnowledgeBaseView
              assets={brandAssets}
              brandTone={brandTone}
              targetAudience={targetAudience}
              onAddAsset={handleAddAsset}
              onDeleteAsset={handleDeleteAsset}
              onUpdateBrandDetails={handleUpdateBrandDetails}
            />
          )}

          {currentView === 'copilot' && (
            <AICopilotView
              campaigns={campaigns}
              assets={brandAssets}
              brandTone={brandTone}
              targetAudience={targetAudience}
              miniChatQuery={miniChatQuery}
              setMiniChatQuery={setMiniChatQuery}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
