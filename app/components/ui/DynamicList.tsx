/**
 * app/components/ui/DynamicList.tsx
 * Add/remove list of items up to a max count.
 * Add button uses rws-btn-secondary. Remove is a small text link in C.red.
 * The first item never shows a Remove link — at least one item always stays.
 *
 * Usage:
 *   <DynamicList
 *     items={loans}
 *     maxItems={10}
 *     onAdd={() => setLoans(prev => [...prev, emptyLoan()])}
 *     onRemove={i => setLoans(prev => prev.filter((_, idx) => idx !== i))}
 *     renderItem={(loan, i) => <LoanFields loan={loan} index={i} />}
 *     addLabel="Add another loan"
 *   />
 */

import { C } from "../../lib/brand";

type DynamicListProps<T> = {
  items: T[];
  maxItems: number;
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addLabel?: string;
};

export function DynamicList<T>({
  items,
  maxItems,
  onAdd,
  onRemove,
  renderItem,
  addLabel = "Add another",
}: DynamicListProps<T>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

      {/* Items */}
      {items.map((item, i) => (
        <div key={i}>
          {/* Remove link — hidden for the first item */}
          {i > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
              <button
                type="button"
                onClick={() => onRemove(i)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: C.red,
                  fontFamily: C.sans,
                  padding: 0,
                  minHeight: "unset",
                  textDecoration: "underline",
                }}
              >
                Remove
              </button>
            </div>
          )}

          {/* Item content */}
          {renderItem(item, i)}

          {/* Divider between items */}
          {i < items.length - 1 && (
            <hr className="rws-divider" style={{ marginTop: "1.25rem", marginBottom: 0 }} />
          )}
        </div>
      ))}

      {/* Add button — hidden when max is reached */}
      {items.length < maxItems && (
        <button
          type="button"
          onClick={onAdd}
          className="rws-btn-secondary"
          style={{ alignSelf: "flex-start" }}
        >
          + {addLabel}
        </button>
      )}

    </div>
  );
}