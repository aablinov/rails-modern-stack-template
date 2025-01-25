import {Button} from "@workspace/ui/components/button";

interface Props {
  message: string
  title?: string
  emoji?: string
}

export function FullPageError({ message, title = 'Something went wrong', emoji = '💔' }: Props) {
  function handleReset() {
    window.location.href = '/'
  }

  return (
    <div className='flex w-full h-screen flex-1 flex-col items-center justify-center gap-6'>
      <div className='items-center justify-center flex relative h-24 w-20'>
        <span className='text-4xl'>{emoji}</span>
      </div>

      <div className='text-center'>
        <p className='font-semibold'>{title}</p>
        <p className='text-neutral-400'>{message}</p>
      </div>

      <div className='flex gap-2'>
        <Button variant='default' onClick={handleReset}>
          Back home
        </Button>
        <Button asChild>
          <a href='mailto:support@support.com'>Get help</a>
        </Button>
      </div>
    </div>
  )
}
