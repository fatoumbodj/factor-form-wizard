import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePropositionQuery } from '../../hooks/propositons/queries';

export const PropositionDetailPage = () => {
  const { id = '' } = useParams();
  const { data, isLoading, isError } = usePropositionQuery(id);

  useEffect(() => {
    document.title = `Détail proposition`;
  }, []);

  if (isLoading) return <div>Chargement…</div>;
  if (isError || !data) return <div>Introuvable.</div>;

  return (
    <main>
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Détail proposition</h1>
        <Link to={`/leasing/propositions/${id}/edit`}>Modifier</Link>
      </header>

      <section className="space-y-2">
        <div>
          <strong>ID:</strong> {data.id}
        </div>
        <div>
          <strong>Titre:</strong> {data.title ?? data.name ?? '-'}
        </div>
        {data.description && (
          <div>
            <strong>Description:</strong> {data.description}
          </div>
        )}
      </section>
    </main>
  );
};

export default PropositionDetailPage;
