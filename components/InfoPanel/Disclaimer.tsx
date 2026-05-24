type DisclaimerProps = {
  children: React.ReactNode;
};

export function Disclaimer({ children }: DisclaimerProps) {
  return (
    <section className="rounded-md border border-destructive/25 bg-destructive/5 p-3 text-sm leading-6 text-muted-foreground">
      <p className="font-medium text-foreground">Disclaimer méthodologique</p>
      <p>{children}</p>
    </section>
  );
}
