import { NextResponse } from "next/server";

type CspViolationReport = {
  blockedUri: string | null;
  columnNumber: number | null;
  disposition: string | null;
  documentUri: string | null;
  effectiveDirective: string | null;
  lineNumber: number | null;
  originalPolicy: string | null;
  referrer: string | null;
  sourceFile: string | null;
  statusCode: number | null;
  violatedDirective: string | null;
};

function readString(value: unknown) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function normalizeSingleReport(report: unknown): CspViolationReport | null {
  if (!report || typeof report !== "object") {
    return null;
  }

  const payload = report as Record<string, unknown>;

  return {
    blockedUri: readString(payload["blocked-uri"] ?? payload.blockedUri),
    columnNumber: readNumber(payload["column-number"] ?? payload.columnNumber),
    disposition: readString(payload.disposition),
    documentUri: readString(payload["document-uri"] ?? payload.documentUri),
    effectiveDirective: readString(
      payload["effective-directive"] ?? payload.effectiveDirective,
    ),
    lineNumber: readNumber(payload["line-number"] ?? payload.lineNumber),
    originalPolicy: readString(payload["original-policy"] ?? payload.originalPolicy),
    referrer: readString(payload.referrer),
    sourceFile: readString(payload["source-file"] ?? payload.sourceFile),
    statusCode: readNumber(payload["status-code"] ?? payload.statusCode),
    violatedDirective: readString(
      payload["violated-directive"] ?? payload.violatedDirective,
    ),
  };
}

function normalizeCspReports(payload: unknown): CspViolationReport[] {
  if (Array.isArray(payload)) {
    return payload.flatMap((entry) => normalizeCspReports(entry));
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;

  if ("csp-report" in record) {
    const normalized = normalizeSingleReport(record["csp-report"]);
    return normalized ? [normalized] : [];
  }

  if ("body" in record) {
    const normalized = normalizeSingleReport(record.body);
    return normalized ? [normalized] : [];
  }

  const normalized = normalizeSingleReport(record);
  return normalized ? [normalized] : [];
}

async function parseReportBody(request: Request) {
  const rawBody = await request.text();

  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    return rawBody;
  }
}

export async function POST(request: Request) {
  const payload = await parseReportBody(request);
  const reports = normalizeCspReports(payload);

  if (reports.length > 0) {
    console.warn("[security] csp-report", JSON.stringify(reports));
  } else if (typeof payload === "string" && payload.length > 0) {
    console.warn("[security] csp-report", payload);
  }

  return new NextResponse(null, {
    headers: {
      "Cache-Control": "no-store",
    },
    status: 204,
  });
}
