// components/ui/CopyButton.tsx

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type Props = {
  text: string
  className?: string
}

export function CopyButton({ text, className }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {copied ? '✅ Copiado' : '📋 Copiar'}
    </Button>
  )
}
