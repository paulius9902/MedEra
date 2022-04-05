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
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CountUp from 'react-countup';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  }
}));

const Users = ({ className, ...rest }) => {
  const classes = useStyles();
  const [user_count, setUserCount] = useState(0)

  useEffect(() => {
    getUserCount();
  },[])

  const getUserCount = async () => {
    const  { data } = await axios.get(`api/user_count`)
    console.log(data);
    setUserCount(data);
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
              VARTOTOJAI
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              <CountUp end={user_count} duration={3.3}/>
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AccountBoxIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Users.propTypes = {
  className: PropTypes.string
};

export default Users;
