
export interface MaterialData {
  id: string;
  referenceMateriel: string; // Générée automatiquement
  designation: string;
  famille: string;
  marque: string;
  modele: string;
  numeroSerieChassis: string;
  anneeFabrication: number;
  dateMiseEnService: string;
  dureeUtilisationEstimee: string;
  origineMateriel: "Local" | "Importé";
  statut: "En stock" | "Loué" | "Restitué" | "Repris" | "Vendu";
  etatMateriel: "Neuf" | "Occasion";
  usage: "Professionnel" | "Privé";
  dateAcquisition: string;
  valeurInitialeHT: number;
  valeurInitialeTTC: number;
  valeurMarche: number;
  observations?: string;
  fournisseur: string;
  composants?: ComponentData[];
}

export interface ComponentData {
  id: string;
  numeroComposant: string; // Générée automatiquement
  designation: string;
  familleComposant: string;
  marque: string;
  modele: string;
  numeroSerieChassis?: string;
  referenceMaterielAssocie?: string;
  anneeFabrication: number;
  dateMiseEnService: string;
  dureeUtilisationEstimee: string;
  dureeUtilisationType: "heures" | "kilometrage";
  fournisseur: string;
  puissance?: string;
  dateAcquisition: string;
  valeurInitialeHT: number;
  valeurInitialeTTC: number;
  caracteristique1?: string;
  caracteristique2?: string;
  caracteristique3?: string;
  observations?: string;
  materielParentId: string;
}

export const FAMILLES_MATERIELS = [
  "Véhicules utilitaires",
  "Véhicules particuliers",
  "Matériels industriels",
  "Équipements bureautique",
  "Équipements médicaux",
  "Matériels agricoles",
  "Équipements de construction"
];

export const FAMILLES_COMPOSANTS = [
  "Moteur",
  "Transmission",
  "Électronique",
  "Accessoires",
  "Équipements de sécurité",
  "Systèmes hydrauliques",
  "Composants électriques"
];
