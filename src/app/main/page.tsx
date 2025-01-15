import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "HotyVerse",
};


const Card = ({ title, desc }: { title: string; desc: string }) => {
  return (
    <div className="flex gap-4 h-36 w-96 overflow-hidden px-2 p-4 font-sans">
      <span className="h-4/6 mt-2 w-1 dark:bg-purple-200   bg-purple-400 rounded-full"></span>
      <span className="flex flex-col">
        <h6 className="text-purple-700 text-xl font-medium max-w-80">{title}</h6>
        <p className="text-slate-500 text-opacity-80 text-lg font-normal text-wrap break-words max-w-80">
          {desc}
        </p>
      </span>
    </div>
  );
};

const platformCardsData = [
  {
    title: "Accessibility",
    desc: "Vous pouvez accéder au système de n'importe où",
  },
  {
    title: "Sécurité",
    desc: "CloudyVerse utilise des mesures de sécurité pour protéger votre données",
  },
  {
    title: "Maintenance",
    desc: "Les mises à jour du système sont effectuées automatiquement",
  },
];


const receptionistCardsData = [
  {
    title: "Clients",
    desc: "Ajouter, éditer, supprimer, afficher les clients et leurs réservations.",
  },
  {
    title: "Événements",
    desc: "Créer, modifier et gérer les événements",
  },
  {
    title: "Chambres",
    desc: "Gérer l'occupation et les états des chambres.",
  },
];

const receptionistManagerCardsData = [
  {
    title: "Clients",
    desc: "Ajouter, éditer, supprimer, afficher les clients et leurs réservations.",
  },
  {
    title: "Événements",
    desc: "Créer, modifier et gérer les événements",
  },
  {
    title: "Chambres",
    desc: "Gérer l'occupation et les états des chambres.",
  },
  {
    title: "Sport",
    desc: "Gérer les installations sportives.",
  },
  {
    title: "Stocks",
    desc: "Gérer les stocks des chambres, du restaurant, et autres ressources.",
  },
  {
    title: "Ménage",
    desc: "Suivre les tâches de ménage et l'état des chambres.",
  },
];

const chefCardsData = [
  {
    title: "Restaurant",
    desc: "Gérer le menu, les category et la article.",
  },
  {
    title: "Cafétéria",
    desc: "Créer le menu, gérer les articles, et superviser les paiements.",
  }
];


