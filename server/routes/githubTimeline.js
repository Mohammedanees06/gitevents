import express from "express";
import axios from "axios";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();




console.log('🔍 Debugging Email Credentials...\n');

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_USER type:', typeof process.env.EMAIL_USER);
console.log('EMAIL_USER length:', process.env.EMAIL_USER?.length);

console.log('\nEMAIL_PASS exists:', !!process.env.EMAIL_PASS);
console.log('EMAIL_PASS type:', typeof process.env.EMAIL_PASS);
console.log('EMAIL_PASS length:', process.env.EMAIL_PASS?.length);


if (process.env.EMAIL_PASS) {
  const pass = process.env.EMAIL_PASS;
  console.log('EMAIL_PASS preview:', `${pass.substring(0, 2)}...${pass.substring(pass.length - 2)}`);
  
  // Check for common issues
  if (pass.includes(' ')) {
    console.log('⚠️  WARNING: EMAIL_PASS contains spaces - remove them!');
  }
  
  if (pass.length !== 16) {
    console.log('⚠️  WARNING: EMAIL_PASS should be exactly 16 characters');
    console.log('   Current length:', pass.length);
  }
} else {
  console.log('❌ EMAIL_PASS is empty or undefined!');
}

console.log('\nDEFAULT_EMAIL:', process.env.DEFAULT_EMAIL);

// Testing the auth object that would be created
const auth = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
};

console.log('\n📧 Auth object that will be used:');
console.log('user:', auth.user);
console.log('pass defined:', !!auth.pass);
console.log('pass length:', auth.pass?.length || 0);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

transporter.verify(function(error, success) {
   if (error) {
        console.log("❌ Email transporter error:", error);
   } else {
        console.log("✅ Server is ready to take our messages");
   }
});

