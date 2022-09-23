import React from "react";
import Formulario from "../../components/inicioSesion";

function Login() {
  return (
    <div
      style={{
        width: "100%",
        paddingTop: "2rem",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Formulario />
    </div>
  );
}

export default Login;
