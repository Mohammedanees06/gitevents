import nodemailer from "nodemailer";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendGitHubTimelineEmail(toEmail) {
  try {
    // Fetch GitHub events
    const { data } = await axios.get("https://api.github.com/events");

    // Build HTML summary with links
    const htmlSummary = data.slice(0, 5).map(event => {
      const repoLink = `https://github.com/${event.repo.name}`;
      const actorLink = `https://github.com/${event.actor.login}`;
      return `<li><b>${event.type}</b> — <a href="${repoLink}" target="_blank">${event.repo.name}</a> by <a href="${actorLink}" target="_blank">${event.actor.login}</a> (${event.created_at})</li>`;
    }).join("");

    const textSummary = data.slice(0, 5).map(event => {
      return `${event.type} — ${event.repo.name} by ${event.actor.login} (${event.created_at})`;
    }).join("\n");

    // Send email
    const info = await transporter.sendMail({
      from: `"GitHub Updates" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your GitHub Updates",
      text: textSummary,       // fallback for plain text
      html: `<h3>Your Latest GitHub Events</h3><ul>${htmlSummary}</ul>`,
    });

    console.log("✅ GitHub timeline email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Failed to send GitHub timeline email:", err.message);
    return false;
  }
}

export default transporter;
