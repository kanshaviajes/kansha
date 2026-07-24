import { useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    abrirLoginSweet();
  }, []);

  const abrirLoginSweet = () => {
    Swal.fire({
      title: "Acceso Admin",
      html: `
        <input type="text" id="usuario" class="swal2-input" placeholder="Usuario">
        <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
      `,
      confirmButtonText: "Entrar",
      confirmButtonColor: "#1a5a3a",
      focusConfirm: false,

      preConfirm: async () => {
        const usuario = Swal.getPopup().querySelector("#usuario").value.trim().toLowerCase();
        const password = Swal.getPopup().querySelector("#password").value;

        // Validamos el usuario
        if (usuario !== "florencia") {
          Swal.showValidationMessage("Usuario incorrecto");
          return false;
        }

        // Iniciamos sesión con el email real (oculto para el usuario)
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
          navigate("/admin");
        });
      } else {
        navigate("/");
      }
    });
  };

  return null;
}

export default Login;