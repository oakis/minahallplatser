const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

admin.initializeApp(functions.config().firebase);

const mailer = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password
  }
});

exports.getUsersCount = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    admin.database().ref('/users').once('value').then(snapshot => {
      let registered = 0;
      let anonymous = 0;
      let unknown = 0;
      const users = [];
      snapshot.forEach(child => {
        users.push(child.val());
      });
      users.forEach((user) => {
        if (user.isAnonymous === false) {
          registered++;
        } else if (user.isAnonymous === true) {
          anonymous++;
        } else {
          unknown++;
        }
      });
      response.json({
        registered,
        anonymous,
        unknown,
        total: users.length
      });
    });
  });
});

exports.getDeparturesCount = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    admin.database().ref('/stats/departuresCount').once('value').then(snapshot => {
      response.json({ departuresCount: snapshot.val() });
    });
  });
});

exports.addDeparturesCount = functions.https.onRequest((request, response) => {
  admin.database().ref('/stats').once('value').then(snapshot => {
    const newValue = parseInt(snapshot.val().departuresCount) + parseInt(request.query.count);
    admin.database().ref('/stats').update({
        departuresCount: newValue
    });
    response.json({
        message: `departuresCount is now: ${newValue}`,
        departuresCount: newValue
    });
  });
});

exports.getStopsCount = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    admin.database().ref('/stats/stopsCount').once('value').then(snapshot => {
      response.json({ stopsCount: snapshot.val() });
    });
  });
});

exports.addStopsCount = functions.https.onRequest((request, response) => {
  admin.database().ref('/stats').once('value').then(snapshot => {
    const newValue = parseInt(snapshot.val().stopsCount) + 1;
    admin.database().ref('/stats').update({
      stopsCount: newValue
    });
    response.json({
        message: `stopsCount is now: ${newValue}`,
        stopsCount: newValue
    });
  });
});

exports.incrementStopsOpen = functions.https.onRequest((request, response) => {
  const ref = admin.database().ref('/users/' + request.query.user + '/favorites/');
  ref.orderByChild('id').equalTo(request.query.stopId).once('value', snapshot => {
    snapshot.forEach(data => {
      const opened = data.child('opened');
      if (opened.exists()) {
        const updated = data.val();
        updated.opened += 1;
        ref.child(data.key).update(updated);
      } else {
        const updated = data.val();
        updated.opened = 1;
        ref.child(data.key).update(updated);
      }
    });
    response.json({
      message: 'Updated'
    });
  });
});

exports.sendFeedback = functions.https.onRequest((request, response) => {
  const { name, email, message, device, os, appVersion } = request.query;
  const ref = admin.database().ref('/feedback');
  ref.push({ name, email, message, device, os, appVersion })
  .then(() => response.send())
  .catch(() => response.statusCode(500).send());
});

exports.alertNewFeedback = functions.database.ref('/feedback/{key}').onCreate(e => {
  const { name, appVersion, email, message, os } = e.data.val();
  const options = {
    from: functions.config().gmail.email,
    to: functions.config().gmail.email,
    subject: 'Ny feedback i Mina Hållplatser',
    html: `
      <h1>Ny feedback</h1>
      <p>Namn: ${name}</p>
      <p>Email: ${email}</p>
      <p>Meddelande: ${message}</p>
      <p>Appversion: ${appVersion}</p>
      <p>OSversion: ${os}</p>
    `
  };
  return mailer.sendMail(options).then((err, info) => {
    if (err) {
      console.log(err);
      return false;
    }
    console.log(info);
    return true;
 });
});

exports.replyFeedback = functions.database.ref('/feedback/{key}/reply').onCreate(e => {
  console.log('Data:', e.data.val());
  console.log(e.params.key);
  return admin.database().ref(`/feedback/${e.params.key}`).once('value').then((feedback) => {
    const { name, appVersion, email, message, os } = feedback.val();
    const options = {
      from: functions.config().gmail.email,
      to: email,
      subject: 'RE: Feedback i Mina Hållplatser',
      html: `
        <h1>Svar på feedback</h1>
        <p>${e.data.val().replace(/(?:\r\n|\r|\n)/g, '<br />')}</p>
        <br />
        <h1>Din feedback</h1>
        <p>${message}</p>
      `
    };
    return mailer.sendMail(options).then((err, info) => {
      if (err) {
        console.log(err);
        return false;
      }
      console.log(info);
      return true;
    });
  });
});

exports.accountCleanup = functions.https.onRequest((request, response) => {
  const ref = admin.database().ref('/users');
  const now = moment();
  const inactiveUsers = [];
  ref.once('value', snapshot => {
    snapshot.forEach(data => {
      const lastLogin = moment(data.child('lastLogin').val());
      const isOld = now.diff(lastLogin, 'days') > 90;
      const isAnonymous = data.child('isAnonymous').val();
      if ((!data.child('lastLogin').exists() || isOld) && isAnonymous) {
        inactiveUsers.push({ key: data.key, data: data.val() });
        ref.child(data.key).remove()
        .then(() => {
          admin.auth().deleteUser(data.key)
          .then(() => console.log('Deleted user:', data.key))
          .catch(e => console.log('Could not delete user:', e));
        })
        .catch(e => console.log('Remove user database entry failed:', e));
      }
    });
    console.log(`Deleted ${inactiveUsers.length} users.`);
    response.json({ users: inactiveUsers, message: `Deleted ${inactiveUsers.length} users.` });
  });
});
