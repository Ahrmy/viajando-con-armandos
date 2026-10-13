import Icon from "../atoms/Icon";
import Brand from "../molecules/Brand";
import TripSwitcher from "../molecules/TripSwitcher";
import NavItem from "../molecules/NavItem";
import FamilyCard from "../molecules/FamilyCard";
import ProfileRow from "../molecules/ProfileRow";
import { familyMembers } from "../../data/dashboard-mock";
import type { TripSummary } from "../../types/dashboard";

interface SidebarProps {
  trips: TripSummary[];
  activeTrip: TripSummary;
  activeNav: string;
  destinationsCount: number;
  onNavigate: (section: string, id: string) => void;
  onSelectTrip: (trip: TripSummary) => void;
  onCreateTrip: () => void;
  onInvite: () => void;
  onNotify: (message: string) => void;
  profileName: string;
  profileSubtitle: string;
  profileInitial: string;
  onSignOut: () => void;
}

export default function Sidebar({
  trips,
  activeTrip,
  activeNav,
  destinationsCount,
  onNavigate,
  onSelectTrip,
  onCreateTrip,
  onInvite,
  onNotify,
  profileName,
  profileSubtitle,
  profileInitial,
  onSignOut,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <Brand />

      <TripSwitcher
        trips={trips}
        activeTrip={activeTrip}
        onSelect={onSelectTrip}
        onCreateNew={onCreateTrip}
      />

      <p className="nav-caption">PLANIFICA</p>
      <nav className="main-nav" aria-label="Navegación principal">
        <NavItem
          icon="grid"
          label="Vista general"
          active={activeNav === "Resumen"}
          onClick={() => onNavigate("Resumen", "inicio")}
        />
        <NavItem
          icon="map"
          label="Itinerario"
          active={activeNav === "Itinerario"}
          count={destinationsCount}
          onClick={() => onNavigate("Itinerario", "destinos")}
        />
        <NavItem
          icon="wallet"
          label="Presupuesto"
          active={activeNav === "Presupuesto"}
          onClick={() => onNavigate("Presupuesto", "presupuesto")}
        />
        <NavItem
          icon="sparkles"
          label="Ideas y tareas"
          active={activeNav === "Ideas"}
          onClick={() => onNavigate("Ideas", "ideas")}
        />
      </nav>

      <div className="sidebar-bottom">
        <FamilyCard members={familyMembers} onInvite={onInvite} />
        <button
          className="nav-item settings-button"
          onClick={() => onNotify("La configuración estará disponible pronto")}
        >
          <Icon name="settings" />
          <span>Configuración</span>
        </button>
        <ProfileRow
          name={profileName}
          subtitle={profileSubtitle}
          initial={profileInitial}
          onSignOut={onSignOut}
        />
      </div>
    </aside>
  );
}
