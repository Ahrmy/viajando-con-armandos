import { useState } from "react";
import Icon from "../atoms/Icon";
import Button from "../atoms/Button";
import StatusPill from "../atoms/StatusPill";
import Breadcrumbs from "../molecules/Breadcrumbs";
import AvatarStack from "../molecules/AvatarStack";
import { tripMembers } from "../../data/dashboard-mock";
import type { DbStatus, TripSummary } from "../../types/dashboard";

interface TopbarProps {
  tripTitle: string;
  dbStatus: DbStatus;
  trips: TripSummary[];
  activeTrip: TripSummary;
  onInvite: () => void;
  onCreateTrip: () => void;
  onSelectTrip: (trip: TripSummary) => void;
}

export default function Topbar({
  tripTitle,
  dbStatus,
  trips,
  activeTrip,
  onInvite,
  onCreateTrip,
  onSelectTrip,
}: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const otherTrips = trips.filter((trip) => trip.id !== activeTrip.id);

  return (
    <header className="topbar">
      <Breadcrumbs root="Mis viajes" current={tripTitle} />
      <div className="topbar-actions">
        <StatusPill status={dbStatus} />
        <AvatarStack members={tripMembers} ariaLabel="4 personas en el viaje" />
        <Button variant="outline" className="invite-button" onClick={onInvite}>
          <Icon name="users" size={17} /> Invitar
        </Button>
        <div className="menu-anchor">
          <button
            className="icon-button"
            aria-label="Más opciones"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ···
          </button>
          {menuOpen && (
            <>
              <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
              <div className="dropdown-menu" role="menu">
                <button
                  className="dropdown-item"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onCreateTrip();
                  }}
                >
                  <Icon name="plus" size={16} /> Crear nuevo viaje
                </button>
                {otherTrips.length > 0 && (
                  <p className="dropdown-caption">CAMBIAR DE VIAJE</p>
                )}
                {otherTrips.map((trip) => (
                  <button
                    key={trip.id}
                    className="dropdown-item"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onSelectTrip(trip);
                    }}
                  >
                    <Icon name="plane" size={16} /> {trip.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
