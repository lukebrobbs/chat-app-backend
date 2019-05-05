const chai = require("chai");
const sinon = require("sinon");
const { Query, Mutation } = require("../graphql/resolvers");
const expect = chai.expect;

describe("Resolvers", () => {
  let models;
  before(() => {
    const populate = sinon.stub().returns({
      populate: sinon
        .stub()
        .returns({ populate: sinon.stub().returns("test - populate") })
    });
    models = {
      models: {
        Message: {
          find: sinon.stub().returns("Test"),
          save: sinon.spy()
        },
        User: {
          find: sinon.stub().returns("Test - user")
        },
        Chat: {
          find: sinon.stub().returns({ populate })
        }
      },
      request: {
        userId: "123"
      }
    };
  });
  describe("Queries", () => {
    describe("messages", () => {
      let messages;
      before(async () => {
        messages = await Query.messages({}, {}, models);
      });
      it("Should call models.Message.find", async () => {
        expect(models.models.Message.find.callCount).to.equal(1);
      });
      it("Should return the return value of the models.Message.find function", async () => {
        expect(messages).to.equal("Test");
      });
    });
    describe("users", () => {
      let users;
      before(async () => {
        users = await Query.users({}, {}, models);
      });
      it("Should call models.Message.find", async () => {
        expect(models.models.Message.find.callCount).to.equal(1);
      });
      it("Should return the return value of the models.Message.find function", async () => {
        expect(users).to.equal("Test - user");
      });
    });
    describe("chats", () => {
      let chats;
      before(async () => {
        chats = await Query.chats({}, {}, models);
      });
      it("Should call models.Message.find", async () => {
        expect(models.models.Message.find.callCount).to.equal(1);
      });
      it("Should return the return value of the models.Message.find.populate function", async () => {
        expect(chats).to.equal("test - populate");
      });
    });
    describe("myChats", () => {
      let myChats;
      before(async () => {
        myChats = await Query.myChats({}, {}, models);
      });
      it("Should call models.Message.find", async () => {
        expect(models.models.Message.find.callCount).to.equal(1);
      });
      it("Should return the return value of the models.Message.find.populate function", async () => {
        expect(myChats).to.equal("test - populate");
      });
    });
  });
  describe("Mutations", () => {});
});
