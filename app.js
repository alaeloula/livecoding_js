/* =========================================================
   FRESHA · Configurateur de bowl
   Activité collective : chaque apprenant remplit UNE fonction.

   Règles pour tout le monde :
   - les noms et les prix viennent UNIQUEMENT de config ;
   - selectedConfig contient des OBJETS de config (ou null) ;
   - boucles for classiques et fonctions normales (pas de flèches) ;
   - textContent plutôt que innerHTML ;
   - ne modifiez QUE l'intérieur de votre fonction.

   Pour tester votre fonction : ouvrez la console (F12) et tapez
   verifier("nomDeVotreFonction")
   ========================================================= */


/* ===== DONNÉ : catalogue ===== */
const config = {
  base: {
    riz: { name: "Riz complet", price: 30 },
    quinoa: { name: "Quinoa", price: 35 }
  },
  proteine: {
    poulet: { name: "Poulet grillé", price: 15 },
    tofu: { name: "Tofu mariné", price: 12 },
    saumon: { name: "Saumon", price: 25 }
  },
  sauce: {
    soja: { name: "Sauce soja", price: 0 },
    sesame: { name: "Sauce sésame", price: 2 }
  },
  extras: {
    avocat: { name: "Avocat", price: 6 },
    oeuf: { name: "Œuf mollet", price: 4 }
  }
};

/* ===== DONNÉ : choix du client ===== */
let selectedConfig = {
  base: null,
  proteine: null,
  sauce: null,
  avocat: null,
  oeuf: null
};

/* ===== DONNÉ : familles obligatoires ===== */
const obligatoires = ["base", "proteine", "sauce"];


/* =========================================================
   FONCTION 1 · formatPrix
   Rôle      : transformer un nombre en texte de prix.
   Paramètre : prix (nombre)
   Retour    : une chaîne avec 2 décimales et " DH"
   Exemples  : formatPrix(30)  → "30.00 DH"
               formatPrix(0)   → "0.00 DH"
   ========================================================= */
function formatPrix(prix) {
  // À compléter
  return prix.toFixed(2) + " DH";
}


/* =========================================================
   FONCTION 2 · textePrix
   Rôle      : texte affiché sous chaque option.
   Paramètres: famille (chaîne), prix (nombre)
   Retour    : - pour la famille "base" : le prix formaté
               - sinon, si le prix vaut 0 : "Inclus"
               - sinon : "+ " suivi du prix formaté
   Exemples  : textePrix("base", 30)    → "30.00 DH"
               textePrix("sauce", 0)    → "Inclus"
               textePrix("extras", 6)   → "+ 6.00 DH"
   Utilise   : formatPrix
   ========================================================= */
function textePrix(famille, prix) {
  // À compléter
    if (famille === "base") {
    return formatPrix(prix);
  }
  if (prix === 0) {
    return "Inclus";
  }
  return "+ " + formatPrix(prix);
}


/* =========================================================
   FONCTION 3 · creerOption
   Rôle      : créer la carte HTML d'UNE option (sans l'ajouter à la page).
   Paramètres: famille (ex : "sauce"), cle (ex : "soja"),
               option (ex : { name: "Sauce soja", price: 0 })
   Retour    : un élément <label class="carte"> qui contient :
               - un <input> : type "checkbox" pour la famille "extras",
                 "radio" sinon ; name = famille ; value = cle
               - un <span> avec le nom de l'option
               - un <small> avec le texte du prix
   Utilise   : document.createElement, textePrix
   ========================================================= */
function creerOption(famille, cle, option) {
  // À compléter
  const label = document.createElement("label");
  label.className = "carte";

  const input = document.createElement("input");
  if (famille === "extras") {
    input.type = "checkbox";
  } else {
    input.type = "radio";
  }
  input.name = famille;
  input.value = cle;            // la CLÉ, pas le prix

  const nom = document.createElement("span");
  nom.textContent = option.name;

  const prix = document.createElement("small");
  prix.textContent = textePrix(famille, option.price);

  label.append(input, nom, prix);
  return label;
}


/* =========================================================
   FONCTION 4 · afficherOptions
   Rôle      : afficher toutes les options de config dans la page.
   Retour    : rien
   Détail    : pour chaque famille de config, récupérer la div
               "zone-" + famille, puis pour chaque option de la famille,
               y ajouter la carte créée par creerOption.
   Utilise   : Object.keys, deux boucles for, creerOption, appendChild
   ========================================================= */
function afficherOptions() {
  for (const famille in config) {
    const zone = document.getElementById("zone" + famille);
      console.log("famille",famille);
      
    for (const cle in config[famille]) {
      zone.appendChild(creerOption(famille, cle, config[famille][cle]));
    }
  }
}

