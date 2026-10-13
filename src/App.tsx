import { useEffect, useState, lazy, Suspense } from "react";
import type { FormEvent } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Menu as MenuIcon,
  X,
  Flame,
  Check,
  MapPin,
} from "lucide-react";
import {
  categories,
  money,
  offsetDate,
  prettyDate,
  seatsLeft,
  today,
  uid,
} from "./data";
import { useDemo } from "./store";
const Admin = lazy(() => import('./Admin'));
function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Ember and Olive home">
      <Flame size={27} strokeWidth={1.2} />
      <span>
        ember <i>&</i> olive<small>MEDITERRANEAN TABLE</small>
      </span>
    </Link>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
    const page = location.pathname.split("/")[1];
    document.title = `${page ? `${page[0].toUpperCase() + page.slice(1)} · ` : ""}Ember & Olive — Restaurant portfolio concept`;
  }, [location.pathname]);
  return (
    <>
      <div className="demo-strip">
        A fictional restaurant. A real working demo.{" "}
        <Link to="/admin">
          Explore the management studio <ArrowUpRight size={12} />
        </Link>
      </div>
      <header className="header">
        <Brand />
        <button
          className="mobile-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <MenuIcon />}
        </button>
        <nav className={open ? "open" : ""} aria-label="Main navigation">
          <NavLink to="/menu">Our menu</NavLink>
          <NavLink to="/about">Our story</NavLink>
          <NavLink to="/contact">Find us</NavLink>
          <Link className="button small" to="/reservations">
            A table for you <ArrowUpRight size={16} />
          </Link>
        </nav>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer>
      <div className="footer-top">
        <div>
          <Brand />
          <p>
            Inspired by the Mediterranean.
            <br />
            Imagined for Philadelphia.
          </p>
        </div>
        <div>
          <span className="eyebrow">AT OUR TABLE</span>
          <Link to="/menu">Our menu</Link>
          <Link to="/about">Our story</Link>
          <Link to="/reservations">Demo reservations</Link>
        </div>
        <div>
          <span className="eyebrow">WHEN WE GATHER</span>
          <p>
            Tuesday–Thursday · 5–9 pm
            <br />
            Friday–Saturday · 5–10 pm
            <br />
            Sunday · 5–9 pm
            <br />
            Monday · Rest & recharge
          </p>
        </div>
        <div>
          <span className="eyebrow">BEHIND THE SCENES</span>
          <Link to="/admin">Management studio ↗</Link>
          <p>
            Fictional portfolio concept.
            <br />
            No real bookings or messages.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Ember & Olive · Portfolio demonstration
        </span>
        <span>Made for good food. Built for better business.</span>
      </div>
    </footer>
  );
}
function Home() {
  return (
    <>
      <section className="hero">
        <img
          className="hero-photo"
          width="1800" height="1200"
          src="/images/interior-1600.webp"
          srcSet="/images/interior-800.webp 800w, /images/interior-1600.webp 1600w"
          sizes="100vw"
          alt="Warmly lit dining room with carefully set tables"
          fetchPriority="high"
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="eyebrow">FIRE, SEASON & A SENSE OF PLACE</span>
          <h1>
            A little fire.
            <br />A lot of <em>soul.</em>
          </h1>
          <p>
            Bright flavors. Slow evenings. A Mediterranean
            <br className="desktop" /> table worth gathering around.
          </p>
          <Link className="button cream" to="/reservations">
            Pull up a chair <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="hero-foot">
          <span>PHILADELPHIA, IN SPIRIT</span>
          <span>A FICTIONAL RESTAURANT CONCEPT</span>
          <a href="#welcome" aria-label="Explore the restaurant">
            SCROLL TO SAVOR ↓
          </a>
        </div>
        <div className="hero-stamp">
          from the
          <br />
          <i>heart</i>
          <br />
          to the table
        </div>
      </section>
      <section id="welcome" className="intro section">
        <div>
          <span className="eyebrow">01 / A WARM WELCOME</span>
          <h2>
            Some things are
            <br />
            better <em>shared.</em>
          </h2>
        </div>
        <div className="intro-text">
          <p className="lead">
            Bread passed across the table. The first sip of something lovely.
            Conversations that forget the time.
          </p>
          <p>
            Ember & Olive is our imagined love letter to the Mediterranean —
            where seasonal ingredients meet an open flame, and a good meal
            becomes a beautiful evening.
          </p>
          <Link className="text-link" to="/about">
            A little more about us <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="seasonal section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">02 / FROM THE KITCHEN</span>
            <h2>
              In good <em>season.</em>
            </h2>
          </div>
          <Link className="text-link" to="/menu">
            Explore the full menu <ArrowUpRight size={18} />
          </Link>
        </div>
        <Featured />
      </section>
      <section className="atmosphere">
        <img
          src="/images/interior.jpg"
          alt="Candlelit restaurant interior"
          loading="lazy"
        />
        <div>
          <span className="eyebrow">03 / STAY A LITTLE LONGER</span>
          <h2>
            For the evenings
            <br />
            you don’t want
            <br />
            to <em>end.</em>
          </h2>
          <p>
            Warm light, natural textures, and the gentle hum of a room full of
            stories. An imagined neighborhood hideaway with a faraway soul.
          </p>
          <Link className="text-link" to="/about">
            Step inside <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="table-cta section">
        <span className="eyebrow">THERE’S A PLACE FOR YOU HERE</span>
        <h2>
          Good company.
          <br />
          <em>Great things to come.</em>
        </h2>
        <Link className="button" to="/reservations">
          Try a demo reservation <ArrowUpRight size={18} />
        </Link>
        <p>Explore the experience. No real reservation will be made.</p>
      </section>
      <section className="visit section">
        <div>
          <span className="eyebrow">OUR IMAGINED CORNER OF THE CITY</span>
          <h2>
            Meet us at
            <br />
            <em>the table.</em>
          </h2>
          <p>
            123 Olive Lane, Philadelphia, PA
            <br />
            <strong>Fictional address · no operating restaurant</strong>
          </p>
          <Link className="text-link" to="/contact">
            Hours & contact <ArrowRight size={17} />
          </Link>
        </div>
        <div className="hours">
          <span>DINNER, UNHURRIED</span>
          <p>
            Tuesday–Thursday <b>5–9 pm</b>
          </p>
          <p>
            Friday–Saturday <b>5–10 pm</b>
          </p>
          <p>
            Sunday <b>5–9 pm</b>
          </p>
          <p>
            Monday <b>Closed</b>
          </p>
        </div>
      </section>
    </>
  );
}
function Featured() {
  const { data } = useDemo();
  return (
    <div className="dish-feature-grid">
      {data.dishes
        .filter((d) => d.available && ["d1", "d5", "d7"].includes(d.id))
        .slice(0, 3)
        .map((d, i) => (
          <Link to="/menu" key={d.id} className="dish-feature">
            <div className="image-wrap">
              <img
                src={d.image}
                alt={`Food photography illustrating ${d.name}`}
                loading="lazy"
              />
              <span>0{i + 1}</span>
            </div>
            <div className="dish-title">
              <h3>{d.name}</h3>
              <span>{money(d.price)}</span>
            </div>
            <p>{d.description}</p>
          </Link>
        ))}
    </div>
  );
}
function PageIntro({
  tag,
  title,
  em,
  description,
}: {
  tag: string;
  title: string;
  em: string;
  description: string;
}) {
  return (
    <div className="page-intro section">
      <span className="eyebrow">{tag}</span>
      <h1>
        {title} <em>{em}</em>
      </h1>
      <p>{description}</p>
    </div>
  );
}
function PublicMenu() {
  const { data } = useDemo();
  const [category, setCategory] = useState("All");
  const [diet, setDiet] = useState("All");
  return (
    <>
      <PageIntro
        tag="SEASONAL, SOULFUL, MADE TO SHARE"
        title="A taste of"
        em="the Mediterranean."
        description="From the first warm bite to the last sweet spoonful. Take your time."
      />
      <div className="menu-layout section">
        <aside>
          <span className="eyebrow">AT THE TABLE</span>
          <div className="category-nav">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                aria-pressed={category === c}
                className={category === c ? "selected" : ""}
                onClick={() => setCategory(c)}
              >
                {c === "All" ? "The full menu" : c}
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
          <label>
            Dietary preference
            <select value={diet} onChange={(e) => setDiet(e.target.value)}>
              {["All", "Vegetarian", "Vegan", "Gluten-free"].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
          <p className="fineprint">
            Demo prices in USD. Dietary labels are illustrative. A real
            restaurant must verify ingredients and cross-contact risks.
          </p>
        </aside>
        <div>
          {categories
            .filter((c) => category === "All" || category === c)
            .map((c) => (
              <section className="menu-category" key={c}>
                <div className="menu-category-heading">
                  <h2>{c}</h2>
                  <span>
                    {c === "Starters"
                      ? "A lovely place to begin"
                      : c === "Mains"
                        ? "From the heart of the kitchen"
                        : c === "Seafood"
                          ? "A little taste of the coast"
                          : c === "Desserts"
                            ? "Something sweet, always"
                            : "Sip & settle in"}
                  </span>
                </div>
                {data.dishes
                  .filter(
                    (d) =>
                      d.category === c &&
                      d.available &&
                      (diet === "All" || d.dietary.includes(diet)),
                  )
                  .map((d) => (
                    <article className="menu-dish" key={d.id}>
                      <img
                        src={d.image}
                        alt={`Illustrative food photograph for ${d.name}`}
                        loading="lazy"
                      />
                      <div>
                        <div className="dish-title">
                          <h3>{d.name}</h3>
                          <span>{money(d.price)}</span>
                        </div>
                        <p>{d.description}</p>
                        <div className="tags">
                          {d.dietary.map((t) => (
                            <span key={t}>{t}</span>
                          ))}
                        </div>
                        <small>
                          Allergens: {d.allergens || "None declared"}
                        </small>
                      </div>
                    </article>
                  ))}
                {!data.dishes.some(
                  (d) =>
                    d.category === c &&
                    d.available &&
                    (diet === "All" || d.dietary.includes(diet)),
                ) && (
                  <p className="empty">
                    No dishes match this preference in {c.toLowerCase()}.
                  </p>
                )}
              </section>
            ))}
          <p className="fineprint">
            Food photographs illustrate the concept and are not photographs of
            these fictional recipes.
          </p>
        </div>
      </div>
    </>
  );
}
function About() {
  return (
    <>
      <PageIntro
        tag="OUR STORY · AN IMAGINED PLACE"
        title="Rooted in warmth."
        em="Made for connection."
        description="A fictional restaurant with a very real philosophy: the best things in life happen around a table."
      />
      <div className="about-photo">
        <img
          src="/images/interior.jpg"
          alt="Dining room concept with warm light and natural textures"
        />
      </div>
      <section className="intro section">
        <div>
          <span className="eyebrow">THE IDEA BEHIND THE TABLE</span>
          <h2>
            Many shores.
            <br />
            <em>One table.</em>
          </h2>
        </div>
        <div className="intro-text">
          <p className="lead">
            Inspired by coastal kitchens, neighborhood markets, and the
            generosity of Mediterranean hospitality.
          </p>
          <p>
            Our imagined kitchen brings together olive oil, herbs, seasonal
            produce, and the quiet magic of cooking over fire. Plates are
            thoughtful, flavors are generous, and there is always room for one
            more.
          </p>
          <p>
            Ember & Olive was created as a digital agency portfolio concept. The
            restaurant, team, menu, and operational data are fictional. It
            demonstrates how a beautiful customer experience can connect to
            practical business software.
          </p>
          <Link className="text-link" to="/admin">
            See what’s behind the experience <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="gallery section">
        <img
          src="/images/plate.jpg"
          alt="Mediterranean-inspired food presentation"
          loading="lazy"
        />
        <img
          src="/images/salad.jpg"
          alt="Colorful seasonal ingredients"
          loading="lazy"
        />
        <img
          src="/images/interior.jpg"
          alt="Interior inspiration for the fictional restaurant"
          loading="lazy"
        />
      </section>
    </>
  );
}
function Reservations() {
  const { data, update } = useDemo();
  const [date, setDate] = useState(offsetDate(1));
  const [party, setParty] = useState(2);
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const available = data.slots.filter(
    (s) => s.enabled && seatsLeft(data, date, s.time) >= party,
  );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (!time || seatsLeft(data, date, time) < party) {
      setError("Choose an available time for your party.");
      return;
    }
    if (
      date < today() ||
      date > offsetDate(60) ||
      new Date(date + "T12:00:00").getDay() === 1
    ) {
      setError(
        "Choose an open date within the next 60 days. Mondays are closed.",
      );
      return;
    }
    const name = String(f.get("name")).trim();
    const email = String(f.get("email")).trim();
    if (!name || !email.endsWith("@example.com")) {
      setError("Use a fictional name and an @example.com email address.");
      return;
    }
    const id = uid();
    const stored = await update(
      (d) => ({
        ...d,
        reservations: [
          ...d.reservations,
          {
            id,
            name,
            email,
            date,
            time,
            party,
            status: "Requested",
            notes: String(f.get("notes")).trim(),
          },
        ],
      }),
      `Demo reservation requested · ${name} · ${prettyDate(date)} ${time}`,
    );
    if(!stored){setError('This request was not saved. Review the browser-data warning and try again.');return;}
    setConfirmed(id);
    setError("");
  }
  return (
    <>
      <PageIntro
        tag="YOUR EVENING STARTS HERE"
        title="A table for"
        em="you."
        description="Choose a date, bring your favorite people, and explore our reservation experience."
      />
      <div className="booking section">
        <aside>
          <img src="/images/interior.jpg" alt="A table set for dinner" />
          <h2>
            Come for the food.
            <br />
            <em>Stay for the feeling.</em>
          </h2>
          <p>
            Parties of 1–8 · Dinner from 5 pm
            <br />
            Tuesday–Sunday · Up to 60 days ahead
          </p>
          <div className="notice">
            <strong>Demo mode — no real bookings.</strong>
            <p>
              Use fictional details and an @example.com address. Your request
              stays in this browser. No email is sent.
            </p>
          </div>
        </aside>
        {confirmed ? (
          <div className="confirmation" role="status">
            <Check size={40} />
            <span className="eyebrow">DEMO REQUEST RECEIVED</span>
            <h2>
              Your table
              <br />
              is <em>in the diary.</em>
            </h2>
            <p>
              {prettyDate(date)} · {time} · {party} guests
            </p>
            <p>Reference {confirmed.slice(0, 8).toUpperCase()}</p>
            <p>
              This fictional request can now be reviewed in the management
              studio. It does not reserve a real table.
            </p>
            <Link className="button" to="/admin/reservations">
              View demo request <ArrowUpRight size={18} />
            </Link>
            <button
              className="text-link"
              onClick={() => {
                setConfirmed("");
                setTime("");
              }}
            >
              Make another demo request
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="reservation-form">
            <h3>Let’s make an evening of it.</h3>
            <div className="form-row">
              <label>
                Date
                <input
                  type="date"
                  required
                  min={today()}
                  max={offsetDate(60)}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTime("");
                  }}
                />
              </label>
              <label>
                Guests
                <select
                  value={party}
                  onChange={(e) => {
                    setParty(Number(e.target.value));
                    setTime("");
                  }}
                >
                  {Array.from({ length: 8 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} {i ? "guests" : "guest"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <fieldset>
              <legend>Choose your time</legend>
              <div className="time-slots">
                {new Date(date + "T12:00:00").getDay() === 1 ? (
                  <p>We rest on Mondays. Choose Tuesday–Sunday.</p>
                ) : available.length ? (
                  available.map((s) => (
                    <button
                      type="button"
                      key={s.time}
                      className={time === s.time ? "selected" : ""}
                      aria-pressed={time === s.time}
                      onClick={() => {
                        setTime(s.time);
                        setError("");
                      }}
                    >
                      {s.time}
                    </button>
                  ))
                ) : (
                  <p>
                    No slots available for this party. Try another date or party
                    size.
                  </p>
                )}
              </div>
            </fieldset>
            <label>
              Fictional guest name
              <input
                name="name"
                required
                maxLength={80}
                placeholder="e.g. Avery Demo"
              />
            </label>
            <label>
              Demo email
              <input
                type="email"
                name="email"
                required
                pattern="[^@\s]+@example\.com"
                placeholder="avery@example.com"
              />
              <small>
                Use @example.com only. No confirmation email is sent.
              </small>
            </label>
            <label>
              Anything we should know?
              <textarea
                name="notes"
                maxLength={500}
                placeholder="Fictional preferences only. Avoid personal or medical information."
              />
            </label>
            <label className="check-label">
              <input type="checkbox" required />I understand this is a fictional
              demo reservation.
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="button" type="submit">
              Request demo table <ArrowUpRight size={18} />
            </button>
          </form>
        )}
      </div>
    </>
  );
}
function Contact() {
  const { update } = useDemo();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim(),
      email = String(f.get("email")).trim(),
      message = String(f.get("message")).trim();
    if (!name || !message || !email.endsWith("@example.com")) {
      setError(
        "Enter fictional details, a message, and an @example.com email.",
      );
      return;
    }
    update(
      (d) => ({
        ...d,
        messages: [{ id: uid(), name, email, message }, ...d.messages],
      }),
      "Demo contact message saved locally",
    );
    setSent(true);
  }
  return (
    <>
      <PageIntro
        tag="A LITTLE CLOSER"
        title="Find your"
        em="way here."
        description="Our fictional corner of Philadelphia. A warm welcome, wherever you’re browsing from."
      />
      <div className="contact-layout section">
        <div>
          <h2>
            In the neighborhood.
            <br />
            <em>In our imagination.</em>
          </h2>
          <p>
            <MapPin size={18} /> 123 Olive Lane, Philadelphia, PA
            <br />
            <strong>Fictional address · not a real restaurant location</strong>
          </p>
          <p>
            hello@emberandolive.example
            <br />
            Fictional contact · no inbox monitored
          </p>
          <div
            className="concept-map"
            role="img"
            aria-label="Decorative neighborhood map, fictional location, not for navigation"
          >
            <div className="map-marker">
              <MapPin />
              <span>
                Ember & Olive<small>CONCEPT LOCATION</small>
              </span>
            </div>
            <span className="map-label">
              ILLUSTRATIVE MAP · NOT FOR DIRECTIONS
            </span>
          </div>
          <div className="hours">
            <p>
              Tuesday–Thursday & Sunday <b>5–9 pm</b>
            </p>
            <p>
              Friday–Saturday <b>5–10 pm</b>
            </p>
            <p>
              Monday <b>Closed</b>
            </p>
          </div>
        </div>
        <div className="contact-form">
          <h3>A note for the table.</h3>
          <p>
            Demo messages stay in your browser and appear in the management
            studio. Please use fictional details.
          </p>
          {sent ? (
            <div className="notice" role="status">
              <Check />
              <h3>Your demo note is saved.</h3>
              <p>
                No message has been sent. You can review it in the studio
                overview.
              </p>
              <button className="text-link" onClick={() => setSent(false)}>
                Write another demo note
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label>
                Fictional name
                <input name="name" required maxLength={80} />
              </label>
              <label>
                Demo email
                <input
                  name="email"
                  type="email"
                  required
                  pattern="[^@\s]+@example\.com"
                  placeholder="hello@example.com"
                />
              </label>
              <label>
                Your fictional message
                <textarea name="message" required maxLength={1000} />
              </label>
              {error && (
                <p role="alert" className="error">
                  {error}
                </p>
              )}
              <button className="button">
                Save demo message <ArrowUpRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
export default function App() {
  const location = useLocation();
  const { storageError, exportRecovery } = useDemo();
  const admin = location.pathname.startsWith("/admin");
  return (
    <>
      {storageError && (
        <div className="storage-alert" role="alert">
          {storageError}
          <button className="button small" onClick={exportRecovery}>Download saved data</button>
        </div>
      )}
      {admin ? (
        <Suspense fallback={<p role="status">Loading demo workspace…</p>}><Admin /></Suspense>
      ) : (
        <>
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          <main id="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<PublicMenu />} />
              <Route path="/about" element={<About />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="*"
                element={
                  <div className="section">
                    <h1>A little lost?</h1>
                    <p>That page isn’t on our menu.</p>
                    <Link className="button" to="/">
                      Back to our table
                    </Link>
                  </div>
                }
              />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
