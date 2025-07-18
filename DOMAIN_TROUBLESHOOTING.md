# Custom Domain Troubleshooting Guide for baphomet.collinlucke.com

## Current Status
✅ DNS Resolution: WORKING - baphomet.collinlucke.com resolves to home-5018222688.app-ionos.space
✅ Ionos Subdomain: WORKING - home-5018222688.app-ionos.space loads correctly
❌ Custom Domain HTTPS: FAILING - SSL certificate issue
❌ Custom Domain HTTP: FAILING - Returns 404

## Solutions to Try (in order)

### 1. Check Ionos Deploy Now Dashboard
- Log into your Ionos Deploy Now dashboard
- Navigate to your baphomet-ui project
- Go to "Domains" or "Custom Domains" section
- Verify that `baphomet.collinlucke.com` is listed and shows as "Verified"
- Check if SSL certificate status shows as "Pending" or "Active"

### 2. Manual Domain Verification
If the domain isn't verified in the dashboard:
- In Ionos Deploy Now dashboard, add the custom domain `baphomet.collinlucke.com`
- They may provide a TXT record for domain verification
- Add this TXT record to your DNS settings
- Wait for verification (can take up to 24 hours)

### 3. SSL Certificate Generation
SSL certificates for custom domains can take time:
- Ionos Deploy Now uses Let's Encrypt for SSL certificates
- Certificate generation happens after domain verification
- This process can take 1-24 hours
- Check the dashboard for certificate status

### 4. Force Redeploy
Try triggering a new deployment:
```bash
# Make a small change and push to trigger redeploy
git commit --allow-empty -m "Force redeploy for custom domain"
git push
```

### 5. Check Domain Configuration in Ionos
Ensure these settings in your domain registrar:
- CNAME: baphomet.collinlucke.com → home-5018222688.app-ionos.space
- No conflicting A records for the subdomain
- TTL set to a reasonable value (300-3600 seconds)

### 6. Test Commands
Run these to monitor progress:

```bash
# Check DNS propagation
nslookup baphomet.collinlucke.com

# Test HTTPS (should work once SSL is ready)
curl -I https://baphomet.collinlucke.com

# Test HTTP (should redirect to HTTPS once working)
curl -I http://baphomet.collinlucke.com

# Check SSL certificate details
openssl s_client -connect baphomet.collinlucke.com:443 -servername baphomet.collinlucke.com
```

## Common Issues and Timeline

### SSL Certificate Generation
- **Normal**: 1-4 hours after domain verification
- **Delayed**: Up to 24 hours in some cases
- **Failed**: May need manual intervention in Ionos dashboard

### Domain Verification
- **Immediate**: If Ionos can automatically verify domain ownership
- **Manual**: May require TXT record verification (up to 24 hours)

### DNS Propagation
- **Local**: 5-30 minutes
- **Global**: Up to 48 hours (though usually much faster)

## Next Steps
1. Check Ionos Deploy Now dashboard first
2. If domain verification is pending, complete it
3. Wait for SSL certificate generation
4. Test periodically with the curl commands above

## Support
If issues persist after 24 hours:
- Contact Ionos Deploy Now support
- Provide them with your project ID: 3ed35c26-25a2-4e4d-80ee-4733a7cb8a7d
- Mention the custom domain: baphomet.collinlucke.com
