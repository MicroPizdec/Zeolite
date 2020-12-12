module.exports.load = client => {
  setInterval(async () => {
    const deposits = await deposit.findAll();
    for (const dep of deposits) {
      if (dep.balance > 250000) continue;
      await dep.update({ balance: Math.floor(dep.balance + dep.balance * 0.01) });
    }
  }, 7200000);
}
