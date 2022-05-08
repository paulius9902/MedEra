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
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import CountUp from 'react-countup';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.green[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));

const Visits = ({ className, ...rest }) => {
  const classes = useStyles();
  const [visit_count, setVisitCount] = useState(0)

  useEffect(() => {
    getVisitCount();
  },[])

  const getVisitCount = async () => {
    const  { data } = await axios.get(`api/visit_count`)
    setVisitCount(data);
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
              VIZITAI
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              <CountUp end={visit_count} duration={3.3}/>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <InsertInvitationIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Visits.propTypes = {
  className: PropTypes.string
};

export default Visits;
