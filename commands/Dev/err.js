module.exports = {
    name: "err",
    description: "ERR_DESCRIPTION",
    hidden: true,
    ownerOnly: true,
    async run(client, msg, args) {
      throw new Error("testing");
    }
  };