import { useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Al cargar este componente, lanzamos el SweetAlert inmediatamente
    abrirLoginSweet();
  }, []);

  const abrirLoginSweet = () => {
    Swal.fire({
      title: "Acceso Admin",
      html: `
        <input type="email" id="email" class="swal2-input" placeholder="Email">
        <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
      `,
      confirmButtonText: "Entrar",
      confirmButtonColor: "#1a5a3a",
      focusConfirm: false,
      preConfirm: async () => {
        const email = Swal.getPopup().querySelector("#email").value;
        const password = Swal.getPopup().querySelector("#password").value;
        
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          Swal.showValidationMessage(`Error: ${error.message}`);
        }
        return { email };
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
        // Si el usuario cancela (apreta fuera o en cancelar), lo mandamos al inicio
        navigate("/");
      }
    });
  };

  // 2. Retornamos null porque no queremos que se vea nada en pantalla, 
  // solo queremos que aparezca el SweetAlert que lanzamos en el useEffect
  return null;
}

export default Login;