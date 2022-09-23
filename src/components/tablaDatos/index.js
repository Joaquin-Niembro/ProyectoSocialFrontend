import React, { useEffect, useState, useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { TablePagination } from "@mui/material";
import axios from "axios";

const mockHeadings = ["ID", "Nombre", "Resumen de Horas", "Proyecto", "Editar"];
function TablaDatos({
  headings = mockHeadings,
  type,
  literals = ["ID_persona", "nombres", "nombres", "cvu_conacyt"],
  filterValue = "",
  path,
  handleClickOpen,
  rows,
  setRows,
  filterLiteral = "nombres",
  setSeleccionCrear = {},
}) {
  const [rowsCopy, setRowsCopy] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/ui/${type}`);
        if (res.status === 200) {
          setRows(res.data);
          setRowsCopy(res.data);
          setSeleccionCrear(res.data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [path]);

  useEffect(() => {
    if (filterValue.length > 0) {
      setRows(
        rowsCopy.filter(
          (x) => x[filterLiteral].toLowerCase() === filterValue.toLowerCase()
        )
      );
    } else {
      setRows(rowsCopy);
    }
  }, [filterValue]);
  return (
    <TableContainer component={Paper} style={{ maxHeight: 500 }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headings.map((heading, idx) => (
              <TableCell key={idx}>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.ID_persona}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row[literals[0]]}
              </TableCell>
              <TableCell>{row[literals[1]]}</TableCell>
              <TableCell>{row[literals[2]]}</TableCell>
              <TableCell>{row[literals[3]]}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  onClick={() => handleClickOpen(row)}
                >
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10]}
        component="div"
        count={rows.length}
        rowsPerPage={10}
        page={page}
        onPageChange={() => setRowsPagination(rowsCopy, setRows, setPage, page)}
        onRowsPerPageChange={() => {}}
      />
    </TableContainer>
  );
}

function setRowsPagination(rowsCopy, setRows, setPage, page) {
  const len = rowsCopy.length;
  const howMany = 10 % len
  console.log(howMany)
  console.log(rowsCopy.filter((x, idx) => idx > 9));
}
export default TablaDatos;
