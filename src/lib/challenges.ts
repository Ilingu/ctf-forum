export interface Challenge {
  id: number;
  title: string;
  category: string;
  difficulty: number;
  points: number;
  description: string;
  icon: string;
  hints?: string[];
  type?: "text" | "image-select";
}

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: "Bienvenue dans la matrice",
    category: "Introduction / Encoding",
    difficulty: 1,
    points: 100,
    icon: "💻",
    description: `> TRANSMISSION INTERCEPTÉE\n\nUn message a été intercepté sur le réseau interne.\nIl semble encodé dans un format courant en informatique...\n\nVoici le message :\n\n  RkxBR3tIMGxhX2IxM252M251ZV9kNG5zX2wzX0NURn0=\n\n💡 Indice : Ce format d'encodage utilise 64 caractères différents.\nSon nom est littéralement dans cette phrase.`,
  },
  {
    id: 2,
    title: "Inspecte les coulisses",
    category: "Web / Inspection",
    difficulty: 1,
    points: 150,
    icon: "🔍",
    description: `> FUITE DE DONNÉES\n\nUn développeur distrait a laissé traîner un secret quelque part dans cette page...\n\nLes navigateurs web ont des outils puissants qui permettent de voir "sous le capot" d'une page web : le code HTML, les styles CSS, et parfois... des commentaires oubliés.\n\n🔍 Indice : Fais un clic droit → "Inspecter" (ou "Code source") et cherche bien sur cette page de challenge. Les développeurs laissent parfois des commentaires dans le code avec <!-- comme ceci -->.`,
  },
  {
    id: 3,
    title: "L'IA ou le réel ?",
    category: "OSINT / IA / Médias",
    difficulty: 2,
    points: 200,
    icon: "🤖",
    type: "image-select",
    description: `> DÉSINFORMATION EN COURS\n\nEn 2026, les IA génératives peuvent créer des images quasi indiscernables du réel.\n\nVoici 6 images. Certaines sont de VRAIES photos, d'autres ont été entièrement GÉNÉRÉES PAR UNE IA.\n\nPour chaque image, indique si elle est RÉELLE (R) ou GÉNÉRÉE (G).\nCombine tes réponses dans l'ordre des images (1 à 6) pour former le flag.\n\nExemple : si tu penses que les images 1,3,5 sont réelles et 2,4,6 sont générées → FLAG{RGRGRGR}`,
  },
  {
    id: 4,
    title: "Craque le code",
    category: "Cryptographie classique",
    difficulty: 2,
    points: 250,
    icon: "🗝️",
    description: `> MESSAGE CHIFFRÉ INTERCEPTÉ\n\nNos analystes ont intercepté un message chiffré.\nIls pensent qu'il s'agit d'un chiffrement par substitution très ancien, utilisé par un célèbre empereur romain...\n\nVoici le message chiffré :\n\n  IODJ{o3_fkliiuh_gh_f3vdu_hvw_xq_fodvvltxh}\n\n🏛 Indice historique : Jules César utilisait cette méthode pour communiquer avec ses généraux. Il décalait chaque lettre d'un certain nombre de positions dans l'alphabet.\n\n🔢 Indice technique : Le décalage utilisé ici est le plus classique, celui que César lui-même préférait.\n(Cherche "chiffre de César" si besoin !)`,
  },
  {
    id: 5,
    title: "Escape the loop",
    category: "Logique / Programmation",
    difficulty: 3,
    points: 400,
    icon: "♾️",
    description: `> ALGORITHME MYSTÈRE\n\nUn programme a été exécuté mais son résultat a été perdu.\nPeux-tu retrouver la sortie sans exécuter le code ?\n\nVoici le pseudocode :\n\n┌─────────────────────────────────────────┐\n│                                         │\n│  mot = "CYBERSECURITE"                  │\n│  resultat = ""                          │\n│  cle = [3, 1, 4, 1, 5]                  │\n│                                         │\n│  pour i allant de 0 à longueur(mot)-1 : │\n│      index_cle = i modulo 5             │\n│      if cle[index_cle] est impair :     │\n│          resultat += mot[i]             │\n│      sinon :                            │\n│          resultat += "_"                │\n│                                         │\n│  afficher(resultat)                     │\n│                                         │\n└─────────────────────────────────────────┘\n\nLe flag est : FLAG{résultat du programme}\n\n💡 Indices :\n• "modulo" (%) donne le reste de la division entière.\n  Ex : 7 modulo 5 = 2\n• Les indices commencent à 0.\n• "impair" = nombre qui n'est pas divisible par 2.\n  1, 3, 5 sont impairs. 2, 4 sont pairs. 0 est pair.`,
  },
];
