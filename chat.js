// api/chat.js — Compatible Cloudflare Pages Functions
// Ce fichier relaie les appels vers l'API Anthropic.
// La clé ANTHROPIC_API_KEY est stockée dans les variables d'environnement
// Cloudflare Pages — elle n'est jamais exposée côté client.

export async function onRequestPost(context) {

  const apiKey = context.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Clé API manquante côté serveur" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const body = await context.request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Erreur de connexion à l'API" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Gère les requêtes OPTIONS (CORS preflight)
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}
