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

const createServer = async () => {
  const { McpServer } = await import("@modelcontextprotocol/sdk/server/mcp.js");
  const server = new McpServer({
    name: "yash-khalkar-portfolio",
    version: "1.0.0"
  });

  server.registerTool(
    "get_portfolio",
    {
      title: "Get Yash Khalkar Portfolio",
      description: "Get Yash Khalkar's professional profile, skills, and canonical portfolio links.",
      inputSchema: {}
    },
    async () => ({
      content: [{ type: "text", text: JSON.stringify(portfolio) }],
      structuredContent: portfolio
    })
  );

  return server;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Accept, mcp-session-id, mcp-protocol-version, Last-Event-ID",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version"
};

const withCors = (response: Response) => {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};

const jsonError = (status: number, code: string, message: string, hint: string) =>
  withCors(Response.json({
    error: { code, message, hint }
  }, { status }));

const createTransport = async () => {
  const { WebStandardStreamableHTTPServerTransport } = await import("@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js");
  const transport = new WebStandardStreamableHTTPServerTransport({
    enableJsonResponse: true,
  });
  const server = await createServer();
  await server.connect(transport);
  return transport;
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return withCors(new Response(null, { status: 204 }));
  }

  if (request.method === "GET" && !request.headers.get("mcp-session-id")) {
    return withCors(new Response(
      "Yash Khalkar MCP server. Use Streamable HTTP POST requests with the MCP protocol.",
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    ));
  }

  if (request.method !== "POST" && request.method !== "GET") {
    return jsonError(405, "METHOD_NOT_ALLOWED", "The MCP endpoint only accepts GET, POST, and OPTIONS requests.", "Use POST for JSON-RPC MCP messages or GET for endpoint discovery.");
  }

  if (request.method === "POST") {
    try {
      await request.clone().json();
    } catch {
      return jsonError(400, "INVALID_JSON", "The request body is not valid JSON.", "Send a JSON-RPC 2.0 object with Content-Type: application/json.");
    }
  }

  const transport = await createTransport();
  const response = await transport.handleRequest(request);
  return withCors(response);
}
