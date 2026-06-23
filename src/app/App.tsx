import { useState } from "react";
import {
  ShoppingCart, Menu, X, ArrowRight, Star, Zap, Shield, Leaf,
  ChevronDown, LogIn, LogOut, LayoutDashboard, Package, Users,
  TrendingUp, Eye, EyeOff, AlertCircle, CheckCircle, BarChart2,
  ShoppingBag, Truck, Settings, Bell, Search, Plus, Edit2, Trash2,
  ChevronRight, ArrowUpRight, ArrowDownRight, Minus, MapPin, Phone,
  Mail, Clock, Tag,
} from "lucide-react";

const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.round(value));

// ─── TYPES ───────────────────────────────────────────────────────────────────

type View = "landing" | "login" | "account" | "admin";

interface User {
  name: string;
  email: string;
  role: "admin" | "customer";
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  weight: string;
  flavor: string;
  img: string;
  qty: number;
}

// ─── SHIPPING ZONES ───────────────────────────────────────────────────────────

const SHIPPING_ZONES = [
  { id: "norte_grande", label: "Norte Grande", cost: 3900, days: "5–8 días", freeOver: 40000 },
  { id: "norte_chico", label: "Norte Chico", cost: 3900, days: "4–6 días", freeOver: 40000 },
  { id: "zona_central", label: "Zona Central", cost: 3900, days: "24–48H", freeOver: 40000 },
  { id: "zona_sur", label: "Zona Sur", cost: 3900, days: "4–6 días", freeOver: 40000 },
  { id: "zona_austral", label: "Zona Austral", cost: 3900, days: "5–8 días", freeOver: 40000 },
  { id: "internacional", label: "Internacional", cost: 24900, days: "10–15 días", freeOver: 200000 },
];

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const USERS: Record<string, { password: string; user: User }> = {
  "admin@machissuplementos.cl": {
    password: "admin123",
    user: { name: "Admin MachisSuplementos", email: "admin@machissuplementos.cl", role: "admin" },
  },
  "carlos@gmail.com": {
    password: "carlos123",
    user: { name: "Carlos Martínez", email: "carlos@gmail.com", role: "customer" },
  },
};

const adminProductsData = [
  { id: 1, name: "WHEY FORCE PRO", category: "Proteína", stock: 142, price: 49900, sales: 384, status: "activo" },
  { id: 2, name: "CREATINE ULTRA", category: "Fuerza", stock: 89, price: 29900, sales: 217, status: "activo" },
  { id: 3, name: "PRE-WORK IGNITE", category: "Pre-Entreno", stock: 11, price: 39900, sales: 159, status: "bajo stock" },
  { id: 4, name: "OMEGA-3 PURE", category: "Vitaminas", stock: 0, price: 19900, sales: 98, status: "agotado" },
  { id: 5, name: "PACK STARTER", category: "Pack", stock: 55, price: 89900, sales: 73, status: "activo" },
];

const adminOrders = [
  { id: "#8841", customer: "Lucía R.", product: "WHEY FORCE PRO", date: "22 jun 2026", status: "entregado", total: 49900 },
  { id: "#8840", customer: "Diego T.", product: "CREATINE ULTRA", date: "22 jun 2026", status: "en tránsito", total: 29900 },
  { id: "#8839", customer: "María S.", product: "PACK STARTER", date: "21 jun 2026", status: "en tránsito", total: 89900 },
  { id: "#8838", customer: "Jorge P.", product: "PRE-WORK IGNITE", date: "21 jun 2026", status: "procesando", total: 39900 },
  { id: "#8837", customer: "Ana L.", product: "WHEY FORCE PRO", date: "20 jun 2026", status: "entregado", total: 49900 },
];

const PRODUCTS = [
  {
    id: 1, name: "WHEY FORCE PRO", category: "Proteína", flavor: "Chocolate Intenso",
    price: 49900, weight: "1kg", badge: "MÁS VENDIDO", badgeColor: "bg-accent text-accent-foreground",
    img: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&h=700&fit=crop&auto=format",
    desc: "25g de proteína por servicio. Sin rellenos, sin excusas.",
  },
  {
    id: 2, name: "CREATINE ULTRA", category: "Fuerza", flavor: "Sin sabor",
    price: 29900, weight: "300g", badge: "NUEVO", badgeColor: "bg-foreground text-background",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=700&fit=crop&auto=format",
    desc: "Creatina monohidratada pura. Máxima potencia en cada rep.",
  },
  {
    id: 3, name: "PRE-WORK IGNITE", category: "Pre-Entreno", flavor: "Sandía & Limón",
    price: 39900, weight: "400g", badge: "OFERTA", badgeColor: "bg-red-500 text-white",
    img: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=700&fit=crop&auto=format",
    desc: "Energía explosiva, foco total. Cero colapso post-entreno.",
  },
  {
    id: 4, name: "OMEGA-3 PURE", category: "Vitaminas", flavor: "Sin sabor",
    price: 19900, weight: "90 caps", badge: "ESENCIAL", badgeColor: "bg-blue-500 text-white",
    img: "https://i.ibb.co/svDPmmx5/healthy-living-Omega6-Vs-Omega3.jpg",
    desc: "Omega-3 de alta pureza. Salud cardiovascular y recuperación.",
  },
];

