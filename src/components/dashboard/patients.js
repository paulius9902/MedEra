import React, {useState, useEffect} from 'react';
import axios from '../../axiosApi';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles
} from '@material-ui/core';
import PeopleIcon from '@mui/icons-material/People';
import CountUp from 'react-countup';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1)
  }
}));

const Patients = ({ className, ...rest }) => {
  const classes = useStyles();
  const [patient_count, setPatientCount] = useState(0)

  useEffect(() => {
    getPatientCount();
  },[])

  const getPatientCount = async () => {
    const  { data } = await axios.get(`api/patient_count`)
    console.log(data);
    setPatientCount(data);
  }
  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}>
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              PACIENTAI
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              <CountUp end={patient_count} duration={3.3}/>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <PeopleIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Patients.propTypes = {
  className: PropTypes.string
};

export default Patients;