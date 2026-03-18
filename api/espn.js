// api/espn.js — Vercel serverless proxy for ESPN Fantasy API
// Bypasses CORS by fetching ESPN from the server, not the browser

export default async function handler(req, res) {
    const { leagueId, espnS2, swid } = req.query;
  
    if (!leagueId || !espnS2 || !swid) {
      return res.status(400).json({ error: 'Missing leagueId, espnS2, or swid' });
    }
  
    const url = `https://fantasy.espn.com/apis/v3/games/flb/seasons/2026/segments/0/leagues/${leagueId}?view=mDraftDetail&view=mSettings&view=mTeam`;
  
    try {
      const response = await fetch(url, {
        headers: {
          'Cookie': `espn_s2=${espnS2}; SWID=${swid}`,
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Referer': 'https://fantasy.espn.com/',
          'x-fantasy-source': 'kona',
          'x-fantasy-platform': 'kona-PROD-b69a612a5a8634a14fe9a4e2ab1d44f5cb8c4a37',
        }
      });
  
      if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).json({ 
          error: `ESPN returned ${response.status}`,
          detail: text.slice(0, 200)
        });
      }
  
      const data = await response.json();
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(data);
  
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  