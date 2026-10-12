import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  Users,
  ClipboardCheck,
  ArrowUpRight,
  Plus,
  RotateCcw,
  Flame,
  X,
  Check,
  Clock,
  Search,
} from "lucide-react";
import {
  categories,
  imageOptions,
  money,
  prettyDate,
  seatsLeft,
  shiftError,
  today,
  uid,
} from "./data";
import type { Dish, Reservation, Shift } from "./data";
import { useDemo } from "./store";
const nav = [
  ["/admin", "Overview", LayoutDashboard],
  ["/admin/menu", "Menu studio", UtensilsCrossed],
  ["/admin/reservations", "Reservations", CalendarDays],
  ["/admin/staff", "Staff & shifts", Users],
  ["/admin/operations", "Daily operations", ClipboardCheck],
] as const;
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-heading">
        <h2>{title}</h2>
        <button
          className="icon-button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      {children}
    </dialog>
  );
}
export default function Admin() {
  const { reset } = useDemo();
  const [resetOpen, setResetOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Management studio · Ember & Olive · Demo";
  }, [location.pathname]);
  return (
    <div className="admin">
      <a className="skip-link" href="#admin-main">
        Skip to dashboard content
      </a>
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <Flame strokeWidth={1.3} />
          <span>
            ember <i>&</i> olive<small>MANAGEMENT STUDIO</small>
          </span>
        </Link>
        <span className="sidebar-caption">YOUR RESTAURANT, IN RHYTHM</span>
        <nav aria-label="Management navigation">
          {nav.map(([href, label, Icon]) => (
            <NavLink key={href} end={href === "/admin"} to={href}>
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="demo-pill">
            <span /> INTERACTIVE DEMO
          </div>
          <p>
            Fictional data. Changes stay in this browser. No login or shared
            business records.
          </p>
          <Link to="/">
            View restaurant <ArrowUpRight size={15} />
          </Link>
          <button onClick={() => setResetOpen(true)}>
            <RotateCcw size={15} /> Reset demo
          </button>
        </div>
      </aside>
      <div className="admin-body">
        <header className="admin-topbar">
          <span>THE GOOD SERVICE STARTS HERE</span>
          <div>
            <span className="status-dot" /> LOCAL DEMO{" "}
            <span className="avatar">EO</span>
          </div>
        </header>
        <div className="admin-demo-notice">
          Portfolio concept · Sample metrics & fictional team · Use fictional
          guest details only
        </div>
        {notice && (
          <p className="toast" role="status">
            {notice}
            <button
              aria-label="Dismiss notification"
              onClick={() => setNotice("")}
            >
              <X size={14} />
            </button>
          </p>
        )}
        <main id="admin-main">
          <Routes>
            <Route path="/admin" element={<Overview />} />
            <Route path="/admin/menu" element={<MenuStudio />} />
            <Route path="/admin/reservations" element={<ReservationStudio />} />
            <Route path="/admin/staff" element={<StaffStudio />} />
            <Route path="/admin/operations" element={<Operations />} />
            <Route
              path="*"
              element={
                <div className="admin-content">
                  <h1>Page not found</h1>
                  <Link to="/admin">Back to overview</Link>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
      {resetOpen && (
        <Modal title="A fresh start?" onClose={() => setResetOpen(false)}>
          <p>
            Reset all local demo menus, reservations, shifts, tasks and messages
            to the fictional sample data. This affects only this browser.
          </p>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setResetOpen(false)}
            >
              Keep my changes
            </button>
            <button
              className="button"
              onClick={() => {
                reset();
                setResetOpen(false);
                setNotice("Demo reset to fictional sample data.");
              }}
            >
              Reset demo data
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
function Heading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
function Overview() {
  const { data, update } = useDemo();
  const reservations = data.reservations.filter(
    (r) => r.date === today() && r.status !== "Cancelled",
  );
  const guests = reservations.reduce((n, r) => n + r.party, 0);
  const tasks = data.tasks.filter((t) => t.done).length;
  return (
    <div className="admin-content">
      <Heading
        eyebrow={prettyDate(today()).toUpperCase()}
        title="A good evening begins here."
        description="A little preparation. A lot of hospitality. Your fictional service at a glance."
        action={
          <Link className="button small" to="/admin/reservations">
            View service <ArrowUpRight size={16} />
          </Link>
        }
      />
      <div className="stats">
        <div>
          <CalendarDays />
          <span>Today’s reservations</span>
          <strong>{reservations.length.toString().padStart(2, "0")}</strong>
          <small>
            {reservations.filter((r) => r.status === "Requested").length}{" "}
            awaiting confirmation
          </small>
        </div>
        <div>
          <Users />
          <span>Expected guests</span>
          <strong>{guests.toString().padStart(2, "0")}</strong>
          <small>From local demo reservations</small>
        </div>
        <div>
          <Clock />
          <span>Team on shift</span>
          <strong>
            {data.shifts
              .filter((s) => s.date === today())
              .length.toString()
              .padStart(2, "0")}
          </strong>
          <small>Fictional staff schedule</small>
        </div>
        <div>
          <ClipboardCheck />
          <span>Service preparation</span>
          <strong>
            {tasks}
            <i>/{data.tasks.length}</i>
          </strong>
          <small>Checklist tasks complete</small>
        </div>
      </div>
      <div className="overview-grid">
        <section className="panel">
          <div className="panel-title">
            <h2>Tonight at the table</h2>
            <Link to="/admin/reservations">All reservations ↗</Link>
          </div>
          <ReservationTable reservations={reservations.slice(0, 5)} />
        </section>
        <section className="panel service-prep">
          <div className="panel-title">
            <h2>Before the first guest</h2>
            <ClipboardCheck size={18} />
          </div>
          <p>A few small things make a big difference.</p>
          {data.tasks.slice(0, 4).map((t) => (
            <label className="task-mini" key={t.id}>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() =>
                  update(
                    (d) => ({
                      ...d,
                      tasks: d.tasks.map((x) =>
                        x.id === t.id ? { ...x, done: !x.done } : x,
                      ),
                    }),
                    `Checklist updated · ${t.name}`,
                  )
                }
              />
              <span>
                {t.name}
                <small>{data.staff.find((s) => s.id === t.owner)?.name}</small>
              </span>
            </label>
          ))}
          <Link className="text-link" to="/admin/operations">
            Open daily operations <ArrowUpRight size={16} />
          </Link>
        </section>
        <section className="panel">
          <div className="panel-title">
            <h2>Kitchen favorites</h2>
            <span className="sample-label">ILLUSTRATIVE ORDERS</span>
          </div>
          <p className="panel-subtitle">Sample popularity · not actual sales</p>
          <div
            className="bar-chart"
            role="img"
            aria-label="Illustrative orders: whipped feta 42, sea bass 34, braised lamb 28, olive oil cake 21"
          >
            {[
              ["Whipped feta", 42],
              ["Sea bass", 34],
              ["Braised lamb", 28],
              ["Olive oil cake", 21],
            ].map(([name, n]) => (
              <div key={name}>
                <span>{name}</span>
                <div className="bar-track">
                  <div style={{ width: `${(Number(n) / 42) * 100}%` }} />
                </div>
                <b>{n}</b>
              </div>
            ))}
          </div>
          <div className="status-breakdown">
            <span>Local reservation statuses</span>
            {["Requested", "Confirmed", "Seated", "Completed", "Cancelled"].map(
              (s) => (
                <small key={s}>
                  {s}{" "}
                  <b>
                    {data.reservations.filter((r) => r.status === s).length}
                  </b>
                </small>
              ),
            )}
          </div>
        </section>
        <section className="panel">
          <div className="panel-title">
            <h2>The team tonight</h2>
            <Link to="/admin/staff">Schedule ↗</Link>
          </div>
          {data.shifts
            .filter((s) => s.date === today())
            .map((shift) => {
              const staff = data.staff.find((s) => s.id === shift.staffId);
              return (
                <div className="staff-summary" key={shift.id}>
                  <span className="avatar">
                    {staff?.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </span>
                  <div>
                    <strong>{staff?.name}</strong>
                    <small>{staff?.role}</small>
                  </div>
                  <span>
                    {shift.start}–{shift.end}
                  </span>
                </div>
              );
            })}
          {!data.shifts.some((s) => s.date === today()) && (
            <p>No shifts assigned today.</p>
          )}
        </section>
        <section className="panel">
          <div className="panel-title">
            <h2>Recent activity</h2>
            <span className="sample-label">LOCAL SESSION</span>
          </div>
          {data.activity.slice(0, 5).map((a, i) => (
            <p className="activity" key={`${a}-${i}`}>
              <span />
              {a}
            </p>
          ))}
        </section>
        <section className="panel">
          <div className="panel-title">
            <h2>Notes from the table</h2>
            <span className="sample-label">DEMO INBOX</span>
          </div>
          {data.messages.length ? (
            data.messages.slice(0, 5).map((m) => (
              <div className="message" key={m.id}>
                <strong>{m.name}</strong>
                <small>{m.email}</small>
                <p>{m.message}</p>
              </div>
            ))
          ) : (
            <p className="empty">
              No demo messages yet. Try the public contact form.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
function ReservationTable({
  reservations,
  actions,
}: {
  reservations: Reservation[];
  actions?: (r: Reservation) => ReactNode;
}) {
  return (
    <div
      className="table-scroll"
      tabIndex={0}
      role="region"
      aria-label="Scrollable restaurant records"
    >
      <table>
        <thead>
          <tr>
            <th>Guest</th>
            <th>Date / time</th>
            <th>Party</th>
            <th>Status</th>
            {actions && <th>Manage</th>}
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>
                <strong>{r.name}</strong>
                <small>{r.email}</small>
                {r.notes && <small className="guest-note">{r.notes}</small>}
              </td>
              <td>
                {prettyDate(r.date)}
                <small>{r.time}</small>
              </td>
              <td>{r.party} guests</td>
              <td>
                <span className={`badge ${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </td>
              {actions && <td>{actions(r)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {!reservations.length && (
        <p className="empty">No reservations match this view.</p>
      )}
    </div>
  );
}
function MenuStudio() {
  const { data, update } = useDemo();
  const [editing, setEditing] = useState<Dish | null>(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  function save(dish: Dish) {
    update(
      (d) => ({
        ...d,
        dishes: d.dishes.some((x) => x.id === dish.id)
          ? d.dishes.map((x) => (x.id === dish.id ? dish : x))
          : [...d.dishes, dish],
      }),
      `Menu saved · ${dish.name}`,
    );
    setEditing(null);
    setNotice(
      "Dish saved. The public menu reflects your changes in this browser.",
    );
  }
  return (
    <div className="admin-content">
      <Heading
        eyebrow="THE KITCHEN, CURATED"
        title="Menu studio"
        description="Seasonal plates, thoughtful details. Changes appear immediately on the public menu."
        action={
          <button
            className="button small"
            onClick={() =>
              setEditing({
                id: uid(),
                name: "",
                description: "",
                price: 0,
                category: "Starters",
                dietary: [],
                allergens: "",
                image: "/images/plate.jpg",
                available: true,
              })
            }
          >
            <Plus size={17} /> Add dish
          </button>
        }
      />
      {notice && (
        <p className="success" role="status">
          {notice}
        </p>
      )}
      <div className="toolbar">
        <label className="search">
          <Search size={17} />
          <input
            aria-label="Search dishes"
            placeholder="Find a dish…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <select
          aria-label="Filter menu category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {["All", ...categories].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <Link className="text-link" to="/menu">
          View public menu <ArrowUpRight size={16} />
        </Link>
      </div>
      <div className="panel">
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable restaurant records"
        >
          <table className="menu-table">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {data.dishes
                .filter(
                  (d) =>
                    (filter === "All" || d.category === filter) &&
                    d.name.toLowerCase().includes(query.toLowerCase()),
                )
                .map((d) => (
                  <tr key={d.id}>
                    <td>
                      <div className="dish-cell">
                        <img src={d.image} alt="" />
                        <div>
                          <strong>{d.name}</strong>
                          <small>{d.description}</small>
                          <small>{d.dietary.join(" · ")}</small>
                        </div>
                      </div>
                    </td>
                    <td>{d.category}</td>
                    <td>{money(d.price)}</td>
                    <td>
                      <button
                        className={`badge availability ${d.available ? "confirmed" : "cancelled"}`}
                        aria-label={`${d.available ? "Mark unavailable" : "Mark available"}: ${d.name}`}
                        onClick={() =>
                          update(
                            (x) => ({
                              ...x,
                              dishes: x.dishes.map((a) =>
                                a.id === d.id
                                  ? { ...a, available: !a.available }
                                  : a,
                              ),
                            }),
                            `Availability updated · ${d.name}`,
                          )
                        }
                      >
                        {d.available ? "Available" : "Unavailable"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="table-button"
                        onClick={() => setEditing({ ...d })}
                        aria-label={`Edit ${d.name}`}
                      >
                        Edit ↗
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {!data.dishes.some(
          (d) =>
            (filter === "All" || d.category === filter) &&
            d.name.toLowerCase().includes(query.toLowerCase()),
        ) && <p className="empty">No dishes found.</p>}
      </div>
      {editing && (
        <Modal
          title={editing.name ? "Edit dish" : "A new dish"}
          onClose={() => setEditing(null)}
        >
          <DishForm
            dish={editing}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
function DishForm({
  dish,
  onSave,
  onCancel,
}: {
  dish: Dish;
  onSave: (d: Dish) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(dish);
  const [error, setError] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    if (
      !draft.name.trim() ||
      !draft.description.trim() ||
      draft.price <= 0 ||
      draft.price > 999
    ) {
      setError("Add a name, description, and price between $0.01 and $999.");
      return;
    }
    onSave({
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      allergens: draft.allergens.trim(),
    });
  }
  return (
    <form onSubmit={submit} className="editor-form">
      <div className="editor-image">
        <img src={draft.image} alt="Dish image preview" />
        <div>
          <label>
            Choose an illustrative photograph
            <select
              value={draft.image.startsWith("data:") ? "uploaded" : draft.image}
              onChange={(e) => setDraft({ ...draft, image: e.target.value })}
            >
              {imageOptions.map(([src, label]) => (
                <option key={src} value={src}>
                  {label}
                </option>
              ))}
              {draft.image.startsWith("data:") && (
                <option value="uploaded">Your uploaded image</option>
              )}
            </select>
          </label>
          <label className="upload-label">
            Or upload an image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (
                  !["image/jpeg", "image/png", "image/webp"].includes(
                    file.type,
                  ) ||
                  file.size > 1500000
                ) {
                  setError("Choose a JPG, PNG, or WebP image under 1.5 MB.");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  setDraft({ ...draft, image: String(reader.result) });
                  setError("");
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          <small>Local browser only · up to 1.5 MB · JPG, PNG, WebP</small>
        </div>
      </div>
      <label>
        Dish name
        <input
          required
          maxLength={80}
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
      </label>
      <label>
        Description
        <textarea
          required
          maxLength={350}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </label>
      <div className="form-row">
        <label>
          Price (USD)
          <input
            required
            type="number"
            min="0.01"
            max="999"
            step="0.01"
            value={draft.price || ""}
            onChange={(e) =>
              setDraft({ ...draft, price: Number(e.target.value) })
            }
          />
        </label>
        <label>
          Category
          <select
            aria-label="Category"
            value={draft.category}
            onChange={(e) =>
              setDraft({
                ...draft,
                category: e.target.value as Dish["category"],
              })
            }
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
      </div>
      <fieldset>
        <legend>Dietary labels</legend>
        <div className="dietary-options">
          {["Vegetarian", "Vegan", "Gluten-free"].map((t) => (
            <label className="check-label" key={t}>
              <input
                type="checkbox"
                checked={draft.dietary.includes(t)}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    dietary: e.target.checked
                      ? [...draft.dietary, t]
                      : draft.dietary.filter((x) => x !== t),
                  })
                }
              />
              {t}
            </label>
          ))}
        </div>
      </fieldset>
      <label>
        Allergens
        <input
          maxLength={160}
          value={draft.allergens}
          placeholder="e.g. Wheat, milk, sesame"
          onChange={(e) => setDraft({ ...draft, allergens: e.target.value })}
        />
      </label>
      <label className="check-label">
        <input
          type="checkbox"
          checked={draft.available}
          onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
        />
        Available on the public menu
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <div className="modal-actions">
        <button type="button" className="button secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="button">
          Save dish <Check size={16} />
        </button>
      </div>
    </form>
  );
}
function ReservationStudio() {
  const { data, update } = useDemo();
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [view, setView] = useState("List");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [slotOpen, setSlotOpen] = useState(false);
  const [slots, setSlots] = useState(data.slots);
  function status(r: Reservation, value: Reservation["status"]) {
    if (
      value !== "Cancelled" &&
      value !== "Completed" &&
      ["Cancelled", "Completed"].includes(r.status) &&
      seatsLeft(data, r.date, r.time) < r.party
    ) {
      setError(
        "This slot has insufficient capacity. Update availability before restoring the reservation.",
      );
      return;
    }
    update(
      (d) => ({
        ...d,
        reservations: d.reservations.map((x) =>
          x.id === r.id ? { ...x, status: value } : x,
        ),
      }),
      `Reservation ${value.toLowerCase()} · ${r.name}`,
    );
    setError("");
    setNotice(`${r.name}: ${value}`);
  }
  const filtered = data.reservations
    .filter(
      (r) =>
        (!date || r.date === date) &&
        r.name.toLowerCase().includes(query.toLowerCase()),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  return (
    <div className="admin-content">
      <Heading
        eyebrow="EVERY GUEST, THOUGHTFULLY WELCOMED"
        title="Reservations"
        description="Review your browser’s fictional requests and keep the evening flowing."
        action={
          <button
            className="button small"
            onClick={() => {
              setSlots(data.slots.map((s) => ({ ...s })));
              setSlotOpen(true);
            }}
          >
            Configure availability
          </button>
        }
      />
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="success" role="status">
          {notice}
        </p>
      )}
      <div className="toolbar">
        <label className="search">
          <Search size={17} />
          <input
            aria-label="Search guests"
            placeholder="Find a guest…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label className="inline-label">
          Date
          <input
            aria-label="Filter reservation date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <button
          className="table-button"
          onClick={() => {
            setDate("");
            setQuery("");
          }}
        >
          Clear filters
        </button>
        <div className="segmented">
          {["List", "Calendar"].map((v) => (
            <button
              key={v}
              aria-pressed={view === v}
              className={view === v ? "selected" : ""}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      {view === "List" ? (
        <section className="panel">
          <ReservationTable
            reservations={filtered}
            actions={(r) => (
              <select
                aria-label={`Status for ${r.name}`}
                value={r.status}
                onChange={(e) =>
                  status(r, e.target.value as Reservation["status"])
                }
              >
                {[
                  "Requested",
                  "Confirmed",
                  "Seated",
                  "Completed",
                  "Cancelled",
                ].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            )}
          />
        </section>
      ) : (
        <div className="reservation-calendar">
          {(date
            ? [date]
            : Array.from(new Set([today(), ...filtered.map((r) => r.date)]))
          )
            .sort()
            .map((day) => (
              <section className="panel" key={day}>
                <div className="panel-title">
                  <h2>{prettyDate(day)}</h2>
                  <span>
                    {filtered.filter((r) => r.date === day).length} reservations
                  </span>
                </div>
                {filtered
                  .filter((r) => r.date === day)
                  .map((r) => (
                    <div className="calendar-reservation" key={r.id}>
                      <strong>{r.time}</strong>
                      <div>
                        <span>{r.name}</span>
                        <small>
                          {r.party} guests · {r.status}
                        </small>
                      </div>
                      <select
                        aria-label={`Status for ${r.name}`}
                        value={r.status}
                        onChange={(e) =>
                          status(r, e.target.value as Reservation["status"])
                        }
                      >
                        {[
                          "Requested",
                          "Confirmed",
                          "Seated",
                          "Completed",
                          "Cancelled",
                        ].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                {!filtered.some((r) => r.date === day) && (
                  <p className="empty">No reservations.</p>
                )}
              </section>
            ))}
        </div>
      )}
      {slotOpen && (
        <Modal title="Demo availability" onClose={() => setSlotOpen(false)}>
          <p>
            These slots repeat every open day (Tuesday–Sunday). Capacity is
            measured in guests; active reservations consume seats.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const maxUsed = slots.some((s) =>
                Array.from(new Set(data.reservations.map((r) => r.date))).some(
                  (day) =>
                    data.reservations
                      .filter(
                        (r) =>
                          r.date === day &&
                          r.time === s.time &&
                          !["Cancelled", "Completed"].includes(r.status),
                      )
                      .reduce((n, r) => n + r.party, 0) > s.capacity,
                ),
              );
              if (maxUsed) {
                setError(
                  "Capacity cannot be lower than existing active guest counts.",
                );
                return;
              }
              update((d) => ({ ...d, slots }), "Demo availability updated");
              setError("");
              setNotice(
                "Availability saved. Public booking slots now reflect these settings.",
              );
              setSlotOpen(false);
            }}
          >
            {slots.map((s, i) => (
              <div className="slot-editor" key={s.time}>
                <label className="check-label">
                  <input
                    type="checkbox"
                    checked={s.enabled}
                    onChange={(e) =>
                      setSlots(
                        slots.map((x, j) =>
                          i === j ? { ...x, enabled: e.target.checked } : x,
                        ),
                      )
                    }
                  />
                  {s.time}
                </label>
                <label>
                  Guest capacity
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={s.capacity}
                    onChange={(e) =>
                      setSlots(
                        slots.map((x, j) =>
                          i === j
                            ? { ...x, capacity: Number(e.target.value) }
                            : x,
                        ),
                      )
                    }
                  />
                </label>
              </div>
            ))}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <div className="modal-actions">
              <button className="button">Save availability</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
function StaffStudio() {
  const { data, update } = useDemo();
  const [start, setStart] = useState(today());
  const [editing, setEditing] = useState<Shift | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start + "T12:00:00");
    d.setDate(d.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  function save(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const err = shiftError(data.shifts, editing);
    if (err) {
      setError(err);
      return;
    }
    update(
      (d) => ({
        ...d,
        shifts: d.shifts.some((s) => s.id === editing.id)
          ? d.shifts.map((s) => (s.id === editing.id ? editing : s))
          : [...d.shifts, editing],
      }),
      "Staff shift saved",
    );
    setEditing(null);
    setError("");
    setNotice("Shift saved. Schedule updated.");
  }
  return (
    <div className="admin-content">
      <Heading
        eyebrow="GOOD PEOPLE, GREAT SERVICE"
        title="Staff & shifts"
        description="An organized week for your fictional team. Overlapping shifts are checked before saving."
        action={
          <button
            className="button small"
            onClick={() => {
              setError("");
              setEditing({
                id: uid(),
                staffId: data.staff[0].id,
                date: start,
                start: "17:00",
                end: "22:00",
              });
            }}
          >
            <Plus size={17} /> Create shift
          </button>
        }
      />
      {notice && (
        <p className="success" role="status">
          {notice}
        </p>
      )}
      <div className="toolbar">
        <label className="inline-label">
          Week starting
          <input
            aria-label="Week starting"
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value || today())}
          />
        </label>
        <button className="table-button" onClick={() => setStart(today())}>
          This week
        </button>
        <span className="fineprint">
          All employees are fictional · availability shown for planning
        </span>
      </div>
      <section className="panel">
        <div
          className="schedule-scroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable weekly staff schedule"
        >
          <table className="schedule">
            <thead>
              <tr>
                <th>Team member</th>
                {days.map((d) => (
                  <th key={d}>{prettyDate(d)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.staff.map((s) => (
                <tr key={s.id}>
                  <td>
                    <strong>{s.name}</strong>
                    <small>{s.role}</small>
                  </td>
                  {days.map((day) => (
                    <td key={day}>
                      {data.shifts
                        .filter((sh) => sh.staffId === s.id && sh.date === day)
                        .map((sh) => (
                          <button
                            className={`shift ${s.role.toLowerCase()}`}
                            key={sh.id}
                            aria-label={`Edit shift for ${s.name} ${day} ${sh.start}`}
                            onClick={() => {
                              setError("");
                              setEditing({ ...sh });
                            }}
                          >
                            {sh.start}–{sh.end}
                            <small>{s.role}</small>
                          </button>
                        ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="section-heading directory-heading">
        <h2>People behind the plates</h2>
        <span className="sample-label">FICTIONAL STAFF DIRECTORY</span>
      </div>
      <div className="staff-directory">
        {data.staff.map((s) => (
          <div className="panel staff-card" key={s.id}>
            <span className="avatar">
              {s.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <h3>{s.name}</h3>
            <span className="badge confirmed">{s.role}</span>
            <p>
              <span className="status-dot" /> {s.availability}
            </p>
          </div>
        ))}
      </div>
      {editing && (
        <Modal
          title={
            data.shifts.some((s) => s.id === editing.id)
              ? "Edit shift"
              : "Create a shift"
          }
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save}>
            <label>
              Staff member
              <select
                value={editing.staffId}
                onChange={(e) =>
                  setEditing({ ...editing, staffId: e.target.value })
                }
              >
                {data.staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.role}
                  </option>
                ))}
              </select>
            </label>
            <p className="notice compact">
              Availability:{" "}
              {data.staff.find((s) => s.id === editing.staffId)?.availability}.
              Availability is advisory; time overlaps are enforced.
            </p>
            <label>
              Shift date
              <input
                required
                type="date"
                value={editing.date}
                onChange={(e) =>
                  setEditing({ ...editing, date: e.target.value })
                }
              />
            </label>
            <div className="form-row">
              <label>
                Start time
                <input
                  type="time"
                  required
                  value={editing.start}
                  onChange={(e) =>
                    setEditing({ ...editing, start: e.target.value })
                  }
                />
              </label>
              <label>
                End time
                <input
                  type="time"
                  required
                  value={editing.end}
                  onChange={(e) =>
                    setEditing({ ...editing, end: e.target.value })
                  }
                />
              </label>
            </div>
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <div className="modal-actions">
              {data.shifts.some((s) => s.id === editing.id) && (
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    update(
                      (d) => ({
                        ...d,
                        shifts: d.shifts.filter((s) => s.id !== editing.id),
                      }),
                      "Demo shift removed",
                    );
                    setEditing(null);
                    setNotice("Shift removed.");
                  }}
                >
                  Remove shift
                </button>
              )}
              <button className="button">
                Save shift <Check size={16} />
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
function Operations() {
  const { data, update } = useDemo();
  const [notes, setNotes] = useState(data.notes);
  const [notice, setNotice] = useState("");
  return (
    <div className="admin-content">
      <Heading
        eyebrow="THE DETAILS THAT MAKE THE DIFFERENCE"
        title="Daily operations"
        description="From first prep to final lights out. A browser-local demonstration checklist."
      />
      <div className="operations-progress">
        <span>
          {data.tasks.filter((t) => t.done).length} of {data.tasks.length} tasks
          complete
        </span>
        <progress
          max={data.tasks.length}
          value={data.tasks.filter((t) => t.done).length}
          aria-label="Daily checklist progress"
        />
      </div>
      <div className="operations-grid">
        {["Opening", "Food preparation", "Cleaning", "Closing"].map((group) => (
          <section className="panel" key={group}>
            <div className="panel-title">
              <h2>{group}</h2>
              <span className="sample-label">
                {data.tasks.filter((t) => t.group === group && t.done).length}/
                {data.tasks.filter((t) => t.group === group).length}
              </span>
            </div>
            {data.tasks
              .filter((t) => t.group === group)
              .map((t) => (
                <div className="operation-task" key={t.id}>
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() =>
                        update(
                          (d) => ({
                            ...d,
                            tasks: d.tasks.map((x) =>
                              x.id === t.id ? { ...x, done: !x.done } : x,
                            ),
                          }),
                          `Task ${t.done ? "reopened" : "completed"} · ${t.name}`,
                        )
                      }
                    />
                    <span className={t.done ? "done" : ""}>{t.name}</span>
                  </label>
                  <label>
                    Owner
                    <select
                      aria-label={`Owner of ${t.name}`}
                      value={t.owner}
                      onChange={(e) =>
                        update(
                          (d) => ({
                            ...d,
                            tasks: d.tasks.map((x) =>
                              x.id === t.id
                                ? { ...x, owner: e.target.value }
                                : x,
                            ),
                          }),
                          "Task ownership updated",
                        )
                      }
                    >
                      {data.staff.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
          </section>
        ))}
      </div>
      <section className="panel manager-notes">
        <h2>Manager’s notebook</h2>
        <p>
          A thought for tonight’s service. Use fictional operational notes only.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            update((d) => ({ ...d, notes }), "Manager notes saved");
            setNotice("Manager notes saved in this browser.");
          }}
        >
          <label>
            Service notes
            <textarea
              aria-label="Service notes"
              maxLength={2000}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
          <button className="button small">
            Save notes <Check size={16} />
          </button>
          {notice && (
            <p className="success" role="status">
              {notice}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
