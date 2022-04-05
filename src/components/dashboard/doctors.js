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
  makeStyles,
  colors
} from '@material-ui/core';
import MedicationIcon from '@mui/icons-material/Medication';
import CountUp from 'react-countup';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.orange[600],
    height: 56,
    width: 56
  }
}));

const Doctors = ({ className, ...rest }) => {
  const classes = useStyles();
  const [doctor_count, setDoctorCount] = useState(0)

  useEffect(() => {
    getDoctorCount();
  },[])

  const getDoctorCount = async () => {
    const  { data } = await axios.get(`api/doctor_count`)
    console.log(data);
    setDoctorCount(data);
  }

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          spacing={3}>
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              GYDYTOJAI
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              <CountUp end={doctor_count} duration={3.3}/>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MedicationIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Doctors.propTypes = {
  className: PropTypes.string
};

export default Doctors;
