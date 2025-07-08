# Current Issues

## LTI Integration Issue (Priority: High)

### Problem
Canvas LTI shows white screen when launched from iframe due to 308 redirect issue.

### Root Cause
- [ ] Canvas POSTs to `/api/lti` (no trailing slash)
- [ ] Next.js redirects with 308 to `/api/lti/` (with trailing slash) 
- [ ] POST body data is lost during redirect
- [ ] LTI endpoint receives empty request, creates invalid redirect

### Solution Steps
- [x] Update `config-react.xml` with trailing slash URLs
- [ ] Re-register Canvas LTI tool with new XML configuration
- [ ] Test LTI launch from Canvas iframe
- [ ] Verify user context extraction works correctly

### Testing Commands
```bash
# Test redirect behavior
curl -I -X POST https://canvas.ncsa.ai/api/lti

# Test correct endpoint
curl -X POST https://canvas.ncsa.ai/api/lti/ -d "test=data"

# Check server logs for LTI requests
tail -50 server.log | grep "LTI Launch received"
```

---

## S3 Link Authentication Issue (Priority: Medium)

### Problem
Clicking source links in chat responses returns AWS authorization error.

### Root Cause
- [ ] UIUC API returns HTML-encoded URLs with `&amp;` instead of `&`
- [ ] Malformed query parameters break AWS signature validation
- [ ] Local development uses fake credentials that don't generate valid S3 URLs

### Solution Steps
- [ ] Add HTML entity decoding in `parseMarkdownLinks()` function
- [ ] Test with real Canvas LTI user context
- [ ] Verify S3 URLs work when launched through Canvas (not locally)

### Code Location
`src/components/Message.tsx:30` - Direct href usage without HTML decoding