router.get("/send-test-email", async (req, res) => {
  try {
    console.log("🧪 Sending test email...");
    console.log("From:", process.env.EMAIL_USER);
    console.log("To:", process.env.DEFAULT_EMAIL);
    
    const info = await transporter.sendMail({
      from: `"GitHub Updates" <${process.env.EMAIL_USER}>`,
      to: process.env.DEFAULT_EMAIL,
      subject: "Test Email - " + new Date().toISOString(),
      text: "If you get this, Nodemailer works!"
    });
    
    console.log("✅ Test email sent successfully!");
    console.log("Message ID:", info.messageId);
    res.json({ ok: true, messageId: info.messageId });
  } catch (err) {
    console.error("❌ Email error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get("/timeline", async (req, res) => {
  try {
    const userEmail = req.query.email || process.env.DEFAULT_EMAIL;

    if (!userEmail) {
      return res.status(400).json({ error: "No email provided" });
    }

    console.log("📡 Fetching GitHub timeline...");

    // Fetching GitHub timeline
    const { data } = await axios.get("https://api.github.com/events");
    
    console.log(`📊 Fetched ${data.length} GitHub events`);
    
    const summary = data.slice(0, 3).map(event => {
      return `${event.type} — ${event.repo.name} by ${event.actor.login} (${event.created_at})`;
    });

    console.log("📧 Sending email to:", userEmail);

    // Sending email
    const info = await transporter.sendMail({
      from: `"GitHub Updates" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your GitHub Updates",
      text: summary.join("\n"),
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);

    res.json({ ok: true, email: userEmail, summary, messageId: info.messageId });
  } catch (error) {
    console.error("❌ Error fetching/sending:", error);
    res.status(500).json({ error: "Failed to fetch GitHub timeline" });
  }
});

router.post("/timeline", async (req, res) => {
  try {
    const userEmail = req.body.email || process.env.DEFAULT_EMAIL;

    if (!userEmail) {
      return res.status(400).json({ error: "No email provided" });
    }

    console.log("📡 Fetching GitHub timeline...");

    // Fetching GitHub timeline
    const { data } = await axios.get("https://api.github.com/events");
    
    console.log(`📊 Fetched ${data.length} GitHub events`);
    
    const summary = data.slice(0, 3).map(event => {
      return `${event.type} — ${event.repo.name} by ${event.actor.login} (${event.created_at})`;
    });

    console.log("📧 Sending email to:", userEmail);

    // Sending email
    const info = await transporter.sendMail({
      from: `"GitHub Updates" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Your GitHub Updates",
      text: summary.join("\n"),
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);

    res.json({ ok: true, email: userEmail, summary, messageId: info.messageId });
  } catch (error) {
    console.error("❌ Error fetching/sending:", error);
    res.status(500).json({ error: "Failed to fetch GitHub timeline" });
  }
});

export default router;






































// import express from "express";
// import axios from "axios";
// import nodemailer from "nodemailer";
// import dotenv from 'dotenv';
// dotenv.config();

// const router = express.Router();

// // Create email HTML template function
// function createEmailHTML(events) {
//   const eventsByType = {};
  
//   // Group events by type for better organization
//   events.forEach(event => {
//     if (!eventsByType[event.type]) {
//       eventsByType[event.type] = [];
//     }
//     eventsByType[event.type].push(event);
//   });

//   const eventRows = events.map(event => {
//     const eventTypeColor = getEventTypeColor(event.type);
//     const timeAgo = getTimeAgo(new Date(event.created_at));
    
//     return `
//       <div class="event-item">
//         <div class="event-header">
//           <span class="event-type" style="background-color: ${eventTypeColor};">
//             ${getEventIcon(event.type)} ${event.type.replace('Event', '')}
//           </span>
//           <span class="event-time">${timeAgo}</span>
//         </div>
//         <div class="event-details">
//           <strong class="repo-name">${event.repo.name}</strong>
//           <div class="event-actor">by ${event.actor.login}</div>
//           ${getEventDescription(event)}
//         </div>
//       </div>
//     `;
//   }).join('');

//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>GitHub Updates</title>
//         <style>
//             body {
//                 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//                 line-height: 1.6;
//                 color: #24292f;
//                 background-color: #f6f8fa;
//                 margin: 0;
//                 padding: 20px;
//             }
//             .container {
//                 max-width: 700px;
//                 margin: 0 auto;
//                 background: white;
//                 border-radius: 12px;
//                 box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//                 overflow: hidden;
//             }
//             .header {
//                 background: linear-gradient(135deg, #24292f 0%, #40464d 100%);
//                 color: white;
//                 padding: 30px 24px;
//                 text-align: center;
//             }
//             .header h1 {
//                 margin: 0;
//                 font-size: 26px;
//                 font-weight: 600;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 gap: 10px;
//             }
//             .github-icon {
//                 font-size: 28px;
//             }
//             .header .subtitle {
//                 margin: 8px 0 0 0;
//                 opacity: 0.9;
//                 font-size: 14px;
//             }
//             .content {
//                 padding: 24px;
//             }
//             .stats {
//                 background: #f6f8fa;
//                 border-radius: 8px;
//                 padding: 16px;
//                 margin-bottom: 24px;
//                 text-align: center;
//             }
//             .stats-number {
//                 font-size: 24px;
//                 font-weight: bold;
//                 color: #0969da;
//                 display: block;
//             }
//             .stats-label {
//                 font-size: 14px;
//                 color: #656d76;
//                 margin-top: 4px;
//             }
//             .event-item {
//                 border: 1px solid #d1d9e0;
//                 border-radius: 8px;
//                 margin-bottom: 16px;
//                 padding: 16px;
//                 background: #ffffff;
//                 transition: box-shadow 0.2s ease;
//             }
//             .event-item:hover {
//                 box-shadow: 0 2px 8px rgba(0,0,0,0.1);
//             }
//             .event-header {
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;
//                 margin-bottom: 12px;
//             }
//             .event-type {
//                 display: inline-flex;
//                 align-items: center;
//                 gap: 6px;
//                 padding: 4px 12px;
//                 border-radius: 20px;
//                 color: white;
//                 font-size: 12px;
//                 font-weight: 600;
//                 text-transform: uppercase;
//                 letter-spacing: 0.5px;
//             }
//             .event-time {
//                 font-size: 12px;
//                 color: #656d76;
//                 background: #f6f8fa;
//                 padding: 4px 8px;
//                 border-radius: 4px;
//             }
//             .event-details {
//                 padding-left: 8px;
//             }
//             .repo-name {
//                 color: #0969da;
//                 font-size: 16px;
//                 text-decoration: none;
//                 font-weight: 600;
//             }
//             .event-actor {
//                 color: #656d76;
//                 font-size: 14px;
//                 margin: 4px 0 8px 0;
//             }
//             .event-description {
//                 font-size: 14px;
//                 color: #24292f;
//                 margin-top: 8px;
//                 padding: 8px 12px;
//                 background: #f6f8fa;
//                 border-radius: 6px;
//                 border-left: 3px solid #0969da;
//             }
//             .footer {
//                 background: #f6f8fa;
//                 padding: 20px 24px;
//                 text-align: center;
//                 border-top: 1px solid #d1d9e0;
//             }
//             .footer-text {
//                 font-size: 12px;
//                 color: #656d76;
//                 margin: 0;
//             }
//             .github-link {
//                 color: #0969da;
//                 text-decoration: none;
//                 font-weight: 600;
//             }
//             @media (max-width: 600px) {
//                 body { padding: 10px; }
//                 .container { margin: 0; border-radius: 8px; }
//                 .header { padding: 20px 16px; }
//                 .content { padding: 16px; }
//                 .event-header { flex-direction: column; align-items: flex-start; gap: 8px; }
//             }
//         </style>
//     </head>
//     <body>
//         <div class="container">
//             <div class="header">
//                 <h1><span class="github-icon">🐙</span> GitHub Timeline Updates</h1>
//                 <div class="subtitle">Latest activity from the GitHub community</div>
//             </div>
            
//             <div class="content">
//                 <div class="stats">
//                     <span class="stats-number">${events.length}</span>
//                     <div class="stats-label">Recent Events</div>
//                 </div>
                
//                 <div class="events-list">
//                     ${eventRows}
//                 </div>
//             </div>
            
//             <div class="footer">
//                 <p class="footer-text">
//                     Updates delivered automatically • 
//                     <a href="https://github.com" class="github-link">View on GitHub</a>
//                 </p>
//                 <p class="footer-text" style="margin-top: 8px;">
//                     Generated on ${new Date().toLocaleString()}
//                 </p>
//             </div>
//         </div>
//     </body>
//     </html>
//   `;
// }

// // Helper functions for event formatting
// function getEventTypeColor(eventType) {
//   const colors = {
//     'PushEvent': '#28a745',
//     'PullRequestEvent': '#6f42c1',
//     'IssuesEvent': '#d73a49',
//     'CreateEvent': '#0366d6',
//     'DeleteEvent': '#ffa500',
//     'WatchEvent': '#f1c232',
//     'ForkEvent': '#0366d6',
//     'CommitCommentEvent': '#586069',
//     'ReleaseEvent': '#28a745',
//     'PublicEvent': '#28a745'
//   };
//   return colors[eventType] || '#586069';
// }

// function getEventIcon(eventType) {
//   const icons = {
//     'PushEvent': '📤',
//     'PullRequestEvent': '🔀',
//     'IssuesEvent': '🐛',
//     'CreateEvent': '🎉',
//     'DeleteEvent': '🗑️',
//     'WatchEvent': '⭐',
//     'ForkEvent': '🍴',
//     'CommitCommentEvent': '💬',
//     'ReleaseEvent': '🚀',
//     'PublicEvent': '🌟'
//   };
//   return icons[eventType] || '📝';
// }

// function getEventDescription(event) {
//   let description = '';
  
//   switch (event.type) {
//     case 'PushEvent':
//       const commitCount = event.payload.commits?.length || 0;
//       description = `Pushed ${commitCount} commit${commitCount !== 1 ? 's' : ''} to ${event.payload.ref?.replace('refs/heads/', '') || 'branch'}`;
//       break;
//     case 'PullRequestEvent':
//       description = `${event.payload.action} pull request #${event.payload.number}`;
//       if (event.payload.pull_request?.title) {
//         description += `: ${event.payload.pull_request.title}`;
//       }
//       break;
//     case 'IssuesEvent':
//       description = `${event.payload.action} issue #${event.payload.issue?.number || ''}`;
//       if (event.payload.issue?.title) {
//         description += `: ${event.payload.issue.title}`;
//       }
//       break;
//     case 'CreateEvent':
//       description = `Created ${event.payload.ref_type} ${event.payload.ref || ''}`;
//       break;
//     case 'WatchEvent':
//       description = 'Started watching this repository';
//       break;
//     case 'ForkEvent':
//       description = `Forked to ${event.payload.forkee?.full_name || ''}`;
//       break;
//     default:
//       description = `Performed ${event.type.replace('Event', '').toLowerCase()} action`;
//   }
  
//   return description ? `<div class="event-description">${description}</div>` : '';
// }

// function getTimeAgo(date) {
//   const now = new Date();
//   const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
//   if (diffInMinutes < 1) return 'Just now';
//   if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) return `${diffInHours}h ago`;
  
//   const diffInDays = Math.floor(diffInHours / 24);
//   if (diffInDays < 7) return `${diffInDays}d ago`;
  
//   return date.toLocaleDateString();
// }

// // Initialize transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Verify transporter
// transporter.verify(function(error, success) {
//    if (error) {
//         console.log("Email transporter error:", error);
//    } else {
//         console.log("Server is ready to take our messages");
//    }
// });

// // Test email route
// router.get("/send-test-email", async (req, res) => {
//   try {
//     console.log("Sending test email...");
    
//     const testEvents = [
//       {
//         type: 'PushEvent',
//         repo: { name: 'test/repo' },
//         actor: { login: 'testuser' },
//         created_at: new Date().toISOString(),
//         payload: { commits: [{}, {}], ref: 'refs/heads/main' }
//       }
//     ];
    
//     const htmlContent = createEmailHTML(testEvents);
    
//     const info = await transporter.sendMail({
//       from: `"GitHub Updates" <${process.env.EMAIL_USER}>`,
//       to: process.env.DEFAULT_EMAIL,
//       subject: "Test Email - GitHub Updates",
//       html: htmlContent,
//       text: "Test email - if you see this, the email system is working!"
//     });
    
//     console.log("✅ Test email sent successfully!");
//     res.json({ ok: true, messageId: info.messageId });
//   } catch (err) {
//     console.error("❌ Email error:", err.message);
//     res.status(500).json({ ok: false, error: err.message });
//   }
// });

// // Main timeline route (GET)
// router.get("/timeline", async (req, res) => {
//   try {
//     const userEmail = req.query.email || process.env.DEFAULT_EMAIL;
//     const limit = parseInt(req.query.limit) || 10;

//     if (!userEmail) {
//       return res.status(400).json({ error: "No email provided" });
//     }

//     console.log("📡 Fetching GitHub timeline...");

//     const { data } = await axios.get("https://api.github.com/events");
    
//     console.log(`📊 Fetched ${data.length} GitHub events`);
    
//     // Take only the requested number of events
//     const events = data.slice(0, limit);
    
//     // Create HTML email content
//     const htmlContent = createEmailHTML(events);
    
//     // Create plain text fallback
//     const textContent = events.map(event => {
//       const timeAgo = getTimeAgo(new Date(event.created_at));
//       return `${getEventIcon(event.type)} ${event.type.replace('Event', '')} — ${event.repo.name} by ${event.actor.login} (${timeAgo})`;
//     }).join('\n\n');

//     console.log("📧 Sending enhanced email to:", userEmail);

//     const info = await transporter.sendMail({
//       from: `"GitHub Updates" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject: `🐙 GitHub Timeline Updates (${events.length} events)`,
//       html: htmlContent,
//       text: textContent,
//     });

//     console.log(" Enhanced email sent successfully!");

//     res.json({ 
//       ok: true, 
//       email: userEmail, 
//       eventsCount: events.length,
//       messageId: info.messageId 
//     });
//   } catch (error) {
//     console.error(" Error fetching/sending:", error);
//     res.status(500).json({ error: "Failed to fetch GitHub timeline" });
//   }
// });

// // Main timeline route (POST)
// router.post("/timeline", async (req, res) => {
//   try {
//     const userEmail = req.body.email || process.env.DEFAULT_EMAIL;
//     const limit = parseInt(req.body.limit) || 10;

//     if (!userEmail) {
//       return res.status(400).json({ error: "No email provided" });
//     }

//     console.log("📡 Fetching GitHub timeline...");

//     const { data } = await axios.get("https://api.github.com/events");
    
//     console.log(`📊 Fetched ${data.length} GitHub events`);
    
//     const events = data.slice(0, limit);
//     const htmlContent = createEmailHTML(events);
    
//     const textContent = events.map(event => {
//       const timeAgo = getTimeAgo(new Date(event.created_at));
//       return `${getEventIcon(event.type)} ${event.type.replace('Event', '')} — ${event.repo.name} by ${event.actor.login} (${timeAgo})`;
//     }).join('\n\n');

//     console.log("📧 Sending enhanced email to:", userEmail);

//     const info = await transporter.sendMail({
//       from: `"GitHub Updates" <${process.env.EMAIL_USER}>`,
//       to: userEmail,
//       subject: `🐙 GitHub Timeline Updates (${events.length} events)`,
//       html: htmlContent,
//       text: textContent,
//     });

//     console.log("✅ Enhanced email sent successfully!");

//     res.json({ 
//       ok: true, 
//       email: userEmail, 
//       eventsCount: events.length,
//       messageId: info.messageId 
//     });
//   } catch (error) {
//     console.error("❌ Error fetching/sending:", error);
//     res.status(500).json({ error: "Failed to fetch GitHub timeline" });
//   }
// });

// export default router;
























