import React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";

function EstadoCheckbox({ estadoCheckbox, setEstadoCheckbox, labelStyle }) {
  return (
    <FormGroup style={{ paddingTop: "1rem", marginBottom: '1rem' }}>
      <Typography
        style={labelStyle}
        variant="subtitle1"
        gutterBottom
        component="div"
      >
        ESTADO
      </Typography>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={estadoCheckbox}
              onChange={() => setEstadoCheckbox((x) => !x)}
            />
          }
          label="Activo"
        />
      </div>
    </FormGroup>
  );
}

export default EstadoCheckbox;
