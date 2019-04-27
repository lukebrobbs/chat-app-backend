const resolvers = {
  Query: {
    messages: async (parent, args, { models }) => {
      const Messages = await models.Message.find({});
      console.log(Messages);
      return Messages;
    }
  },
  Mutation: {
    createMessage: async (parent, { title, desc, author }, { models }) => {
      const Message = await models.Message.findOne({ title });

      if (Message) {
        throw new Error("Please provide a unique title.");
      }

      // create a new Message
      const newMessage = new models.Message({
        title,
        desc,
        author
      });

      // save the message
      try {
        await newMessage.save();
      } catch (e) {
        throw new Error("Cannot Save Message!!!");
      }

      return true;
    }
  }
};

module.exports = resolvers;
