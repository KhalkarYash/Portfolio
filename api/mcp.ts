import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

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

const createServer = () => {
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

const createTransport = async () => {
  const transport = new WebStandardStreamableHTTPServerTransport({
    enableJsonResponse: true,
  });
  const server = createServer();
  await server.connect(transport);
  return transport;
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") {
    return withCors(new Response(null, { status: 204 }));
  }

  const transport = await createTransport();
  const response = await transport.handleRequest(request);
  return withCors(response);
}
