import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Typography from "@mui/material/Typography";
import jsPDF from "jspdf";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "jspdf-autotable";

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
        "http://localhost:5000/ui/profesores-programa"
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
        Profesores de la:{" "}
        <div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
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
        </div>
      </Typography>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Button
                style={{ margin: ".5rem" }}
                onClick={() =>
                  exportPDF(
                    `Profesores de: ${getProgramaName(programa)}`,
                    [
                      "Profesor",
                      "CVU",
                      "Tiempo de decicación",
                      "Fecha de alta",
                      "Fecha de baja",
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
            <th>Profesor</th>
            <th>CVU</th>
            <th>Tiempo de decicación</th>
            <th>Fecha de alta</th>
            <th>Fecha de baja</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{`${x.nombres} ${" "} ${x.apaterno}${" "}${x.amaterno}`}</td>
              <td>{x.cvu_conacyt}</td>
              <td>{x.tiempo_dedicacion}</td>
              <td>{x.fecha_alta.split("T")[0]}</td>
              <td>{x.fecha_baja.split("T")[0]}</td>
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
    x.tiempo_dedicacion,
    x.fecha_alta.split("T")[0],
    x.fecha_baja.split("T")[0],
  ]);

  let content = {
    startY: 50,
    head: headers,
    body: data,
  };

  doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  doc.save("reporte-profesores-progrmas.pdf");
}
function getCsv(rows) {
  let csvContent = "data:text/csv;charset=utf-8,";

  let m = [
    [
      "Nombre Completo",
      "CVU",
      "Tiempo de decicación",
      "Fecha de alta",
      "Fecha de baja",
    ],
  ];
  rows.forEach((row) => {
    let n = [];
    n.push(`${row.nombres} ${" "} ${row.apaterno}${" "}${row.amaterno}`);
    n.push(row.cvu_conacyt);
    n.push(row.tiempo_dedicacion);
    n.push(row.fecha_alta.split("T")[0]);
    n.push(row.fecha_baja.split("T")[0]);
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
