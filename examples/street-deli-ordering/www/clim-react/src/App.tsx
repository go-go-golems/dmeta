import { ClimShell } from './components/shell/ClimShell';
import { CartView } from './views/CartView';
import { DetailView } from './views/DetailView';
import { HelpView } from './views/HelpView';
import { MenuView } from './views/MenuView';
import { SubstitutionView } from './views/SubstitutionView';
import { TrackerView } from './views/TrackerView';

export function App() {
  return (
    <ClimShell modeLabel="MENU" mode="normal">
      <div className="view active">
          <CartView />
          <DetailView />
          <HelpView />
          <MenuView />
          <SubstitutionView />
          <TrackerView />
      </div>
    </ClimShell>
  );
}
