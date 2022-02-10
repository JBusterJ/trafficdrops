var firebaseConfig = {
    apiKey: "AIzaSyCkNwqIZ62okiyAW6Wylv80cMHcN3sOs8M",
    authDomain: "trafficdrops-version1.firebaseapp.com",
    projectId: "trafficdrops-version1",
    storageBucket: "trafficdrops-version1.appspot.com",
    messagingSenderId: "173521121270",
    appId: "1:173521121270:web:8f67946a6648505ec7e1d7"
};

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = window.innerWidth * 0.99 + "px";
canvas.style.height = window.innerHeight * 0.98 + "px";

firebase.initializeApp(firebaseConfig);
firebaseConfig = window.btoa(firebaseConfig);

const db = firebase.firestore();

function traffic() {
    var traf = 0;

    db.collection("traffic").doc("users").get().then(function (doc) {
        traf = parseInt(doc.data().amount) + 1;
    }).then(function () {
        db.collection("traffic").doc("users").set({
            amount: traf
        })
    });
}

// db.collection("traffic")
//     .onSnapshot((doc) => {
//         if(doc.exists){
//             console.log("Data: ", doc.data(), doc);
//         } else {
//             console.log("Dummy document");
//         }
//     });

var index = 0;

var CURRENT_AMOUNT = 0;

// whenever new data is added to database, output its value to console
db.collection("traffic").onSnapshot(function (querySnapshot) {
    index++;
    if(index == 1){
        var total = 0;
        getPreviousDrops();
        db.collection("traffic").doc("users").get().then(function (doc) {
            total = doc.data().amount;
            console.log(total + "th visitor has... well... visited the website?");
        }).then(function () {
            console.log(total);
            for (var i = 0; i < Math.abs(CURRENT_AMOUNT - total); i++) {
                if (i == Math.abs(CURRENT_AMOUNT - total) - 1) {
                    generateDrop();
                }
            };
            CURRENT_AMOUNT = total;
        });
    } else{
        index = 0;
        return;
    }
});

function getPreviousDrops(){
    db.collection("drop_positions").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            console.log(doc.data());
            var position = [doc.data().x, doc.data().y];
            var colour = doc.data().colour;
            var radius = doc.data().radius;
            console.log(`The position of this drop is [${position[0]}, ${position[1]}], and this drop has a colour of ${colour}`);
            createDrop(position[0], position[1], colour, radius);
        });
    });
}

function createDrop(x, y, colour, radius){
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 20 * Math.PI);
    ctx.stroke();
}

function generateDrop() {
    var x = Math.floor(Math.random() * (window.innerWidth) + 1);
    var y = Math.floor(Math.random() * (window.innerHeight) + 1); 
    var colour = "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    var radius = Math.floor(Math.random() * (50) + 25);

    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 20 * Math.PI);
    ctx.stroke();

    db.collection("drop_positions").add({
        x: Math.floor(Math.random() * (canvas.width - 50) + 25),
        y: Math.floor(Math.random() * (canvas.height - 50) + 25),
        colour: colour,
        radius: radius
    }).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
}

console.log(screen.width, screen.height, window.innerHeight, window.innerHeight)

traffic();
