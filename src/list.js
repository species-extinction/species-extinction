export function printList(name, genus) {
    for (var i = 0; i < genus.length; i++) {
      var species = document.createElement("LI");
      species.innerHTML = name[i] + " - (" + genus[i] + ")";
      document.getElementById("species").appendChild(species);
    }
}
  
export function hideGraphs(data) {
    document.getElementById("graphs").style.display = "";
    if (data === 0) {
        document.getElementById("graphs").style.display = "none";
    }
}