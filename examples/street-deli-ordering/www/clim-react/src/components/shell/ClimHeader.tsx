export interface ClimHeaderProps { modeLabel?: string; }
export function ClimHeader({ modeLabel = 'MENU' }: ClimHeaderProps) {
  return <header className="header"><div className="brand">HUDSON STREET DELI</div><div className="mode">{modeLabel}</div></header>;
}
