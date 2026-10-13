export const categories = [
  "Starters",
  "Mains",
  "Seafood",
  "Desserts",
  "Drinks",
] as const;
export type Category = (typeof categories)[number];
export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  dietary: string[];
  allergens: string;
  image: string;
  available: boolean;
};
export type Reservation = {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  party: number;
  status: "Requested" | "Confirmed" | "Seated" | "Completed" | "Cancelled";
  notes: string;
};
export type Staff = {
  id: string;
  name: string;
  role: string;
  availability: string;
};
export type Shift = {
  id: string;
  staffId: string;
  date: string;
  start: string;
  end: string;
};
export type Task = {
  id: string;
  name: string;
  group: string;
  owner: string;
  done: boolean;
};
export type Demo = {
  dishes: Dish[];
  reservations: Reservation[];
  staff: Staff[];
  shifts: Shift[];
  tasks: Task[];
  slots: { time: string; capacity: number; enabled: boolean }[];
  notes: string;
  activity: string[];
  messages: { id: string; name: string; email: string; message: string }[];
};
export const today = () => localDate(new Date());
export function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function offsetDate(offset: number) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return localDate(date);
}
export const uid = () => crypto.randomUUID();
export const money = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
export const prettyDate = (s: string) =>
  new Date(`${s}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
export const imageOptions = [
  ["/images/plate.jpg", "Mediterranean table"],
  ["/images/salad.jpg", "Seasonal greens"],
  ["/images/fish.jpg", "Freshly prepared dish"],
  ["/images/dessert.jpg", "Dessert"],
  ["/images/interior.jpg", "Dining room"],
];
export function serviceDate(offset=0, now=new Date()) {const day=new Date(now);day.setDate(day.getDate()+offset);while(day.getDay()===1)day.setDate(day.getDate()+1);return localDate(day);}
export function seed(): Demo {
  return {
    dishes: [
      {
        id: "d1",
        name: "Whipped feta & warm pita",
        description:
          "A cloud of feta, wildflower honey, toasted sesame, and bread for the last bite.",
        price: 14,
        category: "Starters",
        dietary: ["Vegetarian"],
        allergens: "Milk, wheat, sesame",
        image: "/images/plate.jpg",
        available: true,
      },
      {
        id: "d2",
        name: "Charred seasonal greens",
        description:
          "Market vegetables, lemon tahini, preserved lemon, and fresh dill.",
        price: 16,
        category: "Starters",
        dietary: ["Vegan", "Gluten-free"],
        allergens: "Sesame",
        image: "/images/salad.jpg",
        available: true,
      },
      {
        id: "d3",
        name: "Slow-braised lamb",
        description:
          "Rosemary jus, creamy white beans, and a generous spoon of salsa verde.",
        price: 36,
        category: "Mains",
        dietary: ["Gluten-free"],
        allergens: "Celery",
        image: "/images/plate.jpg",
        available: true,
      },
      {
        id: "d4",
        name: "Saffron garden rice",
        description:
          "Golden saffron rice, roasted squash, chickpeas, herbs, and pistachio.",
        price: 28,
        category: "Mains",
        dietary: ["Vegan", "Gluten-free"],
        allergens: "Tree nuts",
        image: "/images/salad.jpg",
        available: true,
      },
      {
        id: "d5",
        name: "Sea bass, lemon & olive",
        description:
          "Crisp skin, butter beans, Kalamata olives, and a bright lemon dressing.",
        price: 34,
        category: "Seafood",
        dietary: ["Gluten-free"],
        allergens: "Fish",
        image: "/images/fish.jpg",
        available: true,
      },
      {
        id: "d6",
        name: "Garlic prawns",
        description:
          "Tomato, chilli, extra virgin olive oil, and toasted sourdough.",
        price: 32,
        category: "Seafood",
        dietary: [],
        allergens: "Shellfish, wheat",
        image: "/images/fish.jpg",
        available: true,
      },
      {
        id: "d7",
        name: "Olive oil cake",
        description: "Citrus-soaked crumb, vanilla cream, and seasonal fruit.",
        price: 12,
        category: "Desserts",
        dietary: ["Vegetarian"],
        allergens: "Wheat, eggs, milk",
        image: "/images/dessert.jpg",
        available: true,
      },
      {
        id: "d8",
        name: "Pistachio affogato",
        description:
          "Pistachio gelato, a warm shot of espresso, and almond biscotti.",
        price: 11,
        category: "Desserts",
        dietary: ["Vegetarian"],
        allergens: "Milk, tree nuts, wheat",
        image: "/images/dessert.jpg",
        available: true,
      },
      {
        id: "d9",
        name: "Olive grove spritz",
        description:
          "Botanical aperitif, orange, rosemary, and sparkling soda. Zero-proof.",
        price: 10,
        category: "Drinks",
        dietary: ["Vegan", "Gluten-free"],
        allergens: "None declared",
        image: "/images/plate.jpg",
        available: true,
      },
      {
        id: "d10",
        name: "House lemonade",
        description: "Fresh lemon, thyme syrup, and a little sunshine.",
        price: 7,
        category: "Drinks",
        dietary: ["Vegan", "Gluten-free"],
        allergens: "None declared",
        image: "/images/salad.jpg",
        available: true,
      },
    ],
    reservations: [
      {
        id: "r1",
        name: "Alex Morgan",
        email: "alex@example.com",
        date: serviceDate(),
        time: "18:00",
        party: 4,
        status: "Confirmed",
        notes: "Fictional guest • window table",
      },
      {
        id: "r2",
        name: "Jamie Ellis",
        email: "jamie@example.com",
        date: serviceDate(),
        time: "18:30",
        party: 2,
        status: "Requested",
        notes: "Fictional guest",
      },
      {
        id: "r3",
        name: "Robin Lane",
        email: "robin@example.com",
        date: serviceDate(),
        time: "19:00",
        party: 6,
        status: "Confirmed",
        notes: "Fictional guest • birthday",
      },
      {
        id: "r4",
        name: "Taylor Reed",
        email: "taylor@example.com",
        date: serviceDate(1),
        time: "19:30",
        party: 3,
        status: "Confirmed",
        notes: "Fictional guest",
      },
    ],
    staff: [
      {
        id: "s1",
        name: "Maya Bennett",
        role: "Manager",
        availability: "Tue–Sun · evenings",
      },
      {
        id: "s2",
        name: "Leo Santos",
        role: "Kitchen",
        availability: "Tue–Sun · afternoons & evenings",
      },
      {
        id: "s3",
        name: "Nora Ellis",
        role: "Server",
        availability: "Every day · evenings",
      },
      {
        id: "s4",
        name: "Sam Rivera",
        role: "Bartender",
        availability: "Wed–Sun · evenings",
      },
    ],
    shifts: [
      { id: "sh1", staffId: "s1", date: serviceDate(), start: "16:00", end: "23:00" },
      { id: "sh2", staffId: "s2", date: serviceDate(), start: "14:00", end: "22:00" },
      { id: "sh3", staffId: "s3", date: serviceDate(), start: "17:00", end: "23:00" },
      {
        id: "sh4",
        staffId: "s4",
        date: serviceDate(2),
        start: "17:00",
        end: "23:00",
      },
    ],
    tasks: [
      {
        id: "t1",
        name: "Set tables & polish glassware",
        group: "Opening",
        owner: "s3",
        done: true,
      },
      {
        id: "t2",
        name: "Review reservations & dietary notes",
        group: "Opening",
        owner: "s1",
        done: false,
      },
      {
        id: "t3",
        name: "Prepare sauces & fresh herbs",
        group: "Food preparation",
        owner: "s2",
        done: false,
      },
      {
        id: "t4",
        name: "Check fridge temperatures",
        group: "Food preparation",
        owner: "s2",
        done: true,
      },
      {
        id: "t5",
        name: "Sanitize prep surfaces",
        group: "Cleaning",
        owner: "s2",
        done: false,
      },
      {
        id: "t6",
        name: "Clean dining room & restrooms",
        group: "Cleaning",
        owner: "s3",
        done: false,
      },
      {
        id: "t7",
        name: "Close till & review service notes",
        group: "Closing",
        owner: "s1",
        done: false,
      },
      {
        id: "t8",
        name: "Store ingredients & secure kitchen",
        group: "Closing",
        owner: "s2",
        done: false,
      },
    ],
    slots: [
      "17:00",
      "17:30",
      "18:00",
      "18:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
    ].map((time) => ({ time, capacity: 20, enabled: true })),
    notes:
      "Service focus: a warm welcome, thoughtful pacing, and a little extra care for every table.",
    activity: [
      "Sample data initialized · fictional service ready",
      "Sample menu prepared for autumn service",
    ],
    messages: [],
  };
}
export function seatsLeft(data: Demo, date: string, time: string) {
  const slot = data.slots.find((s) => s.time === time && s.enabled);
  return slot
    ? Math.max(
        0,
        slot.capacity -
          data.reservations
            .filter(
              (r) =>
                r.date === date &&
                r.time === time &&
                r.status !== "Cancelled" &&
                r.status !== "Completed",
            )
            .reduce((n, r) => n + r.party, 0),
      )
    : 0;
}
export function shiftError(shifts: Shift[], shift: Shift) {
  if (shift.end <= shift.start)
    return "End time must be after start time. Overnight shifts are not supported.";
  if (
    shifts.some(
      (s) =>
        s.id !== shift.id &&
        s.staffId === shift.staffId &&
        s.date === shift.date &&
        shift.start < s.end &&
        shift.end > s.start,
    )
  )
    return "This staff member already has an overlapping shift.";
  return "";
}
