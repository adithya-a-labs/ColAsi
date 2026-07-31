import { useMemo, useState } from 'react';
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  Library,
  Plus,
  Settings2,
} from 'lucide-react';

type Course = {
  id: string;
  name: string;
  code: string;
  conducted: number;
  attended: number;
  required: number;
  color: string;
};

type Session = {
  id: string;
  courseId: string;
  day: string;
  time: string;
  room: string;
};

type Deadline = {
  id: string;
  title: string;
  course: string;
  date: string;
  kind: string;
};

const initialCourses: Course[] = [
  { id: 'eem', name: 'Engineering Electromagnetics', code: 'EC2103', conducted: 18, attended: 16, required: 75, color: '#ECC875' },
  { id: 'hdl', name: 'Hardware Modelling using HDL', code: 'EC2192', conducted: 12, attended: 11, required: 80, color: '#8FC7A5' },
  { id: 'ecn', name: 'Electric Circuits & Networks', code: 'EC2101', conducted: 20, attended: 17, required: 75, color: '#D89C8C' },
];

const sessions: Session[] = [
  { id: '1', courseId: 'eem', day: 'Today', time: '09:00', room: 'A-204' },
  { id: '2', courseId: 'hdl', day: 'Today', time: '11:00', room: 'Digital Lab' },
  { id: '3', courseId: 'ecn', day: 'Tomorrow', time: '10:00', room: 'A-108' },
];

const deadlines: Deadline[] = [
  { id: '1', title: 'Transmission-line assignment', course: 'Engineering Electromagnetics', date: '3 Aug', kind: 'Assignment' },
  { id: '2', title: 'Verilog counter simulation', course: 'Hardware Modelling using HDL', date: '5 Aug', kind: 'Lab' },
  { id: '3', title: 'Network theorems quiz', course: 'Electric Circuits & Networks', date: '8 Aug', kind: 'Quiz' },
];

const navItems = [
  ['Overview', LayoutDashboard],
  ['Courses', GraduationCap],
  ['Timetable', Clock3],
  ['Syllabus', BookOpen],
  ['Deadlines', CalendarDays],
  ['Knowledge Vault', Library],
] as const;

function getAttendance(course: Course) {
  return course.conducted === 0 ? 100 : Math.round((course.attended / course.conducted) * 100);
}

function safeBunks(course: Course) {
  let bunks = 0;
  while (((course.attended / (course.conducted + bunks + 1)) * 100) >= course.required) bunks += 1;
  return bunks;
}

function recoveryClasses(course: Course) {
  if (getAttendance(course) >= course.required) return 0;
  let classes = 0;
  while ((((course.attended + classes) / (course.conducted + classes)) * 100) < course.required) classes += 1;
  return classes;
}

export default function App() {
  const [active, setActive] = useState('Overview');
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('colasi-web-courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const overall = useMemo(() => {
    const conducted = courses.reduce((sum, c) => sum + c.conducted, 0);
    const attended = courses.reduce((sum, c) => sum + c.attended, 0);
    return conducted ? Math.round((attended / conducted) * 100) : 100;
  }, [courses]);

  const updateCourse = (id: string, status: 'attended' | 'bunked') => {
    const next = courses.map((course) =>
      course.id === id
        ? {
            ...course,
            conducted: course.conducted + 1,
            attended: course.attended + (status === 'attended' ? 1 : 0),
          }
        : course,
    );
    setCourses(next);
    localStorage.setItem('colasi-web-courses', JSON.stringify(next));
  };

  const currentCourse = (id: string) => courses.find((course) => course.id === id);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div>
            <strong>ColAsi</strong>
            <span>Academic OS</span>
          </div>
        </div>

        <nav>
          {navItems.map(([label, Icon]) => (
            <button className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => setActive(label)} key={label}>
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item"><Settings2 size={18} /><span>Settings</span></button>
          <div className="profile"><div>AA</div><span><strong>Adithya</strong><small>Monsoon 2026</small></span></div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p>Friday, 31 July</p>
            <h1>{active}</h1>
          </div>
          <button className="primary"><Plus size={17} /> Quick add</button>
        </header>

        <section className="hero-grid">
          <article className="hero-card">
            <div>
              <span className="eyebrow">Semester pulse</span>
              <h2>You are on track.</h2>
              <p>Attendance is healthy across your current courses. HDL needs the closest watch.</p>
            </div>
            <div className="overall-ring" style={{ '--value': `${overall * 3.6}deg` } as React.CSSProperties}>
              <div><strong>{overall}%</strong><span>overall</span></div>
            </div>
          </article>

          <article className="metric-card"><CheckCircle2 /><span><small>Safe courses</small><strong>{courses.filter((c) => getAttendance(c) >= c.required).length}/{courses.length}</strong></span></article>
          <article className="metric-card"><CircleAlert /><span><small>Upcoming items</small><strong>{deadlines.length}</strong></span></article>
        </section>

        <section className="content-grid">
          <div className="panel courses-panel">
            <div className="panel-heading"><div><span className="eyebrow">Attendance engine</span><h3>Your courses</h3></div><button>View all</button></div>
            <div className="course-list">
              {courses.map((course) => {
                const pct = getAttendance(course);
                const safe = pct >= course.required;
                return (
                  <article className="course-card" key={course.id}>
                    <div className="course-accent" style={{ background: course.color }} />
                    <div className="course-main">
                      <div className="course-title"><div><strong>{course.name}</strong><span>{course.code} · Required {course.required}%</span></div><b className={safe ? 'status safe' : 'status danger'}>{safe ? 'Safe' : 'Recover'}</b></div>
                      <div className="course-stats">
                        <div><strong>{pct}%</strong><span>attendance</span></div>
                        <div><strong>{course.attended}/{course.conducted}</strong><span>classes</span></div>
                        <div><strong>{safe ? safeBunks(course) : recoveryClasses(course)}</strong><span>{safe ? 'safe bunks' : 'to recover'}</span></div>
                        <div className="session-actions"><button onClick={() => updateCourse(course.id, 'attended')}>Attend</button><button onClick={() => updateCourse(course.id, 'bunked')}>Bunk</button></div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="side-stack">
            <section className="panel">
              <div className="panel-heading"><div><span className="eyebrow">Today</span><h3>Classes</h3></div><button>Timetable</button></div>
              <div className="timeline">
                {sessions.map((session) => {
                  const course = currentCourse(session.courseId);
                  return <div className="timeline-item" key={session.id}><time>{session.time}</time><i style={{ background: course?.color }} /><div><strong>{course?.code}</strong><span>{course?.name}</span><small>{session.day} · {session.room}</small></div></div>;
                })}
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading"><div><span className="eyebrow">Coming up</span><h3>Deadlines</h3></div><button>Calendar</button></div>
              <div className="deadline-list">
                {deadlines.map((item) => <article key={item.id}><div className="date-chip">{item.date}</div><div><strong>{item.title}</strong><span>{item.course}</span></div><b>{item.kind}</b></article>)}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