export default function Home() {
  return (
    <div>
      <section className='w-full h-80 p-6 rounded-xl text-white relative'>
        <div className='dashboared-hero-section w-full h-full p-6 rounded-xl'>
          <h1 className='text-3xl lg:text-4xl xl:text-5xl font-medium mb-4'>Bienvenu dans Hoty Verse</h1>
          <p className='text-lg md:text-xl font-medium pl-8 mb-12'>HotyVerse est une solution tout-en-un de gestion h&ocirc;teli&egrave;re con&ccedil;ue pour rationaliser les op&eacute;rations, am&eacute;liorer l&#39;efficacit&eacute; et enrichir l&#39;exp&eacute;rience des clients.</p>
        </div>
      </section>
      <section className='ml-6'>
        <ul className='flex flex-col gap-12'>
          <li>
            <div>
              <h1 className='text-4xl font-bold mb-6'>1. Plateforme Cloud de Hotyverse</h1>
              <p className='text-lg font-normal text-slate-500 text-opacity-90 w-10/12 ml-4'>CloudyVerse est un système de gestion hôtelière basé sur le cloud conçu pour simplifier et automatiser les opérations des hôtels de toutes tailles. En utilisant le cloud, le système offre de nombreux avantages, notamment :</p>
              <div className='flex items-center gap-6'>
                {
                  platformCardsData.map((data) => <Card key={data.title} title={data.title} desc={data.desc} />)
                }
              </div>
            </div>
          </li>
          <li>
            <div>
              <h1 className='text-4xl font-bold mb-6'>2. Gestion des Comptes Administrateurs et Employee</h1>
              <ul className='ml-6 flex flex-col gap-8'>
                <li>
                  <h2 className='text-xl font-semibold mb-4'>2.1 Connexion Admin</h2>
                  <p className='text-lg font-normal text-slate-500 text-opacity-90 w-10/12 ml-4'>L&apos;Administrateur a un accès complet à la plateforme. Il peut gérer les utilisateurs, configurer les paramètres de l&apos;hôtel, et consulter les rapports</p>
                </li>
                <li>
                  <h2 className='text-xl font-semibold mb-4'>2.2 Gestion des Employés</h2>
                  <p className='text-lg font-normal text-slate-500 text-opacity-90 w-10/12 ml-4'>Seul l &apos; Administrateur peut ajouter des employés à la plateforme. Après que l&apos;Administrateur ait ajouté un employé, celui-ci recevra un email contenant un lien pour activer son compte. L&apos;employé devra activer son compte avant de pouvoir se connecter.</p>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div>
              <h1 className='text-4xl font-bold mb-6'>3. Rôles des Employés et Accès aux Pages</h1>
              <ul className='ml-6 flex flex-col gap-8'>
                <li>
                  <h2 className='text-xl font-semibold mb-4'>Administrateur :</h2>
                  <p className='text-lg font-normal text-slate-500 text-opacity-90 w-10/12 ml-4'>Accès complet à toutes les pages de gestion, y compris la gestion des employés, des clients, des chambres, des stocks, des événements, des rapports, des sports, du restaurant, de la cafétéria, du ménage, et des paramètres généraux</p>
                </li>
                <li>
                  <h2 className='text-xl font-semibold mb-4'>Réceptionniste :</h2>
                  <p className='text-lg font-normal text-slate-500 text-opacity-90 w-10/12 ml-4'>Accès aux pages suivantes :</p>
                  <div className='flex items-center gap-6'>
                    {
                      receptionistCardsData.map((data) => <Card key={data.title} title={data.title} desc={data.desc} />)
                    }
                  </div>
                </li>
                <li>
                  <h2 className='text-xl font-semibold mb-4'>Responsable des Stocks :</h2>
                  <p className='text-lg font-normal text-slate-500 text-opacity-90 w-10/12 ml-4'>Accès à la gestion des stocks, y compris la gestion des articles, des catégories, des fournisseurs et des transactions de stock.</p>
                </li>
                <li>
                  <h2 className='text-xl font-semibold mb-4'>Chef et Responsable du Restaurant :</h2>
                  <p className='text-lg font-normal text-slate-500 text-opacity-90 w-10/12 ml-4'>Accès aux pages suivantes :</p>
                  <div className='flex items-center gap-6'>
                    {
                      chefCardsData.map((data) => <Card key={data.title} title={data.title} desc={data.desc} />)
                    }
                  </div>
                </li>
                <li>
                  <h2 className='text-xl font-semibold mb-4'>Coach :</h2>
                  <p className='text-lg font-normal text-slate-500 text-opacity-90 w-10/12 ml-4'>Accès à la gestion des installations sportives, y compris la planification des événements sportifs, la gestion des équipements et des clients associés.</p>
                </li>
                <li>
                  <h2 className='text-xl font-semibold mb-4'>Personnel de Ménage :</h2>
                  <p className='text-lg font-normal text-slate-500 text-opacity-90 w-10/12 ml-4'>Accès à la page Ménage, permettant de gérer l&apos;état des chambres et les tâches de nettoyage.</p>
                </li>
                <li>
                  <h2 className='text-xl font-semibold mb-4'>Réceptionniste Manager :</h2>
                  <p className='text-lg font-normal text-slate-500 text-opacity-90 w-10/12 ml-4'>Accès aux pages suivantes :</p>
                  <div className='flex flex-wrap items-center gap-6'>
                    {
                      receptionistManagerCardsData.map((data) => <Card key={data.title} title={data.title} desc={data.desc} />)
                    }
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </section>
    </div>
  )
}
