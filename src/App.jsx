import { useState, useMemo, useEffect, useId, useRef } from 'react'
import {
  ShoppingBag, Plus, Minus, Trash2, X, Send, MapPin, Clock, Phone, Menu as MenuIcon,
  Sparkles, Camera, ArrowRight, Check, Leaf, Heart, Coffee, IceCream, Gamepad2, Tv,
} from 'lucide-react'

/* ───────────────────────── Datos ───────────────────────── */

const WHATSAPP = '523121201435'
const MAPS_URL = 'https://www.google.com/maps/place/BLISS+Coffee/@19.2835973,-103.7276689,21z/data=!4m14!1m7!3m6!1s0x84254513512ed4e5:0xcd79102c226b7517!2sDe+La+Hacienda+917-a,+Puerta+del+Centenario,+28984+Cdad.+de+Villa+de+%C3%81lvarez,+Col.!3b1!8m2!3d19.2582939!4d-103.7586815!3m5!1s0x84255b004319fd2f:0x716695dfc618f8aa!8m2!3d19.2834506!4d-103.7276661!16s%2Fg%2F11xtrl7063?entry=ttu&g_ep=EgoyMDI2MTEwMy4wIKXMDSoASAFQAw%3D%3D'
const SIZES = ['CH', 'M', 'G']
const SIZE_LABEL = { CH: 'Chico', M: 'Mediano', G: 'Grande' }

const CATEGORIES = [
  { id: 'todas', label: 'Todas' },
  { id: 'tapiocas', label: 'Tapiocas & Boba' },
  { id: 'frias', label: 'Bebidas Frías' },
  { id: 'calientes', label: 'Café Caliente' },
  { id: 'snacks', label: 'Snacks & Postres' },
]

// `sizes` => bebida configurable · `price` => precio fijo
const PRODUCTS = [
  { id: 'taro', name: 'Tapioca Taro', category: 'tapiocas', tag: 'Pop', desc: 'Taro cremoso con perlas de tapioca artesanales.', sizes: { CH: 65, M: 75, G: 85 }, art: { kind: 'cup', liquid: '#C9B1E0', topping: '#2B1E1A' } },
  { id: 'chai', name: 'Tapioca Chai', category: 'tapiocas', desc: 'Té chai especiado, leche cremosa y perlas.', sizes: { CH: 65, M: 75, G: 85 }, art: { kind: 'cup', liquid: '#D9A36B', topping: '#2B1E1A' } },
  { id: 'sunset-mango', name: 'Sunset de Mango', category: 'frias', tag: 'Fresco', desc: 'Mango natural en degradé con toque cítrico.', sizes: { CH: 65, M: 75, G: 85 }, art: { kind: 'cup', liquid: '#F7B733', liquid2: '#F58A4B' } },
  { id: 'sunset-fresa', name: 'Sunset de Fresa', category: 'frias', tag: 'Novedad', desc: 'Fresa fresca y limón, ligera y burbujeante.', sizes: { CH: 65, M: 75, G: 85 }, art: { kind: 'cup', liquid: '#F5A3A3', liquid2: '#E8567A' } },
  { id: 'cold-brew', name: 'Cold Brew Tonic', category: 'frias', tag: 'Fresco', desc: 'Café de especialidad en frío con agua tónica.', sizes: { CH: 60, M: 70, G: 80 }, art: { kind: 'cup', liquid: '#6B4A3A', liquid2: '#C9A27E' } },
  { id: 'latte-flan', name: 'Latte de Flan', category: 'calientes', tag: 'Novedad', desc: 'Espresso, leche vaporizada y caramelo de flan.', sizes: { CH: 55, M: 65, G: 75 }, art: { kind: 'mug', liquid: '#C98F5A' } },
  { id: 'americano', name: 'Café Americano', category: 'calientes', desc: 'Espresso doble, intenso y limpio.', sizes: { CH: 35, M: 45, G: 55 }, art: { kind: 'mug', liquid: '#4A2E22' } },
  { id: 'brownie', name: 'Brownie con Nieve', category: 'snacks', tag: 'Pop', desc: 'Brownie tibio con nieve de vainilla.', price: 85, art: { kind: 'plate', color: '#5A3A2C', top: '#FFF6E0' } },
  { id: 'rol', name: 'Rol Clásico', category: 'snacks', desc: 'Rol de canela recién horneado con glaseado.', price: 45, art: { kind: 'plate', color: '#D9A36B', top: '#FFFFFF' } },
  { id: 'papas', name: 'Papas Locas', category: 'snacks', desc: 'Papas crujientes con toppings de la casa.', price: 95, art: { kind: 'plate', color: '#F2C14E', top: '#E8567A' } },
  { id: 'combo-bliss', name: 'Combo Bliss', category: 'snacks', tag: 'Combo', desc: 'Café Americano + Rol Clásico.', price: 120, art: { kind: 'combo', liquid: '#4A2E22', color: '#D9A36B' } },
  { id: 'combo-mundial', name: 'Combo Mundial', category: 'snacks', tag: 'Combo', desc: 'Sunset de Mango + Papas Locas.', price: 170, art: { kind: 'combo', liquid: '#F58A4B', color: '#F2C14E' } },
]

