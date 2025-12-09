{%- if values.uiLibrary == "shadcn" %}
import { Button } from '@/components/ui/button';
{%- endif %}

export default function HomePage() {
  return (
    <main className="{%- if values.styling == 'tailwind' %}flex min-h-screen flex-col items-center justify-center p-24{%- endif %}">
      <div className="{%- if values.styling == 'tailwind' %}text-center space-y-6{%- endif %}">
        <h1 className="{%- if values.styling == 'tailwind' %}text-4xl font-bold tracking-tight sm:text-6xl{%- endif %}">
          ${{values.name}}
        </h1>
        <p className="{%- if values.styling == 'tailwind' %}text-lg text-muted-foreground max-w-2xl{%- endif %}">
          ${{values.description}}
        </p>
        {%- if values.uiLibrary == "shadcn" %}
        <div className="flex gap-4 justify-center">
          <Button>Get Started</Button>
          <Button variant="outline">Learn More</Button>
        </div>
        {%- endif %}
      </div>
    </main>
  );
}
