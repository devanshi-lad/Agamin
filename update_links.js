const fs = require('fs');

const files = ['index.html', 'market.html', 'ecosystem.html', 'portfolio.html', 'bitcoin.html', 'learn.html', 'nfts.html', 'exchanges.html'];

const linkMap = {
  'Home': '/index.html',
  'Cryptocurrencies': '/market.html',
  'Exchanges': '/exchanges.html',
  'NFTs': '/nfts.html',
  'Portfolio': '/portfolio.html',
  'Learn': '/learn.html',
  'Markets': '/market.html',
  'Portfolio Tracker': '/portfolio.html',
  'View all markets': '/market.html'
};

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  for (const [text, url] of Object.entries(linkMap)) {
    const regex = new RegExp(`href="#"([^>]*>${text}s?<\/a>)`, 'gi');
    content = content.replace(regex, `href="${url}"$1`);
  }
  
  // Special handling for the logo
  const logoRegex = /<span class="text-2xl font-bold tracking-tighter text-\[#556069\]">Agamin<\/span>/g;
  content = content.replace(logoRegex, `<a href="/index.html"><span class="text-2xl font-bold tracking-tighter text-[#556069]">Agamin</span></a>`);

  // Special handling for Bitcoin row / Ecosystem row
  // We'll add links to BTC text if it's there
  content = content.replace(/Bitcoin/g, `<a href="/bitcoin.html" class="hover:underline">Bitcoin</a>`);
  content = content.replace(/Ecosystem/g, `<a href="/ecosystem.html" class="hover:underline">Ecosystem</a>`);
  // Revert inside title
  content = content.replace(/<title>([^<]*)<a[^>]*>(Bitcoin|Ecosystem)<\/a>([^<]*)<\/title>/g, "<title>$1$2$3</title>");

  fs.writeFileSync(file, content, 'utf8');
});

console.log('Links updated');
