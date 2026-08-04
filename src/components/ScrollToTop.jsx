import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Cambiá a "auto" si querés que suba de golpe sin animación
    });
  }, [pathname]);

  return null;
}