import React, { useState } from "react";
import Tabla from "../../components/tablaDatos";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormularioDialogo from "../../components/formularioDialogo";
import FormularioCrear from "../../components/formularioCrear";
function getObjectTemplate(type) {
  switch (type) {
    case "profesores":
      return {
        nombres: " ",
        apaterno: " ",
        amaterno: " ",
        usuario: " ",
        contrasenia: "",
        rol: "Profesor",
        cvu_conacyt: " ",
        tiempo_dedicacion: " ",
        estado: "Activo",
        fecha_alta: ' ',
        fecha_baja: " ",
        tipo: " ",
        id_programa: " ",
      };
    case "estudiantes":
      return {
        nombres: " ",
        apaterno: " ",
        amaterno: " ",
        usuario: " ",
        contrasenia: "",
        rol: "Estudiante",
        cvu_conacyt: " ",
        numcontrol: " ",
        cohorte: " ",
        curp: " ",
        correopersonal: " ",
        correoinstitucional: " ",
        instit_procedencia: " ",
        numero_beca: " ",
        inicio_beca: " ",
        termino_beca: " ",
        estado_beca: " ",
        fecha_obt_grado: " ",
        tiempo_dedicacion: " ",
        estado: "Activo",
        id_programa: " ",
      };

    case "productos":
      return {
        nombre: " ",
        estado: "Activo",
      };
    case "proyectos":
      return {
        nombre: " ",
        objetivo: " ",
        descripcion: " ",
        fecha_ingreso_banco: " ",
        fecha_inicio: " ",
        mecanismo_vinc: " ",
        estado: "Activo",
        id_estudiante: " ",
        id_organismo: " ",
      };

    case "organismos":
      return {
        nombre: " ",
        sector: " ",
        descripcion: " ",
        fecha_inicio: " ",
        fecha_termino: " ",
        ambito: " ",
        pais: " ",
        entidad_federativa: " ",
        estado: " ",
      };

    case "lgacs":
      return {
        clave: " ",
        nombre: " ",
        fecha_inicio: " ",
        fecha_fin: " ",
        lgac_programa: " "
      };

    case "programas":
      return {
        nombrecompleto: " ",
        nombrecorto: " ",
        clave_plan: " ",
        referencia_snp: " ",
        estado: " ",
      };
    default:
      break;
  }
}

function Section({ type, path, literals, headings, filterLiteral }) {
  const [filterList, setFilterList] = useState("");
  const [open, setOpen] = useState(false);
  const [openCrear, setOpenCrear] = useState(false);
  const [seleccion, setSeleccion] = useState({});
  const [seleccionCrear, setSeleccionCrear] = useState({});
  const [rows, setRows] = useState([]);

  const handleClickOpen = (object) => {
    setOpen(true);
    if (object.contrasenia) {
      setSeleccion({ ...object, contrasenia: null });
    } else {
      setSeleccion(object);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenCrear = (obj = {}) => {
    setOpenCrear(true);
    console.log("obj: ", getObjectTemplate(type));
    setSeleccionCrear(getObjectTemplate(type));
  };

  const handleCloseCrear = () => {
    setOpenCrear(false);
  };
  return (
    <div>
      <Container style={{ marginBottom: "1rem" }}>
        <Typography variant="h4">{type.toUpperCase()}</Typography>
      </Container>
      <Container style={{ marginBottom: "1rem" }}>
        <Typography variant="h5">{"Filtrar por nombre"}</Typography>
      </Container>
      <Container style={{ marginBottom: "1rem" }}>
        <FormControl fullWidth variant="standard">
          <TextField
            value={filterList}
            onChange={(e) => setFilterList(e.target.value)}
          />
          <Button onClick={handleClickOpenCrear} variant="contained">
            Crear
          </Button>
        </FormControl>
      </Container>
      <Container>
        <Tabla
          filterValue={filterList}
          type={type}
          path={path}
          literals={literals}
          headings={headings}
          handleClickOpen={handleClickOpen}
          rows={rows}
          setRows={setRows}
          filterLiteral={filterLiteral}
          setSeleccionCrear={setSeleccionCrear}
        />
      </Container>
      <FormularioDialogo
        handleClickOpen={handleClickOpen}
        handleClose={handleClose}
        open={open}
        seleccion={seleccion}
        setSeleccion={setSeleccion}
        setRows={setRows}
        type={type}
      />
      <FormularioCrear
        handleClickOpen={handleClickOpenCrear}
        handleClose={handleCloseCrear}
        open={openCrear}
        seleccion={seleccionCrear}
        setSeleccion={setSeleccionCrear}
        setRows={setRows}
        type={type}
      />
    </div>
  );
}

export default Section;
