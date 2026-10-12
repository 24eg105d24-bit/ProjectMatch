import React, { useState } from 'react';
import { taskColumns } from '../../data/mockTasks';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import Button from '../common/Button';
import { Plus, Search, Filter } from 'lucide-react';

const TaskBoard = ({ tasks = [], onMoveStatus, onAddTask, onDeleteTask, teamId }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [actionError, setActionError] = useState('');

  const runTaskAction = async (action) => {
    setActionError('');
    try {
      await action();
    } catch (error) {
      setActionError(error.message || 'Unable to update this task.');
    }
  };

  const filteredTasks = tasks.filter(task => {
    // If teamId is specified, match teamId
    const matchesTeam = Boolean(teamId) && String(task.teamId) === String(teamId);
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.tag && task.tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    return matchesTeam && matchesSearch && matchesPriority;
  });

  return (
    <div className="task-board-container">
      {/* Board Controls */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 p-3 rounded-3 bg-white border">
        <div className="d-flex flex-column flex-sm-row gap-2 flex-grow-1" style={{ maxWidth: '600px' }}>
          <div className="position-relative flex-grow-1">
            <Search size={16} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            <input
              type="text"
              placeholder="Search tasks by title, domain or keyword..."
              className="form-control ps-5"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search sprint tasks"
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            <Filter size={16} className="text-muted flex-shrink-0" />
            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter tasks by priority"
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
          disabled={!teamId}
        >
          Add Task
        </Button>
      </div>

      {actionError && <div className="alert alert-danger" role="alert">{actionError}</div>}

      {/* Kanban Columns */}
      <div className="kanban-board">
        {taskColumns.map((col) => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);

          return (
            <div key={col.id} className="kanban-column">
              <div className="kanban-column-header">
                <div className="d-flex align-items-center gap-2">
                  <h6 className="fw-bold mb-0 text-navy">{col.title}</h6>
                  <span className="badge rounded-pill bg-light text-dark border">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              <div className="flex-grow-1 d-flex flex-column">
                {colTasks.length > 0 ? (
                  colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMoveStatus={(taskId, status) => runTaskAction(() => onMoveStatus(taskId, status))}
                      onDeleteTask={(taskId) => runTaskAction(() => onDeleteTask(taskId))}
                    />
                  ))
                ) : (
                  <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 p-4 border border-dashed rounded-3 text-center text-muted">
                    <p className="small mb-1">No tasks in {col.title}</p>
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(true)}
                      className="btn btn-sm btn-link p-0 text-violet"
                    >
                      + Add a task
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTask={onAddTask}
        teamId={teamId}
      />
    </div>
  );
};

export default TaskBoard;
