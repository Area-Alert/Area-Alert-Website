var firebaseConfig = {
    apiKey: "AIzaSyDWzqpkE3i_suCfUhm1ubSF8mDFrpUXSKs",
    authDomain: "areaalert5.firebaseapp.com",
    databaseURL: "https://areaalert5.firebaseio.com",
    projectId: "areaalert5",
    storageBucket: "areaalert5.appspot.com",
    messagingSenderId: "962330034406",
    appId: "1:962330034406:web:1f3c3747c0a804360e7b27",
    measurementId: "G-8NS7MTRXJK"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.firestore();


var coords = [];
var names = [];
var report = [];
var pics = [];
docDatas = []
var count = 0;


database.collection("reports").get()
    .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {

            console.log(doc.data());

            names.push(doc.data().name.display);
            report.push(doc.data().report);
            coords.push({
                'lat': doc.data().lat,
                'long': doc.data().lon,
                'post': doc.data().postalCode,
                'img': doc.data().downloadurl,
                'med': doc.data().medicalAttention,
                'autho': doc.data().authorities
            })
            docDatas.push(doc.data())

        })
        for (var i = 0; i < names.length; i++) {
            display(names[i], report[i], coords[i]);
        }
    }).catch(function (error) {
        console.log(error);
    })

console.log(names, report, coords);



function display(name, report, coords) {


    $('.wrapper1').append(`<div class="container container${count}"></div>`);
    $(`.container${count}`).append(`<div class="map" id="map${count}" id="map"></div`);
    $(`.container${count}`).append(`<div class="textArea textArea${count}"></div`);
    $(`.textArea${count}`).append(`<h2>NAME: ${name}</h2>`);
    $(`.textArea${count}`).append(`<h2>PINCODE: ${coords.post}</h2>`);
    $(`.textArea${count}`).append(`<h2>REPORT: ${report}</h2>`);
    $(`.textArea${count}`).append(`<div class=' buttons buttons${count}'></div>`);
    $(`.textArea${count}`).append(`<div class = "finished finished${count}">Approved</div>`);
    $(`.finished${count}`).hide();
    $(`.buttons${count}`).append(`<button class="btn" onCLick="sendData(${count})">Approve <i class="fas fa-check"></i></button><button class="btn" onCLick="removeReport(${count})">Reject <i class="fas fa-times"></i></button>`)
    $(`.textArea${count}`).append(`<input type="text" placeholder="Feedback" style="height: 40px; text-align:center; width: 100%; border-radius: 5px;"></input>`)

    if (coords.med != false || coords.autho != false) {

        $(`.textArea${count}`).append(`<div class="extra-info extra${count}"></div>`)
        if (coords.med == true) {
            $(`.extra${count}`).append("<p>*Medical attention needed!</p><br>")
        }
        if (coords.autho == true) {
            $(`.extra${count}`).append("<p>*Authority help needed!</p><br>")
        }
    }

    initMap(coords.lat, coords.long, report, coords.img);

    count++;

}

function initMap(latitude, longitude, report, img) {

    map = new google.maps.Map(document.getElementById(`map${count}`), {
        center: { lat: latitude, lng: longitude },
        zoom: 14
    });

    //adding marker
    var marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map
    });

    //cirlce around the marker
    var cityCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: { lat: latitude, lng: longitude },
        radius: Math.sqrt(Math.floor(Math.random() * (25 - 5) + 5)) * 100
    });

    //adding info
    if (img != "" && img != null) {
        var infoWindow = new google.maps.InfoWindow({
            content: `<h3>${report}</h3><br><img src="${img}" width="100%" height="120">`
        });
    }
    else {
        var infoWindow = new google.maps.InfoWindow({
            content: `<h3>No image provided by the user</h3>`
        });
    }


    marker.addListener('click', function () {
        infoWindow.open(map, marker);
    });

}


function sendData(count) {


    //console.log(count)
    database.collection('verified_reports').add(docDatas[count]).then(function (docRef) {
        console.log("Document successfully written with id: ", docRef.id);
    })
        .catch(function (error) {
            console.error("Error writing document: ", error);
        });

    $(`.buttons${count}`).hide();
    $(`.finished${count}`).show();

}

function removeReport(count) {

    $(`.container${count}`).hide(500);
    setTimeout(function () { alert("REPORT DISMISSED"); }, 750);

}