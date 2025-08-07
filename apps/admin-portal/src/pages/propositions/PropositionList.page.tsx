import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePropositionsQuery } from '../../hooks/propositons/queries';
import { PrimaryButton } from '@leasing/ui';

export const PropositionListPage = () => {
  const { data, isLoading, isError } = usePropositionsQuery();

  useEffect(() => {
    document.title = 'Liste des propositions';
  }, []);

  if (isLoading) return <div>Chargement des propositions...</div>;
  if (isError) return <div>Une erreur est survenue.</div>;

  const items = useMemo(() => data ?? [], [data]);

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Liste des propositions</h1>
      </header>

      <div className="mb-4 flex justify-end">
        <Link to="/leasing/propositions/new">
          <PrimaryButton>Nouvelle proposition</PrimaryButton>
        </Link>
      </div>

      <section>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Titre</th>
                <th className="py-2 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-2 px-3">{p.id}</td>
                  <td className="py-2 px-3">{p.title ?? p.name ?? '-'}</td>
                  <td className="py-2 px-3 space-x-3">
                    <Link to={`/leasing/propositions/${p.id}`}>Détails</Link>
                    <Link to={`/leasing/propositions/${p.id}/edit`}>Modifier</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default PropositionListPage;
