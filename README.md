# Email Deliverability Checker & ROI Calculator

A full-featured React app to check email infrastructure (SPF, DKIM, DMARC), calculate ROI, capture leads, and integrate with Klaviyo and Google Sheets. Built for Cloudflare Pages.

## Features
- **Email Infrastructure Checker**: Checks DKIM, SPF, DMARC for any domain using Google DNS API
- **ROI Calculator**: Calculates financial impact of poor deliverability
- **Lead Capture**: Captures emails for results and guides
- **Klaviyo Integration**: Adds leads to lists with full marketing consent
- **Google Sheets Integration**: Posts all results and leads for tracking
- **Responsive, Mobile-First, Full-Width Design**
- **Professional, Email-Focused UI**
- **VSL Section, Calendar Integration, and More**

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Development:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for Production:**
   ```bash
   npm run build
   ```
   Deploy the `dist/` folder to Cloudflare Pages.

## Cloudflare Pages Deployment
- Deploy the `dist/` directory as a static site.
- No server-side code required; all integrations are client-side.

## Integrations

### Klaviyo
- Public API Key: `Mzfpkb`
- ROI Tool Leads: List ID `TCapS8`
- Guide Requests: List ID `U42FCU`
- **Where to add credentials:**
  - The API key and list IDs are hardcoded in the integration code. If you need to change them, update them in the relevant sections of `App.jsx`.

### Google Sheets
- Uses Google Sheets API to post domain, results, email, and calculator data.
- **Where to add credentials:**
  - You must provide your own Google Sheets API endpoint and credentials. Update the endpoint in the integration code in `App.jsx`.

### Google DNS API
- Used for DNS lookups (SPF, DKIM, DMARC).
- No credentials required.

## Security & Privacy
- All email addresses are handled securely and only sent to Klaviyo and Google Sheets.
- All user input is validated client-side.
- No sensitive data is stored in the app.
- CORS is handled by using public APIs only.

## Customization
- Update client logos, testimonials, and video in `App.jsx` as needed.
- Update footer links in `App.jsx`.

## Notes
- All styling is inline (no CSS files).
- No placeholder content—app is fully functional.
- For production, ensure your Google Sheets endpoint is secure and CORS-enabled.

---

**Prompt for credentials:**
- When deploying, update the Google Sheets API endpoint and (if needed) Klaviyo keys in the code. 