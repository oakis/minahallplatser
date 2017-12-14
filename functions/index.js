const functions = require('firebase-functions');
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.getUsersCount = functions.https.onRequest((request, response) => {
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
      unknown
    });
  });
});

exports.getDeparturesCount = functions.https.onRequest((request, response) => {
  admin.database().ref('/stats/departuresCount').once('value').then(snapshot => {
    response.json({ departuresCount: snapshot.val() });
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
  admin.database().ref('/stats/stopsCount').once('value').then(snapshot => {
    response.json({ stopsCount: snapshot.val() });
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
  const ref = admin.database().ref('/users/' + request.query.user + '/favorites/')
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
