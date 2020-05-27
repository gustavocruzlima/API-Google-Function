const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://industrylog-4a5ad.firebaseio.com"
});
const db = admin.firestore();

// create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
            await db.collection('products').doc('/' + req.body.id + '/').create({color: req.body.color, productId: req.body.productId});
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


// read item
app.get('/api/read/:color_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('products').doc(req.params.color_id);
            let item = await document.get();
            let response = item.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// read all
app.get('/api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('products');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                for (let doc of docs) {
                    const selectedItem = {
                        id: doc.id,
                        color: doc.data().color,
                        productId: doc.data().productId
                    };
                    response.push(selectedItem);
                }
                return response;
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

// update
app.put('/api/update/:color_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('products').doc(req.params.product_id);
        await document.update({
            color: req.body.color,
            productId: req.body.productId
        });
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});

/// delete
app.delete('/api/delete/:color_id', (req, res) => {
(async () => {
    try {
        const document = db.collection('products').doc(req.params.color_id);
        await document.delete();
        return res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    })();
});

exports.app = functions.https.onRequest(app);