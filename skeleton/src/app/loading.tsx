export default function Loading() {
  return (
    <div className="{%- if values.styling == 'tailwind' %}flex min-h-screen items-center justify-center{%- endif %}">
      <div className="{%- if values.styling == 'tailwind' %}animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary{%- endif %}" />
    </div>
  );
}
