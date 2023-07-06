var nameUser;
var surname;
var nameAccount;
var passwordAccount;

var nameUserExistent;
var passwordExistent;

function createAccount(){
    if(document.getElementById("name").value !== "" && 
       document.getElementById("surname").value !== "" && 
       document.getElementById("nameAccount").value !== "" && 
       document.getElementById("passwordAccount").value !== ""){
        
        nameUser = document.getElementById("name").value;
        surname = document.getElementById("surname").value;
        nameAccount = document.getElementById("nameAccount").value;
        passwordAccount = document.getElementById("passwordAccount").value;

        salvaDatiSuDB();

        window.location.href = "FilmSearcher(filmico).html";
    }else{
        document.getElementById("fieldBlankCreate").innerText = "Alcuni campi NON sono stati compilati!";
    }
}

function findAccount(){
    if(document.getElementById("nameAccount").value !== "" && 
       document.getElementById("passwordExistent").value !== ""){
        
        nameUserExistent = document.getElementById("nameAccount").value;
        passwordExistent = document.getElementById("passwordExistent").value;

        cercaDatiSuDB();

        window.location.href = "FilmSearcher(filmico).html";
    }else{
        document.getElementById("fieldBlankExisting").innerText = "Alcuni campi NON sono stati compilati!";
    }
}

function salvaDatiSuDB(){
    alert("Dati salvati sul db");
}

function cercaDatiSuDB(){
    alert("Dati trovati sul db");
}