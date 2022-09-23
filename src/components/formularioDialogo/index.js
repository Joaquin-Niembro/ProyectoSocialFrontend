import * as React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EstadoCheckbox from "../estadoCheckbox";
import axios from "axios";
import DatePicker from "react-datepicker";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getLabelString } from "../formularioCrear";
import { years, sectores, states, countries } from "../../utils";

import "react-datepicker/dist/react-datepicker.css";
const labelStyle = {
  fontWeight: "bold",
  fontSize: "1.3rem",
};
function getEstadoValue(seleccion, type) {
  if (seleccion.estado && seleccion.estado === "ACTIVO") {
    return true;
  }
}
const marginStyle = {
  marginTop: "2rem",
};
export default function FormDialog({
  handleClose,
  open,
  seleccion,
  setSeleccion,
  type = "proyectos",
  setRows,
}) {
  const [startDate, setStartDate] = React.useState(
    Date.parse(new Date(seleccion.fecha_inicio))
  );

  const [endDate, setEndDate] = React.useState(
    Date.parse(new Date(seleccion.fecha_fin))
  );
  const [programasPersona, setProgramasPersona] = React.useState([]);
  const [estudiantesProyecto, setEstudiantesProyecto] = React.useState([]);
  const [organismoProyecto, setOrganismoProyecto] = React.useState([]);
  const [paises, setPaises] = React.useState(countries);
  const [estados, setEstados] = React.useState(states);

  function handleChange(e, obj) {
    if (obj === "cvu_conacyt") {
      if (Number(e.target.value)) {
        const copy = { ...seleccion };
        copy[obj] = e.target.value;
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
      if (obj !== "rol") {
        const copy = { ...seleccion };
        copy[obj] = e.target.value.toUpperCase();
        setSeleccion(copy);
      }
    }
  }
  const [estadoCheckbox, setEstadoCheckbox] = React.useState(
    getEstadoValue(seleccion, type)
  );

  async function submitForm() {
    const response = await axios.post(
      `http://localhost:5000/ui/${type}`,
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
          const id =
            type === "lgacs" ? seleccion.lgac_programa : seleccion.id_programa;
          const p = response.data.filter(
            (x) => parseInt(x.id_programa) === parseInt(id)
          );
          const d = response.data.filter(
            (x) => parseInt(x.id_programa) !== parseInt(id)
          );
          setProgramasPersona([...p, ...d]);
        }
      }
    }
    fetch();
  }, [type, open]);
  React.useEffect(() => {
    async function fetch() {
      if (type === "proyectos") {
        const response = await axios.get(
          `http://localhost:5000/ui/estudiantes`
        );
        const responseOrg = await axios.get(
          `http://localhost:5000/ui/organismos`
        );
        if (response.status === 200) {
          const id = seleccion.id_estudiante;
          const p = response.data.filter(
            (x) => parseInt(x.id_estudiante) === parseInt(id)
          );
          const d = response.data.filter(
            (x) => parseInt(x.id_estudiante) !== parseInt(id)
          );
          setEstudiantesProyecto([...p, ...d]);
        }
        if (responseOrg.status === 200) {
          const idOrg = seleccion.id_organismo;
          const w = responseOrg.data.filter(
            (x) => parseInt(x.id_organismo) === parseInt(idOrg)
          );
          const y = responseOrg.data.filter(
            (x) => parseInt(x.id_organismo) !== parseInt(idOrg)
          );
          setOrganismoProyecto([...w, ...y]);
        }
      }
    }
    fetch();
  }, [type, open]);
  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullScreen={true}>
        <DialogTitle>EDITAR</DialogTitle>
        <DialogContent>
          <DialogContentText>ACTUALIZA LOS CAMPOS A EDITAR.</DialogContentText>
          {Object.keys(seleccion).map((obj, idx) => {
            if (!seleccion[obj]) {
              return <></>;
            }
            if (obj === "estado") {
              return (
                <EstadoCheckbox
                  estadoCheckbox={estadoCheckbox}
                  setEstadoCheckbox={setEstadoCheckbox}
                />
              );
            }
            if (obj === "cvu_conacyt") {
              <Form.Group className="mb-3" key={idx} controlId="formBasicEmail">
                <Form.Label style={labelStyle}>
                  {getLabelString(obj)}
                </Form.Label>
                <Form.Control
                  onChange={(e) => handleChange(e, obj)}
                  type="number"
                  value={seleccion[obj]}
                />
              </Form.Group>;
            }
            if (obj === "rol") {
              <TextField
                key={idx}
                autoFocus
                margin="dense"
                id="name"
                label={obj}
                type="number"
                fullWidth
                variant="standard"
                value={seleccion[obj]}
                onChange={(e) => handleChange(e, obj)}
                style={{ ...marginStyle, ...labelStyle }}
              />;
            }
            if (obj === "fecha_inicio") {
              return (
                <div style={{ marginTop: "1rem" }}>
                  <label style={labelStyle}>Fecha de Inicio</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                  />
                </div>
              );
            }
            if (obj === "fecha_fin" || obj === "fecha_termino") {
              return (
                <div style={{ marginTop: "1rem" }}>
                  <label style={labelStyle}>Fecha de Fin</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                  />
                </div>
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
                    {sectores.map((sector, idx) => (
                      <option value={sector.toUpperCase()}>
                        {sector.toUpperCase()}
                      </option>
                    ))}
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
            if (obj === "lgac_programa" && type === "lgacs") {
              return (
                <div style={{ marginTop: "1.5rem", ...labelStyle }}>
                  <Form.Label>{getLabelString(obj)}</Form.Label>
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
