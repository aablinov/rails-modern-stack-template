import * as React from "react"
import {Loader2} from "lucide-react";
import {cn} from "@workspace/ui/lib/utils";
import {useEffect, useState} from "react";

export default function FullPageLoading() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true)
    }, 500)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className={cn('flex w-full gap-2 h-screen items-center justify-center', {'opacity-0': !show})}>
      <Loader2 className={'animate-spin'}/> Loading...
    </div>
  )
}