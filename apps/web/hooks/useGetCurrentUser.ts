import {apiClient} from "@workspace/server/client";

import {useQuery} from "@tanstack/react-query";
import {User, UserIdentityResponse} from "@workspace/server/types";

export type AuthState =
  | { isLoading: true; error: undefined; user: undefined }
  | { isLoading: false; error: string; user: undefined }
  | { isLoading: false; error: undefined; user: User | null };

function useGetCurrentUser(): AuthState {
  const { data, isLoading, error } = useQuery<UserIdentityResponse>({
    queryKey: ['auth'],
    queryFn: async () => {
      return await apiClient.users.identity({})
    },
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return { isLoading: true, error: undefined, user: undefined };
  }

  if (error || !data) {
    return { isLoading: false, error: 'Something went wrong', user: undefined };
  }

  if (!data.user) {
    return { isLoading: false, error: 'User not found', user: undefined };
  }

  return { isLoading: false, error: undefined, user: data.user};
}

export default useGetCurrentUser;