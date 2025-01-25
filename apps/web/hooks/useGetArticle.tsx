import {apiClient} from "@workspace/server/client";

import {useQuery} from "@tanstack/react-query";
import {useScope} from "@/contexts/scope";

function useGetArticle(id: string) {
  const {scope} = useScope();

  return useQuery({
    queryKey: [scope, 'articles', 'info', id],
    queryFn: async () => {
      return await apiClient.articles.info({id: id, project_id: scope})
    },
    refetchOnWindowFocus: true,
  });
}

export default useGetArticle;