import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

type Mode = "login" | "register";

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError("");
    setNotice("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    if (mode === "login") {
      const message = await signIn(email.trim(), password);
      if (message) {
        setError(
          message === "Invalid login credentials"
            ? "Correo o contraseña incorrectos"
            : message,
        );
      }
    } else {
      const message = await signUp(email.trim(), password, fullName.trim());
      if (message) {
        setError(message);
      } else {
        switchMode("login");
        setNotice(
          "Cuenta creada. Revisa tu correo para confirmar el registro y después inicia sesión.",
        );
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-mark auth-brand-mark">
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4z M22 2 11 13" />
            </svg>
          </span>
          <span>
            viajando<span className="brand-light">con</span>{" "}
            <strong>Armandos</strong>
          </span>
        </div>

        <p className="eyebrow">
          {mode === "login" ? "QUÉ BIEN VERTE DE NUEVO" : "EMPIEZA LA AVENTURA"}
        </p>
        <h1 className="auth-title">
          {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
        </h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Tu próximo viaje en familia te está esperando."
            : "Organiza vuestros viajes en familia, juntos y sin caos."}
        </p>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={mode === "login" ? "auth-tab active" : "auth-tab"}
            onClick={() => switchMode("login")}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "register"}
            className={mode === "register" ? "auth-tab active" : "auth-tab"}
            onClick={() => switchMode("register")}
          >
            Registrarse
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label>
              Nombre completo
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Ej. Armando Numa"
                autoComplete="name"
                required
              />
            </label>
          )}
          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="familia@ejemplo.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={6}
              required
            />
          </label>

          {error && (
            <p className="auth-message auth-error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="auth-message auth-notice" role="status">
              {notice}
            </p>
          )}

          <button
            className="button button-primary auth-submit"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Un momento…"
              : mode === "login"
                ? "Entrar"
                : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-footer">
          Hecho con ♥ para viajar juntos
        </p>
      </div>
    </div>
  );
}
