import {apiClient} from "@workspace/server/client";

import {useQuery} from "@tanstack/react-query";
import {useScope} from "@/contexts/scope";

function useListArticles() {
  const {scope} = useScope();

  return useQuery({
    queryKey: [scope, 'articles', 'list'],
    queryFn: async () => {
      return await apiClient.articles.list({project_id: scope})
    },
    refetchOnWindowFocus: true,
  });
}

export default useListArticles;