/* =========================================================
   FONCTION 5 · choisirOption
   Rôle      : mettre à jour selectedConfig quand un input change.
   Paramètre : event (l'événement "change")
   Retour    : rien
   Détail    : - l'input est event.target ; ignorer si ce n'est pas un INPUT
               - famille = input.name, cle = input.value
               - famille "extras" : si coché, selectedConfig[cle] reçoit
                 config.extras[cle], sinon null
               - autres familles : selectedConfig[famille] reçoit
                 config[famille][cle]
               - puis appeler calculerTotal()
   Exemple   : clic sur Saumon → selectedConfig.proteine vaut
               { name: "Saumon", price: 25 }
   ========================================================= */
function choisirOption(event) {
  // À compléter
   const input = event.target;
  if (input.tagName !== "INPUT") {
    return;
  }

  const famille = input.name;
  const cle = input.value;
  
console.log(famille,cle);

  if (famille === "extras") {
    if (input.checked) {
      selectedConfig[cle] = config.extras[cle];
      console.log("selectedConfig[cle]",selectedConfig[cle]);
      
    } else {
      selectedConfig[cle] = null;
    }
  } else {
    selectedConfig[famille] = config[famille][cle];  // un OBJET, pas un prix
    
    console.log("selectedConfig[famille]",selectedConfig[famille]);
    console.log("config[famille][cle]",config[famille][cle]);
  }
console.log(selectedConfig);

  calculerTotal();
}


/* =========================================================
   FONCTION 6 · calculerTotal
   Rôle      : calculer et afficher le total.
   Retour    : le total (NOMBRE)
   Détail    : repartir de 0, parcourir Object.values(selectedConfig),
               additionner le .price de chaque option non null,
               puis afficher le total formaté dans #total
               (APRÈS la boucle).
   Exemple   : riz + poulet + soja + avocat → retourne 51,
               affiche "51.00 DH"
   ========================================================= */
function calculerTotal() {
  // À compléter
   let total = 0;
  const options = Object.values(selectedConfig);

  for (let i = 0; i < options.length; i++) {
    if (options[i] !== null) {
      total += options[i].price;     // .price : on additionne des nombres
    }
  }

  // Affichage APRÈS la boucle : mis à jour même quand total vaut 0
  document.getElementById("total").textContent = formatPrix(total);
  return total;
}


/* =========================================================
   FONCTION 7 · choixManquants
   Rôle      : lister les familles obligatoires non choisies.
   Retour    : un tableau de chaînes (vide si tout est choisi)
   Exemples  : rien choisi           → ["base", "proteine", "sauce"]
               seulement le riz      → ["proteine", "sauce"]
               base + protéine + sauce → []
   Utilise   : obligatoires, selectedConfig, push
   ========================================================= */
function choixManquants() {
  // À compléter
}


/* =========================================================
   FONCTION 8 · remplirRecu
   Rôle      : construire les lignes du reçu.
   Retour    : rien
   Détail    : - vider #lignes-recu (replaceChildren)
               - pour chaque option non null de selectedConfig,
                 créer un <p> "Nom : 30.00 DH" et l'ajouter
               - afficher le total formaté dans #recu-total
   Utilise   : formatPrix, calculerTotal
   ========================================================= */
function remplirRecu() {
  // À compléter
}


/* =========================================================
   FONCTION 9 · afficherRecu
   Rôle      : vérifier les choix puis passer au reçu.
   Retour    : rien
   Détail    : - s'il manque des choix : écrire dans #message
                 "Il manque : base, sauce." et arrêter la fonction
               - sinon : vider #message, remplir le reçu,
                 masquer #configurateur et afficher #recu (hidden)
   Utilise   : choixManquants, join, remplirRecu
   ========================================================= */
function afficherRecu() {
  // À compléter
}


/* =========================================================
   FONCTION 10 · modifier
   Rôle      : revenir au configurateur SANS recharger la page.
   Détail    : masquer #recu, afficher #configurateur.
   ---------------------------------------------------------
   FONCTION 11 · nouveauBowl
   Rôle      : tout remettre à zéro.
   Détail    : - remettre chaque propriété de selectedConfig à null
               - décocher tous les inputs de #configurateur
               - recalculer le total, puis revenir au configurateur
   Utilise   : Object.keys, calculerTotal, modifier
   ========================================================= */
function modifier() {
  // À compléter
}

function nouveauBowl() {
  // À compléter
}


/* ===== DONNÉ : démarrage (ne pas modifier) ===== */
afficherOptions();

document.getElementById("configurateur").addEventListener("change", choisirOption);
document.getElementById("btn-valider").addEventListener("click", afficherRecu);
document.getElementById("btn-modifier").addEventListener("click", modifier);
document.getElementById("btn-nouveau").addEventListener("click", nouveauBowl);

calculerTotal();
