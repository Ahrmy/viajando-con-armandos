import { useEffect, useState } from "react";
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
import EmptyTripsState from "../organisms/EmptyTripsState";
import PageFooter from "../molecules/PageFooter";
import Toast from "../atoms/Toast";
import {
  initialDestinations,
  newDestinationImage,
} from "../../data/dashboard-mock";
import {
  createFamily,
  daysUntil,
  fetchExpensesTotal,
  fetchFamilyMembers,
  fetchMyFamily,
  fetchTasks,
  fetchTravelersCount,
  fetchTrips,
  insertTrip,
  updateTaskStatus,
  type FamilyInfo,
} from "../../lib/dashboard-data";
import type {
  DbStatus,
  Destination,
  FamilyMember,
  ModalKind,
  NewTripInput,
  TaskItem,
  TripSummary,
} from "../../types/dashboard";

export default function DashboardPage() {
  const { profile, user, signOut } = useAuth();
  const [activeNav, setActiveNav] = useState("Resumen");
  const [family, setFamily] = useState<FamilyInfo | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [spent, setSpent] = useState(0);
  const [travelers, setTravelers] = useState(0);
  const [modal, setModal] = useState<ModalKind>(null);
  const [toast, setToast] = useState("");
  const [dbStatus, setDbStatus] = useState<DbStatus>("conectando");

  const activeTrip =
    trips.find((trip) => trip.id === activeTripId) ?? trips[0] ?? null;
  const completedTasks = tasks.filter((task) => task.done).length;
  const tasksProgress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;
  const profileName = profile?.full_name ?? "Viajero";
  const profileInitial = profileName.trim().charAt(0).toUpperCase() || "V";
  const profileSubtitle = user?.email ?? "";

  const goTo = (section: string, id: string) => {
    setActiveNav(section);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  };

  // Carga inicial: familia (con onboarding si no existe), miembros y viajes
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      try {
        let fam = await fetchMyFamily(user.id);
        if (!fam) {
          const baseName = profile?.full_name?.trim() || "la familia";
          fam = await createFamily(user.id, `Familia de ${baseName}`);
          if (!cancelled) showToast(`Hemos creado "${fam.name}" para empezar`);
        }
        if (cancelled) return;
        setFamily(fam);
        const [memberList, tripList] = await Promise.all([
          fetchFamilyMembers(fam.id),
          fetchTrips(fam.id),
        ]);
        if (cancelled) return;
        setMembers(memberList);
        setTrips(tripList);
        setActiveTripId((current) => current ?? tripList[0]?.id ?? null);
        setDbStatus("conectado");
      } catch (error) {
        console.error("Error cargando el dashboard:", error);
        if (!cancelled) setDbStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Datos del viaje activo: tareas, gasto total y viajeros
  useEffect(() => {
    if (!activeTripId) {
      setTasks([]);
      setSpent(0);
      setTravelers(0);
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        const [taskList, total, count] = await Promise.all([
          fetchTasks(activeTripId),
          fetchExpensesTotal(activeTripId),
          fetchTravelersCount(activeTripId),
        ]);
        if (cancelled) return;
        setTasks(taskList);
        setSpent(total);
        setTravelers(count);
      } catch (error) {
        console.error("Error cargando los datos del viaje:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTripId]);

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

  const createTrip = async ({
    name,
    destination,
    startDate,
    endDate,
  }: NewTripInput) => {
    if (!family || !user) {
      showToast("Aún estamos preparando tu familia, inténtalo en un momento");
      return;
    }
    try {
      const newTrip = await insertTrip({
        familyId: family.id,
        createdBy: user.id,
        title: name,
        destination,
        startDate,
        endDate,
      });
      setTrips((current) => [...current, newTrip]);
      setActiveTripId(newTrip.id);
      showToast(`¡Viaje "${name}" creado! A planear se ha dicho`);
    } catch (error) {
      console.error("Error creando el viaje:", error);
      showToast("No se pudo crear el viaje — revisa la consola");
    }
  };

  const toggleTask = (id: string) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    const done = !task.done;
    // Actualización optimista: se revierte si Supabase falla
    setTasks((current) =>
      current.map((item) => (item.id === id ? { ...item, done } : item)),
    );
    updateTaskStatus(id, done).catch((error: unknown) => {
      console.error("Error actualizando la tarea:", error);
      setTasks((current) =>
        current.map((item) => (item.id === id ? { ...item, done: !done } : item)),
      );
      showToast("No se pudo actualizar la tarea");
    });
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
          members={members}
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
          tripTitle={activeTrip?.title ?? "Mis viajes"}
          dbStatus={dbStatus}
          members={members}
          trips={trips}
          activeTrip={activeTrip}
          onInvite={() => setModal("invite")}
          onCreateTrip={() => setModal("trip")}
          onSelectTrip={selectTrip}
        />
      }
      footer={<PageFooter tripTitle={activeTrip?.title ?? "Sin viajes"} />}
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
      {activeTrip ? (
        <>
          <WelcomeHeader onAddDestination={() => setModal("destination")} />

          <TripMetaBar
            dates={activeTrip.dates}
            travelers={`${travelers > 0 ? travelers : members.length} personas`}
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
              <CountdownCard
                days={daysUntil(activeTrip.startDate)}
                progress={tasksProgress}
              />
              <TasksCard
                tasks={tasks}
                onToggleTask={toggleTask}
                onAddTask={() => showToast("Pronto podrás añadir más tareas")}
                onViewAll={() => goTo("Ideas", "ideas")}
              />
              {/* TODO: el presupuesto total será editable por viaje */}
              <BudgetCard
                spent={spent}
                total={4000}
                onOpen={() => showToast("Resumen del presupuesto familiar")}
              />
              <NoteCard />
            </aside>
          </div>
        </>
      ) : (
        <EmptyTripsState onCreateTrip={() => setModal("trip")} />
      )}
    </DashboardTemplate>
  );
}
