const { hashPassword } = require("../utils/password");

const resolvers = {
  Query: {
    messages: async (parent, args, { models }) => {
      const Messages = await models.Message.find({});
      return Messages;
    },
    users: async (parent, args, { models }) => {
      const Users = await models.User.find({});
      return Users;
    },
    chats: async (parent, args, { models }) => {
      const Chats = await models.Chat.find({}).populate({ path: "users" });
      return Chats;
    },
    myChats: async (parent, { user }, { models }) => {
      const Chats = await models.Chat.find({ users: user }).populate({
        path: "users"
      });
      return Chats;
    }
  },
  Mutation: {
    createMessage: async (parent, { chat, content, author }, { models }) => {
      // create a new Message
      const newMessage = new models.Message({
        chat,
        content,
        author
      });

      // save the message
      try {
        await newMessage.save();
      } catch (e) {
        throw new Error("Cannot Save Message!!!");
      }
      return newMessage;
    },
    createUser: async (parent, { email, password }, { models }) => {
      // Check email is unique
      const user = await models.User.findOne({ email });
      if (user) {
        throw new Error("email is already in use");
      }

      // Salt and hash password
      const hashedPass = await hashPassword(password);

      // create a new User
      const newUser = new models.User({
        email,
        password: hashedPass
      });
      // save the User
      try {
        await newUser.save();
      } catch (e) {
        throw new Error("Cannot Save User!!!");
      }
      return newUser;
    },
    createChat: async (parent, { name, users }, { models }) => {
      // create a new Chat
      const newChat = new models.Chat({
        name,
        users
      });

      // save the Chat
      try {
        await newChat.save();
      } catch (e) {
        throw new Error("Cannot Save Chat!!!");
      }
      return newChat;
    }
  }
};

module.exports = resolvers;
