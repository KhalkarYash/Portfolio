import { IncomingMessage, ServerResponse } from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Accept, mcp-session-id, mcp-protocol-version, Last-Event-ID",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version"
};

const setCorsHeaders = (response: ServerResponse) => {
  Object.entries(corsHeaders).forEach(([key, value]) => response.setHeader(key, value));
};

const jsonError = (response: ServerResponse, status: number, code: string, message: string, hint: string) => {
  setCorsHeaders(response);
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify({ error: { code, message, hint } }));
};

const readJsonBody = async (request: IncomingMessage): Promise<unknown> => {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
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

const discovery = (response: ServerResponse) => {
  setCorsHeaders(response);
  response.statusCode = 200;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify({
    name: "Yash Khalkar MCP server",
    transport: "Streamable HTTP",
    endpoint: "https://yashkhalkar.vercel.app/.well-known/mcp",
    instruction: "Use POST requests with MCP JSON-RPC messages."
  }));
};

export default async function handler(request: IncomingMessage, response: ServerResponse): Promise<void> {
  setCorsHeaders(response);

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  if (request.method === "GET" && !request.headers["mcp-session-id"]) {
    discovery(response);
    return;
  }

  if (request.method !== "POST" && request.method !== "GET") {
    jsonError(response, 405, "METHOD_NOT_ALLOWED", "The MCP endpoint only accepts GET, POST, and OPTIONS requests.", "Use POST for JSON-RPC MCP messages or GET for endpoint discovery.");
    return;
  }

  let parsedBody: unknown;
  if (request.method === "POST") {
    try {
      parsedBody = await readJsonBody(request);
    } catch {
      jsonError(response, 400, "INVALID_JSON", "The request body is not valid JSON.", "Send a JSON-RPC 2.0 object with Content-Type: application/json.");
      return;
    }
  }

  const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true });
  await createServer().connect(transport);
  await transport.handleRequest(request, response, parsedBody);
}