const byId = (id) => PRODUCTS.find((p) => p.id === id)
const money = (n) => `$${n}`

/* ───────────────────── Ilustraciones SVG ───────────────────── */

const PAPER = '#FFF8E7'
const STROKE = { stroke: '#2B1E1A', strokeOpacity: 0.3, strokeWidth: 2 }

function Art({ art, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const top = art.liquid2 || art.liquid

  // Vaso translúcido: capas de bebida, hielo o perlas, popote y tapa
  const cup = (
    <g>
      <defs>
        <clipPath id={`clip${uid}`}><path d="M35 50 L85 50 L81.5 99 Q81 104 76 104 L44 104 Q39 104 38.5 99 Z" /></clipPath>
        <linearGradient id={`top${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={art.liquid} />
        </linearGradient>
      </defs>
      <path d="M64 100 L77 4" stroke="#8FA892" strokeWidth="5" strokeLinecap="round" opacity=".9" />
      <g clipPath={`url(#clip${uid})`}>
        <rect x="30" y="50" width="60" height="56" fill={PAPER} opacity=".5" />
        <rect x="30" y="56" width="60" height="50" fill={`url(#top${uid})`} opacity=".92" />
        <path d="M30 76 Q45 68 60 76 T90 76 V106 H30Z" fill={art.liquid} opacity=".85" />
        {art.topping
          ? [[44, 98], [54, 99.5], [64, 98], [74, 99.5], [49, 90.5], [59, 91.5], [69, 90.5]].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="4.5" fill={art.topping} />
                <circle cx={cx - 1.4} cy={cy - 1.5} r="1.3" fill={PAPER} opacity=".45" />
              </g>
            ))
          : [[43, 58, -12], [60, 63, 10], [72, 57, -4]].map(([x, y, r], i) => (
              <rect key={i} x={x} y={y} width="12" height="12" rx="3" transform={`rotate(${r} ${x + 6} ${y + 6})`} fill={PAPER} fillOpacity=".4" stroke={PAPER} strokeOpacity=".8" />
            ))}
      </g>
      <path d="M35 50 L85 50 L81.5 99 Q81 104 76 104 L44 104 Q39 104 38.5 99 Z" fill="none" {...STROKE} />
      <path d="M40 58 L43 94" stroke={PAPER} strokeWidth="3" strokeLinecap="round" opacity=".7" />
      <rect x="31" y="42" width="58" height="10" rx="5" fill={PAPER} fillOpacity=".9" {...STROKE} />
    </g>
  )

  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-hidden="true">
      {art.kind === 'cup' && cup}
      {art.kind === 'mug' && (
        <g>
          <ellipse cx="60" cy="108" rx="40" ry="6" fill="#2B1E1A" opacity=".08" />
          <path d="M28 46 H84 V82 Q84 104 56 104 Q28 104 28 82 Z" fill={PAPER} {...STROKE} />
          <path d="M84 56 Q104 56 102 74 Q100 90 82 88" fill="none" stroke={PAPER} strokeWidth="7" />
          <ellipse cx="56" cy="46" rx="28" ry="7" fill={art.liquid} />
          <path d="M44 46 Q56 41 68 46" stroke={PAPER} strokeWidth="2.5" fill="none" opacity=".7" />
          <path d="M50 30 Q46 22 52 16 M62 30 Q58 22 64 14" stroke="#8FA892" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      )}
      {art.kind === 'plate' && (
        <g>
          <ellipse cx="60" cy="88" rx="46" ry="12" fill={PAPER} {...STROKE} />
          <rect x="30" y="52" width="60" height="34" rx="9" fill={art.color} />
          <ellipse cx="60" cy="52" rx="26" ry="14" fill={art.top} />
          <circle cx="60" cy="40" r="5" fill="#F0C4D0" stroke="#2B1E1A" strokeOpacity=".3" />
        </g>
      )}
      {art.kind === 'combo' && (
        <g>
          <g transform="translate(-14 4) scale(.82)" style={{ transformOrigin: '60px 60px' }}>{cup}</g>
          <ellipse cx="82" cy="98" rx="30" ry="9" fill={PAPER} {...STROKE} />
          <rect x="62" y="74" width="40" height="24" rx="8" fill={art.color} />
          <ellipse cx="82" cy="74" rx="18" ry="9" fill={PAPER} />
        </g>
      )}
    </svg>
  )
}

