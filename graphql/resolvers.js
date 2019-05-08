const jwt = require("jsonwebtoken");

const { hashPassword, comparePassword } = require("../utils/password");

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
      const Chats = await models.Chat.find({})
        .populate({ path: "users" })
        .populate({ path: "admin" })
        .populate({ path: "messages", populate: { path: "author" } });
      return Chats;
    },
    myChats: async (parent, {}, { models, request }) => {
      const Chats = await models.Chat.find({ users: request.userId })
        .populate({
          path: "users"
        })
        .populate({ path: "admin" })
        .populate({ path: "messages", populate: { path: "author" } });
      return Chats;
    },
    chat: async (parent, { id }, { models }) => {
      const Chat = await models.Chat.findById(id)
        .populate({
          path: "users"
        })
        .populate({ path: "admin" })
        .populate({ path: "messages", populate: { path: "author" } });
      return Chat;
    },
    me: async (parent, { id }, { models, request }) => {
      const User = await models.Users.find(request.userId);
      return User;
    }
  },
  Mutation: {
    createMessage: async (
      parent,
      { chat, content, author },
      { models, pubsub }
    ) => {
      // create a new Message
      const newMessage = new models.Message({
        chat,
        content,
        author
      });

      // save the message
      try {
        await newMessage.save();
        await models.Chat.updateOne(
          { _id: chat },
          { $push: { messages: newMessage._id } }
        );
        pubsub.publish(chat, { messageSent: newMessage });
      } catch (e) {
        throw new Error("Cannot Save Message!!!");
      }
      return newMessage;
    },
    createUser: async (
      parent,
      { email, password, firstName, lastName },
      { models, response }
    ) => {
      email = email.toLowerCase();
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
        password: hashedPass,
        firstName,
        lastName
      });
      // save the User
      try {
        await newUser.save();
        const token = jwt.sign({ userId: newUser._id }, process.env.APP_SECRET);
        response.cookie("token", token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
        });
      } catch (e) {
        throw new Error("Cannot Save User!!!");
      }
      return newUser;
    },
    createChat: async (parent, { name, users }, { models, request }) => {
      // create a new Chat
      const newChat = new models.Chat({
        name,
        users,
        admin: request.userId
      });

      // save the Chat
      try {
        await newChat.save();
      } catch (e) {
        throw new Error("Cannot Save Chat!!!");
      }
      return newChat;
    },
    signIn: async (parent, { password, email }, { models, response }) => {
      email = email.toLowerCase();
      const user = await models.User.findOne({ email });
      if (!user) {
        throw new Error("Invalid username or password");
      }
      const matched = comparePassword(password, user.password);
      if (!matched) {
        throw new Error("Invalid username or password");
      }
      const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
      response.cookie("token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
      });
      return user;
    }
  },
  Subscription: {
    messageSent: {
      subscribe: (parent, { chatId }, { pubsub }) => {
        return pubsub.asyncIterator([chatId]);
      }
    }
  }
};

module.exports = resolvers;
