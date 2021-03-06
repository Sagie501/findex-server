import { Router } from "express";
import { getUserByUsername } from "../models/users";
import {
  getAllMessages,
  getMessagesByUsername,
  messagesModel,
  totalMessagesAmount,
  filterMessages,
} from "../models/message";

export const router = Router();

router.post("/", async (req, res) => {
  let destUser = await getUserByUsername(req.body.destUser);
  let sourceUser = await getUserByUsername(req.body.sourceUser);

  let newMassage = new messagesModel({
    sourceUser: sourceUser,
    destUser: destUser,
    title: req.body.title,
    content: req.body.content,
  });

  await newMassage.save((err) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        message: `Create a new Message failed, Error: ${err}. req: ${req}`,
      });
    } else {
      res.json({
        success: true,
        message: `Message Added successfully.`,
        result: newMassage,
      });

      let index = (global as any).clients.findIndex(
        (client) => client.id == req.body.destUser
      );

      if (index !== -1) {
        (global as any).io.sockets.connected[
          (global as any).clients[index].socket
        ].emit("newMessage", {
          sourceUser: req.body.sourceUser,
          title: req.body.title,
        });
      }
    }
  });
});

router.get("/byUser/:username", (req, res) => {
  getUserByUsername(req.params.username).then(
    (user) => {
      getMessagesByUsername(user).then(
        (messages) => {
          res.write(
            JSON.stringify({ success: true, messages: messages }, null, 2)
          );
          res.end();
        },
        (err) => {
          console.error(err);
          res.sendStatus(500);
        }
      );
    },
    (err) => {
      console.error(err);
      res.sendStatus(500);
    }
  );
});

router.get("/filterMessages/:source/:dest/:title?/:content?", (req, res) => {
  getUserByUsername(new RegExp(".*" + req.params.source + ".*", "i")).then(
    (sourceUser) => {
      getUserByUsername(req.params.dest).then(
        (destUser) => {
          filterMessages(
            sourceUser,
            destUser,
            new RegExp(
              ".*" + req.params.title ? req.params.title : "" + ".*",
              "i"
            ),
            new RegExp(
              ".*" + req.params.content ? req.params.content : "" + ".*",
              "i"
            )
          ).then(
            (messages) => {
              res.write(
                JSON.stringify({ success: true, messages: messages }, null, 2)
              );
              res.end();
            },
            (err) => {
              res.json({
                success: false,
                message: `Failed to filter messages. Error: ${err}`,
              });
            }
          );
        },
        (err) => {
          res.json({
            success: false,
            message: `Failed to filter messages. Error: ${err}`,
          });
        }
      );
    },
    (err) => {
      res.json({
        success: false,
        message: `Failed to filter messages. Error: ${err}`,
      });
    }
  );
});

router.get("/amount/:username", (req, res) => {
  getUserByUsername(req.params.username).then(
    (user) => {
      totalMessagesAmount(user).then(
        (amount) => {
          res.json({ amount });
        },
        (err) => {
          console.error(err);
          res.json({ amount: 0 });
        }
      );
    },
    (err) => {
      console.error(err);
      res.json({ amount: 0 });
    }
  );
});

router.get("/all/all", (req, res) => {
  getAllMessages().then(
    (allMessages) => {
      res.json({ allMessages });
    },
    (err) => {
      if (err) {
        res.json({ err });
      }
    }
  );
});

router.delete("/:id", (req, res) => {
  messagesModel.deleteOne({ _id: req.params.id }, (err) => {
    if (err)
      res.json({
        success: false,
        message: `Failed to delete message. Error: ${err}`,
      });
    else {
      res.json({ success: true, message: `Message deleted successfuly` });
    }
  });
});
