export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Support either JSON body or form post
    const contentType = req.headers["content-type"] || "";
    let email = "";

    if (contentType.includes("application/json")) {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      email = (body && body.email) || "";
    } else {
      // x-www-form-urlencoded or multipart/form-data
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const raw = Buffer.concat(chunks).toString("utf8");
      const m = /email=([^&]+)/.exec(raw);
      email = m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
    }

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email required" });
    }

    // Send via Resend API
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Start with Resend’s default sender. Swap to your domain later once verified.
        from: "Resonance <onboarding@resend.dev>",
        to: "devin.bostick@codesintelligence.com",
        subject: "New site subscriber",
        text: `Signup: ${email}`,
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(502).json({ error: "Resend error", details: errText });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: String(err) });
  }
}
