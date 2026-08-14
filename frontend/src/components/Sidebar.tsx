import React from 'react';
import { 
  LayoutDashboard, 
  Megaphone, 
  BarChart3, 
  BookOpen, 
  Bot, 
  Sparkles
} from 'lucide-react';

export type ViewType = 'dashboard' | 'campaigns' | 'analytics' | 'knowledge' | 'copilot';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'campaigns', name: 'Campaigns', icon: Megaphone },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'knowledge', name: 'Knowledge Base', icon: BookOpen },
    { id: 'copilot', name: 'AI Copilot', icon: Bot },
  ] as const;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Sparkles size={18} color="#fff" />
        </div>
        <span className="brand-text">Marketing Copilot</span>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <li key={item.id}>
              <a 
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => onViewChange(item.id)}
              >
                <Icon className="sidebar-item-icon" />
                <span>{item.name}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            MK
          </div>
          <div className="user-info">
            <span className="user-name">Marcus K.</span>
            <span className="user-role">Marketing Director</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
