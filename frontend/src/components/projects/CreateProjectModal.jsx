import React, { useState } from 'react';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

const initialForm = {
  title: '',
  tagline: '',
  description: '',
  category: '',
  maxTeamSize: 4,
  weeklyHoursExpectation: 12,
  tags: '',
  openRoles: '',
  requiredSkills: ''
};

const splitList = (value) => value.split(',').map(item => item.trim()).filter(Boolean);

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm(previous => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const project = await onCreate({
        title: form.title.trim(),
        tagline: form.tagline.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        maxTeamSize: Number(form.maxTeamSize),
        weeklyHoursExpectation: Number(form.weeklyHoursExpectation),
        tags: splitList(form.tags),
        openRoles: splitList(form.openRoles),
        requiredSkills: splitList(form.requiredSkills).map(skillName => ({
          skillName,
          minProficiency: 'BEGINNER',
          isRequired: true
        }))
      });
      setForm(initialForm);
      onClose(project);
    } catch (requestError) {
      setError(requestError.message || 'Unable to create project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => onClose()}
      title="Create a Project"
      subtitle="Publish a recruiting project and start its team workspace"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <div className="row g-3">
          <div className="col-12 col-md-7">
            <FormInput label="Project title" name="title" value={form.title} onChange={updateField} required maxLength={200} />
          </div>
          <div className="col-12 col-md-5">
            <FormInput label="Category" name="category" value={form.category} onChange={updateField} placeholder="e.g. Education, Climate" required maxLength={100} />
          </div>
          <div className="col-12">
            <FormInput label="Tagline" name="tagline" value={form.tagline} onChange={updateField} maxLength={300} />
          </div>
          <div className="col-12">
            <FormInput type="textarea" label="Description" name="description" value={form.description} onChange={updateField} rows={4} required />
          </div>
          <div className="col-12 col-md-6">
            <FormInput label="Required skills" name="requiredSkills" value={form.requiredSkills} onChange={updateField} placeholder="React, Python, UX research" />
          </div>
          <div className="col-12 col-md-6">
            <FormInput label="Open roles" name="openRoles" value={form.openRoles} onChange={updateField} placeholder="Frontend developer, Designer" />
          </div>
          <div className="col-12">
            <FormInput label="Tags" name="tags" value={form.tags} onChange={updateField} placeholder="Accessibility, Mobile, Research" />
          </div>
          <div className="col-6">
            <FormInput type="number" label="Maximum team size" name="maxTeamSize" value={form.maxTeamSize} onChange={updateField} min={2} max={20} required />
          </div>
          <div className="col-6">
            <FormInput type="number" label="Expected hours per week" name="weeklyHoursExpectation" value={form.weeklyHoursExpectation} onChange={updateField} min={1} max={80} required />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top">
          <Button variant="ghost" onClick={() => onClose()} disabled={saving}>Cancel</Button>
          <Button variant="primary" type="submit" loading={saving}>Publish Project</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;