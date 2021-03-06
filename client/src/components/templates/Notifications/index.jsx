import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Checkbox from "@material-ui/core/Checkbox";
import ContainedButton from "../../atoms/Button/Contained";
import ExpansionList from "../../organisms/ExpansionPanel";

const useStyles = makeStyles((theme) => {
  return {
    root: {
      width: "100%",
    },
    heading: {
      fontFamily: '"Roboto", sans-serif',
      fontSize: 19,
      lineHeight: 1.42,
      color: "#000000",
      fontWeight: 400,
      margin: 0,
    },
    checkbox: {
      textAlign: "right",
    },
    blueHeading: {
      fontFamily: '"Roboto", sans-serif',
      fontSize: 19,
      lineHeight: 1.42,
      color: theme.palette.primary.main,
      fontWeight: 400,
      margin: 0,
    },
    listItem: {
      fontFamily: '"Roboto", sans-serif',
      fontSize: 16,
      lineHeight: 1.6,
      marginTop: 12,
      marginBottom: 12,
    },
    toggle: {
      fontFamily: '"Cabin",  sans-serif',
      textTransform: "uppercase",
      fontWeight: 700,
      fontSize: 14,
      color: theme.palette.primary.main,
      textAlign: "right",
    },
    toggleLabel: { fontWeight: 700 },
  };
});

const BlueSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1),
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.primary.main,
      "& + $track": {
        backgroundColor: theme.palette.primary.light,
        opacity: 1,
        border: "none",
      },
    },
    "&$focusVisible $thumb": {
      color: theme.palette.primary.main,
      border: "6px solid #fff",
    },
  },
  thumb: {
    width: 24,
    height: 24,
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"]),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

const BlueCheckbox = withStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    "&$checked": {
      color: theme.palette.primary.main,
    },
  },
  checked: {},
}))((props) => <Checkbox color="default" fontSize="large" {...props} />);

export default function ActivityList({ user, updateUser, title, heading }) {
  const classes = useStyles();

  return (
    <ExpansionList title={title} heading={heading}>
      <Grid container>
        <Grid item xs={12}>
          <List component="nav" className={classes.root}>
            <ListItem className={classes.listItem}>
              <Grid container>
                <Grid item xs={10}>
                  <h5 className={classes.heading}>
                    Notify me via email if any of the below actions are made on
                    Juniper
                  </h5>
                </Grid>
                <Grid item xs={2} className={classes.toggle}>
                  <FormControlLabel
                    control={
                      <BlueSwitch
                        checked={user.notifications}
                        onChange={(e) => {
                          updateUser({ notifications: e.target.checked });
                        }}
                      />
                    }
                    label={user.notifications ? "On" : "Off"}
                    labelPlacement="start"
                    className={classes.toggleLabel}
                  />
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
            <ListItem className={classes.listItem}>
              <Grid container>
                <Grid item xs={10}>
                  <h5 className={classes.blueHeading}>
                    A new user is added to the platform
                  </h5>
                </Grid>
                <Grid item xs={2} className={classes.checkbox}>
                  <BlueCheckbox
                    checked={user.userAdded}
                    onChange={(e) => {
                      updateUser({ userAdded: e.target.checked });
                    }}
                  />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem className={classes.listItem}>
              <Grid container>
                <Grid item xs={10}>
                  <h5 className={classes.blueHeading}>
                    A new transaction happens in any of My Wallets
                  </h5>
                </Grid>
                <Grid item xs={2} className={classes.checkbox}>
                  <BlueCheckbox
                    checked={user.newTransaction}
                    onChange={(e) => {
                      updateUser({ newTransaction: e.target.checked });
                    }}
                  />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem className={classes.listItem}>
              <Grid container>
                <Grid item xs={10}>
                  <h5 className={classes.blueHeading}>
                    A new transactions needs to be tagged
                  </h5>
                </Grid>
                <Grid item xs={2} className={classes.checkbox}>
                  <BlueCheckbox
                    checked={user.transactionTagged}
                    onChange={(e) => {
                      updateUser({ transactionTagged: e.target.checked });
                    }}
                  />
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Grid item xs={12}>
            <ContainedButton style={{ width: 208, marginLeft: 17 }}>
              Save Changes
            </ContainedButton>
          </Grid>
        </Grid>
      </Grid>
    </ExpansionList>
  );
}
