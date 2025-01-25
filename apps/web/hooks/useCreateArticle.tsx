import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ArticlesCreateRequest, ArticlesCreateResponse} from "@workspace/server/types";
import {apiClient} from "@workspace/server/client";
import {useScope} from "@/contexts/scope";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

function useCreateArticle() {
  const queryClient = useQueryClient();
  const {scope} = useScope();
  const router = useRouter();

  return useMutation<ArticlesCreateResponse, Error, ArticlesCreateRequest>({
    mutationFn: async (payload) => {
      return await apiClient.articles.create({...payload, project_id: scope});
    },
    onSuccess: (result, payload, context) => {
      queryClient.invalidateQueries({queryKey: [scope, 'articles', 'list']});

      toast({
        title: "Saved",
        description: "Article has been created.",
        duration: 1000,
      });

      router.push(result.article.path)
    },

    onError: (error) => {
      toast({
        title: "Error",
        description: "There was an error creating the article.",
        duration: 1000,
      });
    }
  });
}

export default useCreateArticle;