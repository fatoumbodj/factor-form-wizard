import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreatePropositionMutation } from '../../hooks/propositons/mutations';
import { PrimaryButton } from '@leasing/ui';

export const PropositionCreatePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { mutateAsync, isPending } = useCreatePropositionMutation();

  useEffect(() => {
    document.title = 'Créer une proposition';
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ title, description });
    navigate('/leasing/propositions');
  };

  return (
    <main>
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Créer une proposition</h1>
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

export default PropositionCreatePage;
