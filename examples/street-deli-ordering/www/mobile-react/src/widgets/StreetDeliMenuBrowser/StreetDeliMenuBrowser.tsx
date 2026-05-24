/**
 * StreetDeliMenuBrowser
 *
 * Reflection-first scaffold promoted from `deli.menu_browser`.
 * The primary mobile ordering entrypoint: category tabs + menu card list.
 *
 * @see www/mobile/app.js → renderMenu, initCategoryTabs
 */

import type { MenuCategoryViewModel, DietaryTag } from '../../view-models/types';
import { MENU, MENU_CATEGORIES } from '../../data/menuData';
import { StreetDeliCompositionCard } from '../StreetDeliCompositionCard';
import styles from './StreetDeliMenuBrowser.module.css';

type StreetDeliMenuBrowserProps = {
  activeCategory: MenuCategoryViewModel['id'];
  activeDietary: Set<string>;
  onSelectCategory: (category: MenuCategoryViewModel['id']) => void;
  onSelectItem: (itemId: string) => void;
};

export function StreetDeliMenuBrowser({
  activeCategory,
  activeDietary,
  onSelectCategory,
  onSelectItem,
}: StreetDeliMenuBrowserProps) {
  const filtered = MENU.filter(item => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (activeDietary.size > 0) {
      const allTags = new Set(item.dietary);
      for (const ing of item.ingredients) {
        for (const t of ing.dietary) allTags.add(t);
      }
      let matches = false;
      for (const dt of activeDietary) {
        if (allTags.has(dt as DietaryTag)) matches = true;
      }
      if (!matches) return false;
    }
    return true;
  });

  return (
    <div className={styles.menuScreen}>
      <header className={styles.menuHeader}>
        <h1 className={styles.logo}>
          HUDSON<br />STREET<br /><span>DELI</span>
        </h1>
        <p className={styles.tagline}>Bagels · Sandwiches · Breakfast</p>
      </header>

      <nav className={styles.categoryTabs}>
        {MENU_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`${styles.catTab} ${activeCategory === cat.id ? styles.catTabActive : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <div className={styles.menuList}>
        {filtered.map(item => (
          <StreetDeliCompositionCard
            key={item.id}
            item={item}
            onCustomize={onSelectItem}
          />
        ))}
      </div>
    </div>
  );
}

export default StreetDeliMenuBrowser;
