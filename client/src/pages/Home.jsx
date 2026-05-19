import { ArrowRight, BriefcaseBusiness, ClipboardList, FileText, MapPin, ShieldCheck, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home candidate-home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Careers at HireCraft</p>
          <h1>Build your next chapter with teams that respect your time.</h1>
          <p>
            HireCraft helps candidates discover thoughtful companies, submit strong resumes, answer screening questions,
            and track every application without messy follow-ups.
          </p>
          <div className="hero-actions">
            <Link className="primary-link large" to="/jobs">
              Apply jobs <ArrowRight size={18} />
            </Link>
            <Link className="ghost-link large" to={user?.role === "candidate" ? "/candidate" : "/register"}>
              Build resume
            </Link>
          </div>
        </div>
        <div className="hero-photo-card">
          <img
            src="/images/candidate-hero.jpg"
            alt="Candidates collaborating in a modern workplace"
          />
          <div>
            <strong>Hiring that feels human</strong>
            <span>Roles across Bengaluru, Hyderabad, Pune, Mumbai, Gurgaon, Chennai, and Remote India.</span>
          </div>
        </div>
      </section>

      <section className="company-story">
        <div>
          <p className="eyebrow">About the company</p>
          <h2>We connect people to serious opportunities, not endless forms.</h2>
          <p>
            HireCraft is built for candidates who want clarity. Every job page shows the role, location, skills, and
            screening questions before you apply, so your resume reaches recruiters with the right context.
          </p>
        </div>
        <img
          src="/images/company-team.jpg"
          alt="A hiring team discussing candidates around a table"
        />
      </section>

      <section className="candidate-picture-grid">
        <article>
          <img
            src="/images/office-space.jpg"
            alt="Bright office space for focused work"
          />
          <BriefcaseBusiness />
          <h2>Better job discovery</h2>
          <p>Browse practical roles with clear company, salary, location, and skill details.</p>
        </article>
        <article>
          <img
            src="/images/resume-workshop.jpg"
            alt="People reviewing notes during a hiring workshop"
          />
          <FileText />
          <h2>Resume-first applications</h2>
          <p>Create a structured resume once, then attach it when applying to matching roles.</p>
        </article>
        <article>
          <img
            src="/images/interview.jpg"
            alt="Professional interview conversation in an office"
          />
          <UsersRound />
          <h2>Screening with context</h2>
          <p>Answer recruiter questions up front so your application is easier to review.</p>
        </article>
      </section>

      <section className="feature-band">
        <article>
          <ShieldCheck />
          <h2>Secure profile</h2>
          <p>Your candidate dashboard and resume builder stay separate from recruiter tools.</p>
        </article>
        <article>
          <ClipboardList />
          <h2>Track applications</h2>
          <p>See the jobs you applied for and the status of each submission.</p>
        </article>
        <article>
          <MapPin />
          <h2>India-ready locations</h2>
          <p>Search roles across major hiring cities and remote opportunities.</p>
        </article>
      </section>

      <section className="apply-banner">
        <div>
          <p className="eyebrow">Ready to apply?</p>
          <h2>Find a role, attach your resume, and answer the screening questions in one flow.</h2>
        </div>
        <Link className="primary-link large" to="/jobs">
          Apply jobs <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
