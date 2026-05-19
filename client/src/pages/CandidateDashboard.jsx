import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

function createBlankResume(user) {
  return {
    name: "My resume",
    summary: "",
    contact: { phone: "", email: user?.email || "", website: "", location: user?.location || "" },
    skills: [],
    experience: [],
    education: [],
    projects: []
  };
}

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [active, setActive] = useState(() => createBlankResume(user));
  const [skillText, setSkillText] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [resumeData, appData] = await Promise.all([api("/resumes"), api("/applications/mine")]);
      setResumes(resumeData);
      setApplications(appData);
      setActive(resumeData[0] || createBlankResume(user));
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

  function updateContact(field, value) {
    setActive((current) => ({ ...current, contact: { ...current.contact, [field]: value } }));
  }

  function addSkill() {
    if (!skillText.trim()) return;
    update("skills", [...(active.skills || []), skillText.trim()]);
    setSkillText("");
  }

  function addItem(section, item) {
    update(section, [...(active[section] || []), item]);
  }

  function updateItem(section, index, field, value) {
    update(
      section,
      (active[section] || []).map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  }

  function removeItem(section, index) {
    update(
      section,
      (active[section] || []).filter((item, itemIndex) => itemIndex !== index)
    );
  }

  async function saveResume() {
    const method = active._id ? "PUT" : "POST";
    const path = active._id ? `/resumes/${active._id}` : "/resumes";
    try {
      const saved = await api(path, { method, body: JSON.stringify(active) });
      setNotice("Resume saved.");
      setActive(saved);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteResume(id) {
    try {
      await api(`/resumes/${id}`, { method: "DELETE" });
      setNotice("Resume deleted.");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="dashboard">
      <div className="page-heading">
        <p className="eyebrow">Candidate desk</p>
        <h1>Resume builder and application tracker.</h1>
      </div>
      {notice && <p className="notice">{notice}</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="workspace">
        <aside className="side-panel">
          <button className="full-button" type="button" onClick={() => setActive(createBlankResume(user))}>
            <Plus size={17} /> New resume
          </button>
          {resumes.map((resume) => (
            <button className={active?._id === resume._id ? "list-button active" : "list-button"} key={resume._id} type="button" onClick={() => setActive(resume)}>
              {resume.name}
            </button>
          ))}
        </aside>

        <div className="builder">
          <div className="form-grid">
            <label>
              Resume name
              <input value={active.name} onChange={(event) => update("name", event.target.value)} />
            </label>
            <label>
              Email
              <input value={active.contact?.email || ""} onChange={(event) => updateContact("email", event.target.value)} />
            </label>
            <label>
              Phone
              <input value={active.contact?.phone || ""} onChange={(event) => updateContact("phone", event.target.value)} />
            </label>
            <label>
              Location
              <input value={active.contact?.location || ""} onChange={(event) => updateContact("location", event.target.value)} />
            </label>
          </div>
          <label>
            Professional summary
            <textarea rows="4" value={active.summary || ""} onChange={(event) => update("summary", event.target.value)} />
          </label>

          <div className="inline-form">
            <input placeholder="Add skill" value={skillText} onChange={(event) => setSkillText(event.target.value)} />
            <button type="button" onClick={addSkill}>Add</button>
          </div>
          <div className="tags">
            {active.skills?.map((skill) => <span key={skill}>{skill}</span>)}
          </div>

          <div className="section-actions">
            <button type="button" onClick={() => addItem("experience", { title: "Role title", organization: "Company", description: "" })}>Add experience</button>
            <button type="button" onClick={() => addItem("education", { title: "Degree", organization: "Institute", description: "" })}>Add education</button>
            <button type="button" onClick={() => addItem("projects", { name: "Project", description: "" })}>Add project</button>
          </div>

          <EditableSection
            title="Experience"
            section="experience"
            items={active.experience || []}
            fields={["title", "organization", "location", "startDate", "endDate", "description"]}
            onChange={updateItem}
            onRemove={removeItem}
          />
          <EditableSection
            title="Education"
            section="education"
            items={active.education || []}
            fields={["title", "organization", "location", "startDate", "endDate", "description"]}
            onChange={updateItem}
            onRemove={removeItem}
          />
          <EditableSection
            title="Projects"
            section="projects"
            items={active.projects || []}
            fields={["name", "link", "description"]}
            onChange={updateItem}
            onRemove={removeItem}
          />

          <Preview resume={active} />

          <div className="modal-actions sticky-actions">
            {active._id && (
              <button className="danger-button" type="button" onClick={() => deleteResume(active._id)}>
                <Trash2 size={16} /> Delete
              </button>
            )}
            <button type="button" onClick={saveResume}>
              <Save size={16} /> Save resume
            </button>
          </div>
        </div>

        <aside className="side-panel">
          <h2>Applications</h2>
          {applications.length === 0 && <p className="subtle-note">Your submitted applications will appear here.</p>}
          {applications.map((item) => (
            <div className="application-mini" key={item._id}>
              <strong>{item.job?.title}</strong>
              <span>{item.status}</span>
              <small>{item.resume?.name || "Resume attached"}</small>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}

function labelFromField(field) {
  return field.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase());
}

function EditableSection({ title, section, items, fields, onChange, onRemove }) {
  if (items.length === 0) return null;

  return (
    <div className="resume-edit-section">
      <h2>{title}</h2>
      {items.map((item, index) => (
        <div className="resume-edit-card" key={`${section}-${index}`}>
          <div className="form-grid">
            {fields.map((field) => (
              <label key={field} className={field === "description" ? "wide-field" : ""}>
                {labelFromField(field)}
                {field === "description" ? (
                  <textarea rows="3" value={item[field] || ""} onChange={(event) => onChange(section, index, field, event.target.value)} />
                ) : (
                  <input value={item[field] || ""} onChange={(event) => onChange(section, index, field, event.target.value)} />
                )}
              </label>
            ))}
          </div>
          <button className="secondary-button compact-button" type="button" onClick={() => onRemove(section, index)}>
            Remove {title.toLowerCase()}
          </button>
        </div>
      ))}
    </div>
  );
}

function Preview({ resume }) {
  return (
    <div className="resume-preview">
      <h2>{resume.name}</h2>
      <p>{resume.summary || "Add a concise summary that explains the kind of work you do best."}</p>
      <div className="preview-list">
        <strong>Experience</strong>
        {resume.experience?.map((item, index) => (
          <span key={`${item.title}-${index}`}>{item.title} · {item.organization}</span>
        ))}
      </div>
      <div className="preview-list">
        <strong>Education</strong>
        {resume.education?.map((item, index) => (
          <span key={`${item.title}-${index}`}>{item.title} · {item.organization}</span>
        ))}
      </div>
      <div className="preview-list">
        <strong>Projects</strong>
        {resume.projects?.map((item, index) => (
          <span key={`${item.name}-${index}`}>{item.name}</span>
        ))}
      </div>
    </div>
  );
}
