import { middleware } from "../middleware";
import { NextRequest } from "next/server";

const mockRedirect = jest.fn();
const mockNext = jest.fn();

jest.mock("next/server", () => {
  return {
    ...jest.requireActual("next/server"),
    NextResponse: {
      redirect: (url: URL) => {
        mockRedirect(url.toString());
        return {
          status: 307,
          headers: new Headers({ location: url.toString() }),
          cookies: new Map(),
        };
      },
      next: () => {
        mockNext();
        return {
          status: 200,
          headers: new Headers(),
          cookies: new Map(),
        };
      },
    },
  };
});

// Create mock request
function createMockRequest(path: string, cookieValue?: string): NextRequest {
  const url = `http://localhost:3000${path}`;
  return {
    nextUrl: new URL(url),
    url,
    headers: {
      get: jest.fn().mockImplementation((name) => {
        if (name.toLowerCase() === "cookie") {
          return cookieValue || "";
        }
        return null;
      }),
    },
  } as unknown as NextRequest;
}

describe("middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows access to public paths", async () => {
    const publicPaths = ["/", "/login", "/register"];

    for (const path of publicPaths) {
      const request = createMockRequest(path);
      await middleware(request);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRedirect).not.toHaveBeenCalled();
      mockNext.mockClear();
    }
  });

  it("redirects unauthenticated user from protected route", async () => {
    const request = createMockRequest("/admin");
    await middleware(request);
    expect(mockRedirect).toHaveBeenCalledWith("http://localhost:3000/log-in");
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("allows authenticated admin to access /admin", async () => {
    const request = createMockRequest("/admin", "user_role=admin");
    await middleware(request);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  it("redirects customer trying to access /admin", async () => {
    const request = createMockRequest("/admin", "user_role=customer");
    await middleware(request);
    expect(mockRedirect).toHaveBeenCalledWith("http://localhost:3000/log-in");
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("redirects admin trying to access customer route", async () => {
    const request = createMockRequest(
      "/customer/my-account",
      "user_role=admin"
    );
    await middleware(request);
    expect(mockRedirect).toHaveBeenCalledWith("http://localhost:3000/admin");
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("allows customer to access /customer/my-account", async () => {
    const request = createMockRequest(
      "/customer/my-account",
      "user_role=customer"
    );
    await middleware(request);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
