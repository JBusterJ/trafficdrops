var firebaseConfig = {
    apiKey: "AIzaSyCkNwqIZ62okiyAW6Wylv80cMHcN3sOs8M",
    authDomain: "trafficdrops-version1.firebaseapp.com",
    projectId: "trafficdrops-version1",
    storageBucket: "trafficdrops-version1.appspot.com",
    messagingSenderId: "173521121270",
    appId: "1:173521121270:web:8f67946a6648505ec7e1d7"
};

// var canvas = document.getElementById("myCanvas");
// var ctx = canvas.getContext("2d");
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;
// canvas.style.width = window.innerWidth * 0.99 + "px";
// canvas.style.height = window.innerHeight * 0.98 + "px";

var onscreenObjects = [];
var selfEvent = false;

var canvas = document.getElementById("myCanvas");
canvas.style.width = window.innerWidth * 0.97 + "px";
canvas.style.height = window.innerHeight * 0.95 + "px";

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
    if (index == 1) {
        canvas.innerHTML = "";
        if(!selfEvent){
            getPreviousDrops();
        } else {
            selfEvent = false;
        }
    } else {
        index = 0;
        return;
    }
});

function getPreviousDrops() {
    db.collection("drop_positions").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            // console.log(doc.data());
            var position = [doc.data().x, doc.data().y];
            var colour = doc.data().colour;
            var radius = doc.data().radius;
            // console.log(`The position of this drop is [${position[0]}, ${position[1]}], and this drop has a colour of ${colour}`);
            // console.log(doc.id)
            createDrop(position[0], position[1], colour, radius, doc.id);
            // console.log("haha");
        });
    });
}

function createDrop(x, y, colour, radius, id) {
    createADrop(x, y, radius, colour, id);
}

function generateDrop() {
    selfEvent = true;
    var x = Math.floor(Math.random() * (window.innerWidth) + 1);
    var y = Math.floor(Math.random() * (window.innerHeight) + 1);
    var colour = "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    var radius = Math.floor(Math.random() * (50) + 25);


    db.collection("drop_positions").add({
        x: Math.floor(Math.random() * (canvas.style.width.split("px")[0] - 50) + 25),
        y: Math.floor(Math.random() * (canvas.style.height.split("px")[0] - 50) + 25),
        colour: colour,
        radius: radius
    }).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
}

function createADrop(x, y, radius, colour, id) {
    var drop = document.createElement("div");
    drop.style.cssText = `
        background-color: ${colour};
        width: ${radius}px;
        height: ${radius}px;
        border-radius: 50%;
        position: absolute;
        top: ${y}px;
        left: ${x}px;
    `;
    drop.style.animation = "fadeIn 0.5s ease-in-out forwards";

    setTimeout(() => {
        drop.style.animation = "fadeOut 0.5s ease-in-out forwards";
        db.collection("drop_positions").doc(id).delete().then(function () {
            console.log("BRO YOU'VE DONE IT (I THINK)")
        })
    }, 1750);

    canvas.appendChild(drop);

    // return drop
    // not returning the drop because it's not being used anywhere
}

// var drop = createADrop(Math.floor(Math.random() * (canvas.style.width.split("px")[0]) + 1),  Math.floor(Math.random() * (canvas.style.height.split("px")[0]) + 1), Math.floor(Math.random() * (50) + 25), "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16));

// console.log(screen.width, screen.height, window.innerHeight, window.innerHeight)

generateDrop();
getPreviousDrops();

traffic();