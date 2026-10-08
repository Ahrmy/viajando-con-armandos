import { useEffect, useState, type FormEvent } from 'react'
import './App.css'
import { supabase } from './lib/supabaseClient'
import { useAuth } from './context/AuthContext'
import Login from './components/Login'

type IconName = 'grid' | 'map' | 'wallet' | 'sparkles' | 'settings' | 'plus' | 'arrow' | 'pin' | 'calendar' | 'users' | 'check' | 'clock' | 'plane' | 'close' | 'link' | 'send'

const iconPaths: Record<IconName, string> = {
  grid: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
  map: 'M3 6 8 3l8 3 5-3v15l-5 3-8-3-5 3z M8 3v15 M16 6v15',
  wallet: 'M4 6.5h15a2 2 0 0 1 2 2V19H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h13 M2 7h17 M15 13h6',
  sparkles: 'm12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 2.9-.2-.1a1.7 1.7 0 0 0-1.9.3l-.1.1h-3.4l-.1-.2a1.7 1.7 0 0 0-1.6-1l-.2.1-2.9-1.7.1-.2a1.7 1.7 0 0 0-.3-1.9l-.1-.1v-3.4l.2-.1a1.7 1.7 0 0 0 1-1.6l-.1-.2 1.7-2.9.2.1a1.7 1.7 0 0 0 1.9-.3l.1-.1h3.4l.1.2a1.7 1.7 0 0 0 1.6 1l.2-.1 2.9 1.7-.1.2a1.7 1.7 0 0 0 .3 1.9l.1.1v3.4z',
  plus: 'M12 5v14 M5 12h14',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  pin: 'M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0z M12 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  calendar: 'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16',
  users: 'M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8',
  check: 'm5 12 4 4L19 6',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
  plane: 'm22 2-7 20-4-9-9-4z M22 2 11 13',
  close: 'M18 6 6 18 M6 6l12 12',
  link: 'M10 13a5 5 0 0 0 7.1 0l3-3A5 5 0 0 0 13 2.9l-1.7 1.7 M14 11a5 5 0 0 0-7.1 0l-3 3A5 5 0 0 0 11 21.1l1.7-1.7',
  send: 'm22 2-7 20-4-9-9-4z M22 2 11 13',
}

function Icon({ name, size = 19 }: { name: IconName; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={iconPaths[name]} />
    </svg>
  )
}

const initialTasks = [
  { id: 1, label: 'Mirar vuelos para toda la familia', who: 'Mamá', done: true },
  { id: 2, label: 'Elegir alojamiento en Lisboa', who: 'Papá', done: false },
  { id: 3, label: 'Revisar documentación', who: 'Todos', done: false },
]

