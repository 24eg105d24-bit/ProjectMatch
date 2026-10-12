import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  Search,
  Compass,
  Sparkles,
  RotateCcw,
  Plus
} from 'lucide-react';

const ProjectDiscoveryPage = () => {
  const { projects, createProject, loading, error } = useProjects();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');

  // Extract all unique skills across projects for the filter dropdown
  const allUniqueSkills = useMemo(() => {
    const skillSet = new Set();
    projects.forEach(p => {
      p.requiredSkills.forEach(s => skillSet.add(s));
    });
    return Array.from(skillSet).sort();
  }, [projects]);

  const categories = ['All', 'Healthcare & EdTech', 'GreenTech', 'Developer Tools', 'FinTech & EdTech', 'Robotics & Web', 'EdTech'];

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Search filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          project.title.toLowerCase().includes(query) ||
          project.tagline.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.requiredSkills.some(s => s.toLowerCase().includes(query)) ||
          project.tags.some(t => t.toLowerCase().includes(query));

        // Category filter
        const matchesCategory =
          selectedCategory === 'All' || project.category.includes(selectedCategory);

        // Status filter
        const matchesStatus =
          selectedStatus === 'All' || project.status === selectedStatus;

        // Skill filter
        const matchesSkill =
          selectedSkill === 'All' || project.requiredSkills.includes(selectedSkill);

        return matchesSearch && matchesCategory && matchesStatus && matchesSkill;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'slots') {
          const slotsA = a.teamSize.max - a.teamSize.current;
          const slotsB = b.teamSize.max - b.teamSize.current;
          return slotsB - slotsA;
        }
        return 0; // Default order
      });
  }, [projects, searchQuery, selectedCategory, selectedStatus, selectedSkill, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedSkill('All');
    setSortBy('relevance');
  };

  return (
    <div className="container py-4 py-lg-5">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Compass size={22} className="text-violet" />
            <h2 className="h3 fw-bold text-navy mb-0">Project Discovery</h2>
          </div>
          <p className="text-muted small mb-0">
            Explore approved university capstone and research proposals currently recruiting teammates
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <Link to="/recommendations" className="btn-pm-outline btn-sm">
            <Sparkles size={15} />
            <span>View Tailored Recommendations</span>
          </Link>
          {currentUser ? (
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setCreateProjectOpen(true)}>
              Create Project
            </Button>
          ) : (
            <Link to="/login" className="btn-pm-primary btn-sm py-1 px-3">Sign In to Create</Link>
          )}
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Filter and Search Bar */}
      <div className="pm-card p-3 p-md-4 mb-4 bg-white">
        <div className="row g-3">
          {/* Search Box */}
          <div className="col-12 col-lg-5">
            <div className="position-relative">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
              <input
                type="text"
                className="form-control ps-5"
                placeholder="Search by title, required skills, tags, or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search projects"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="col-6 col-md-3 col-lg-2">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by project category"
            >
              <option value="All">All Domains</option>
              {categories.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Required Skill Dropdown */}
          <div className="col-6 col-md-3 col-lg-2">
            <select
              className="form-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              aria-label="Filter by required skill"
            >
              <option value="All">All Skills</option>
              {allUniqueSkills.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div className="col-6 col-md-3 col-lg-1">
            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by team status"
            >
              <option value="All">Status</option>
              <option value="Recruiting">Recruiting</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="col-6 col-md-3 col-lg-2">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort projects by"
            >
              <option value="relevance">Default Order</option>
              <option value="slots">Most Open Slots</option>
              <option value="title">Project Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills shortcut */}
        <div className="d-flex flex-wrap align-items-center gap-1 pt-3 mt-3 border-top border-light-subtle">
          <span className="small text-muted me-2">Quick categories:</span>
          {['Healthcare & EdTech', 'GreenTech', 'Developer Tools', 'Robotics & Web'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
              className={`btn btn-sm py-1 px-2 rounded-pill ${selectedCategory === cat ? 'btn-primary' : 'btn-light text-muted border'}`}
              style={{ fontSize: '0.75rem' }}
            >
              {cat}
            </button>
          ))}
          {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedSkill !== 'All') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-sm btn-link text-muted ms-auto d-flex align-items-center gap-1 p-0"
              style={{ fontSize: '0.78rem' }}
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="small text-muted">
          Showing <strong>{filteredProjects.length}</strong> available {filteredProjects.length === 1 ? 'project' : 'projects'}
        </span>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="row g-4">
          {filteredProjects.map((project) => {
            const openSlots = project.teamSize.max - project.teamSize.current;

            return (
              <div key={project.id} className="col-12 col-md-6 col-lg-4">
                <div className="pm-card pm-card-interactive h-100 d-flex flex-column p-4">
                  {/* Card Header */}
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-light text-navy border" style={{ fontSize: '0.75rem' }}>
                      {project.category}
                    </span>
                    <Badge variant={project.status === 'Recruiting' ? 'emerald' : 'violet'}>
                      {project.status}
                    </Badge>
                  </div>

                  {/* Title & Tagline */}
                  <h5 className="fw-bold text-navy mb-2" style={{ fontSize: '1.05rem', lineHeight: 1.35 }}>
                    <Link to={`/projects/${project.id}`} className="text-navy text-decoration-none hover-violet">
                      {project.title}
                    </Link>
                  </h5>

                  <p className="text-muted small mb-3 flex-grow-1" style={{ fontSize: '0.85rem' }}>
                    {project.tagline}
                  </p>

                  {/* Required Skills Badges */}
                  <div className="mb-3">
                    <div className="small text-muted mb-1" style={{ fontSize: '0.75rem' }}>Required Skills:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {project.requiredSkills.slice(0, 4).map((skill, idx) => (
                        <Badge key={idx} variant="violet" style={{ fontSize: '0.72rem' }}>
                          {skill}
                        </Badge>
                      ))}
                      {project.requiredSkills.length > 4 && (
                        <span className="badge bg-light text-muted border" style={{ fontSize: '0.72rem' }}>
                          +{project.requiredSkills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Open Roles highlight */}
                  {project.openRoles && project.openRoles.length > 0 && (
                    <div className="mb-3 p-2 rounded-2 bg-light border small">
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>Open Roles: </span>
                      <strong className="text-violet" style={{ fontSize: '0.78rem' }}>
                        {project.openRoles.join(', ')}
                      </strong>
                    </div>
                  )}

                  {/* Team Capacity Progress Bar */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small text-muted mb-1" style={{ fontSize: '0.75rem' }}>
                      <span>Team Capacity</span>
                      <span className="fw-semibold text-navy">
                        {project.teamSize.current} / {project.teamSize.max} Filled ({openSlots} {openSlots === 1 ? 'slot' : 'slots'} open)
                      </span>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div
                        className="progress-bar bg-violet-gradient"
                        role="progressbar"
                        style={{ width: `${(project.teamSize.current / project.teamSize.max) * 100}%` }}
                        aria-valuenow={project.teamSize.current}
                        aria-valuemin="0"
                        aria-valuemax={project.teamSize.max}
                      />
                    </div>
                  </div>

                  {/* Footer / Creator & Action */}
                  <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-auto">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={project.lead?.avatar}
                        alt={project.lead?.name}
                        className="rounded-circle"
                        style={{ width: 28, height: 28, objectFit: 'cover' }}
                      />
                      <div className="small lh-1">
                        <div className="fw-semibold text-navy" style={{ fontSize: '0.78rem' }}>{project.lead?.name}</div>
                        <span className="text-muted" style={{ fontSize: '0.7rem' }}>Project Lead</span>
                      </div>
                    </div>

                    <Link to={`/projects/${project.id}`} className="btn btn-sm btn-pm-outline py-1 px-3" style={{ fontSize: '0.8rem' }}>
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="pm-card p-5 text-center bg-white my-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light p-3 text-muted mb-3"
            style={{ width: 64, height: 64 }}
          >
            <Search size={28} />
          </div>
          <h4 className="fw-bold text-navy mb-2">
            {loading ? 'Loading Projects' : projects.length === 0 ? 'No Projects Published Yet' : 'No Matching Projects Found'}
          </h4>
          <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '420px' }}>
            {loading
              ? 'Project listings are being loaded from the server.'
              : projects.length === 0
                ? 'Create a project to open a team workspace, or check back when other students publish their projects.'
                : 'We couldn’t find projects matching your current search and filters.'}
          </p>
          {projects.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleResetFilters} icon={RotateCcw}>
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      <CreateProjectModal
        isOpen={createProjectOpen}
        onCreate={createProject}
        onClose={(project) => {
          setCreateProjectOpen(false);
          if (project) navigate(`/projects/${project.id}`);
        }}
      />
    </div>
  );
};

export default ProjectDiscoveryPage;
