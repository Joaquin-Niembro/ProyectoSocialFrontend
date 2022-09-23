import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Typography from "@mui/material/Typography";
import Button from "react-bootstrap/Button";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Form from "react-bootstrap/Form";

function Report() {
  const [data, setData] = useState([]);
  const [dataCopy, setDataCopy] = useState([]);
  const [programa, setPrograma] = useState(
    "MAESTRIA EN SISTEMAS COMPUTACIONALES"
  );
  const [programas, setProgramas] = useState([]);
  useEffect(() => {
    async function fetch() {
      const response = await axios.get(
        "http://localhost:5000/ui/estudiantes-programa"
      );
      const res = await axios.get(`http://localhost:5000/ui/programas`);
      if (response.status === 200) {
        setData(response.data.filter((x) => x.programa === programa));
        setDataCopy(response.data);
        setProgramas(res.data);
      }
    }
    fetch();
  }, []);
  function handleChange(e) {
    setPrograma(e.target.value);
    let x = [];
    dataCopy.forEach((y) => {
      if (parseInt(y.id_programa) === parseInt(e.target.value)) {
        x.push(y);
      }
    });
    setData(x);
  }
  function getProgramaName(id) {
    const p = programas.filter((y) => parseInt(y.id_programa) === parseInt(id));
    return p[0].nombrecompleto;
  }
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Estudiantes de:{" "}
        <Form.Select
          onChange={(e) => handleChange(e)}
          aria-label="Default select example"
        >
          {programas.map((programa) => (
            <option value={programa.id_programa}>
              {programa.nombrecompleto}
            </option>
          ))}
        </Form.Select>
      </Typography>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Button
                style={{ margin: ".5rem" }}
                variant="primary"
                onClick={() =>
                  exportPDF(
                    `Estudiantes de: ${getProgramaName(programa)}`,
                    [
                      "Estudiante",
                      "CVU",
                      "Inicio de Beca",
                      "Termino de beca",
                      "CURP",
                      "Número de Control",
                      "Número de beca",
                      "Intituto de procedencia",
                    ],
                    data
                  )
                }
              >
                pdf
              </Button>
              <Button style={{ margin: ".5rem" }} onClick={() => getCsv(data)}>
                csv
              </Button>
            </th>
            <th>Estudiante</th>
            <th>CVU</th>
            <th>Inicio de beca</th>
            <th>Termino de beca</th>
            <th>Estado</th>
            <th>CURP</th>
            <th>Número de control</th>
            <th>Esta de beca</th>
            <th>Número de beca</th>
            <th>Intituto de procedencia</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{`${x.nombres} ${" "} ${x.apaterno}${" "}${x.amaterno}`}</td>
              <td>{x.cvu_conacyt}</td>
              <td>{x.inicio_beca}</td>
              <td>{x.termino_beca}</td>
              <td>{x.estado}</td>
              <td>{x.curp}</td>
              <td>{x.numcontrol}</td>
              <td>{x.estado_beca}</td>
              <td>{x.numero_beca}</td>
              <td>{x.instit_procedencia}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
function exportPDF(title, header, dataSet) {
  const unit = "pt";
  const size = "A4"; // Use A1, A2, A3 or A4
  const orientation = "portrait"; // portrait or landscape

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);

  doc.setFontSize(15);

  const headers = [header];

  const data = dataSet.map((x) => [
    `${x.nombres} ${" "} ${x.apaterno}${" "}${x.amaterno}`,
    x.cvu_conacyt,
    x.inicio_beca,
    x.termino_beca,
    x.curp,
    x.numcontrol,
    x.numero_beca,
    x.instit_procedencia,
  ]);

  let content = {
    startY: 50,
    head: headers,
    body: data,
  };

  doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  doc.save("reporte-estudiantes-programas.pdf");
}

function getCsv(rows) {
  let csvContent = "data:text/csv;charset=utf-8,";

  let m = [
    [
      "Nombre Completo",
      "CVU",
      "Inicio de Beca",
      "Termino de Beca",
      "Numero de Control",
      "CURP",
      "Instituto de Procedencia",
      "Numero de Beca",
    ],
  ];
  rows.forEach((row) => {
    let n = [];
    n.push(`${row.nombres} ${" "} ${row.apaterno}${" "}${row.amaterno}`);
    n.push(row.cvu_conacyt);
    n.push(row.inicio_beca);
    n.push(row.termino_beca);
    n.push(row.numcontrol);
    n.push(row.curp);
    n.push(row.instit_procedencia);
    n.push(row.numero_beca);
    m.push(n);
  });
  m.forEach(function (rowArray) {
    let row = rowArray.join(",");
    csvContent += row + "\r\n";
  });
  var encodedUri = encodeURI(csvContent);
  window.open(encodedUri);
}
export default Report;