/* Line art botánico decorativo con parálax sutil (solo vista) */
function Leaf1({ className }) {
  return (
    <svg viewBox="0 0 120 160" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M60 156 C58 110 62 60 60 8" />
      <path d="M60 130 C30 125 14 100 12 74 C40 76 58 98 60 130Z" />
      <path d="M60 96 C90 92 106 70 108 44 C80 46 62 66 60 96Z" />
      <path d="M60 56 C38 52 28 34 28 16 C48 18 60 34 60 56Z" />
    </svg>
  )
}
function CupLine({ className }) {
  return (
    <svg viewBox="0 0 80 120" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 34 L66 34 L60 108 Q59 114 53 114 L27 114 Q21 114 20 108 Z" />
      <rect x="10" y="26" width="60" height="9" rx="4.5" />
      <path d="M44 26 L54 4" />
      {[[28, 100], [40, 102], [52, 100], [34, 90], [46, 91]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" />)}
      <path d="M20 58 Q40 50 62 58" />
    </svg>
  )
}

function Botanicals() {
  const layer = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = { raf: 0 }
    const onScroll = () => {
      cancelAnimationFrame(t.raf)
      t.raf = requestAnimationFrame(() => {
        layer.current?.querySelectorAll('[data-speed]').forEach((el) => {
          el.style.transform = `translateY(${window.scrollY * Number(el.dataset.speed)}px)`
        })
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(t.raf) }
  }, [])
  return (
    <div ref={layer} className="pointer-events-none fixed inset-0 z-0 overflow-hidden text-sage/25" aria-hidden="true">
      <div data-speed="-0.06" className="absolute -left-8 top-40 w-32 rotate-12 sm:w-44"><Leaf1 className="w-full" /></div>
      <div data-speed="-0.12" className="absolute -right-6 top-[28rem] w-28 -rotate-12 sm:w-40"><CupLine className="w-full" /></div>
      <div data-speed="-0.04" className="absolute left-[8%] top-[75vh] w-24 -rotate-6 sm:w-36"><Leaf1 className="w-full" /></div>
      <div data-speed="-0.09" className="absolute right-[6%] top-[130vh] w-28 rotate-6 sm:w-40"><Leaf1 className="w-full" /></div>
      <div data-speed="-0.07" className="absolute left-[3%] top-[190vh] w-24 sm:w-32"><CupLine className="w-full" /></div>
    </div>
  )
}

function BobaLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-cream" role="status" aria-label="Cargando">
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="boba-dot h-5 w-5 rounded-full bg-espresso" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
      <p className="kicker">Preparando tu momento Bliss…</p>
    </div>
  )
}

