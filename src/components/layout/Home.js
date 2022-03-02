import React from "react";
import Patients from '../dashboard/patients';
import { Container, Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

function Home() {
  

  const classes = useStyles();

  return (
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Patients />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Patients />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Patients />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Patients />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
          <Patients />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
          <Patients />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
          <Patients />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
          <Patients />
          </Grid>
        </Grid>
      </Container>
  );
};

export default Home;