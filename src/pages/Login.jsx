import { useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    verificarSesion();
  }, []);

  // Verifica si ya hay una sesión iniciada
  const verificarSesion = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      navigate("/admin", { replace: true });
      return;
    }

    abrirLoginSweet();
  };

  const abrirLoginSweet = () => {
    Swal.fire({
      title: "Acceso Admin",
      html: `
        <input type="text" id="usuario" class="swal2-input" placeholder="Usuario">

        <div style="position:relative; width:100%;">
          <input
            type="password"
            id="password"
            class="swal2-input"
            placeholder="Contraseña"
            style="padding-right:45px; margin:0;"
          >
          <span
            id="togglePassword"
            style="
              position:absolute;
              right:15px;
              top:50%;
              transform:translateY(-50%);
              cursor:pointer;
              font-size:20px;
              user-select:none;
            "
          >
            👁️
          </span>
        </div>
      `,
      confirmButtonText: "Entrar",
      confirmButtonColor: "#1a5a3a",
      focusConfirm: false,

      didOpen: () => {
        const passwordInput = Swal.getPopup().querySelector("#password");
        const toggle = Swal.getPopup().querySelector("#togglePassword");

        toggle.addEventListener("click", () => {
          if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggle.textContent = "🙈";
          } else {
            passwordInput.type = "password";
            toggle.textContent = "👁️";
          }
        });
      },

      preConfirm: async () => {
        const usuario = Swal.getPopup().querySelector("#usuario").value.trim().toLowerCase();
        const password = Swal.getPopup().querySelector("#password").value;

        if (usuario !== "florencia") {
          Swal.showValidationMessage("Usuario incorrecto");
          return false;
        }

        const { error } = await supabase.auth.signInWithPassword({
          email: "admin@kansha.com",
          password,
        });

        if (error) {
          Swal.showValidationMessage("Contraseña incorrecta");
          return false;
        }

        return true;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "success",
          title: "Bienvenida Florencia 💖",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => {
          navigate("/admin", { replace: true });
        });
      } else {
        navigate("/", { replace: true });
      }
    });
  };

  return null;
}

export default Login;