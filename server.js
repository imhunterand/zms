const express = require("express");
const app = express();
const { exec } = require("child_process");
const port = 3000;
var figlet = require("figlet");
var ip = require("ip");

app.use(express.json());
figlet("SMS Blast!!", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);
});
const wait = (seconds) =>
  new Promise((resolve) => setTimeout(() => resolve(true), seconds * 1000));

app.post("/sendSMS", async (req, res) => {
  const send = await exec(
    `termux-sms-send -n ${req.body.number} ${req.body.pesan}`
  );
  //console.log(req.body.pesan);
  console.log(green("Sending sms Sucess to : " + req.body.number));
  await wait(2);
  const list = exec("termux-sms-list -t sent", (error, stdout, stderr) => {
    //console.log(stdout);

    const result = JSON.parse(stdout);

    const get = result.pop();
  //  console.log(get)
    if ((get.body === req.body.pesan)||(get.number === req.body.pesan)) {
      res.json(result.pop());
    } else {
      res.send(false);
    }
  });
});

app.get("/listSMS", async (req, res) => {
  exec(`termux-sms-list`, (error, stdout, stderr) => {
    console.log(stdout);

    if (error) {
      res.send(stderr);
    } else {
      res.send(stdout);
    }
  });
});

function red(text) {
  return "\x1b[31m" + text + "\x1b[0m";
}

function green(text) {
  return "\x1b[32m" + text + "\x1b[0m";
}

function backgroundGreen(text) {
  return "\x1b[42m" + text + "\x1b[0m";
}

app.listen(port, () => {
  console.log(" Web Listening in [" + ip.address() + ":" + port + "]");
});
