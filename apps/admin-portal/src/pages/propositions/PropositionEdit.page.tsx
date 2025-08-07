import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePropositionQuery } from '../../hooks/propositons/queries';
import { useUpdatePropositionMutation } from '../../hooks/propositons/mutations';
import { PrimaryButton } from '@leasing/ui';

export const PropositionEditPage = () => {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { data, isLoading } = usePropositionQuery(id);
  const { mutateAsync, isPending } = useUpdatePropositionMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    document.title = 'Modifier la proposition';
  }, []);

  useEffect(() => {
    if (data) {
      setTitle(data.title ?? data.name ?? '');
      setDescription(data.description ?? '');
    }
  }, [data]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ id, payload: { title, description } });
    navigate(`/leasing/propositions/${id}`);
  };

  if (isLoading) return <div>Chargement…</div>;

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Modifier la proposition</h1>
      </header>

      <section>
        <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block mb-1">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded border px-3 py-2"
              rows={4}
            />
          </div>
          <div className="flex gap-3">
            <PrimaryButton type="submit" disabled={isPending}>
              {isPending ? 'Enregistrement…' : 'Enregistrer'}
            </PrimaryButton>
            <button type="button" onClick={() => navigate(-1)}>
              Annuler
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default PropositionEditPage;
