import { useState } from "react";
import { Tag, Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";

type Props = {
  onLogin: (user: { name: string; role: string; initials: string }) => void;
};

const USERS = [
  { username: "admin", password: "admin123", name: "Carlos Martínez", role: "Administrador", initials: "CM" },
  { username: "ana", password: "ana123", name: "Ana Rodríguez", role: "Supervisora", initials: "AR" },
  { username: "luis", password: "luis123", name: "Luis González", role: "Almacenista", initials: "LG" },
];

export function Login({ onLogin }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      const found = USERS.find(
        (u) => u.username === username.trim().toLowerCase() && u.password === password
      );
      if (found) {
        onLogin({ name: found.name, role: found.role, initials: found.initials });
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Tag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-white" style={{ fontSize: "1.5rem" }}>FerroStock</h1>
            <p className="text-gray-400 text-sm mt-1">Sistema de Gestión de Inventario</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-gray-800 mb-1" style={{ fontSize: "1.125rem" }}>Iniciar sesión</h2>
            <p className="text-gray-400 text-sm mb-6">Ingresa tus credenciales para continuar</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Usuario</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej: admin"
                    required
                    autoComplete="username"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Contraseña</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-3 py-2.5 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Verificando...
                  </>
                ) : "Ingresar"}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3 text-center">Credenciales de acceso</p>
              <div className="grid grid-cols-3 gap-2">
                {USERS.map((u) => (
                  <button
                    key={u.username}
                    type="button"
                    onClick={() => { setUsername(u.username); setPassword(u.password); setError(""); }}
                    className="text-center p-2.5 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors group"
                  >
                    <div className="w-7 h-7 bg-gray-100 group-hover:bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1 transition-colors">
                      <span className="text-xs text-gray-600 group-hover:text-orange-600">{u.initials}</span>
                    </div>
                    <p className="text-xs text-gray-500 group-hover:text-orange-600 transition-colors">{u.name.split(" ")[0]}</p>
                    <p className="text-xs text-gray-300">{u.role.split(" ")[0]}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-5">
          © 2026 FerroStock · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
