import React from "react";
import Patients from '../dashboard/patients';
import Doctors from '../dashboard/doctors';
import Visits from '../dashboard/visits';
import Users from '../dashboard/users';
import { Container, Grid, makeStyles } from '@material-ui/core';

function Home() {

  return (
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Patients />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Doctors />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Visits />
          </Grid>
          <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Users />
          </Grid>
        </Grid>
      </Container>
  );
};

export default Home;