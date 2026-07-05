import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔐 SI YA ESTÁ LOGUEADA, ENTRA DIRECTO
  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      navigate("/admin");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);

      Swal.fire({
        icon: "error",
        title: "Error de acceso",
        text: "Usuario o contraseña incorrectos",
      });

      return;
    }

    Swal.fire({
      icon: "success",
      title: "Bienvenida Florencia 💖",
      text: "Acceso correcto al panel",
      timer: 1200,
      showConfirmButton: false,
    });

    setTimeout(() => {
      navigate("/admin");
    }, 1200);
  }

  return (
    <div className="container py-5">

      <h2 className="mb-4">Login Admin</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>

      </form>

    </div>
  );
}

export default Login;