import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import DashboardTemplate from "../templates/DashboardTemplate";
import Sidebar from "../organisms/Sidebar";
import Topbar from "../organisms/Topbar";
import WelcomeHeader from "../organisms/WelcomeHeader";
import TripMetaBar from "../organisms/TripMetaBar";
import HeroCard from "../organisms/HeroCard";
import DestinationsSection from "../organisms/DestinationsSection";
import ItineraryPreview from "../organisms/ItineraryPreview";
import CountdownCard from "../organisms/CountdownCard";
import TasksCard from "../organisms/TasksCard";
import BudgetCard from "../organisms/BudgetCard";
import NoteCard from "../organisms/NoteCard";
import DashboardModals from "../organisms/DashboardModals";
import PageFooter from "../molecules/PageFooter";
import Toast from "../atoms/Toast";
import {
  defaultTripImage,
  initialDestinations,
  initialTasks,
  initialTrips,
  newDestinationImage,
} from "../../data/dashboard-mock";
import type {
  DbStatus,
  Destination,
  ModalKind,
  NewTripInput,
  TripSummary,
} from "../../types/dashboard";

export default function DashboardPage() {
  const { profile, user, signOut } = useAuth();
  const [activeNav, setActiveNav] = useState("Resumen");
  const [trips, setTrips] = useState(initialTrips);
  const [activeTripId, setActiveTripId] = useState(initialTrips[0].id);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [tasks, setTasks] = useState(initialTasks);
  const [modal, setModal] = useState<ModalKind>(null);
  const [toast, setToast] = useState("");
  const [dbStatus, setDbStatus] = useState<DbStatus>("conectando");

  const activeTrip = trips.find((trip) => trip.id === activeTripId) ?? trips[0];
  const completedTasks = tasks.filter((task) => task.done).length;
  const tasksProgress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;
  const profileName = profile?.full_name ?? "Viajero";
  const profileInitial = profileName.trim().charAt(0).toUpperCase() || "V";
  const profileSubtitle = user?.email ?? "";

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error de Supabase:", error.message);
          setDbStatus("error");
        } else {
          console.log("Conectado a Supabase:", data);
          setDbStatus("conectado");
        }
      });
  }, []);

  const goTo = (section: string, id: string) => {
    setActiveNav(section);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  const selectTrip = (trip: TripSummary) => {
    setActiveTripId(trip.id);
    showToast(`Viendo ${trip.title}`);
  };

  const addDestination = (name: string) => {
    setDestinations((current) => [
      ...current,
      {
        name,
        country: "Por descubrir",
        days: "Por planificar",
        image: newDestinationImage,
        emoji: "📍",
      },
    ]);
    showToast(`${name} se ha añadido al viaje`);
  };

  const inviteFamily = (_email: string) => {
    showToast("¡Invitación lista para compartir!");
  };

  const createTrip = ({ name, destination, startDate, endDate }: NewTripInput) => {
    const formatDate = (iso: string) =>
      iso
        ? new Date(`${iso}T00:00:00`).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
        : "";
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    const dates =
      start && end ? `${start} – ${end}` : start || end || "Fechas por definir";
    const year = startDate
      ? new Date(`${startDate}T00:00:00`).getFullYear()
      : new Date().getFullYear();
    const finalDestination = destination || "Por descubrir";
    const newTrip: TripSummary = {
      id: Date.now(),
      title: name,
      label: `${finalDestination} ${year}`,
      destination: finalDestination,
      dates,
      image: defaultTripImage,
    };
    setTrips((current) => [...current, newTrip]);
    setActiveTripId(newTrip.id);
    showToast(`¡Viaje "${name}" creado! A planear se ha dicho`);
  };

  const toggleTask = (id: number) => {
    setTasks((current) =>
      current.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  };

  const favoriteDestination = (destination: Destination) => {
    showToast(`${destination.name} guardado en favoritos`);
  };

  return (
    <DashboardTemplate
      sidebar={
        <Sidebar
          trips={trips}
          activeTrip={activeTrip}
          activeNav={activeNav}
          destinationsCount={destinations.length}
          onNavigate={goTo}
          onSelectTrip={selectTrip}
          onCreateTrip={() => setModal("trip")}
          onInvite={() => setModal("invite")}
          onNotify={showToast}
          profileName={profileName}
          profileSubtitle={profileSubtitle}
          profileInitial={profileInitial}
          onSignOut={() => void signOut()}
        />
      }
      topbar={
        <Topbar
          tripTitle={activeTrip.title}
          dbStatus={dbStatus}
          trips={trips}
          activeTrip={activeTrip}
          onInvite={() => setModal("invite")}
          onCreateTrip={() => setModal("trip")}
          onSelectTrip={selectTrip}
        />
      }
      footer={<PageFooter tripTitle={activeTrip.title} />}
      overlays={
        <>
          {toast && <Toast message={toast} />}
          <DashboardModals
            modal={modal}
            onClose={() => setModal(null)}
            onAddDestination={addDestination}
            onInvite={inviteFamily}
            onCreateTrip={createTrip}
          />
        </>
      }
    >
      <WelcomeHeader onAddDestination={() => setModal("destination")} />

      <TripMetaBar
        dates={activeTrip.dates}
        travelers="4 personas"
        destinationsCount={destinations.length}
      />

      <div className="dashboard-grid">
        <div className="primary-column">
          <HeroCard
            trip={activeTrip}
            onMenu={() => showToast("Opciones del viaje")}
            onExplore={() => goTo("Itinerario", "destinos")}
          />
          <DestinationsSection
            destinations={destinations}
            onAdd={() => setModal("destination")}
            onFavorite={favoriteDestination}
            onViewItinerary={() => setModal("destination")}
          />
          <ItineraryPreview onViewAll={() => goTo("Itinerario", "destinos")} />
        </div>

        <aside className="right-column">
          <CountdownCard days={304} progress={tasksProgress} />
          <TasksCard
            tasks={tasks}
            onToggleTask={toggleTask}
            onAddTask={() => showToast("Pronto podrás añadir más tareas")}
            onViewAll={() => goTo("Ideas", "ideas")}
          />
          <BudgetCard
            spent={1250}
            total={4000}
            onOpen={() => showToast("Resumen del presupuesto familiar")}
          />
          <NoteCard />
        </aside>
      </div>
    </DashboardTemplate>
  );
}
