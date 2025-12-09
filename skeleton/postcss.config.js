{%- if values.styling == "tailwind" %}
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
{%- else %}
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
{%- endif %}
