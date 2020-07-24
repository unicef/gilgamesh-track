const router = require("express").Router();
const Logger = require("../logger");
const logger = new Logger("Private Routes");

router.get("/ping", (req, res) => {
  res.send("pong");
});

router.get("/activities", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  let activities = [];
  try {
    activities = await juniperAdmin.db.getActivities();
  } catch (e) {
    return this.logger.error(e);
  }

  res.json(activities);
});

router.get("/transactions/address/:address", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  const { address } = req.params;
  let transactions = [];

  try {
    transactions = await juniperAdmin.db.getTransactionsForAddress(address);
  } catch (e) {
    return logger.error(e);
  }
  res.json(transactions);
});

router.get("/wallets", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  let wallets = [];

  try {
    wallets = await juniperAdmin.db.getUnicefWallets();
  } catch (e) {
    return logger.error(e);
  }
  res.json(wallets);
});

router.get("/wallets/tracked", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  let wallets = [];

  try {
    wallets = await juniperAdmin.db.getTrackedWallets();
  } catch (e) {
    return logger.error(e);
  }
  res.json(wallets);
});
router.get("/wallets/summary", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  let summary = {};

  try {
    summary = await juniperAdmin.getWalletSummary();
  } catch (e) {
    return logger.error(e);
  }
  res.json(summary);
});

router.get("/transactions", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  let txs = [];

  try {
    txs = await juniperAdmin.db.getTransactions();
  } catch (e) {
    return logger.error(e);
  }

  res.json(txs);
});
router.get("/transactions/unpublished", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  let txs = [];

  try {
    txs = await juniperAdmin.db.getUnpublishedTransactions();
  } catch (e) {
    return logger.error(e);
  }

  res.json(txs);
});

router.post("/transaction/archive", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  let { txid } = req.body;
  const user = "Alex Sherbuck"; // Todo, get from session

  try {
    await juniperAdmin.db.archiveTx(txid);
    await juniperAdmin.logActivity({
      name: user,
      text: `<a href="#" class="link">${user}</a> archived a transaction.`,
    });
  } catch (e) {
    return logger.error(e);
  }

  res.send(true);
});

router.get("/wallet/:address", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  const { address } = req.params;
  let wallet = {};

  try {
    wallet = await juniperAdmin.db.getWallet(address);
  } catch (e) {
    return logger.error(e);
  }

  res.json(wallet);
});

router.get("/wallet/untrack/:address", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  const { address } = req.params;

  try {
    await juniperAdmin.db.untrackWallet(address);
  } catch (e) {
    return logger.error(e);
  }

  res.send();
});

router.post("/wallet", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  const { wallet } = req.body;
  const { isUnicef } = wallet;
  const user = "Alex Sherbuck"; // Todo, get from session

  logger.info(`/wallet ${JSON.stringify(wallet)}`);
  try {
    // TODO cleanup validation
    if (!wallet.address) {
      throw new Error(
        "Failed to create wallet. Wallet does not contain an address"
      );
    }

    await juniperAdmin.createWallet(wallet);

    if (wallet.isUnicef) {
      await juniperAdmin.logActivity({
        name: user,
        text: `<a href="#" class="link">${user}</a> added a new wallet.`,
      });
    } else if (wallet.isTracked) {
      await juniperAdmin.logActivity({
        name: user,
        text: `<a href="#" class="link">${user}</a> tracked a wallet.`,
      });
    }

    switch (wallet.symbol) {
      case "BTC":
        await juniperAdmin.bitcoinWalletScraper.scrapeTransactionData(
          wallet.address,
          isUnicef,
          wallet.multisigOwners
        );
        break;
      case "ETH":
        await juniperAdmin.ethereumWalletScraper.scrapeTransactionData(
          wallet.address,
          isUnicef,
          wallet.multisigOwners
        );

        break;
      default:
        throw new Error(
          "Failed to create wallet. Wallet does not contain a valid symbol"
        );
    }
  } catch (e) {
    logger.error(e);
    return res.status(404).send({
      msg: "Failed to create wallet",
    });
  }

  res.send(wallet);
});

router.post("/account", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  const { account } = req.body;
  console.log(req.body);
  res.send(true);
});

router.get("/prices", async (req, res) => {
  const juniperAdmin = req.app.get("juniperAdmin");
  const { params } = req.body;
  let prices = [];

  try {
    prices = await juniperAdmin.db.getPrices(
      params.symbol,
      params.timeStart,
      params.timeEnd
    );
  } catch (e) {
    return logger.error(e);
  }
  res.json(prices);
});

module.exports = router;
