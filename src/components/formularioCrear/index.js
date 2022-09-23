import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import EstadoCheckbox from "../estadoCheckbox";
import DatePicker from "react-datepicker";
import { years, sectores, countries, states } from "../../utils";

import "react-datepicker/dist/react-datepicker.css";
export const labelStyle = {
  fontWeight: "bold",
  fontSize: "1.3rem",
};
function FormularioCrear({
  handleClose,
  open,
  seleccion = {},
  setSeleccion,
  type = "proyectos",
  setRows,
}) {
  function handleChange(e, obj) {
    if (obj === "cvu_conacyt") {
      if (Number(e.target.value)) {
        const copy = { ...seleccion };
        copy[obj] = e.target.value.toUpperCase();
        setSeleccion(copy);
      }
    } else {
      if (obj === "pais") {
        let id = null;
        paises.forEach((pais) => {
          if (pais.name.toUpperCase() === e.target.value) {
            id = pais.id;
          }
        });
        setEstados(states.filter((x) => x.id_country === id));
      }
      const copy = { ...seleccion };
      if (e.target.value !== "") {
        copy[obj] = e.target.value.toUpperCase();
        setSeleccion(copy);
      }
      if (obj !== "rol") {
        const copy = { ...seleccion };
        copy[obj] = e.target.value.toUpperCase();
        setSeleccion(copy);
      }
    }
  }
  const [estadoCheckbox, setEstadoCheckbox] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [thirdDate, setThirdDate] = useState(new Date());
  const [programasPersona, setProgramasPersona] = useState([]);
  const [estudiantesProyecto, setEstudiantesProyecto] = React.useState([]);
  const [organismoProyecto, setOrganismoProyecto] = React.useState([]);
  const [paises, setPaises] = useState(countries);
  const [estados, setEstados] = useState(states);
  console.log(seleccion);
  async function submitForm() {
    if (seleccion.fecha_inicio) {
      seleccion.fecha_inicio = startDate;
      seleccion.fecha_fin = endDate;
    }
    if (seleccion.fecha_alta) {
      seleccion.fecha_alta = startDate;
      seleccion.fecha_baja = endDate;
    }
    if (seleccion.inicio_beca) {
      seleccion.inicio_beca = startDate;
      seleccion.termino_beca = endDate;
      seleccion.fecha_obt_grado = thirdDate;
    }
    if (seleccion.fecha_ingreso_banco) {
      seleccion.fecha_ingreso_banco = thirdDate
    }
    const response = await axios.post(
      `http://localhost:5000/ui/${type}/crear`,
      seleccion
    );
    if (response.status === 200) {
      setRows(response.data);
      handleClose();
    }
  }

  React.useEffect(() => {
    async function fetch() {
      if (type === "estudiantes" || type === "profesores" || type === "lgacs") {
        const response = await axios.get(`http://localhost:5000/ui/programas`);
        if (response.status === 200) {
          setProgramasPersona(response.data);
        }
      }
    }
    fetch();
  }, [type, open]);
  useEffect(() => {
    async function fetch() {
      if (type === "proyectos") {
        const response = await axios.get(
          `http://localhost:5000/ui/estudiantes`
        );
        const responseOrg = await axios.get(
          `http://localhost:5000/ui/organismos`
        );
        if (response.status === 200) {
          setEstudiantesProyecto(response.data);
          setSeleccion({
            ...seleccion,
            id_estudiante: response.data[0].id_estudiante,
          });
        }
        if (responseOrg.status === 200) {
          setOrganismoProyecto(responseOrg.data);
          setSeleccion({
            ...seleccion,
            id_organismo: responseOrg.data[0].id_organismo,
          });
        }
      }
    }
    fetch();
  }, [type, open]);
  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullScreen={true}>
        <DialogTitle style={labelStyle}>CREAR</DialogTitle>
        <DialogContent>
          <DialogContentText>LLENA LOS CAMPOS PARA CREAR.</DialogContentText>
          {Object.keys(seleccion).map((obj, idx) => {
            if (!seleccion[obj]) {
              return <></>;
            }
            if (obj === "estado") {
              return (
                <EstadoCheckbox
                  labelStyle={labelStyle}
                  estadoCheckbox={estadoCheckbox}
                  setEstadoCheckbox={setEstadoCheckbox}
                />
              );
            }
            if (obj === "cvu_conacyt") {
              return (
                <Form.Group
                  className="mb-3"
                  key={idx}
                  controlId="formBasicEmail"
                >
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Control
                    onChange={(e) => handleChange(e, obj)}
                    type="number"
                    value={seleccion[obj]}
                  />
                </Form.Group>
              );
            }
            if (
              obj === "fecha_inicio" ||
              obj === "fecha_alta" ||
              obj === "inicio_beca"
            ) {
              return (
                <div
                  className="customDatePickerWidth"
                  style={{ marginTop: "1rem" }}
                >
                  <label style={labelStyle}>{getLabelString(obj)}</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>
              );
            }
            if (
              obj === "fecha_ingreso_banco"
            ) {
              return (
                <div
                  className="customDatePickerWidth"
                  style={{ marginTop: "1rem" }}
                >
                  <label style={labelStyle}>{getLabelString(obj)}</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setThirdDate(date)}
                  />
                </div>
              );
            }
            if (
              obj === "fecha_fin" ||
              obj === "fecha_termino" ||
              obj === "fecha_baja" ||
              obj === "termino_beca"
            ) {
              return (
                <div
                  className="customDatePickerWidth"
                  style={{ marginTop: "1rem" }}
                >
                  <label style={labelStyle}>{getLabelString(obj)}</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </div>
              );
            }
            if (obj === "fecha_obt_grado") {
              return (
                <div
                  className="customDatePickerWidth"
                  style={{ marginTop: "1rem" }}
                >
                  <label style={labelStyle}>{getLabelString(obj)}</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setThirdDate(date)}
                  />
                </div>
              );
            }
            if (
              obj === "id_programa" &&
              (type === "estudiantes" || type === "profesores")
            ) {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    {programasPersona.map((programa) => (
                      <option value={programa.id_programa}>
                        {programa.nombrecompleto}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              );
            }
            if (obj === "tipo" && type === "profesores") {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    <option value="BASE">BASE</option>
                    <option value="INTERINATO">INTERINATO</option>
                    <option value="HONORARIOS">HONORARIOS</option>
                    <option value="OTRO">OTRO</option>
                  </Form.Select>
                </div>
              );
            }
            if (obj === "mecanismo_vinc" && type === "proyectos") {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    <option value="CONVENIO">CONVENIO</option>
                    <option value="GESTION DIRECTA">GESTION DIRECTA</option>
                    <option value="BASE DE CONCERTACION">BASE DE CONCERTACION</option>
                    <option value="OTRO">OTRO</option>
                  </Form.Select>
                </div>
              );
            }
            if (obj === "tiempo_dedicacion" && type === "profesores") {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    <option value="PROFESOR TIEMPO COMPLETO">
                      PROFESOR TIEMPO COMPLETO
                    </option>
                    <option value="PROFESOR TIEMPO PARCIAL">
                      PROFESOR TIEMPO PARCIAL
                    </option>
                    <option value="PROFESOR TIEMPO PARCIAL INTERNO">
                      PROFESOR TIEMPO PARCIAL INTERNO
                    </option>
                    <option value="PROFESOR TIEMPO PARCIAL EXTERNO">
                      PROFESOR TIEMPO PARCIAL EXTERNO
                    </option>
                  </Form.Select>
                </div>
              );
            }
            if (obj === "tiempo_dedicacion" && type === "estudiantes") {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    <option value="PARCIAL">PARCIAL</option>
                    <option value="COMPLETO">COMPLETO</option>
                  </Form.Select>
                </div>
              );
            }
            if (obj === "cohorte" && type === "estudiantes") {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    {years.map((year, idx) => (
                      <option key={idx} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              );
            }
            if (obj === "estado_beca" && type === "estudiantes") {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    <option value="POSTULACION">POSTULACION</option>
                    <option value="ACTIVA">ACTIVA</option>
                    <option value="BAJA">BAJA</option>
                    <option value="CANCELADA">CANCELADA</option>
                    <option value="LIBERADA">LIBERADA</option>
                  </Form.Select>
                </div>
              );
            }
            if (obj === "ambito" && type === "organismos") {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    <option value="LOCAL">LOCAL</option>
                    <option value="ESTATAL">ESTATAL</option>
                    <option value="REGIONAL">REGIONAL</option>
                    <option value="NACIONAL">NACIONAL</option>
                    <option value="INTERNACIONAL">INTERNACIONAL</option>
                  </Form.Select>
                </div>
              );
            }
            if (obj === "pais" && type === "organismos") {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    {paises.map((pais) => (
                      <option key={pais.id} value={pais.name.toUpperCase()}>
                        {pais.name.toUpperCase()}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              );
            }
            if (obj === "sector" && type === "organismos") {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    {sectores.map((sector) => (
                      <option value={sector.toUpperCase()}>
                        {sector.toUpperCase()}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              );
            }
            if (obj === "entidad_federativa" && type === "organismos") {
              return (
                <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    {estados.map((state) => (
                      <option key={state.id} value={state.name.toUpperCase()}>
                        {state.name.toUpperCase()}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              );
            }
            if (obj === "lgac_programa" && type === "lgacs") {
              return (
                <div style={{ marginTop: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    {programasPersona.map((programa) => (
                      <option value={programa.id_programa}>
                        {programa.nombrecompleto}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              );
            }
            if (obj === "id_estudiante" && type === "proyectos") {
              return (
                <div style={{ marginTop: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    {estudiantesProyecto.map((est) => (
                      <option value={est.id_estudiante}>
                        {`${est.nombres}${" "}${est.apaterno}${" "}${
                          est.amaterno
                        }`}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              );
            }
            if (obj === "id_organismo" && type === "proyectos") {
              return (
                <div style={{ marginTop: "1.5rem" }}>
                  <Form.Label style={labelStyle}>
                    {getLabelString(obj)}
                  </Form.Label>
                  <Form.Select
                    onChange={(e) => handleChange(e, obj)}
                    aria-label="Default select example"
                  >
                    {organismoProyecto.map((est) => (
                      <option value={est.id_organismo}>{est.nombre}</option>
                    ))}
                  </Form.Select>
                </div>
              );
            }
            return (
              <Form.Group className="mb-3" key={idx} controlId="formBasicEmail">
                <Form.Label style={labelStyle}>
                  {getLabelString(obj)}
                </Form.Label>
                <Form.Control
                  onChange={(e) => handleChange(e, obj)}
                  type="text"
                  value={seleccion[obj]}
                />
              </Form.Group>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={submitForm}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export function getLabelString(str) {
  switch (str) {
    case "nombres":
      return "NOMBRES";
    case "nombre":
      return "NOMBRE";
    case "apaterno":
      return "APELLIDO PATERNO";
    case "amaterno":
      return "APELLIDO MATERNO";
    case "usuario":
      return "USUARIO";
    case "rol":
      return "ROL";
    case "tiempo_dedicacion":
      return "TIEMPO DE DEDICACIÓN";
    case "cvu_conacyt":
      return "CVU DE CONACYT";
    case "cvu_conacyt":
      return "CVU DE CONACYT";
    case "fecha_fin":
      return "FECHA DE FIN";
    case "fecha_termino":
      return "FECHA DE TÉRMINO";
    case "fecha_inicio":
      return "FECHA DE INICIO";
    case "entidad_federativa":
      return "ENTIDAD FEDERATIVA";
    case "id_producto":
      return "ID PRODUCTO";
    case "estado_beca":
      return "ESTADO DE LA BECA";
    case "termino_beca":
      return "TÉRMINO DE BECA";
    case "inicio_beca":
      return "INICO DE BECA";
    case "id_estudiante":
      return "ESTUDIANTE";
    case "numcontrol":
      return "NÚMERO DE CONTROL";
    case "cohorte":
      return "COHORTE";
    case "curp":
      return "CURP";
    case "correopersonal":
      return "CORREO PERSONAL";
    case "correoinstitucional":
      return "CORREO INSTITUCIONAL";
    case "instit_procedencia":
      return "INSTITUTO DE PROCEDENCIA";
    case "numero_beca":
      return "NÚMERO DE BECA";
    case "fecha_obt_grado":
      return "FECHA DE OBTENCIÓN DE GRADO";
    case "id_persona":
      return "ID PERSONA";
    case "clave":
      return "CLAVE";
    case "lgac_programa":
      return "PROGRAMA";
    case "id_programa":
      return "PROGRAMA";
    case "nombrecompleto":
      return "NOMBRE COMPLETO";
    case "nombrecorto":
      return "NOMBRE CORTO";
    case "clave_plan":
      return "CLAVE DE PLAN";
    case "referencia_snp":
      return "REFERENCIA SNP";
    case "sector":
      return "SECTOR";
    case "descripcion":
      return "DESCRIPCIÓN";
    case "ambito":
      return "ÁMBITO";
    case "pais":
      return "PAÍS";
    case "objetivo":
      return "OBJETIVO";
    case "fecha_ingreso_banco":
      return "FECHA DE INGRESO A BANCO";
    case "mecanismo_vinc":
      return "MECANISMO DE VINCULACIÓN";
    case "id_organismo":
      return "ORGANISMO";
    case "fecha_alta":
      return "FECHA ALTA";
    case "fecha_baja":
      return "FECHA BAJA";
    case "id_lgac":
      return "ID LGAC";
    case "correropersonal":
      return "CORREO PERSONAL";
    default:
      return str.toUpperCase();
  }
}

export default FormularioCrear;
