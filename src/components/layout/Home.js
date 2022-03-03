import React from "react";
import Patients from '../dashboard/Patients';
import Doctors from '../dashboard/Doctors';
import Visits from '../dashboard/Visits';
import Users from '../dashboard/Users';
import { Container, Grid, makeStyles } from '@material-ui/core';

function Home() {

  return (
    <div>
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
    </div>
  );
};

export default Home;