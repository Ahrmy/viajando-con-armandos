import { useState } from "react";
import Icon from "../atoms/Icon";
import type { TripSummary } from "../../types/dashboard";

interface TripSwitcherProps {
  trips: TripSummary[];
  activeTrip: TripSummary;
  onSelect: (trip: TripSummary) => void;
  onCreateNew: () => void;
}

export default function TripSwitcher({
  trips,
  activeTrip,
  onSelect,
  onCreateNew,
}: TripSwitcherProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="trip-switcher-wrap">
      <button
        className="trip-switcher"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <div className="trip-thumb">
          <img src={activeTrip.image} alt="" />
        </div>
        <div className="trip-switcher-copy">
          <small>{activeTrip.destination.toUpperCase()}</small>
          <strong>{activeTrip.label}</strong>
        </div>
        <span className="chevron">⌄</span>
      </button>
      {open && (
        <>
          <div className="menu-overlay" onClick={() => setOpen(false)} />
          <div className="dropdown-menu switcher-menu" role="menu">
            <p className="dropdown-caption">MIS VIAJES</p>
            {trips.map((trip) => (
              <button
                key={trip.id}
                className={
                  trip.id === activeTrip.id
                    ? "dropdown-item switcher-item active"
                    : "dropdown-item switcher-item"
                }
                role="menuitem"
                onClick={() => {
                  onSelect(trip);
                  setOpen(false);
                }}
              >
                <span className="trip-thumb switcher-thumb">
                  <img src={trip.image} alt="" />
                </span>
                <span className="trip-switcher-copy">
                  <small>{trip.destination.toUpperCase()}</small>
                  <strong>{trip.title}</strong>
                </span>
                {trip.id === activeTrip.id && (
                  <span className="switcher-check">
                    <Icon name="check" size={14} />
                  </span>
                )}
              </button>
            ))}
            <button
              className="dropdown-item switcher-new"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onCreateNew();
              }}
            >
              <Icon name="plus" size={16} /> Crear nuevo viaje
            </button>
          </div>
        </>
      )}
    </div>
  );
}
