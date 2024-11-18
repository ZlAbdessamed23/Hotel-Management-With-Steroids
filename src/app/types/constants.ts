export enum UserRole {
    receptionist = "receptionist",
    chef = "chef",
    cleaner = "nettoyeur",
    restaurentManager = "restaurent Manager",
    receptionManager = "reception Manager",
    stockManager = "stock Manager",
    coach = "entraineur",
};

export enum UserPermission {
    admin = "Admin",
    employee = "Employée",
};

export enum Departements {
    restau = "restauration",
    recep = "reception",
};

export enum UserGender {
    male = "homme",
    female = "femme",
};

export enum ClientOrigin {
    foreign = "etranger",
    local = "local"
};

export enum RoomState {
    reserved = "reservee",
    free = "disponible",
    outOfOrder = "en panne",
    outOfService = "hors service",
};

export enum ReservationState {
    enAttente = "en attente",
    valide = "valide",
    libere = "libere",
    annule = "annule",
    absent = "absent"
};

export enum DiscoveredWay {
    facebook = "facebook",
    instagram = "instagram",
    siteWeb = "site web",
    google = "google",
    reservationPlateform = "plateforme de reservation",
    television = "television",
    email = "email",
    autre = "autre"
};

export enum NonFixedRoomReasons {
    cleaning = "nettoyage",
    inspection = "inspection",
    repair = "maintenance",
    upgrade = "mise a niveau",
};

export enum EmployeeState {
    working = "en travaille",
    absent = "absent",
    vacation = "en vacance",
};

export enum ClientState {
    pending = "en attente",
    absent = "absent",
    coming = "venu"
};

export enum RoomType {
    single = "individuelle",
    double = "double",
    triple = "triple",
    familiale = "familiale",
    communiquante = "communiquante",
    suite = "suite",
};




export enum ReservationSource {
    alone = "seul",
    avt = "agence de voyage",
    event = "evenement"
};


export enum DaysOfWeek {
    sunday = "Dimanche",
    monday = "Lundi",
    thursday = "Mardi",
    wednesday = "Mercredi",
    tuesday = "Jeudi",
    friday = "Vendredi",
    saturday = "Samedi",
};

export enum SportHalls {
    football = "football",
    basketball = "basketball",
    handball = "handball",
    volleyball = "volleyball",
    tennis = "tennis",
    golf = "golf",
    musculation = "musculation",
    fitness = "fitness",
    gymnastic = "gymnastique",
};

export enum EventType {
    anniversaire = 'anniversaire',
    fetes = 'fetes',
    evenement = 'evenement',
    reunion = 'reunion',
    evenement_social = 'evenement_social',
    autre = "autre"
};

export enum EventGuestsType {
    normal = "normale",
    organiser = "organisateur",
};

export enum OperationMode {
    add = "add",
    update = "update",
};

export enum Restau_CafeteriaItemCategories {
    cafe = "caffee",
    milk = "lait",
    jus = "jus",
    plat = "plat",
    sandwich = "sandwich",
    fruit = "fruit",
    gateau = "gateau"
};


export enum StockTransactionType {
    purchase = "acheter",
    transport = "transferer",
};

export enum BudgetSections {
    restau = "restau",
    spa = "spa",
    material = "material",
};

export enum BankCardTypes {
    dahabia = "Dahabia",
    bankcard = "Carte Bancaire",
};

export enum Units {
    kilogram = "kilogramme",
    liter = "litre",
    piece = "piece",
    box = "boite",
    other = "autre",
};



//Transformed Enums

const transformRoomState = (state: string): string => {
    return state
        .replace("réservée", "reservee")
        .replace(/ /g, "_");
};
export const TransformedRoomState = Object.keys(RoomState).reduce((acc, key) => {
    const typedKey = key as keyof typeof RoomState;
    acc[typedKey] = transformRoomState(RoomState[typedKey]);
    return acc;
}, {} as Record<keyof typeof RoomState, string>);
