/**
 * StreetDeliOrderTracker
 *
 * Reflection-first scaffold promoted from `deli.order_tracker`.
 * Post-order status tracking surface.
 *
 * Semantic context:
 * - Archetype: WorkItem + TimelineSpan
 * - Capability: stateful, temporal, relatable
 *
 * @see www/mobile/app.js → placeOrder, tracker screen
 */

import type { TrackerStep } from '../../view-models/types';
import styles from './StreetDeliOrderTracker.module.css';

type StreetDeliOrderTrackerProps = {
  orderNumber: number;
  currentStep: TrackerStep;
  onBack: () => void;
};

const STEPS: TrackerStep[] = ['received', 'preparing', 'ready', 'picked_up'];
const STEP_LABELS: Record<TrackerStep, string> = {
  received: 'Received',
  preparing: 'Preparing',
  ready: 'Ready',
  picked_up: 'Picked Up',
};

export function StreetDeliOrderTracker({ orderNumber, currentStep, onBack }: StreetDeliOrderTrackerProps) {
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <div>
      <header className={styles.screenHeader}>
        <h2 className={styles.screenTitle}>Order #{orderNumber}</h2>
      </header>

      <div className={styles.trackerContent}>
        <div className={styles.trackerStatus}>
          <div className={styles.trackerLine} />
          {STEPS.map((step, i) => {
            const isCompleted = i <= currentIndex;
            const isActive = i === currentIndex;
            return (
              <div key={step} className={`${styles.trackerStep} ${isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''}`}>
                <div className={styles.stepDot}>
                  {isCompleted && <span className={styles.stepCheck}>✓</span>}
                </div>
                <span className={styles.stepLabel}>{STEP_LABELS[step]}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.trackerDetail}>
          <p>We're making your order now. We'll call your number when it's ready.</p>
        </div>

        <button className={styles.backToMenuBtn} onClick={onBack}>
          Back to Menu
        </button>
      </div>
    </div>
  );
}

export default StreetDeliOrderTracker;
