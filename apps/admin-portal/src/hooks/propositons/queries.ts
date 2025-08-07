import { useQuery } from '@tanstack/react-query';
import { ENDPOINTS } from "../../constants/endpoint";
import { Proposition } from '../../types/proposition.type';
import { httpClient } from '../../api/http-client';

export const usePropositionsQuery = () => {
  return useQuery<Proposition[]>({
    queryKey: ['propositions'],
    queryFn: () =>
      httpClient.get(ENDPOINTS.PROPOSITIONS),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
}

export const usePropositionQuery = (id: string) => {
  return useQuery<Proposition>({
    queryKey: ['propositions', id],
    queryFn: () => httpClient.get(`${ENDPOINTS.PROPOSITIONS}/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  });
}