function Marquee({ items, className = '' }) {
  const row = [...items, ...items]
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap py-3">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-8 font-bold uppercase tracking-[0.12em]">
            {t} <Sparkles size={16} />
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────── Componentes UI ───────────────────── */

function SizeSelector({ value, onChange, sizes }) {
  return (
    <div className="flex gap-1 rounded-full bg-cream p-1 border border-sage/30" role="radiogroup" aria-label="Tamaño">
      {SIZES.map((s) => (
        <button type="button"
          key={s}
          role="radio"
          aria-checked={value === s}
          title={`${SIZE_LABEL[s]} · ${money(sizes[s])}`}
          onClick={() => onChange(s)}
          className={`flex-1 rounded-full py-1 text-xs font-semibold transition ${
            value === s ? 'bg-espresso text-cream shadow-sm' : 'text-espresso/80 hover:text-espresso'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}

function ProductCard({ product, onAdd }) {
  const [size, setSize] = useState('M')
  const [added, setAdded] = useState(false)
  const price = product.sizes ? product.sizes[size] : product.price
  const tagStyle = product.tag === 'Combo' || product.tag === 'Pop' ? 'bg-rose' : 'bg-sage-soft'

  const handleAdd = () => {
    onAdd(product.id, product.sizes ? size : null)
    setAdded(true)
    setTimeout(() => setAdded(false), 1000)
  }

  return (
    <article className="group flex flex-col rounded-3xl border border-sage/30 bg-paper p-3 sm:p-4 shadow-clay transition duration-300 hover:-translate-y-1 hover:shadow-clay-lg animate-fade-up">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-cream bg-linear-to-b from-sage-soft/45 to-transparent">
        <div className="absolute inset-x-6 bottom-3 h-4 rounded-full bg-espresso/10 blur-md" />
        {product.tag && (
          <span className={`absolute left-2 top-2 z-10 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-espresso ${tagStyle}`}>
            {product.tag}
          </span>
        )}
        <Art art={product.art} className="relative h-[82%] w-[82%] transition duration-500 ease-out group-hover:scale-[1.03] group-hover:-rotate-2" />
      </div>
      <h3 className="mt-3 text-base font-bold leading-tight sm:text-lg">{product.name}</h3>
      <p className="mt-1 flex-1 text-sm text-espresso/80">{product.desc}</p>
      <div className="mt-3 space-y-3">
        {product.sizes && <SizeSelector value={size} onChange={setSize} sizes={product.sizes} />}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl font-extrabold" aria-live="polite">{money(price)}</span>
          <button
            type="button"
            onClick={handleAdd}
            className={`btn-flow inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-bold text-espresso shadow-sm active:scale-95 ${
              added ? 'bg-sage-soft' : 'bg-honey'
            }`}
          >
            {added ? <Check size={16} /> : <Plus size={16} />}
            {added ? 'Listo' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}

/* ───────────────────── Checkout modal ───────────────────── */

function CheckoutModal({ lines, total, onClose, onDone }) {
  const [form, setForm] = useState({ name: '', delivery: 'Para Recoger en Sucursal', address: '', payment: 'Efectivo', notes: '' })
  const [touched, setTouched] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const isDelivery = form.delivery !== 'Para Recoger en Sucursal'
  const invalid = !form.name.trim() || (isDelivery && !form.address.trim())

  const handleSendWhatsApp = (e) => {
    e.preventDefault()
    setTouched(true)
    if (invalid) return
    const LINE = '-'.repeat(40)
    const BAR = '='.repeat(40)
    const items = lines.map((l) => `- ${l.qty}x ${l.name} (${l.size || 'Paquete'}) | ${money(l.price * l.qty)}`)
    const msg = [
      BAR,
      'NUEVO PEDIDO — BLISS COFFEE',
      BAR,
      '',
      `CLIENTE: ${form.name.trim().toUpperCase()}`,
      `ENTREGA: ${form.delivery.toUpperCase()}`,
      ...(isDelivery ? [`DIRECCION: ${form.address.trim().toUpperCase()}`] : []),
      `PAGO: ${form.payment.toUpperCase()}`,
      '',
      'DESGLOSE DE PRODUCTOS:',
      LINE,
      ...items,
      LINE,
      '',
      `TOTAL A PAGAR: ${money(total)} MXN`,
      ...(form.notes.trim() ? ['', 'NOTAS DE PREPARACION:', form.notes.trim()] : []),
      '',
      BAR,
    ].join('\n')
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener')
    onDone()
  }

  const field = 'w-full rounded-2xl border border-sage/40 bg-cream px-4 py-3 text-sm outline-none focus:border-espresso focus:ring-2 focus:ring-honey'
  const label = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-espresso/80'

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-espresso/50 backdrop-blur-sm p-0 sm:p-4" onClick={onClose}>
      <form
        onSubmit={handleSendWhatsApp} noValidate
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-paper p-6 shadow-xl animate-fade-up"
        role="dialog" aria-modal="true" aria-label="Finalizar pedido"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-extrabold">Finalizar pedido</h2>
            <p className="text-sm text-espresso/80">Lo enviaremos por WhatsApp a Bliss Coffee.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Cerrar" className="rounded-full p-2 hover:bg-cream"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={label} htmlFor="name">Nombre completo</label>
            <input id="name" className={field} value={form.name} onChange={set('name')} placeholder="Ej. María López" required autoComplete="name" aria-invalid={touched && !form.name.trim()} aria-describedby="name-err" />
            {touched && !form.name.trim() && <p id="name-err" role="alert" className="mt-1 text-xs text-berry">Escribe tu nombre (no solo espacios).</p>}
          </div>
          <div>
            <label className={label} htmlFor="delivery">Tipo de entrega</label>
            <select id="delivery" className={field} value={form.delivery} onChange={set('delivery')}>
              <option>Para Recoger en Sucursal</option>
              <option>Entrega a Domicilio / Uber/DiDi</option>
            </select>
          </div>
          {isDelivery && (
            <div>
              <label className={label} htmlFor="address">Dirección de entrega</label>
              <input id="address" className={field} value={form.address} onChange={set('address')} placeholder="Calle, número, colonia" />
              {touched && !form.address.trim() && <p className="mt-1 text-xs text-berry">Indica la dirección.</p>}
            </div>
          )}
          <div>
            <label className={label} htmlFor="payment">Método de pago</label>
            <select id="payment" className={field} value={form.payment} onChange={set('payment')}>
              <option>Efectivo</option>
              <option>Transferencia</option>
              <option>Tarjeta en Sucursal</option>
            </select>
          </div>
          <div>
            <label className={label} htmlFor="notes">Notas adicionales</label>
            <textarea id="notes" rows={2} className={field} value={form.notes} onChange={set('notes')} placeholder="Menos azúcar, sin hielo…" />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
          <span className="text-sm text-espresso/85">{lines.reduce((n, l) => n + l.qty, 0)} productos</span>
          <span className="text-xl font-extrabold">{money(total)}</span>
        </div>

        <button type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-honey py-3.5 font-bold text-espresso shadow-sm transition hover:bg-amber active:scale-[.98]">
          <Send size={18} /> Enviar pedido por WhatsApp
        </button>
      </form>
    </div>
  )
}

/* ───────────────────── App ───────────────────── */

export default function App() {
  const [category, setCategory] = useState('todas')
  const [cart, setCart] = useState([]) // [{key, id, size, qty}]
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [bump, setBump] = useState(0)
  const [toast, setToast] = useState(null)
  const [now, setNow] = useState(() => new Date())
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 700); return () => clearTimeout(t) }, [])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(t)
  }, [])
  const isOpen = now.getHours() >= 8 && now.getHours() < 22

  const addToCart = (id, size = null) => {
    const key = `${id}:${size || '-'}`
    setCart((c) => (c.some((i) => i.key === key)
      ? c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))
      : [...c, { key, id, size, qty: 1 }]))
    setBump((b) => b + 1)
    setToast(byId(id).name)
  }
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(t)
  }, [toast, bump])

  const changeQty = (key, d) =>
    setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: i.qty + d } : i)).filter((i) => i.qty > 0))
  const removeItem = (key) => setCart((c) => c.filter((i) => i.key !== key))

  const lines = useMemo(() => cart.map((i) => {
    const p = byId(i.id)
    return { ...i, name: p.name, art: p.art, price: p.sizes ? p.sizes[i.size] : p.price }
  }), [cart])
  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines])
  const total = useMemo(() => lines.reduce((n, l) => n + l.qty * l.price, 0), [lines])
  const visible = useMemo(
    () => (category === 'todas' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category],
  )

  const goMenu = () => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  const openCart = () => setCartOpen(true)

  if (!ready) return <BobaLoader />

  const NAV = [['Inicio', '#inicio'], ['Especiales', '#especiales'], ['Menú', '#menu'], ['Ubicación', '#ubicacion']]
  const mango = byId('sunset-mango')
  const taro = byId('taro')

  return (
    <div className="relative isolate min-h-screen bg-cream text-espresso pb-24 md:pb-0">
      <Botanicals />
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-sage/20 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <a href="#inicio" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-honey shadow-sm"><Coffee size={20} /></span>
            <span className="leading-tight">
              <span className="block text-base font-extrabold tracking-tight">Bliss Coffee</span>
              <span className="block text-[11px] text-espresso/80">Café & Tapiocas</span>
            </span>
          </a>

          <span className={`hidden lg:inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${isOpen ? 'bg-sage/20 text-moss' : 'bg-espresso/10 text-espresso/85'}`}>
            <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-sage animate-pulse' : 'bg-espresso/40'}`} />
            {isOpen ? 'Abierto ahora — Plaza Hacienda' : 'Cerrado — abrimos a las 8:00 AM'}
          </span>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV.map(([l, h]) => <a key={l} href={h} className="text-espresso/85 transition hover:text-espresso">{l}</a>)}
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" onClick={openCart} aria-label={`Abrir carrito, ${count} productos`} className="relative rounded-full bg-espresso p-3 text-cream shadow-sm transition hover:scale-105">
              <ShoppingBag size={20} />
              {count > 0 && (
                <span key={bump} className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-honey px-1 text-[11px] font-extrabold text-espresso animate-pop">
                  {count}
                </span>
              )}
            </button>
            <button type="button" onClick={() => setNavOpen((o) => !o)} aria-label="Menú" className="md:hidden rounded-full p-2.5 hover:bg-paper">
              {navOpen ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>
        {navOpen && (
          <nav className="md:hidden border-t border-sage/20 bg-cream px-4 py-3">
            {NAV.map(([l, h]) => (
              <a key={l} href={h} onClick={() => setNavOpen(false)} className="block rounded-xl px-3 py-2.5 font-medium hover:bg-paper">{l}</a>
            ))}
            <span className="mt-2 inline-flex items-center gap-1.5 px-3 text-xs font-semibold text-moss">
              <span className={`h-2 w-2 rounded-full ${isOpen ? 'bg-sage' : 'bg-espresso/40'}`} />
              {isOpen ? 'Abierto ahora — Plaza Hacienda' : 'Cerrado — abrimos a las 8:00 AM'}
            </span>
          </nav>
        )}
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section id="inicio" className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-16 pt-10 md:grid-cols-12 md:pt-16">
          <div className="md:col-span-7">
            <p className="kicker">Café · Tapiocas · Repostería · Villa de Álvarez</p>
            <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              Tu dosis diaria de <span className="relative inline-block text-moss">
                felicidad
                <svg className="absolute -bottom-2 left-0 w-full text-rose" viewBox="0 0 200 12" fill="none" aria-hidden="true"><path d="M2 8 Q50 0 100 6 T198 5" stroke="currentColor" strokeWidth="5" strokeLinecap="round" /></svg>
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-espresso/85">
              Tapiocas artesanales, café de especialidad y postres recién horneados en Villa de Álvarez, Colima.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={goMenu} className="btn-flow inline-flex items-center justify-center gap-2 rounded-full bg-honey px-8 py-4 font-bold text-espresso shadow-clay active:scale-95">
                Pedir en Línea <ArrowRight size={18} />
              </button>
              <a href="#ubicacion" className="inline-flex items-center justify-center rounded-full border-2 border-moss px-8 py-4 font-bold text-moss transition hover:bg-sage-soft/40">
                Ver Ubicación & Horarios
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-espresso/85">
              <li className="flex items-center gap-2"><Leaf size={16} className="text-moss" /> Perlas hechas cada mañana</li>
              <li className="flex items-center gap-2"><Coffee size={16} className="text-moss" /> Café de especialidad</li>
              <li className="flex items-center gap-2"><Heart size={16} className="text-moss" /> Hecho con cariño local</li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-md md:col-span-5">
            <div className="relative aspect-square bg-sage-soft shadow-clay-lg [border-radius:42%_58%_55%_45%/50%_42%_58%_50%]">
              <div className="absolute inset-6 border-2 border-dashed border-espresso/20 [border-radius:inherit]" />
              <Art art={mango.art} className="animate-floaty absolute inset-[8%] h-[84%] w-[84%] drop-shadow-2xl" />
              <span className="animate-floaty absolute -left-2 top-8 inline-flex items-center gap-1 rounded-full bg-espresso px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cream shadow-clay [--r:-6deg]">
                <Sparkles size={13} className="text-honey" /> Más Vendido
              </span>
              <span className="animate-floaty absolute -right-2 top-1/3 rounded-full bg-rose px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-espresso shadow-clay [--r:5deg]">
                En tendencia
              </span>
            </div>
            <div className="relative -mt-10 ml-auto flex w-[88%] items-center justify-between gap-3 rounded-3xl border border-sage/30 bg-paper p-4 shadow-clay-lg">
              <div>
                <h3 className="text-lg font-extrabold leading-tight">{mango.name}</h3>
                <p className="text-sm text-espresso/80">Mediano · {money(mango.sizes.M)}</p>
              </div>
              <button type="button" onClick={() => addToCart(mango.id, 'M')} aria-label="Agregar Sunset de Mango al carrito" className="btn-flow flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-honey text-espresso shadow-sm active:scale-90">
                <Plus size={22} />
              </button>
            </div>
          </div>
        </section>

        <Marquee
          className="border-y border-espresso/15 bg-rose text-espresso"
          items={['Tu momento de felicidad cotidiana', 'Perlas frescas todos los días', 'Hecho en Villa de Álvarez', 'Sip · Smile · Repeat']}
        />

        {/* Bento */}
        <section id="especiales" className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Especiales de la casa</h2>
            <p className="text-espresso/80">Combos pensados para compartir (o no).</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
            <div className="relative overflow-hidden rounded-3xl bg-espresso p-7 text-cream shadow-xl md:col-span-2 md:row-span-2 md:p-10">
              <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-sage/30 blur-2xl" />
              <div className="relative grid items-center gap-6 sm:grid-cols-2">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-honey px-3 py-1 text-xs font-bold text-espresso"><Heart size={12} /> La Favorita</span>
                  <h3 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">Tapioca Taro<br />Specially Crafted</h3>
                  <p className="mt-3 max-w-xs text-cream/75">
                    Perlas de tapioca artesanales cocidas cada mañana, sobre una base cremosa de taro. Dulce, suave y adictiva.
                  </p>
                  <button type="button" onClick={() => addToCart(taro.id, 'M')} className="mt-6 inline-flex items-center gap-2 rounded-full bg-honey px-6 py-3 font-bold text-espresso transition hover:bg-amber active:scale-95">
                    <Plus size={18} /> Agregar al Carrito - {money(taro.sizes.M)}
                  </button>
                </div>
                <Art art={taro.art} className="mx-auto h-56 w-56 drop-shadow-2xl sm:h-64 sm:w-64" />
              </div>
            </div>

            {[
              { p: byId('combo-bliss'), title: 'Combo Bliss', sub: 'Café Americano + Rol Clásico', bg: 'bg-paper border-sage/30' },
              { p: byId('combo-mundial'), title: 'Combo Mundial', sub: 'Sunset de Mango + Papas Locas', bg: 'bg-sage/20 border-sage/40' },
            ].map(({ p, title, sub, bg }) => (
              <div key={p.id} className={`flex items-center justify-between gap-3 rounded-3xl border p-6 shadow-sm transition hover:shadow-xl ${bg}`}>
                <div>
                  <h3 className="text-xl font-extrabold">{title}</h3>
                  <p className="mt-1 text-sm text-espresso/85">{sub}</p>
                  <p className="mt-2 text-2xl font-extrabold">{money(p.price)}</p>
                  <button type="button" onClick={() => addToCart(p.id)} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-honey px-4 py-2 text-sm font-bold transition hover:bg-amber active:scale-95">
                    <Plus size={16} /> Añadir combo
                  </button>
                </div>
                <Art art={p.art} className="h-28 w-28 shrink-0" />
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-6" aria-label="Frase de la casa">
          <div className="relative overflow-hidden rounded-3xl bg-rose p-8 text-center shadow-clay sm:p-12">
            <Leaf className="absolute -left-4 -top-4 h-24 w-24 -rotate-12 text-espresso/10" strokeWidth={1.5} aria-hidden="true" />
            <Leaf className="absolute -bottom-6 -right-4 h-28 w-28 rotate-45 text-espresso/10" strokeWidth={1.5} aria-hidden="true" />
            <p className="kicker !text-espresso">Dato 100% científico</p>
            <p className="relative mx-auto mt-3 max-w-2xl text-2xl font-extrabold uppercase leading-snug tracking-wide sm:text-3xl">
              Esta rana es verde. Si la ves rosa, necesitas una tapioca.
            </p>
          </div>
        </section>

        {/* Menú */}
        <section id="menu" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Nuestro menú</h2>
          <p className="text-espresso/80">Elige tu tamaño y arma tu pedido.</p>

          <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-2" role="tablist">
            <div className="flex w-max gap-2">
              {CATEGORIES.map((c) => {
                const active = category === c.id
                return (
                  <button type="button"
                    key={c.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(c.id)}
                    className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
                      active ? 'border-honey bg-honey shadow-sm' : 'border-sage/40 bg-paper text-espresso/85 hover:border-sage hover:bg-sage/10'
                    }`}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
          </div>
        </section>

        {/* Ubicación */}
        <section id="ubicacion" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
          <div className="grid gap-5 lg:grid-cols-5">
            <div className="rounded-3xl border border-sage/30 bg-sage-soft p-7 shadow-clay lg:col-span-2">
              <p className="kicker !text-espresso">Ven a platicar</p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Visítanos</h2>
              <p className="mt-3 flex items-start gap-2 text-lg"><MapPin className="mt-1 shrink-0" size={20} /> Plaza Hacienda 917-A, Villa de Álvarez, Colima</p>
              <p className="mt-3 flex items-center gap-2 font-semibold"><Clock size={20} /> Todos los días de 8:00 AM a 10:00 PM</p>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="btn-flow mt-6 inline-flex items-center gap-2 rounded-full bg-honey px-6 py-3 font-bold text-espresso shadow-sm active:scale-95">
                <MapPin size={18} /> Abrir en Google Maps
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:col-span-3">
              {[
                { icon: Gamepad2, bg: 'bg-paper', t: 'Noche de Mario Kart', d: 'Trae a tu equipo y compite con una tapioca en mano.' },
                { icon: Tv, bg: 'bg-rose', t: 'Transmisiones en vivo', d: 'Partidos y eventos en pantalla, con buen café.' },
                { icon: Leaf, bg: 'bg-paper', t: 'Comunidad Bliss', d: 'Eventos locales y sorpresas. Pregunta por la próxima fecha.' },
              ].map(({ icon: Icon, bg, t, d }) => (
                <article key={t} className={`flex flex-col rounded-3xl border border-sage/30 p-5 shadow-clay transition hover:-translate-y-1 ${bg}`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sage-soft"><Icon size={22} /></span>
                  <h3 className="mt-4 font-bold leading-tight">{t}</h3>
                  <p className="mt-1 text-sm text-espresso/80">{d}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="kicker">En el feed</p>
                <h2 className="text-2xl font-extrabold sm:text-3xl">Nuestra comunidad</h2>
              </div>
              <span className="flex items-center gap-2 text-sm font-semibold text-moss"><Camera size={16} /> #BlissCoffeeColima</span>
            </div>
            <div className="grid auto-rows-[7rem] grid-cols-2 gap-3 sm:auto-rows-[9rem] md:grid-cols-4">
              {[
                { c: 'col-span-2 row-span-2', bg: 'bg-sage-soft', art: byId('sunset-mango').art },
                { c: '', bg: 'bg-rose', art: byId('brownie').art },
                { c: '', bg: 'bg-paper', art: byId('taro').art },
                { c: 'col-span-2', bg: 'bg-espresso', quote: 'Sip, smile, repeat.' },
                { c: '', bg: 'bg-[#F7ECCE]', art: byId('latte-flan').art },
                { c: '', bg: 'bg-sage-soft', art: byId('combo-bliss').art },
              ].map((t, i) => (
                <div key={i} className={`group flex items-center justify-center overflow-hidden rounded-3xl border border-sage/25 shadow-clay ${t.c} ${t.bg}`}>
                  {t.art
                    ? <Art art={t.art} className="h-4/5 w-4/5 transition duration-500 group-hover:scale-[1.03]" />
                    : <p className="px-4 text-center text-xl font-extrabold uppercase tracking-widest text-cream sm:text-2xl">{t.quote}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-8 border-t border-sage/30 bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-espresso/85 md:flex-row">
          <p>© {now.getFullYear()} Bliss Coffee: Café & Tapiocas. Todos los derechos reservados.</p>
          <nav className="flex gap-5">{NAV.map(([l, h]) => <a key={l} href={h} className="hover:text-espresso">{l}</a>)}</nav>
          <a href="tel:+523121201435" className="inline-flex items-center gap-2 font-semibold text-espresso"><Phone size={16} /> 312 120 1435</a>
        </div>
      </footer>

      {/* Barra móvil */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 p-3 md:hidden">
          <button type="button" onClick={openCart} className="flex w-full items-center justify-between rounded-full bg-espresso px-6 py-4 text-cream shadow-xl active:scale-[.98]">
            <span className="text-lg font-extrabold">{money(total)}</span>
            <span className="flex items-center gap-2 rounded-full bg-honey px-4 py-1.5 text-sm font-bold text-espresso">
              <ShoppingBag size={16} /> Ver Carrito ({count})
            </span>
          </button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 top-20 z-[60] -translate-x-1/2 animate-fade-up rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-cream shadow-xl">
          <Check size={14} className="mr-1 inline text-honey" /> {toast} agregado
        </div>
      )}

      {/* Carrito drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-espresso/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-paper shadow-xl animate-slide-in" role="dialog" aria-label="Carrito">
            <div className="flex items-center justify-between border-b border-sage/20 p-5">
              <h2 className="text-xl font-extrabold">Tu pedido {count > 0 && <span className="text-espresso/80">({count})</span>}</h2>
              <button type="button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito" className="rounded-full p-2 hover:bg-cream"><X size={20} /></button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-cream"><IceCream size={36} className="text-sage" /></span>
                <p className="font-bold">Tu carrito está vacío</p>
                <p className="text-sm text-espresso/80">Agrega una tapioca o un café para empezar.</p>
                <button type="button" onClick={() => { setCartOpen(false); goMenu() }} className="mt-2 rounded-full bg-honey px-6 py-3 font-bold">Ver menú</button>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto p-5">
                  {lines.map((l) => (
                    <li key={l.key} className="flex gap-3 rounded-2xl border border-sage/25 bg-cream p-3">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-paper"><Art art={l.art} className="h-12 w-12" /></div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold leading-tight">{l.name}</p>
                            <p className="text-xs text-espresso/80">{l.size ? `${SIZE_LABEL[l.size]} · ` : ''}{money(l.price)} c/u</p>
                          </div>
                          <button type="button" onClick={() => removeItem(l.key)} aria-label={`Eliminar ${l.name}`} className="rounded-full p-1.5 text-espresso/80 hover:bg-paper hover:text-berry"><Trash2 size={16} /></button>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full bg-paper p-0.5 shadow-sm">
                            <button type="button" onClick={() => changeQty(l.key, -1)} aria-label="Menos" className="rounded-full p-1.5 hover:bg-cream"><Minus size={14} /></button>
                            <span className="w-6 text-center text-sm font-bold">{l.qty}</span>
                            <button type="button" onClick={() => changeQty(l.key, 1)} aria-label="Más" className="rounded-full p-1.5 hover:bg-cream"><Plus size={14} /></button>
                          </div>
                          <span className="font-extrabold">{money(l.price * l.qty)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="space-y-4 border-t border-sage/20 p-5">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-extrabold">{money(total)}</span>
                  </div>
                  <button type="button" onClick={() => { setCartOpen(false); setCheckoutOpen(true) }} className="flex w-full items-center justify-center gap-2 rounded-full bg-honey py-4 font-bold shadow-sm transition hover:bg-amber active:scale-[.98]">
                    Finalizar pedido <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <CheckoutModal
          lines={lines}
          total={total}
          onClose={() => setCheckoutOpen(false)}
          onDone={() => { setCheckoutOpen(false); setCart([]) }}
        />
      )}
    </div>
  )
}
