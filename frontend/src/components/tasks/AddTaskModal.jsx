import React, { useState } from 'react';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const AddTaskModal = ({ isOpen, onClose, onAddTask, teamId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'Medium',
    tag: 'Feature',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitError('');
    setSaving(true);
    try {
      await onAddTask({ ...formData, teamId });
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'Medium',
        tag: 'Feature',
        dueDate: ''
      });
      setErrors({});
      onClose();
    } catch (error) {
      setSubmitError(error.message || 'Unable to create task.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Team Task"
      subtitle="Organize deliverables and assign milestones for your project sprint"
    >
      <form onSubmit={handleSubmit} noValidate>
        {submitError && <div className="alert alert-danger" role="alert">{submitError}</div>}
        <FormInput
          label="Task Title"
          name="title"
          placeholder="e.g. Implement WebSocket reconnection handler"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />

        <FormInput
          type="textarea"
          label="Description / Acceptance Criteria"
          name="description"
          placeholder="Detail what needs to be delivered and tested..."
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <FormInput
              type="select"
              label="Priority Level"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={[
                { value: 'High', label: 'High Priority (Urgent)' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'Low', label: 'Low Priority' }
              ]}
            />
          </div>

          <div className="col-12 col-md-6">
            <FormInput
              type="select"
              label="Initial Column Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'todo', label: 'To Do' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'review', label: 'In Review' },
                { value: 'done', label: 'Done' }
              ]}
            />
          </div>

          <div className="col-12 col-md-6">
            <FormInput
              label="Task Tag / Domain"
              name="tag"
              placeholder="e.g. Frontend, API, UI/UX"
              value={formData.tag}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-md-6">
            <FormInput
              label="Target Due Date"
              name="dueDate"
              placeholder="e.g. Nov 22, 2026"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <Button variant="ghost" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={saving || !teamId}>
            {saving ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTaskModal;
