export function SourcesList() {
  return (
    <section className="flex flex-col gap-2">
      <p className="text-sm font-semibold">Sources</p>
      <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
        <li>Maddison Project Database 2020</li>
        <li>datasets/geo-countries</li>
        <li>aourednik/historical-basemaps</li>
      </ul>
    </section>
  );
}
