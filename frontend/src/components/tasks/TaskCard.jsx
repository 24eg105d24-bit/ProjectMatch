import React from 'react';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import { Calendar, Trash2, ArrowRightCircle } from 'lucide-react';

const TaskCard = ({ task, onMoveStatus, onDeleteTask }) => {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return <Badge variant="rose">High</Badge>;
      case 'Medium':
        return <Badge variant="amber">Medium</Badge>;
      case 'Low':
      default:
        return <Badge variant="emerald">Low</Badge>;
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'todo':
        return { label: 'Start Task', next: 'in-progress' };
      case 'in-progress':
        return { label: 'Submit for Review', next: 'review' };
      case 'review':
        return { label: 'Mark Done', next: 'done' };
      case 'done':
      default:
        return null;
    }
  };

  const nextStep = getNextStatus(task.status);

  return (
    <div className="kanban-card">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <Badge variant="violet" className="text-uppercase" style={{ fontSize: '0.68rem' }}>
          {task.tag || 'Task'}
        </Badge>
        {getPriorityBadge(task.priority)}
      </div>

      <h6 className="fw-bold text-navy mb-1" style={{ fontSize: '0.9375rem' }}>
        {task.title}
      </h6>

      {task.description && (
        <p className="text-muted small mb-3 text-truncate-2" style={{ fontSize: '0.8125rem' }}>
          {task.description}
        </p>
      )}

      <div className="d-flex align-items-center justify-content-between pt-2 border-top border-light-subtle">
        <div className="d-flex align-items-center gap-2">
          <Avatar
            src={task.assignee?.avatar}
            name={task.assignee?.name || 'Member'}
            size={24}
            shape="circle"
          />
          <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
            {task.assignee?.name?.split(' ')[0] || 'Member'}
          </span>
        </div>

        <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.75rem' }}>
          <Calendar size={13} />
          <span>{task.dueDate}</span>
        </div>
      </div>

      {/* Quick Move / Status selector */}
      <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top border-light-subtle">
        <select
          value={task.status}
          onChange={(e) => onMoveStatus(task.id, e.target.value)}
          className="form-select form-select-sm py-0 px-2 text-muted"
          style={{ fontSize: '0.75rem', width: 'auto' }}
          aria-label={`Update status for ${task.title}`}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="review">In Review</option>
          <option value="done">Done</option>
        </select>

        <div className="d-flex align-items-center gap-1">
          {nextStep && (
            <button
              type="button"
              onClick={() => onMoveStatus(task.id, nextStep.next)}
              className="btn btn-sm btn-link p-0 text-violet"
              title={nextStep.label}
              aria-label={nextStep.label}
            >
              <ArrowRightCircle size={16} />
            </button>
          )}

          <button
            type="button"
            onClick={() => onDeleteTask(task.id)}
            className="btn btn-sm btn-link p-0 text-muted hover-danger"
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
