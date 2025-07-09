# Illinois Chat - Canvas LTI Integration

## Project Context
AI chat assistant integrated with Canvas LMS for University of Illinois courses.

**Current Status**: ✅ **COMPLETED** - Canvas LTI integration working properly

**Recent Fix**: Replaced NextResponse.redirect() with iframe-compatible direct HTML response
**Result**: Canvas LTI launches now work successfully from iframe context

## Tech Stack
- Next.js 15.3.3 + React 19 + TypeScript
- Tailwind CSS (Illinois colors: #13294B navy, #FF5F05 orange)
- Server-Sent Events for streaming
- Production: https://canvas.ncsa.ai (port 3001)

## Key Files
- `src/app/api/lti/route.ts` - Canvas LTI launch handler (now serves HTML directly)
- `src/app/api/chat/route.ts` - Streaming chat API
- `src/components/Message.tsx` - Link parsing for S3 URLs (HTML entity decoding needed)
- `config-react.xml` - LTI configuration (updated with trailing slashes)
- `src/app/page.tsx` - Main page (now uses URL parameters for LTI context)
- `docs/` - Project documentation folder

## Development Workflow

### Local Development
```bash
npm run dev    # localhost:3000
npm run build  # Test production build
```

### Deploy to Production
**IMPORTANT: Follow these steps in exact order to avoid port conflicts**

```bash
# 1. Test build locally first
npm run build

# 2. Commit and push changes
git add .
git commit -m "Your commit message"
git push origin main

# 3. Sync files to server
rsync -avz --exclude='.git' --exclude='node_modules' --exclude='.next' \
  -e "ssh -i uiuc-chat-dev.pem" \
  /Users/aryansachdev/canvasbot/ \
  ubuntu@141.142.216.30:/home/ubuntu/canvasbot/

# 4. Deploy on server (run as single command block)
ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 "
cd canvasbot && 
source ~/.nvm/nvm.sh && 
nvm use 18 && 
npm install && 
npm run build && 
sudo fuser -k 3001/tcp || true && 
sleep 2 && 
PORT=3001 nohup npm run start > server.log 2>&1 &
"

# 5. Verify deployment
sleep 5
ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 "cd canvasbot && tail -10 server.log"
curl -I https://canvas.ncsa.ai/api/lti/

# 6. Push to center repository
git push center main
```

### Troubleshooting Deployment Issues

**If port 3001 is still in use:**
```bash
# Force kill all processes on port 3001
ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 "sudo fuser -k 3001/tcp || true"

# Check what's using the port
ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 "sudo lsof -i :3001"

# Find and kill node processes
ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 "ps aux | grep node"
```

**If server won't start:**
```bash
# Check server logs
ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 "cd canvasbot && tail -20 server.log"

# Restart with verbose output
ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 "cd canvasbot && PORT=3001 npm run start"
```

**Server Status Commands:**
```bash
# Check if server is running
curl -I https://canvas.ncsa.ai/api/lti/

# View recent logs
ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 "cd canvasbot && tail -20 server.log"

# Monitor live logs
ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 "cd canvasbot && tail -f server.log"
```

## Project-Specific Guidelines

### Canvas LTI Integration (FIXED)
- LTI endpoint now serves HTML directly instead of redirecting
- Includes iframe-compatible headers: `X-Frame-Options: SAMEORIGIN`
- Client-side navigation with Illinois-branded loading page
- URL parameters used for LTI context passing

### Message Component Link Parsing (REMAINING ISSUE)
- `parseMarkdownLinks()` converts AWS S3 URLs to blue overlay rectangles
- **Issue**: HTML entities (`&amp;`) in URLs from UIUC API cause failures
- **Todo**: Add HTML entity decoding before using URLs
- **Note**: Links may work when launched from Canvas (not locally)

### Environment Variables
```bash
UIUC_API_KEY=uc_129beea242eb46929d2d21bbe93469b3
UIUC_API_URL=https://uiuc.chat/api/chat-api/chat
```

### Debugging and Testing
- Server logs: `ssh -i uiuc-chat-dev.pem ubuntu@141.142.216.30 "cd canvasbot && tail -20 server.log"`
- Test LTI endpoint: `curl -X POST https://canvas.ncsa.ai/api/lti/ -d "context_id=test"`
- Production server: ubuntu@141.142.216.30:/home/ubuntu/canvasbot/

## Workflow Recommendations

### Task Planning
- Use `@docs/` references for project documentation
- Break complex features into checkboxes: `[ ]` incomplete, `[x]` complete
- Use `/clear` for new tasks instead of compacting context

### Architecture Planning
1. **Brainstorm** - Generate ideas and approaches
2. **Design** - Create detailed architecture documentation
3. **Plan** - Develop step-by-step implementation
4. **Implement** - Execute with frequent testing

### Debugging Approach
- Check server logs: `tail -20 server.log`
- Test endpoints: `curl -X POST https://canvas.ncsa.ai/api/lti/`
- Monitor LTI requests: `grep "LTI Launch" server.log`
- Verify environment: `cat .env | grep UIUC_API_KEY`

### Recent Achievements (Dec 2024)
- [x] Fixed Canvas LTI white screen issue with iframe-compatible approach
- [x] Replaced problematic NextResponse.redirect() with direct HTML response
- [x] Added proper iframe headers for Canvas compatibility
- [x] Implemented Illinois-branded loading page for smooth transitions
- [x] Updated Canvas LTI configuration with trailing slash URLs
- [x] Deployed successfully to production server
- [x] Committed changes to both personal and Center repos

### Remaining Items
- [ ] Fix S3 link HTML entity decoding issue in Message component
- [ ] Test full user journey from Canvas LTI launch
- [ ] Verify document links work in production Canvas environment