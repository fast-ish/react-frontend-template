import Link from 'next/link';
{%- if values.uiLibrary == "shadcn" %}
import { Button } from '@/components/ui/button';
{%- endif %}

export default function NotFound() {
  return (
    <div className="{%- if values.styling == 'tailwind' %}flex min-h-screen flex-col items-center justify-center p-24{%- endif %}">
      <div className="{%- if values.styling == 'tailwind' %}text-center space-y-6{%- endif %}">
        <h1 className="{%- if values.styling == 'tailwind' %}text-6xl font-bold{%- endif %}">404</h1>
        <h2 className="{%- if values.styling == 'tailwind' %}text-2xl font-semibold{%- endif %}">
          Page Not Found
        </h2>
        <p className="{%- if values.styling == 'tailwind' %}text-muted-foreground{%- endif %}">
          The page you are looking for does not exist.
        </p>
        {%- if values.uiLibrary == "shadcn" %}
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        {%- else %}
        <Link href="/">Go Home</Link>
        {%- endif %}
      </div>
    </div>
  );
}
