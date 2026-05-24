import { ActionHintBar } from '../components/command/ActionHintBar';
import { ActionPresentationInline } from '../components/presentations/ActionPresentationInline';
import { CompositionPresentationBlock } from '../components/presentations/CompositionPresentationBlock';
import { InspectorPanelBlock } from '../components/presentations/InspectorPanelBlock';
import { LifecycleStatusBlock } from '../components/presentations/LifecycleStatusBlock';
import { PresentationRefLine } from '../components/presentations/PresentationRefLine';
import { placeOrderAction, removeIngredientAction } from '../fixtures/presentationFixtures';

export function DetailView() {
  return (
    <section className="story-card" aria-label="DETAIL view">
      <div className="cmd-bar"><span className="prompt">DETAIL&gt;</span><span className="cmd-text">LIST PRESENTATIONS</span></div>
      <div className="presentations">
        <PresentationRefLine />
        <CompositionPresentationBlock />
        <LifecycleStatusBlock />
        <InspectorPanelBlock />
      </div>
      <ActionHintBar />
      <div className="cmd-bar"><ActionPresentationInline action={removeIngredientAction} /> <ActionPresentationInline action={placeOrderAction} /></div>
    </section>
  );
}
