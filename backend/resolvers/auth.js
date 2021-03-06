const User = require('../models/User');
const UserValidator = require('../helpers/validators/UserValidator');
const generateRandomPeer = require('../helpers/generateRandomPeer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const sgMail = require('../helpers/sgMail');
// const smtp = require('../helpers/smtp');

async function handleLogin(email, pass) {
  const validator = new UserValidator();

  const values = [
    {field: email, func: validator.validateEmail},
    // {field: pass, func: validator.validatePass}
  ]

  const responseObject = {
    _id: null,
    res: null,
    type: 'LOGIN'
  };

  let res;

  for (const val of values) {
    res = val.func(val.field);
    if (res.status !== 200) {
      return res;
    }
  }

  try {
    const found = await User.findByEmail(email);

    if (!found) {
      res.status = 500;
      res.message = 'There is no user with such mail';
    } else {
      const comparePasswordResult = await bcrypt.compare(pass, found.pass);
      if (!comparePasswordResult) {
        res.status = 500;
        res.message = 'Passwords doesn\'t match';
      } else {
        responseObject._id = found._id;
      }
    }
  } catch (e) {
    res.status = 500;
    res.message = 'Problems with saving'
  }

  responseObject.res = res;

  return responseObject;
}

async function handleReg(name, email, pass) {
  const validator = new UserValidator();

  const values = [
    {field: name, func: validator.validateName},
    {field: email, func: validator.validateEmail},
    // {field: pass, func: validator.validatePass}
  ];

  const responseObject = {
    res: null,
    type: 'REGISTRATION'
  };

  let res;

  for (const val of values) {
    res = val.func(val.field);
    if (res.status !== 200) {
      return res;
    }
  }

  try {

    const passHashed = await bcrypt.hash(
      pass,
      10 // Salt rounds
    );

    const user = {
      name, email,
      pass: passHashed,
      peerId: generateRandomPeer(),
      photo: ''
    };

    const found = await User.findByEmail(email);

    if (found) {
      res.status = 500;
      res.message = 'Email is used';
    } else {
      const userToSave = new User(user);
      await userToSave.save()
      console.log('user saved.');
    }
  } catch (err) {
    res.status = 500;
    res.message = 'Problems with saving'
  }

  responseObject.res = res;

  return responseObject;
}

async function handleForgotPass(email) {
  const validator = new UserValidator();

  const responseObject = {
    res: null,
    type: 'FORGOT_PASS'
  };

  let res = validator.validateEmail(email);
  if (res.status !== 200) {
    responseObject.res = res;
    return responseObject;
  }

  try {
    const found = await User.findByEmail(email);

    if (!found) {
      res.status = 500;
      res.message = 'There is no user with this email';
    } else {
      const buffer = await new Promise((resolve, reject) => {
        crypto.randomBytes(20, (err, buffer) => {
          if (err) {
            res.status = 500;
            res.message = 'Error occured.';
            reject();
          }
          resolve(buffer);
        });
      });

      const token = crypto
        .createHash("sha1")
        .update(buffer)
        .digest("hex");

      await User.findByIdAndUpdate(
        { _id: found._id },
        {
          resetPassToken: token,
          resetPassExpires: Date.now() + 86400000
        },
        { upsert: true, new: true }
      );

      const url = `${process.env.HOST}:${process.env.PORT}`;

      const mailData = {
        to: found.email,
        // Just testing - ya know
        from: 'test@mail.com',
        subject: 'Password help has arrived!',
        text: 'and easy to do anywhere, even with Node.js',
        html: `<a href="${url}/reset_password?token=${token}">Your link!</a>`,
        // to: 'test@example.com',
        // from: 'test@example.com',
        // subject: 'Sending with Twilio SendGrid is Fun',
        // text: 'and easy to do anywhere, even with Node.js',
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };

      await sgMail.send(mailData);
    }
  } catch (e) {
    console.log(e);
    res.status = 500;
    res.message = 'Error occured when checking user is in db';
  }

  responseObject.res = res;

  return responseObject;
}

async function handleChangePass(token, pass) {
  const validator = new UserValidator();

   const responseObject = {
    res: null,
    type: 'CHANGE_PASS'
  };

  let res = validator.validatePass(pass);

  if (res.status !== 200) {
    responseObject.res = res;
    return responseObject;
  }

  try {
    const found = await User.find({ resetPassToken: token });

    if (!found) {
      console.log(e);
      res.status = 500;
      res.message = 'Error occured when checking user is in db';
    } else {
      const passHashed = await bcrypt.hash(
        pass,
        10 // Salt rounds
      );
      await User.updateOne(
        { resetPassToken: token },
        { 
          pass: passHashed,
          resetPassToken: null,
          resetPassExpires: null
        }
      );
    }
  } catch (e) {
    console.log(e);
    res.status = 500;
    res.message = 'Error occured when checking user is in db';
  }

  responseObject.res =res;

  return responseObject;
}

module.exports.handleLogin = handleLogin;
module.exports.handleReg = handleReg;
module.exports.handleForgotPass = handleForgotPass;
module.exports.handleChangePass = handleChangePass;
