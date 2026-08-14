import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Globe, 
  Mail,
  Sparkles,
  X,
  Share2,
  Users,
  MessageSquare
} from 'lucide-react';
import type { Campaign } from '../../App';

interface CampaignsViewProps {
  campaigns: Campaign[];
  onToggleStatus: (id: string) => void;
  onCreateCampaign: (newCampaign: Omit<Campaign, 'id' | 'spend' | 'ctr' | 'conversions' | 'clicks' | 'impressions'>) => void;
  onDeleteCampaign: (id: string) => void;
}

export const CampaignsView: React.FC<CampaignsViewProps> = ({
  campaigns,
  onToggleStatus,
  onCreateCampaign,
  onDeleteCampaign
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formChannel, setFormChannel] = useState<'Google' | 'Meta' | 'LinkedIn' | 'Twitter' | 'Email'>('Google');
  const [formBudget, setFormBudget] = useState(1000);
  const [formGoal, setFormGoal] = useState('Conversions');

  const filteredCampaigns = campaigns.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.channel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    onCreateCampaign({
      name: formName,
      channel: formChannel,
      budget: Number(formBudget),
      goal: formGoal,
      status: 'active'
    });

    // Reset and close
    setFormName('');
    setFormChannel('Google');
    setFormBudget(1000);
    setFormGoal('Conversions');
    setIsModalOpen(false);
  };

  const getPlatformIcon = (channel: Campaign['channel']) => {
    switch (channel) {
      case 'Google': return <Globe size={14} />;
      case 'Meta': return <Share2 size={14} />;
      case 'LinkedIn': return <Users size={14} />;
      case 'Twitter': return <MessageSquare size={14} />;
      case 'Email': return <Mail size={14} />;
    }
  };

  return (
    <div className="campaigns-view">
      <div className="campaigns-actions">
        <div className="search-bar">
          <Search />
          <input 
            type="text" 
            placeholder="Search campaigns by name or channel..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Create Campaign</span>
        </button>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-wrapper">
          <table className="campaign-table">
            <thead>
              <tr>
                <th>Campaign Name</th>
                <th>Channel</th>
                <th>Goal</th>
                <th>Total Budget</th>
                <th>Total Spend</th>
                <th>CTR</th>
                <th>Conversions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                    No campaigns found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                    <td>
                      <span className={`platform-badge ${c.channel.toLowerCase()}`}>
                        {getPlatformIcon(c.channel)}
                        {c.channel}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {c.goal || 'Conversions'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>${c.budget.toLocaleString()}</td>
                    <td>${c.spend.toLocaleString()}</td>
                    <td>{c.ctr.toFixed(2)}%</td>
                    <td style={{ fontWeight: 500 }}>{c.conversions.toLocaleString()}</td>
                    <td>
                      <div className="status-indicator">
                        <label className="switch">
                          <input 
                            type="checkbox" 
                            checked={c.status === 'active'}
                            onChange={() => onToggleStatus(c.id)}
                          />
                          <span className="slider"></span>
                        </label>
                        <span className={`dot ${c.status}`} style={{ display: 'none' }}></span>
                        <span style={{ fontSize: '11px', color: c.status === 'active' ? 'var(--accent-green)' : 'var(--text-muted)' }}>
                          {c.status === 'active' ? 'Active' : 'Paused'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 8px', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.1)' }}
                        onClick={() => onDeleteCampaign(c.id)}
                        title="Delete Campaign"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="sidebar-logo" style={{ width: '28px', height: '28px' }}>
                  <Sparkles size={14} color="#fff" />
                </div>
                <h3>Create New Campaign</h3>
              </div>
              <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="camp-name">Campaign Name</label>
                <input 
                  type="text" 
                  id="camp-name" 
                  placeholder="e.g. Q3 SaaS Re-engagement" 
                  className="app-input full-radius"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="camp-channel">Ad Channel</label>
                  <select 
                    id="camp-channel"
                    className="app-select"
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value as any)}
                  >
                    <option value="Google">Google Ads</option>
                    <option value="Meta">Meta Ads</option>
                    <option value="LinkedIn">LinkedIn Ads</option>
                    <option value="Twitter">Twitter Ads</option>
                    <option value="Email">Email Marketing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="camp-goal">Campaign Goal</label>
                  <select 
                    id="camp-goal"
                    className="app-select"
                    value={formGoal}
                    onChange={(e) => setFormGoal(e.target.value)}
                  >
                    <option value="Conversions">Conversions</option>
                    <option value="Lead Generation">Lead Generation</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Website Traffic">Website Traffic</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="camp-budget">Total Campaign Budget ($)</label>
                <input 
                  type="number" 
                  id="camp-budget" 
                  min="100" 
                  max="1000000"
                  className="app-input full-radius"
                  value={formBudget}
                  onChange={(e) => setFormBudget(Number(e.target.value))}
                  required
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Generate Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
