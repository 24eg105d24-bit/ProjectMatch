import React, { useState } from 'react';
import api from '../../api/client';
import {
  Sparkles,
  X,
  Send,
  Lightbulb,
  FileText,
  Target,
  MessageSquare
} from 'lucide-react';

const AiAssistantDrawer = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'ideas' | 'refine' | 'gap'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your ProjectMatch AI Assistant. I can help brainstorm capstone concepts, refine project proposals, assess technical skill gaps, or answer team formation questions.'
    }
  ]);

  // Project Ideas State
  const [ideaTopic, setIdeaTopic] = useState('AI in Healthcare');
  const [ideaCategory, setIdeaCategory] = useState('Machine Learning');
  const [ideasResult, setIdeasResult] = useState(null);

  // Proposal Refinement State
  const [proposalDraft, setProposalDraft] = useState('');
  const [refineResult, setRefineResult] = useState(null);

  // Skill Gap State
  const [currentSkillsInput, setCurrentSkillsInput] = useState('React, HTML, CSS');
  const [requiredSkillsInput, setRequiredSkillsInput] = useState('React, Java, Spring Boot, MySQL, Docker');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [gapResult, setGapResult] = useState(null);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/ai/chat', { prompt: userMsg });
      setMessages(prev => [...prev, { sender: 'ai', text: response.data.response }]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reach AI assistant.');
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an issue processing your query. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateIdeas = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/ai/project-ideas', {
        topic: ideaTopic,
        category: ideaCategory
      });
      setIdeasResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate ideas.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefineProposal = async (e) => {
    e.preventDefault();
    if (!proposalDraft.trim()) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/ai/refine-proposal', {
        proposalText: proposalDraft
      });
      setRefineResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to refine proposal.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeSkillGap = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const currentSkills = currentSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
      const requiredSkills = requiredSkillsInput.split(',').map(s => s.trim()).filter(Boolean);
      const response = await api.post('/api/ai/skill-gap', {
        currentSkills,
        requiredSkills,
        targetRole
      });
      setGapResult(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze skill gaps.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-fixed top-0 end-0 h-100 bg-white shadow-lg z-3 d-flex flex-column border-start"
      style={{ width: '100%', maxWidth: 480, zIndex: 1055 }}
    >
      {/* Header */}
      <div className="p-3 bg-navy text-white d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle bg-violet p-1 text-white d-flex align-items-center justify-content-center" style={{ width: 30, height: 30 }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h6 className="mb-0 fw-bold">ProjectMatch AI Assistant</h6>
            <span className="small text-white-50" style={{ fontSize: '0.72rem' }}>Copilot for Team Formation</span>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-link text-white p-0"
          onClick={onClose}
          aria-label="Close Assistant"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav Tabs */}
      <div className="d-flex border-bottom bg-light">
        <button
          type="button"
          className={`btn btn-sm flex-fill rounded-0 py-2 d-inline-flex align-items-center justify-content-center gap-1 border-0 ${activeTab === 'chat' ? 'bg-white fw-bold text-violet border-bottom border-2 border-primary' : 'text-muted'}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare size={14} /> Chat
        </button>
        <button
          type="button"
          className={`btn btn-sm flex-fill rounded-0 py-2 d-inline-flex align-items-center justify-content-center gap-1 border-0 ${activeTab === 'ideas' ? 'bg-white fw-bold text-violet border-bottom border-2 border-primary' : 'text-muted'}`}
          onClick={() => setActiveTab('ideas')}
        >
          <Lightbulb size={14} /> Ideas
        </button>
        <button
          type="button"
          className={`btn btn-sm flex-fill rounded-0 py-2 d-inline-flex align-items-center justify-content-center gap-1 border-0 ${activeTab === 'refine' ? 'bg-white fw-bold text-violet border-bottom border-2 border-primary' : 'text-muted'}`}
          onClick={() => setActiveTab('refine')}
        >
          <FileText size={14} /> Refine
        </button>
        <button
          type="button"
          className={`btn btn-sm flex-fill rounded-0 py-2 d-inline-flex align-items-center justify-content-center gap-1 border-0 ${activeTab === 'gap' ? 'bg-white fw-bold text-violet border-bottom border-2 border-primary' : 'text-muted'}`}
          onClick={() => setActiveTab('gap')}
        >
          <Target size={14} /> Gaps
        </button>
      </div>

      {error && (
        <div className="alert alert-danger m-2 py-1 px-2 small mb-0 rounded-2" role="alert">
          {error}
        </div>
      )}

      {/* Tab Body */}
      <div className="flex-grow-1 overflow-y-auto p-3">
        {/* Chat Mode */}
        {activeTab === 'chat' && (
          <div className="d-flex flex-column h-100 justify-content-between">
            <div className="d-flex flex-column gap-3 mb-3">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-3 small ${
                    m.sender === 'user'
                      ? 'bg-primary text-white align-self-end ms-4'
                      : 'bg-light text-navy align-self-start me-4 border'
                  }`}
                  style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}
                >
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="p-2 small text-muted fst-italic">
                  <span className="spinner-border spinner-border-sm me-1" role="status" /> AI is thinking...
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="d-flex gap-2 pt-2 border-top">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Ask about project ideas, tech stacks, roles..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btn btn-primary btn-sm px-3" disabled={loading || !chatInput.trim()}>
                <Send size={14} />
              </button>
            </form>
          </div>
        )}

        {/* Project Ideas Generator */}
        {activeTab === 'ideas' && (
          <div>
            <form onSubmit={handleGenerateIdeas} className="mb-3">
              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Topic / Domain Area</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={ideaTopic}
                  onChange={(e) => setIdeaTopic(e.target.value)}
                  placeholder="e.g. Distributed Ledger, Health Tech, Autonomous Bots"
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Category</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={ideaCategory}
                  onChange={(e) => setIdeaCategory(e.target.value)}
                  placeholder="e.g. Machine Learning, Web & Mobile, Cloud Systems"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm w-100" disabled={loading}>
                {loading ? 'Generating Concepts...' : 'Generate Project Concepts'}
              </button>
            </form>

            {ideasResult && (
              <div className="p-3 bg-light rounded-3 border small">
                <div style={{ whiteSpace: 'pre-wrap' }}>{ideasResult.response}</div>
              </div>
            )}
          </div>
        )}

        {/* Proposal Refinement */}
        {activeTab === 'refine' && (
          <div>
            <form onSubmit={handleRefineProposal} className="mb-3">
              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Draft Project Idea / Abstract</label>
                <textarea
                  className="form-control form-control-sm"
                  rows={4}
                  value={proposalDraft}
                  onChange={(e) => setProposalDraft(e.target.value)}
                  placeholder="Paste your rough project description, problem statement, or capstone proposal..."
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm w-100" disabled={loading || !proposalDraft.trim()}>
                {loading ? 'Polishing Proposal...' : 'Refine Proposal for Academic Rigor'}
              </button>
            </form>

            {refineResult && (
              <div className="p-3 bg-light rounded-3 border small">
                <div style={{ whiteSpace: 'pre-wrap' }}>{refineResult.response}</div>
              </div>
            )}
          </div>
        )}

        {/* Skill Gap Analysis */}
        {activeTab === 'gap' && (
          <div>
            <form onSubmit={handleAnalyzeSkillGap} className="mb-3">
              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Your Current Skills</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={currentSkillsInput}
                  onChange={(e) => setCurrentSkillsInput(e.target.value)}
                  placeholder="e.g. React, JavaScript, CSS"
                />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Required Skills for Project</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={requiredSkillsInput}
                  onChange={(e) => setRequiredSkillsInput(e.target.value)}
                  placeholder="e.g. Spring Boot, Java, Docker, MySQL"
                />
              </div>
              <div className="mb-2">
                <label className="form-label small fw-semibold text-muted mb-1">Target Role</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Backend Lead, Full Stack Developer"
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm w-100" disabled={loading}>
                {loading ? 'Analyzing Competencies...' : 'Compute Gap & 4-Week Learning Plan'}
              </button>
            </form>

            {gapResult && (
              <div className="p-3 bg-light rounded-3 border small">
                <div style={{ whiteSpace: 'pre-wrap' }}>{gapResult.response}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiAssistantDrawer;
