import React, { useState, useEffect } from "react";
import clsx from 'clsx';
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

import Connection from "../common/Connection";
const connection = new Connection()

export function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            <Link color="inherit" href="https://material-ui.com/">
                Ticketing System
      </Link>{" "}
            {new Date().getFullYear()}
            {". Built with "}
            <Link color="inherit" href="https://material-ui.com/">
                Material-UI.
      </Link>
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    root: {
        height: "100vh"
    },
    image: {
        backgroundImage: "url(https://source.unsplash.com/random/?programming)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center"
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
}));

export default function SignInSide() {
    const classes = useStyles();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const buttonClassname = clsx({
        [classes.buttonSuccess]: success,
    });
    useEffect(() => {
        initialLoad();
    });

    function initialLoad() {
        // firebase.auth().onAuthStateChanged(function(user) {
        //   if (user) {
        //     window.location.href = "/cms#/blogs";
        //   } else {
        //     // No user is signed in.
        //   }
        // });
    }

    async function login(event) {
        localStorage.clear();
        event.preventDefault();
        try {
            setSuccess(false);
            setLoading(true);

            connection.post('login', { username, password }).then(response => {
                console.log(response.data)
                if (response.data) {
                    var responseValue = Object.keys(response.data['user_access']);
                    if (responseValue.includes('token')) {
                        localStorage.setItem("data_access", JSON.stringify(response.data['user_access']));
                        localStorage.setItem("user", JSON.stringify(response.data['user']));
                        setSuccess(true);
                        setLoading(false);
                        const parsedUserType = response.data['user']['userType'];
                        if (parsedUserType === "Guest") {
                            window.location.href = "/app#/dashboard";
                        } else if (parsedUserType === "Admin" || parsedUserType === "SuperAdmin") {
                            window.location.href = "/app#/tickets";
                        }

                    } else {

                    }

                }
            }).catch(error => {
                setSuccess(true);
                setLoading(false);
                console.log(error)
            })

        } catch (error) {
            setSuccess(true);
            setLoading(false);
            console.log(error);
        }
    }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
          </Typography>
                    <form onSubmit={login} className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="email"
                            autoFocus
                            onChange={e => setUsername(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={e => setPassword(e.target.value)}
                        />



                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                        <Button
                            variant="contained"
                            color="primary"
                            className={buttonClassname}
                            disabled={loading}
                            type="submit"
                        >
                            Sign In
        </Button>

                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid >
    );
}
