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
        db.collection("traffic").doc("users").get().then(function (doc) {
            total = doc.data().amount;
            console.log(total + "th visitor has... well... visited the website?");
        }).then(function () {
            console.log(total);
            for (var i = 0; i < Math.abs(CURRENT_AMOUNT - total); i++) {
                generateDrop();
            };
            CURRENT_AMOUNT = total;
        });
    } else if (index == 2){
        index = 0;
        return;
    }
});

function generateDrop() {
    ctx.strokeStyle = "#" + Math.floor(Math.random() * 0xFFFFFF).toString(16);
    ctx.beginPath();
    ctx.arc(Math.floor(Math.random() * (window.innerWidth) + 1), Math.floor(Math.random() * (window.innerHeight) + 1), Math.floor(Math.random() * (50) + 25), 0, 20 * Math.PI);
    ctx.stroke();
}

console.log(screen.width, screen.height, window.innerHeight, window.innerHeight)

traffic();
