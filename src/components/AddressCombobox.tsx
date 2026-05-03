import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Loader2 } from "lucide-react";

export type ComboOption = { value: string; label: string };

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string, label: string) => void;
  options: ComboOption[];
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  id?: string;
  searchable?: boolean;
};

export function AddressCombobox({
  label,
  placeholder = "Select",
  value,
  onChange,
  options,
  disabled,
  loading,
  required,
  id,
  searchable = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = useMemo(() => options.find((o) => o.value === value), [options, value]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options.slice(0, 200);
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 200);
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (open && searchable) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open, searchable]);

  return (
    <div className="addr-combo" ref={wrapRef}>
      <button
        type="button"
        id={id}
        className="addr-combo-trigger"
        disabled={disabled || loading}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-required={required}
        onClick={() => !disabled && !loading && setOpen((o) => !o)}
      >
        <span className={selected ? "addr-combo-value" : "addr-combo-placeholder"}>
          {loading ? `Loading ${label.toLowerCase()}...` : selected ? selected.label : placeholder}
        </span>
        {loading ? (
          <Loader2 size={16} className="addr-combo-spinner" />
        ) : (
          <ChevronDown size={16} className={`addr-combo-chevron ${open ? "open" : ""}`} />
        )}
      </button>

      {open && (
        <div className="addr-combo-menu" role="listbox">
          {searchable && (
            <div className="addr-combo-search">
              <Search size={13} />
              <input
                ref={inputRef}
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}
          <div className="addr-combo-options">
            {filtered.length === 0 ? (
              <div className="addr-combo-empty">No matches</div>
            ) : (
              filtered.map((o) => (
                <button
                  type="button"
                  key={o.value}
                  className={`addr-combo-option ${o.value === value ? "selected" : ""}`}
                  onClick={() => {
                    onChange(o.value, o.label);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  {o.label}
                </button>
              ))
            )}
            {options.length > filtered.length && filtered.length === 200 && (
              <div className="addr-combo-empty">Type to refine more results...</div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .addr-combo { position: relative; width: 100%; }
        .addr-combo-trigger {
          width: 100%;
          background: #0D0D0D;
          border: 0.5px solid rgba(184, 149, 90, 0.22);
          border-radius: 8px;
          padding: 14px 16px;
          color: #F2EAE0;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          cursor: pointer;
          transition: border-color 200ms ease, box-shadow 200ms ease;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          text-align: left;
        }
        .addr-combo-trigger:hover:not(:disabled) { border-color: rgba(184, 149, 90, 0.45); }
        .addr-combo-trigger:focus-visible { border-color: #DC2627; outline: none; box-shadow: 0 0 0 3px rgba(220,38,39,0.1); }
        .addr-combo-trigger:disabled { opacity: 0.45; cursor: not-allowed; }
        .addr-combo-value { color: #F2EAE0; }
        .addr-combo-placeholder { color: rgba(154,136,128,0.7); }
        .addr-combo-chevron { color: #B8955A; transition: transform 180ms ease; flex-shrink: 0; }
        .addr-combo-chevron.open { transform: rotate(180deg); }
        .addr-combo-spinner { color: #B8955A; animation: addr-spin 900ms linear infinite; flex-shrink: 0; }
        @keyframes addr-spin { to { transform: rotate(360deg); } }

        .addr-combo-menu {
          position: absolute; top: calc(100% + 6px); left: 0; right: 0; z-index: 50;
          background: #160808;
          border: 0.5px solid rgba(184, 149, 90, 0.28);
          border-radius: 8px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .addr-combo-search {
          display: flex; align-items: center; gap: 8px;
          padding: 10px 12px;
          border-bottom: 0.5px solid rgba(184, 149, 90, 0.15);
          color: #B8955A;
        }
        .addr-combo-search input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #F2EAE0; font-family: 'Montserrat', sans-serif; font-size: 13px;
        }
        .addr-combo-search input::placeholder { color: rgba(154,136,128,0.6); }
        .addr-combo-options { max-height: 260px; overflow-y: auto; }
        .addr-combo-option {
          display: block; width: 100%; text-align: left;
          background: transparent; border: none;
          padding: 10px 14px;
          color: #F2EAE0;
          font-family: 'Montserrat', sans-serif; font-size: 13px;
          cursor: pointer;
          transition: background 120ms ease;
        }
        .addr-combo-option:hover, .addr-combo-option.selected {
          background: rgba(220, 38, 39, 0.12);
          color: #F2EAE0;
        }
        .addr-combo-empty {
          padding: 14px; text-align: center; font-size: 12px; font-style: italic;
          color: rgba(154,136,128,0.7);
        }

        @media (max-width: 768px) {
          .addr-combo-trigger { padding: 13px 14px; font-size: 13px; }
          .addr-combo-options { max-height: 50vh; }
        }
      `}</style>
    </div>
  );
}
