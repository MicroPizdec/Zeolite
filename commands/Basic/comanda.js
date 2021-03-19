module.exports = {
  name: "[команда]",
  group: "BASIC_GROUP",
  description: "команда",
  hidden: true,
  async run(client, msg, args){
    return msg.channel.createMessage("<:commandblock:798220658818416680>")
  }
}