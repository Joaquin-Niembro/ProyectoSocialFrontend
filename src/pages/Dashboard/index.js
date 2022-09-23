import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import { mainListItems, secondaryListItems } from "./listItems";
import { withRouter } from "react-router-dom";
import Section from "../../pages/Section";
import { AuthContext } from "../../context/authContext";
import Report from "../../pages/Report";
import Report2 from "../../pages/Report2";
import Report3 from "../../pages/Report3";
import { LocationContext } from "../../context/locationContext";

const routes = [
  { id: 1, name: "/profesores" },
  { id: 2, name: "/estudiantes" },
  { id: 4, name: "/productos" },
  { id: 5, name: "/proyectos" },
  { id: 6, name: "/organismos" },
];
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function getRenderComponent(location, path) {
  switch (location.pathname) {
    case "/main/estudiantes":
      return <Section type="estudiantes" path={path} />;
    case "/main/profesores":
      return <Section type="profesores" path={path} />;
    case "/main/productos":
      return (
        <Section
          type="productos"
          path={path}
          literals={["id_producto", "nombre", "estado", "estado"]}
          headings={["ID", "Nombre", "Estado", "Editar", "Editar"]}
          filterLiteral="nombre"
        />
      );

    case "/main/organismos":
      return (
        <Section
          type="organismos"
          path={path}
          literals={["id_organismo", "nombre", "sector", "descripcion"]}
          headings={["ID", "Nombre", "Sector", "Descripcion", "Editar"]}
          filterLiteral="nombre"
        />
      );
    case "/main/proyectos":
      return (
        <Section
          type="proyectos"
          path={path}
          literals={["id_proyecto", "nombre", "objetivo", "descripcion"]}
          headings={["ID", "Nombre", "Objetivo", "Descripcion", "Editar"]}
          filterLiteral="nombre"
        />
      );
    case "/main/lgacs":
      return (
        <Section
          type="lgacs"
          path={path}
          literals={["id_lgac", "nombre", "clave", "lgac_programa"]}
          headings={["ID", "Nombre", "Clave", "Programa", "Editar"]}
          filterLiteral="nombre"
        />
      );
    case "/main/programas":
      return (
        <Section
          type="programas"
          path={path}
          literals={[
            "id_programa",
            "nombrecompleto",
            "clave_plan",
            "referencia_snp",
          ]}
          headings={["ID", "Nombre", "Clave", "Referencia SNP", "Editar"]}
          filterLiteral="nombrecompleto"
        />
      );
    case "/main/reports/estudiantes-programa":
      return <Report />;
    case "/main/reports/profesores-programa":
      return <Report2 />;
    case "/main/reports/proyectos-organismos":
      return <Report3 />;
    default:
      return <h1>cool</h1>;
  }
}
function DashboardContent({ location }) {
  const [open, setOpen] = React.useState(true);
  const [auth, setAuth] = React.useContext(AuthContext);
  const [path, setPath] = React.useContext(LocationContext);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  React.useEffect(() => {
    setPath(location.pathname);
  }, [location]);
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Sistema ITC
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => {
                localStorage.removeItem("auth");
                setAuth(null);
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {getRenderComponent(location, path)}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
const WrappedDashboard = withRouter(DashboardContent);
export default function Dashboard() {
  return <WrappedDashboard />;
}
