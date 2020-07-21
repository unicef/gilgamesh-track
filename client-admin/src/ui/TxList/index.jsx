import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PriceInfoBanner from "../PriceInfoBanner";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Pagination from "../pagination";

const transactionDetailsStyles = makeStyles((theme) => ({
  root: {
    marginTop: "5em",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.78,
    color: "#898989",
    textTransform: "uppercase",
    marginBottom: "1em",
  },
  allTransactionsButton: {
    float: "right",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1,
    fontFamily: '"Cabin", sans-serif',
    color: "#00aeef",
    "&:hover": {
      backgroundColor: "#ecfaff",
    },
    "& .MuiButton-endIcon": {
      margin: 0,
    },
  },
  transactionDetails: {
    marginTop: "2em",
  },
}));

export default function TxList({ title, txs, TxCard, page, limit }) {
  const classes = transactionDetailsStyles();

  const start = page * limit;
  const end = page * limit + limit - 1;
  const totalItems = txs.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.ceil(start / limit);
  console.log(start);
  console.log(end - 1);
  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={6}>
          <h3 className={classes.subtitle}> {title}</h3>
        </Grid>
        <Grid item xs={6}>
          <Button
            className={classes.allTransactionsButton}
            endIcon={<KeyboardArrowDownIcon />}
            onClick={() => {
              console.log("all transaction clicked");
            }}
          >
            All Transactions
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <Grid container className={classes.transactionDetails}>
        <Grid item xs={12}>
          <PriceInfoBanner />
        </Grid>
      </Grid>
      {txs && (
        <List>
          {txs.slice(start, end).map((tx, index) => {
            return (
              <ListItem key={index}>
                <TxCard
                  tx={tx}
                  txid={tx.txid}
                  timestamp={tx.timestamp}
                  address={null}
                  currency={tx.currency}
                  amount={tx.amount}
                  symbol={tx.symbol}
                  amountUSD={tx.amountUSD}
                  sent={tx.sent}
                  received={tx.received}
                  to={tx.to}
                  from={tx.from}
                />
              </ListItem>
            );
          })}
        </List>
      )}
      <Pagination
        start={start}
        end={end}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </Fragment>
  );
}
