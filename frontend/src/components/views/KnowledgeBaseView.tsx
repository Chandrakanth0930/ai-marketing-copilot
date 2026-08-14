import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Plus, 
  Globe, 
  Trash2, 
  CheckCircle, 
  FileCode, 
  Sparkles
} from 'lucide-react';
import type { BrandAsset } from '../../App';

interface KnowledgeBaseViewProps {
  assets: BrandAsset[];
  brandTone: string;
  targetAudience: string;
  onAddAsset: (name: string, type: string) => void;
  onDeleteAsset: (id: string) => void;
  onUpdateBrandDetails: (tone: string, audience: string) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  assets,
  brandTone,
  targetAudience,
  onAddAsset,
  onDeleteAsset,
  onUpdateBrandDetails
}) => {
  const [toneInput, setToneInput] = useState(brandTone);
  const [audienceInput, setAudienceInput] = useState(targetAudience);
  const [isSaved, setIsSaved] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  // Mock tone presets
  const tones = ['Professional', 'Friendly', 'Witty & Playful', 'Bold & Disruptive', 'Educational'];

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBrandDetails(toneInput, audienceInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    
    // Extract base domain as name
    let cleanName = newUrl.replace(/^(https?:\/\/)?(www\.)?/, '');
    if (cleanName.length > 30) cleanName = cleanName.substring(0, 30) + '...';
    
    onAddAsset(cleanName, 'website');
    setNewUrl('');
  };

  const handleMockUpload = () => {
    // Generate a mock file upload
    const mockFiles = [
      'product_specification_v2.pdf',
      'brand_identity_guidelines.docx',
      'customer_feedback_summary.xlsx',
      'competitor_pricing_matrix.csv'
    ];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    onAddAsset(randomFile, 'document');
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'website': return <Globe size={16} />;
      case 'document': return <FileText size={16} />;
      default: return <FileCode size={16} />;
    }
  };

  return (
    <div className="knowledge-base-view">
      <div className="knowledge-grid">
        {/* Left Side: Brand Settings & Audience configuration */}
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <Sparkles size={20} color="var(--accent-purple)" />
            <h3>Brand Profile & Persona Settings</h3>
          </div>

          <form onSubmit={handleSaveBrand}>
            <div className="form-group">
              <label>Select Brand Tone of Voice</label>
              <div className="brand-persona-presets">
                {tones.map((t) => (
                  <div 
                    key={t}
                    className={`persona-preset-card ${toneInput === t ? 'active' : ''}`}
                    onClick={() => setToneInput(t)}
                  >
                    <span className="persona-preset-name">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="target-audience">Target Audience Description</label>
              <textarea 
                id="target-audience"
                className="app-input full-radius"
                style={{ width: '100%', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit', display: 'block' }}
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                placeholder="Describe your ideal customer persona in detail (e.g. Young professionals in urban areas looking for quick meal prep ideas)..."
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">
                Save Brand Profile
              </button>
              {isSaved && (
                <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                  <CheckCircle size={16} />
                  Saved brand settings successfully!
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Upload Assets & List files */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Upload panel */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '12px' }}>Inquire Knowledge Assets</h3>
            <p style={{ fontSize: '12px', marginBottom: '16px' }}>Provide files or links for the AI Copilot to reference when generating ad campaigns.</p>
            
            <div className="dropzone" onClick={handleMockUpload}>
              <Upload />
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Upload marketing documents</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Drag files here, or click to upload (PDF, DOCX, CSV)</p>
            </div>

            <div style={{ margin: '16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OR INTEGRATE URL</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }}></div>
            </div>

            <form onSubmit={handleUrlSubmit} className="input-group">
              <input 
                type="url" 
                placeholder="https://example.com/product-specs" 
                className="app-input"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                style={{ fontSize: '12px' }}
                required
              />
              <button type="submit" className="btn-send" style={{ padding: '0 12px' }}>
                <Plus size={16} />
              </button>
            </form>
          </div>

          {/* Ingested Assets List */}
          <div className="glass-card">
            <h3>Knowledge Directory ({assets.length})</h3>
            <div className="knowledge-list">
              {assets.map((asset) => (
                <div key={asset.id} className="kb-item">
                  <div className="kb-item-info">
                    <div className="kb-icon-bg">
                      {getAssetIcon(asset.type)}
                    </div>
                    <div>
                      <span className="kb-name" title={asset.name}>{asset.name}</span>
                      <div className="kb-meta">Added {asset.dateAdded}</div>
                    </div>
                  </div>
                  <button 
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '6px 8px', color: 'var(--text-muted)' }}
                    onClick={() => onDeleteAsset(asset.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
