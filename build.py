import re, pathlib
root = pathlib.Path(__file__).parent
tpl = """<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="utf-8">
<script>if(location.pathname==="/management")location.replace("/management/"+location.search+location.hash)</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}｜破局十六週</title>{extra}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
<link rel="icon" href="favicon.svg">
<link rel="stylesheet" href="style.css">
</head>
<body data-page="{page}">
<div id="hdr"></div>
<main>
{body}
</main>
<div id="ftr"></div>
<div class="toast" id="toast"></div>
<script src="app.js"></script>
</body>
</html>
"""
for f in (root / "src").glob("*.html"):
    body = f.read_text(encoding="utf-8")
    title = re.search(r"<!--title:(.*?)-->", body).group(1)
    extra = '\n<meta name="robots" content="noindex,nofollow">' if "<!--noindex-->" in body else ""
    body = re.sub(r"<!--(title:.*?|noindex)-->\n?", "", body)
    (root / "site" / f.name).write_text(tpl.format(title=title, extra=extra, page=f.stem, body=body.strip()), encoding="utf-8")
    print("built", f.name)