const initialDestinations = [
  { name: 'Lisboa', country: 'Portugal', days: '4 noches', image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85', emoji: '🇵🇹' },
  { name: 'Oporto', country: 'Portugal', days: '3 noches', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85', emoji: '🇵🇹' },
]

function Dashboard() {
  const { profile, user, signOut } = useAuth()
  const [activeNav, setActiveNav] = useState('Resumen')
  const [destinations, setDestinations] = useState(initialDestinations)
  const [tasks, setTasks] = useState(initialTasks)
  const [modal, setModal] = useState<'destination' | 'invite' | null>(null)
  const [destinationName, setDestinationName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [toast, setToast] = useState('')
  const [dbStatus, setDbStatus] = useState<'conectando' | 'conectado' | 'error'>('conectando')
  const completedTasks = tasks.filter((task) => task.done).length
  const profileName = profile?.full_name ?? 'Viajero'
  const profileInitial = profileName.trim().charAt(0).toUpperCase() || 'V'
  const profileSubtitle = user?.email ?? ''

  useEffect(() => {
    supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error de Supabase:', error.message)
          setDbStatus('error')
        } else {
          console.log('Conectado a Supabase:', data)
          setDbStatus('conectado')
        }
      })
  }, [])

  const goTo = (section: string, id: string) => {
    setActiveNav(section)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const showToast = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const addDestination = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = destinationName.trim()
    if (!name) return
    setDestinations((current) => [...current, {
      name,
      country: 'Por descubrir',
      days: 'Por planificar',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
      emoji: '📍',
    }])
    setDestinationName('')
    setModal(null)
    showToast(`${name} se ha añadido al viaje`)
  }

  const inviteFamily = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setModal(null)
    setInviteEmail('')
    showToast('¡Invitación lista para compartir!')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="#inicio" className="brand" aria-label="Viajando con Armandos, inicio">
          <span className="brand-mark"><Icon name="plane" size={20} /></span>
          <span>viajando<span className="brand-light">con</span><br /><strong>Armandos</strong></span>
        </a>

        <div className="trip-switcher">
          <div className="trip-thumb"><img src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=120&q=80" alt="" /></div>
          <div className="trip-switcher-copy"><small>VIAJE EN FAMILIA</small><strong>Verano 2027</strong></div>
          <span className="chevron">⌄</span>
        </div>

        <p className="nav-caption">PLANIFICA</p>
        <nav className="main-nav" aria-label="Navegación principal">
          <button className={activeNav === 'Resumen' ? 'nav-item active' : 'nav-item'} onClick={() => goTo('Resumen', 'inicio')}><Icon name="grid" /><span>Vista general</span></button>
          <button className={activeNav === 'Itinerario' ? 'nav-item active' : 'nav-item'} onClick={() => goTo('Itinerario', 'destinos')}><Icon name="map" /><span>Itinerario</span><span className="nav-count">{destinations.length}</span></button>
          <button className={activeNav === 'Presupuesto' ? 'nav-item active' : 'nav-item'} onClick={() => goTo('Presupuesto', 'presupuesto')}><Icon name="wallet" /><span>Presupuesto</span></button>
          <button className={activeNav === 'Ideas' ? 'nav-item active' : 'nav-item'} onClick={() => goTo('Ideas', 'ideas')}><Icon name="sparkles" /><span>Ideas y tareas</span></button>
        </nav>

        <div className="sidebar-bottom">
          <div className="family-card">
            <div className="family-avatars"><span className="avatar avatar-coral">M</span><span className="avatar avatar-blue">P</span><span className="avatar avatar-yellow">A</span><span className="avatar avatar-lilac">+</span></div>
            <strong>La familia</strong>
            <span>4 personas organizando</span>
            <button onClick={() => setModal('invite')}>Invitar a alguien <Icon name="plus" size={15} /></button>
          </div>
          <button className="nav-item settings-button" onClick={() => showToast('La configuración estará disponible pronto')}><Icon name="settings" /><span>Configuración</span></button>
          <div className="profile-row"><span className="avatar avatar-coral profile-avatar">{profileInitial}</span><span><strong>{profileName}</strong><small>{profileSubtitle}</small></span><button className="profile-more profile-logout" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={() => void signOut()}>⏻</button></div>
        </div>
      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <div className="breadcrumbs"><span>Mis viajes</span><span className="breadcrumb-slash">/</span><strong>Verano en familia</strong></div>
          <div className="topbar-actions"><span role="status" style={{ fontSize: 12, padding: '4px 12px', borderRadius: 999, background: dbStatus === 'conectado' ? '#dcfce7' : dbStatus === 'error' ? '#fee2e2' : '#fef9c3', color: dbStatus === 'conectado' ? '#166534' : dbStatus === 'error' ? '#991b1b' : '#854d0e' }}>{dbStatus === 'conectando' ? 'Conectando a Supabase…' : dbStatus === 'conectado' ? 'Supabase conectado ✓' : 'Error de conexión — revisa la consola'}</span><div className="avatar-stack" aria-label="4 personas en el viaje"><span className="avatar avatar-coral">M</span><span className="avatar avatar-blue">P</span><span className="avatar avatar-yellow">A</span><span className="avatar avatar-green">L</span></div><button className="button button-outline invite-button" onClick={() => setModal('invite')}><Icon name="users" size={17} /> Invitar</button><button className="icon-button" aria-label="Más opciones" onClick={() => showToast('No hay notificaciones nuevas')}>···</button></div>
        </header>

        <div className="page-container">
          <section className="welcome-row">
            <div><p className="eyebrow">NUESTRO PRÓXIMO CAPÍTULO</p><h1>¡Nos vamos de viaje! <span className="wave">✳</span></h1><p className="welcome-subtitle">Un viaje en familia se disfruta desde que empieza a soñarse.</p></div>
            <button className="button button-primary" onClick={() => setModal('destination')}><Icon name="plus" size={18} /> Añadir destino</button>
          </section>

          <section className="trip-meta" aria-label="Detalles del viaje">
            <div className="meta-item"><span className="meta-icon"><Icon name="calendar" size={18} /></span><span><small>FECHAS</small><strong>5 – 15 agosto, 2027</strong></span></div>
            <span className="meta-divider" />
            <div className="meta-item"><span className="meta-icon meta-green"><Icon name="users" size={18} /></span><span><small>VIAJEROS</small><strong>4 personas</strong></span></div>
            <span className="meta-divider" />
            <div className="meta-item"><span className="meta-icon meta-peach"><Icon name="pin" size={18} /></span><span><small>DESTINOS</small><strong>{destinations.length} lugares</strong></span></div>
            <div className="weather-chip"><span>☀️</span><span><strong>Lisboa</strong><small>24° soleado</small></span></div>
          </section>

          <div className="dashboard-grid">
            <div className="primary-column">
              <section className="hero-card">
                <img src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1800&q=90" alt="Casas coloridas a orillas del río en Portugal" />
                <div className="hero-overlay" />
                <div className="hero-top"><span className="hero-badge"><span className="live-dot" /> EL VIAJE SE ACERCA</span><button className="hero-menu" aria-label="Más opciones" onClick={() => showToast('Opciones del viaje')}>···</button></div>
                <div className="hero-copy"><span className="hero-location"><Icon name="pin" size={15} /> PORTUGAL</span><h2>Portugal, allá vamos</h2><p>Sol, sobremesas largas y recuerdos para siempre.</p></div>
                <button className="hero-link" onClick={() => goTo('Itinerario', 'destinos')}>Explorar itinerario <Icon name="arrow" size={17} /></button>
              </section>

              <section className="section-block destinations-section" id="destinos">
                <div className="section-heading"><div><p className="eyebrow">EL PLAN VA TOMANDO FORMA</p><h2>Nuestros destinos <span className="heading-count">{destinations.length}</span></h2></div><button className="text-button" onClick={() => setModal('destination')}>Ver itinerario <Icon name="arrow" size={16} /></button></div>
                <div className="destination-grid">
                  {destinations.map((destination, index) => (
                    <article className="destination-card" key={`${destination.name}-${index}`}>
                      <div className="destination-photo"><img src={destination.image} alt={`Paisaje de ${destination.name}`} /><span className="destination-number">0{index + 1}</span><button className="destination-favorite" aria-label={`Guardar ${destination.name}`} onClick={() => showToast(`${destination.name} guardado en favoritos`)}>♡</button></div>
                      <div className="destination-info"><div><h3>{destination.name} <span>{destination.emoji}</span></h3><p>{destination.country}</p></div><span className="stay-pill"><Icon name="clock" size={13} /> {destination.days}</span></div>
                    </article>
                  ))}
                  <button className="add-destination-card" onClick={() => setModal('destination')}><span className="add-round"><Icon name="plus" size={20} /></span><strong>¿Y si añadimos<br />otro lugar?</strong><small>Las mejores ideas empiezan aquí</small></button>
                </div>
              </section>

              <section className="section-block itinerary-preview" id="itinerario">
                <div className="section-heading"><div><p className="eyebrow">UN PASO A LA VEZ</p><h2>Lo que viene</h2></div><button className="text-button" onClick={() => goTo('Itinerario', 'destinos')}>Ver todo <Icon name="arrow" size={16} /></button></div>
                <div className="next-event"><div className="event-date"><strong>05</strong><span>AGO</span></div><div className="event-line"><span /></div><div className="event-details"><span className="event-type"><Icon name="plane" size={14} /> DÍA DE VIAJE</span><h3>¡Despegamos rumbo a Lisboa!</h3><p>Martes, 5 de agosto · Aeropuerto de A Coruña</p></div><span className="event-weather">☀️ 24°</span></div>
              </section>
            </div>

            <aside className="right-column">
              <section className="side-card countdown-card">
                <div className="card-topline"><span className="card-icon countdown-icon"><Icon name="calendar" size={18} /></span><span className="card-label">CUENTA ATRÁS</span><span className="card-dots">···</span></div>
                <div className="countdown-number">304 <span>días</span></div><p className="countdown-copy">¡Y empieza la aventura!</p>
                <div className="countdown-progress"><span /></div><div className="countdown-foot"><span>Preparativos</span><strong>{Math.round(completedTasks / tasks.length * 100)}% listos</strong></div>
              </section>

              <section className="side-card tasks-card" id="ideas">
                <div className="card-section-heading"><div><span className="card-icon task-icon"><Icon name="check" size={18} /></span><div><p className="eyebrow">PARA IR CALENTANDO</p><h2>Lista de tareas</h2></div></div><button className="icon-button small-icon-button" aria-label="Añadir tarea" onClick={() => showToast('Pronto podrás añadir más tareas')}><Icon name="plus" size={17} /></button></div>
                <div className="task-progress"><span style={{ width: `${tasks.length ? completedTasks / tasks.length * 100 : 0}%` }} /></div>
                <p className="task-progress-label">{completedTasks} de {tasks.length} tareas completadas</p>
                <div className="task-list">{tasks.map((task) => <label className={task.done ? 'task-row task-done' : 'task-row'} key={task.id}><input type="checkbox" checked={task.done} onChange={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))} /><span className="custom-checkbox"><Icon name="check" size={13} /></span><span className="task-copy"><strong>{task.label}</strong><small>{task.who}</small></span><span className="task-menu">···</span></label>)}</div>
                <button className="all-tasks-button" onClick={() => goTo('Ideas', 'ideas')}>Ver todas las tareas <Icon name="arrow" size={15} /></button>
              </section>

              <section className="side-card budget-card" id="presupuesto">
                <div className="card-section-heading"><div><span className="card-icon budget-icon"><Icon name="wallet" size={18} /></span><div><p className="eyebrow">SIN SORPRESAS</p><h2>Presupuesto</h2></div></div><button className="icon-button small-icon-button" aria-label="Ver presupuesto" onClick={() => showToast('Resumen del presupuesto familiar')}><Icon name="arrow" size={16} /></button></div>
                <div className="budget-amount"><strong>1.250 €</strong><span>de 4.000 €</span></div><div className="budget-progress"><span /></div>
                <div className="budget-legend"><span><i className="legend-spent" /> Gastado <strong>1.250 €</strong></span><span><i className="legend-left" /> Disponible <strong>2.750 €</strong></span></div>
              </section>

              <section className="note-card"><span className="note-sparkle">✳</span><p>“Los mejores viajes se hacen en familia.”</p><span>— Una frase para el camino</span><div className="note-decoration">✦ &nbsp; ✧ &nbsp; ✦</div></section>
            </aside>
          </div>
          <footer className="page-footer"><span>Hecho con <span className="heart">♥</span> para viajar juntos</span><span>Verano en familia · 2027</span></footer>
        </div>
      </main>

      {toast && <div className="toast" role="status"><span className="toast-check"><Icon name="check" size={14} /></span>{toast}</div>}

      {modal && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null) }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" aria-label="Cerrar" onClick={() => setModal(null)}><Icon name="close" /></button><span className="modal-icon"><Icon name={modal === 'destination' ? 'pin' : 'users'} size={22} /></span><p className="eyebrow">{modal === 'destination' ? 'EL MAPA ESTÁ ESPERANDO' : 'CUANTOS MÁS, MEJOR'}</p><h2 id="modal-title">{modal === 'destination' ? 'Añade una parada' : 'Invita a la familia'}</h2><p className="modal-description">{modal === 'destination' ? 'Ese sitio del que todos habláis merece un hueco en el viaje.' : 'Comparte la organización del viaje con quien tú quieras.'}</p>
        {modal === 'destination' ? <form onSubmit={addDestination}><label htmlFor="destination-name">¿A dónde os gustaría ir?</label><input autoFocus id="destination-name" value={destinationName} onChange={(event) => setDestinationName(event.target.value)} placeholder="Ej. Sintra, Portugal" required /><button className="button button-primary modal-submit" type="submit">Añadir destino <Icon name="arrow" size={16} /></button></form> : <form onSubmit={inviteFamily}><label htmlFor="invite-email">Correo electrónico</label><input autoFocus id="invite-email" type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="familia@ejemplo.com" required /><button className="button button-primary modal-submit" type="submit">Enviar invitación <Icon name="send" size={16} /></button></form>}
      </section></div>}
    </div>
  )
}

function App() {
  const { session, loading } = useAuth()

  if (loading) {
    return <div className="auth-loading" role="status">Preparando el viaje…</div>
  }

  return session ? <Dashboard /> : <Login />
}

export default App
