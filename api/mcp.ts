const portfolio = {
  name: "Yash Khalkar",
  role: "Backend-focused full-stack software engineer",
  location: "Nashik, India",
  skills: ["TypeScript", "React", "Node.js", "REST APIs", "PostgreSQL", "MongoDB", "AWS", "Docker"],
  links: {
    home: "https://yashkhalkar.vercel.app/",
    projects: "https://yashkhalkar.vercel.app/projects",
    contact: "https://yashkhalkar.vercel.app/contact"
  }
};

const jsonRpc = (id: unknown, result: unknown) => ({ jsonrpc: "2.0", id, result });
const error = (id: unknown, code: number, message: string) => ({ jsonrpc: "2.0", id, error: { code, message } });

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "GET") {
    return new Response("Yash Khalkar MCP server. Send JSON-RPC requests with POST.", {
      headers: { "Content-Type": "text/plain; charset=utf-8", Allow: "GET, POST, OPTIONS" }
    });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: { Allow: "GET, POST, OPTIONS" } });
  }

  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: { Allow: "GET, POST, OPTIONS" } });
  }

  let message: { id?: unknown; method?: string };
  try {
    message = await request.json();
  } catch {
    return Response.json(error(null, -32700, "Invalid JSON"), { status: 400 });
  }

  if (message.method === "initialize") {
    return Response.json(jsonRpc(message.id, {
      protocolVersion: "2025-06-18",
      capabilities: { tools: {} },
      serverInfo: { name: "yash-khalkar-portfolio", version: "1.0.0" }
    }), { headers: { "MCP-Protocol-Version": "2025-06-18" } });
  }

  if (message.method === "tools/list") {
    return Response.json(jsonRpc(message.id, {
      tools: [{
        name: "get_portfolio",
        description: "Get Yash Khalkar's professional profile, skills, and canonical portfolio links.",
        inputSchema: { type: "object", properties: {}, additionalProperties: false }
      }]
    }));
  }

  if (message.method === "tools/call") {
    return Response.json(jsonRpc(message.id, {
      content: [{ type: "text", text: JSON.stringify(portfolio) }],
      structuredContent: portfolio,
      isError: false
    }));
  }

  return Response.json(error(message.id, -32601, "Method not found"), { status: 404 });
}
