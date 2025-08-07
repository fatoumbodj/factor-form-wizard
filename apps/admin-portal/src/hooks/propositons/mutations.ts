import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ENDPOINTS } from '../../constants/endpoint';
import { CreatePropositionRequest } from '../../types/proposition.type';
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
      console.log("An error Occurred", error.message);
    }
  });
};