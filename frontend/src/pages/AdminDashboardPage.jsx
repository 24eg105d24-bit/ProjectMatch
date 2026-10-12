import React, { useState } from 'react';
import {
  mockAdminStats,
  mockDepartmentStats,
  mockPendingProjects,
  mockRecentActivities
} from '../data/mockAdminData';
import Badge from '../components/common/Badge';
import AlertBanner from '../components/common/AlertBanner';
import {
  Users,
  FolderKanban,
  GitMerge,
  BarChart3,
  CheckCircle,
  ArrowUpRight,
  Check,
  X
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [pendingList, setPendingList] = useState(mockPendingProjects);
  const [alertMessage, setAlertMessage] = useState('');

  const handleApprove = (id, title) => {
    setPendingList(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item)
    );
    setAlertMessage(`Project "${title}" has been approved for the Fall 2026 capstone cohort.`);
  };

  const handleReject = (id, title) => {
    setPendingList(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'Needs Revision' } : item)
    );
    setAlertMessage(`Feedback sent to creator of "${title}". Status set to Needs Revision.`);
  };

  return (
    <div>
      {/* Top Welcome Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="h3 fw-bold text-navy mb-1">Coordinator Overview & Cohort Metrics</h2>
          <p className="text-muted small mb-0">
            Real-time management dashboard for capstone proposals, team formation balance, and cohort status
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-white text-navy border px-3 py-2 small fw-bold">
            Fall 2026 Academic Cohort
          </span>
        </div>
      </div>

      {alertMessage && (
        <AlertBanner
          type="success"
          message={alertMessage}
          onClose={() => setAlertMessage('')}
          className="mb-4"
        />
      )}

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="pm-card p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Total Students</span>
              <div className="p-2 rounded-3 bg-violet-subtle text-violet">
                <Users size={18} />
              </div>
            </div>
            <div className="h2 fw-bold text-navy mb-1">{mockAdminStats.totalStudents.toLocaleString()}</div>
            <div className="d-flex align-items-center gap-1 text-success small">
              <ArrowUpRight size={14} />
              <span>{mockAdminStats.growthRates.students}</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="pm-card p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Active Projects</span>
              <div className="p-2 rounded-3 bg-violet-subtle text-violet">
                <FolderKanban size={18} />
              </div>
            </div>
            <div className="h2 fw-bold text-navy mb-1">{mockAdminStats.activeProjects}</div>
            <div className="d-flex align-items-center gap-1 text-success small">
              <ArrowUpRight size={14} />
              <span>{mockAdminStats.growthRates.projects}</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="pm-card p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Formed Teams</span>
              <div className="p-2 rounded-3 bg-violet-subtle text-violet">
                <GitMerge size={18} />
              </div>
            </div>
            <div className="h2 fw-bold text-navy mb-1">{mockAdminStats.formedTeams}</div>
            <div className="d-flex align-items-center gap-1 text-success small">
              <CheckCircle size={14} />
              <span>{mockAdminStats.growthRates.teams}</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="pm-card p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-semibold">Average Match Score</span>
              <div className="p-2 rounded-3 bg-emerald-50 text-success">
                <BarChart3 size={18} />
              </div>
            </div>
            <div className="h2 fw-bold text-navy mb-1">{mockAdminStats.averageMatchScore}</div>
            <small className="text-muted small">Based on multi-factor skill overlap</small>
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Approvals & Department Distribution */}
      <div className="row g-4 mb-4">
        {/* Pending Approvals Table */}
        <div className="col-12 col-xl-8">
          <div className="pm-card p-4 bg-white h-100">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 className="fw-bold text-navy mb-0">Project Proposals Approval Queue</h5>
                <small className="text-muted">Review submitted student capstone ideas for course compliance</small>
              </div>
              <span className="badge bg-danger rounded-pill px-2 py-1 small">
                {pendingList.filter(p => p.status === 'Pending Review').length} Pending
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.875rem' }}>
                <thead className="table-light">
                  <tr>
                    <th>Project Proposal</th>
                    <th>Creator & Dept</th>
                    <th>Team Sizing</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingList.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong className="d-block text-navy">{item.title}</strong>
                        <small className="text-muted">Submitted {item.submittedAt}</small>
                      </td>
                      <td>
                        <div className="fw-semibold text-navy">{item.creator}</div>
                        <small className="text-muted">{item.department}</small>
                      </td>
                      <td>
                        <span className="badge bg-light text-navy border">{item.requestedTeamSize} Students</span>
                      </td>
                      <td>
                        <Badge variant={item.status === 'Approved' ? 'emerald' : item.status === 'Needs Revision' ? 'amber' : 'rose'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="text-end">
                        {item.status === 'Pending Review' ? (
                          <div className="d-inline-flex gap-1">
                            <button
                              type="button"
                              onClick={() => handleApprove(item.id, item.title)}
                              className="btn btn-sm btn-outline-success py-1 px-2 d-flex align-items-center gap-1"
                              title="Approve Proposal"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(item.id, item.title)}
                              className="btn btn-sm btn-outline-danger py-1 px-2 d-flex align-items-center gap-1"
                              title="Request Revision"
                            >
                              <X size={14} /> Revise
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted small">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Department Distribution */}
        <div className="col-12 col-xl-4">
          <div className="pm-card p-4 bg-white h-100">
            <h5 className="fw-bold text-navy mb-3 pb-2 border-bottom">Cohort Discipline Distribution</h5>
            <p className="text-muted small mb-4">
              Breakdown of registered students across colleges to ensure cross-functional capability.
            </p>

            <div className="d-flex flex-column gap-3">
              {mockDepartmentStats.map((dept, idx) => (
                <div key={idx}>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-semibold text-navy">{dept.name}</span>
                    <span className="text-muted">{dept.count} ({dept.percentage}%)</span>
                  </div>
                  <div className="progress" style={{ height: '7px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${dept.percentage}%`, backgroundColor: dept.color }}
                      aria-valuenow={dept.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-3 bg-light border mt-4 small text-muted">
              <strong className="text-navy d-block mb-1">Interdisciplinary Target:</strong>
              Encouraging Computer Science projects to include at least 1 Design or Business student for usability and market validation.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="pm-card p-4 bg-white">
        <h5 className="fw-bold text-navy mb-3 pb-2 border-bottom">Recent Platform Activity & Audit Log</h5>
        <div className="d-flex flex-column gap-2">
          {mockRecentActivities.map((act) => (
            <div key={act.id} className="p-3 rounded-2 bg-light border d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="rounded-circle bg-violet-subtle text-violet p-1" style={{ width: 8, height: 8 }} />
                <span className="small fw-semibold text-navy">{act.event}</span>
              </div>
              <span className="small text-muted">{act.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
