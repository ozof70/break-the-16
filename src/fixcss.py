import pathlib
root = pathlib.Path(__file__).parent.parent
p = root / "site" / "style.css"
s = p.read_text(encoding="utf-8")
s = s.replace('.btn::after{content:"→";position:absolute;right:18px;opacity:0;transform:translateX(-8px);transition:.3s var(--ease)}\n.btn-lg:hover::after{opacity:1;transform:none}\n', "")
s = s.replace(".sec-head{display:grid;grid-template-columns:auto 1fr;gap:0 24px;align-items:start;margin-bottom:48px}", ".sec-head{margin-bottom:44px}")
s = s.replace(".sec-note{grid-column:2;margin-top:14px;", ".sec-note{margin-top:14px;")
s = s.replace('.stages div:not(:last-child)::after{content:"→";', '.stages div:not(:last-child)::after{content:none;')
s += (root / "src" / "extra.css").read_text(encoding="utf-8")
p.write_text(s, encoding="utf-8")
print("arrows left:", s.count("→"), s.count("↘"))
