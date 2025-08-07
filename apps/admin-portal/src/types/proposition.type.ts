export type Proposition = {
    id: string;
    name?: string;
    title?: string;
    description?: string;
}

export type CreatePropositionRequest = {
  title: string;
  description: string;
};

export type UpdatePropositionRequest = Partial<CreatePropositionRequest>;
