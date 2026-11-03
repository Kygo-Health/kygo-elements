#!/usr/bin/env bash
# Kygo Health - check what each crawler gets inside a custom element's tag (seoMarkup test).
# Fetches the live page uncached with several user agents and reports, per agent, the words
# inside <TAG>...</TAG>, whether a probe phrase from deep in the tool is present, and TTFB.
#
# Usage: scripts/check-seo-markup.sh <url> <tag> "<probe phrase>"
# e.g.   scripts/check-seo-markup.sh https://www.kygo.app/tools/hrv-factors kygo-hrv-factors "Ashwagandha (Zenroot)"
set -u
url=$1; tag=$2; probe=$3
declare -A UA=(
  [browser]='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36'
  [Googlebot]='Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  [GPTBot]='Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)'
  [OAI-SearchBot]='Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)'
  [ClaudeBot]='Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)'
  [PerplexityBot]='Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)'
)
tmp=$(mktemp)
for name in browser Googlebot GPTBot OAI-SearchBot ClaudeBot PerplexityBot; do
  ttfb=$(curl -sS -A "${UA[$name]}" -H 'Cache-Control: no-cache' -o "$tmp" -w '%{time_starttransfer}' "$url?cb=$RANDOM$RANDOM")
  inner=$(python3 -I -c "
import re,sys
s=open(sys.argv[1],encoding='utf-8',errors='replace').read()
m=re.search(r'<'+sys.argv[2]+r'[^>]*>(.*?)</'+sys.argv[2]+'>',s,re.S)
t=re.sub(r'<[^>]+>',' ',m.group(1)) if m else ''
print(len(t.split()), 'yes' if sys.argv[3] in t else 'no', 'tag-found' if m else 'tag-missing')" "$tmp" "$tag" "$probe")
  printf '%-14s words-in-tag=%-6s probe=%-4s %-12s ttfb=%ss\n' "$name" $inner "$ttfb"
done
rm -f "$tmp"
