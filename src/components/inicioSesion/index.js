import React, { useState, useContext } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { Redirect } from "react-router-dom";
const spacingStyling = {
  marginTop: "1rem",
};

function Formulario(props) {
  const [formValues, setFormValues] = useState({
    usuario: "",
    pass: "",
  });
  const [shouldRedirect, setShouldRedirect] = useState(false)
  console.log("props: ", props);
  const [_, setAuth] = useContext(AuthContext);

  const onSubmit = async () => {
    const response = await axios.post("/login", {
      usuario: formValues.usuario,
      pass: formValues.pass,
    });
    if (response.data?.token) {
      localStorage.setItem("auth", response.data?.token);
      setAuth(response.data?.token);
      setShouldRedirect(true)
    }
  };

  if (shouldRedirect) {
    return <Redirect to={'/profesores'} />
  }
  return (
    <Card style={{ width: "50%" }}>
      <CardContent style={{ display: "flex", flexDirection: "column" }}>
        <Typography style={spacingStyling} variant="h4">
          Inicio de Sesión
        </Typography>
        <TextField
          style={spacingStyling}
          id="filled-basic"
          label="Usuario"
          variant="filled"
          value={formValues.usuario}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              usuario: e.target.value,
            }))
          }
        />
        <TextField
          style={spacingStyling}
          id="filled-basic"
          label="Contraseña"
          variant="filled"
          value={formValues.pass}
          type={"password"}
          onChange={(e) =>
            setFormValues((prev) => ({
              ...prev,
              pass: e.target.value,
            }))
          }
        />
        <Button style={spacingStyling} variant="contained" onClick={onSubmit}>
          Iniciar Sesión
        </Button>
      </CardContent>
    </Card>
  );
}

export default Formulario;