const testimonials = [
  { name: "Carlos M.", role: "Powerlifter amateur", stars: 5, text: "Llevo 6 meses con WHEY FORCE y mis marcas subieron 15%. La recuperación es brutal. No vuelvo a otra marca.", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&h=80&fit=crop&auto=format" },
  { name: "Lucía R.", role: "Crossfitter · 3 años", stars: 5, text: "Probé mil proteínas y esta es la única que no me cae pesada. El sabor chocolate es adictivo. 100% recomendada.", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&auto=format" },
  { name: "Diego T.", role: "Entrenador personal", stars: 5, text: "Se lo recomiendo a todos mis clientes. Calidad verificada, ingredientes limpios y resultados visibles en semanas.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" },
];

const benefits = [
  { icon: Zap, title: "Absorción ultrarrápida", desc: "Fórmula hidrolizada de rápida asimilación para máxima recuperación post-entreno." },
  { icon: Shield, title: "Testado en laboratorio", desc: "Cada lote analizado por terceros. Sin sustancias prohibidas. Certificado WADA." },
  { icon: Leaf, title: "Sin aditivos ocultos", desc: "Ingredientes limpios, sin rellenos artificiales. Lo que dice la etiqueta, es lo que hay." },
];

const faqs = [
  { q: "¿Cuándo debo tomar la proteína?", a: "Lo ideal es consumirla dentro de los 30 minutos post-entreno para maximizar la síntesis proteica. También puede tomarse en el desayuno." },
  { q: "¿Es apta para intolerantes a la lactosa?", a: "La versión Isolate es apta. La versión Concentrate contiene trazas mínimas de lactosa." },
  { q: "¿Hacen envíos a toda Chile?", a: "¡Llegamos a todo el país! 🚚 ✨\nDisfruta de envío gratis en compras desde $40.000.\n\nSi estás en la Zona Central, tu pedido llega en 24-48 horas.\n\nPara las Zonas Norte y Sur, los tiempos y tarifas de envío son diferentes (puedes revisarlos antes de pagar)." },
  { q: "¿Puedo combinar varios productos?", a: "Absolutamente. La combinación Whey + Creatina es la más popular entre nuestros clientes." },
];

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    entregado: "bg-green-100 text-green-700",
    "en tránsito": "bg-blue-100 text-blue-700",
    procesando: "bg-yellow-100 text-yellow-700",
    activo: "bg-green-100 text-green-700",
    "bajo stock": "bg-yellow-100 text-yellow-700",
    agotado: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────

function CartDrawer({
  open,
  onClose,
  items,
  onQtyChange,
  onRemove,
}: {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) {
  const [zoneId, setZoneId] = useState("zona_central");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [checkoutDone, setCheckoutDone] = useState(false);

  const zone = SHIPPING_ZONES.find((z) => z.id === zoneId)!;
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shippingFree = subtotal - discount >= zone.freeOver;
  const shipping = shippingFree ? 0 : zone.cost;
  const total = subtotal - discount + shipping;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "APEX10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponError("Código inválido. Prueba APEX10");
      setCouponApplied(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col shadow-2xl"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2
              className="text-2xl font-black uppercase tracking-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Tu carrito
            </h2>
            <p className="text-xs text-muted-foreground">
              {items.reduce((s, i) => s + i.qty, 0)} artículo{items.reduce((s, i) => s + i.qty, 0) !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {checkoutDone ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
              <CheckCircle size={30} className="text-accent-foreground" />
            </div>
            <h3
              className="text-4xl font-black uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              ¡Pedido confirmado!
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Recibirás un email con el seguimiento. Tiempo estimado:{" "}
              <strong>{zone.days}</strong>.
            </p>
            <div className="bg-secondary p-4 w-full text-left mt-2">
              <div className="text-xs text-muted-foreground mb-1">Número de pedido</div>
              <div
                className="font-mono font-bold text-lg"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                #8842
              </div>
            </div>
            <button
              onClick={() => { setCheckoutDone(false); onClose(); }}
              className="w-full bg-foreground text-background font-bold py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Volver a la tienda
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
            <ShoppingCart size={48} className="text-muted-foreground/30" />
            <p className="text-muted-foreground text-sm">Tu carrito está vacío</p>
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-foreground text-background font-bold px-6 py-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Ver productos <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <>
            {/* items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border border-border p-3 bg-card">
                  <div className="w-16 h-16 bg-secondary shrink-0 overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-black text-sm tracking-tight leading-tight"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                    >
                      {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.flavor} · {item.weight}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => onQtyChange(item.id, item.qty - 1)}
                          className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-sm font-bold">{item.qty}</span>
                        <button
                          onClick={() => onQtyChange(item.id, item.qty + 1)}
                          className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm">
                          {formatCLP(item.price * item.qty)}
                        </span>
                        <button
                          onClick={() => onRemove(item.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* summary */}
            <div className="border-t border-border px-6 py-5 space-y-4">
              {/* shipping zone */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <MapPin size={12} /> Zona de envío
                </label>
                <select
                  value={zoneId}
                  onChange={(e) => setZoneId(e.target.value)}
                  className="w-full border border-border bg-card text-sm px-3 py-2.5 focus:outline-none focus:border-foreground/40 transition-colors appearance-none cursor-pointer"
                >
                  {SHIPPING_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.label} — {z.days}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1.5">
                  {shippingFree
                    ? "✓ Envío gratuito aplicado"
                    : `Envío gratis a partir de ${formatCLP(zone.freeOver)} (faltan ${formatCLP(zone.freeOver - (subtotal - discount))})`}
                </p>
              </div>

              {/* coupon */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  <Tag size={12} /> Cupón de descuento
                </label>
                <div className="flex gap-2">
                  <input
                    value={coupon}
                    onChange={(e) => { setCoupon(e.target.value); setCouponError(""); }}
                    placeholder="APEX10"
                    disabled={couponApplied}
                    className="flex-1 border border-border bg-card text-sm px-3 py-2 focus:outline-none focus:border-foreground/40 transition-colors disabled:opacity-50"
                  />
                  <button
                    onClick={applyCoupon}
                    disabled={couponApplied || !coupon}
                    className="bg-foreground text-background text-xs font-bold px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-40"
                  >
                    {couponApplied ? "✓" : "Aplicar"}
                  </button>
                </div>
                {couponError && <p className="text-xs text-red-500 mt-1">{couponError}</p>}
                {couponApplied && <p className="text-xs text-green-600 mt-1">✓ Descuento del 10% aplicado</p>}
              </div>

              {/* totals */}
              <div className="space-y-1.5 pt-2 border-t border-border text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCLP(subtotal)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento (10%)</span>
                    <span>−{formatCLP(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Envío ({zone.label})</span>
                  <span>{shippingFree ? <span className="text-green-600 font-semibold">Gratis</span> : formatCLP(shipping)}</span>
                </div>
                <div className="flex justify-between font-black text-lg pt-2 border-t border-border" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <span>TOTAL</span>
                  <span>{formatCLP(total)}</span>
                </div>
              </div>

              <button
                onClick={() => setCheckoutDone(true)}
                className="w-full bg-accent text-accent-foreground font-black text-base py-4 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 uppercase tracking-wide"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Finalizar compra <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Shield size={11} /> Pago seguro</span>
                <span className="flex items-center gap-1"><Truck size={11} /> {zone.days}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── MAP SECTION ──────────────────────────────────────────────────────────────

function MapSection() {
  return (
    <section id="ubicacion" className="py-24 px-6 bg-foreground text-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span
            className="text-xs font-mono tracking-[0.2em] text-accent"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            05 / ENCUÉNTRANOS
          </span>
          <h2
            className="text-6xl md:text-7xl font-black uppercase tracking-tight mt-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            Nuestra
            <br />
            <span className="text-accent">sede</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* info */}
          <div className="space-y-6">
            <div className="border border-white/10 p-5">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold tracking-widest text-background/40 uppercase mb-1">Dirección</div>
                  <div className="text-sm text-background/80 leading-relaxed">
                    Av. Nelson Pereira 2519<br />Rancagua, O'Higgins, Chile
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-white/10 p-5">
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold tracking-widest text-background/40 uppercase mb-1">Horario</div>
                  <div className="text-sm text-background/80 leading-relaxed space-y-0.5">
                    <div>Lun – Vie: 9:00 – 19:00</div>
                    <div>Sábado: 10:00 – 14:00</div>
                    <div className="text-background/40">Domingo: cerrado</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-white/10 p-5">
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold tracking-widest text-background/40 uppercase mb-1">Teléfono</div>
                  <a href="tel:+56912345678" className="text-sm text-background/80 hover:text-accent transition-colors">
                    +569 12345678
                  </a>
                </div>
              </div>
            </div>
            <div className="border border-white/10 p-5">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold tracking-widest text-background/40 uppercase mb-1">Email</div>
                  <a href="mailto:MachisSuplementos@machis.cl" className="text-sm text-background/80 hover:text-accent transition-colors">
                    MachisSuplementos@machis.cl
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-accent text-accent-foreground p-5">
              <div className="text-xs font-semibold tracking-widest uppercase mb-1">Recogida en tienda</div>
              <p className="text-sm opacity-80 leading-relaxed">
                También puedes recoger tu pedido sin coste de envío en nuestra sede. Trae el número de pedido.
              </p>
            </div>
          </div>

          {/* map */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden" style={{ height: "480px" }}>
              {/* custom styled map overlay label */}
              <div className="absolute top-4 left-4 z-10 bg-foreground text-background px-3 py-2 flex items-center gap-2 shadow-lg">
                <MapPin size={14} className="text-accent" />
                <span
                  className="text-sm font-black uppercase tracking-tight"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  Machis Suplementos · Rancagua
                </span>
              </div>
              <iframe
                title="Ubicación Machis Suplementos Rancagua"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.3) contrast(1.05)" }}
                loading="lazy"
                allowFullScreen
                src="https://www.openstreetmap.org/export/embed.html?bbox=-70.7509412%2C-34.1475194%2C-70.7309412%2C-34.1275194&layer=mapnik&marker=-34.1375194%2C-70.7409412"
              />
              <a
                href="https://www.openstreetmap.org/?mlat=-34.1375194&mlon=-70.7409412#map=16/-34.1375194/-70.7409412"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 text-[10px] bg-background/80 text-foreground px-2 py-1 hover:bg-background transition-colors"
              >
                Ver mapa completo ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────

function LoginPage({ onLogin, onBack }: { onLogin: (user: User) => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const match = USERS[email.toLowerCase()];
      if (match && match.password === password) {
        onLogin(match.user);
      } else {
        setError("Email o contraseña incorrectos.");
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-foreground flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="flex items-center justify-between px-8 py-5">
        <button onClick={onBack} className="flex items-center gap-2 text-background/50 hover:text-background text-sm transition-colors">
          <ChevronRight size={14} className="rotate-180" /> Volver a la tienda
        </button>
        <span className="text-2xl font-black tracking-tighter text-background" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          APEX<span className="text-accent">FUEL</span>
        </span>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-5xl font-black uppercase tracking-tight text-background mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Accede a<br /><span className="text-accent">tu cuenta</span>
            </h1>
            <p className="text-background/50 text-sm">Gestiona tus pedidos, historial y preferencias.</p>
          </div>
          <div className="bg-white/5 border border-white/10 px-4 py-3 mb-8 text-xs text-background/50 space-y-0.5">
            <div><span className="text-accent font-mono">Admin:</span> admin@machissuplementos.cl / admin123</div>
            <div><span className="text-background/70 font-mono">Cliente:</span> carlos@gmail.com / carlos123</div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-background/60 mb-2 tracking-wider uppercase">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required className="w-full bg-white/5 border border-white/15 text-background placeholder-background/30 px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-background/60 mb-2 tracking-wider uppercase">Contraseña</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full bg-white/5 border border-white/15 text-background placeholder-background/30 px-4 py-3 pr-12 text-sm focus:outline-none focus:border-accent transition-colors" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-background/40 hover:text-background/70 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div className="flex items-center gap-2 text-red-400 text-sm"><AlertCircle size={14} /> {error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground font-bold py-3.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <span className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> : <><LogIn size={15} /> Iniciar sesión</>}
            </button>
            <p className="text-center text-xs text-background/40">
              ¿No tienes cuenta?{" "}
              <button type="button" className="text-accent hover:underline">Regístrate gratis</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── ACCOUNT PAGE ─────────────────────────────────────────────────────────────

function AccountPage({ user, onLogout }: { user: User; onLogout: () => void }) {
  const orders = [
    { id: "#8829", product: "WHEY FORCE PRO · 1kg", date: "18 jun 2026", status: "entregado", total: 49.90 },
    { id: "#8791", product: "CREATINE ULTRA · 300g", date: "02 jun 2026", status: "entregado", total: 29.90 },
    { id: "#8755", product: "PACK STARTER", date: "14 may 2026", status: "entregado", total: 89.90 },
  ];
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-black tracking-tighter" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Machis<span className="text-accent">Suplementos</span></span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">Hola, <strong>{user.name.split(" ")[0]}</strong></span>
            <button onClick={onLogout} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"><LogOut size={15} /> Cerrar sesión</button>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-12">
          <div className="text-xs font-mono text-muted-foreground tracking-widest mb-2" style={{ fontFamily: "'DM Mono', monospace" }}>MI CUENTA</div>
          <h1 className="text-6xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Bienvenido,<br /><span className="text-accent">{user.name.split(" ")[0]}</span>
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card border border-border p-6">
            <div className="text-xs font-semibold tracking-widest text-muted-foreground mb-4 uppercase">Perfil</div>
            <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center text-2xl font-black text-accent-foreground mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{user.name[0]}</div>
            <div className="font-semibold">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <button className="mt-4 text-xs text-muted-foreground hover:text-foreground underline transition-colors">Editar perfil</button>
          </div>
          {[{ label: "Pedidos totales", value: "3", sub: "desde mayo 2026" }, { label: "Total gastado", value: formatCLP(169700), sub: "en 3 compras" }].map(({ label, value, sub }) => (
            <div key={label} className="bg-card border border-border p-6">
              <div className="text-xs font-semibold tracking-widest text-muted-foreground mb-4 uppercase">{label}</div>
              <div className="text-4xl font-black tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</div>
              <div className="text-xs text-muted-foreground mt-1">{sub}</div>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div className="font-semibold text-sm">Mis pedidos</div>
            <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Ver todos</button>
          </div>
          <div className="divide-y divide-border">
            {orders.map((o) => (
              <div key={o.id} className="px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center"><ShoppingBag size={16} className="text-muted-foreground" /></div>
                  <div>
                    <div className="text-sm font-semibold">{o.product}</div>
                    <div className="text-xs text-muted-foreground">{o.id} · {o.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <StatusBadge status={o.status} />
                  <div className="text-sm font-bold">{formatCLP(o.total)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 bg-foreground text-background p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono text-background/50 mb-1 tracking-widest" style={{ fontFamily: "'DM Mono', monospace" }}>PROGRAMA FIDELIDAD</div>
            <div className="text-3xl font-black uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>340 puntos acumulados</div>
            <p className="text-sm text-background/60 mt-1">Cada $1.000 = 2 puntos. A partir de 500 puntos canjea un 10% de descuento.</p>
            <div className="mt-4 h-2 bg-white/10 rounded-full w-64 max-w-full">
              <div className="h-2 bg-accent rounded-full" style={{ width: "68%" }} />
            </div>
            <div className="text-xs text-background/40 mt-1">160 puntos para el siguiente nivel</div>
          </div>
          <button className="self-start md:self-center bg-accent text-accent-foreground font-bold px-6 py-3 text-sm hover:opacity-90 transition-opacity whitespace-nowrap">Ver recompensas</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────

function AdminDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "customers">("overview");
  const [searchProducts, setSearchProducts] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProducts = adminProductsData.filter((p) =>
    p.name.toLowerCase().includes(searchProducts.toLowerCase()) ||
    p.category.toLowerCase().includes(searchProducts.toLowerCase())
  );

  const metrics = [
    { label: "Ventas este mes", value: formatCLP(14280000), delta: "+12%", up: true, icon: TrendingUp },
    { label: "Pedidos totales", value: "847", delta: "+8%", up: true, icon: ShoppingBag },
    { label: "Clientes activos", value: "8.241", delta: "+5%", up: true, icon: Users },
    { label: "Stock crítico", value: "2 SKUs", delta: "-1", up: false, icon: Package },
  ];

  const navItems = [
    { id: "overview", label: "Resumen", icon: LayoutDashboard },
    { id: "products", label: "Productos", icon: Package },
    { id: "orders", label: "Pedidos", icon: Truck },
    { id: "customers", label: "Clientes", icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-background flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-foreground text-background flex items-center gap-2 px-4 py-3 text-sm font-medium shadow-lg">
          <CheckCircle size={15} className="text-accent" /> {notification}
        </div>
      )}
      <aside className="hidden md:flex flex-col w-60 bg-foreground text-background fixed top-0 bottom-0 left-0 z-40">
        <div className="px-6 py-5 border-b border-white/10">
          <span className="text-xl font-black tracking-tighter" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>APEX<span className="text-accent">FUEL</span></span>
          <div className="text-xs text-background/40 mt-0.5 font-mono" style={{ fontFamily: "'DM Mono', monospace" }}>ADMIN PANEL</div>
        </div>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)} className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors text-left ${activeTab === id ? "bg-accent text-accent-foreground" : "text-background/60 hover:text-background hover:bg-white/5"}`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <div className="px-4 pb-6 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-xs font-black text-accent-foreground">A</div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate">{user.name}</div>
              <div className="text-xs text-background/40 truncate">{user.email}</div>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-xs text-background/50 hover:text-background transition-colors"><LogOut size={13} /> Cerrar sesión</button>
        </div>
      </aside>
      <main className="flex-1 md:ml-60 min-h-screen">
        <header className="bg-card border-b border-border px-6 md:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-lg font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {navItems.find((n) => n.id === activeTab)?.label ?? "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"><Bell size={18} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" /></button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Settings size={18} /></button>
          </div>
        </header>
        <div className="px-6 md:px-8 py-8">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map(({ label, value, delta, up, icon: Icon }) => (
                  <div key={label} className="bg-card border border-border p-5">
                    <div className="flex justify-between items-start mb-4"><div className="text-xs text-muted-foreground font-medium">{label}</div><Icon size={16} className="text-muted-foreground" /></div>
                    <div className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</div>
                    <div className={`flex items-center gap-1 text-xs mt-1 font-medium ${up ? "text-green-600" : "text-red-500"}`}>{up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {delta} vs mes anterior</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border p-6">
                  <div className="flex items-center justify-between mb-6"><div className="font-semibold text-sm">Ventas — junio 2026</div><BarChart2 size={16} className="text-muted-foreground" /></div>
                  <div className="flex items-end gap-2 h-40">
                    {[42, 67, 55, 80, 72, 90, 58, 75, 88, 95, 70, 83, 62, 78, 91, 85, 73, 88, 60, 94, 77, 82, 69].map((v, i) => (
                      <div key={i} className="flex-1 bg-accent/20 hover:bg-accent transition-colors" style={{ height: `${v}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-2"><span>1 jun</span><span>15 jun</span><span>23 jun</span></div>
                </div>
                <div className="bg-card border border-border p-6">
                  <div className="font-semibold text-sm mb-6">Top productos</div>
                  <div className="space-y-4">
                    {adminProductsData.slice(0, 4).map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="text-xs font-mono text-muted-foreground w-4" style={{ fontFamily: "'DM Mono', monospace" }}>0{i + 1}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{p.name}</div>
                          <div className="h-1.5 bg-secondary mt-1"><div className="h-1.5 bg-accent" style={{ width: `${(p.sales / 400) * 100}%` }} /></div>
                        </div>
                        <div className="text-xs font-bold">{p.sales}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-card border border-border">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="font-semibold text-sm">Pedidos recientes</div>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">Ver todos <ChevronRight size={12} /></button>
                </div>
                <div className="divide-y divide-border">
                  {adminOrders.slice(0, 4).map((o) => (
                    <div key={o.id} className="px-6 py-3 flex flex-wrap gap-4 items-center justify-between text-sm">
                      <div className="font-mono text-muted-foreground text-xs" style={{ fontFamily: "'DM Mono', monospace" }}>{o.id}</div>
                      <div className="flex-1 min-w-0"><div className="font-medium truncate">{o.customer}</div><div className="text-xs text-muted-foreground">{o.product}</div></div>
                      <StatusBadge status={o.status} />
                      <div className="font-bold">{formatCLP(o.total)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "products" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="relative"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input value={searchProducts} onChange={(e) => setSearchProducts(e.target.value)} placeholder="Buscar producto..." className="pl-9 pr-4 py-2.5 text-sm border border-border bg-card focus:outline-none focus:border-foreground/40 transition-colors w-64" /></div>
                <button onClick={() => showNotif("Función disponible próximamente")} className="flex items-center gap-2 bg-foreground text-background text-sm font-semibold px-4 py-2.5 hover:bg-accent hover:text-accent-foreground transition-colors"><Plus size={15} /> Nuevo producto</button>
              </div>
              <div className="bg-card border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border bg-secondary">{["Producto", "Categoría", "Stock", "Precio", "Ventas", "Estado", ""].map((h) => (<th key={h} className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>))}</tr></thead>
                  <tbody className="divide-y divide-border">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-4 font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.name}</td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">{p.category}</td>
                        <td className="px-6 py-4"><span className={p.stock === 0 ? "text-red-500 font-bold" : p.stock < 15 ? "text-yellow-600 font-bold" : "font-medium"}>{p.stock === 0 ? "Agotado" : p.stock}</span></td>
                        <td className="px-6 py-4 font-bold">{formatCLP(p.price)}</td>
                        <td className="px-6 py-4 text-muted-foreground">{p.sales}</td>
                        <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                        <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => showNotif(`Editando ${p.name}...`)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Edit2 size={14} /></button><button onClick={() => showNotif(`Eliminado: ${p.name}`)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">No se encontraron productos</div>}
              </div>
            </div>
          )}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[{ label: "Procesando", value: 12, color: "bg-yellow-400" }, { label: "En tránsito", value: 38, color: "bg-blue-400" }, { label: "Entregados hoy", value: 24, color: "bg-green-400" }, { label: "Incidencias", value: 2, color: "bg-red-400" }].map(({ label, value, color }) => (
                  <div key={label} className="bg-card border border-border p-5 flex items-center gap-4"><div className={`w-3 h-3 rounded-full ${color}`} /><div><div className="text-2xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</div><div className="text-xs text-muted-foreground">{label}</div></div></div>
                ))}
              </div>
              <div className="bg-card border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border font-semibold text-sm">Todos los pedidos</div>
                <div className="divide-y divide-border">
                  {adminOrders.map((o) => (
                    <div key={o.id} className="px-6 py-4 flex flex-wrap gap-4 items-center justify-between hover:bg-secondary/50 transition-colors">
                      <div className="font-mono text-xs text-muted-foreground w-14 shrink-0" style={{ fontFamily: "'DM Mono', monospace" }}>{o.id}</div>
                      <div className="flex-1 min-w-0"><div className="font-semibold text-sm">{o.customer}</div><div className="text-xs text-muted-foreground">{o.product}</div></div>
                      <div className="text-xs text-muted-foreground hidden sm:block">{o.date}</div>
                      <StatusBadge status={o.status} />
                      <div className="font-bold text-sm w-16 text-right">{formatCLP(o.total)}</div>
                      <button onClick={() => showNotif(`Viendo pedido ${o.id}`)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Eye size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === "customers" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[{ label: "Total clientes", value: "8.241", delta: "+5% este mes" }, { label: "Nuevos (junio)", value: "342", delta: "+18% vs mayo" }, { label: "Ticket medio", value: formatCLP(54200), delta: "+$2.400 vs mayo" }].map(({ label, value, delta }) => (
                  <div key={label} className="bg-card border border-border p-6"><div className="text-xs text-muted-foreground mb-3 font-medium">{label}</div><div className="text-4xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</div><div className="text-xs text-green-600 mt-1 font-medium">{delta}</div></div>
                ))}
              </div>
              <div className="bg-card border border-border">
                <div className="px-6 py-4 border-b border-border font-semibold text-sm">Clientes recientes</div>
                <div className="divide-y divide-border">
                  {[
                    { name: "Lucía Rodríguez", email: "lucia.r@gmail.com", orders: 4, spent: formatCLP(189600), joined: "mar 2026" },
                    { name: "Diego Torres", email: "diego.t@hotmail.com", orders: 7, spent: formatCLP(312300), joined: "ene 2026" },
                    { name: "María Sánchez", email: "msanchez@icloud.com", orders: 2, spent: formatCLP(139800), joined: "may 2026" },
                    { name: "Jorge Pérez", email: "jorgeperez@gmail.com", orders: 1, spent: formatCLP(39900), joined: "jun 2026" },
                    { name: "Ana López", email: "ana.lopez@outlook.com", orders: 5, spent: formatCLP(234500), joined: "feb 2026" },
                  ].map((c) => (
                    <div key={c.email} className="px-6 py-4 flex flex-wrap gap-4 items-center justify-between hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-xs font-bold">{c.name[0]}</div>
                        <div><div className="text-sm font-semibold">{c.name}</div><div className="text-xs text-muted-foreground">{c.email}</div></div>
                      </div>
                      <div className="hidden sm:flex items-center gap-8 text-sm">
                        <div><span className="text-muted-foreground text-xs">Pedidos:</span> <strong>{c.orders}</strong></div>
                        <div><span className="text-muted-foreground text-xs">Total:</span> <strong>{c.spent}</strong></div>
                        <div><span className="text-muted-foreground text-xs">Desde:</span> <span className="text-muted-foreground">{c.joined}</span></div>
                      </div>
                      <button onClick={() => showNotif(`Viendo perfil de ${c.name}`)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Eye size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────

function Landing({
  onLoginClick,
  cart,
  onAddToCart,
  onOpenCart,
}: {
  onLoginClick: () => void;
  cart: CartItem[];
  onAddToCart: (product: typeof PRODUCTS[0]) => void;
  onOpenCart: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-2xl font-black tracking-tighter leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Machis<span className="text-accent">Suplementos</span>
          </span>
          <nav className="hidden md:flex items-center gap-8">
            {["Productos", "Beneficios", "Testimonios", "Ubicación", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace("ó", "o").replace("é", "e")}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{item}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative p-2 hover:text-accent transition-colors"
              aria-label="Carrito"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={onLoginClick} className="hidden md:flex items-center gap-1.5 border border-border text-foreground text-sm font-semibold px-3 py-2 hover:border-foreground/50 transition-colors">
              <LogIn size={14} /> Acceder
            </button>
            <a href="#productos" className="hidden md:inline-flex items-center gap-1.5 bg-foreground text-background text-sm font-semibold px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors">
              Comprar <ArrowRight size={14} />
            </a>
            <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-background border-t border-border px-6 py-4 flex flex-col gap-3">
            {["Productos", "Beneficios", "Testimonios", "Ubicación", "FAQ"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium py-1 border-b border-border" onClick={() => setMenuOpen(false)}>{item}</a>
            ))}
            <button onClick={() => { onLoginClick(); setMenuOpen(false); }} className="flex items-center gap-2 text-sm font-medium py-1"><LogIn size={14} /> Iniciar sesión</button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen bg-foreground text-background flex items-end pt-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,.15) 39px,rgba(255,255,255,.15) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,.15) 39px,rgba(255,255,255,.15) 40px)" }} />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: "#c8f135" }} />
        <div className="relative max-w-7xl mx-auto px-6 pb-20 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="order-2 md:order-1">
            <span className="inline-block text-xs font-mono tracking-[0.2em] text-accent mb-6 border border-accent/40 px-3 py-1" style={{ fontFamily: "'DM Mono', monospace" }}>SUPLEMENTACIÓN PREMIUM · CHILE</span>
            <h1 className="text-[clamp(4rem,12vw,9rem)] font-black leading-none tracking-tight mb-6 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              FUEL<br />YOUR<br /><span className="text-accent">PEAK.</span>
            </h1>
            <p className="text-background/70 text-lg max-w-md mb-10 leading-relaxed">Suplementos formulados para atletas reales. Sin marketing vacío, sin ingredientes de relleno.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#productos" className="inline-flex items-center gap-2 bg-accent text-accent-foreground font-bold text-base px-6 py-3.5 hover:bg-white transition-colors">
                Ver productos <ArrowRight size={16} />
              </a>
              <button onClick={onLoginClick} className="inline-flex items-center gap-2 border border-background/30 text-background font-medium text-base px-6 py-3.5 hover:border-background/70 transition-colors">
                <LogIn size={16} /> Iniciar sesión
              </button>
            </div>
            <div className="flex gap-10 mt-14 pt-8 border-t border-white/10">
              {[{ num: "+8.000", label: "Clientes activos" }, { num: "4.9★", label: "Valoración media" }, { num: "24h", label: "Envío express" }].map(({ num, label }) => (
                <div key={label}>
                  <div className="text-3xl font-black text-accent" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{num}</div>
                  <div className="text-xs text-background/50 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm md:max-w-xl lg:max-w-2xl">
              <div className="absolute inset-0 blur-3xl opacity-35 rounded-full scale-90" style={{ background: "#c8f135" }} />
              <img src="https://i.ibb.co/spR7D3tQ/Gemini-Generated-Image-lrjhv0lrjhv0lrjh.png" alt="Proteína MachisSuplementos" className="relative w-full h-auto object-cover drop-shadow-2xl" style={{ clipPath: "polygon(0 0,100% 4%,100% 96%,0% 100%)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-accent text-accent-foreground overflow-hidden py-3">
        <div className="flex gap-12 whitespace-nowrap" style={{ animation: "marquee 22s linear infinite" }}>
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="text-sm font-bold tracking-widest uppercase flex-shrink-0" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              ENVÍO GRATIS +$40.000 &nbsp;·&nbsp; SIN ADITIVOS OCULTOS &nbsp;·&nbsp; TESTADO EN LABORATORIO &nbsp;·&nbsp; RESULTADOS REALES &nbsp;·&nbsp;
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* PRODUCTS */}
      <section id="productos" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>01 / GAMA</span>
              <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tight mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Nuestros<br /><span className="text-muted-foreground">productos</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">Cada fórmula diseñada con ingredientes de grado farmacéutico.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="group bg-card border border-border overflow-hidden hover:border-foreground/30 transition-all duration-300">
                <div className="relative bg-secondary h-64 overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className={`absolute top-4 left-4 text-xs font-bold tracking-widest px-2.5 py-1 ${p.badgeColor}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.badge}</span>
                </div>
                <div className="p-5">
                  <div className="text-xs font-mono text-muted-foreground tracking-widest mb-1" style={{ fontFamily: "'DM Mono', monospace" }}>{p.category} · {p.weight}</div>
                  <h3 className="text-xl font-black tracking-tight mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{p.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{p.flavor}</p>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{formatCLP(p.price)}</span>
                    <button
                      onClick={() => onAddToCart(p)}
                      className="flex items-center gap-1.5 bg-foreground text-background text-xs font-semibold px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <ShoppingCart size={12} /> Añadir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="beneficios" className="py-24 px-6 bg-foreground text-background">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-mono tracking-[0.2em] text-accent" style={{ fontFamily: "'DM Mono', monospace" }}>02 / DIFERENCIAL</span>
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tight mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Por qué<br /><span className="text-accent">MachisSuplementos</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-foreground p-10 group hover:bg-accent hover:text-accent-foreground transition-colors duration-300">
                <Icon size={32} className="mb-6 text-accent group-hover:text-accent-foreground transition-colors" />
                <h3 className="text-3xl font-black uppercase tracking-tight mb-3" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{title}</h3>
                <p className="text-sm text-background/60 group-hover:text-accent-foreground/80 leading-relaxed transition-colors">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
            {[{ num: "25g", label: "Proteína por dosis" }, { num: "<2g", label: "Azúcares totales" }, { num: "100%", label: "Ingredientes trazables" }, { num: "0", label: "Rellenos innecesarios" }].map(({ num, label }) => (
              <div key={label} className="bg-foreground p-8">
                <div className="text-5xl font-black text-accent mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{num}</div>
                <div className="text-xs text-background/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonios" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>03 / COMUNIDAD</span>
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tight mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Lo que dicen<br /><span className="text-muted-foreground">nuestros atletas</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="border border-border p-8 bg-card hover:border-foreground/30 transition-colors">
                <div className="flex gap-0.5 mb-4">{Array(t.stars).fill(null).map((_, i) => <Star key={i} size={14} className="fill-accent text-accent" />)}</div>
                <p className="text-sm leading-relaxed mb-6 text-foreground/80">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-secondary" />
                  <div><div className="text-sm font-semibold">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <MapSection />

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16">
            <span className="text-xs font-mono tracking-[0.2em] text-muted-foreground" style={{ fontFamily: "'DM Mono', monospace" }}>06 / FAQ</span>
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tight mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Preguntas<br />frecuentes
            </h2>
          </div>
          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button className="w-full flex justify-between items-center py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-base pr-6">{faq.q}</span>
                  <ChevronDown size={18} className={`flex-shrink-0 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="text-sm text-muted-foreground pb-5 leading-relaxed">{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-accent text-accent-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-mono tracking-[0.2em] opacity-60" style={{ fontFamily: "'DM Mono', monospace" }}>ÚNETE A LA COMUNIDAD</span>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tight mt-2 mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            10% OFF<br />tu primer pedido
          </h2>
          <p className="text-accent-foreground/70 mb-10 max-w-md mx-auto text-sm leading-relaxed">Suscríbete y recibe consejos de entrenamiento, recetas y ofertas exclusivas.</p>
          {subscribed ? (
            <div className="inline-flex items-center gap-2 bg-foreground text-background font-bold px-8 py-4 text-sm"><CheckCircle size={15} /> ¡Suscrito! Revisa tu email</div>
          ) : (
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required className="flex-1 bg-white/20 placeholder-accent-foreground/50 text-accent-foreground border border-accent-foreground/20 px-4 py-3 text-sm focus:outline-none focus:border-accent-foreground/60" />
              <button type="submit" className="bg-foreground text-background font-bold px-6 py-3 text-sm hover:opacity-90 transition-opacity whitespace-nowrap">Quiero mi descuento</button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <span className="text-3xl font-black tracking-tighter" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Machis<span className="text-accent">Suplementos</span></span>
            <p className="text-background/50 text-sm mt-4 max-w-xs leading-relaxed">Suplementación honesta para atletas que no se conforman. Formulado en Chile, entregado en 24h.</p>
            <div className="flex gap-4 mt-6">{["Instagram", "TikTok", "YouTube"].map((sn) => (<a key={sn} href="#" className="text-xs text-background/40 hover:text-accent transition-colors">{sn}</a>))}</div>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-widest text-background/40 mb-4 uppercase">Productos</div>
            <ul className="space-y-2">{["Proteínas", "Pre-Entreno", "Creatina", "Vitaminas", "Packs"].map((item) => (<li key={item}><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">{item}</a></li>))}</ul>
          </div>
          <div>
            <div className="text-xs font-semibold tracking-widest text-background/40 mb-4 uppercase">Empresa</div>
            <ul className="space-y-2">{["Sobre nosotros", "Blog", "Contacto", "Aviso legal", "Cookies"].map((item) => (<li key={item}><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">{item}</a></li>))}</ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-background/30">
          <span>© 2026 MachisSuplementos · Todos los derechos reservados</span>
          <button onClick={onLoginClick} className="flex items-center gap-1.5 hover:text-background/60 transition-colors"><LayoutDashboard size={12} /> Panel administrador</button>
        </div>
      </footer>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState<View>("landing");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (product: typeof PRODUCTS[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: product.id, name: product.name, price: product.price, weight: product.weight, flavor: product.flavor, img: product.img, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) setCart((prev) => prev.filter((i) => i.id !== id));
    else setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  };

  const removeItem = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView(user.role === "admin" ? "admin" : "account");
  };

  const handleLogout = () => { setCurrentUser(null); setView("landing"); };

  if (view === "login") return <LoginPage onLogin={handleLogin} onBack={() => setView("landing")} />;
  if (view === "account" && currentUser) return <AccountPage user={currentUser} onLogout={handleLogout} />;
  if (view === "admin" && currentUser) return <AdminDashboard user={currentUser} onLogout={handleLogout} />;

  return (
    <>
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onQtyChange={updateQty}
        onRemove={removeItem}
      />
      <Landing
        onLoginClick={() => setView("login")}
        cart={cart}
        onAddToCart={addToCart}
        onOpenCart={() => setCartOpen(true)}
      />
    </>
  );
}
