import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Link
} from "@material-ui/core";

const Footer = () => <>
  <AppBar position="static" elevation={0} component="footer" color="default">
    <Toolbar style={{ justifyContent: "center" }}>
      <Typography variant="caption">Sanic Ltd ©2022</Typography>
    </Toolbar>
  </AppBar>
</>

export default Footer;