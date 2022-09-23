import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link } from "react-router-dom";
const style = { textDecoration: "none", color: "black" };
export const mainListItems = (
  <React.Fragment>
    <Link style={style} to="/main/profesores">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Profesores" />
      </ListItemButton>
    </Link>
    <Link style={style} to="/main/estudiantes">
      <ListItemButton>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Estudiantes" />
      </ListItemButton>
    </Link>
    <Link style={style} to="/main/productos">
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Productos" />
      </ListItemButton>
    </Link>
    <Link style={style} to="/main/proyectos">
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Proyectos" />
      </ListItemButton>
    </Link>
    <Link style={style} to="/main/organismos">
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Organismos" />
      </ListItemButton>
    </Link>
    <Link style={style} to="/main/lgacs">
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="LGACs" />
      </ListItemButton>
    </Link>
    <Link style={style} to="/main/programas">
      <ListItemButton>
        <ListItemIcon>
          <LayersIcon />
        </ListItemIcon>
        <ListItemText primary="Programas" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Reportes
    </ListSubheader>
    <Link style={style} to="/main/reports/estudiantes-programa">
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Estudiantes/Programa" />
      </ListItemButton>
    </Link>
    <Link style={style} to="/main/reports/profesores-programa">
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Profesores/Programa" />
      </ListItemButton>
    </Link>
    <Link style={style} to="/main/reports/proyectos-organismos">
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Proyectos/Organismo" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);
