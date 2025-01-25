"use client";

import {SidebarTrigger} from "@workspace/ui/components/sidebar";
import {Separator} from "@workspace/ui/components/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage,
  BreadcrumbSeparator
} from "@workspace/ui/components/breadcrumb";
import useGetArticle from "@/hooks/useGetArticle";
import {useParams} from "next/navigation";
import FullPageLoading from "@/components/FullPageLoading";
import {FullPageError} from "@/components/FullPageError";

function ArticlePage() {
  const params = useParams<{article: string}>()
  const {data, isLoading, isError, error} = useGetArticle(params.article)

  if (isLoading) {
    return <FullPageLoading />
  }

  if (isError) {
    return <FullPageError message={error.message} />
  }

  if (data.error) {
    return <FullPageError message={data.error} />
  }

  if (!data.article) {
    return <FullPageError message={"Error when loading article"} />
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Search</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <h1 className={'text-xl font-semibold'}>{data.article.title}</h1>

        <div className={'p-6 flex flex-col border rounded max-w-3xl'}>
          {data.article.body}
        </div>
      </div>
    </>
  )
}

export default ArticlePage;