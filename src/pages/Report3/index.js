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
  const [organismo, setOrganismo] = useState("ONG");
  const [organismos, setOrganismos] = useState([]);
  useEffect(() => {
    async function fetch() {
      const response = await axios.get(
        "http://localhost:5000/ui/proyectos-organismos"
      );
      const res = await axios.get(`http://localhost:5000/ui/organismos`);
      if (response.status === 200) {
        setData(
          response.data.filter(
            (x) => JSON.stringify(x.organismo) === JSON.stringify(organismo)
          )
        );
        setDataCopy(response.data);
        setOrganismos(res.data);
      }
    }
    fetch();
  }, []);
  function handleChange(e) {
    setOrganismo(e.target.value);
    let x = [];
    dataCopy.forEach((y) => {
      if (parseInt(y.id_organismo) === parseInt(e.target.value)) {
        x.push(y);
      }
    });
    setData(x);
  }
  function getOrganismoName(id) {
    const p = organismos.filter(
      (y) => parseInt(y.id_organismo) === parseInt(id)
    );
    return p[0].nombre;
  }
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Proyectos Vinculados de:
        <Form.Select
          onChange={(e) => handleChange(e)}
          aria-label="Default select example"
        >
          {organismos.map((org) => (
            <option value={org.id_organismo}>{org.nombre}</option>
          ))}
        </Form.Select>
      </Typography>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              {" "}
              <Button
                style={{ margin: ".5rem" }}
                onClick={() =>
                  exportPDF(
                    `Proyectos de: ${getOrganismoName(organismo)}`,
                    [
                      "Proyecto",
                      "Estado",
                      "Mecanismo de vinculación",
                      "Fecha de ingreso al banco",
                      "Fecha de inicio",
                      "Fecha de termino",
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
            <th>Proyecto</th>
            <th>Estado</th>
            <th>Mecanismo de vinculación</th>
            <th>Fecha de ingreso al banco</th>
            <th>Fecha de inicio</th>
            <th>Fecha de termino</th>
          </tr>
        </thead>
        <tbody>
          {data.map((x, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{`${x.nombre}`}</td>
              <td>{x.estado}</td>
              <td>{x.mecanismo_vinc}</td>
              <td>{x.fecha_ingreso_banco.split("T")[0]}</td>
              <td>{x.fecha_inicio.split("T")[0]}</td>
              <td>{x.fecha_termino}</td>
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

  const data = dataSet.map((elt) => [
    elt.nombre,
    elt.estado,
    elt.mecanismo_vinc,
    elt.fecha_ingreso_banco.split("T")[0],
    elt.fecha_inicio.split("T")[0],
    elt.fecha_termino,
  ]);

  let content = {
    startY: 50,
    head: headers,
    body: data,
  };

  doc.text(title, marginLeft, 40);
  doc.autoTable(content);
  doc.save("reporte-proyectos-organismos.pdf");
}
function getCsv(rows) {
  let csvContent = "data:text/csv;charset=utf-8,";

  let m = [
    [
      "Proyecto",
      "Estado",
      "Mecanismo de vinculación",
      "Fecha de ingreso al banco",
      "Fecha de inicio",
      "Fecha de termino",
    ],
  ];
  rows.forEach((row) => {
    let n = [];
    n.push(row.nombre);
    n.push(row.estado);
    n.push(row.mecanismo_vinc);
    n.push(row.fecha_ingreso_banco.split("T")[0]);
    n.push(row.fecha_inicio.split("T")[0]);
    n.push(row.fecha_termino);
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
