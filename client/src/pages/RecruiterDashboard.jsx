import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const blankJob = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  salary: "",
  description: "",
  skills: [],
  requirements: [],
  questions: [],
  status: "open"
};

function formatAppliedAt(value) {
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [active, setActive] = useState({ ...blankJob, company: user.company || "" });
  const [skillText, setSkillText] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [jobData, appData] = await Promise.all([api("/jobs/mine"), api("/applications/recruiter")]);
      setJobs(jobData);
      setApplications(appData);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(field, value) {
    setActive((current) => ({ ...current, [field]: value }));
  }

  function addSkill() {
    if (!skillText.trim()) return;
    update("skills", [...(active.skills || []), skillText.trim()]);
    setSkillText("");
  }

  function addQuestion() {
    update("questions", [...(active.questions || []), { question: "", type: "text", required: true }]);
  }

  function updateQuestion(index, field, value) {
    update(
      "questions",
      (active.questions || []).map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function removeQuestion(index) {
    update(
      "questions",
      (active.questions || []).filter((item, itemIndex) => itemIndex !== index)
    );
  }

  async function saveJob() {
    setError("");
    const method = active._id ? "PUT" : "POST";
    const path = active._id ? `/jobs/${active._id}` : "/jobs";
    const payload = {
      ...active,
      skills: (active.skills || []).map((skill) => skill.trim()).filter(Boolean),
      requirements: (active.requirements || []).map((item) => item.trim()).filter(Boolean),
      questions: (active.questions || []).filter((item) => item.question?.trim())
    };
    try {
      const saved = await api(path, { method, body: JSON.stringify(payload) });
      setActive(saved);
      setNotice("Job saved.");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteJob(id) {
    try {
      await api(`/jobs/${id}`, { method: "DELETE" });
      setActive({ ...blankJob, company: user.company || "" });
      setNotice("Job deleted.");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateStatus(id, status) {
    await api(`/applications/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
    load();
  }

  return (
    <section className="dashboard">
      <div className="page-heading">
        <p className="eyebrow">Recruiter desk</p>
        <h1>Post jobs and review applications in one place.</h1>
      </div>
      {notice && <p className="notice">{notice}</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="workspace recruiter-layout">
        <aside className="side-panel">
          <button className="full-button" type="button" onClick={() => setActive({ ...blankJob, company: user.company || "" })}>
            <Plus size={17} /> New job
          </button>
          {jobs.map((job) => (
            <button className={active?._id === job._id ? "list-button active" : "list-button"} key={job._id} type="button" onClick={() => setActive(job)}>
              {job.title || "Untitled role"}
            </button>
          ))}
          {jobs.length === 0 && <p className="subtle-note">Create your first role to start collecting applications.</p>}
        </aside>

        <div className="builder">
          <div className="form-grid">
            <label>
              Job title
              <input value={active.title} onChange={(event) => update("title", event.target.value)} />
            </label>
            <label>
              Company
              <input value={active.company} onChange={(event) => update("company", event.target.value)} />
            </label>
            <label>
              Location
              <input value={active.location} onChange={(event) => update("location", event.target.value)} />
            </label>
            <label>
              Type
              <select value={active.type} onChange={(event) => update("type", event.target.value)}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Remote</option>
              </select>
            </label>
            <label>
              Salary
              <input value={active.salary || ""} onChange={(event) => update("salary", event.target.value)} />
            </label>
            <label>
              Status
              <select value={active.status} onChange={(event) => update("status", event.target.value)}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </label>
          </div>
          <label>
            Job description
            <textarea rows="7" value={active.description} onChange={(event) => update("description", event.target.value)} />
          </label>
          <div className="inline-form">
            <input placeholder="Add skill" value={skillText} onChange={(event) => setSkillText(event.target.value)} />
            <button type="button" onClick={addSkill}>Add</button>
          </div>
          <div className="tags">
            {active.skills?.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
          <div className="question-editor">
            <div className="section-title-row">
              <h2>Job questions</h2>
              <button type="button" onClick={addQuestion}>Add question</button>
            </div>
            {(active.questions || []).map((item, index) => (
              <div className="question-row" key={`${item.question}-${index}`}>
                <label>
                  Question
                  <input value={item.question} onChange={(event) => updateQuestion(index, "question", event.target.value)} />
                </label>
                <label>
                  Type
                  <select value={item.type} onChange={(event) => updateQuestion(index, "type", event.target.value)}>
                    <option value="text">Text</option>
                    <option value="yes-no">Yes / No</option>
                  </select>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" checked={item.required} onChange={(event) => updateQuestion(index, "required", event.target.checked)} />
                  Required
                </label>
                <button className="secondary-button compact-button" type="button" onClick={() => removeQuestion(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="modal-actions sticky-actions">
            {active._id && (
              <button className="danger-button" type="button" onClick={() => deleteJob(active._id)}>
                <Trash2 size={16} /> Delete
              </button>
            )}
            <button type="button" onClick={saveJob}>
              <Save size={16} /> Save job
            </button>
          </div>
        </div>

        <aside className="applications-panel">
          <h2>Applications</h2>
          {applications.length === 0 && <p className="subtle-note">Applications for your jobs will appear here.</p>}
          {applications.map((item) => (
            <article className="application-card" key={item._id}>
              <div className="application-card-head">
                <div>
                  <strong>{item.candidate?.name}</strong>
                  <span>{item.candidate?.email}</span>
                </div>
                <time dateTime={item.createdAt}>{formatAppliedAt(item.createdAt)}</time>
              </div>
              <div className="application-job-line">
                <b>{item.job?.title}</b>
                <span>{item.job?.company}</span>
              </div>
              <div className="resume-line">
                Resume: <b>{item.resume?.name || "Not attached"}</b>
              </div>
              <p>{item.coverLetter || "No cover letter added."}</p>
              {item.answers?.length > 0 && (
                <div className="answer-list">
                  {item.answers.map((answer) => (
                    <span key={answer.question}>
                      <b>{answer.question}</b>
                      {answer.answer}
                    </span>
                  ))}
                </div>
              )}
              <select value={item.status} onChange={(event) => updateStatus(item._id, event.target.value)}>
                <option value="submitted">Submitted</option>
                <option value="reviewing">Reviewing</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
                <option value="hired">Hired</option>
              </select>
            </article>
          ))}
        </aside>
      </div>
    </section>
  );
}
