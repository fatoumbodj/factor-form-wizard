import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '../../constants/endpoint';
import { CreatePropositionRequest, UpdatePropositionRequest } from '../../types/proposition.type';
import { httpClient } from '../../api/http-client';

export const useCreatePropositionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePropositionRequest) =>
      httpClient.post(ENDPOINTS.PROPOSITIONS, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propositions'] });
    },
    onError: (error: Error) => {
      console.log('An error Occurred', error.message);
    }
  });
};

export const useUpdatePropositionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePropositionRequest }) =>
      httpClient.patch(`${ENDPOINTS.PROPOSITIONS}/${id}`, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['propositions'] });
      queryClient.invalidateQueries({ queryKey: ['propositions', variables.id] });
    },
    onError: (error: Error) => {
      console.log('An error Occurred', error.message);
    }
  });
};
