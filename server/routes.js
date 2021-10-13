const express = require("express");
const nodemailer = require("nodemailer");
const AES = require("crypto-js/aes");
const { userModel, productModel, orderModel, savedModel } = require("./models");
const app = express();

// SIGN IN
app.post("/login", async (request, response) => {
  const user = await userModel.findOne({ email: request.body.email });
  try {
    let userp = AES.decrypt(user.password, "login123").toString();
    let loginp = AES.decrypt(request.body.password, "login123").toString();
    if (userp === loginp) {
      response.send({
        login: true,
        token: "login123",
        userobj: {
          _id: user._id,
          name: user.name,
          email: user.email,
          activated: user.activated,
        },
      });
    } else {
      response.send({ login: false });
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

// SIGN UP
app.post("/add_user", async (request, response) => {
  const existinguser = await userModel.findOne({ email: request.body.email });
  try {
    if (!existinguser) {
      const user = new userModel(request.body);
      let transporter = nodemailer.createTransport({
        host: "127.0.0.1",
        port: 25,
        secure: false,
      });
      let message = {
        from: "sender@server.com",
        to: request.body.email,
        subject: "Welcome, " + request.body.name,
        text:
          "Welcome, " +
          request.body.name +
          ". Activate: http://localhost:3000/activated/" +
          user.activation_token,
        html:
          "<p>Welcome, " +
          request.body.name +
          "</p><p>Activate: <a href='http://localhost:3000/activated/" +
          user.activation_token +
          "'>http://localhost:3000/activated/" +
          user.activation_token +
          "</a></p>",
      };
      await user.save();
      await transporter.sendMail(message);
      await response.send({
        login: true,
        token: "login123",
        existinguser: false,
        userobj: {
          _id: user._id,
          name: user.name,
          email: user.email,
          activated: user.activated,
        },
      });
    } else {
      await response.send({ existinguser: true });
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/activate_user", async (request, response) => {
  const user = await userModel.findOneAndUpdate(request.body, {
    activated: 1,
    activation_token: "",
  });
  try {
    await response.send({ activated: true, email: user.email });
  } catch (error) {
    response.status(500).send(error);
  }
});

// USER PROFILE PAGE

app.post("/edit_user", async (request, response) => {
  let transporter, message;
  if (request.body.activated === 0) {
    transporter = nodemailer.createTransport({
      host: "127.0.0.1",
      port: 25,
      secure: false,
    });
    message = {
      from: "sender@server.com",
      to: request.body.email,
      subject: "Welcome, " + request.body.name,
      text:
        "Welcome, " +
        request.body.name +
        ". Activate: http://localhost:3000/activated/" +
        request.body._id,
      html:
        "<p>Welcome, " +
        request.body.name +
        "</p><p>Activate: <a href='http://localhost:3000/activated/" +
        request.body._id +
        "'>http://localhost:3000/activated/" +
        request.body._id +
        "</a></p>",
    };
  }
  const user = await userModel.findById(request.body._id);
  try {
    let oldp = AES.decrypt(request.body.oldPassword, "edit123").toString();
    let newp = AES.decrypt(request.body.newPassword, "edit123").toString();
    let userp = AES.decrypt(user.password, "login123").toString();
    if (oldp !== "" && userp !== oldp) {
      await response.send({ message: "Invalid Password", alert: "warning" });
    } else {
      user.name = request.body.name;
      user.email = request.body.email;
      user.activated = request.body.activated;
      if (userp === oldp) user.password = newp;
      user.save();
      if (request.body.activated === 0) await transporter.sendMail(message);
      await response.send({ message: "Profile Updated", alert: "ok" });
    }
  } catch (error) {
    response.send({ message: error, alert: "error" });
  }
});

// DUMMY EMAIL TEST

app.post("/send_email", async (request, response) => {
  let transporter = nodemailer.createTransport({
    host: "127.0.0.1",
    port: 25,
    secure: false,
  });
  let message = {
    from: "sender@server.com",
    to: request.body.email,
    subject: "Welcome, " + request.body.name,
    text: "Plaintext version of the message",
    html: "<p>HTML version of the message</p>",
  };
  let info = await transporter.sendMail(message);
  await response.send(info);
});

// SAVED APIs

app.post("/save_product", async (request, response) => {
  const saved = new savedModel(request.body);
  try {
    await saved.save();
    await response.send({ saved: true });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/saved/:user", async (request, response) => {
  try {
    const saved = await savedModel
      .find({ userid: request.params.user })
      .populate("product")
      .exec();
    await response.send(saved);
  } catch (error) {
    console.log(error);
  }
});

app.get("/saved/:user/:item", async (request, response) => {
  const saved = await savedModel.findOne({
    userid: request.params.user,
    product: request.params.item,
  });
  try {
    if (saved) response.send({ saved: true });
    else response.send({ saved: false });
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/delete_saved", async (request, response) => {
  try {
    await savedModel.deleteOne(request.body);
    await response.send({ deleted: true });
  } catch (error) {
    response.status(500).send(error);
  }
});

// CHECKOUT

app.post("/add_order", async (request, response) => {
  const order = new orderModel(request.body);
  try {
    await order.save();
    await response.send({ ordered: true, orderid: order._id });
  } catch (error) {
    response.status(500).send(error);
  }
});

// ORDERS APIs

app.get("/orders", async (request, response) => {
  const orders = await orderModel.find({});
  try {
    response.send(orders);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/order/:id", async (request, response) => {
  const order = await orderModel.findById(request.params.id, "products total");
  try {
    response.send(order);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/orders/:id", async (request, response) => {
  const orders = await orderModel.find({ user: request.params.id });
  try {
    response.send(orders);
  } catch (error) {
    response.status(500).send(error);
  }
});

// PRODUCT APIs

app.get("/product/:slug", async (request, response) => {
  const product = await productModel.find({ slug: request.params.slug });
  try {
    response.send(product[0]);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/searchproducts", async (request, response) => {
  const products = await productModel
    .find({ name: { $regex: request.query.q, $options: "i" } }, "name slug")
    .limit(5);
  try {
    response.send(products);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/products", async (request, response) => {
  const products = await productModel.find({});
  try {
    response.send(products);
  } catch (error) {
    response.status(500).send(error);
  }
});

// USER APIs

app.get("/user/:id", async (request, response) => {
  const user = await userModel.findById(request.params.id);
  try {
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/users", async (request, response) => {
  const users = await userModel.find({});
  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = app;
