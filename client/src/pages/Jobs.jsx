import { useEffect, useState } from "react";
import { Briefcase, LogIn, MapPin, Search, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { demoJobs, demoLocations } from "../lib/demoData";

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [answers, setAnswers] = useState({});
  const [locations, setLocations] = useState([]);
  const [notice, setNotice] = useState("");
  const [isFallback, setIsFallback] = useState(false);

  async function loadJobs() {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    const localJobs = demoJobs.filter((job) => {
      const haystack = `${job.title} ${job.company} ${job.location} ${job.skills.join(" ")}`.toLowerCase();
      const matchesQuery = !query || haystack.includes(query.toLowerCase());
      const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
      return matchesQuery && matchesLocation;
    });
    try {
      const data = await api(`/jobs?${params}`);
      setJobs(data.length ? data : localJobs);
      setIsFallback(false);
    } catch {
      setJobs(localJobs);
      setIsFallback(true);
    }
  }

  useEffect(() => {
    loadJobs();
    api("/meta/locations").then((data) => setLocations(data.length ? data : demoLocations)).catch(() => setLocations(demoLocations));
  }, []);

  useEffect(() => {
    if (user?.role === "candidate") {
      api("/resumes").then((data) => {
        setResumes(data);
        setResume(data[0]?._id || "");
      });
    }
  }, [user]);

  async function apply(event) {
    event.preventDefault();
    setNotice("");
    try {
      const questionAnswers = (selectedJob.questions || []).map((item) => ({
        question: item.question,
        answer: answers[item.question] || ""
      }));
      await api("/applications", {
        method: "POST",
        body: JSON.stringify({ job: selectedJob._id, resume, coverLetter, answers: questionAnswers })
      });
      setNotice("Application submitted.");
      setSelectedJob(null);
      setCoverLetter("");
      setAnswers({});
    } catch (error) {
      setNotice(error.message);
    }
  }

  function openApply(job) {
    setSelectedJob(job);
    setAnswers(
      (job.questions || []).reduce((next, item) => {
        next[item.question] = "";
        return next;
      }, {})
    );
  }

  function updateAnswer(question, answer) {
    setAnswers((current) => ({ ...current, [question]: answer }));
  }

  return (
    <section className="page-grid">
      <div className="page-heading">
        <p className="eyebrow">Open roles</p>
        <h1>Browse jobs that respect your time.</h1>
      </div>

      <form className="search-bar" onSubmit={(event) => { event.preventDefault(); loadJobs(); }}>
        <label>
          <Search size={18} />
          <input placeholder="Search title, company, skill" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>
          <MapPin size={18} />
          <input list="locations" placeholder="Location" value={location} onChange={(event) => setLocation(event.target.value)} />
          <datalist id="locations">
            {locations.map((item) => (
              <option value={item} key={item} />
            ))}
          </datalist>
        </label>
        <button type="submit">Search</button>
      </form>

      {isFallback && (
        <p className="subtle-note">Showing sample openings while the API reconnects. Applications require the server to be running.</p>
      )}
      {notice && <p className="notice">{notice}</p>}

      <div className="job-list">
        {jobs.map((job) => (
          <article className="job-card" key={job._id}>
            <div>
              <p className="job-meta">
                <Briefcase size={16} />
                {job.company} · {job.type}
              </p>
              <h2>{job.title}</h2>
              <p>{job.description}</p>
              <div className="tags">
                {job.skills?.slice(0, 5).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>
            <div className="job-side">
              <span>{job.location}</span>
              {job.salary && <strong>{job.salary}</strong>}
              {user?.role === "candidate" && (
                <button type="button" onClick={() => openApply(job)}>
                  <Send size={16} /> Apply
                </button>
              )}
              {!user && (
                <Link className="apply-login-link" to="/login">
                  <LogIn size={16} /> Login to apply
                </Link>
              )}
            </div>
          </article>
        ))}
        {jobs.length === 0 && (
          <div className="empty-state">
            <h2>No matching roles yet</h2>
            <p>Try a broader search or clear the location field.</p>
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={apply}>
            <h2>Apply for {selectedJob.title}</h2>
            <label>
              Resume
              <select required value={resume} onChange={(event) => setResume(event.target.value)}>
                <option value="">Choose resume</option>
                {resumes.map((item) => (
                  <option value={item._id} key={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            {resumes.length === 0 && (
              <p className="subtle-note">Create a resume from your candidate dashboard before submitting this application.</p>
            )}
            <label>
              Cover letter
              <textarea rows="5" value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} />
            </label>
            {selectedJob.questions?.length > 0 && (
              <div className="question-block">
                <h3>Job questions</h3>
                {selectedJob.questions.map((item) => (
                  <label key={item.question}>
                    {item.question}
                    {item.type === "yes-no" ? (
                      <select required={item.required} value={answers[item.question] || ""} onChange={(event) => updateAnswer(item.question, event.target.value)}>
                        <option value="">Choose an answer</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    ) : (
                      <textarea required={item.required} rows="3" value={answers[item.question] || ""} onChange={(event) => updateAnswer(item.question, event.target.value)} />
                    )}
                  </label>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={() => setSelectedJob(null)}>
                Cancel
              </button>
              <button type="submit">Submit application</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
