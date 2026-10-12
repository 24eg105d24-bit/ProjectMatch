import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import CompatibilityScore from '../components/common/CompatibilityScore';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import AlertBanner from '../components/common/AlertBanner';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import {
  Sparkles,
  Info,
  Send,
  SlidersHorizontal
} from 'lucide-react';

const TeamRecommendationsPage = () => {
  const { recommendations, applyToProject, loading, error } = useProjects();
  const { currentUser } = useAuth();

  const [minScore, setMinScore] = useState(80);
  const [selectedRecForModal, setSelectedRecForModal] = useState(null);
  const [pitchMessage, setPitchMessage] = useState('');
  const [notification, setNotification] = useState('');

  const filteredRecs = recommendations.filter(r => r.compatibilityScore >= minScore);

  const handleOpenJoinModal = (rec) => {
    setSelectedRecForModal(rec);
    setPitchMessage(`Hi ${rec.leadName}, I saw that ${rec.projectTitle} is looking for a ${rec.targetRole}. My skills in ${rec.matchingSkills.slice(0, 2).join(' and ')} align with your stack!`);
  };

  const handleSendJoinRequest = async (e) => {
    e.preventDefault();
    if (!selectedRecForModal) return;

    try {
      await applyToProject(selectedRecForModal.projectId, {
        role: selectedRecForModal.targetRole,
        note: pitchMessage
      });

      setNotification(`Join request sent to ${selectedRecForModal.leadName} for the ${selectedRecForModal.targetRole} role!`);
      setSelectedRecForModal(null);
      setPitchMessage('');
    } catch (error) {
      setNotification(error.message || 'Unable to send join request.');
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Sparkles size={22} className="text-violet" />
            <h2 className="h3 fw-bold text-navy mb-0">Team Recommendations</h2>
          </div>
          <p className="text-muted small mb-0">
            Top project matches computed using skill complementarity, schedule overlap, and shared domain interests
          </p>
        </div>

        {/* Minimum score filter */}
        <div className="d-flex align-items-center gap-2 p-2 bg-white rounded-3 border">
          <SlidersHorizontal size={15} className="text-muted" />
          <span className="small text-muted text-nowrap">Min Compatibility:</span>
          <select
            className="form-select form-select-sm py-1 px-2 border-0 bg-light"
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            aria-label="Filter recommendations by minimum score"
          >
            <option value={70}>70%+ (All Matches)</option>
            <option value={80}>80%+ (High Matches)</option>
            <option value={90}>90%+ (Exceptional Only)</option>
          </select>
        </div>
      </div>

      {notification && (
        <AlertBanner
          type="success"
          message={notification}
          onClose={() => setNotification('')}
          className="mb-4"
        />
      )}

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Transparent Match Engine Banner */}
      <div className="pm-card p-3 p-md-4 mb-4 bg-violet-subtle border-violet d-flex align-items-start gap-3">
        <Info size={22} className="text-violet flex-shrink-0 mt-1" />
        <div className="small">
          <strong className="d-block text-navy mb-1">Algorithmic Compatibility Scoring Engine</strong>
          <span className="text-muted">
            Scores reflect transparent multi-factor matching: <strong>Skill Complementarity (40%)</strong>, <strong>Role Vacancy Alignment (30%)</strong>, <strong>Weekly Commitment Overlap (20%)</strong>, and <strong>Domain Affinity (10%)</strong>. No opaque black-box AI claims.
          </span>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="d-flex flex-column gap-4">
        {filteredRecs.map((rec) => (
          <div key={rec.id} className="pm-card p-4 p-md-4 bg-white">
            <div className="row align-items-center g-4">
              {/* Left Score Gauge */}
              <div className="col-12 col-md-auto text-center text-md-start">
                <CompatibilityScore
                  score={rec.compatibilityScore}
                  size="lg"
                  showLabel={false}
                />
                <div className="mt-2 text-center">
                  <Badge variant={rec.compatibilityScore >= 90 ? 'emerald' : 'violet'}>
                    {rec.matchRating}
                  </Badge>
                </div>
              </div>

              {/* Middle Project & Breakdown */}
              <div className="col-12 col-md">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                  <span className="badge bg-light text-navy border" style={{ fontSize: '0.75rem' }}>
                    {rec.category}
                  </span>
                  <span className="small text-muted">&bull; Lead: {rec.leadName}</span>
                  <span className="small text-muted">&bull; {rec.teamCapacity}</span>
                </div>

                <h4 className="fw-bold text-navy mb-2" style={{ fontSize: '1.2rem' }}>
                  <Link to={`/projects/${rec.projectId}`} className="text-navy text-decoration-none hover-violet">
                    {rec.projectTitle}
                  </Link>
                </h4>

                <div className="p-2 px-3 rounded-2 bg-light border mb-3 d-inline-flex align-items-center gap-2">
                  <span className="small text-muted">Target Open Role:</span>
                  <strong className="text-violet small">{rec.targetRole}</strong>
                </div>

                {/* Explanations Grid */}
                <div className="row g-2 mt-1">
                  {rec.explanations.map((exp, idx) => (
                    <div key={idx} className="col-12 col-lg-6">
                      <div className="p-2 px-3 rounded-2 bg-light border h-100 d-flex flex-column justify-content-between">
                        <div className="d-flex align-items-center justify-content-between mb-1">
                          <span className="fw-bold text-navy" style={{ fontSize: '0.78rem' }}>
                            {exp.criterion}
                          </span>
                          <span className="badge bg-white text-violet border" style={{ fontSize: '0.68rem' }}>
                            {exp.badge}
                          </span>
                        </div>
                        <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
                          {exp.highlight}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Matching Skills Badges */}
                <div className="mt-3 d-flex flex-wrap align-items-center gap-1">
                  <span className="small text-muted me-2" style={{ fontSize: '0.78rem' }}>Matching Proficiencies:</span>
                  {rec.matchingSkills.map((skill, idx) => (
                    <Badge key={idx} variant="emerald" style={{ fontSize: '0.72rem' }}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="col-12 col-md-auto d-flex flex-column gap-2 text-center text-md-end">
                <Button
                  variant="primary"
                  icon={Send}
                  onClick={() => handleOpenJoinModal(rec)}
                  className="w-100"
                >
                  Send Join Request
                </Button>

                <Link to={`/projects/${rec.projectId}`} className="w-100">
                  <Button variant="outline" size="sm" className="w-100">
                    View Project Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredRecs.length === 0 && (
          <div className="pm-card p-5 text-center bg-white">
            <h5 className="fw-bold text-navy mb-2">
              {loading
                ? 'Loading Recommendations'
                : recommendations.length === 0
                  ? 'No Recommendations Yet'
                  : `No Recommendations Exceed ${minScore}%`}
            </h5>
            <p className="text-muted small mb-3">
              {loading
                ? 'Matching persisted recruiting projects against your profile.'
                : recommendations.length === 0
                ? 'Recommendations appear when other students publish recruiting projects. Your own projects are not listed as matches.'
                : 'Adjust your minimum score to view additional promising matches.'}
            </p>
            {recommendations.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setMinScore(70)}>
                Reset Minimum Score to 70%
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal: Send Join Request */}
      <Modal
        isOpen={Boolean(selectedRecForModal)}
        onClose={() => setSelectedRecForModal(null)}
        title={`Request to Join: ${selectedRecForModal?.projectTitle}`}
        subtitle={`Role: ${selectedRecForModal?.targetRole} &bull; Lead: ${selectedRecForModal?.leadName}`}
      >
        <form onSubmit={handleSendJoinRequest}>
          <FormInput
            type="textarea"
            label="Personalized Join Request"
            placeholder="Introduce yourself and explain why you're a great fit for this role..."
            value={pitchMessage}
            onChange={(e) => setPitchMessage(e.target.value)}
            rows={4}
            required
          />

          <div className="p-3 rounded-3 bg-light border small text-muted mb-3">
            <span className="fw-semibold text-navy">Match Snapshot Attached: </span>
            This message will share your compatibility score ({selectedRecForModal?.compatibilityScore}%), weekly commitment ({currentUser?.availability?.hoursPerWeek} hrs/wk), and verified skill endorsements.
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button variant="ghost" onClick={() => setSelectedRecForModal(null)}>Cancel</Button>
            <Button variant="primary" type="submit" icon={Send}>Send Join Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamRecommendationsPage;
